import { afterRenderEffect, AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, input, OnDestroy, output, signal, viewChild, viewChildren } from '@angular/core';
import { Folder, Tag } from './model';

interface FilterChoice { key: string; id: string; label: string; kind: 'folder' | 'tag' }

@Component({
  selector: 'app-filter-cloud', changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (hasMore() || history().length) {
      <nav class="cloud-paging" aria-label="Filter pages">
        <button type="button" aria-label="First filters" (click)="first()" [disabled]="!history().length">First</button>
        <button type="button" aria-label="Previous filters" (click)="previous()" [disabled]="!history().length">Previous</button>
        <span role="status">{{ start() + 1 }}–{{ start() + visibleCount() }} of {{ choices().length }}</span>
        <button type="button" aria-label="Next filters" (click)="next()" [disabled]="!hasMore() || !pageReady()">Next</button>
      </nav>
    }
    <div #cloud id="filter-cloud" class="cloud filter-cloud" role="group" aria-label="Bookmark filters" [attr.aria-busy]="!pageReady()">
      @for (choice of remaining(); track choice.key; let index = $index) {
        <button #choiceButton type="button" [class.folder]="choice.kind === 'folder'" [class.tag]="choice.kind === 'tag'"
          [class.active]="isSelected(choice)" [attr.aria-pressed]="isSelected(choice)" [title]="choice.label"
          [inert]="index >= visibleCount()" [attr.aria-hidden]="index >= visibleCount() ? true : null"
          [style.visibility]="index >= visibleCount() ? 'hidden' : null" (click)="select(choice)">{{ choice.label }}</button>
      }
    </div>
  `,
  styles: `:host { display: flex; flex-direction: column; flex-shrink: 0; min-width: 0; max-height: min(16rem, calc(100% - 20rem)); } .filter-cloud { min-height: 0; max-height: 14rem; overflow: hidden; align-content: flex-start; } .filter-cloud > button { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .cloud-paging { display: flex; align-items: center; gap: .3rem; padding: .4rem .65rem 0; font-size: .85em; flex-shrink: 0; } .cloud-paging button { padding: .15em .35em; } .cloud-paging button:disabled { cursor: default; } .cloud-paging span { margin-left: auto; white-space: nowrap; }`,
})
export class FilterCloud implements AfterViewInit, OnDestroy {
  readonly folders = input.required<Folder[]>();
  readonly tags = input.required<Tag[]>();
  readonly showFolders = input(true);
  readonly selectedFolder = input<string | null>(null);
  readonly selectedTags = input<ReadonlySet<string>>(new Set());
  readonly folderSelected = output<string>();
  readonly tagSelected = output<string>();
  readonly choices = computed<FilterChoice[]>(() => [
    ...(this.showFolders() ? this.folders().map(folder => ({ key: `folder:${folder.id}`, id: folder.id, label: folder.label, kind: 'folder' as const })) : []),
    ...this.tags().map(tag => ({ key: `tag:${tag.key}`, id: tag.key, label: `#${tag.label}`, kind: 'tag' as const })),
  ]);
  readonly start = signal(0);
  readonly visibleCount = signal(0);
  readonly history = signal<number[]>([]);
  readonly pageReady = signal(false);
  readonly remaining = computed(() => this.choices().slice(this.start()));
  readonly hasMore = computed(() => this.start() + this.visibleCount() < this.choices().length);
  private readonly cloud = viewChild.required<ElementRef<HTMLElement>>('cloud');
  private readonly buttons = viewChildren<ElementRef<HTMLButtonElement>>('choiceButton');
  private readonly sizeVersion = signal(0);
  private observer?: ResizeObserver;
  constructor() {
    effect(() => { this.choices(); this.start.set(0); this.history.set([]); this.invalidate(); });
    // Clipped labels retain layout for measurement, but stay out of view, focus, and the accessibility tree.
    // Input/page/size changes invalidate this read; bookmark scrolling does not scan the cloud.
    afterRenderEffect({ read: () => {
      this.sizeVersion();
      this.remaining();
      const buttons = this.buttons();
      const cloud = this.cloud().nativeElement;
      const bottom = cloud.getBoundingClientRect().bottom - parseFloat(getComputedStyle(cloud).paddingBottom || '0');
      let count = 0;
      for (const button of buttons) {
        if (button.nativeElement.getBoundingClientRect().bottom > bottom + .5) break;
        count++;
      }
      this.visibleCount.set(buttons.length ? Math.max(1, count) : 0);
      this.pageReady.set(true);
    } });
  }
  ngAfterViewInit(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(() => this.invalidate());
      this.observer.observe(this.cloud().nativeElement);
    }
  }
  isSelected(choice: FilterChoice): boolean { return choice.kind === 'folder' ? this.selectedFolder() === choice.id : this.selectedTags().has(choice.id); }
  select(choice: FilterChoice): void { if (choice.kind === 'folder') this.folderSelected.emit(choice.id); else this.tagSelected.emit(choice.id); }
  next(): void {
    if (!this.hasMore() || !this.visibleCount() || !this.pageReady()) return;
    this.history.update(history => [...history, this.start()]);
    this.start.update(start => start + this.visibleCount());
    this.invalidate();
  }
  previous(): void {
    const previous = this.history().at(-1);
    if (previous === undefined) return;
    this.start.set(previous); this.history.update(history => history.slice(0, -1));
    this.invalidate();
  }
  first(): void { this.start.set(0); this.history.set([]); this.invalidate(); }
  private invalidate(): void { this.pageReady.set(false); this.sizeVersion.update(value => value + 1); }
  ngOnDestroy(): void { this.observer?.disconnect(); }
}
