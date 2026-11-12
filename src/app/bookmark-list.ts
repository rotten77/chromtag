import { AfterViewInit, ChangeDetectionStrategy, Component, input, OnDestroy, output, viewChild } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { Bookmark } from './model';

@Component({
  selector: 'app-bookmark-list',
  imports: [ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <cdk-virtual-scroll-viewport [itemSize]="84" [minBufferPx]="168" [maxBufferPx]="336" role="list" aria-label="Bookmarks">
      <article class="bookmark" *cdkVirtualFor="let bookmark of rows(); trackBy: trackId" role="listitem">
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
  styles: `:host { display: block; flex: 1; min-height: 0; } cdk-virtual-scroll-viewport { height: 100%; width: 100%; } .bookmark { height: 84px; overflow: hidden; } .title { display: block; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .labels { flex-wrap: nowrap; white-space: nowrap; overflow: auto; } .folder { max-width: 45%; overflow: hidden; text-overflow: ellipsis; flex-shrink: 0; } .tag { flex-shrink: 0; }`,
})
export class BookmarkList implements AfterViewInit, OnDestroy {
  readonly rows = input.required<Bookmark[]>();
  readonly open = output<string>();
  readonly edit = output<Bookmark>();
  readonly viewport = viewChild.required(CdkVirtualScrollViewport);
  private observer?: ResizeObserver;
  readonly trackId = (_: number, bookmark: Bookmark): string => bookmark.id;
  ngAfterViewInit(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(() => this.viewport().checkViewportSize());
      this.observer.observe(this.viewport().elementRef.nativeElement);
    }
  }
  resetScroll(): void { this.viewport().scrollToIndex(0); }
  ngOnDestroy(): void { this.observer?.disconnect(); }
}
