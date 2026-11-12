# Use Chromtag

Load the built extension as described in [README](../README.md#build-run-and-test). Select the extension action to open the popup.

## Browse and filter

1. Select a bookmark title to open the page in a new tab.
2. Select blue tags to filter bookmarks.
3. Select a green folder to include that folder and its descendants.
4. Enter a phrase in the **Search...** field to filter titles, immediate folder names, or URLs.
5. Select **Reset filter** to clear the search, tags, and folder.

Multiple selected tags must all match. The selected folder and search phrase must also match. Select an active tag or folder again to clear that selection.

Search treats punctuation and spaces as literal text. Matching ignores case and preserves accents. For example, `café` matches composed or decomposed accents; `cafe` differs.

Tags begin with `#` at the title start or after whitespace. Punctuation stays in the tag: `#C++` and `#work,` are valid. A lone `#` and `word#tag` are plain text. The cloud combines equivalent normalized spellings and displays the first spelling found.

The list omits `javascript:` bookmarks. Rows fill the available list width. Long titles and URLs truncate with tooltips; **Edit** stays visible.

Folders and tags share 1 wrapping cloud. Selected labels are red (`#F44336`); hovered cloud buttons are dark (`#212121`). The cloud stays fixed without a scrollbar. Use **More filters**, **Previous filters**, and **First filters** to reach collapsed labels. Only the bookmark-list area scrolls in the main popup. **Hide folders** removes folders from the combined cloud; **Show folders** restores them.

Filters and folder visibility last only while the popup is open in version 2.0. Folders appear again when the popup opens.

## Add the active page

1. Open the page that you want to save.
2. Select the Chromtag extension action.
3. Select **Add bookmark**.
4. Edit the new bookmark if necessary.
5. Select **Save** to save the edited fields.

Chrome selects the default bookmark folder. **Add bookmark** creates the bookmark before the editor opens. **Cancel** discards edited fields and keeps the created bookmark.

Chrome can withhold page metadata on restricted pages or after access expires. Chromtag then shows a message and creates no bookmark.

## Edit or delete

1. Select the row's **Edit** button.
2. Change **Title**, **URL**, or **Folder** as necessary.
3. Select a discovered tag to add or remove that title hashtag.
4. Enter a new tag in **New tag** if necessary.
5. Select **Add tag** to put the new tag in the title.
6. Select **Save** to update the bookmark.

New tags accept 1 optional leading `#`. Spaces and additional `#` characters are invalid. Chromtag preserves Unicode spelling in the title.

**Delete** removes the bookmark. **Cancel**, Escape, or the overlay closes the editor without saving unsaved fields. Keyboard focus stays in the editor until closure.

Chrome processes detail updates and folder moves separately. If a move fails after details save, Chromtag reports the partial result. Review the folder and try again.

## Refresh and errors

Select **Refresh** after changing bookmarks outside the popup. Each refresh reads Chrome's tree once. Successful additions, saves, moves, and deletions refresh automatically.

The popup reports unavailable metadata, load failures, and failed mutations. A failed load keeps the previous snapshot when one exists. Select **Refresh** to try again.

Chrome Bookmark Manager uses the same native bookmarks. No bookmark database, account, or backend is required.
