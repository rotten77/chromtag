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

export function newTag(value: string): Tag | undefined {
  const label = value.trim().replace(/^#/u, '');
  return !label || /[\s#]/u.test(label) ? undefined : { key: normalize(label), label };
}

export function addTitleTag(title: string, tag: Tag): string {
  if (parseTags(title).some(span => span.key === tag.key)) return title;
  return `${title}${title && !/\s$/u.test(title) ? ' ' : ''}#${tag.label}`;
}

export function removeTitleTag(title: string, key: string): string {
  const spans = parseTags(title).filter(span => span.key === key);
  return spans.length ? withoutTags(title, spans) : title;
}

export function toggleTitleTag(title: string, tag: Tag): string {
  const spans = parseTags(title).filter(span => span.key === tag.key);
  if (spans.length) return withoutTags(title, spans);
  return addTitleTag(title, tag);
}

// Count every URL-bearing node, including unsupported javascript: bookmarks, on the same snapshot.
export function countBookmarkNodes(tree: chrome.bookmarks.BookmarkTreeNode[]): number {
  const stack = [...tree];
  let count = 0;
  while (stack.length) {
    const node = stack.pop()!;
    if (node.url !== undefined) count++;
    else for (const child of node.children ?? []) stack.push(child);
  }
  return count;
}

export function buildModel(tree: chrome.bookmarks.BookmarkTreeNode[]): Model {
  const builder = new ModelBuilder(tree);
  while (!builder.done) builder.step(Number.POSITIVE_INFINITY);
  return builder.finish();
}

// Keep traversal and finalization chunkable without changing the synchronous model contract.
export class ModelBuilder {
  private readonly bookmarks: Bookmark[] = [];
  private readonly folders: Folder[] = [];
  private readonly folderById = new Map<string, Folder>();
  private readonly tags = new Map<string, Tag>();
  private readonly names = new Map<string, number>();
  private order = 0;
  private stage: 'traverse' | 'count names' | 'label folders' | 'finished' = 'traverse';
  private folderIndex = 0;
  private readonly stack: { node: chrome.bookmarks.BookmarkTreeNode; parent?: Folder; exit?: Folder }[];
  processed = 0;

  constructor(tree: chrome.bookmarks.BookmarkTreeNode[]) {
    this.stack = tree.toReversed().map(node => ({ node }));
  }

  get done(): boolean { return this.stage === 'finished'; }

  step(budget: number): void {
    let work = 0;
    while (work < budget && !this.done) {
      if (this.stage === 'traverse') {
        if (!this.stack.length) { this.stage = 'count names'; this.folderIndex = 0; continue; }
        const { node, parent, exit } = this.stack.pop()!;
        if (exit) { exit.end = this.order; continue; }
        if (node.url !== undefined) {
          this.processed++;
          if (!/^\s*javascript:/iu.test(node.url)) {
            const spans = parseTags(node.title);
            const uniqueTags = new Map(spans.map(span => [span.key, { key: span.key, label: span.label }]));
            for (const span of spans) if (!this.tags.has(span.key)) this.tags.set(span.key, { key: span.key, label: span.label });
            this.bookmarks.push({ id: node.id, title: node.title, displayTitle: withoutTags(node.title, spans), url: node.url,
              parentId: parent?.id, folderName: parent?.title ?? '', folderOrder: parent?.order ?? -1,
              tags: [...uniqueTags.values()], searchFields: [node.title, parent?.title ?? '', node.url].map(text => ({ text: normalize(text) })) });
          }
        } else {
          // Chrome's invisible tree root is not a destination or cloud entry.
          const folder = node.id === '0' ? undefined : {
            id: node.id, title: node.title, label: node.title, parentId: parent?.id,
            order: this.order++, end: 0, editable: !node.unmodifiable,
          } satisfies Folder;
          if (folder) { this.folders.push(folder); this.folderById.set(folder.id, folder); this.stack.push({ node, exit: folder }); }
          for (const child of (node.children ?? []).toReversed()) this.stack.push({ node: child, parent: folder ?? parent });
        }
      } else if (this.stage === 'count names') {
        if (this.folderIndex === this.folders.length) { this.stage = 'label folders'; this.folderIndex = 0; continue; }
        const name = normalize(this.folders[this.folderIndex++].title);
        this.names.set(name, (this.names.get(name) ?? 0) + 1);
      } else {
        if (this.folderIndex === this.folders.length) { this.stage = 'finished'; continue; }
        const folder = this.folders[this.folderIndex++];
        if (this.names.get(normalize(folder.title))! > 1) {
          const path: string[] = [];
          let current: Folder | undefined = folder;
          while (current) { path.push(current.title || '(Untitled folder)'); current = this.folderById.get(current.parentId ?? ''); }
          folder.label = `${path.reverse().join(' / ')} [${folder.id}]`;
        } else folder.label ||= '(Untitled folder)';
      }
      work++;
    }
  }

  finish(): Model {
    if (!this.done) throw new Error('Bookmark snapshot is still processing');
    this.folders.sort((a, b) => codePointOrder(normalize(a.label), normalize(b.label)) || codePointOrder(a.id, b.id));
    return { bookmarks: this.bookmarks, folders: this.folders, folderById: this.folderById,
      tags: [...this.tags.values()].sort((a, b) => codePointOrder(a.key, b.key)) };
  }
}
