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
2. Scroll the popup to reach the final tag.
3. Select **Hide folders**.
4. Select **Show folders**.

Expected: the cloud has no separate scrollbar or height clipping. All labels remain reachable through popup scrolling. Hiding folders keeps tags available. Criterion: T-05-AC6.

## UI-04 — Long bookmark content

1. Find a bookmark with a long title and URL.
2. Check the row width and **Edit** button.
3. Select **Edit**.
4. Check the full title and URL in the editor.
5. Select **Cancel**.

Expected: the article fills the available list width. CSS truncates long text. **Edit** stays visible without text overlap or horizontal list scrolling. Criterion: T-05-AC7.

Automated Chrome checks repeat this case at 540 × 540 px with a 13 px font and 380 × 500 px with a 16 px font. These CSS checks do not add appearance settings to version 2.0.

## UI-05 — Colors

1. Open the popup with no active filters.
2. Check the folder and tag colors.
3. Check the labels on bookmark rows.

Expected: default folder green is `#4CAF50`; default tag blue is `#448AFF`. Active filters retain their distinct selection color. Criterion: T-05-AC8.

## Record results

Record the tested commit, Chrome version, date/time, scenario ID, expected result, and actual result when reporting an issue. Attach a screenshot when useful.

Run `npm test` for a timestamped HTML report under `.local/test-results/`. See [the testing guide](testing.md). Overall E-20 verification remains pending. T-09 still owns the later full-feature manual materials after all planned releases.
