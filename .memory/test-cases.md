# Manual test cases

Maintain this file with each new feature or changed behavior. These cases cover version 2.0 and the unreleased US-12 layout.

Run affected cases during each feature/epic verification. Use the full set when preparing a release. Passing automated tests does not replace Jan's explicit verification.

## Setup

**Caution:** Editing or deleting bookmarks changes native Chrome data. Use a dedicated test profile with disposable bookmarks.

1. Build the extension with `npm run build`.
2. Open `chrome://extensions` in Chrome 157+.
3. Load `dist/chromtag/browser/` as an unpacked extension.
4. Create nested folders and 2 same-named folders under different parents.
5. Add bookmarks with ordinary titles, long URLs, Unicode text, and title hashtags.
6. Include `#work`, `#C++`, `#work,`, `word#tag`, `#one#two`, and a lone `#`.
7. Include bookmarks containing `café`, Chinese, Arabic, and emoji.

## Cases

| ID | Feature | Actions | Expected result |
|---|---|---|---|
| M-01 | US-01 Browse | Open the extension action; select a bookmark title. | Popup opens. Nested bookmarks show title, URL, folder, and tags. In the 2.3 development build, title opens the current tab by default; 2.0 opens a new tab. |
| M-02 | US-01 Exclusions | Include a disposable `javascript:` bookmark; refresh. | The bookmark does not appear in the list. |
| M-03 | US-02 Tags | Select 2 tags; clear each by selecting it again. | Each tag appears once by normalized identity. Both selected tags must match. Clearing restores the corresponding results. |
| M-04 | US-02 Parsing | Inspect the setup hashtags in the cloud and editor. | Punctuation is literal. `word#tag` and lone `#` are plain text. Only `#one` is parsed in `#one#two`. Stored spelling is preserved. |
| M-05 | US-03 Folders | Select an ancestor folder, then another folder; select it again. | Descendants are included. Only 1 folder is selected. Selecting the active folder clears it. Duplicate names remain distinct. |
| M-06 | US-04 Search | Search a title phrase, immediate folder name, URL fragment, punctuation, and Unicode text. | Results update after a short delay. Matching is literal and case-insensitive. `café` differs from `cafe`; equivalent accent forms match. |
| M-07 | US-02/03/04 Combined | Activate tags, folder, and search together. | Every predicate must match. Tag/folder changes apply immediately with the visible query. |
| M-08 | US-05 Reset | Activate all filter types; select Reset filter. | Query, tags, and folder clear. All supported bookmarks return. |
| M-09 | US-08 Visibility | Select Hide folders, then Show folders; close and reopen the popup. | Visibility toggles without changing bookmarks. Folders appear on reopen. Version 2.0 filters also reset. |
| M-10 | US-06 Add | Open an ordinary page; invoke Chromtag; select Add bookmark. | Native bookmark is created in Chrome's default folder. Editor opens with the page title and URL. |
| M-11 | US-06 Add cancellation | Change the newly added bookmark's fields; select Cancel. | New bookmark remains. Unsaved changes do not apply. |
| M-12 | US-06 Missing metadata | Try Add bookmark where Chrome withholds required active-page metadata. | Clear message appears. No incomplete bookmark is created. Access depends on Chrome's action grant and page restrictions. |
| M-13 | US-07 Edit | Open Edit; change title/URL, toggle a tag, add a Unicode tag, and choose another folder; save. | Bookmark Manager shows the saved details and destination. Refreshed rows/clouds reflect changes. |
| M-14 | US-07 Validation | Enter an empty tag, internal whitespace, or an additional `#` in New tag. | Invalid tag is rejected without corrupting the title. |
| M-15 | US-07 Cancel | Change editor fields; close with Cancel, Escape, and overlay selection in separate trials. | Unsaved changes do not reach Chrome. |
| M-16 | US-07 Delete | Delete a disposable bookmark. | Bookmark disappears from the popup and Chrome Bookmark Manager. |
| M-17 | Refresh | Change bookmarks in Bookmark Manager; select Refresh. | Popup reflects the native tree. Successful popup mutations refresh automatically. |
| M-18 | T-05 Layout | Inspect long rows, hover a row/title, and page through a crowded filter cloud. | Text truncates without overlap. Edit appears on hover. Titles are underlined. Every filter remains reachable. Only the main bookmark list scrolls. |
| M-19 | T-05 Keyboard | Use Tab to reach Edit; press Enter; navigate and close the editor. | Edit becomes visible on keyboard focus. Editor opens, retains focus, and returns focus on close. Focus indicators remain visible. |
| M-20 | T-13 Processing | Open or refresh a large synthetic library. | Reading precedes processing. Processed/total counts appear only after tree arrival. Progress clears on completion. Large-library guidance promises no limit or time. |
| M-21 | T-04 Scale | Use 10,000+ synthetic bookmarks; filter, scroll to the end, and edit a late row. | List remains usable; late rows and edit work. Record observed delays without treating the fixture as a guaranteed capacity. |
| M-22 | T-03 Literal rendering | Add title/folder/tag text containing markup-significant characters; refresh and edit. | Text appears literally. No markup executes or breaks controls. |
| M-23 | Error handling | Review automated error-path results; reproduce API failures only in a controlled test environment. | Load/mutation errors are visible. A failed load keeps an existing snapshot. Partial save/move failures identify the partial result. |
| M-24 | T-15 Package (planned) | Follow .memory/distribution.md during T-15; inspect the upload ZIP. | Manifest is at ZIP root. Built popup, assets, and dependency notices are present. No private files or source repository are included. |
| M-25 | US-12 Layout (development build) | With few choices, check that paging is hidden. With a crowded cloud, use Next, select a chip, return with Previous or First, type a search, then use Clear filters. | Folders precede tags above search. Labels are white and semibold. After the pointer leaves a selected chip, only its red background indicates selection. The chip keeps its page and position. The result count updates; Clear filters restores the full list. Rows retain their compact layout. |
| M-26 | US-12 Popup actions | Use Add bookmark in the top row. Cancel the editor, open Options, uncheck Show folders, then select Refresh. Reopen the popup. | No branded header, footer, or close button. Adding still opens the editor. Folder choices hide for this popup only; refresh works and the next popup shows folders. |

