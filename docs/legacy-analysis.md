# Chromtag: Root Causes of Known Issues

This analysis describes the current implementation in `.local/legacy/chromtag/`. It separates causes confirmed by the code from risks that should be reproduced or tested. It is intended to support the planned v2.0 work; it does not change application behavior.

**Reference only:** Supplied by the user on 2026-11-12. Source structure was checked against the local archive; runtime failures and timing thresholds have not been reproduced in this session. Fix directions remain proposals unless adopted in [the technical specification](../.memory/technical-specification.md).

## Summary

The main large-library problem is repeated work in the popup: it reads the entire Chrome bookmark tree three times, incrementally inserts data into the DOM, and reapplies filtering after each bookmark. This makes startup work grow roughly quadratically with bookmark count. The current manifest is already Manifest V3, so the repository does not support the claim that it is using an obsolete manifest generation. The strongest observed causes are in popup data loading, DOM rendering, and search implementation.

## Root causes

### 1. Large bookmark collections become slow or appear to fail

**Root cause:** Loading and rendering repeatedly scan or rebuild data rather than deriving one model and rendering once.

**Evidence in `.local/legacy/chromtag/popup.js`:**
- `App.init()` starts `getFolders()`, `getTags()`, and `getBookmarks()` independently. Each calls `chrome.bookmarks.getTree()`, so the same full tree is retrieved and traversed three times on popup open.
- `App.processBookmark()` appends one bookmark row, then calls `App.getSearch()`. `getSearch()` scans the bookmark rows to show/hide them. Repeating a list scan after every inserted row makes total filtering work grow approximately as $N^2$ for $N$ bookmarks.
- `App.processFolder()` scans already-rendered folders to insert each new folder in alphabetical order. `App.processTag()` similarly scans tag and editor-tag DOM lists for deduplication and sorted insertion. Those costs also grow with the number of folders and distinct tags.
- The entire list is inserted into the popup DOM; there is no batch rendering or windowing to bound the number of live rows.
- `editorCallback()` calls `App.init()` again after mutations, repeating all three full-tree reads and all rendering work.

**Likely user-visible symptoms:** slow popup opening, delayed filtering, a frozen-looking popup, or resource exhaustion with large profiles. The code establishes the excessive work; the precise bookmark-count threshold depends on the device and profile and should be measured.

**Fix direction:** Read the tree once, derive bookmark/folder/tag/search data in memory, sort/deduplicate in that model, filter the model when input changes, and render in batches or with a virtualized list. Refresh that model once after mutations.

### 2. Bookmark folder labels and folder search can be inconsistent

**Root cause:** Three asynchronous tree reads are started without coordinating their completion, but bookmark rendering looks up folder names in DOM produced by the folder-read callback.

**Evidence:** `App.getFolders()` populates `#folders` asynchronously. `App.getBookmarks()` independently invokes `App.processBookmark()`, which queries `#folders` for the bookmark's parent folder and uses that result for both row labels and `data-search`. If bookmark processing runs before folder rendering, the folder name can be empty. There is no later reconciliation after the folder callback finishes.

**Likely user-visible symptoms:** missing folder labels or search not matching the folder name until the popup is reopened or data is refreshed.

**Fix direction:** Derive folder names and bookmark records from one tree snapshot before rendering. Do not use rendered DOM as the data source for other rendered content.

### 3. Search is incomplete for URLs and unreliable for some text

**Root cause:** Search uses a hand-maintained slug helper and matches generated substring metadata through a CSS selector, rather than searching structured fields with a defined Unicode policy.

**Evidence:**
- `App.tagSlug()` lowercases strings and maps only a hard-coded set of Czech accented Latin characters. It does not perform general Unicode normalization or language-aware case handling.
- `App.processBookmark()` builds `data-search` from the title and parent folder only. Although the URL is displayed in each row, it is not included in search metadata.
- `App.getSearch()` inserts the raw normalized search terms into generated attribute selectors. Characters meaningful to CSS selector syntax are not escaped, so some queries can make matching fail or behave unexpectedly.
- Matching is substring-based. The code does not define token, phrase, punctuation, or diacritic semantics beyond the helper's specific replacements.

**International-text qualification:** The helper does not transliterate Arabic, Chinese, or other scripts to ASCII. Those strings generally remain literal and may match by substring. The confirmed limitation is that no general Unicode normalization/case policy is implemented, so equivalent-looking or language-specific forms are not guaranteed to match consistently. Script-specific failure should be verified with representative test cases rather than assumed.

**Fix direction:** Search bookmark title, folder name, and URL as separate model fields. Normalize query and fields consistently, preserve the agreed diacritic distinctions, and compare strings directly rather than constructing selectors from user input.

### 4. Tag parsing and tag removal have edge cases

