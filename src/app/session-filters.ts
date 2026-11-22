import { Filters } from './model';
import { OrderedWrites } from './ordered-writes';

const key = 'sessionFilters';
interface SessionArea {
  get(key: string | string[]): Promise<Record<string, unknown>>;
  set(items: Record<string, unknown>): Promise<void>;
  remove(key: string): Promise<void>;
}

/** The popup owns the model; only these three filter fields cross the storage boundary. */
export class SessionFilters {
  private readonly savedFilters = new OrderedWrites();
  private readonly enabledPreference = new OrderedWrites();
  private readonly foldersPreference = new OrderedWrites();
  constructor(private readonly area: SessionArea, private readonly preferences: Pick<SessionArea, 'get' | 'set'>) {}

  async options() {
    const values = await this.preferences.get(['rememberFilters', 'showFolders']);
    return { rememberFilters: values['rememberFilters'] !== false, showFolders: values['showFolders'] !== false };
  }

  setShowFolders(showFolders: boolean): Promise<void> {
    return this.foldersPreference.enqueue(() => this.preferences.set({ showFolders }));
  }

  setEnabled(enabled: boolean): Promise<void> {
    return this.enabledPreference.enqueue(() => this.preferences.set({ rememberFilters: enabled }));
  }

  clear(): Promise<void> { return this.savedFilters.enqueue(() => this.area.remove(key)); }

  async read(): Promise<Filters | null> {
    const value: unknown = (await this.area.get(key))[key];
    if (!value || typeof value !== 'object' || !('query' in value) || typeof value.query !== 'string'
      || !('folderId' in value) || !(value.folderId === null || typeof value.folderId === 'string')
      || !('tags' in value) || !Array.isArray(value.tags) || !value.tags.every(tag => typeof tag === 'string')) return null;
    return { query: value.query, folderId: value.folderId, tags: new Set(value.tags) };
  }

  save({ query, tags, folderId }: Filters): Promise<void> {
    const value = { query, tags: [...tags], folderId };
    return this.savedFilters.enqueue(() => !query && !value.tags.length && folderId === null
      ? this.area.remove(key) : this.area.set({ [key]: value }));
  }
}
