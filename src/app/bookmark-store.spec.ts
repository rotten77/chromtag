import { TestBed } from '@angular/core/testing';
import { beforeEach, expect, it, vi } from 'vitest';
import { BookmarkStore } from './bookmark-store';
import { CHROME } from './chrome-api';

beforeEach(() => TestBed.resetTestingModule());
it('coalesces overlapping refreshes to one read and opens URLs with native tabs', async () => {
  let resolve!: (tree: chrome.bookmarks.BookmarkTreeNode[]) => void;
  const getTree = vi.fn(() => new Promise<chrome.bookmarks.BookmarkTreeNode[]>(done => { resolve = done; }));
  const create = vi.fn().mockResolvedValue({});
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { getTree }, tabs: { create } } }] });
  const store = TestBed.inject(BookmarkStore);
  const first = store.refresh();
  expect(store.phase()).toBe('reading');
  expect(store.progress()).toBeNull();
  expect(store.refresh()).toBe(first);
  await Promise.resolve();
  expect(getTree).toHaveBeenCalledTimes(1);
  resolve([{ syncing: false, id: '1', title: 'Title', url: 'https://example.org' }]);
  await first;
  expect(store.model().bookmarks).toHaveLength(1);
  expect(store.phase()).toBe('idle');
  expect(store.progress()).toBeNull();
  expect(await store.open('https://example.org', 'new')).toBe(true);
  expect(create).toHaveBeenCalledWith({ url: 'https://example.org' });
});
it('navigates the active tab by default and reports missing tabs without opening a new one', async () => {
  const query = vi.fn().mockResolvedValue([{ id: 42 }]);
  const update = vi.fn().mockResolvedValue({});
  const create = vi.fn();
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { tabs: { query, update, create } } }] });
  const store = TestBed.inject(BookmarkStore);
  expect(await store.open('https://example.org')).toBe(true);
  expect(query).toHaveBeenCalledWith({ active: true, currentWindow: true });
  expect(update).toHaveBeenCalledWith(42, { url: 'https://example.org' });
  expect(create).not.toHaveBeenCalled();
  query.mockResolvedValue([]);
  expect(await store.open('https://example.org')).toBe(false);
  expect(store.error()).toContain('could not be opened');
});
it('reports failed loads without leaving the popup busy', async () => {
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { getTree: vi.fn().mockRejectedValue(new Error('Denied')) } } }] });
  const store = TestBed.inject(BookmarkStore);
  await store.refresh();
  expect(store.error()).toContain('could not be loaded');
  expect(store.loading()).toBe(false);
  expect(store.phase()).toBe('idle');
  expect(store.progress()).toBeNull();
  expect(store.loadFailed()).toBe(true);
});

it('reports actual node counts while processing a large snapshot and refreshes once per load', async () => {
  const nodes = Array.from({ length: 12000 }, (_, i) => ({ id: String(i + 2), title: `Page ${i} #tag`, url: `https://example.org/${i}` }));
  const getTree = vi.fn().mockResolvedValue([{ id: '0', title: '', children: [
    { id: '1', title: 'Folder', children: nodes },
    { id: 'unsafe', title: 'Unsafe', url: 'javascript:alert(1)' },
  ] }]);
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { getTree } } }] });
  const store = TestBed.inject(BookmarkStore);
  const first = store.refresh();
  while (store.phase() === 'reading') await new Promise(done => setTimeout(done, 0));
  expect(store.phase()).toBe('processing');
  expect(store.progress()).toEqual({ processed: 0, total: 12001 });
  let intermediate = false;
  const timer = setInterval(() => {
    const progress = store.progress();
    if (progress && progress.processed > 0 && progress.processed < progress.total) intermediate = true;
  }, 0);
  try { await first; } finally { clearInterval(timer); }
  expect(intermediate).toBe(true);
  expect(store.model().bookmarks).toHaveLength(12000);
  expect(store.progress()).toBeNull();
  expect(store.phase()).toBe('idle');
  expect(getTree).toHaveBeenCalledTimes(1);
  await store.refresh();
  expect(getTree).toHaveBeenCalledTimes(2);
});

it('saves details then moves, refreshes once, and removes with one further refresh', async () => {
  const getTree = vi.fn().mockResolvedValue([]);
  const update = vi.fn().mockResolvedValue({});
  const move = vi.fn().mockResolvedValue({});
  const remove = vi.fn().mockResolvedValue(undefined);
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { getTree, update, move, remove } } }] });
  const store = TestBed.inject(BookmarkStore);
  expect(await store.save({ id: 'b', title: 'Saved #中文', url: ' https://a.example ', parentId: 'new', originalParentId: 'old' })).toBe(true);
  expect(update).toHaveBeenCalledWith('b', { title: 'Saved #中文', url: 'https://a.example' });
  expect(move).toHaveBeenCalledWith('b', { parentId: 'new' });
  expect(update.mock.invocationCallOrder[0]).toBeLessThan(move.mock.invocationCallOrder[0]);
  expect(getTree).toHaveBeenCalledTimes(1);
  expect(await store.remove('b')).toBe(true);
  expect(remove).toHaveBeenCalledWith('b');
  expect(getTree).toHaveBeenCalledTimes(2);
});

