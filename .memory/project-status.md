# Project status

Updated: 2026-11-12

## Current state

- Branch: `modernizing-chromtag`.
- Workflow setup is committed in `e3ac7e7` (Set up AI agent workflow and move legacy code to local storage).
- Modernization requirements and the roadmap are committed in `eac5420` (Document Chromtag modernization requirements and roadmap).
- Source/assets remain in ignored `.local/legacy/`; popup source is under `.local/legacy/chromtag/`.
- The supplied 1.8 baseline, analysis, modernization plan, and versions 2.0–2.3 requirements are organized into shared documentation.
- The plan defines 11 supplied feature/release stories and 8 supporting tasks. The technical specification holds matching criteria and open decisions.
- Historical README/screenshots are preserved under `docs/`.
- T-00 is **Verified** by the user on 2026-11-12 and committed in `e600c02` (Complete T-00 repository preparation).
- T-00 checks passed: ignore rules, shared-file trackability, 29 relative documentation links, preservation of all 10 historical images and README text, and `git diff --check`.
- T-01 is **Ready for verification**. All implementation stories remain **Not started**.
- The user approved hashtag boundaries/identity, NFC and locale-independent lowercasing, literal phrase search with grapheme boundaries, and folder-ID filtering including descendants. The technical specification records the rules.
- `tools/legacy-baseline.mjs` measures the archived popup with synthetic Chrome API callbacks in isolated headless Chrome contexts. Diagnostic dependencies and raw reports remain in ignored `.local/`.
- Synthetic runs measured median startup at 35.6 ms for 100 bookmarks, 759.1 ms for 1,000, and 24.736 s for 5,000. The first 10,000-bookmark trial reached the 120-second readiness timeout.
- Behavior probes reproduced callback-order, tag-regex, generated-selector, Unicode-normalization, and literal-rendering defects. Arabic, Chinese, and emoji samples matched; no blanket script failure was reproduced.
- The focused 100/1,000-bookmark diagnostic and behavior assertions passed. A forced-timeout check correctly recorded a timeout, skipped remaining runs at that size, ran probes, and exited nonzero.
- No Angular workspace, application dependencies, application test runner, or modernized extension exists. Application build/run/test commands remain planned.
- T-01 runner, documentation, and memory updates are uncommitted.

## Remaining work and decisions

- Obtain user verification of T-01.
- Measure a representative real profile during T-06 when available; no universal failure threshold or target timing budget is established.
- Select dependency versions, permissions, and minimum Chrome compatibility during tooling/API setup.
- Define appearance defaults/bounds and the popup-close default before the relevant releases.
- Establish criterion-to-test coverage as implementation proceeds; no regression tests exist yet.

## Next step

The user verifies T-01 using [the measurement report](../docs/legacy-measurements.md) and the technical specification's matching decisions. The recommended next task is T-02, subject to the user's next instruction.
