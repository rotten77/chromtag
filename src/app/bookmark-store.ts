import { inject, Injectable, signal } from '@angular/core';
import { CHROME } from './chrome-api';
import { Bookmark, buildModel, countBookmarkNodes, ModelBuilder } from './model';

export interface BookmarkDraft { id: string; title: string; url: string; parentId: string; originalParentId?: string }

@Injectable({ providedIn: 'root' })
export class BookmarkStore {
  readonly api = inject(CHROME);
  readonly model = signal(buildModel([]));
  readonly loading = signal(false);
  readonly progress = signal<{ processed: number; total: number } | null>(null);
  readonly phase = signal<'idle' | 'reading' | 'processing'>('idle');
  readonly error = signal('');
  readonly busy = signal(false);
  private pending?: Promise<void>;

  refresh(): Promise<void> {
    if (this.pending) return this.pending;
    this.loading.set(true);
    this.phase.set('reading');
    this.progress.set(null);
    this.error.set('');
    this.pending = Promise.resolve().then(() => this.api.bookmarks.getTree()).then(async tree => {
      const total = countBookmarkNodes(tree); // Includes unsupported URL nodes so progress reflects the snapshot.
      const builder = new ModelBuilder(tree);
      this.phase.set('processing');
      this.progress.set({ processed: 0, total });
      // Yield for large snapshots; keep small loads and existing interactions immediate.
      if (total >= 1000) await new Promise<void>(resolve => {
        requestAnimationFrame(() => setTimeout(resolve, 0));
      });
      while (!builder.done) {
        const start = performance.now();
        do { builder.step(256); } while (!builder.done && (total < 1000 || performance.now() - start < 8));
        if (builder.done) break;
        this.progress.set({ processed: builder.processed, total });
        await new Promise<void>(resolve => setTimeout(resolve, 0));
      }
      this.model.set(builder.finish());
    })
      .catch(() => { this.error.set('Bookmarks could not be loaded. Try Refresh.'); })
      .finally(() => { this.phase.set('idle'); this.progress.set(null); this.loading.set(false); this.pending = undefined; });
    return this.pending;
  }

  async open(url: string, target: 'current' | 'new' = 'current'): Promise<boolean> {
    try {
      if (target === 'new') await this.api.tabs.create({ url });
      else {
        const [tab] = await this.api.tabs.query({ active: true, currentWindow: true });
        if (tab?.id === undefined) throw new Error('No active tab');
        await this.api.tabs.update(tab.id, { url });
      }
      return true;
    } catch {
      this.error.set('This bookmark could not be opened.');
      return false;
    }
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

  async addCurrentPage(): Promise<Bookmark | undefined> {
    if (this.busy()) return undefined;
    this.busy.set(true);
    this.error.set('');
    try {
      const [tab] = await this.api.tabs.query({ active: true, currentWindow: true });
      if (typeof tab?.title !== 'string' || !tab.title.trim() || typeof tab.url !== 'string' || !tab.url.trim()) {
        this.error.set('This page cannot be saved because Chrome did not provide its title and URL.');
        return undefined;
      }
      // Omitting parentId deliberately uses Chrome's default destination.
      const created = await this.api.bookmarks.create({ title: tab.title, url: tab.url });
      await this.refresh();
      const bookmark = this.model().bookmarks.find(row => row.id === created.id) ?? buildModel([created]).bookmarks[0];
      return bookmark ? { ...bookmark, parentId: created.parentId } : undefined;
    } catch {
      this.error.set('The current page could not be saved. Chrome may not expose this page under activeTab.');
      return undefined;
    } finally { this.busy.set(false); }
  }
}
