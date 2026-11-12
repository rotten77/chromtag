import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, Injector, OnDestroy, signal, viewChild } from '@angular/core';
import { BookmarkStore } from './bookmark-store';
import { BookmarkList } from './bookmark-list';
import { Bookmark, filterBookmarks, Filters } from './model';
import { BookmarkEditor } from './bookmark-editor';

@Component({
  selector: 'app-root',
  imports: [BookmarkList, BookmarkEditor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="popup-content" [inert]="!!editing()">
    <header><strong class="brand"><img src="icon.png" alt="">Chromtag</strong><button type="button" (click)="store.refresh()" [disabled]="store.loading() || store.busy()">Refresh</button></header>
    <input #search class="search-field" type="search" aria-label="Search bookmarks" [value]="queryInput()" (input)="onQuery(search.value)" placeholder="Search..." autocomplete="off">
    @if (store.error()) { <p role="alert">{{ store.error() }}</p> }
    @if (store.loading()) { <p role="status">Loading bookmarks…</p> }
    <div id="filter-cloud" class="cloud filter-cloud" role="group" aria-label="Bookmark filters">
      @if (foldersVisible()) {
      @for (folder of store.model().folders; track folder.id) {
        <button type="button" class="folder" [attr.aria-pressed]="filters().folderId === folder.id" [class.active]="filters().folderId === folder.id" (click)="toggleFolder(folder.id)">{{ folder.label }}</button>
      }
      }
      @for (tag of store.model().tags; track tag.key) {
        <button type="button" class="tag" [class.active]="filters().tags.has(tag.key)" [attr.aria-pressed]="filters().tags.has(tag.key)" (click)="toggleTag(tag.key)">#{{ tag.label }}</button>
      }
    </div>
    <app-bookmark-list [rows]="filtered()" (open)="store.open($event)" (edit)="openEditor($event)" />
    <p class="result-count" role="status">{{ filtered().length }} of {{ store.model().bookmarks.length }} bookmarks</p>
    @if (!store.loading() && !filtered().length) { <p>{{ store.model().bookmarks.length ? 'No matching bookmarks.' : 'No bookmarks yet.' }}</p> }
    <footer><button type="button" class="primary" [disabled]="store.busy() || store.loading()" (click)="addCurrentPage()">Add bookmark</button>
      <button type="button" (click)="resetFilters()">Reset filter</button>
      <button type="button" aria-controls="filter-cloud" [attr.aria-expanded]="foldersVisible()" (click)="foldersVisible.set(!foldersVisible())">{{ foldersVisible() ? 'Hide folders' : 'Show folders' }}</button>
      <button type="button" class="close-popup" aria-label="Close popup" (click)="closePopup()">×</button>
    </footer>
    </div>
    @if (editing(); as bookmark) { <app-bookmark-editor [bookmark]="bookmark" [model]="store.model()" (closed)="closeEditor()" /> }
  `,
})
export class App implements OnDestroy {
  readonly store = inject(BookmarkStore);
  readonly filters = signal<Filters>({ query: '', tags: new Set(), folderId: null });
  readonly filtered = computed(() => filterBookmarks(this.store.model(), this.filters()));
  readonly list = viewChild(BookmarkList);
  readonly queryInput = signal('');
  readonly foldersVisible = signal(true);
  readonly editing = signal<Bookmark | null>(null);
  private queryTimer?: ReturnType<typeof setTimeout>;
  private readonly injector = inject(Injector);
  private previousFocus?: HTMLElement;
  constructor() { void this.store.refresh(); }
  openEditor(bookmark: Bookmark): void {
    this.previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
    this.store.error.set(''); this.editing.set(bookmark);
  }
  closeEditor(): void {
    this.editing.set(null);
    afterNextRender(() => {
      const focus = this.previousFocus?.isConnected ? this.previousFocus : document.querySelector<HTMLElement>('input[type="search"]');
      focus?.focus();
    }, { injector: this.injector });
  }
  closePopup(): void { window.close(); }
  async addCurrentPage(): Promise<void> {
    this.previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
    const bookmark = await this.store.addCurrentPage();
    if (bookmark) this.editing.set(bookmark);
  }
  onQuery(value: string): void {
    this.queryInput.set(value);
    clearTimeout(this.queryTimer);
    this.queryTimer = setTimeout(() => {
      this.filters.update(filters => ({ ...filters, query: value }));
      this.list()?.resetScroll();
    }, 150);
  }
  private flushQuery(): void {
    clearTimeout(this.queryTimer);
    this.filters.update(filters => ({ ...filters, query: this.queryInput() }));
  }
  toggleTag(key: string): void {
    this.flushQuery();
    const tags = new Set(this.filters().tags);
    if (tags.has(key)) tags.delete(key); else tags.add(key);
    this.filters.update(filters => ({ ...filters, tags }));
    this.list()?.resetScroll();
  }
  toggleFolder(id: string): void {
    this.flushQuery();
    this.filters.update(filters => ({ ...filters, folderId: filters.folderId === id ? null : id }));
    this.list()?.resetScroll();
  }
  resetFilters(): void {
    clearTimeout(this.queryTimer);
    this.queryInput.set('');
    this.filters.set({ query: '', tags: new Set(), folderId: null });
    this.list()?.resetScroll();
  }
  ngOnDestroy(): void { clearTimeout(this.queryTimer); }
}
