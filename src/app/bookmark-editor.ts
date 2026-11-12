import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { BookmarkStore } from './bookmark-store';
import { Bookmark, Model, newTag, parseTags, Tag, toggleTitleTag } from './model';

@Component({
  selector: 'app-bookmark-editor',
  imports: [FormsModule, A11yModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overlay" (click)="close()" (keydown.escape)="close(); $event.stopPropagation()">
      <section class="editor" role="dialog" aria-modal="true" aria-labelledby="editor-heading" cdkTrapFocus [cdkTrapFocusAutoCapture]="true" (click)="$event.stopPropagation()">
        <h2 id="editor-heading">Edit bookmark</h2>
        <form (ngSubmit)="save()">
          <label for="edit-title">Title</label>
          <textarea id="edit-title" name="title" cdkFocusInitial [ngModel]="title()" (ngModelChange)="title.set($event)" [disabled]="store.busy()" rows="3"></textarea>
          <div class="editor-tags cloud" aria-label="Bookmark tags">
            @for (tag of availableTags(); track tag.key) {
              <button type="button" class="tag" [attr.aria-pressed]="selectedTags().has(tag.key)" [class.active]="selectedTags().has(tag.key)" (click)="toggleTag(tag)" [disabled]="store.busy()">#{{ tag.label }}</button>
            }
          </div>
          <label for="new-tag">New tag</label>
          <div class="new-tag"><input id="new-tag" name="newTag" [(ngModel)]="tagInput" placeholder="Optional #, no spaces" [disabled]="store.busy()" (keydown.enter)="addTag(); $event.preventDefault()">
            <button type="button" (click)="addTag()" [disabled]="store.busy()">Add tag</button></div>
          <label for="edit-url">URL</label>
          <input id="edit-url" name="url" type="url" required [(ngModel)]="url" [disabled]="store.busy()">
          <label for="edit-folder">Folder</label>
          <select id="edit-folder" name="folder" [(ngModel)]="parentId" [disabled]="store.busy()">
            @for (folder of model().folders; track folder.id) { <option [value]="folder.id" [disabled]="!folder.editable">{{ folder.label }}</option> }
          </select>
          @if (error() || store.error()) { <p role="alert">{{ error() || store.error() }}</p> }
          <div class="editor-actions"><button type="submit" class="primary" [disabled]="store.busy()">Save</button>
            <button type="button" (click)="close()" [disabled]="store.busy()">Cancel</button>
            <button type="button" class="danger" (click)="remove()" [disabled]="store.busy()">Delete</button></div>
        </form>
      </section>
    </div>
  `,
})
export class BookmarkEditor implements OnInit {
  readonly bookmark = input.required<Bookmark>();
  readonly model = input.required<Model>();
  readonly closed = output<void>();
  readonly store = inject(BookmarkStore);
  readonly title = signal('');
  readonly error = signal('');
  readonly selectedTags = computed(() => new Set(parseTags(this.title()).map(tag => tag.key)));
  readonly availableTags = computed(() => {
    const tags = new Map(this.model().tags.map(tag => [tag.key, tag]));
    for (const tag of parseTags(this.title())) if (!tags.has(tag.key)) tags.set(tag.key, tag);
    return [...tags.values()];
  });
  url = '';
  parentId = '';
  tagInput = '';
  ngOnInit(): void {
    const bookmark = this.bookmark();
    this.title.set(bookmark.title);
    this.url = bookmark.url;
    this.parentId = bookmark.parentId ?? '';
  }
  toggleTag(tag: Tag): void { this.title.set(toggleTitleTag(this.title(), tag)); this.error.set(''); }
  addTag(): void {
    const tag = newTag(this.tagInput);
    if (!tag) { this.error.set('Enter a tag with no spaces or extra # characters.'); return; }
    if (!this.selectedTags().has(tag.key)) this.title.set(toggleTitleTag(this.title(), tag));
    this.tagInput = '';
    this.error.set('');
  }
  async save(): Promise<void> {
    this.error.set('');
    if (!this.url.trim()) { this.error.set('Enter a URL.'); return; }
    if (await this.store.save({ id: this.bookmark().id, title: this.title(), url: this.url, parentId: this.parentId, originalParentId: this.bookmark().parentId })) this.closed.emit();
  }
  async remove(): Promise<void> { if (await this.store.remove(this.bookmark().id)) this.closed.emit(); }
  close(): void { if (!this.store.busy()) this.closed.emit(); }
}
