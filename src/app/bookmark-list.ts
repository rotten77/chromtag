import { AfterViewInit, ChangeDetectionStrategy, Component, input, OnDestroy, output, signal, viewChild } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { Bookmark } from './model';

@Component({
  selector: 'app-bookmark-list',
  imports: [ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <cdk-virtual-scroll-viewport [itemSize]="rowHeight()" [minBufferPx]="rowHeight() * 2" [maxBufferPx]="rowHeight() * 4" role="list" aria-label="Bookmarks">
      <article class="bookmark" *cdkVirtualFor="let bookmark of rows(); trackBy: trackId" [style.height.px]="rowHeight()" role="listitem">
        <input class="bookmark-check" type="checkbox" [attr.aria-label]="'Select ' + (bookmark.displayTitle || bookmark.url)" [checked]="selected().has(bookmark.id)" (change)="selectionChanged.emit({ id: bookmark.id, checked: $any($event.target).checked })">
        <button class="title" type="button" [title]="bookmark.title" (click)="open.emit(bookmark.url)">{{ bookmark.displayTitle || bookmark.url }}</button>
        <div class="url" [title]="bookmark.url">{{ bookmark.url }}</div>
        <div class="labels">
          @if (bookmark.folderName) { <span class="folder" [title]="bookmark.folderName">{{ bookmark.folderName }}</span> }
          @for (tag of bookmark.tags; track tag.key) { <span class="tag">#{{ tag.label }}</span> }
        </div>
        <button class="edit" type="button" [attr.aria-label]="'Edit ' + (bookmark.displayTitle || bookmark.url)" (click)="edit.emit(bookmark)">Edit</button>
      </article>
    </cdk-virtual-scroll-viewport>
  `,
  styles: `:host { display: block; flex: 1 1 0; min-height: 0; min-width: 0; width: 100%; } cdk-virtual-scroll-viewport { height: 100%; width: 100%; } .bookmark { display: grid; grid-template-columns: 1.7rem minmax(0, 1fr) auto; align-content: start; column-gap: .35rem; width: 100%; max-width: 100%; min-width: 0; overflow: hidden; } .bookmark-check { grid-column: 1; grid-row: 1; align-self: start; width: 1.3rem; height: 1.3rem; margin: .1rem 0 0; cursor: pointer; } .title, .url, .labels { grid-column: 2; min-width: 0; overflow: hidden; white-space: nowrap; } .title, .url { display: block; max-width: 100%; text-overflow: ellipsis; } .labels { flex-wrap: nowrap; } .folder { max-width: 45%; overflow: hidden; text-overflow: ellipsis; flex-shrink: 0; } .tag { flex-shrink: 0; } .edit { grid-column: 3; grid-row: 1 / span 3; align-self: start; }`,
})
export class BookmarkList implements AfterViewInit, OnDestroy {
  readonly rows = input.required<Bookmark[]>();
  readonly selected = input.required<ReadonlySet<string>>();
  readonly selectionChanged = output<{ id: string; checked: boolean }>();
  readonly open = output<string>();
  readonly edit = output<Bookmark>();
  readonly rowHeight = signal(this.fontRowHeight());
  readonly viewport = viewChild.required(CdkVirtualScrollViewport);
  private observer?: ResizeObserver;
  private fontObserver?: MutationObserver;
  readonly trackId = (_: number, bookmark: Bookmark): string => bookmark.id;
  ngAfterViewInit(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(() => this.updateViewport());
      this.observer.observe(this.viewport().elementRef.nativeElement);
    }
    this.fontObserver = new MutationObserver(() => this.updateViewport());
    this.fontObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });
  }
  private fontRowHeight(): number { return (parseFloat(getComputedStyle(document.documentElement).fontSize) || 13) * 5.6; }
  private updateViewport(): void { this.rowHeight.set(this.fontRowHeight()); this.viewport().checkViewportSize(); }
  resetScroll(): void { this.viewport().scrollToIndex(0); }
  ngOnDestroy(): void { this.observer?.disconnect(); this.fontObserver?.disconnect(); }
}
