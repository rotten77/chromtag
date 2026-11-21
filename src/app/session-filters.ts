import { Filters } from './model';

const key = 'sessionFilters';
interface SessionArea {
  get(key: string | string[]): Promise<Record<string, unknown>>;
  set(items: Record<string, unknown>): Promise<void>;
  remove(key: string): Promise<void>;
}

/** The popup owns the model; only these three filter fields cross the storage boundary. */
export class SessionFilters {
  constructor(private readonly area: SessionArea, private readonly preferences: Pick<SessionArea, 'get' | 'set'>) {}

  async options() {
    const values = await this.preferences.get(['rememberFilters', 'showFolders']);
    return { rememberFilters: values['rememberFilters'] !== false, showFolders: values['showFolders'] !== false };
  }

  setShowFolders(showFolders: boolean): Promise<void> {
    return this.preferences.set({ showFolders });
  }

  setEnabled(enabled: boolean): Promise<void> {
    return this.preferences.set({ rememberFilters: enabled });
  }

  clear(): Promise<void> { return this.area.remove(key); }

  async read(): Promise<Filters | null> {
    const value: unknown = (await this.area.get(key))[key];
    if (!value || typeof value !== 'object' || !('query' in value) || typeof value.query !== 'string'
      || !('folderId' in value) || !(value.folderId === null || typeof value.folderId === 'string')
      || !('tags' in value) || !Array.isArray(value.tags) || !value.tags.every(tag => typeof tag === 'string')) return null;
    return { query: value.query, folderId: value.folderId, tags: new Set(value.tags) };
  }

  async save({ query, tags, folderId }: Filters): Promise<void> {
    if (!query && !tags.size && folderId === null) await this.clear();
    else await this.area.set({ [key]: { query, tags: [...tags], folderId } });
  }
}
