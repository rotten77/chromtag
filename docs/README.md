# Chromtag 2.0

Chromtag browses and edits Chrome's native bookmarks. Hashtags in bookmark titles provide tags without a separate bookmark database or account.

Chrome 157 or later is required. See [development setup](development.md) and [release history](changelog.md).

## Browse bookmarks

Open the Chromtag extension action to display the popup. In development version 2.12, Search receives focus immediately without selecting or clearing restored text or filters. Each row shows the bookmark title, URL, immediate folder, and parsed tags. In the published 2.0 build, select a title to open it in a new tab. In the 2.3 development build, bookmark clicks open in the current tab by default.

Nested folders are supported. The list excludes `javascript:` bookmarks. Long titles and URLs truncate; tooltips expose the full text. Only the bookmark list scrolls in the main popup.

The popup uses a 540 × 580 px layout and a 13 px base font. Appearance and click-behavior settings are not part of version 2.0. In the development build, filter pages render only the visible choices, even with many distinct tags or folders. Use Next, Previous, or First to reach other choices. Version 2.5 also keeps the latest filter and appearance choices when you change settings quickly. In version 2.6, the color picker shows only shades with readable text contrast for the selected theme and property; previously saved low-contrast shades reset to that property's default.

## Filter bookmarks

- Select a blue tag to activate its filter. Select the tag again to clear it.
- Select a green folder to include its bookmarks and all descendant folders. Select the folder again to clear it.
- Enter a phrase in **Search...** to search full titles, immediate folder names, and URLs.
- Select **Reset filter** to clear all filters.

All selected tags must match. Folder and text filters also apply. Only 1 folder can be active. Duplicate folder names use paths where necessary.

Search matches a literal phrase within 1 field after a short delay. It ignores case but preserves accents: `café` differs from `cafe`. Canonically equivalent Unicode spellings match. Punctuation does not act as a search operator.

Folders and tags share a fixed cloud. Use **First filters**, **Previous filters**, and **More filters** to reach collapsed choices. Selected choices are red; hovered choices are dark.

**Hide folders** hides folder choices; **Show folders** restores them. Filters and folder visibility reset when the popup closes in version 2.0.

### Unreleased popup redesign (US-12)

In the development build, green folders come first and blue tags follow in the same cloud. Folder and tag labels use white semibold text. Select a chip to filter the list; its background turns red without moving the chip. When not all choices fit, **First**, **Previous**, and **Next** appear above the cloud. Use **Search bookmarks…** beside the result count to narrow the list further. **Clear filters** beside the cloud clears the folder, tags, and search together.

**Add bookmark** is in the top row. **Options** contains **Refresh** and two settings in the unreleased 2.1 build:

- **Show folders** is on by default and controls whether folder choices appear. It survives closing the popup and restarting Chrome, even if you clear filters or turn off filter storage.
- **Clear filters on popup** is off by default: reopening the popup restores the search, selected tags, and selected folder during the same Chrome session. Turn it on to start each popup unfiltered. This leaves the current view unchanged. Turn it off again to remember the current filters. **Clear filters** removes active and saved filters but leaves both settings unchanged.

Chrome clears session filters on restart. Click outside the popup to dismiss it; there is no separate close button.

## Bulk bookmark actions (2.8 development build)

1. Select **Actions** beside the selected count, or check a bookmark in the list. The checkbox is separate from its title link.
2. Select **Select all** to check every current match, including rows outside the visible list. Select **Invert selection** to toggle current matches, or **Deselect all** to clear the checks.
3. Use **Open selected** to open checked pages using your bookmark-click settings. In new-tab mode, all checked pages open in background tabs. In current-tab mode, the first checked result opens in the current tab and the rest open in background tabs. Use **Move to folder** to choose a destination for checked bookmarks.
4. Use **Add tag** to choose an existing tag or enter a new one. Use **Remove tag** to remove a tag present on checked bookmarks.

**Actions** is available when bookmarks match the current filters. Without a selection, only **Select all** is available. A filter change deselects checked bookmarks that no longer match. Selection is not saved when the popup closes. Tag actions change only checked bookmark titles; they do not rename a tag across the library. If some bookmarks cannot be changed or opened, Chromtag reports the number that failed. Disabled buttons use the standard arrow cursor.

## Bookmark clicks (development build)

