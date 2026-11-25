# Technical specification

Updated: 2026-11-21

## Scope and authority

Chromtag is a Chrome extension for browsing and editing Chrome bookmarks through a popup. Hashtags in bookmark titles provide tags.

This specification defines the extension's behavior, architecture, and acceptance criteria. `.memory/plan.todo` tracks epics, stories, tasks, and verification status by matching ID. This is the sole specification. `docs/` contains user and developer documentation and images. Historical 1.8 behavior and analysis remain in `.memory/legacy-baseline.md` and `.memory/legacy-analysis.md`.

## Historical implementation

The local reference is `.local/legacy/chromtag/`. Version 1.8 already uses Manifest V3, `bookmarks` and `tabs` permissions, and a popup without a background service worker. It uses jQuery, NanoScroller, and YUI CSS. Bookmarks remain in Chrome; folder visibility uses `localStorage`.

Confirmed structural issues include 3 tree reads per refresh, DOM-based folder lookup, filtering after each inserted row, unbounded rendering, limited slug normalization, generated selectors, dynamic tag regexes, and HTML-string interpolation. Deep recursive traversal is an inferred risk.

T-01 recorded a synthetic timing baseline and behavior probes in [legacy measurements](legacy-measurements.md).
At 5,000 bookmarks, median startup was 24.736 seconds. A 10,000-bookmark trial reached the 120-second readiness timeout.
These measurements do not establish a universal failure threshold or measure a real user profile.

## Architecture and data

- Use a root Angular CLI workspace, standalone Angular components, and TypeScript. Put popup code in `src/app/`.
- Use native Chrome extension APIs. Render user-controlled text and attributes safely through Angular templates and bindings.
- Read `chrome.bookmarks.getTree()` once per popup load/refresh. Derive a flat bookmark/folder/tag model and normalized search fields before rendering.
- Resolve parent folder labels from the model, not the DOM. Sort and deduplicate clouds in memory.
- Keep bookmarks and derived indexes in transient popup memory. Refresh the model once after a successful mutation.
- Filter fields directly, without selectors or regexes constructed from raw user data.
- Bound live rows with virtualization and overscan. Debounce text input; apply tag/folder interactions immediately.
- Preserve Unicode text without transliteration. Normalize queries and fields consistently; ignore case while preserving diacritic distinctions.
- Parse hashtags with the agreed Unicode-safe boundaries and identity policy below. Preserve tag spelling in titles.
- Remove jQuery, NanoScroller, and the legacy CSS reset from the runtime. Delete replaced dependencies only after confirming no references remain.
- Use CSS custom properties for font size, popup dimensions, and palettes. Preserve the compact visual direction.

### Matching and hashtag decisions

The user approved these rules on 2026-11-12 during T-01. They define target behavior, not legacy behavior.

#### Hashtags

- Recognize `#` only at the start of a title or immediately after Unicode whitespace.
- A tag contains at least 1 following character. Stop at whitespace, another `#`, or the title end. Whitespace follows ECMAScript's Unicode-aware whitespace definition.
- Keep punctuation as part of the tag. For example, `#C++` and `#work,` are valid tags.
- A lone `#` and `word#tag` are plain title text. In `#one#two`, only `#one` is a tag; the second `#` lacks a preceding boundary.
- Compute identity with NFC normalization, locale-independent Unicode lowercasing, then NFC normalization again. Preserve accents; do not transliterate or apply compatibility normalization.
- Preserve original tag spelling in stored titles. Use the first spelling encountered in native tree order for the cloud's display label.
- Deduplicate by normalized identity. Sort identities lexicographically by Unicode code point, independently of the machine's locale.
- Remove or toggle parsed title spans using literal operations, without constructing regular expressions from tag text.
- New-tag input trims outer whitespace and accepts 1 optional leading `#`. Reject empty input, internal whitespace, or any remaining `#`.

#### Text search

- Normalize fields and queries with NFC, locale-independent Unicode lowercasing, then NFC again. Preserve accents and original stored text.
- Trim only the query's outer whitespace. Keep internal whitespace and punctuation literal.
- Treat the query as 1 phrase. It must occur within 1 field: full stored title including hashtags, immediate containing-folder name, or URL.
- Do not split words, interpret operators, or match phrases across field boundaries. Empty queries impose no text restriction.
- `café` and `cafe\u0301` are canonically equivalent; `cafe` differs from `café`. `I` and `i` share a normalized key; `İ` normalizes to `i\u0307`, and `ı` remains `ı`.
- A phrase match must start and end on Unicode extended grapheme-cluster boundaries in the normalized field. Do not match a partial combining-mark or emoji cluster.
- Consequently, query `i` matches `I` but does not match `İ` or `ı`. Query `e` does not match an accented `e` cluster, including accents that lack a precomposed form.

NFC handles canonical equivalence without removing accents. Lowercasing is locale-independent; this policy does not require full Unicode case folding.
References: [Unicode normalization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) and [JavaScript lowercasing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase).

#### Folder filters

- Identify folders by Chrome bookmark ID, independently of their labels.
- Include bookmarks directly in the selected folder and in all descendant folders.
- Keep same-named folders as separate choices. Include parent paths in labels where needed to distinguish those choices.
- Text search still uses only the bookmark's immediate containing-folder name. Selecting an ancestor does not add ancestor names to the search fields.
- Combine the folder predicate with every selected tag and the text predicate using logical AND.

### Storage policy

| Data | Location | Lifetime |
|---|---|---|
| Bookmarks, title hashtags, folder relationships | Chrome native bookmark tree | Chrome-managed |
| Derived model and search index | Popup memory | Popup load/refresh |
| Show folders (default: on) | `chrome.storage.local` | Across popup/browser restarts |
| Search query, selected tags/folder (when remembering filters) | `chrome.storage.session` | Current browser session |
| Clear filters on popup (default: off) | `chrome.storage.local` | Across popup/browser restarts |
| Appearance/layout preferences | `chrome.storage.local` | Across popup/browser restarts |
| Bookmark-click preferences | `chrome.storage.local` | Across popup/browser restarts |

