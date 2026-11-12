# Chromtag product specification

Chromtag is a Chrome extension for browsing and editing Chrome bookmarks. Hashtags in bookmark titles provide tags without a separate bookmark database.

This document describes implemented version 2.0 behavior and planned versions 2.1–2.3. Version 2.0 awaits user verification. The [technical specification](../.memory/technical-specification.md) owns acceptance criteria and unresolved decisions. The [plan](../.memory/plan.md) tracks progress.

## Version 2.0 — Modernized popup

| Feature | Intended behavior | Criteria |
|---|---|---|
| Browse | List nested bookmarks with title, URL, folder, tags, and edit control. Open links in new tabs; exclude `javascript:` bookmarks. | US-01 |
| Tags | Recognize hashtags at title start or after whitespace. Preserve spelling and punctuation; deduplicate by normalized identity. Toggle multiple tags; matches satisfy every selected tag. | US-02 |
| Folders | Show a sorted flattened cloud. Select at most 1 folder by ID, including its descendants, and combine it with tags/search. Distinguish duplicate names with parent paths. | US-03 |
| Search | Match 1 literal phrase within a full title, immediate folder name, or URL. Use NFC normalization and locale-independent lowercasing while preserving diacritic distinctions. | US-04 |
| Reset | Clear the query and all tag/folder filters. | US-05 |
| Add | Create a bookmark from the active tab and open its editor when required metadata is available. Otherwise show an unavailable-page message and create no bookmark. | US-06 |
| Edit/delete | Edit title/URL, toggle or create tags, move folders, save, delete, or cancel unsaved fields. | US-07 |
| Folder visibility | Show/hide the folder cloud for the current popup session only. | US-08 |

The popup retains the compact toolbar, colored clouds, bookmark rows, and editor overlay. The base font is 13 px in a 540 × 580 px popup. Bookmark URLs and row folder/tag badges use 80% of the title font size. Both row badge types have a `#9E9E9E` background. Stable Chrome tests cover long content, keyboard focus, overflow, and CSS scaling.

The search field shows `Search...` without a visible label. Filter folders (`#4CAF50`) and tags (`#448AFF`) share 1 wrapping cloud without internal scrolling. First/Previous/More controls sit above the cloud. The cloud stays fixed with a 14rem height limit, yields space to the bookmark list at smaller layouts, and collapses excess labels without leaving a large blank area on the first page. Only the bookmark-list area scrolls in the main popup. Selected labels use only a `#F44336` background, without a shadow; hovered buttons use `#212121`. The editor also has no shadow. Full-width bookmark articles truncate long text with CSS and reserve space for Edit. Titles are underlined and turn tag-blue on hover. Edit appears on row hover or visible keyboard focus. See T-05-AC5 through T-05-AC10 and [the layout test plan](test-plan.md).

Search matches respect grapheme boundaries. A query cannot match only part of an accented character or emoji cluster.

Angular standalone components and TypeScript replace the old UI libraries. One Chrome bookmark snapshot supplies the transient model per load/refresh. Model filtering and a virtualized list with overscan address large collections, including 10,000+ synthetic bookmarks.

## Version 2.1 — Session filters

The query and selected tags/folder survive popup closure during the browser session through `chrome.storage.session`. Reset clears active and saved filters. Ending the browser session clears saved filters. See US-09 criteria.

## Version 2.2 — Appearance preferences

Users configure base font size, popup width/height, and the height of the combined folder/tag cloud. The cloud remains fixed; pagination keeps collapsed labels reachable. Users select foreground, tag, and folder colors independently for light and dark themes from a Material Design palette. Backgrounds are not editable: light is white (`#FFFFFF`), dark is `#212121`. `chrome.storage.local` retains appearance/layout preferences across restarts. Editable-color defaults, supported bounds, and exact palette choices remain undefined. See US-10 criteria.

## Version 2.3 — Bookmark-click preferences

Users choose the current tab or a new tab, with new tab as the default. A separate yes/no setting controls popup closure where Chrome permits. Both preferences persist across restarts in `chrome.storage.local`. The close default and lifecycle limits require resolution. See US-11 criteria.

## Data and permissions

Bookmarks, folder relationships, and title hashtags remain in Chrome's native tree. Derived models/indexes remain in popup memory. Folder visibility is popup-only in every planned release.

The extension uses no separate bookmark database, backend, account, or `localStorage`. Session/persistent preferences never contain bookmark records or indexes.

Manifest V3 remains in use. The manifest uses `bookmarks` and temporary `activeTab` access. Current-page bookmarking depends on Chrome exposing the required metadata; restricted pages or revoked access can prevent adding a page. Preference releases add `storage` when needed.

The Angular 22 popup and manifest target Chrome 157+. Version 2.1 needs at least Chrome 102 for session storage, retaining any higher framework floor. No service worker is required without a demonstrated need.

The [manifest audit](manifest-audit.md) describes package metadata, permission rationale, and checks. The build produces a loadable popup at `dist/chromtag/browser/`; T-03 verifies this package in stable Chrome.

## Verification and unresolved decisions

The [technical specification](../.memory/technical-specification.md) defines verification, regression-test coverage, and open semantic decisions. Every applicable feature and criterion requires repository tests as implementation proceeds, plus built-extension verification in Chrome.

URL search, diacritic-preserving Unicode matching, hashtag boundaries/identity, folder-ID/descendant filtering, and popup-only folder visibility intentionally change the 1.8 baseline. Later releases introduce the explicitly scoped storage exceptions. The [historical baseline](legacy-baseline.md) and [analysis](legacy-analysis.md) remain references, not target acceptance criteria.
