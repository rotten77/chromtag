# Legacy popup measurements

Measured on 2026-11-12 for T-01. These results characterize version 1.8, before the Angular rewrite.

## Scope and environment

The diagnostic runs the archived HTML, scripts, and styles in headless Google Chrome 157.0.8103.51.
The host uses Windows 11 Pro 10.0.26300 and an Intel Core i7-12700H processor.
The runner uses Node.js 26.7.0 and Playwright 1.65.0, with a 500 × 600 CSS-pixel viewport.

The runner serves the popup over loopback HTTP. It inserts setup and instrumentation scripts without editing the archive.
It substitutes synthetic `chrome.bookmarks.getTree()` callbacks for native API access. It does not access a real Chrome profile or mutate bookmarks.

Each fixture has 112 named folders, including 2 browser roots, 10 group folders, and 100 leaf folders.
Bookmarks have depth 4 from the implicit root. Each bookmark has 2 hashtags, drawn from 64 distinct tags.
Titles and URLs use deterministic ASCII values. Separate probes cover Unicode, punctuation, and callback order.

This fixture represents a large collection for controlled comparison. It does not represent the user's measured collection.

## Method

The runner performs 1 unreported warm-up with 100 bookmarks. Each measured run uses a fresh browser context.
It performs 3 runs per completed collection size, in ascending size order, without concurrent benchmark runs.
The 10,000-bookmark trial reached the timeout on its first attempt. No further trials at that size ran.

Startup time starts at `App.init()` and ends after all 3 tree callbacks complete.
Callbacks run in deterministic folder, tag, bookmark order in 1 scheduled task.
Each callback receives a separate `structuredClone()` of the fixture. Startup includes these copies and synchronous DOM work.
The browser heartbeat records the longest observed timer gap during startup.

The runner counts tree reads, filter calls, rendered rows, and cumulative row-set sizes passed to startup filtering.
That cumulative count sums the current row count before each `App.getSearch()` call. It is not a CPU-instruction count.

Search durations measure `App.getSearch()` execution after startup. They exclude the later visibility-count inspection and browser paint.
Queries cover a unique title, a folder, no match, and reset to an empty query, in that order.

The per-load timeout is 120 seconds. This diagnostic limit is not an agreed product performance requirement.

## Results

| Bookmarks | Startup median | Startup range | Rendered bookmark rows | Cumulative startup row-set sizes |
|---|---|---|---|---|
| 100 | 35.6 ms | 33.5–37.8 ms | 100 | 5,050 |
| 1,000 | 759.1 ms | 758.7–759.3 ms | 1,000 | 500,500 |
| 5,000 | 24.736 s | 23.456–25.359 s | 5,000 | 12,502,500 |
| 10,000 | Not available: readiness timeout | No completion within 120 s | Not captured | Not captured |

Each completed run made 3 tree reads and 1 filter call per inserted bookmark.
The cumulative row-set count equals `N × (N + 1) / 2`. Live rows grow with collection size instead of the viewport.

At 5,000 bookmarks, the popup blocks its JavaScript event loop for tens of seconds during initialization.
This reproduces the frozen-looking startup symptom in the synthetic browser harness. It does not establish a universal failure threshold.
The 10,000-bookmark trial did not signal readiness before the timeout. No completed startup, row count, or crash was captured for that trial.

| Bookmarks | Unique-title search median | Folder search median | No-match search median | Empty-query reset median |
|---|---|---|---|---|
| 100 | 0.6 ms | 0.1 ms | 0.1 ms | 0.1 ms |
| 1,000 | 2.9 ms | 1.2 ms | 0.7 ms | 0.7 ms |
| 5,000 | 15.4 ms | 6.7 ms | 6.2 ms | 4.5 ms |

The longest heartbeat gaps ranged from 23.808 to 25.676 seconds at 5,000 bookmarks.
These gaps include delayed timer delivery and layout work after the synchronous startup callbacks.

## Behavior probes

The small fixture uses 100 bookmarks with the same folder/tag shape.