Do not use `localStorage`, a separate bookmark store, an account, or a backend. Never persist bookmarks or derived indexes in Chrome storage. Persistent preferences are explicit exceptions to the transient extension-state policy.

### Manifest and packaging

- Retain `manifest_version: 3`; audit metadata, icons, permissions, APIs, and Chrome compatibility.
- Keep `bookmarks` and replace broad `tabs` access with `activeTab`. The user approved this permission policy during T-02 on 2026-11-12.
- Read current-page metadata only when Chrome exposes it under the action's temporary grant. If required metadata is unavailable, report that the page cannot be saved and create no incomplete bookmark. US-06 owns implementation and regression coverage.
- Include `storage` for preferences. Session storage requires Chrome 102 or a higher framework floor.
- T-03 selects Angular 22, TypeScript 6, and Chrome 157 as the conservative application floor. The manifest and `.browserslistrc` agree. Node ranges follow Angular's published compatibility table.
- Use native `chrome.*` Promise APIs. Use `Intl.Segmenter` with grapheme granularity for the approved search-boundary policy; its Chrome 87 floor is below the selected extension API floor.
- Jan approved `open-selected.js`, a background service worker for accepted Open selected batches to continue after popup dismissal. In 2.10 Jan approved bulk mutations in the same worker. It retains request-local URLs/prepared title/move operations only during execution; no stored bookmark queue or restart/replay guarantee. Popup dismissal does not cancel accepted work; reopening reads native results. Failure summaries are transient and not recovered on reopening.
- Keep `manifest.json` and the preserved 16/48/128 px PNG icons in `public/`; copy them into the production output. Keep manifest and package versions consistent. Automated checks do not replace explicit user verification.
- Set `action.default_popup` to built `index.html`. The loadable extension root is `dist/chromtag/browser/`.
- Bundle local scripts/styles only. Comply with extension Content Security Policy (CSP), without remote code, inline scripts, or `eval`.
- Declare `script-src 'self'; object-src 'none';` for extension pages. Do not add host permissions, content scripts, or a sandbox.

The [manifest audit](manifest-audit.md) records sources, compatibility limits, and the handoff to Angular setup.
Source checks use `node tools/validate-manifest.mjs --source`; validator tests use `node --test tools/validate-manifest.test.mjs`.
Built validation uses `node tools/validate-manifest.mjs --built` after T-03 creates the production artifact. Source validation does not imply that artifact exists or is loadable.

### Tooling

T-03 establishes the Angular CLI workspace and Vitest unit/component runner. `npm test` saves timestamped HTML evidence under ignored `.local/test-results/`, including failed runs. Build optimization disables critical-CSS inlining and remote-font processing for the extension CSP.

| Operation | Required command or configuration |
|---|---|
| Initial setup | `npm install` |
| Reproducible install | `npm ci`, with committed `package-lock.json` |
| Production build | `npm run build` → `ng build --configuration production`, then finalize package notices/assets |
| Development rebuild | `npm run watch` → `ng build --watch --configuration development` |
| Tests | `npm test` → configured Angular unit-test runner |
| Runtime | Load `dist/chromtag/browser/` as an unpacked extension in Chrome |

`ng serve` is not the extension runtime. Select dependency versions and a test runner during setup; the supplied requirements do not prescribe them.

## Core feature acceptance criteria

### US-01 — Browse Chrome bookmarks

- **US-01-AC1:** Opening the extension action opens the popup.
- **US-01-AC2:** Include supported bookmarks nested at all folder levels.
- **US-01-AC3:** Rows show title, URL, containing folder when available, parsed tags, and an edit control. Display titles omit parsed hashtags safely.
- **US-01-AC4:** Selecting a title opens its URL in the configured tab. The default is the current tab.
- **US-01-AC5:** Exclude `javascript:` bookmarks from the list.

### US-02 — See and filter by tags

- **US-02-AC1:** Parse title hashtags with the agreed Unicode-safe boundaries and identity policy. Preserve original Unicode spelling in titles.
- **US-02-AC2:** Sort the tag cloud alphabetically; show each discovered tag once under that policy.
- **US-02-AC3:** Selecting a tag activates its filter; selecting it again clears that filter.
- **US-02-AC4:** Allow multiple active tags. A match satisfies all selected tags and other filters.
- **US-02-AC5:** Rows show parsed tags. Punctuation and regex metacharacters do not break parsing, display, or removal.

### US-03 — Filter by bookmark folder

- **US-03-AC1:** A flattened, alphabetically sorted cloud includes nested folders. Same-named folders remain separate by ID, with parent paths in labels where needed.
- **US-03-AC2:** At most 1 folder is active. Selecting another replaces it; selecting the active folder clears it.
- **US-03-AC3:** Folder filtering combines with tags and text search.
- **US-03-AC4:** Folder labels and search use the same model snapshot, independently of callback order.
- **US-03-AC5:** The selected folder matches its direct bookmarks and all descendant-folder bookmarks by Chrome ID, never by a label substring.

### US-04 — Search bookmarks

