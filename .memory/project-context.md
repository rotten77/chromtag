# Project context

## Purpose and team

Chromtag is a Chrome bookmark browser/editor. Hashtags in native bookmark titles provide tag organization.

- Jan Zatloukal — developer; provides requirements and verifies implemented stories.
- AI agents follow `AGENTS.md`, maintain documentation, and implement at most 1 story before user verification.
- The completed E-20 batch used Jan's explicit whole-epic authorization with sequential task commits/logs. Verification remains pending. The exception does not extend into E-21; future work follows the normal stopping rule unless Jan directs otherwise.
- Finished tasks that pass applicable tests and checks trigger automatic session closing, log/status updates, and a commit under the standing authorization in `AGENTS.md`. User verification remains separate.
- After E-23 implementation, Jan owns the instruction cleanup and final manual verification of all features. An agent prepares a simple manual test case and report template for that verification and extended use; see T-08 through T-10 in the plan.
- After final testing, T-11 removes obsolete legacy/work files and refreshes documentation/screenshots so the working repository represents the current version. T-12 then archives the completed plan and updates references.

## Sources of truth

- `AGENTS.md`: repository workflow and agent instructions.
- `.memory/plan.md`: epics, stories, supporting tasks, and statuses.
- `.memory/technical-specification.md`: target architecture, acceptance criteria, decisions, and open choices.
- `docs/SPEC.md`: intended behavior/release scope, linked to authoritative criteria.
- `docs/legacy-baseline.md` and `docs/legacy-analysis.md`: supplied historical 1.8 behavior and root-cause analysis.
- `docs/legacy-measurements.md`: T-01 synthetic browser measurements and diagnostic reproduction instructions.
- `docs/manifest-audit.md`: T-02 metadata, permissions, API floors, and packaging handoff to Angular setup.
- `docs/legacy-readme.md` and `docs/img/`: preserved README and visual references.

Do not duplicate target acceptance criteria in the plan or user documentation. Separate historical limitations from target behavior.

## Durable product decisions

- Chrome's native tree remains the bookmark source of truth. Tags remain hashtags in titles.
- No separate bookmark database, backend, account, or `localStorage`.
- Bookmarks/indexes remain in transient popup memory. Folder visibility is popup-only.
- Version 2.1 uses `chrome.storage.session` only for the query and selected tags/folder.
- Versions 2.2/2.3 use `chrome.storage.local` only for appearance/layout and bookmark-click preferences.
- Retain MV3. Audit metadata/APIs and permissions; add no service worker without demonstrated need.
- T-02 permission policy: use `bookmarks` and `activeTab`, adding `storage` only with preference releases. US-06 must report unavailable required tab metadata without creating an incomplete bookmark; do not restore broad `tabs` access.
- Use a root Angular CLI workspace, standalone components, TypeScript, native Chrome APIs, and safe bindings.
- Prioritize large-library responsiveness: 1 snapshot per load/refresh, model filtering, and virtualized rows with overscan.
- Preserve the compact design. Support Unicode without transliteration, search URLs/titles/folders, and preserve diacritic distinctions.
- T-01 records user-approved hashtag, phrase-search, and folder-ID/descendant semantics in the technical specification. Use those rules when implementing the affected stories.
- Default bookmark clicks open a new tab. Version 2.3 adds target and popup-close preferences.

## Repository conventions

- Implementation branch: user-created `modernizing-chromtag`. Verify its presence before implementation; request user creation if absent.
- Application code: `src/`; manifest source and preserved static icons: `public/`.
- Loadable output: `dist/chromtag/browser/`. Do not load source as an unpacked extension.
- Build, test, and static commands are defined in package.json. Production finalization copies generated dependency notices into the loadable extension root. `ng serve` is not the extension runtime.
- Run standalone manifest checks with `node tools/validate-manifest.mjs --source` and `node --test tools/validate-manifest.test.mjs`. Built validation checks the real Angular output.
- Version 2.0 uses Angular 22 / TypeScript 6 targeting Chrome 157+. `npm test` retains timestamped HTML reports in ignored `.local/test-results/`. Show the folder cloud initially; visibility remains popup-only.
- The standalone legacy diagnostic lives in `tools/legacy-baseline.mjs`. Its dependencies and raw measurements remain under ignored `.local/`; it does not create application tooling.
- Private/local references stay in ignored `.local/`. Shared documentation and memory remain tracked.
- Preserve the ignored archive during implementation and final testing. T-11 handles obsolete legacy/work files after testing; its cleanup does not include unrelated private files.
- Every target feature/criterion requires repository regression coverage. docs/test-coverage.md maps E-20 criteria; npm test includes native Chrome integration and self-contained timestamped HTML reports with screenshots.
