import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BookmarkStore } from './bookmark-store';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header><strong>Chromtag</strong><button type="button" (click)="store.refresh()" [disabled]="store.loading()">Refresh</button></header>
    @if (store.error()) { <p role="alert">{{ store.error() }}</p> }
    @if (store.loading()) { <p role="status">Loading bookmarks…</p> }
    <main>
      @for (bookmark of store.model().bookmarks; track bookmark.id) {
        <article class="bookmark">
          <button class="title" type="button" (click)="store.open(bookmark.url)">{{ bookmark.displayTitle || bookmark.url }}</button>
          <div class="url">{{ bookmark.url }}</div>
          <div class="labels"><span class="folder">{{ bookmark.folderName }}</span>
            @for (tag of bookmark.tags; track tag.key) { <span class="tag">#{{ tag.label }}</span> }
          </div>
        </article>
      } @empty { @if (!store.loading()) { <p>No bookmarks yet.</p> } }
    </main>
  `,
})
export class App {
  readonly store = inject(BookmarkStore);
  constructor() { void this.store.refresh(); }
}