- **US-04-AC1:** Typing updates results after debouncing. Tag/folder changes take effect immediately.
- **US-04-AC2:** Search full stored titles including hashtags, immediate containing-folder names, and URLs. Match 1 trimmed literal phrase within any 1 field, without token splitting or cross-field phrase matches.
- **US-04-AC3:** Combine queries with all active tag filters and the active folder filter.
- **US-04-AC4:** Normalize fields/queries for Unicode case-insensitive matching without transliteration or loss of diacritic distinctions. Require phrase matches to start and end on grapheme-cluster boundaries in the normalized field.
- **US-04-AC5:** Normalize fields/queries with NFC, locale-independent Unicode lowercasing, then NFC again. Test accented Latin, Turkish casing, Arabic, Chinese, mixed scripts, emoji, and punctuation under the matching policy above.
- **US-04-AC6:** Query metacharacters cannot break matching. Empty/no-match queries produce the corresponding full/empty filtered collection.

### US-05 — Reset filters

- **US-05-AC1:** **Reset filter** clears the query and all selected tags/folders.
- **US-05-AC2:** All supported bookmarks return to the collection. Virtualization still bounds rendered rows.
- **US-05-AC3:** Clearing filters also clears saved filters; reopening does not restore them.

### US-06 — Add the current page

- **US-06-AC1:** **Add bookmark** creates a Chrome bookmark with the active tab's title and URL when Chrome exposes the required metadata under `activeTab`.
- **US-06-AC2:** Without a specified destination, use Chrome's default bookmark folder.
- **US-06-AC3:** Open the editor for the newly created bookmark.
- **US-06-AC4:** If the active tab or required title/URL metadata is unavailable, show a clear unavailable-page message and make no bookmark-creation call. Cover restricted pages and an unavailable or revoked action grant without requesting broad `tabs` or host permissions.

### US-07 — Edit or delete a bookmark

- **US-07-AC1:** A row's edit control opens the editor with current title, URL, and folder.
- **US-07-AC2:** List discovered tags. Selecting a tag toggles its title hashtag using the agreed policy.
- **US-07-AC3:** Accept a new tag without losing Unicode spelling; allow destination-folder selection.
- **US-07-AC4:** **Save** updates title/URL and moves the bookmark when needed. Refresh reflects the completed mutation.
- **US-07-AC5:** **Delete** removes the bookmark from Chrome's tree.
- **US-07-AC6:** **Cancel** or selecting the overlay closes the editor without saving unsaved fields. Cancellation does not undo creation before the add editor.
- **US-07-AC7:** Successful mutations refresh bookmark/folder/tag views using 1 tree read. Chrome Bookmark Manager reflects changes.

### US-08 — Show or hide folders

- **US-08-AC1:** The Show folders option shows or hides folder choices without changing bookmarks.
- **US-08-AC2:** Store the visibility preference in `chrome.storage.local`, not `localStorage`.
- **US-08-AC3:** Show folders initially when no preference is saved; restore saved visibility on reopening.

## Supporting task acceptance criteria

### T-00 — Prepare the repository

- **T-00-AC1:** Repository preparation used the user-created `modernizing-chromtag` branch. For future features and bug fixes, report the current branch and ask the user whether to create or switch to a dedicated branch before implementation. Documentation, planning, workflow, and `.memory/`-only updates do not require a new branch unless requested.
- **T-00-AC2:** Preserve the old README under `.memory/` and images under `docs/img/`, with working relative links.
- **T-00-AC3:** Ignore `node_modules/`, `dist/`, and `.angular/`. Keep `.local/` ignored.

### T-01 — Define and baseline behavior

- **T-01-AC1:** Preserve the 1.8 baseline; distinguish intentional target changes from historical behavior.
- **T-01-AC2:** Record a representative large bookmark count and reproduce or characterize the current failure. Do not claim an unmeasured threshold.
- **T-01-AC3:** Resolve relevant search, hashtag, and folder semantics before affected implementation.

### T-02 — Audit the manifest

- **T-02-AC1:** Audit MV3 metadata, icons, permissions, API compatibility, and minimum Chrome version.
- **T-02-AC2:** Point the built manifest to local assets and the generated popup. Add no unnecessary service worker.
- **T-02-AC3:** Validate later-release permissions when introducing their APIs.

### T-03 — Rebuild the popup with Angular

- **T-03-AC1:** Use standalone Angular components/TypeScript with the specified scripts, lockfile, assets, and output path.
- **T-03-AC2:** The loadable production extension uses native Chrome APIs and safe bindings without legacy UI dependencies.
- **T-03-AC3:** Each load/refresh reads the tree once and derives a consistent transient model before rendering.
- **T-03-AC4:** Production bundles satisfy the specified CSP and storage policies.

### T-04 — Fix scale and search

- **T-04-AC1:** Filter the model without per-bookmark filtering, repeated DOM scans, or user-generated selectors.
- **T-04-AC2:** With 10,000+ synthetic bookmarks, the popup does not freeze, filters respond, and live rows stay bounded by viewport/overscan.
- **T-04-AC3:** Scrolling and open/edit actions work across virtualized rows. A refresh does not trigger repeated tree reads.
- **T-04-AC4:** Test large/deep trees, many folders/tags, Unicode, and literal rendering. Distinguish inferred recursion risk from reproduced failures.

Implementation uses iterative traversal, rows sized to 5.6 times the base font (72.8 px at 13 px), 2/4-row CDK scroll buffers, and a 150 ms text debounce. These are tuning values, not performance guarantees. Timing targets remain undefined; record measured results without inventing a release budget.

### T-05 — Preserve and refine the design

