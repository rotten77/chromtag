import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { BookmarkStore } from './bookmark-store';
import { BookmarkList } from './bookmark-list';
import { filterBookmarks, Filters } from './model';

@Component({
  selector: 'app-root',
  imports: [BookmarkList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header><strong>Chromtag</strong><button type="button" (click)="store.refresh()" [disabled]="store.loading()">Refresh</button></header>
    @if (store.error()) { <p role="alert">{{ store.error() }}</p> }
    @if (store.loading()) { <p role="status">Loading bookmarks…</p> }
    <section class="cloud folder-cloud" aria-label="Folder filters">
      @for (folder of store.model().folders; track folder.id) {
        <button type="button" class="folder" [attr.aria-pressed]="filters().folderId === folder.id" [class.active]="filters().folderId === folder.id" (click)="toggleFolder(folder.id)">{{ folder.label }}</button>
      }
    </section>
    <section class="cloud tag-cloud" aria-label="Tag filters">
      @for (tag of store.model().tags; track tag.key) {
        <button type="button" class="tag" [class.active]="filters().tags.has(tag.key)" [attr.aria-pressed]="filters().tags.has(tag.key)" (click)="toggleTag(tag.key)">#{{ tag.label }}</button>
      }
    </section>
    <app-bookmark-list [rows]="filtered()" (open)="store.open($event)" />
    <p class="result-count" role="status">{{ filtered().length }} of {{ store.model().bookmarks.length }} bookmarks</p>
    @if (!store.loading() && !filtered().length) { <p>{{ store.model().bookmarks.length ? 'No matching bookmarks.' : 'No bookmarks yet.' }}</p> }
  `,
})
export class App {
  readonly store = inject(BookmarkStore);
  readonly filters = signal<Filters>({ query: '', tags: new Set(), folderId: null });
  readonly filtered = computed(() => filterBookmarks(this.store.model(), this.filters()));
  readonly list = viewChild(BookmarkList);
  constructor() { void this.store.refresh(); }
  toggleTag(key: string): void {
    const tags = new Set(this.filters().tags);
    if (tags.has(key)) tags.delete(key); else tags.add(key);
    this.filters.update(filters => ({ ...filters, tags }));
    this.list()?.resetScroll();
  }
  toggleFolder(id: string): void {
    this.filters.update(filters => ({ ...filters, folderId: filters.folderId === id ? null : id }));
    this.list()?.resetScroll();
  }
}
