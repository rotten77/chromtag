export interface Tag { key: string; label: string }
export interface TagSpan extends Tag { start: number; end: number }
export interface Folder {
  id: string;
  title: string;
  label: string;
  parentId?: string;
  order: number;
  end: number;
  editable: boolean;
}
export interface Bookmark {
  id: string;
  title: string;
  displayTitle: string;
  url: string;
  parentId?: string;
  folderName: string;
  folderOrder: number;
  tags: Tag[];
  searchFields: SearchField[];
}
export interface SearchField { text: string; boundaries?: Set<number> }
export interface Filters { query: string; tags: ReadonlySet<string>; folderId: string | null }
export interface Model {
  bookmarks: Bookmark[];
  folders: Folder[];
  folderById: Map<string, Folder>;
  tags: Tag[];
}

export const normalize = (value: string): string => value.normalize('NFC').toLowerCase().normalize('NFC');
const segmenter = new Intl.Segmenter('und', { granularity: 'grapheme' });

export function phraseMatches(field: SearchField, query: string): boolean {
  let start = field.text.indexOf(query);
  if (start < 0) return false;
  // Segment only fields containing a candidate. Cache boundaries in popup memory.
  field.boundaries ??= new Set([field.text.length, ...Array.from(segmenter.segment(field.text), part => part.index)]);
  while (start >= 0) {
    if (field.boundaries.has(start) && field.boundaries.has(start + query.length)) return true;
    start = field.text.indexOf(query, start + 1);
  }
  return false;
}

export function filterBookmarks(model: Model, filters: Filters): Bookmark[] {
  const query = normalize(filters.query.trim());
  const folder = filters.folderId ? model.folderById.get(filters.folderId) : undefined;
  return model.bookmarks.filter(bookmark => {
    if (filters.folderId && (!folder || bookmark.folderOrder < folder.order || bookmark.folderOrder >= folder.end)) return false;
    for (const key of filters.tags) if (!bookmark.tags.some(tag => tag.key === key)) return false;
    return !query || bookmark.searchFields.some(field => phraseMatches(field, query));
  });
}

export function codePointOrder(a: string, b: string): number {
  const left = Array.from(a, c => c.codePointAt(0)!);
  const right = Array.from(b, c => c.codePointAt(0)!);
  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    if (left[i] !== right[i]) return left[i] - right[i];
  }
  return left.length - right.length;
}

export function parseTags(title: string): TagSpan[] {
  return Array.from(title.matchAll(/(?:^|\s)#([^\s#]+)/gu), match => {
    const start = match.index + match[0].indexOf('#');
    return { start, end: start + match[1].length + 1, label: match[1], key: normalize(match[1]) };
  });
}

export function withoutTags(title: string, spans = parseTags(title)): string {
  let result = '';
  let end = 0;
  for (const span of spans) { result += title.slice(end, span.start); end = span.end; }
  return (result + title.slice(end)).trim();
}

export function buildModel(tree: chrome.bookmarks.BookmarkTreeNode[]): Model {
  const bookmarks: Bookmark[] = [];
  const folders: Folder[] = [];
  const folderById = new Map<string, Folder>();
  const tags = new Map<string, Tag>();
  let order = 0;
  type Frame = { node: chrome.bookmarks.BookmarkTreeNode; parent?: Folder; exit?: Folder };
  const stack: Frame[] = tree.toReversed().map(node => ({ node }));
  while (stack.length) {
    const { node, parent, exit } = stack.pop()!;
    if (exit) { exit.end = order; continue; }
    if (node.url !== undefined) {
      if (/^\s*javascript:/iu.test(node.url)) continue;
      const spans = parseTags(node.title);
      const uniqueTags = new Map(spans.map(span => [span.key, { key: span.key, label: span.label }]));
      for (const span of spans) if (!tags.has(span.key)) tags.set(span.key, { key: span.key, label: span.label });
      bookmarks.push({ id: node.id, title: node.title, displayTitle: withoutTags(node.title, spans), url: node.url,
        parentId: parent?.id, folderName: parent?.title ?? '', folderOrder: parent?.order ?? -1,
        tags: [...uniqueTags.values()], searchFields: [node.title, parent?.title ?? '', node.url].map(text => ({ text: normalize(text) })) });
    } else {
      // Chrome's invisible tree root is not a destination or cloud entry.
      const folder = node.id === '0' ? undefined : {
        id: node.id, title: node.title, label: node.title, parentId: parent?.id,
        order: order++, end: 0, editable: !node.unmodifiable,
      } satisfies Folder;
      if (folder) { folders.push(folder); folderById.set(folder.id, folder); stack.push({ node, exit: folder }); }
      for (const child of (node.children ?? []).toReversed()) stack.push({ node: child, parent: folder ?? parent });
    }
  }
  const names = new Map<string, number>();
  for (const folder of folders) names.set(normalize(folder.title), (names.get(normalize(folder.title)) ?? 0) + 1);
  for (const folder of folders) {
    if (names.get(normalize(folder.title))! > 1) {
      const path: string[] = [];
      let current: Folder | undefined = folder;
      while (current) { path.push(current.title || '(Untitled folder)'); current = folderById.get(current.parentId ?? ''); }
      folder.label = `${path.reverse().join(' / ')} [${folder.id}]`;
    } else folder.label ||= '(Untitled folder)';
  }
  folders.sort((a, b) => codePointOrder(normalize(a.label), normalize(b.label)) || codePointOrder(a.id, b.id));
  return { bookmarks, folders, folderById, tags: [...tags.values()].sort((a, b) => codePointOrder(a.key, b.key)) };
}