- **T-05-AC1:** Preserve the compact popup, colored clouds, bookmark rows, toolbar, and editor overlay.
- **T-05-AC2:** Increase typography modestly through an adjustable base-font CSS property. Set bookmark URL text and row folder/tag badges to 80% of the title font size, preserving those ratios when the base font changes. Define layout/palette properties for later settings.
- **T-05-AC3:** Scale controls, labels, and spacing consistently. Long titles/URLs, many tags, and supported dimensions cause no overlap.
- **T-05-AC4:** Verify natural dimensions, overflow, keyboard focus, and editor/cloud layout in Chrome.
- **T-05-AC5:** Show the search field without its visible label. Use the exact placeholder `Search...` and retain an accessible name.
- **T-05-AC6:** Render folders followed by tags in 1 wrapping filter group, without separate sections or internal cloud scrolling. The first tag can follow the last folder on the same line. Keep the cloud stationary with a 14rem height limit (doubled from 7rem), limited further when needed to leave bookmark-list space. Collapse excess labels without leaving a large blank area below the visible choices on the first page. Place First/Previous/More controls above the choices; they must make every label reachable without scrolling the popup or cloud. Disabled pagination buttons use the standard cursor, not a loading cursor.
- **T-05-AC7:** Bookmark articles fill the available viewport width. Use CSS truncation for long content and reserve Edit space without overlap or horizontal list scrolling, including when font size or popup width changes. Revealing Edit must not shift the row layout. Size virtual rows so the bottom gap after the visible URL/labels is approximately the top padding, without clipping content at supported font sizes. Add a 1 px `--border-color` top border to the bookmark-list area to separate it from the controls above.
- **T-05-AC8:** Use folder green `#4CAF50` and tag blue `#448AFF` as the default filter-cloud colors. Bookmark-row folder and tag badges both use a `#9E9E9E` background. Selected cloud labels use only a `#F44336` background, without a shadow. Hovered cloud buttons use `#212121`, including when selected; leaving hover restores their selected/default color. The editor has no shadow.
- **T-05-AC9:** Increase the default popup height from 540 to 580 px, retaining its 540 px width. Keep the main popup, search field, cloud, and toolbar stationary; only the app-bookmark-list area scrolls. Preserve usable list space with large clouds and at narrower/larger-font test sizes.
- **T-05-AC10:** Underline bookmark title buttons. On hover, use the current tag color without darkening it. Hide Edit when its article is not hovered; reveal it on article hover. Keep Edit keyboard-focusable and reveal it on visible keyboard focus so keyboard users can open the editor.

T-05-AC5 through T-05-AC10 record Jan's 2026-11-12 review changes. Jan selected a fixed cloud with excess labels collapsed instead of scrolling the cloud with bookmarks. Pagination keeps the hidden choices reachable and outside keyboard focus until displayed. The existing editor overlay/tag picker can still scroll independently when open.

### T-06 — Document and verify

- **T-06-AC1:** Keep the README overview, the extension guide in `docs/README.md`, and commands in `docs/development.md` consistent with implemented releases.
- **T-06-AC2:** Map every applicable target feature/criterion to repository regression tests. Update tests/mapping when criteria change.
- **T-06-AC3:** Use unit/component tests with mocked Chrome APIs and integration coverage across popup/API boundaries. Include tests in `npm test`.
- **T-06-AC4:** Run `npm ci`, `npm run build`, `npm test`, manifest validation, and static checks after tooling exists. Required checks pass.
- **T-06-AC5:** Load the output in supported stable Chrome. Verify applicable stories without runtime errors or CSP violations.
- **T-06-AC6:** Verify 10,000+ synthetic bookmarks and a representative real profile when available. Record baseline measurements and remaining limits.
- **T-06-AC7:** Cover literal rendering of markup-significant titles/folders/URLs/tags, all filter combinations, and international-text cases.

Regression tests are explicit supplied requirements. `npm test` runs manifest, Angular/Vitest unit/component, production build, project/package, and native stable Chrome checks. [Criterion mapping](test-coverage.md) links every E-20/preparation criterion to evidence. [Testing documentation](testing.md) records limits and timestamped HTML reports.

### T-07 — Release the modernized extension

- **T-07-AC1:** Set a consistent manifest and package version for the release after applicable verification.
- **T-07-AC2:** Include a changelog entry describing machine-assisted development and human guidance.
- **T-07-AC3:** Remove replaced legacy runtime code after the Angular build works end to end and no references remain.

The original modernization materials named `legacy/`; no tracked directory with that name exists now. Preserve the ignored `.local/legacy/` archive during implementation and final testing. T-11 handles obsolete legacy and work files after final testing.

## Loading and processing acceptance criteria

### T-13 — Show bookmark processing progress

- **T-13-AC1:** On popup open and each refresh, indicate when Chrome's bookmark tree is loading and when Chromtag is processing the snapshot, including hashtags. Clear the indicator on completion or failure; retain existing error reporting.
- **T-13-AC2:** When a reliable total is available, show processed and total bookmark counts (for example, `45/1235`). Do not show a fabricated percentage or denominator while the tree read is pending. Define whether the count covers all tree bookmark nodes or only supported bookmarks before implementation, and keep the numerator/denominator consistent.
- **T-13-AC3:** Keep the indicator responsive during processing of large libraries, without repeated tree reads, persistent bookmark/index data, or unbounded row rendering. Ensure the progress is perceivable without flooding assistive-technology announcements.
- **T-13-AC4:** For large collections, provide reassuring guidance based only on measured evidence. It may cite the 10,001-supported-bookmark synthetic Chrome test, but must not imply a guaranteed maximum, real-profile result, or universal processing time. Decide whether to show guidance at a count threshold and select that threshold before implementation.
- **T-13-AC5:** Regression-test loading, determinate progress when available, completion/failure, large-library messaging, and snapshot/performance boundaries; verify in stable Chrome.

T-13 counts all URL-bearing tree nodes, including unsupported `javascript:` bookmarks; only supported bookmarks enter the list. The count uses a separate iterative pass over the same tree, not another Chrome read. A chunked iterative builder yields to the browser at most every 8 ms for large snapshots (1,000+ bookmark nodes), allowing progress to paint; small snapshots keep the synchronous fast path. Folder finalization also runs in chunks. The UI displays a count only after the tree arrives. At 10,000+ URL nodes it shows guidance citing the 10,001-supported-bookmark synthetic Chrome test without promising a capacity or duration. Assistive technology receives only the phase change, not each numeric increment.

