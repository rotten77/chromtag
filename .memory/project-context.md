# Project context

## Purpose and team

Chromtag is a Chrome bookmark browser/editor. Hashtags in native bookmark titles provide tag organization.

- Jan Zatloukal — developer; provides requirements and verifies implemented stories.
- AI agents follow `AGENTS.md`, maintain documentation, and implement at most 1 story before user verification.
- The completed E-20 batch used Jan's explicit whole-epic authorization with sequential task commits/logs. Jan explicitly verified E-20 on 2026-11-12. The exception does not extend into E-21; future work follows the normal stopping rule unless Jan directs otherwise.
- Jan moved T-08 ahead of T-13 on 2026-11-12 and asked the agent to remove automatic session-ending, logging, and commit requirements. Keep status/context current; write dated logs and commit only on request. User verification remains separate.
- Freeze the current release scope at version 2.0; versions 2.1–2.3 are future updates. Jan brought T-11 documentation cleanup forward for this release. T-15 packaging/publication is the next planned issue under E-MAINT; its draft procedure is `.memory/distribution.md`. Publication requires a separate manual action.
- T-09 maintains `.memory/test-cases.md` and its report template with each new feature. Verification occurs per feature/epic. Clarification of the request to remove E-23 versus T-10 is pending; E-23 currently denotes click preferences.
- Do not archive the active plan: T-12 is removed. T-14 belongs to E-MAINT and reviews open GitHub issues with Jan independently of future releases.

## Sources of truth

- `AGENTS.md`: repository workflow and agent instructions.
- `.memory/plan.md`: epics, stories, supporting tasks, and statuses.
- `.memory/technical-specification.md`: target architecture, acceptance criteria, decisions, and open choices.
- `.memory/technical-specification.md` is the sole specification; the duplicate `docs/SPEC.md` is removed.
- `.memory/legacy-baseline.md` and `.memory/legacy-analysis.md`: supplied historical 1.8 behavior and root-cause analysis.
- `.memory/legacy-measurements.md`: T-01 synthetic browser measurements and diagnostic reproduction instructions.
- `.memory/manifest-audit.md`: T-02 metadata, permissions, API floors, and packaging handoff to Angular setup.
- `docs/index.md`: detailed current extension guide; `docs/changelog.md`: complete release history; `.memory/distribution.md`: planned build, ZIP, and store-submission procedure for T-15.
- `.memory/legacy-readme.md` and `docs/img/`: preserved historical README and visual references, not current store screenshots.
- `docs/` contains `README.md`, `index.md`, and `changelog.md` for users, plus images in `docs/img/`. Internal testing, coverage, audits, and historical references live in `.memory/`.

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
- Jan's 2.0 layout review: show Search... without a visible label; combine folders and tags into 1 fixed wrapping cloud with a 14rem height limit, pagination above the choices, and no large blank area below the first page. Cap cloud height further at smaller sizes so the bookmark list remains visible. Only the bookmark-list area scrolls in the main popup (540 x 580 px); a `--border-color` top border separates it from the controls. Use folder green #4CAF50 and tag blue #448AFF, selected #F44336 without a shadow, and hover #212121. The editor also has no shadow. Keep full-width bookmark rows CSS-truncated with space reserved for Edit and even top/bottom spacing within fixed virtual rows. Size URL text and row folder/tag badges at 80% of the title font size; give both row badge types a #9E9E9E background. Underline titles and use tag-blue on hover; reveal Edit on row hover or visible keyboard focus.
- T-01 records user-approved hashtag, phrase-search, and folder-ID/descendant semantics in the technical specification. Use those rules when implementing the affected stories.
- Version 2.2 plans configurable combined folder/tag cloud height and independently selected Material Design foreground/tag/folder colors for light and dark themes. Backgrounds are fixed at white/light and #212121/dark; no background editor.
- T-13 loading and hashtag-processing feedback counts all URL-bearing tree nodes, including excluded `javascript:` bookmarks, after Chrome returns the tree. Large-library messaging cites synthetic evidence, not a guaranteed bookmark limit. Jan verified T-13 with an imported 50,000-bookmark synthetic collection on 2026-11-12.
- Default bookmark clicks open a new tab. Version 2.3 adds target and popup-close preferences.

## Repository conventions

- Create a fresh dedicated branch for each feature, change, or bug fix, including documentation/workflow changes. Do not implement directly on master/main or reuse previous task branches. This supersedes the modernization-only branch rule. Commits, merges, and pushes require a user request.
- Application code: `src/`; manifest source and preserved static icons: `public/`.
- Loadable output: `dist/chromtag/browser/`. Do not load source as an unpacked extension.
- Build, test, and static commands are defined in package.json. Production finalization copies generated dependency notices into the loadable extension root. `ng serve` is not the extension runtime.
- Run standalone manifest checks with `node tools/validate-manifest.mjs --source` and `node --test tools/validate-manifest.test.mjs`. Built validation checks the real Angular output.
- Version 2.0 uses Angular 22 / TypeScript 6 targeting Chrome 157+. `npm test` retains timestamped HTML reports in ignored `.local/test-results/`. Show the folder cloud initially; visibility remains popup-only.
- The standalone legacy diagnostic lives in `tools/legacy-baseline.mjs`. Its dependencies and raw measurements remain under ignored `.local/`; it does not create application tooling.
- Private/local references stay in ignored `.local/`. Shared documentation and memory remain tracked.
- Preserve referenced historical evidence and unrelated private files during release cleanup. Do not present historical screenshots as version 2.0 screenshots.
- Every target feature/criterion requires repository regression coverage. .memory/test-coverage.md maps E-20 criteria; npm test includes native Chrome integration and self-contained timestamped HTML reports with screenshots.
