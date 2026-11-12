# Technical specification

Updated: 2026-11-12

## Scope and authority

Chromtag is a Chrome extension for browsing and editing Chrome bookmarks through a popup. Hashtags in bookmark titles provide tags.

This specification defines implemented E-20 behavior and planned versions 2.1–2.3. The plan distinguishes automated readiness from user verification. Acceptance criteria live here. The plan tracks matching IDs. `docs/SPEC.md` describes the intended product. Historical 1.8 behavior and analysis remain in `docs/legacy-baseline.md` and `docs/legacy-analysis.md`.

## Historical implementation

The local reference is `.local/legacy/chromtag/`. Version 1.8 already uses Manifest V3, `bookmarks` and `tabs` permissions, and a popup without a background service worker. It uses jQuery, NanoScroller, and YUI CSS. Bookmarks remain in Chrome; folder visibility uses `localStorage`.

Confirmed structural issues include 3 tree reads per refresh, DOM-based folder lookup, filtering after each inserted row, unbounded rendering, limited slug normalization, generated selectors, dynamic tag regexes, and HTML-string interpolation. Deep recursive traversal is an inferred risk.

T-01 recorded a synthetic timing baseline and behavior probes in [legacy measurements](../docs/legacy-measurements.md).
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

| Data | Version | Location | Lifetime |
|---|---|---|---|
| Bookmarks, title hashtags, folder relationships | All | Chrome native bookmark tree | Chrome-managed |
| Derived model and search index | All | Popup memory | Popup load/refresh |
| Folder-cloud visibility | 2.0 onward | Popup memory | Popup session |
| Search query, selected tags/folder | 2.0 | Popup memory | Popup session |
| Search query, selected tags/folder | 2.1 onward | `chrome.storage.session` | Current browser session |
| Appearance/layout preferences | 2.2 onward | `chrome.storage.local` | Across popup/browser restarts |
| Bookmark-click preferences | 2.3 onward | `chrome.storage.local` | Across popup/browser restarts |

Do not use `localStorage`, a separate bookmark store, an account, or a backend. Never persist bookmarks or derived indexes in Chrome storage. Persistent preferences are explicit exceptions to the transient extension-state policy.

### Manifest and packaging

- Retain `manifest_version: 3`; audit metadata, icons, permissions, APIs, and Chrome compatibility.
- Keep `bookmarks` and replace broad `tabs` access with `activeTab`. The user approved this permission policy during T-02 on 2026-11-12.
- Read current-page metadata only when Chrome exposes it under the action's temporary grant. If required metadata is unavailable, report that the page cannot be saved and create no incomplete bookmark. US-06 owns implementation and regression coverage.
- Add `storage` for versions 2.1–2.3 preferences. Session storage requires Chrome 102 or a higher framework floor.
- T-03 selects Angular 22, TypeScript 6, and Chrome 157 as the conservative application floor. The manifest and `.browserslistrc` agree. Node ranges follow Angular's published compatibility table.
- Use native `chrome.*` Promise APIs. Use `Intl.Segmenter` with grapheme granularity for the approved search-boundary policy; its Chrome 87 floor is below the selected extension API floor.
- Add no background service worker without a demonstrated need.
- Keep `manifest.json` and the preserved 16/48/128 px PNG icons in `public/`; copy them into the production output. T-07 sets extension version `2.0` after automated checks; explicit user verification remains pending.
- Set `action.default_popup` to built `index.html`. The loadable extension root is `dist/chromtag/browser/`.
- Bundle local scripts/styles only. Comply with extension Content Security Policy (CSP), without remote code, inline scripts, or `eval`.
- Declare `script-src 'self'; object-src 'none';` for extension pages. Do not add host permissions, content scripts, or a sandbox.

The [manifest audit](../docs/manifest-audit.md) records sources, compatibility limits, and the handoff to Angular setup.
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

## Version 2.0 feature acceptance criteria

### US-01 — Browse Chrome bookmarks

- **US-01-AC1:** Opening the extension action opens the popup.
- **US-01-AC2:** Include supported bookmarks nested at all folder levels.
- **US-01-AC3:** Rows show title, URL, containing folder when available, parsed tags, and an edit control. Display titles omit parsed hashtags safely.
- **US-01-AC4:** Selecting a title opens its URL in a new tab. Version 2.3 makes the target configurable.
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
- **US-05-AC3:** From version 2.1, Reset clears saved filters; reopening does not restore cleared filters.

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

- **US-08-AC1:** Toolbar controls show or hide the folder cloud.
- **US-08-AC2:** Keep visibility only in popup memory, never `localStorage` or either Chrome storage area.
- **US-08-AC3:** Closing the popup discards the visibility choice. Show folders initially; the user selected this default during E-20 implementation.

## Supporting task acceptance criteria

### T-00 — Prepare the repository

- **T-00-AC1:** Use the user-created `modernizing-chromtag` branch. Verify its presence before implementation; request user creation if absent.
- **T-00-AC2:** Preserve the old README/images under `docs/`, with working relative links.
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

