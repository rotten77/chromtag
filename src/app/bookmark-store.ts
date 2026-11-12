import { inject, Injectable, signal } from '@angular/core';
import { CHROME } from './chrome-api';
import { buildModel } from './model';

export interface BookmarkDraft { id: string; title: string; url: string; parentId: string; originalParentId?: string }

@Injectable({ providedIn: 'root' })
export class BookmarkStore {
  readonly api = inject(CHROME);
  readonly model = signal(buildModel([]));
  readonly loading = signal(false);
  readonly error = signal('');
  readonly busy = signal(false);
  private pending?: Promise<void>;

  refresh(): Promise<void> {
    if (this.pending) return this.pending;
    this.loading.set(true);
    this.error.set('');
    this.pending = this.api.bookmarks.getTree().then(tree => { this.model.set(buildModel(tree)); })
      .catch(() => { this.error.set('Bookmarks could not be loaded. Try Refresh.'); })
      .finally(() => { this.loading.set(false); this.pending = undefined; });
    return this.pending;
  }

  async open(url: string): Promise<void> {
    try { await this.api.tabs.create({ url }); }
    catch { this.error.set('This bookmark could not be opened.'); }
  }

  async save(draft: BookmarkDraft): Promise<boolean> {
    if (this.busy()) return false;
    this.busy.set(true);
    this.error.set('');
    let updated = false;
    let failed = false;
    try {
      await this.api.bookmarks.update(draft.id, { title: draft.title, url: draft.url.trim() });
      updated = true;
      if (draft.parentId !== draft.originalParentId) await this.api.bookmarks.move(draft.id, { parentId: draft.parentId });
    } catch {
      failed = true;
    }
    // A move can fail after update succeeds. Refresh that actual partial state exactly once.
    if (updated) await this.refresh();
    if (failed) this.error.set(updated ? 'Details saved, but the bookmark could not be moved. Review the folder and try again.' : 'The bookmark could not be saved. Your unsaved fields remain in the editor.');
    this.busy.set(false);
    return !failed;
  }

  async remove(id: string): Promise<boolean> {
    if (this.busy()) return false;
    this.busy.set(true);
    this.error.set('');
    try {
      await this.api.bookmarks.remove(id);
      await this.refresh();
      return true;
    } catch {
      this.error.set('The bookmark could not be deleted. Try again.');
      return false;
    } finally { this.busy.set(false); }
  }
}