| Probe | Observed legacy behavior |
|---|---|
| Folder callbacks before bookmark callbacks | The first row shows `Folder 000`; searching that folder returns 1 bookmark. |
| Bookmark callbacks before folder callbacks | The first row has no folder label; searching `Folder 000` returns 0 bookmarks after startup. |
| `word#tag` | Parses `#tag` and displays `word`. |
| Lone `#` | Parses an empty tag and removes the marker from the displayed title. |
| `Title #C++` | Tag removal throws an invalid-regular-expression `SyntaxError`. |
| `Title #Žluťoučký` | Parses normalized `#zlutoucky` but leaves the original hashtag in the displayed title. |
| `Title #work,` | Includes the comma in the tag. |
| Search `example.invalid` | Returns 0 bookmarks although every URL contains that hostname. |
| Search `"]` | Throws a generated-selector syntax error. |
| Search `cafe` or `café` | Both match precomposed `Café` and decomposed `Cafe\u0301`. |
| Search decomposed `cafe\u0301` | Matches only the decomposed title, demonstrating inconsistent canonical-equivalence handling. |
| Search `i` | Matches both `I` and `İ`; query `ı` matches the dotless title separately. |
| Arabic, Chinese, emoji, and `C++` without a hashtag | These literal queries match their corresponding sample titles. No blanket script failure was reproduced. |
| Title `Literal <b>bold</b>` | Displays `Literal bold` and creates a real `b` element instead of preserving literal markup text. |

Performance samples are in `.local/t01-baseline/results.json`. The focused behavior run is in `.local/t01-baseline/probes.json`.
The popup JavaScript SHA-256 is `62eafd3482d13d6fd9b8ba07f2c1d84058fbeb360a2712feb9d3dc0df140f866`.
Both raw reports include hashes for all 6 archived runtime files used by the harness.

## Target decisions and remaining limits

The user approved hashtag boundaries/identity, literal phrase search, and folder-ID/descendant matching during T-01.
The user also approved grapheme boundaries for search matches, preserving combining-mark and Turkish-diacritic distinctions.
The [technical specification](../.memory/technical-specification.md#matching-and-hashtag-decisions) owns these rules and their acceptance criteria.
The [historical baseline](legacy-baseline.md) retains the old behavior; the [product specification](SPEC.md) describes intended changes.

These timings exclude real Chrome bookmark API latency, extension-page CSP, actual popup lifecycle, and first-paint measurement.
Headless execution, instrumentation, fixture distribution, and host load can affect results. Search durations are not complete input-to-paint latencies.
The benchmark does not reproduce a crash or establish a maximum supported collection size.
Deep recursive traversal remains an inferred risk; this depth-4 fixture does not test stack exhaustion.
Real-profile measurements and modernized-extension verification remain future work under T-06.
Timing budgets, debounce duration, and virtualization overscan remain undecided.

## Reproduction

The ignored `.local/legacy/chromtag/` archive is required. A fresh Git checkout does not contain the archived runtime.
Install dependencies in the separate ignored directory. The commands do not create an Angular workspace.

1. Open PowerShell in the repository root.
2. Install the diagnostic dependency:

   ```powershell
   npm install --prefix .local/t01-tools --no-save --package-lock=false playwright@1.65.0
   ```

3. Install Google Chrome if the `chrome` browser channel is unavailable.
4. Run the diagnostic:

   ```powershell
   node tools/legacy-baseline.mjs
   ```

5. Read `.local/t01-baseline/results.json` for raw timings, source hashes, environment details, and behavior probes.

For a shorter check, use:

```powershell
node tools/legacy-baseline.mjs --counts=100,1000 --runs=1 --output=.local/t01-baseline/smoke.json
```

The runner asserts expected row counts, tree reads, filter-call counts, cumulative row-set sizes, and search result counts.
It also checks the callback-order defect, punctuation-tag exception, and literal-rendering defect.
Failures exit with a nonzero status. This diagnostic characterizes legacy behavior; it is not the future Angular regression suite.

## T-01 acceptance evidence

| Criterion | Evidence |
|---|---|
| T-01-AC1 | Historical behavior remains in `legacy-baseline.md`; target changes remain in the technical/product specifications. |
| T-01-AC2 | Deterministic fixture, measured runs, timing boundaries, and reproduction commands appear above. Raw data remains in ignored `.local/`. |
| T-01-AC3 | User-approved hashtag, phrase-search, grapheme-boundary, and folder-filter semantics appear in the technical specification. |
