# Chromtag 2.0

Chromtag browses and edits Chrome's native bookmarks. Hashtags in bookmark titles provide tags without a separate bookmark database or account.

Chrome 157 or later is required. See [development setup](development.md) and [release history](changelog.md).

## Browse bookmarks

Open the Chromtag extension action to display the popup. Each row shows the bookmark title, URL, immediate folder, and parsed tags. Select a title to open the page in a new tab.

Nested folders are supported. The list excludes `javascript:` bookmarks. Long titles and URLs truncate; tooltips expose the full text. Only the bookmark list scrolls in the main popup.

The popup uses a 540 × 580 px layout and a 13 px base font. Appearance and click-behavior settings are not part of version 2.0.

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

## Appearance (development build)

In version 2.2, open **Options**. The **Appearance** controls are always shown. Changes apply immediately and stay on this device after Chrome restarts.

- Enter popup width (380–800 px) and height (400–600 px) in the adjacent number fields. Press Tab to apply each value. Use the slider for font size (12–18 px). Defaults are 540 × 580 px and 13 px.
- **Filter space** limits the cloud to 20–60% of the height shared with bookmarks, in steps of 5 percentage points. The default is 35%. A small cloud leaves unused space for bookmarks.
- **System** follows the system color preference. Choose **Light** or **Dark** to override it. Under **Light colors** and **Dark colors**, choose text, tag, folder, highlight (hover), and selection colors independently. Each picker shows color-only buttons with screen-reader labels from the [Material palette](https://www.materialpalette.com/colors). Expand a theme to see all its color pickers. Choose a family, then a shade; the swatches stay open. The palette works offline. Each theme has a reset button that restores only its colors; the other theme and popup layout stay unchanged. Backgrounds stay white and dark gray, respectively.

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

A failed load keeps the previous snapshot when available. Select **Refresh** to retry. Mutation errors appear in the popup.

## Data and permissions

Chrome's native bookmark tree remains the source of truth. Changes also appear in Chrome Bookmark Manager.

- **bookmarks:** read, create, update, move, and delete native bookmarks.
- **activeTab:** obtain the current page's metadata after the extension action grants access.

The 2.1 development build adds the **storage** permission. Chrome session storage holds only the remembered query, tag keys, and folder ID. Local extension storage holds only the two checkbox preferences; bookmarks and indexes are never copied there.

Version 2.0 keeps derived indexes, filters, and visibility in popup memory. It uses no `localStorage`, Chrome storage, separate bookmark store, account, or backend. The extension bundles its scripts and styles locally and requests no host permissions.
