# Development and test evidence

Use the Node.js versions listed in [README](../README.md). Install stable Google Chrome 157 or later for integration tests. Playwright drives that installation through its `chrome` channel.

## Run checks

1. Run `npm ci` to install the locked dependencies.
2. Run `npm run check` to check TypeScript, documentation, coverage references, and source metadata.
3. Run `npm run build` to produce the unpacked extension with dependency notices.
4. Run `npm test` to run the complete regression suite.

`npm test` runs these checks:

| Check | Evidence |
|---|---|
| Manifest regression | Metadata, permissions, CSP, icon dimensions, packaging, later-release permission boundaries |
| Angular/Vitest | Model, Unicode/hashtags, all filter combinations, components, Chrome API failures and mutation calls |
| Production build | Standalone AOT popup and copied assets; local scripts/styles without critical-CSS inlining |
| Project/package checks | Documentation links, criterion mapping, version/browser-target consistency, transient-state source policy, generated script paths |
| Stable Chrome | Native extension loading/action, bookmark APIs, filters, add/edit/delete, virtualization, keyboard behavior, overflow, and CSP/runtime errors |

Unit/component tests mock Chrome APIs. Integration tests load the real package in a fresh temporary Chrome profile. Synthetic records never touch your normal profile.

The runner loads the extension with Chrome's test-only `Extensions.loadUnpacked` debugging command. It invokes the action through `Extensions.triggerAction`. No debugging permission or service worker is added to the extension.

The actual toolbar popup is a separate Chrome debugging target. The test inspects that target and its natural dimensions. The detailed interaction scenarios use the same built page in an extension tab, including real `activeTab` grants.

See the [criterion mapping](test-coverage.md). Deferred 2.1–2.3 behavior remains outside the 2.0 regression scope.

The [popup layout test plan](test-plan.md) covers the review changes. Browser checks verify the joined cloud, exact colors and placeholder, and row geometry/truncation with Edit visible at both tested sizes. The expanded cloud scrolls with the popup, not inside a separate filter container.

## HTML reports

Every `npm test` run saves an HTML file under ignored `.local/test-results/`. The filename and document contain UTC timestamps. Reports include pass/fail status, output, Node/manifest versions, source HEAD, and whether the working tree had changes.

Completed visual scenarios add embedded screenshots. Reports remain self-contained if the accompanying PNG files move. Failed runs remain available. Private test evidence is not committed.

`npm run test:unit` is a faster Angular-only command. It does not create the complete HTML report. Use `npm test` when you need retained evidence.

## Scale evidence and limits

The browser fixture contains 10,001 supported bookmarks, 1 excluded `javascript:` bookmark, 112 additional folders, and 130 discovered tags. A long title/URL stresses overflow. Unit tests also build a 12,000-level folder tree and filter 12,000 records.

One T-05 run on stable Chrome 157.0.8103.51 recorded 179.1 ms from extension-page reload to a visible first scale row. A phrase filter took 227.4 ms including the 150 ms debounce. There were 9 live rows at the first observation. Scrolling reached the final row; later runs record their own values.

These are individual synthetic observations, not timing guarantees or real-profile measurements. The fixture differs from [the legacy diagnostic](legacy-measurements.md), so do not infer an exact speedup ratio.

The suite checks at most 24 live rows in the exercised layouts. Actual rows depend on viewport height, font size, and overscan. Font scaling also changes the virtual row height.

A representative real profile is unavailable to the automated run. Jan's manual verification remains pending. The final extended-use test materials are scheduled under T-09 after all implementation releases.
