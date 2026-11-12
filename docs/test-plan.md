# Popup layout review test plan

This plan covers the 2026-11-12 review changes to version 2.0. Acceptance criteria remain in [the technical specification](../.memory/technical-specification.md). Automated evidence is in [the criterion mapping](test-coverage.md).

Use Chrome 157+ and the current production build. Reload the extension after `npm run build`. Use test bookmarks for changes to bookmark data.

## UI-01 — Search field

1. Open the Chromtag popup.
2. Check the search field.
3. Enter a phrase that matches a bookmark.

Expected: the field shows `Search...` when empty. No visible search label occupies space. Search still filters bookmarks. Criterion: T-05-AC5.

## UI-02 — Combined cloud

1. Open the popup with a small collection of folders and tags.
2. Check the transition from folders to tags.
3. Select a folder and a tag.

Expected: green folders and blue tags form 1 wrapping cloud. The first tag follows the last folder when space permits. Both filters work. Criterion: T-05-AC6.

## UI-03 — Large cloud

1. Open a collection with many folders and tags.
2. Select **More filters** until the final labels appear.
3. Select **Previous filters** to return 1 page.
4. Select **First filters** to return to the first page.
5. Select **Hide folders**.
6. Select **Show folders**.

Expected: the cloud stays fixed and collapses excess labels without a scrollbar. Every label remains reachable through pagination. Selected filters stay active when their page changes. Hiding folders keeps tags available. Criterion: T-05-AC6.

## UI-04 — Long bookmark content

1. Find a bookmark with a long title and URL.
2. Hover over the bookmark row.
3. Check the row width and **Edit** button.
4. Select **Edit**.
5. Check the full title and URL in the editor.
6. Select **Cancel**.

Expected: the article fills the available list width. CSS truncates long text. Hover reveals **Edit** without text overlap, layout shift, or horizontal list scrolling. Criterion: T-05-AC7.

Automated Chrome checks repeat this case at 540 × 580 px with a 13 px font and 380 × 500 px with a 16 px font. These CSS checks do not add appearance settings to version 2.0.

## UI-05 — Colors

1. Open the popup with no active filters.
2. Check the folder and tag colors.
3. Check the labels on bookmark rows.
4. Select a folder or tag, then move the pointer away.
5. Hover over default and selected cloud labels.

Expected: default folder green is `#4CAF50`; default tag blue is `#448AFF`. Selected labels use `#F44336`. Hover uses `#212121`; leaving hover restores the selected/default color. Criterion: T-05-AC8.

## UI-06 — List-only scrolling

1. Open a collection with many bookmarks and filter labels.
2. Check the 540 × 580 px popup.
3. Scroll within the bookmark list.
4. Check the search field, cloud, and toolbar positions.

Expected: only the bookmark-list area scrolls. Other main-popup controls stay visible and stationary. The outer popup has no scrollbar. Criterion: T-05-AC9.

## UI-07 — Title and Edit hover

1. Move the pointer outside bookmark rows.
2. Check that titles are underlined and Edit buttons are hidden.
3. Hover over a title.
4. Check the title color and the Edit button.
5. Move the pointer outside the row.
6. Use Tab to focus a title, then its Edit button.
7. Press Enter to open the editor.

Expected: title hover uses the tag blue (`#448AFF` by default). Row hover reveals **Edit** without moving content. Leaving hides **Edit** unless it has visible keyboard focus. Keyboard focus reveals Edit and Enter opens the editor. Criterion: T-05-AC10.

## Record results

Record the tested commit, Chrome version, date/time, scenario ID, expected result, and actual result when reporting an issue. Attach a screenshot when useful.

Run `npm test` for a timestamped HTML report under `.local/test-results/`. See [the testing guide](testing.md). Overall E-20 verification remains pending. T-09 still owns the later full-feature manual materials after all planned releases.
