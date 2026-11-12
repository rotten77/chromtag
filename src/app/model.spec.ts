import { describe, expect, it } from 'vitest';
import { buildModel, codePointOrder, countBookmarkNodes, ModelBuilder, parseTags, withoutTags } from './model';

describe('snapshot model', () => {
  it('resolves nested parents from a single snapshot and omits javascript bookmarks', () => {
    const model = buildModel([{ syncing: false, id: '0', title: '', children: [{ syncing: false, id: '1', title: '<Folder>', children: [
      { syncing: false, id: '2', title: 'Nested', children: [{ syncing: false, id: '3', title: '<b>Title</b> #C++ #c++', url: 'https://example.org' }] },
      { syncing: false, id: '4', title: 'Unsafe', url: 'JaVaScRiPt:alert(1)' },
    ] }] }]);
    expect(model.bookmarks).toHaveLength(1);
    expect(model.bookmarks[0]).toMatchObject({ folderName: 'Nested', displayTitle: '<b>Title</b>', parentId: '2' });
    expect(model.tags).toEqual([{ key: 'c++', label: 'C++' }]);
    expect(model.folderById.get('1')!.end).toBeGreaterThan(model.folderById.get('2')!.order);
  });
  it('counts URL nodes consistently with incremental processing, including excluded schemes', () => {
    const tree = [{ id: '0', title: '', children: [
      { id: 'f', title: 'Folder', children: [{ id: 'a', title: 'A #tag', url: 'https://example.org' }] },
      { id: 'b', title: 'Unsafe', url: 'javascript:alert(1)' },
    ] }] as chrome.bookmarks.BookmarkTreeNode[];
    const builder = new ModelBuilder(tree);
    expect(countBookmarkNodes(tree)).toBe(2);
    while (!builder.done) builder.step(1);
    expect(builder.processed).toBe(2);
    expect(builder.finish()).toEqual(buildModel(tree));
    expect(builder.finish().bookmarks).toHaveLength(1);
  });
  it('preserves literal punctuation and recognizes only approved tag boundaries', () => {
    const text = '#one#two word#tag # #C++ #work,\u2003#café';
    expect(parseTags(text).map(t => t.label)).toEqual(['one', 'C++', 'work,', 'café']);
    expect(withoutTags('<img> #C++')).toBe('<img>');
  });
  it('traverses 12,000 folder levels without recursive calls', () => {
    let node: chrome.bookmarks.BookmarkTreeNode = { syncing: false, id: 'leaf', title: 'Deep', url: 'https://example.org' };
    for (let i = 12000; i > 0; i--) node = { syncing: false, id: String(i), title: `Folder ${i}`, children: [node] };
    expect(buildModel([node]).bookmarks[0].parentId).toBe('12000');
  });
  it('sorts Unicode identities by code points and retains accents and original hashtag spelling', () => {
    const model = buildModel([{ syncing: false, id: '1', title: '#CAFÉ #cafe\u0301 #cafe #中文 #العربية #👩🏽‍💻 #"] #\uE000 #😀', url: 'https://a.example' }]);
    expect(model.tags.find(tag => tag.key === 'café')?.label).toBe('CAFÉ');
    expect(model.tags.map(tag => tag.key)).toEqual(['"]', 'cafe', 'café', 'العربية', '中文', '\uE000', '👩🏽‍💻', '😀']);
    expect(codePointOrder('\uE000', '😀')).toBeLessThan(0);
  });
});
