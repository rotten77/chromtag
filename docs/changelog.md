# Changelog

## 2.4 (unreleased)

- Filter pages now render only the choices on the current page, keeping the popup responsive when a bookmark collection has many distinct tags or folders. All choices remain available through pagination.

## 2.3 (unreleased)

- Bookmark clicks now open in the current tab and close the popup by default. Two separately divided checkboxes in Options let you open bookmarks in a new tab and disable explicit popup closing. Both choices persist across Chrome restarts. Chrome may still close the popup when the current tab navigates.

## 2.2 (unreleased)

- Added a single Popup size row with width × height fields, plus sliders for font size and the space shared by filters and bookmarks. Filter hover and selection colors are configurable. Use the centered Options dialog to pick Material color swatches without visible color names for each theme. Appearance is always visible in Options. Expanding Light colors or Dark colors reveals a compact list of color properties; selecting one opens the palette in a separate dialog. Selecting a color family applies its last shade; the smaller shade buttons sit in a separate framed group. Each theme has its own color reset button. Thin dividers separate the settings rows. System mode follows the current light or dark preference.

## 2.1 (unreleased)

- Put the folder and tag filters first, with direct pagination, compact search, and **Add bookmark** in the top row.

- Restore filters during the current Chrome session by default. Options lets you disable this behavior and remembers whether to show folders across restarts.

## 2.0

Implemented and user-verified on 2026-11-12. Submitted to the Chrome Web Store on 2026-11-16 and published on 2026-11-20.

- Rebuilt the popup with standalone Angular and TypeScript. Removed jQuery, NanoScroller, and the YUI reset from the shipped runtime.
- Added 1 transient bookmark snapshot per refresh, iterative tree processing, and virtualized rows for large collections.
- Added loading and hashtag-processing feedback with processed/total counts and evidence-based guidance for large libraries.
- Added literal Unicode phrase search across full titles, immediate folder names, and URLs. Matching ignores case while preserving accents and grapheme boundaries.
- Made hashtag parsing Unicode-safe, with normalized identity and original spelling. Punctuation remains literal.
- Added folder-ID filtering with descendants and path labels for duplicate names.
- Retained combined tag/folder/search filtering, Reset filter, add-page editing, save/move/delete, and popup-only folder visibility.
- Refined the 540 × 580 px popup, typography, combined paginated cloud, row truncation, hover controls, and keyboard access.
- Replaced broad `tabs` permission with `activeTab`. Missing required page metadata produces a message without creating an incomplete bookmark.
- Added regression tests, native Chrome integration, and timestamped HTML reports with screenshots.
- Retained Manifest V3 with local scripts/styles. Required Chrome 157+.

Version 2.0 used machine-assisted development under human guidance. Jan Zatloukal supplied requirements, approved behavior decisions, and verified the implementation. Codex implemented the modernization, documentation, and automated checks.

## 1.8 — 2024-01-25

- Increased font and window sizes.
- Added a button for creating a new bookmark.

## 1.7 — 2022-06-22

- Added the tag list to the editor.

## 1.6 — 2022-06-09

- Fixed moving bookmarks to folders.

## 1.5 — 2022-06-07

- Updated to Manifest V3.
- Removed favicons as part of that change.

## 1.4 — 2014-05-29

- Improved support for non-Latin characters.

## 1.3 — 2014-05-28

- Added new rendering.
- Added favicons.

## 1.2 — 2014-01-10

- Sorted folders and tags by name.
- Added search.
- Added the bookmark editor.

## 1.1 — 2013-11-23

- Published on the Chrome Web Store.

## 1.0 — 2013-11-20

- First released version.

Versions 1.0–1.8 reproduce the original project's recorded release history. Versions 2.1–2.3 remain future updates, outside the 2.0 release scope.
