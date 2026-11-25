import { TestBed } from '@angular/core/testing';
import { expect, it, vi } from 'vitest';
import { App } from './app';
import { AppearanceSettings } from './appearance-settings';
import { CHROME } from './chrome-api';

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>(done => { resolve = done; });
  return { promise, resolve };
}

it('keeps the latest query when save and clear finish out of order', async () => {
  const first = deferred();
  const sessionData: Record<string, unknown> = {};
  const session = {
    get: vi.fn(async () => ({ ...sessionData })),
    set: vi.fn(async (items: Record<string, unknown>) => {
      if (session.set.mock.calls.length === 1) await first.promise;
      Object.assign(sessionData, items);
    }),
    remove: vi.fn(async (key: string) => { delete sessionData[key]; }),
  };
  const local = { get: vi.fn(async () => ({})), set: vi.fn(async () => {}) };
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: {
    bookmarks: { getTree: vi.fn(async () => []) }, tabs: {}, storage: { session, local },
  } }] });
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  const app = fixture.componentInstance;
  app.onQuery('old');
  app.resetFilters();
  app.onQuery('latest');
  first.resolve();
  await fixture.whenStable();
  expect(sessionData['sessionFilters']).toEqual({ query: 'latest', tags: [], folderId: null });
  fixture.destroy();
  const reopened = TestBed.createComponent(App);
  await reopened.whenStable();
  expect(reopened.componentInstance.queryInput()).toBe('latest');
});

it('does not overwrite a changed folder option with a late options read', async () => {
  const first = deferred();
  const localData: Record<string, unknown> = { showFolders: true, rememberFilters: true };
  const local = {
    get: vi.fn(async (key: string | string[]) => {
      if (Array.isArray(key)) {
        await first.promise;
        return { showFolders: true, rememberFilters: true };
      }
      return {};
    }),
    set: vi.fn(async (items: Record<string, unknown>) => { Object.assign(localData, items); }),
  };
  const session = { get: vi.fn(async () => ({})), set: vi.fn(async () => {}), remove: vi.fn(async () => {}) };
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: {
    bookmarks: { getTree: vi.fn(async () => []) }, tabs: {}, storage: { session, local },
  } }] });
  const fixture = TestBed.createComponent(App);
  fixture.componentInstance.setShowFolders(false);
  first.resolve();
  await fixture.whenStable();
  expect(fixture.componentInstance.foldersVisible()).toBe(false);
  expect(localData['showFolders']).toBe(false);
});

it('keeps the latest session filter choice when the first write is delayed', async () => {
  const first = deferred();
  const sessionData: Record<string, unknown> = {};
  let calls = 0;
  const session = {
    get: vi.fn(async () => ({ ...sessionData })),
    set: vi.fn(async (items: Record<string, unknown>) => {
      if (++calls === 1) await first.promise;
      Object.assign(sessionData, items);
    }),
    remove: vi.fn(async (key: string) => { delete sessionData[key]; }),
  };
  const local = { get: vi.fn(async () => ({})), set: vi.fn(async () => {}) };
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: {
    bookmarks: { getTree: vi.fn(async () => []) }, tabs: {}, storage: { session, local },
  } }] });
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  const app = fixture.componentInstance;
  app.toggleTag('old');
  app.toggleTag('new');
  await Promise.resolve();
  expect(session.set).toHaveBeenCalledTimes(1);
  first.resolve();
  await fixture.whenStable();
  expect(session.set).toHaveBeenCalledTimes(2);
  expect(sessionData['sessionFilters']).toEqual({ query: '', tags: ['old', 'new'], folderId: null });
});

it('orders filter saves and removals across rapid option toggles and restores on reopen', async () => {
  const first = deferred();
  const sessionData: Record<string, unknown> = {};
  const localData: Record<string, unknown> = {};
  const session = {
    get: vi.fn(async () => ({ ...sessionData })),
    set: vi.fn(async (items: Record<string, unknown>) => {
      if (session.set.mock.calls.length === 1) await first.promise;
      Object.assign(sessionData, items);
    }),
    remove: vi.fn(async (key: string) => { delete sessionData[key]; }),
  };
  const local = {
    get: vi.fn(async () => ({ ...localData })),
    set: vi.fn(async (items: Record<string, unknown>) => { Object.assign(localData, items); }),
  };
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: {
    bookmarks: { getTree: vi.fn(async () => []) }, tabs: {}, storage: { session, local },
  } }] });
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  const app = fixture.componentInstance;
  app.toggleTag('one');
  app.setRemember(false);
  app.setRemember(true);
  app.toggleTag('two');
  app.setShowFolders(false);
  app.setShowFolders(true);
  first.resolve();
  await fixture.whenStable();
  expect(sessionData['sessionFilters']).toEqual({ query: '', tags: ['one', 'two'], folderId: null });
  expect(localData).toMatchObject({ rememberFilters: true, showFolders: true });
  fixture.destroy();
  const reopened = TestBed.createComponent(App);
  await reopened.whenStable();
  expect(reopened.componentInstance.filters().tags).toEqual(new Set(['one', 'two']));
  expect(reopened.componentInstance.rememberFilters()).toBe(true);
  expect(reopened.componentInstance.foldersVisible()).toBe(true);
});

