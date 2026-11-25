import { InjectionToken } from '@angular/core';

export interface ChromeApi {
  runtime: Pick<typeof chrome.runtime, 'sendMessage'>;
  bookmarks: Pick<typeof chrome.bookmarks, 'getTree' | 'create' | 'update' | 'move' | 'remove'>;
  storage: Pick<typeof chrome['storage'], 'local' | 'session'>;
  tabs: Pick<typeof chrome.tabs, 'query' | 'create' | 'update'>;
}

export const CHROME = new InjectionToken<ChromeApi>('Native Chrome APIs', {
  providedIn: 'root',
  factory: () => {
    if (typeof chrome === 'undefined' || !chrome.bookmarks) {
      throw new Error('Open Chromtag from the Chrome extension action.');
    }
    return chrome;
  },
});
