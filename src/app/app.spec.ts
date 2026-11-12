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