T-05-AC5 through T-05-AC10 record Jan's 2026-11-12 review changes to the 2.0 candidate. Jan selected a fixed cloud with excess labels collapsed instead of scrolling the cloud with bookmarks. Pagination keeps the hidden choices reachable and outside keyboard focus until displayed. The existing editor overlay/tag picker can still scroll independently when open.

### T-06 — Document and verify

- **T-06-AC1:** Keep README features, permissions, compatibility, storage, commands, and `docs/SPEC.md` consistent with implemented releases.
- **T-06-AC2:** Map every applicable target feature/criterion to repository regression tests. Update tests/mapping when criteria change.
- **T-06-AC3:** Use unit/component tests with mocked Chrome APIs and integration coverage across popup/API boundaries. Include tests in `npm test`.
- **T-06-AC4:** Run `npm ci`, `npm run build`, `npm test`, manifest validation, and static checks after tooling exists. Required checks pass.
- **T-06-AC5:** Load the output in supported stable Chrome. Verify applicable stories without runtime errors or CSP violations.
- **T-06-AC6:** Verify 10,000+ synthetic bookmarks and a representative real profile when available. Record baseline measurements and remaining limits.
- **T-06-AC7:** Cover literal rendering of markup-significant titles/folders/URLs/tags, all filter combinations, and international-text cases.

Regression tests are explicit supplied requirements. `npm test` runs manifest, Angular/Vitest unit/component, production build, project/package, and native stable Chrome checks. [Criterion mapping](../docs/test-coverage.md) links every E-20/preparation criterion to evidence. [Testing documentation](../docs/testing.md) records limits and timestamped HTML reports.

### T-07 — Release version 2.0

- **T-07-AC1:** Set manifest version `2.0` after applicable verification.
- **T-07-AC2:** Add a v2.0 changelog entry describing machine-assisted development and human guidance.
- **T-07-AC3:** Remove replaced legacy runtime code after the Angular build works end to end and no references remain.

The supplied plan names `legacy/`; no tracked directory with that name exists now. Preserve the ignored `.local/legacy/` archive during implementation and final testing. T-11 handles obsolete legacy and work files after final testing.

## Planned version 2.0 follow-up acceptance criteria

### T-13 — Show bookmark processing progress

- **T-13-AC1:** On popup open and each refresh, indicate when Chrome's bookmark tree is loading and when Chromtag is processing the snapshot, including hashtags. Clear the indicator on completion or failure; retain existing error reporting.
- **T-13-AC2:** When a reliable total is available, show processed and total bookmark counts (for example, `45/1235`). Do not show a fabricated percentage or denominator while the tree read is pending. Define whether the count covers all tree bookmark nodes or only supported bookmarks before implementation, and keep the numerator/denominator consistent.
- **T-13-AC3:** Keep the indicator responsive during processing of large libraries, without repeated tree reads, persistent bookmark/index data, or unbounded row rendering. Ensure the progress is perceivable without flooding assistive-technology announcements.
- **T-13-AC4:** For large collections, provide reassuring guidance based only on measured evidence. It may cite the 10,001-supported-bookmark synthetic Chrome test, but must not imply a guaranteed maximum, real-profile result, or universal processing time. Decide whether to show guidance at a count threshold and select that threshold before implementation.
- **T-13-AC5:** Regression-test loading, determinate progress when available, completion/failure, large-library messaging, and snapshot/performance boundaries; verify in stable Chrome.

T-13 counts all URL-bearing tree nodes, including unsupported `javascript:` bookmarks; only supported bookmarks enter the list. The count uses a separate iterative pass over the same tree, not another Chrome read. A chunked iterative builder yields to the browser at most every 8 ms for large snapshots (1,000+ bookmark nodes), allowing progress to paint; small snapshots keep the synchronous fast path. Folder finalization also runs in chunks. The UI displays a count only after the tree arrives. At 10,000+ URL nodes it shows guidance citing the 10,001-supported-bookmark synthetic Chrome test without promising a capacity or duration. Assistive technology receives only the phase change, not each numeric increment.

## Later release acceptance criteria

### US-09 — Restore popup filters (version 2.1)

- **US-09-AC1:** Save only query, selected tags, and selected folder in `chrome.storage.session` as filters change.
- **US-09-AC2:** Restore filters when reopening during the browser session. Reconstruct bookmarks from Chrome's tree.
- **US-09-AC3:** Reset clears active/saved filters. Ending the browser session clears saved filters.
- **US-09-AC4:** Store no bookmarks/indexes there. Folder visibility remains popup-only.
- **US-09-AC5:** Add `storage`, set a compatible minimum Chrome version, and set extension version `2.1`.
- **US-09-AC6:** Document and regression-test restore, updates, Reset, expiry, and storage boundaries.

### US-10 — Configure appearance (version 2.2)

