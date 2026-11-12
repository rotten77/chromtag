import { InjectionToken } from '@angular/core';

export interface ChromeApi {
  bookmarks: Pick<typeof chrome.bookmarks, 'getTree' | 'create' | 'update' | 'move' | 'remove'>;
  tabs: Pick<typeof chrome.tabs, 'query' | 'create'>;
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
