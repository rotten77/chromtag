import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BookmarkStore } from './bookmark-store';
import { BookmarkList } from './bookmark-list';

@Component({
  selector: 'app-root',
  imports: [BookmarkList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header><strong>Chromtag</strong><button type="button" (click)="store.refresh()" [disabled]="store.loading()">Refresh</button></header>
    @if (store.error()) { <p role="alert">{{ store.error() }}</p> }
    @if (store.loading()) { <p role="status">Loading bookmarks…</p> }
    <app-bookmark-list [rows]="store.model().bookmarks" (open)="store.open($event)" />
    @if (!store.loading() && !store.model().bookmarks.length) { <p>No bookmarks yet.</p> }
  `,
})
export class App {
  readonly store = inject(BookmarkStore);
  constructor() { void this.store.refresh(); }
}
