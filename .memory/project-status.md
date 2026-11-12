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
- T-00 is **Ready for verification**: the required branch exists, historical documentation/images are preserved with working relative links, and generated directories are ignored.
- T-00 checks passed: ignore rules, shared-file trackability, 29 relative documentation links, preservation of all 10 historical images and README text, and `git diff --check`.
- T-01 remains **In progress**. All implementation stories remain **Not started**.
- No Angular workspace, dependencies, test runner, or modernized extension exists. Build/run/test commands remain planned.
- T-00 ignore-rule and documentation changes are uncommitted. No application code or build tooling was added.

## Remaining work and decisions

- Obtain user verification of T-00.
- Reproduce and measure legacy large-library behavior; no performance threshold is established.
- Resolve hashtag, Unicode case/normalization, folder-filter, and query semantics before affected implementation.
- Select dependency versions, permissions, and minimum Chrome compatibility during tooling/API setup.
- Define appearance defaults/bounds and the popup-close default before the relevant releases.
- Establish criterion-to-test coverage as implementation proceeds; no regression tests exist yet.

## Next step

The user verifies T-00. The recommended next task is T-01, subject to the user's next instruction.
