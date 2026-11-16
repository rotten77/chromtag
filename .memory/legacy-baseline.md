# Chromtag 1.8: historical baseline

This document describes the existing Chromtag 1.8 popup as implemented, before the planned v2.0 modernization. It is a baseline to revise, not a claim that every behavior works reliably with large bookmark collections or all writing systems.

**Reference only:** Supplied by the user on 2026-11-12. Paths reflect the current local archive. Target criteria live in [the technical specification](../.memory/technical-specification.md); intended releases are described in [the technical specification](technical-specification.md). T-01 runtime evidence is recorded separately in [legacy measurements](legacy-measurements.md).

## Purpose

Chromtag is a Chrome bookmarks browser and editor. It adds tag-based organization to Chrome's existing bookmarks by treating hashtags in bookmark titles as tags. Users browse bookmarks, filter by tag or folder, search, and add or edit bookmarks from the extension popup.

Bookmark records remain in Chrome's native bookmark tree. The extension does not maintain a separate bookmark database or backend. The current implementation does persist one interface preference: whether the folder cloud is shown, using `localStorage`.

## Current implementation

- **Platform:** Chrome extension, Manifest V3, version 1.8.
- **Entry point:** Browser action opens a fixed-size popup (`popup.html`).
- **Permissions:** `bookmarks` and `tabs`.
- **UI dependencies:** Bundled jQuery, NanoScroller, and YUI reset CSS.
- **Bookmark source:** `chrome.bookmarks.getTree()`; folder and bookmark nodes are recursively traversed.
- **Tag source:** Hashtags parsed from bookmark titles. Tags are displayed as a sorted tag cloud and are not stored separately.
- **Folder navigation:** Folder names are shown as a sorted, flattened folder cloud; nested folders are included.
- **Bookmark rows:** Show the title with hashtags removed where possible, URL, containing folder, parsed tags, and an edit control. `javascript:` bookmarks are excluded from the list.
- **Persistence:** Bookmark and tag changes use Chrome's bookmark APIs. The folder-cloud visibility preference is stored in `localStorage`; filter/search state is temporary to the popup session.

## Historical user stories and acceptance criteria

### 1. Browse Chrome bookmarks

As a user, I want to browse my Chrome bookmarks in the extension popup so I can open a saved page without navigating Chrome's full bookmarks manager.

Acceptance criteria:
- Opening the extension action opens the Chromtag popup.
- Bookmarks from the Chrome bookmark tree are listed, including bookmarks nested in folders.
- Each displayed bookmark shows its title, URL, folder name when available, and tags parsed from its title.
- A bookmark row's title link opens its URL in a new tab.
- `javascript:` bookmark entries are not displayed.

### 2. See and filter by tags

As a user, I want tags in bookmark titles to appear in a tag cloud so I can filter bookmarks by topic.

Acceptance criteria:
- A title containing `#` followed by non-whitespace text contributes that text as a tag; the current parser does not require whitespace before `#`.
- The tag cloud is sorted alphabetically and contains each discovered tag once.
- Selecting a tag marks it active and filters the list to bookmarks matching it; selecting it again clears that tag filter.
- Multiple tag filters can be active at once; a bookmark must match all active filter terms.
- Tag labels are also shown on matching bookmark rows.

### 3. Filter by bookmark folder

As a user, I want to select a folder from the folder cloud so I can narrow the bookmark list to that folder.

Acceptance criteria:
- Folders from the Chrome bookmark tree are displayed in a flattened, alphabetically sorted cloud.
- At most one folder filter is active at a time; selecting another folder replaces the previous folder filter.
- A folder filter can be combined with tag filters and the text search.
- Folder names are shown on bookmark rows when available.

### 4. Search bookmarks

As a user, I want to search the visible bookmark collection so I can find a saved item quickly.

Acceptance criteria:
- Typing in the search field filters the list as the query changes.
- Search currently matches a slug-normalized bookmark title and its parent folder name.
- Search terms are combined with active tag and folder filters.
- The search field does not currently search bookmark URLs.

### 5. Reset filters

As a user, I want one action to clear my search and filters so I can return to the full bookmark list.

Acceptance criteria:
- Selecting **Reset filter** clears the text query.
- It clears all active tag and folder filters.
- All supported bookmarks are shown again.

### 6. Add the current page

As a user, I want to add the active browser tab as a bookmark from the popup so I can save the page I am viewing.

Acceptance criteria:
- Selecting **Add bookmark** creates a Chrome bookmark using the active tab's title and URL.
- The new bookmark is created in Chrome's default bookmark folder when no folder is specified.
- The editor opens for the newly created bookmark so I can edit it immediately.

### 7. Edit or delete a bookmark

As a user, I want to edit a bookmark's details or remove it so I can maintain my bookmark collection from the popup.

Acceptance criteria:
- Selecting a bookmark's edit control opens an editor populated with its title, URL, and current folder.
- The editor lists tags discovered from existing bookmarks; selecting a tag toggles its hashtag in the title.
- The editor lets me enter a new tag, add it as a hashtag, and choose a destination folder.
- Selecting **Save** updates the bookmark title and URL and moves it if a different folder is selected.
- Selecting **Delete** removes the bookmark from Chrome's bookmark tree.
- Selecting **Cancel** or the overlay closes the editor without saving unsaved field changes.
- After a successful mutation, the popup reloads its bookmark, folder, and tag views.

### 8. Show or hide folders

As a user, I want to hide the folder cloud when I need more room for bookmarks and restore it when needed.

Acceptance criteria:
- The toolbar has controls to show or hide the folder cloud.
- The selected visibility is stored in `localStorage` and restored when the popup is opened again.

## Known limitations in the current app

- Initial loading requests the entire bookmark tree separately for folders, tags, and bookmarks. Rendering appends rows individually and reapplies filtering after each bookmark; large collections can become slow or fail.
- The independent asynchronous tree reads can make rendering depend on callback order, including when folder names are looked up while building bookmark rows.
- Search uses a hand-built slug conversion for titles and parent folders, not URLs. It lowercases text and maps a limited set of Czech accented Latin characters; it is not general Unicode normalization and may behave unexpectedly for Arabic, Chinese, and other scripts or special characters.
- Tag parsing and search matching do not define robust Unicode hashtag boundaries. Newly entered tags are also normalized by the legacy slug helper.
- User-controlled titles, URLs, and folder names are interpolated into HTML strings rather than rendered exclusively as text, so characters that have HTML meaning can display incorrectly and should be handled safely in a rewrite.
- Folder visibility is persisted with `localStorage`, despite bookmark data itself remaining in Chrome's bookmark tree.
- The popup uses fixed dimensions and older bundled UI libraries; behavior and accessibility at different popup sizes have not been comprehensively verified.

## Source files

- `.local/legacy/chromtag/manifest.json` — extension metadata, popup registration, and permissions.
- `.local/legacy/chromtag/popup.html` — popup structure and script/style references.
- `.local/legacy/chromtag/popup.js` — bookmark loading, tag parsing, filtering, search, and editor actions.
- `.local/legacy/chromtag/popup.css` — popup layout and visual styling.
