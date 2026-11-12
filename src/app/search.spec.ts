import { describe, expect, it } from 'vitest';
import { buildModel, filterBookmarks, normalize, phraseMatches } from './model';

describe('Unicode literal phrase matching', () => {
  it.each([
    ['café', 'cafe\u0301', true], ['café', 'cafe', false], ['I', 'i', true], ['İ', 'i', false], ['ı', 'i', false],
    ['e\u0307', 'e', false], ['e\u0307', 'E\u0307', true], ['العربية', 'عرب', true], ['中文收藏', '中文', true],
    ['👩🏽‍💻', '👩', false], ['👩🏽‍💻', '🏽', false], ['👩🏽‍💻', '👩🏽‍💻', true],
    ['Latin 中文 العربية', '中文 العربية', true], ['a.*["]', '.*["]', true], ['i\u0307 i', 'i', true],
  ])('field %j / query %j → %s', (text, query, match) => {
    expect(phraseMatches({ text: normalize(text) }, normalize(query))).toBe(match);
  });
});

const model = () => buildModel([{ syncing: false, id: '0', title: '', children: [
  { syncing: false, id: '1', title: 'Parent', children: [
    { syncing: false, id: '2', title: 'Same', children: [
      { syncing: false, id: '3', title: 'Café #C++ #中文', url: 'https://a.invalid/path' },
      { syncing: false, id: '4', title: 'Other #C++', url: 'https://b.invalid' },
    ] },
  ] },
  { syncing: false, id: '5', title: 'Same', children: [
    { syncing: false, id: '6', title: 'Outside #C++ #中文', url: 'https://c.invalid' },
  ] },
] }]);

it('combines folder descendants, every selected tag, and one literal field phrase', () => {
  const snapshot = model();
  const filters = { query: '', tags: new Set(['c++', '中文']), folderId: '1' };
  expect(filterBookmarks(snapshot, filters).map(row => row.id)).toEqual(['3']);
  expect(filterBookmarks(snapshot, { ...filters, query: ' café ' }).map(row => row.id)).toEqual(['3']);
  expect(filterBookmarks(snapshot, { ...filters, query: 'parent' })).toEqual([]);
  expect(filterBookmarks(snapshot, { ...filters, query: 'same' })).toHaveLength(1);
  expect(filterBookmarks(snapshot, { ...filters, query: 'a.invalid/path' })).toHaveLength(1);
  expect(filterBookmarks(snapshot, { ...filters, query: 'café same' })).toEqual([]);
  expect(filterBookmarks(snapshot, { ...filters, folderId: 'missing' })).toEqual([]);
  expect(snapshot.folders.filter(f => f.title === 'Same').map(f => f.label)).toEqual(['Parent / Same [2]', 'Same [5]']);
});

it('filters 12,000 records without DOM access and retains first native spelling', () => {
  const snapshot = buildModel([{ syncing: false, id: '1', title: 'Folder', children: Array.from({ length: 12000 }, (_, i) => ({
    syncing: false, id: `b${i}`, title: `Bookmark ${i} #${i % 2 ? 'CAFÉ' : 'cafe\u0301'}`, url: `https://example.invalid/${i}`,
  })) }]);
  expect(snapshot.tags).toEqual([{ key: 'café', label: 'cafe\u0301' }]);
  expect(filterBookmarks(snapshot, { query: 'Bookmark 11999', tags: new Set(['café']), folderId: '1' })).toHaveLength(1);
});

it.each([
  { query: '', tags: [], folderId: null, ids: ['3', '4', '6'] },
  { query: 'café', tags: [], folderId: null, ids: ['3'] },
  { query: '', tags: ['中文'], folderId: null, ids: ['3', '6'] },
  { query: '', tags: [], folderId: '1', ids: ['3', '4'] },
  { query: '', tags: ['c++'], folderId: '1', ids: ['3', '4'] },
  { query: 'Outside', tags: ['中文'], folderId: null, ids: ['6'] },
  { query: 'Café', tags: [], folderId: '1', ids: ['3'] },
  { query: 'Café', tags: ['c++', '中文'], folderId: '1', ids: ['3'] },
  { query: 'Outside', tags: ['c++', '中文'], folderId: '1', ids: [] },
])('covers every query/tag/folder combination: %j', ({ query, tags, folderId, ids }) => {
  expect(filterBookmarks(model(), { query, tags: new Set(tags), folderId }).map(row => row.id)).toEqual(ids);
});
