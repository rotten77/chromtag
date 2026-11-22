import { TestBed } from '@angular/core/testing';
import { expect, it, vi } from 'vitest';
import { FilterCloud } from './filter-cloud';

it('pages excess choices without losing selection and resets when folders are hidden', async () => {
  const fixture = TestBed.createComponent(FilterCloud);
  fixture.componentRef.setInput('folders', [{ id: 'folder', label: 'Folder' }]);
  fixture.componentRef.setInput('tags', [{ key: 'c++', label: 'C++' }, { key: '中文', label: '中文' }]);
  fixture.componentRef.setInput('selectedTags', new Set(['中文']));
  await fixture.whenStable();
  const cloud = fixture.componentInstance;
  // jsdom has no physical layout; Chrome tests verify actual fitting/hidden-button geometry.
  cloud.visibleCount.set(1);
  cloud.pageReady.set(true);
  cloud.next();
  expect(cloud.start()).toBe(1);
  expect(cloud.pageReady()).toBe(false);
  cloud.next();
  expect(cloud.start()).toBe(1);
  await fixture.whenStable();
  const tag = cloud.choices().find(choice => choice.id === '中文')!;
  expect(cloud.isSelected(tag)).toBe(true);
  const selected = vi.fn(); cloud.tagSelected.subscribe(selected);
  cloud.select(tag);
  expect(selected).toHaveBeenCalledWith('中文');
  cloud.previous();
  expect(cloud.start()).toBe(0);
  fixture.componentRef.setInput('showFolders', false);
  await fixture.whenStable();
  expect(cloud.choices().map(choice => choice.id)).toEqual(['c++', '中文']);
  expect(cloud.start()).toBe(0);
  expect(cloud.history()).toEqual([]);
});

it('keeps the rendered window bounded with many distinct folders and tags', async () => {
  const fixture = TestBed.createComponent(FilterCloud);
  const rect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    return { bottom: this.matches('#filter-cloud > button') ? 100 : 50 } as DOMRect;
  });
  fixture.componentRef.setInput('folders', Array.from({ length: 5000 }, (_, id) => ({ id: String(id), label: `Folder ${id}` })));
  fixture.componentRef.setInput('tags', Array.from({ length: 5000 }, (_, id) => ({ key: String(id), label: `Tag ${id}` })));
  await fixture.whenStable();
  const cloud = fixture.componentInstance;
  expect(cloud.choices()).toHaveLength(10000);
  expect(fixture.nativeElement.querySelectorAll('#filter-cloud > button').length).toBeLessThanOrEqual(32);
  cloud.visibleCount.set(4);
  cloud.pageReady.set(true);
  cloud.next();
  await fixture.whenStable();
  expect(cloud.start()).toBe(4);
  expect(fixture.nativeElement.querySelectorAll('#filter-cloud > button').length).toBeLessThanOrEqual(32);
  fixture.destroy();
  rect.mockRestore();
});
