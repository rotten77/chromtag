# Project status

Updated: 2026-11-12

## Current state

- Branch: `modernizing-chromtag`.
- Workflow setup is committed in `e3ac7e7` (Set up AI agent workflow and move legacy code to local storage).
- Modernization requirements and the roadmap are committed in `eac5420` (Document Chromtag modernization requirements and roadmap).
- Legacy source/assets remain in ignored `.local/legacy/`; popup source is under `.local/legacy/chromtag/`. T-02 stages manifest source and copies of the icons in `public/`.
- The supplied 1.8 baseline, analysis, modernization plan, and versions 2.0–2.3 requirements are organized into shared documentation.
- The plan defines 11 supplied feature/release stories and 8 supporting tasks. The technical specification holds matching criteria and open decisions.
- Historical README/screenshots are preserved under `docs/`.
- T-00 is **Verified** by the user on 2026-11-12 and committed in `e600c02` (Complete T-00 repository preparation).
- T-00 checks passed: ignore rules, shared-file trackability, 29 relative documentation links, preservation of all 10 historical images and README text, and `git diff --check`.
- T-01 is **Verified** by the user on 2026-11-12. All implementation stories remain **Not started**.
- The user approved hashtag boundaries/identity, NFC and locale-independent lowercasing, literal phrase search with grapheme boundaries, and folder-ID filtering including descendants. The technical specification records the rules.
- `tools/legacy-baseline.mjs` measures the archived popup with synthetic Chrome API callbacks in isolated headless Chrome contexts. Diagnostic dependencies and raw reports remain in ignored `.local/`.
- Synthetic runs measured median startup at 35.6 ms for 100 bookmarks, 759.1 ms for 1,000, and 24.736 s for 5,000. The first 10,000-bookmark trial reached the 120-second readiness timeout.
- Behavior probes reproduced callback-order, tag-regex, generated-selector, Unicode-normalization, and literal-rendering defects. Arabic, Chinese, and emoji samples matched; no blanket script failure was reproduced.
- The focused 100/1,000-bookmark diagnostic and behavior assertions passed. A forced-timeout check correctly recorded a timeout, skipped remaining runs at that size, ran probes, and exited nonzero.
- No Angular workspace, application dependencies, application test runner, or modernized extension exists. Application build/run/test commands remain planned.
- T-01 runner, documentation, and memory updates are committed in `3fd5f06` (Complete T-01 legacy baseline and matching decisions). Session closing notes are committed in `d3fdaea`.
- T-02 is **Ready for verification**. The manifest audit, source assets, and standalone validator are complete for review. The user selected `activeTab` with unavailable-metadata handling; the staged manifest and US-06 criteria reflect that decision.
- T-02 checks passed: manifest source validation, 8 validator regression tests, 45 relative documentation links, preservation of all 3 icons, syntax checks, and `git diff --check`. No actual Angular build or browser loadability check is available yet.
- At session end on 2026-11-12, T-02 changes and closing notes remain uncommitted. T-02 verification is pending; T-03 has not started.

## Remaining work and decisions

- Obtain user verification of T-02. Source readiness does not establish actual Angular package loadability; T-03 owns that integration check.
- Measure a representative real profile during T-06 when available; no universal failure threshold or target timing budget is established.
- Finalize dependency versions and the framework/browser floor during T-03. The staged manifest currently declares the selected Chrome 90 API floor.
- Define appearance defaults/bounds and the popup-close default before the relevant releases.
- Establish application criterion-to-test coverage as implementation proceeds. Standalone manifest-validator regression checks exist; the Angular test suite does not.

## Next step

The user verifies T-02 using [the manifest audit](../docs/manifest-audit.md) and source/validator checks. The recommended next task is T-03, subject to the user's next instruction.
