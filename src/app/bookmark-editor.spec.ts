import { TestBed } from '@angular/core/testing';
import { expect, it, vi } from 'vitest';
import { BookmarkEditor } from './bookmark-editor';
import { CHROME } from './chrome-api';
import { buildModel, newTag, parseTags, toggleTitleTag } from './model';

it('validates new tags and toggles all literal normalized spans without regex interpolation', () => {
  for (const text of ['', '#', '##x', '#a b', 'x#y', 'a\u2003b']) expect(newTag(text)).toBeUndefined();
  expect(newTag('  #Český++  ')).toEqual({ key: 'český++', label: 'Český++' });
  const tag = newTag('#C++')!;
  expect(toggleTitleTag('Literal #C++ #c++ #other word#C++', tag)).toBe('Literal   #other word#C++');
  const title = toggleTitleTag('Keep <b>markup</b>', newTag('中文')!);
  expect(title).toBe('Keep <b>markup</b> #中文');
  expect(parseTags(title).map(t => t.label)).toEqual(['中文']);
});

async function editor() {
  const update = vi.fn().mockResolvedValue({});
  const move = vi.fn().mockResolvedValue({});
  const remove = vi.fn().mockResolvedValue(undefined);
  const getTree = vi.fn().mockResolvedValue([]);
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { update, move, remove, getTree } } }] });
  const model = buildModel([{ syncing: false, id: '1', title: '<Folder>', children: [
    { syncing: false, id: 'b', title: '<img> #C++', url: 'https://a.example' },
  ] }]);
  const fixture = TestBed.createComponent(BookmarkEditor);
  fixture.componentRef.setInput('bookmark', model.bookmarks[0]);
  fixture.componentRef.setInput('model', model);
  await fixture.whenStable();
  return { fixture, app: fixture.componentInstance, update, move, remove, getTree };
}

it('populates fields, preserves Unicode tag spelling, and saves through native APIs', async () => {
  const { fixture, app, update, move, getTree } = await editor();
  expect(app.title()).toBe('<img> #C++');
  expect(app.url).toBe('https://a.example');
  expect(app.parentId).toBe('1');
  app.tagInput = '#cafe\u0301'; app.addTag();
  expect(app.title()).toContain('#cafe\u0301');
  expect(app.selectedTags().has('café')).toBe(true);
  app.tagInput = 'bad tag'; app.addTag();
  expect(app.error()).toContain('no spaces');
  const closed = vi.fn(); app.closed.subscribe(closed);
  await app.save();
  expect(update).toHaveBeenCalledWith('b', { title: '<img> #C++ #cafe\u0301', url: 'https://a.example' });
  expect(move).not.toHaveBeenCalled();
  expect(getTree).toHaveBeenCalledTimes(1);
  expect(closed).toHaveBeenCalledTimes(1);
  fixture.destroy();
});

it('cancel discards the draft without any mutation; delete invokes remove', async () => {
  const { app, update, remove, getTree } = await editor();
  const closed = vi.fn(); app.closed.subscribe(closed);
  app.title.set('Unsaved'); app.close();
  expect(closed).toHaveBeenCalledTimes(1);
  expect(update).not.toHaveBeenCalled(); expect(remove).not.toHaveBeenCalled(); expect(getTree).not.toHaveBeenCalled();
  await app.remove();
  expect(remove).toHaveBeenCalledWith('b');
  expect(getTree).toHaveBeenCalledTimes(1);
});