it('handles partial save and removal failures honestly, preserving actual snapshot state', async () => {
  const getTree = vi.fn().mockResolvedValue([]);
  const update = vi.fn().mockResolvedValue({});
  const move = vi.fn().mockRejectedValue(new Error('Managed folder'));
  const remove = vi.fn().mockRejectedValue(new Error('No access'));
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { getTree, update, move, remove } } }] });
  const store = TestBed.inject(BookmarkStore);
  expect(await store.save({ id: 'b', title: 'Changed', url: 'https://a.example', parentId: 'new', originalParentId: 'old' })).toBe(false);
  expect(store.error()).toContain('Details saved');
  expect(getTree).toHaveBeenCalledTimes(1);
  expect(await store.remove('b')).toBe(false);
  expect(getTree).toHaveBeenCalledTimes(1);
  expect(store.busy()).toBe(false);
  update.mockRejectedValueOnce(new Error('No access'));
  expect(await store.save({ id: 'b', title: '', url: 'https://a.example', parentId: 'same', originalParentId: 'same' })).toBe(false);
  expect(getTree).toHaveBeenCalledTimes(1);
  expect(store.error()).toContain('could not be saved');
});

it('opens all selected bookmarks in separate tabs and reports individual failures', async () => {
  const create = vi.fn().mockResolvedValueOnce({}).mockRejectedValueOnce(new Error('Blocked'));
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { tabs: { create } } }] });
  const store = TestBed.inject(BookmarkStore);
  const bookmarks = ['https://a.example', 'https://b.example'].map((url, i) => ({ id: String(i), url })) as import('./model').Bookmark[];
  await store.openAll(bookmarks);
  expect(create.mock.calls).toEqual([[{ url: bookmarks[0].url }], [{ url: bookmarks[1].url }]]);
  expect(store.error()).toContain('1 of 2');
  expect(store.busy()).toBe(false);
});

it('bulk edits only changed selected titles, moves eligible rows, refreshes once, and reports partial failures', async () => {
  const getTree = vi.fn().mockResolvedValue([]);
  const update = vi.fn().mockResolvedValueOnce({}).mockRejectedValueOnce(new Error('Locked'));
  const move = vi.fn().mockResolvedValue({});
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { getTree, update, move } } }] });
  const store = TestBed.inject(BookmarkStore);
  const rows = [
    { id: '1', title: 'First #money #money', parentId: 'old' },
    { id: '2', title: 'Second #work', parentId: 'new' },
    { id: '3', title: 'Third #money', parentId: 'old' },
  ] as import('./model').Bookmark[];
  await store.bulkChange(rows, { kind: 'remove', tag: { key: 'money', label: 'money' } });
  expect(update.mock.calls).toEqual([['1', { title: 'First' }], ['3', { title: 'Third' }]]);
  expect(store.error()).toContain('1 of 3');
  expect(getTree).toHaveBeenCalledTimes(1);
  await store.bulkChange(rows, { kind: 'add', tag: { key: 'money', label: 'money' } });
  expect(update).toHaveBeenCalledWith('2', { title: 'Second #work #money' });
  expect(getTree).toHaveBeenCalledTimes(2);
  await store.bulkChange(rows, { kind: 'move', parentId: 'new' });
  expect(move.mock.calls).toEqual([['1', { parentId: 'new' }], ['3', { parentId: 'new' }]]);
  expect(getTree).toHaveBeenCalledTimes(3);
  expect(store.busy()).toBe(false);
});

it('adds exposed active-page metadata in the default folder and refreshes exactly once', async () => {
  const created = { id: 'new', title: 'Page #中文', url: 'https://a.example', parentId: '1' };
  const create = vi.fn().mockResolvedValue(created);
  const query = vi.fn().mockResolvedValue([{ title: created.title, url: created.url }]);
  const getTree = vi.fn().mockResolvedValue([{ id: '1', title: 'Default', children: [created] }]);
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { getTree, create }, tabs: { query } } }] });
  const store = TestBed.inject(BookmarkStore);
  const bookmark = await store.addCurrentPage();
  expect(query).toHaveBeenCalledWith({ active: true, currentWindow: true });
  expect(create).toHaveBeenCalledWith({ title: created.title, url: created.url });
  expect(bookmark).toMatchObject({ id: 'new', parentId: '1', folderName: 'Default' });
  expect(getTree).toHaveBeenCalledTimes(1);
});

it.each([[], [{}], [{ title: 'Restricted page' }], [{ url: 'https://a.example' }], [{ title: ' ', url: 'https://a.example' }]].map(tabs => ({ tabs })))('never creates an incomplete bookmark when metadata is unavailable: %j', async ({ tabs }) => {
  const create = vi.fn(); const getTree = vi.fn();
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { create, getTree }, tabs: { query: vi.fn().mockResolvedValue(tabs) } } }] });
  const store = TestBed.inject(BookmarkStore);
  expect(await store.addCurrentPage()).toBeUndefined();
  expect(create).not.toHaveBeenCalled(); expect(getTree).not.toHaveBeenCalled();
  expect(store.error()).toContain('cannot be saved');
});

it('reports a revoked tab grant without creating or refreshing', async () => {
  const create = vi.fn(); const getTree = vi.fn();
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { create, getTree }, tabs: { query: vi.fn().mockRejectedValue(new Error('Grant revoked')) } } }] });
  const store = TestBed.inject(BookmarkStore);
  expect(await store.addCurrentPage()).toBeUndefined();
  expect(create).not.toHaveBeenCalled(); expect(getTree).not.toHaveBeenCalled();
  expect(store.busy()).toBe(false);
});

it('recovers from synchronous Chrome errors and allows retry', async () => {
  const getTree = vi.fn().mockImplementationOnce(() => { throw new Error('Extension context invalidated'); }).mockResolvedValue([]);
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { getTree } } }] });
  const store = TestBed.inject(BookmarkStore);
  await store.refresh();
  expect(store.loading()).toBe(false);
  expect(store.error()).toContain('could not be loaded');
  expect(store.loadFailed()).toBe(true);
  await store.refresh();
  expect(getTree).toHaveBeenCalledTimes(2);
  expect(store.error()).toBe('');
  expect(store.loadFailed()).toBe(false);
});
