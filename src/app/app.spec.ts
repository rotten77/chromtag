import { TestBed } from '@angular/core/testing';
import { expect, it, vi } from 'vitest';
import { App } from './app';
import { CHROME } from './chrome-api';

it('selects filtered IDs beyond the virtual viewport, inverts matches, and drops hidden IDs on filter changes', async () => {
  const nodes = Array.from({ length: 80 }, (_, i) => ({ id: String(i), title: `Page ${i} ${i % 2 ? '#money' : '#work'}`, url: `https://example.org/${i}` }));
  const getTree = vi.fn().mockResolvedValue(nodes);
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { getTree }, tabs: {} } }] });
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  const app = fixture.componentInstance;
  fixture.detectChanges();
  const root: HTMLElement = fixture.nativeElement;
  const actions = root.querySelector<HTMLButtonElement>('.bulk-trigger')!;
  expect(actions.disabled).toBe(false);
  actions.click(); await fixture.whenStable();
  const choices = () => Array.from(root.querySelectorAll<HTMLButtonElement>('.bulk-choices button'));
  expect(choices().map(button => [button.textContent?.trim(), button.disabled])).toEqual([
    ['Select all', false], ['Deselect all', true], ['Invert selection', true],
    ['Open selected', true], ['Move to folder', true], ['Add tag', true], ['Remove tag', true],
  ]);
  expect(root.querySelector('.bulk-controls .selection-count')?.textContent).toContain('0 selected');
  choices()[0].click(); await fixture.whenStable();
  expect(app.selected().size).toBe(80);
  app.deselectAll(); await fixture.whenStable();
  const first = root.querySelector<HTMLInputElement>('article .bookmark-check')!;
  first.click(); await fixture.whenStable();
  expect(app.selected()).toEqual(new Set(['0']));
  actions.click(); await fixture.whenStable();
  expect(choices().every(button => !button.disabled)).toBe(true);
  app.toggleTag('work'); await fixture.whenStable();
  app.selectAll(); await fixture.whenStable();
  expect(app.selected().size).toBe(40);
  expect(app.selected().has('78')).toBe(true);
  app.invertSelection(); await fixture.whenStable();
  expect(app.selected().size).toBe(0);
  app.selectAll(); app.deselectAll(); await fixture.whenStable();
  expect(app.selected().size).toBe(0);
  expect(app.filters().tags).toEqual(new Set(['work']));
  app.selectAll(); app.toggleTag('money'); await fixture.whenStable();
  expect(app.selected().size).toBe(0);
  expect(getTree).toHaveBeenCalledTimes(1);
});

it('bulk actions expose only selected tags, validate new tags, and pass selected rows to the store', async () => {
  const update = vi.fn().mockResolvedValue({});
  const getTree = vi.fn().mockResolvedValue([
    { id: '1', title: 'First #money', url: 'https://a.example' },
    { id: '2', title: 'Second #work', url: 'https://b.example' },
  ]);
  const sendMessage = vi.fn().mockResolvedValue({ changed: 1, failures: 0 });
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { getTree }, tabs: {}, runtime: { sendMessage } } }] });
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  const app = fixture.componentInstance;
  app.setSelection('1', true);
  expect(app.selectedTags().map(tag => tag.key)).toEqual(['money']);
  app.showBulkDialog('add'); await fixture.whenStable();
  app.addNewTag('invalid tag'); await fixture.whenStable();
  expect(app.bulkError()).toContain('no spaces');
  expect(update).not.toHaveBeenCalled();
  await app.applyBulk({ kind: 'add', tag: { key: '中文', label: '中文' } });
  expect(sendMessage).toHaveBeenCalledWith({ type: 'bulk-change', operations: [{ kind: 'title', id: '1', title: 'First #money #中文' }] });
  expect(update).not.toHaveBeenCalled();
  expect(app.selected().size).toBe(0);
  expect(app.bulkDialog()).toBeNull();
});

it('renders user text literally and loads only once on popup creation', async () => {
  const getTree = vi.fn().mockResolvedValue([{ id: '1', title: '<img src=x onerror=alert(1)> #C++', url: 'https://example.org/<script>' }]);
  const update = vi.fn().mockResolvedValue({});
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { getTree }, tabs: { query: vi.fn().mockResolvedValue([{ id: 3 }]), update } } }] });
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  fixture.detectChanges();
  const root: HTMLElement = fixture.nativeElement;
  expect(getTree).toHaveBeenCalledTimes(1);
  expect(root.querySelector('article img')).toBeNull();
  expect(root.textContent).toContain('<img');
  const close = vi.spyOn(window, 'close').mockImplementation(() => {});
  try {
    root.querySelector<HTMLButtonElement>('.title')!.click();
    await fixture.whenStable();
    expect(update).toHaveBeenCalledWith(3, { url: 'https://example.org/<script>' });
    expect(close).toHaveBeenCalledOnce();
  } finally { close.mockRestore(); }
});

