import { describe, expect, it } from 'vitest';
import { buildModel, parseTags, withoutTags } from './model';

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
});
