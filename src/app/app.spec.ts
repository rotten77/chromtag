import { TestBed } from '@angular/core/testing';
import { expect, it, vi } from 'vitest';
import { App } from './app';
import { CHROME } from './chrome-api';

it('renders user text literally and loads only once on popup creation', async () => {
  const getTree = vi.fn().mockResolvedValue([{ id: '1', title: '<img src=x onerror=alert(1)> #C++', url: 'https://example.org/<script>' }]);
  const create = vi.fn().mockResolvedValue({});
  TestBed.configureTestingModule({ providers: [{ provide: CHROME, useValue: { bookmarks: { getTree }, tabs: { create } } }] });
  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();
  fixture.detectChanges();
  const root: HTMLElement = fixture.nativeElement;
  expect(getTree).toHaveBeenCalledTimes(1);
  expect(root.querySelector('img')).toBeNull();
  expect(root.textContent).toContain('<img');
  root.querySelector<HTMLButtonElement>('.title')!.click();
  expect(create).toHaveBeenCalledWith({ url: 'https://example.org/<script>' });
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
  expect(fixture.nativeElement.querySelector('.tag-cloud [aria-pressed="true"]').textContent).toContain('中文');
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
