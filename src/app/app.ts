import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, Injector, OnDestroy, signal, viewChild } from '@angular/core';
import { BookmarkStore } from './bookmark-store';
import { BookmarkList } from './bookmark-list';
import { Bookmark, filterBookmarks, Filters } from './model';
import { BookmarkEditor } from './bookmark-editor';
import { FilterCloud } from './filter-cloud';
import { AppearanceSettings } from './appearance-settings';
import { CHROME } from './chrome-api';
import { SessionFilters } from './session-filters';
import { OrderedWrites } from './ordered-writes';

@Component({
  selector: 'app-root',
  imports: [BookmarkList, BookmarkEditor, FilterCloud, AppearanceSettings],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="popup-content" [inert]="!!editing()">
    <div class="filter-heading">
      <h1>Filters</h1>
      <button type="button" class="clear-filters" (click)="resetFilters()">Clear filters</button>
      <button type="button" class="primary add-bookmark" [disabled]="store.busy() || store.loading()" (click)="addCurrentPage()">Add bookmark</button>
      <button type="button" commandfor="popup-options" command="show-modal" aria-haspopup="dialog">Options</button>
      <dialog id="popup-options" closedby="any" aria-labelledby="options-title">
        <h2 id="options-title">Options</h2>
        <label><input type="checkbox" #showFolders aria-controls="filter-cloud" [checked]="foldersVisible()" [disabled]="!settingsReady()" (change)="setShowFolders(showFolders.checked)"> Show folders</label>
        <label><input type="checkbox" #clearOnOpen [checked]="!rememberFilters()" [disabled]="!settingsReady()" (change)="setRemember(!clearOnOpen.checked)"> Clear filters on popup</label>
        <div class="click-settings-section"><fieldset class="click-settings" aria-label="Bookmark opening preferences" [disabled]="!clickSettingsReady()">
          <label><input type="checkbox" [checked]="clickTarget() === 'new'" (change)="setClickPreferences({target: $any($event.target).checked ? 'new' : 'current'})"> Open bookmarks in new tab</label>
          <label><input type="checkbox" [checked]="closeOnOpen()" (change)="setClickPreferences({close: $any($event.target).checked})"> Close popup after opening a bookmark</label>
        </fieldset></div>
        <app-appearance />
        <div class="editor-actions">
          <button type="button" commandfor="popup-options" command="close" (click)="store.refresh()" [disabled]="store.loading() || store.busy()">Refresh</button>
          <button type="button" class="primary" commandfor="popup-options" command="close">Done</button>
        </div>
      </dialog>
    </div>
    @if (storageError()) { <p role="alert">{{ storageError() }}</p> }
    @if (store.error()) { <p role="alert">{{ store.error() }}</p> }
    <span class="sr-only" role="status" aria-live="polite">{{ store.phase() === 'reading' ? 'Reading bookmarks from Chrome' : store.phase() === 'processing' ? 'Processing bookmarks' : '' }}</span>
    @if (store.loading()) {
      <div class="loading-progress" aria-label="Bookmark loading status">
        @if (store.phase() === 'reading') { <span>Reading bookmarks from Chrome…</span> }
        @else {
          <span>Processing bookmarks and hashtags: {{ store.progress()?.processed }}/{{ store.progress()?.total }}</span>
          @if ((store.progress()?.total ?? 0) >= 10000) { <span>Large libraries can take longer. Chromtag was tested with 10,001 synthetic bookmarks; this is not a guaranteed limit or time.</span> }
        }
      </div>
    }
    <div class="workspace">
    <app-filter-cloud [folders]="store.model().folders" [tags]="store.model().tags" [showFolders]="foldersVisible()"
      [selectedFolder]="filters().folderId" [selectedTags]="filters().tags" (folderSelected)="toggleFolder($event)" (tagSelected)="toggleTag($event)" />
    <div class="results-tools"><p class="result-count" role="status">{{ filtered().length }} of {{ store.model().bookmarks.length }} bookmarks</p>
      <input #search class="search-field" type="search" aria-label="Search bookmarks" [value]="queryInput()" (input)="onQuery(search.value)" placeholder="Search bookmarks…" autocomplete="off">
    </div>
    <app-bookmark-list [rows]="filtered()" (open)="openBookmark($event)" (edit)="openEditor($event)" />
    </div>
    @if (!store.loading() && !filtered().length) { <p>{{ store.model().bookmarks.length ? 'No matching bookmarks.' : 'No bookmarks yet.' }}</p> }
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
  readonly rememberFilters = signal(true);
  readonly settingsReady = signal(false);
  readonly storageError = signal('');
  private readonly storage = inject(CHROME).storage;
  private readonly session = this.storage && new SessionFilters(this.storage.session, this.storage.local);
  private filtersTouched = false;
  readonly clickTarget = signal<'current' | 'new'>('current');
  readonly closeOnOpen = signal(true);
  readonly clickSettingsReady = signal(false);
  private clickSettingsTouched = false;
  private readonly clickWrites = new OrderedWrites();
  private showFoldersTouched = false;
  private rememberFiltersTouched = false;

  constructor() { void this.store.refresh(); void this.restoreSession(); void this.restoreClickPreferences(); }

  private async restoreClickPreferences(): Promise<void> {
    if (!this.storage?.local) return;
    try {
      const saved = (await this.storage.local.get('bookmarkClicks'))['bookmarkClicks'];
      if (!this.clickSettingsTouched && saved && typeof saved === 'object') {
        const preferences = saved as Record<string, unknown>;
        this.clickTarget.set(preferences['target'] === 'new' ? 'new' : 'current');
        this.closeOnOpen.set(typeof preferences['close'] === 'boolean' ? preferences['close'] : true);
      }
      this.clickSettingsReady.set(true);
    } catch { this.storageError.set('Bookmark-click settings could not be loaded.'); }
  }

  setClickPreferences(patch: { target?: 'current' | 'new'; close?: boolean }): void {
    this.clickSettingsTouched = true;
    if (patch.target) this.clickTarget.set(patch.target);
    if (patch.close !== undefined) this.closeOnOpen.set(patch.close);
    const value = {target: this.clickTarget(), close: this.closeOnOpen()};
    void this.clickWrites.enqueue(() => this.storage.local.set({bookmarkClicks: value}))
      .catch(() => this.storageError.set('Bookmark-click settings could not be saved.'));
  }

  async openBookmark(url: string): Promise<void> {
    const opened = await this.store.open(url, this.clickTarget());
    if (opened && this.closeOnOpen()) window.close();
  }

  private async restoreSession(): Promise<void> {
    try {
      const options = await this.session.options();
      if (!this.showFoldersTouched) this.foldersVisible.set(options.showFolders);
      if (!this.rememberFiltersTouched) this.rememberFilters.set(options.rememberFilters);
      if (this.rememberFilters()) {
        const saved = await this.session.read();
        if (saved && !this.filtersTouched) {
          this.filters.set(saved);
          this.queryInput.set(saved.query);
        }
      }
      this.settingsReady.set(true);
      if (this.filtersTouched) this.saveFilters();
    } catch {
      this.storageError.set('Session settings are unavailable. You can still filter bookmarks.');
    }
  }

  private saveFilters(): void {
    this.filtersTouched = true;
    if (this.settingsReady() && this.rememberFilters()) {
      // Queue the latest snapshot independently of search debounce; same-key writes stay ordered.
      void this.session.save({ ...this.filters(), query: this.queryInput() }).catch(() => this.storageError.set('Could not save session filters.'));
    }
  }

  setShowFolders(visible: boolean): void {
    this.showFoldersTouched = true;
    this.foldersVisible.set(visible);
    void this.session.setShowFolders(visible).catch(() => this.storageError.set('Could not save folder visibility.'));
  }

  setRemember(enabled: boolean): void {
    this.rememberFiltersTouched = true;
    this.rememberFilters.set(enabled);
    void this.session.setEnabled(enabled).catch(() => this.storageError.set('Could not save the Clear filters on popup preference.'));
    if (enabled && this.settingsReady()) this.saveFilters();
    else if (!enabled) void this.session.clear().catch(() => this.storageError.set('Could not clear saved session filters.'));
  }
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
  async addCurrentPage(): Promise<void> {
    this.previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
    const bookmark = await this.store.addCurrentPage();
    if (bookmark) this.editing.set(bookmark);
  }
  onQuery(value: string): void {
    this.queryInput.set(value);
    this.saveFilters();
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
    this.saveFilters();
    this.list()?.resetScroll();
  }
  toggleFolder(id: string): void {
    this.flushQuery();
    this.filters.update(filters => ({ ...filters, folderId: filters.folderId === id ? null : id }));
    this.saveFilters();
    this.list()?.resetScroll();
  }
  resetFilters(): void {
    clearTimeout(this.queryTimer);
    this.queryInput.set('');
    this.filters.set({ query: '', tags: new Set(), folderId: null });
    this.saveFilters();
    this.list()?.resetScroll();
  }
  ngOnDestroy(): void { clearTimeout(this.queryTimer); }
}