- **US-10-AC1:** Provide base-font, popup width/height, and combined folder/tag cloud height controls within supported bounds that respect Chrome popup limits and leave usable bookmark-list space. Keep cloud overflow collapsed and every label reachable through pagination.
- **US-10-AC2:** Provide light/dark themes. Let users select foreground, tag, and folder colors independently for each theme from the Material Design color palette. Fix the light background at white (`#FFFFFF`) and the dark background at `#212121`; do not provide background-color editing.
- **US-10-AC3:** Switching themes applies that theme's colors and fixed background; editing one theme does not overwrite the other.
- **US-10-AC4:** Save appearance/layout in `chrome.storage.local`; restore across popup/browser restarts.
- **US-10-AC5:** Separate preferences from bookmarks/indexes/session filters. Do not persist folder visibility.
- **US-10-AC6:** Set version `2.2`. Update README and product documentation.
- **US-10-AC7:** Regression-test defaults, each setting/palette, switching, persistence, bounds, overflow, scaling, fixed backgrounds, and cloud pagination at supported heights.

The light/dark backgrounds are fixed. Exact defaults for editable colors and cloud height, supported bounds, and the precise Material Design palette choices remain undefined.

### US-11 — Configure bookmark-click behavior (version 2.3)

- **US-11-AC1:** Provide current-tab/new-tab selection, defaulting to a new tab.
- **US-11-AC2:** Provide a yes/no popup-close setting, subject to Chrome lifecycle constraints.
- **US-11-AC3:** Save both preferences in `chrome.storage.local`; restore across popup/browser restarts.
- **US-11-AC4:** Separate preferences from bookmark data and session filters.
- **US-11-AC5:** Verify/document lifecycle constraints, especially during current-tab navigation.
- **US-11-AC6:** Set version `2.3`. Update README and product documentation.
- **US-11-AC7:** Regression-test defaults, both targets, both close choices, their combinations, and persistence.

The popup-close default remains undefined.

## Workflow task acceptance criteria

### T-08 — Remove automatic logging and commit instructions

Jan moved T-08 ahead of T-13 on 2026-11-12 and requested that the agent perform it, log it, and commit it. Future logs and commits require an explicit request.

- **T-08-AC1:** Remove the automatic logging, session-ending, and commit requirements from `AGENTS.md` before T-13. Keep project-status updates and explicit user verification.
- **T-08-AC2:** Related workflow summaries in README and current project memory match the revised instructions.

## Post-implementation task acceptance criteria

These tasks follow completion of the implementation epics E-00 through E-23.

### T-09 — Prepare manual test materials

- **T-09-AC1:** After implementation is complete, create a simple manual test case covering all implemented features, with actions and expected results.
- **T-09-AC2:** Create a reusable test-report file/template that Jan can use to record manual results and report issues during extended use.

### T-10 — Perform final manual verification

- **T-10-AC1:** Jan manually tests all implemented features as the final overall verification, using the materials from T-09.
- **T-10-AC2:** Jan uses the extension for a period he chooses and records discovered issues in the prepared test report.

### T-11 — Clean the repository for the current version

- **T-11-AC1:** After Jan completes final manual verification under T-10, identify and remove obsolete legacy files and temporary work artifacts. Retain the current version's source, required assets, build/test tooling, and supporting documentation.
- **T-11-AC2:** Review user documentation for the actual implemented version. Remove obsolete instructions and references, and keep setup, usage, and commands accurate.
- **T-11-AC3:** Replace outdated screenshots with screenshots of the final version. Update image references and remove unused superseded images.
- **T-11-AC4:** After cleanup, the current version's required build, test, and package checks pass, and documentation links resolve.

### T-12 — Archive the completed plan

- **T-12-AC1:** After final testing and repository cleanup are complete, archive the modernization plan with its recorded completion and verification states.
- **T-12-AC2:** Update README, repository instructions, and current memory references so the archived plan remains findable and session startup does not depend on a missing active-plan file.

### T-14 — Review open GitHub issues

- **T-14-AC1:** After plan archival, check the repository's open GitHub issues.
- **T-14-AC2:** Decide with Jan what to do with each open issue and record the outcome.

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

- Real-profile performance and timing targets. T-01 records the legacy synthetic baseline; T-04/T-05 use 10,001 supported browser records and deep unit fixtures. Tests check at most 24 live rows in exercised layouts; this is not a timing guarantee.
- T-13 uses all URL-bearing nodes for progress, an 8 ms chunk budget for large snapshots, and a 10,000-node threshold for guidance. The 10,001-bookmark synthetic test is evidence, not a support guarantee.
- Version 2.2 editable-color defaults, supported bounds (including cloud height), and precise Material Design palette choices. Light/dark backgrounds are fixed at `#FFFFFF`/`#212121`. Version 2.0 starts with a 13 px base font and a 540 × 580 px popup; T-05 checks compact layout and overflow.
- The v2.3 popup-close default and verified lifecycle limits.

Resolve decisions before affected implementation. Analysis suggestions are not approved technical choices.