it('restores activation preference and keeps it disabled but remembered in current-tab mode', async () => {
  const local = { get: vi.fn().mockResolvedValue({ bookmarkClicks: { target: 'new', close: false, activate: true } }), set: vi.fn().mockResolvedValue(undefined) };
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { getTree: vi.fn().mockResolvedValue([]) }, storage: { local }, tabs: {} } }] });
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  const app = fixture.componentInstance;
  expect(app.switchToOpenedTab()).toBe(true);
  app.setClickPreferences({ target: 'current' });
  await fixture.whenStable();
  expect(app.switchToOpenedTab()).toBe(true);
  expect(local.set).toHaveBeenCalledWith({ bookmarkClicks: { target: 'current', close: false, activate: true } });
});

it('restores click preferences and closes only after a successful open when enabled', async () => {
  const getTree = vi.fn().mockResolvedValue([]);
  const create = vi.fn().mockResolvedValue({});
  const local = { get: vi.fn().mockResolvedValue({ bookmarkClicks: { target: 'new', close: true } }), set: vi.fn().mockResolvedValue(undefined) };
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { getTree }, tabs: { create }, storage: { local, session: {} } } }] });
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  const app = fixture.componentInstance;
  expect(app.clickTarget()).toBe('new');
  expect(app.closeOnOpen()).toBe(true);
  const close = vi.spyOn(window, 'close').mockImplementation(() => {});
  try {
    await app.openBookmark('https://example.org');
    expect(create).toHaveBeenCalledWith({ url: 'https://example.org', active: false });
    expect(close).toHaveBeenCalledTimes(1);
    create.mockRejectedValueOnce(new Error('blocked'));
    await app.openBookmark('https://example.org');
    expect(close).toHaveBeenCalledTimes(1);
    app.setClickPreferences({ close: false });
    await app.openBookmark('https://example.org');
    expect(close).toHaveBeenCalledTimes(1);
    expect(local.set).toHaveBeenCalledWith({ bookmarkClicks: { target: 'new', close: false, activate: false } });
  } finally { close.mockRestore(); }
});

it('shows reading, then processing and large-library guidance, and clears progress on failure', async () => {
  let resolve!: (tree: chrome.bookmarks.BookmarkTreeNode[]) => void;
  const getTree = vi.fn(() => new Promise<chrome.bookmarks.BookmarkTreeNode[]>(done => { resolve = done; }));
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { getTree }, tabs: {} } }] });
  const fixture = TestBed.createComponent(App);
  fixture.detectChanges();
  const root: HTMLElement = fixture.nativeElement;
  expect(root.querySelector('.loading-progress')?.textContent).toContain('Reading bookmarks from Chrome');
  expect(root.querySelector('.loading-progress')?.textContent).not.toContain('/');
  await Promise.resolve();
  const nodes = Array.from({ length: 10000 }, (_, i) => ({ id: String(i), title: `Page ${i} #tag`, url: `https://example.org/${i}` }));
  resolve([{ id: '0', title: '', children: nodes }] as chrome.bookmarks.BookmarkTreeNode[]);
  await new Promise(done => setTimeout(done, 0));
  fixture.detectChanges();
  expect(root.querySelector('.loading-progress')?.textContent).toContain('Processing bookmarks and hashtags:');
  expect(root.querySelector('.loading-progress')?.textContent).toContain('/10000');
  expect(root.querySelector('.loading-progress')?.textContent).toContain('10,001 synthetic bookmarks');
  expect(root.querySelector('.sr-only')?.textContent).toBe('Processing bookmarks');
  while (fixture.componentInstance.store.loading()) await new Promise(done => setTimeout(done, 0));
  fixture.detectChanges();
  expect(root.querySelector('.loading-progress')).toBeNull();
  getTree.mockRejectedValueOnce(new Error('Denied'));
  Array.from(root.querySelectorAll<HTMLButtonElement>('#popup-options button')).find(button => button.textContent.trim() === 'Refresh')!.click();
  await fixture.whenStable(); fixture.detectChanges();
  expect(root.querySelector('.loading-progress')).toBeNull();
  expect(Array.from(root.querySelectorAll('[role="alert"]'), alert => alert.textContent).join(' ')).toContain('could not be loaded');
});

