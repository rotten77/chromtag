import { inject, Injectable, signal } from '@angular/core';
import { CHROME } from './chrome-api';
import { buildModel } from './model';

@Injectable({ providedIn: 'root' })
export class BookmarkStore {
  readonly api = inject(CHROME);
  readonly model = signal(buildModel([]));
  readonly loading = signal(false);
  readonly error = signal('');
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
}
