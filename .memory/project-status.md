# Project status

Updated: 2026-11-12

## Current state

- Branch: `modernizing-chromtag`.
- Workflow setup is committed in `e3ac7e7` (Set up AI agent workflow and move legacy code to local storage).
- Source/assets remain in ignored `.local/legacy/`; popup source is under `.local/legacy/chromtag/`.
- The supplied 1.8 baseline, analysis, modernization plan, and versions 2.0–2.3 requirements are organized into shared documentation.
- The plan defines 11 supplied feature/release stories and 8 supporting tasks. The technical specification holds matching criteria and open decisions.
- Historical README/screenshots are preserved under `docs/`.
- T-00 and T-01 are partially complete. All implementation stories remain **Not started**; none awaits implementation verification.
- No Angular workspace, dependencies, test runner, or modernized extension exists. Build/run/test commands remain planned.
- This documentation update is uncommitted. No application code or tooling configuration changed.

## Remaining work and decisions

- Add Angular ignore rules during repository/tooling preparation.
- Reproduce and measure legacy large-library behavior; no performance threshold is established.
- Resolve hashtag, Unicode case/normalization, folder-filter, and query semantics before affected implementation.
- Select dependency versions, permissions, and minimum Chrome compatibility during tooling/API setup.
- Define appearance defaults/bounds and the popup-close default before the relevant releases.
- Establish criterion-to-test coverage as implementation proceeds; no regression tests exist yet.

## Next step

The user reviews the documentation and selects the next task or 1 implementation story. This documentation request does not start implementation.
