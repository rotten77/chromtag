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
  expect(store.refresh()).toBe(first);
  expect(getTree).toHaveBeenCalledTimes(1);
  resolve([{ syncing: false, id: '1', title: 'Title', url: 'https://example.org' }]);
  await first;
  expect(store.model().bookmarks).toHaveLength(1);
  await store.open('https://example.org');
  expect(create).toHaveBeenCalledWith({ url: 'https://example.org' });
});
it('reports failed loads without leaving the popup busy', async () => {
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { getTree: vi.fn().mockRejectedValue(new Error('Denied')) } } }] });
  const store = TestBed.inject(BookmarkStore);
  await store.refresh();
  expect(store.error()).toContain('could not be loaded');
  expect(store.loading()).toBe(false);
});