it('clears the last saved filters when the final toggle disables remembering', async () => {
  const first = deferred();
  const sessionData: Record<string, unknown> = {};
  const localData: Record<string, unknown> = {};
  const session = {
    get: vi.fn(async () => ({ ...sessionData })),
    set: vi.fn(async (items: Record<string, unknown>) => {
      if (session.set.mock.calls.length === 1) await first.promise;
      Object.assign(sessionData, items);
    }),
    remove: vi.fn(async (key: string) => { delete sessionData[key]; }),
  };
  const local = {
    get: vi.fn(async () => ({ ...localData })),
    set: vi.fn(async (items: Record<string, unknown>) => { Object.assign(localData, items); }),
  };
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: {
    bookmarks: { getTree: vi.fn(async () => []) }, tabs: {}, storage: { session, local },
  } }] });
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  const app = fixture.componentInstance;
  app.toggleTag('one');
  app.setRemember(false);
  app.setRemember(true);
  app.toggleTag('two');
  app.setRemember(false);
  first.resolve();
  await fixture.whenStable();
  expect(sessionData).toEqual({});
  expect(localData['rememberFilters']).toBe(false);
  fixture.destroy();
  const reopened = TestBed.createComponent(App);
  await reopened.whenStable();
  expect(reopened.componentInstance.filters().tags.size).toBe(0);
  expect(reopened.componentInstance.rememberFilters()).toBe(false);
});

it('keeps independent palette and layout edits when the first appearance write is delayed', async () => {
  const first = deferred();
  let saved: unknown;
  const local = {
    get: vi.fn(async () => ({ appearance: saved })),
    set: vi.fn(async (items: Record<string, unknown>) => {
      if (local.set.mock.calls.length === 1) await first.promise;
      saved = items['appearance'];
    }),
  };
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { storage: { local } } }] });
  const fixture = TestBed.createComponent(AppearanceSettings);
  await fixture.whenStable();
  const settings = fixture.componentInstance;
  settings.setDimension('width', 650);
  settings.setColor('light', 'tag', '#512DA8');
  settings.setColor('dark', 'folder', '#B388FF');
  settings.resetColors('light');
  first.resolve();
  await fixture.whenStable();
  expect(saved).toMatchObject({ width: 650, light: { tag: '#1976D2' }, dark: { folder: '#B388FF' } });
  fixture.destroy();
  const reopened = TestBed.createComponent(AppearanceSettings);
  await reopened.whenStable();
  expect(reopened.componentInstance.settings()).toMatchObject({ width: 650, light: { tag: '#1976D2' }, dark: { folder: '#B388FF' } });
});

it('orders fast click-target changes and restores the last choice', async () => {
  const first = deferred();
  let stored: unknown;
  const local = {
    get: vi.fn(async () => ({ bookmarkClicks: stored })),
    set: vi.fn(async (items: Record<string, unknown>) => {
      if (local.set.mock.calls.length === 1) await first.promise;
      stored = items['bookmarkClicks'];
    }),
  };
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: {
    bookmarks: { getTree: vi.fn(async () => []) }, tabs: {}, storage: { local, session: { get: vi.fn(async () => ({})) } },
  } }] });
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  fixture.componentInstance.setClickPreferences({ target: 'new' });
  fixture.componentInstance.setClickPreferences({ close: false });
  first.resolve();
  await fixture.whenStable();
  expect(stored).toEqual({ target: 'new', close: false, activate: false });
  fixture.destroy();
  const reopened = TestBed.createComponent(App);
  await reopened.whenStable();
  expect(reopened.componentInstance.clickTarget()).toBe('new');
  expect(reopened.componentInstance.closeOnOpen()).toBe(false);
});

it('continues saving after a rejected earlier write', async () => {
  const sessionData: Record<string, unknown> = {};
  const session = {
    get: vi.fn(async () => ({ ...sessionData })),
    set: vi.fn().mockRejectedValueOnce(new Error('unavailable')).mockImplementation(async (items: Record<string, unknown>) => {
      Object.assign(sessionData, items);
    }),
    remove: vi.fn(async (key: string) => { delete sessionData[key]; }),
  };
  const local = { get: vi.fn(async () => ({})), set: vi.fn(async () => {}) };
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: {
    bookmarks: { getTree: vi.fn(async () => []) }, tabs: {}, storage: { session, local },
  } }] });
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  fixture.componentInstance.toggleTag('old');
  fixture.componentInstance.toggleTag('new');
  await fixture.whenStable();
  expect(sessionData['sessionFilters']).toEqual({ query: '', tags: ['old', 'new'], folderId: null });
  expect(fixture.componentInstance.storageError()).toContain('Could not save session filters');
});

it('does not replace a changed appearance with a late storage read', async () => {
  const first = deferred();
  const local = {
    get: vi.fn(async () => { await first.promise; return { appearance: { width: 400 } }; }),
    set: vi.fn(async () => {}),
  };
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { storage: { local } } }] });
  const fixture = TestBed.createComponent(AppearanceSettings);
  fixture.componentInstance.setDimension('width', 700);
  first.resolve();
  await fixture.whenStable();
  expect(fixture.componentInstance.settings().width).toBe(700);
});

it('keeps the latest appearance settings when the first write is delayed', async () => {
  const first = deferred();
  let calls = 0;
  let saved: unknown;
  const local = {
    get: vi.fn(async () => ({ appearance: saved })),
    set: vi.fn(async (items: Record<string, unknown>) => {
      if (++calls === 1) await first.promise;
      saved = items['appearance'];
    }),
  };
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { storage: { local } } }] });
  const fixture = TestBed.createComponent(AppearanceSettings);
  await fixture.whenStable();
  const appearance = fixture.componentInstance;
  appearance.setDimension('width', 600);
  appearance.setDimension('height', 500);
  await Promise.resolve();
  expect(local.set).toHaveBeenCalledTimes(1);
  first.resolve();
  await fixture.whenStable();
  expect(local.set).toHaveBeenCalledTimes(2);
  expect(saved).toMatchObject({ width: 600, height: 500 });
  fixture.destroy();
  const reopened = TestBed.createComponent(AppearanceSettings);
  await reopened.whenStable();
  expect(reopened.componentInstance.settings()).toMatchObject({ width: 600, height: 500 });
});