**M-27 — US-09 (2.1):** Start in a fresh test profile. Show folders should be checked and Clear filters on popup unchecked. Select filters and hide folders. Reopen: filters should restore and folders should stay hidden. Check Clear filters on popup: the current view should not change, but the next popup should be unfiltered. Uncheck it with a query active; reopen to check it restores. Clear filters and reopen: neither checkbox should change. Apply another query and restart Chrome: the query should disappear and folders should still be hidden.

**M-29 — US-11:** In the unpacked extension, click a bookmark with default settings and confirm it navigates the current tab and closes the popup. In Options, check Open bookmarks in new tab and clear Close popup after opening a bookmark. Click another bookmark: it opens a new tab and the popup should remain open where Chrome permits. Test both close choices with each target, then restart Chrome and confirm both settings persist. Current-tab navigation may close the popup regardless of the close setting. On failed navigation, confirm an error appears rather than silently opening a new tab.

**M-28 — US-10:** In Options → Appearance, try the smallest and largest popup/font sizes and both ends of Filter space with a crowded cloud. Page through filters and scroll bookmarks. Expand Light colors or Dark colors and confirm only property names and current swatches show. Open a property and confirm its color picker is a separate modal. Select a family and confirm its last shade applies immediately. Choose a different shade from the framed group; check the small buttons remain keyboard-accessible at the minimum and maximum font sizes. Close with Done and Escape and confirm focus returns to the property while Options stays open. Change a color in each palette, switch modes, then change the OS theme in System mode. Confirm only System follows the OS; reopen and restart Chrome to check the settings persist independently of filters.

Numeric snapshot/read-count boundaries and forced Chrome API failures are covered by the automated suite. Do not claim manual proof of those internals from appearance alone.

## Verification report template

Copy this section for each verification. Keep private profile data and URLs in `.local/`, not this tracked file.

- Feature/epic or release:
- Date and tester:
- Commit or working-tree state:
- Extension version:
- Chrome version / operating system:
- Profile: dedicated synthetic / representative (no private identifiers)
- Automated report path:
- Cases run:
- Result per case: Pass / Fail / Blocked / Not run
- Issue: case ID, reproduction steps, expected result, actual result
- Evidence: local screenshot/report paths without secrets
- Remaining gaps:
- Jan's explicit verification: Pending / Confirmed

## Current state

This file is a reusable test definition, not a record of a new manual run. E-20 and T-13 were previously user-verified. Release documentation and this test file await review. Representative real-profile performance remains unverified.