**Root cause:** Hashtags are extracted with a simple `#`-to-next-whitespace regular expression; normalized tag strings are then reused as both display/search values and regular-expression patterns.

**Evidence:** `App.matchTags()` uses `/#([^\s]*)/g`, which accepts any non-whitespace sequence after `#` and can also match an empty tag. `App.removeTag()` constructs a regular expression from each parsed tag without escaping regex metacharacters. The `tagSlug()` normalization can also differ from the original text, so a normalized tag need not be removable from its original title representation.

**Likely user-visible symptoms:** punctuation-heavy or unusual tags may be interpreted inconsistently, fail to be removed cleanly from the displayed title, or cause errors in regex-based removal. Newly entered tags are also forced through the same limited slug mapping and only the first space is replaced with a hyphen.

**Fix direction:** Define valid hashtag boundaries and canonical tag identity explicitly. Remove tags by parsing title spans or using literal string operations, not dynamically constructed regular expressions. Preserve original Unicode spelling where required.

### 5. Displayed bookmark data is assembled as HTML strings

**Root cause:** Folder names, tag text, bookmark titles, and URLs are concatenated into HTML strings before insertion with jQuery.

**Evidence:** `App.processFolder()`, `App.processTag()`, and `App.processBookmark()` construct markup from bookmark-tree values and insert it with jQuery append/insert operations. These values are not consistently escaped as text or attribute values.

**Likely consequences:** titles or folder names containing markup-significant characters can render incorrectly. This also creates an unsafe rendering boundary that should be removed; extension-page policies may block some active content, but they do not make string-built markup a robust rendering method.

**Fix direction:** Construct elements with DOM APIs or framework templates, place user-controlled labels in text nodes, and set validated attributes through APIs.

### 6. Folder visibility is stored outside the bookmark tree

**Root cause:** The popup reads and writes `localStorage.showfolders` during initialization and in the show/hide handlers.

**Effect:** Bookmark and tag data still live in Chrome's native bookmark tree, but the current app does have one extension-owned persistent UI preference. This conflicts with a strict interpretation of the v2.0 goal of using no local storage.

**Fix direction:** If no persistent extension state is allowed, keep folder visibility in popup memory so it resets when the popup closes. If persistence is desired, explicitly treat it as a separate user-interface preference rather than bookmark data.

### 7. Popup sizing and controls are rigid

**Root cause:** `popup.css` hard-codes a 500px body width, a 380px bookmark-list area, a 20px toolbar, and several small font sizes. Toolbar containers also hide overflow.

**Likely consequences:** content may feel cramped, long labels or a crowded toolbar may be clipped, and the layout has limited adaptation to different popup dimensions or accessibility text scaling. The edit control is revealed on hover, and the search input suppresses its focus outline, which can make keyboard use less apparent.

**Fix direction:** Preserve the compact visual design but use consistent CSS variables, allow content to wrap/scroll intentionally, and verify keyboard focus and layout at actual Chrome popup dimensions.

### 8. Deep bookmark-folder nesting can stress recursive traversal

**Root cause:** `processFolder()`, `processTag()`, and `processBookmark()` recursively walk the bookmark tree. Very deep nesting consumes JavaScript call stack even when the total number of bookmarks is moderate.

**Status:** This is a structural risk inferred from the implementation, not a confirmed reported failure. Normal user-created trees may not reach a problematic depth.

**Fix direction:** Use a shared iterative tree traversal when deriving the in-memory model, and include a deeply nested synthetic tree in tests.

## Compatibility and diagnostic notes

- `.local/legacy/chromtag/manifest.json` already declares `"manifest_version": 3` and uses the `bookmarks` and `tabs` permissions. The old version number (`1.8`) and legacy dependencies merit modernization, but the manifest version itself is not obsolete.
- The popup-only app does not currently have a background service worker. Nothing in the observed feature flow proves that a service worker is required; bookmark operations happen from the popup through Chrome APIs.
- No test runner or build configuration is present in the repository root. This makes regressions in large-list behavior, Unicode matching, and callback ordering harder to detect automatically.
- The largest confirmed root cause is repeated full-tree/DOM work. Replacing jQuery alone would not fix the scaling behavior unless the loading, indexing, filtering, and rendering algorithms are also changed.

## Suggested remediation order

1. Establish performance and behavior baselines, including a large bookmark fixture.
2. Load one bookmark-tree snapshot and derive a consistent in-memory model.
3. Replace DOM-driven filtering with direct model filtering; batch or virtualize row rendering.
4. Specify Unicode search/tag semantics and eliminate raw selector/regex construction from user data.
5. Render bookmark data through safe templates/DOM bindings.
6. Decide whether folder visibility should persist; remove `localStorage` if the no-persistence requirement is strict.
7. Validate interactions, keyboard behavior, and popup sizing in Chrome; add regression tests around the confirmed causes.