it('distinguishes a failed initial read, retry, and an empty tree from other errors', async () => {
  const getTree = vi.fn().mockRejectedValueOnce(new Error('Denied')).mockResolvedValueOnce([])
    .mockResolvedValueOnce([{ id: '1', title: 'Saved #tag', url: 'https://example.org' }])
    .mockRejectedValueOnce(new Error('Offline')).mockResolvedValue([]);
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { getTree }, tabs: {} } }] });
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  const app = fixture.componentInstance;
  const root: HTMLElement = fixture.nativeElement;
  expect(Array.from(root.querySelectorAll('[role="alert"]'), alert => alert.textContent).join(' ')).toContain('Bookmarks could not be loaded');
  expect(root.textContent).not.toContain('No bookmarks yet.');
  expect(root.textContent).not.toContain('No matching bookmarks.');
  expect(app.store.loadFailed()).toBe(true);
  expect(app.store.phase()).toBe('idle');
  expect(app.store.progress()).toBeNull();
  expect(getTree).toHaveBeenCalledTimes(1);

  await app.store.refresh();
  await fixture.whenStable();
  expect(app.store.loadFailed()).toBe(false);
  expect(app.store.error()).toBe('');
  expect(root.textContent).toContain('No bookmarks yet.');
  expect(getTree).toHaveBeenCalledTimes(2);

  await app.store.refresh();
  await fixture.whenStable();
  expect(root.textContent).toContain('Saved');
  await app.store.refresh();
  await fixture.whenStable();
  expect(root.textContent).toContain('Saved');
  expect(root.textContent).not.toContain('No matching bookmarks.');
  expect(Array.from(root.querySelectorAll('[role="alert"]'), alert => alert.textContent).join(' ')).toContain('Bookmarks could not be loaded');
  expect(app.store.model().bookmarks).toHaveLength(1);
  expect(getTree).toHaveBeenCalledTimes(4);
  app.store.error.set('This bookmark could not be opened.');
  await fixture.whenStable();
  expect(root.textContent).toContain('Saved');
  expect(app.store.loadFailed()).toBe(true);
  await app.store.refresh();
  await fixture.whenStable();
  expect(app.store.loadFailed()).toBe(false);
  expect(root.textContent).toContain('No bookmarks yet.');
  expect(getTree).toHaveBeenCalledTimes(5);
});

it('toggles multiple normalized tags immediately and combines them with AND', async () => {
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: {
    bookmarks: { getTree: vi.fn().mockResolvedValue([
      { id: '1', title: 'Both #C++ #中文', url: 'https://example.org/1' },
      { id: '2', title: 'One #c++', url: 'https://example.org/2' },
    ]) }, tabs: { create: vi.fn() },
  } }] });
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  fixture.componentInstance.toggleTag('c++');
  expect(fixture.componentInstance.filtered()).toHaveLength(2);
  fixture.componentInstance.toggleTag('中文');
  expect(fixture.componentInstance.filtered().map(b => b.id)).toEqual(['1']);
  fixture.componentInstance.toggleTag('c++');
  expect(fixture.componentInstance.filters().tags).toEqual(new Set(['中文']));
  fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('.filter-cloud .tag[aria-pressed="true"]').textContent).toContain('中文');
});

it('replaces or clears the active folder by ID and includes nested bookmarks', async () => {
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: {
    bookmarks: { getTree: vi.fn().mockResolvedValue([{ id: '0', title: '', children: [
      { id: '1', title: 'Parent', children: [{ id: '2', title: 'Same', children: [{ id: '3', title: 'Inside #x', url: 'https://a.invalid' }] }] },
      { id: '4', title: 'Same', children: [{ id: '5', title: 'Outside #y', url: 'https://b.invalid' }] },
    ] }]) }, tabs: { create: vi.fn() },
  } }] });
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  const app = fixture.componentInstance;
  app.toggleFolder('1');
  expect(app.filtered().map(b => b.id)).toEqual(['3']);
  app.toggleTag('x');
  app.toggleFolder('4');
  expect(app.filtered()).toHaveLength(0);
  app.toggleTag('x');
  expect(app.filtered().map(b => b.id)).toEqual(['5']);
  app.toggleFolder('4');
  expect(app.filtered()).toHaveLength(2);
  fixture.detectChanges();
  expect(fixture.nativeElement.textContent).toContain('Parent / Same [2]');
});

