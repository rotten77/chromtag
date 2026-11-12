# Changelog

## 2.0 — 2026-11-12

Release candidate implemented; Jan's manual verification remains pending. No store publication is part of this work.

- Replaced the popup runtime with standalone Angular and TypeScript.
- Added one transient bookmark snapshot per load/refresh, iterative tree traversal, and virtualized rows with overscan.
- Added literal Unicode phrase search across titles, immediate folders, and URLs, preserving accents and grapheme boundaries.
- Defined normalized hashtag identities while preserving original spelling, punctuation, and safe literal rendering.
- Added ID-based folder selection with descendants and duplicate-name path labels.
- Preserved tag/folder/search combinations, Reset filter, add-page editing, bookmark save/move/delete, and popup-only folder visibility.
- Replaced broad `tabs` access with `activeTab`; unavailable required page metadata produces a message without creating a bookmark.
- Refined compact typography, keyboard focus, long-content overflow, and CSS layout/palette properties.
- Added regression coverage, native stable Chrome integration, and timestamped HTML test reports with embedded screenshots.
- Required Chrome 157+ and retained Manifest V3 with local scripts/styles. Removed jQuery, NanoScroller, and the YUI reset from the shipped runtime.

Version 2.0 used machine-assisted development under human guidance. Jan Zatloukal supplied requirements, approved behavior decisions, and owns manual verification. Codex implemented the modernization, documentation, and automated checks.

Versions 2.1–2.3 remain planned. Historical version 1.8 notes and screenshots remain in [the archived README](legacy-readme.md) through final testing.
