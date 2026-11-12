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
  const tag = cloud.remaining().find(choice => choice.id === '中文')!;
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