In version 2.11 (development build), open **Options**. **Switch to opened tab** is off by default and available when **Open bookmarks in new tab** is checked. Enable it to activate the new tab; for **Open selected**, it activates the first selected result after creating the background tabs. Chrome can close the popup when the new tab becomes active, even if explicit closing is disabled. Check **Open bookmarks in new tab** to open in a background tab; leave it unchecked to use the current tab (the default). **Close popup after opening a bookmark** is checked by default. Both settings persist across Chrome restarts and apply to **Open selected**. Explicit closing happens after successful opening; partial failures leave the popup open if Chrome permits. Accepted opening batches continue after popup dismissal, but not browser shutdown or extension reload. In version 2.10, accepted bulk tag/move batches also continue after popup dismissal. Reopen or refresh to read native results; if a batch is still running, refresh again after it finishes. Failure summaries are shown only while the initiating popup remains open. Do not retry blindly after dismissal. Chrome can close an action popup automatically when the current tab navigates, even if you turn off explicit popup closing. If navigation fails, the popup stays open and shows an error.

## Appearance (development build)

In version 2.2, open **Options**. The **Appearance** controls are always shown. Changes apply immediately and stay on this device after Chrome restarts.

- Enter popup size on one line as width × height: width 380–800 px and height 400–600 px. Press Tab to apply each value. Use the slider for font size (12–18 px). Defaults are 540 × 580 px and 13 px.
- **Filter space** limits the cloud to 20–60% of the height shared with bookmarks, in steps of 5 percentage points. The default is 35%. A small cloud leaves unused space for bookmarks.
- **System** follows the system color preference. Choose **Light** or **Dark** to override it. Under **Light colors** and **Dark colors**, choose text, tag, folder, highlight (hover), and selection colors independently. Expand a theme to see a compact list of properties and their current colors. Select a property to open its color picker in a separate dialog. The [Material palette](https://www.materialpalette.com/colors) uses color-only buttons with screen-reader labels. Choose a family to apply its last shade, or choose another shade in the framed group. Select **Done** or press Escape to close the picker and return to the property. The palette works offline. Each theme has a reset button that restores only its colors; the other theme and popup layout stay unchanged. Backgrounds stay white and dark gray, respectively.

## Hashtags

A tag starts with `#` at the beginning of a title or after whitespace. It ends at whitespace, another `#`, or the title end.

- `Read this #work #C++` supplies 2 tags.
- `#work,` includes the comma in the tag.
- A lone `#` and `word#tag` are plain text.
- In `#one#two`, only `#one` is a tag.

Equivalent normalized spellings share a filter choice. Titles retain their original spelling. The cloud displays the first spelling found in the bookmark tree. Displayed row titles omit parsed hashtags; Chrome retains those hashtags in the stored title.

## Add the current page

1. Open the page to save.
2. Open the Chromtag extension action.
3. Select **Add bookmark**.
4. Edit the new bookmark as necessary.
5. Select **Save**.

Chrome selects the default destination folder. Chromtag creates the bookmark before opening the editor. **Cancel** keeps that bookmark but discards unsaved editor changes.

Chrome can withhold required metadata on restricted pages or after access expires. Chromtag then shows a message and creates no bookmark.

## Edit or delete

1. Hover over a bookmark row, or use Tab to focus **Edit**.
2. Select **Edit**.
3. Change **Title**, **URL**, or **Folder** as necessary.
4. Select existing tags to toggle their title hashtags.
5. Enter a tag in **New tag**, if necessary.
6. Select **Add tag** to add the entered tag.
7. Select **Save**.

New tags accept 1 optional leading `#`. Internal whitespace and additional `#` characters are invalid.

**Delete** removes the bookmark from Chrome. **Cancel**, Escape, or selecting the overlay discards unsaved changes. Keyboard focus stays inside the editor until closure.

Chrome saves details and moves folders separately. If a move fails after details save, Chromtag reports the partial result. Review the folder before retrying.

## Refresh and progress

Select **Refresh** after external bookmark changes. Successful additions, saves, moves, and deletions refresh automatically.

Each refresh reads Chrome's tree once. The popup first indicates tree loading, then bookmark and hashtag processing. Counts include all URL-bearing nodes, including excluded `javascript:` bookmarks.

At 10,000 or more nodes, guidance cites a test with 10,001 synthetic bookmarks. This is not a guaranteed capacity or completion time. Large snapshots process in chunks so progress can update.

In the 2.7 development build, a failed bookmark read shows an error, not an empty-library message. A failed load keeps the previous snapshot when available. Select **Refresh** to retry. “No bookmarks yet” appears only after a successful empty read. Mutation errors appear in the popup.

## Data and permissions

Chrome's native bookmark tree remains the source of truth. Changes also appear in Chrome Bookmark Manager.

- **bookmarks:** read, create, update, move, and delete native bookmarks.
- **activeTab:** obtain the current page's metadata after the extension action grants access.

The 2.1 development build adds the **storage** permission. Chrome session storage holds only the remembered query, tag keys, and folder ID. Local extension storage holds only the two checkbox preferences; bookmarks and indexes are never copied there.

Version 2.0 keeps derived indexes, filters, and visibility in popup memory. It uses no `localStorage`, Chrome storage, separate bookmark store, account, or backend. The extension bundles its scripts and styles locally and requests no host permissions.