## Additional feature acceptance criteria

### US-16 — Focus search when the popup opens (2.12, unreleased)

Use a one-shot Angular after-render callback to focus Search without scrolling or selecting text. Skip when a blocking dialog exists. Filter restoration remains unchanged; do not refocus after subsequent renders or dialog closure.

- **US-16-AC1:** When the popup opens and no blocking dialog is active, place keyboard focus in the search field so the user can type a query immediately.
- **US-16-AC2:** Preserve any restored query and active filters. Initial focus must not select, replace, or clear the restored query.
- **US-16-AC3:** Regression-test popup opening with an empty query and with restored filters, including keyboard navigation from the search field.

### US-13 — Exclude folders or tags from filter choices (planned)

Hide selected folder or tag choices from the filter selector without hiding their bookmarks from results. This can keep special-purpose folders such as `Quick access` out of the selector when users normally open them from Chrome's bookmark menu. The exclusion scope, configuration UI, tag behavior, persistence, interaction with active filters, and treatment of descendant folders require clarification before acceptance criteria are defined. Do not implement until Jan resolves these choices.

### US-14 — Bulk edit bookmarks (unreleased)

[Issue #4](https://github.com/rotten77/chromtag/issues/4) asks to replace `#money` with `#finance`, or remove `#money` from every matching bookmark without deleting the bookmarks. A user can target all matches by filtering on `#money`, then choosing **Select all** from **Actions** without checking a row first.

- **US-14-AC1:** Place a checkbox to the left of each bookmark title, aligned on the same line. Checking it selects the bookmark, not its link. Track selection by bookmark ID so scrolling a virtualized row out of view does not change which bookmark is selected.
- **US-14-AC2:** Place a compact **Actions** dropdown before `.result-count`, with the selected count beside the trigger, separated from the result count and search. Keep the trigger enabled when matching bookmarks exist, including when none are checked; disable it during loading, mutations, or when there are no matches. With no selection, enable **Select all** and disable every other action. Use a keyboard-accessible trigger with an accessible name; if using a character as its icon, use a broadly supported text character (e.g. ASCII `*`), not an image or icon font. Verify rendering across Windows, macOS, Linux, and different locales.
- **US-14-AC3:** **Select all** checks every bookmark matching the current folder, tag, and search filters. **Deselect all** clears all checked bookmarks without changing filters. **Invert selection** toggles each match. Selection actions cover the entire filtered result set, including rows outside the viewport, not unrelated bookmarks.
- **US-14-AC4:** **Open selected** respects bookmark-click settings. New-tab mode opens every selected result in background tabs. Current-tab mode opens the first selected result (result order) in the captured originating tab after creating the remaining background tabs in its window. Accepted opening batches continue after popup dismissal via the approved worker. Close explicitly only after complete success when enabled; Chrome can still dismiss during current-tab navigation. **Move to folder** lets the user choose a destination folder and moves the selected bookmarks there.
- **US-14-AC5:** **Add tag** shows the existing tag cloud and a **New tag** input. Apply the chosen tag to selected bookmark titles that lack it, using the existing hashtag identity and parsing rules. Preserve other title text and tags.
- **US-14-AC6:** **Remove tag** offers only tags present on at least one selected bookmark. Disable the action if none have tags. Remove all matching hashtag occurrences from the selected titles, leaving other text, bookmarks, and unselected titles intact.

US-14 tag actions only add or remove hashtags in checked bookmark titles; they do not rename a tag library-wide. Jan chose to deselect checked bookmarks when they no longer match after a filter or snapshot change. Selection remains transient in the popup. Bulk mutations are prepared with the existing title helpers in the popup, omitting no-ops, then executed sequentially by the worker. Refresh once after successful changes while the initiating popup survives; partial failures are reported there. Missing batch responses trigger a refresh and an uncertain-outcome warning, not automatic retries. Snapshot-title conflict risk remains unchanged. The actions dropdown permits **Select all** before any row is checked; the remaining actions require a selection.

### US-15 — Rename a tag across bookmarks (planned)

- **US-15-AC1:** Select an existing source tag, then choose an existing destination tag or enter a new tag.
- **US-15-AC2:** Replace the source hashtag in every matching bookmark title, regardless of current filters or checked rows. Use the existing hashtag parsing and identity rules. Preserve unrelated title text and tags, and do not change bookmark URLs or folders.

The location of the rename control is undecided.

### US-12 — Redesign the popup layout (unreleased)

These criteria define the current control placement and labels, superseding older descriptions in US-05 and T-05.

- **US-12-AC1:** Place the wrapping cloud above search, with folders before tags. Use folder green `#2E7D32` and tag blue `#1976D2`, both with white semibold text. Selecting a visible chip updates results directly and keeps its position and page. Show selection with a red `#D32F2F` background only; retain the existing hover, keyboard focus, and pressed-state behavior.
- **US-12-AC2:** Show First, Previous, and Next directly above the choices when paging is needed; hide pagination when all choices fit.
- **US-12-AC3:** Put Clear filters by the cloud and compact bookmark search beside the result count above the list. Clearing restores unfiltered results in one action. Retain compact bookmark rows and list-only scrolling.
- **US-12-AC4:** Use one top row for Filters, compact Clear filters, Add bookmark, and Options. Remove the branded header, footer, and explicit close button. Keep Refresh and the popup-only Show folders setting available in Options. Do not change bookmark-click or popup-close preferences.

### US-09 — Restore popup filters (version 2.1)

- **US-09-AC1:** In Options, leave **Clear filters on popup** unchecked by default. Save this checkbox preference separately from **Show folders** in `chrome.storage.local`. While unchecked, save only the query, selected tags, and folder ID in `chrome.storage.session` as filters change.
- **US-09-AC2:** Restore filters when reopening during the browser session. Reconstruct bookmarks from Chrome's tree.
- **US-09-AC3:** Enabling the option deletes saved filters without changing the current view; subsequent popups open unfiltered. Disabling it saves the current filters. Clear filters clears active and saved filters without changing the option. Ending the browser session clears saved filters but retains the option.
- **US-09-AC4:** Store no bookmarks or indexes. **Show folders** defaults on and persists across popup and browser restarts, independently of remembering or clearing filters.
- **US-09-AC5:** Add `storage`, set a compatible minimum Chrome version, and set extension version `2.1`.
- **US-09-AC6:** Document and regression-test restore, updates, Reset, expiry, and storage boundaries.

### US-10 — Configure appearance (version 2.2)

- **US-10-AC1:** Let users set the base font size. Use adjacent numeric inputs in one Popup size: width × height row for popup width and height within supported Chrome popup limits. Provide **Maximum filter height (% of popup)**, a maximum for the combined folder/tag cloud including paging controls, based on full popup height. From 2.14, retain the stored `split` number but interpret it as this full-popup percentage. Clamp to remaining workspace minus result controls and 4rem of bookmark space. Moving the slider toward filters gives the cloud more space; moving it toward bookmarks leaves more room for results. Preserve usable space for both and keep overflow filters reachable through pagination.
- **US-10-AC2:** Offer Light, Dark, and System modes. System follows Chrome’s `prefers-color-scheme` signal on open and when the system setting changes while the popup is open. Explicit Light and Dark modes ignore system changes. Let users select foreground, tag, folder, filter highlight (hover), and selection colors independently for each theme using visual family and shade swatches covering the full [Material palette](https://www.materialpalette.com/colors), including accent shades, without requiring hex codes. List each theme's color properties with its current swatch in Options; open a separate accessible modal for family and shade choices when a property is selected. Selecting a family applies its last shade; show its shades inside a visually distinct frame. Keep swatch visuals proportional to the font size while retaining keyboard-accessible button targets. Closing the modal returns focus to its property. Fix the light background at white (`#FFFFFF`) and the dark background at `#212121`; do not provide background-color editing.
- **US-10-AC3:** Switching themes applies that theme's colors and fixed background; editing or resetting one theme’s palette to defaults does not change the other palette or any layout settings. Separate configuration rows with thin dividers.
- **US-10-AC4:** Save font size, popup dimensions, split ratio, chosen mode, and both palettes in `chrome.storage.local`. Restore them across restarts; for System mode, resolve the current theme rather than saving the last resolved theme.
- **US-10-AC5:** Separate preferences from bookmarks/indexes/session filters. Retain the separate US-09 folder visibility preference.
- **US-10-AC6:** Set version `2.2`. Update README and product documentation.
- **US-10-AC7:** Test font size, popup dimensions, ratio slider endpoints and resizing, pagination and list usability, independent palettes and fixed backgrounds, live System changes versus explicit modes, and restoration after restart.

Approved developer-build defaults: System mode; 540 × 580 px popup (width 380–800, height 400–600); 13 px font (12–18); 35% maximum filter height relative to the full popup (20–60%, step 5). Small clouds yield unused space to bookmarks. Preserve the current light colors; dark defaults are #FAFAFA text, #90CAF9 tags, and #A5D6A7 folders on #212121.

### US-11 — Configure bookmark-click behavior (version 2.3)

Version 2.11 follow-up: **Switch to opened tab** defaults off, persists as boolean `activate` in `bookmarkClicks`, and is disabled in current-tab mode without discarding its saved value. Missing/invalid values resolve to false. Single new-tab opens use this flag; Open selected creates inactive tabs first and then activates the first selected result when enabled. Current-tab mode ignores the flag. Chrome may close the popup on activation regardless of explicit closing. Existing target/close settings and storage boundaries are unchanged.

- **US-11-AC1:** Provide an Open bookmarks in new tab checkbox, unchecked by default (current tab). Version 2.9 creates new tabs inactive, preserving focus and the popup when explicit closing is disabled. Both click preferences also apply to Open selected.
- **US-11-AC2:** Provide a Close popup after opening a bookmark checkbox, checked by default, subject to Chrome lifecycle constraints. Show both checkboxes directly in Options without a visible Bookmark clicks heading.
- **US-11-AC3:** Save both preferences in `chrome.storage.local`; restore across popup/browser restarts.
- **US-11-AC4:** Separate preferences from bookmark data and session filters.
- **US-11-AC5:** Verify/document lifecycle constraints, especially during current-tab navigation.
- **US-11-AC6:** Set version `2.3`. Update README and product documentation.
- **US-11-AC7:** Regression-test defaults, both targets, both close choices, their combinations, and persistence.

Jan approved current-tab navigation and closing the popup by default on 2026-11-21. Closing can occur automatically during current-tab navigation even when the close setting is off; the extension cannot prevent Chrome from closing its action popup.

## Workflow task acceptance criteria

### T-08 — Remove automatic logging and commit instructions

Jan moved T-08 ahead of T-13 on 2026-11-12 and requested that the agent perform it, log it, and commit it. Future logs and commits require an explicit request.

- **T-08-AC1:** Remove the automatic logging, session-ending, and commit requirements from `AGENTS.md` before T-13. Keep project-status updates and explicit user verification.
- **T-08-AC2:** Related workflow summaries in README and current project memory match the revised instructions.

## Post-implementation task acceptance criteria

T-12 (plan archival) is removed; the plan remains active. T-08–T-11 and T-14–T-16 are grouped under Modernization in `.memory/plan.todo`. T-15 is closed based on Jan's confirmation that the package was released and published. Future releases are at Jan's discretion, not planning tasks. T-09 maintains per-feature test cases; T-10's separate testing role remains pending clarification.

### T-09 — Prepare manual test materials

- **T-09-AC1:** Maintain `.memory/test-cases.md` with actions and expected results for implemented features. Update the file with each new feature or changed behavior and use affected cases during feature/epic verification.
- **T-09-AC2:** Include a reusable report template for Jan's results and issues. Distinguish test definitions from executed tests and explicit user verification.

### T-10 — Perform final manual verification

- **T-10-AC1:** Jan manually tests all implemented features as the final overall verification, using the materials from T-09.
- **T-10-AC2:** Jan uses the extension for a period he chooses and records discovered issues in the prepared test report.

### T-11 — Clean the repository for the current version

- **T-11-AC1:** Consolidate redundant user documentation without deleting referenced historical evidence or unrelated private files.
- **T-11-AC2:** Keep README to a short description, installation, privacy, and documentation links. Provide development instructions in `docs/development.md`, detailed extension documentation in `docs/README.md`, and complete release history in `docs/changelog.md`.
- **T-11-AC3:** Identify historical screenshots as historical. Keep distribution preparation in `.memory/distribution.md`, rather than in published user documentation.
- **T-11-AC4:** After cleanup, the current version's required build, test, and package checks pass, and documentation links resolve.

### T-15 — Package and publish the extension

- **T-15-AC1:** Follow and verify `.memory/distribution.md` to build, test, and create an upload ZIP with `manifest.json` at the root and no private files.
- **T-15-AC2:** Prepare current store screenshots, release notes, and accurate privacy/permission declarations. Jan controls account access and submission/publication.
- **T-15-AC3:** Record actual submission and publication confirmed by Jan. Do not equate a built ZIP with a published release. Jan closed T-15 based on his confirmation; an independent installed-store check is not required for this task.

### T-16 — Add support and rating links

- **T-16-AC1:** Include a **Buy me a coffee** link in both `README.md` and the Options dialog. Confirm the provider and destination URL with Jan before implementation; Gumroad is a candidate.
- **T-16-AC2:** Include a **Rating** link in both places that opens Chromtag’s rating page in the Chrome Web Store.

### T-14 — Review open GitHub issues

- **T-14-AC1:** Under Modernization, check the repository's open GitHub issues without depending on plan archival.
- **T-14-AC2:** Decide with Jan what to do with each open issue and record the outcome.

## High-priority audit follow-ups (planned)

These tasks record findings from the read-only audit of the 2.3 developer build. They do not change the verified status of earlier work. Address them one at a time after Jan authorizes implementation and chooses a branch. The 2026-11-22 `npm run check` and `npm test` passed, but the existing tests do not cover all cases below.

### T-17 — Bound filter-cloud rendering and measurement

Version 2.13 observes root layout-property changes independently of cloud ResizeObserver events. A larger maximum can leave a previously trimmed cloud unchanged in size; explicit layout invalidation restores the bounded probe so increasing Filter space can grow again. Ignore unrelated root style changes; disconnect both observers on destruction.

From 2.14, Jan approved increasing the probe cap from 32 to 512 choices so dense short-label clouds can fill the configured maximum height. Only the fitted page remains after measurement. The cloud now probes at most 512 buttons per page, retains only fitted choices, and renders no buttons from other pages. Next/Previous/First keep every choice reachable; input changes reset paging, while selection leaves the page in place. Resize remeasures. Native Chrome regression covers 2,000 distinct tags, 246 mixed folder/tag choices, keyboard paging, and supported layout changes. This is a DOM bound, not a timing guarantee.

### T-18 — Preserve the latest preferences under rapid changes

Delayed/reordered storage mocks reproduced stale filter and whole-appearance writes: an earlier call finishing last overwrote a newer value. Version 2.5 orders writes per storage key in the popup: session filter saves/removals, remember and folder preferences, appearance, and bookmark-click preferences. A failed write reports its error but does not block later writes. Changes made before an initial settings read completes remain in the UI; reopening restores the last completed choice. Bookmark data stays transient; filter values remain in session storage, while preferences remain in local storage. Browser integration uses ordinary Chrome storage; delayed completion and rejection are exercised by mocked regression tests. No guarantee is made for a popup closed before a queued write starts.

### T-19 — Resolve default and selectable color contrast

Jan approved replacing the light folder-chip `#388E3C` (4.12:1 against white) with `#2E7D32` (5.13:1), and allowing selection only of shades with good text contrast. The color picker filters the full Material palette by role and theme: text against the theme's fixed background, ordinary chips against white/light or `#212121`/dark labels, and hover/selection chips against white labels in either theme. All normal-size text pairs require at least 4.5:1. Families with no valid shades are omitted; choosing a family still applies its last eligible shade. Stored low-contrast colors fall back to that role's default on reopen. Light and dark palettes remain independent. Row badges retain their specified `#9E9E9E` backgrounds with `#212121` text (6.01:1). Changing selected and hovered cloud chips to white text preserves contrast even when a dark-theme ordinary chip uses dark labels. Automated coverage checks defaults, selectable shades, stored colors, and native Chrome picker behavior; it does not claim comprehensive WCAG conformance.

### T-20 — Distinguish bookmark-load failure from an empty library

A bookmark-read or processing failure sets a load-failure state independent of the shared error text. The popup suppresses “No bookmarks yet” and “No matching bookmarks” while that state is active; it shows the existing load error and retains the previous snapshot when available. A successful refresh replaces the snapshot, clears the failure state, and shows “No bookmarks yet” only for a genuinely empty result. Other action errors do not change the load-failure state. Component and store tests cover failed initial reads, retry, an empty tree, a failed refresh after a successful read, and one tree read per refresh. The existing reading/processing phases and progress reset remain unchanged.

## Test-analysis follow-up scope and acceptance criteria

Use the existing test runners and checks. Execute one scoped item at a time, retain applicable check results, and wait for Jan's verification before starting the next. Choose the branch before feature or bug-fix implementation. No release is scheduled.

### T-21 — Verify and fix bulk popup interruption

- **T-21-AC1:** Reproduce Open selected in the actual action popup with at least three disposable bookmarks; verify exactly one separate tab per selected bookmark and no unrelated tabs.
- **T-21-AC2:** Bulk batches must finish after the popup is dismissed, as confirmed by Jan. Exercise dismissal during delayed bulk mutations and tab opening; verify completion against native outcomes. Popup dismissal must not cancel the remaining selected actions. This requirement does not imply survival of browser shutdown or guarantee success for rejected Chrome API calls.
- **T-21-AC3:** Fix reproduced interruption to meet the confirmed policy and retain actual-popup regression evidence. Prefer the smallest supported change; add a background worker only if a demonstrated need requires it. Preserve permission, CSP, and bookmark-storage boundaries. Do not claim popup-owned loops survive dismissal.

### T-22 — Verify native bulk outcomes and failure recovery

- **T-22-AC1:** Extend native Chrome integration to execute move, existing/new-tag addition, and tag removal. Compare IDs, titles, URLs, and parent IDs before and after; preserve unselected bookmarks and unrelated fields. Include selection across virtual pages and filter exclusion.
- **T-22-AC2:** Retain or extend deterministic coverage for rejected writes, missing bookmark/folder IDs, no-op batches, and successful mutations followed by refresh failure. Compare actual changed IDs with reported results; fix reproduced reporting/recovery discrepancies. Agree any undefined retry behavior before implementing it.
- **T-22-AC3:** Retain the documented cached-title overwrite risk; conflict detection/merging is not part of this task.

### T-23 — Complete criterion validation and identify tested source

- **T-23-AC1:** Extend the existing mapping completeness check to all applicable implemented criteria, without requiring regression evidence for unimplemented stories. Test that a missing applicable mapping fails validation.
- **T-23-AC2:** Retain `npm run check` and `npm test` evidence identifying the reviewed source by clean commit or dirty-source fingerprint. Record the Chrome version actually used.
- **T-23-AC3:** Correct current-version documentation discrepancies identified by the report after checking current files. Preserve historical evidence as historical.
- **T-23-AC4:** Reuse strict compiler/build and project checks. Do not add lint/format frameworks, remote branch protection, or CI enforcement in this task. Absent protection remains a documented solo-project risk.

### T-24 — Verify immediate-close preferences and update compatibility

- **T-24-AC1:** Test rapid preference/filter changes followed by immediate closure and reopening of the actual popup; retain ordered-write tests and distinguish completed writes from calls never issued.
- **T-24-AC2:** In a disposable profile, test updating from the retained published 2.0 build to the candidate without clearing data. Check intended defaults, preferences, session expiry, and storage boundaries. If the old artifact is unavailable, report this check as blocked rather than passed.
- **T-24-AC3:** Fix reproduced discrepancies against agreed persistence behavior, or obtain Jan's agreement to a documented lifetime limitation before claiming readiness.

### T-25 — Verify large dialogs, keyboard access, and platform rendering

- **T-25-AC1:** Exercise single/bulk editors and folder selectors with existing dense-tag/large-tree fixtures, including 380 × 400 at 18 px text and supported layout extremes. Check controls remain reachable and usable.
- **T-25-AC2:** Verify keyboard navigation, focus return, visible errors, and assistive-technology announcements. Record available Windows/macOS/Linux results; missing environments remain unverified.
- **T-25-AC3:** Record counts, elapsed times, browser, OS, and hardware context. Agree timing thresholds before treating measurements as pass/fail; add pagination or virtualization only if demonstrated problems justify it. Fix reproduced interaction/layout defects without inventing performance guarantees.

## Verification procedure

These steps apply after the relevant implementation and tooling exist.

1. Install locked dependencies with `npm ci`.
2. Build the production extension with `npm run build`.
3. Run the regression suite with `npm test`.
4. Run the configured manifest validation and static checks.
5. Load `dist/chromtag/browser/` with Chrome's **Load unpacked** action.
6. Check the popup for runtime errors and CSP violations.
7. Verify each applicable criterion against its mapped test and manual scenario.
8. Check bookmark changes in Chrome Bookmark Manager.
9. Record results for the synthetic collection and any available representative profile.
10. Check popup reopen and browser restart behavior for the implemented release.

## Open decisions and evidence gaps

- Known bulk-title concurrency risk: a title changed by Chrome Sync, Bookmark Manager, or another extension after the popup snapshot can be overwritten by a later Chromtag tag action using the cached title. Jan requested documenting this risk rather than adding conflict handling now. The last successful title write wins, including potentially stale unrelated title text. Frequency is unmeasured; no incident is established.
- Jan confirmed the solo project currently has no branch protection. Merging without passing checks is a known workflow risk; local checks and explicit Jan verification remain the controls. New remote enforcement is not authorized.

- Real-profile performance and timing targets. T-01 records the legacy synthetic baseline; T-04/T-05 use 10,001 supported browser records and deep unit fixtures. Tests check at most 24 live rows in exercised layouts; this is not a timing guarantee.
- T-13 uses all URL-bearing nodes for progress, an 8 ms chunk budget for large snapshots, and a 10,000-node threshold for guidance. The 10,001-bookmark synthetic test is evidence, not a support guarantee.
- Appearance defaults and supported ranges are recorded under US-10; T-05 checks compact layout and overflow. US-09, US-10, and US-11 await user verification.
- Current-tab navigation can close the action popup regardless of the close preference; verify this lifecycle behavior in the developer build.

Resolve decisions before affected implementation. Analysis suggestions are not approved technical choices.
