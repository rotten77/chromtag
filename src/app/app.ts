import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { BookmarkStore } from './bookmark-store';
import { BookmarkList } from './bookmark-list';
import { filterBookmarks, Filters } from './model';
import { Bookmark } from './model';
import { BookmarkEditor } from './bookmark-editor';

@Component({
  selector: 'app-root',
  imports: [BookmarkList, BookmarkEditor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="popup-content" [inert]="!!editing()">
    <header><strong>Chromtag</strong><button type="button" (click)="store.refresh()" [disabled]="store.loading() || store.busy()">Refresh</button></header>
    <label class="search">Search bookmarks<input #search type="search" [value]="queryInput()" (input)="onQuery(search.value)" placeholder="Title, folder, or URL" autocomplete="off"></label>
    @if (store.error()) { <p role="alert">{{ store.error() }}</p> }
    @if (store.loading()) { <p role="status">Loading bookmarks…</p> }
    @if (foldersVisible()) {
    <section id="folder-cloud" class="cloud folder-cloud" aria-label="Folder filters">
      @for (folder of store.model().folders; track folder.id) {
        <button type="button" class="folder" [attr.aria-pressed]="filters().folderId === folder.id" [class.active]="filters().folderId === folder.id" (click)="toggleFolder(folder.id)">{{ folder.label }}</button>
      }
    </section>
    }
    <section class="cloud tag-cloud" aria-label="Tag filters">
      @for (tag of store.model().tags; track tag.key) {
        <button type="button" class="tag" [class.active]="filters().tags.has(tag.key)" [attr.aria-pressed]="filters().tags.has(tag.key)" (click)="toggleTag(tag.key)">#{{ tag.label }}</button>
      }
    </section>
    <app-bookmark-list [rows]="filtered()" (open)="store.open($event)" (edit)="openEditor($event)" />
    <p class="result-count" role="status">{{ filtered().length }} of {{ store.model().bookmarks.length }} bookmarks</p>
    @if (!store.loading() && !filtered().length) { <p>{{ store.model().bookmarks.length ? 'No matching bookmarks.' : 'No bookmarks yet.' }}</p> }
    <footer><button type="button" class="primary" [disabled]="store.busy() || store.loading()" (click)="addCurrentPage()">Add bookmark</button>
      <button type="button" (click)="resetFilters()">Reset filter</button>
      <button type="button" aria-controls="folder-cloud" [attr.aria-expanded]="foldersVisible()" (click)="foldersVisible.set(!foldersVisible())">{{ foldersVisible() ? 'Hide folders' : 'Show folders' }}</button>
    </footer>
    </div>
    @if (editing(); as bookmark) { <app-bookmark-editor [bookmark]="bookmark" [model]="store.model()" (closed)="editing.set(null)" /> }
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
  constructor() { void this.store.refresh(); }
  openEditor(bookmark: Bookmark): void { this.store.error.set(''); this.editing.set(bookmark); }
  async addCurrentPage(): Promise<void> {
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