it('debounces phrase search, flushes on tag changes, and never rereads the tree for filters', async () => {
  const getTree = vi.fn().mockResolvedValue([
    { id: '1', title: 'Café #C++', url: 'https://a.example/中文' },
    { id: '2', title: 'İ #C++', url: 'https://b.example' },
  ]);
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { getTree }, tabs: {} } }] });
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  const app = fixture.componentInstance;
  vi.useFakeTimers();
  try {
    app.onQuery(' cafe\u0301 ');
    vi.advanceTimersByTime(149);
    expect(app.filtered()).toHaveLength(2);
    vi.advanceTimersByTime(1);
    expect(app.filtered().map(b => b.id)).toEqual(['1']);
    app.onQuery('i');
    app.toggleTag('c++');
    expect(app.filtered()).toHaveLength(0);
    app.onQuery('中文');
    vi.advanceTimersByTime(150);
    expect(app.filtered()).toHaveLength(1);
    expect(getTree).toHaveBeenCalledTimes(1);
  } finally { vi.useRealTimers(); }
});

it('resets every filter, visible input, and pending debounce in one action', async () => {
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: {
    bookmarks: { getTree: vi.fn().mockResolvedValue([{ id: '1', title: 'Saved #x', url: 'https://a.example' }]) }, tabs: {},
  } }] });
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  const app = fixture.componentInstance;
  vi.useFakeTimers();
  try {
    app.toggleTag('x'); app.toggleFolder('missing'); app.onQuery('no results');
    app.resetFilters();
    vi.advanceTimersByTime(200);
    expect(app.filters()).toEqual({ query: '', tags: new Set(), folderId: null });
    expect(app.queryInput()).toBe('');
    expect(app.filtered()).toHaveLength(1);
  } finally { vi.useRealTimers(); }
});

it('shows folders by default and restores a hidden cloud even when filter storage is off', async () => {
  const values = { rememberFilters: false };
  const local = { get: async () => values, set: vi.fn(async data => Object.assign(values, data)) };
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: {
    bookmarks: { getTree: vi.fn().mockResolvedValue([{ id: '1', title: 'Folder' }]) }, tabs: {}, storage: { local, session: {} },
  } }] });
  const first = TestBed.createComponent(App);
  await first.whenStable();
  expect(first.componentInstance.foldersVisible()).toBe(true);
  first.componentInstance.setShowFolders(false);
  first.detectChanges();
  expect(first.nativeElement.querySelector('.filter-cloud .folder')).toBeNull();
  expect(local.set).toHaveBeenCalledWith({ showFolders: false });
  first.destroy();
  const reopened = TestBed.createComponent(App);
  await reopened.whenStable();
  expect(reopened.componentInstance.foldersVisible()).toBe(false);
  expect(reopened.componentInstance.rememberFilters()).toBe(false);
});

it('opens the newly created bookmark editor and cancellation retains the created bookmark', async () => {
  const created = { id: 'new', title: 'Page', url: 'https://a.example', parentId: '1' };
  const create = vi.fn().mockResolvedValue(created); const remove = vi.fn();
  const getTree = vi.fn().mockResolvedValue([]);
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { create, remove, getTree }, tabs: { query: vi.fn().mockResolvedValue([created]) } } }] });
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  getTree.mockResolvedValue([{ id: '1', title: 'Default', children: [created] }]);
  await fixture.componentInstance.addCurrentPage();
  expect(fixture.componentInstance.editing()?.id).toBe('new');
  fixture.componentInstance.editing.set(null);
  expect(remove).not.toHaveBeenCalled();
  expect(fixture.componentInstance.store.model().bookmarks[0].id).toBe('new');
  expect(getTree).toHaveBeenCalledTimes(2);
});

it('renders markup-significant folders, tags, title, and URL as literal text in every view', async () => {
  const getTree = vi.fn().mockResolvedValue([{ id: 'folder', title: '<svg/onload=alert(1)>', children: [
    { id: 'b', title: '<img src=x> #<svg/onload=1> #"]', url: 'https://a.example/<script>alert(1)</script>' },
  ] }]);
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { getTree }, tabs: {} } }] });
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  const root: HTMLElement = fixture.nativeElement;
  expect(root.querySelector('svg,script,article img')).toBeNull();
  expect(root.querySelector('.filter-cloud .folder')?.textContent).toContain('<svg/onload=alert(1)>');
  expect(root.querySelector('.filter-cloud')?.textContent).toContain('#<svg/onload=1>');
  fixture.componentInstance.openEditor(fixture.componentInstance.filtered()[0]);
  fixture.detectChanges();
  await fixture.whenStable();
  expect(root.querySelector('svg,script,article img')).toBeNull();
  expect(root.querySelector<HTMLTextAreaElement>('#edit-title')!.value).toContain('<img src=x>');
});
