# Project context

## Purpose and team

Chromtag is a Chrome bookmark browser/editor. Hashtags in native bookmark titles provide tag organization.

- Jan Zatloukal — sole developer; provides requirements and verifies implemented stories. Jan confirmed there is currently no branch protection. This leaves a known risk of merging without checks; local checks and explicit verification remain the existing controls.
- Prioritize simplicity when proposing tooling and quality controls.
- AI agents follow `AGENTS.md`, maintain documentation, and implement at most 1 story before user verification.
- The completed E-20 batch used Jan's explicit whole-epic authorization with sequential task commits/logs. Jan explicitly verified E-20 on 2026-11-12. The exception does not extend into E-21; future work follows the normal stopping rule unless Jan directs otherwise.
- Jan moved T-08 ahead of T-13 on 2026-11-12 and asked the agent to remove automatic session-ending, logging, and commit requirements. Keep status/context current. Jan later clarified that "end session" explicitly requests a status update and a dated `.memory/log/YYYY-MM-DD.md` session summary before any separately requested commit/push. Otherwise log only on request; commits and pushes always need explicit authorization. User verification remains separate.
- Version 2.0 was packaged, released, and published in the Chrome Web Store. Jan closed T-15 on 2026-11-21 based on that confirmation; no independent installed-store check was reported or required for closure. Versions 2.1–2.7 are developer builds. Version 2.4 originally bounded live cloud choices to 32 during measurement. Jan approved raising the bounded probe to 512 in 2.14 so short-label clouds can fill their maximum height; only the fitted current page remains afterward. Version 2.5 orders preference writes per storage key after reproducing stale writes with delayed mocks. In version 2.6, Jan approved light folder green `#2E7D32` and only selectable palette shades with at least 4.5:1 normal-text contrast for each role/theme. Version 2.7 distinguishes bookmark-load failure from a successfully empty tree without discarding the previous snapshot. Future release scheduling belongs to Jan and is not tracked as a task.
- T-09 is verified and maintains `.memory/test-cases.md` and its report template with each new feature. Verification occurs per feature/epic. Clarification of the request to remove E-23 versus T-10 is pending; E-23 currently denotes click preferences.
- Do not archive the active plan: T-12 is removed. T-08–T-11 and T-14–T-16 belong under Modernization in `.memory/plan.todo`. T-14 reviews open GitHub issues with Jan.

## Sources of truth

- `AGENTS.md`: repository workflow and agent instructions.
- `.memory/plan.todo`: sole planning document for epics, stories, supporting tasks, and statuses. Details and acceptance criteria belong in `.memory/technical-specification.md`.
- `.memory/technical-specification.md`: target architecture, acceptance criteria, decisions, and open choices.
- `.memory/technical-specification.md` is the sole specification; the duplicate `docs/SPEC.md` is removed.
- `.memory/legacy-baseline.md` and `.memory/legacy-analysis.md`: supplied historical 1.8 behavior and root-cause analysis.
- `.memory/legacy-measurements.md`: T-01 synthetic browser measurements and diagnostic reproduction instructions.
- `.memory/manifest-audit.md`: T-02 metadata, permissions, API floors, and packaging handoff to Angular setup.
- `docs/README.md`: GitHub documentation index and extension guide; `docs/changelog.md`: complete release history; `.memory/distribution.md`: T-15 packaging record and the store-submission checklist. The upstream skill's `CHROMEWEBSTORE.md` guidance is covered there; no duplicate root file is maintained.
- `.memory/legacy-readme.md` and `docs/img/`: preserved historical README and visual references, not current store screenshots.
- The root README introduces Chromtag, installation, and privacy. `docs/development.md` holds setup, build, and test commands. Images remain in `docs/img/`. Internal testing, coverage, audits, and historical references live in `.memory/`.

Do not duplicate target acceptance criteria in the plan or user documentation. Separate historical limitations from target behavior.

## Durable product decisions

- Chrome's native tree remains the bookmark source of truth. Tags remain hashtags in titles.
- No separate bookmark database, backend, account, or `localStorage`.
- Bookmarks/indexes remain in transient popup memory. Show folders defaults on and persists independently in local extension storage.
- Version 2.1 remembers query and selected tags/folder in `chrome.storage.session` by default. Only the Clear filters on popup and Show folders preferences use `chrome.storage.local`.
- Versions 2.2/2.3 use `chrome.storage.local` only for appearance/layout and bookmark-click preferences.
- Retain MV3. Audit metadata/APIs and permissions; add no service worker without demonstrated need. Jan approved a narrowly scoped worker for Open selected to finish after popup dismissal; Jan also approved extending that worker to bulk title/move operations in 2.10. Prepared operations stay request-local, with no stored bookmark queue or automatic replay.
- T-02 permission policy: use `bookmarks` and `activeTab`, adding `storage` only with preference releases. US-06 must report unavailable required tab metadata without creating an incomplete bookmark; do not restore broad `tabs` access.
- Use a root Angular CLI workspace, standalone components, TypeScript, native Chrome APIs, and safe bindings.
- Prioritize large-library responsiveness: 1 snapshot per load/refresh, model filtering, and virtualized rows with overscan.
- Preserve the compact design. Support Unicode without transliteration, search URLs/titles/folders, and preserve diacritic distinctions.
- Jan's 2.0 layout review: show Search... without a visible label; combine folders and tags into 1 fixed wrapping cloud with a 14rem height limit, pagination above the choices, and no large blank area below the first page. Cap cloud height further at smaller sizes so the bookmark list remains visible. Only the bookmark-list area scrolls in the main popup (540 x 580 px); a `--border-color` top border separates it from the controls. Use folder green #4CAF50 and tag blue #448AFF, selected #F44336 without a shadow, and hover #212121. The editor also has no shadow. Keep full-width bookmark rows CSS-truncated with space reserved for Edit and even top/bottom spacing within fixed virtual rows. Size URL text and row folder/tag badges at 80% of the title font size; give both row badge types a #9E9E9E background. Underline titles and use tag-blue on hover; reveal Edit on row hover or visible keyboard focus.
- T-01 records user-approved hashtag, phrase-search, and folder-ID/descendant semantics in the technical specification. Use those rules when implementing the affected stories.
- US-10 implements adjustable font size, popup width and height, and a ratio slider dividing available height between filters and bookmarks. Light, Dark, and system-following modes use independent light and dark foreground/tag/folder palettes. Backgrounds are fixed at white/light and #212121/dark; no background editor.
- T-13 loading and hashtag-processing feedback counts all URL-bearing tree nodes, including excluded `javascript:` bookmarks, after Chrome returns the tree. Large-library messaging cites synthetic evidence, not a guaranteed bookmark limit. Jan verified T-13 with an imported 50,000-bookmark synthetic collection on 2026-11-12.
- Version 2.11 adds Switch to opened tab, default off, available in new-tab mode. It activates the single destination or first selected result after background batch creation. Chrome can dismiss the popup on activation regardless of explicit closing.
- Version 2.3 defaults bookmark clicks to the current tab and closes the popup on success. The user may select a new tab or disable explicit closing; Chrome can still close the action popup during current-tab navigation.

## Repository conventions

- Do not bump versions or ask version questions during individual branch features/fixes. When preparing a batch merge into `master`, suggest an appropriate version and ask Jan to approve it before merging. Apply the approved version consistently to manifest/package/root lockfile and assign Unreleased changelog entries then. Version approval is separate from commit/merge/push authorization. `AGENTS.md` is authoritative.
- For US-14, Jan chose to deselect checked bookmarks when filters exclude them. Selection is popup-only; bulk tag changes affect checked titles, not all matching bookmarks. Disabled buttons use the standard arrow cursor.
- The pinned `chrome-extensions` skill under `.agents/skills/` is external guidance. `AGENTS.md` and the tested `activeTab` action-popup behavior take precedence where it conflicts. Review skill updates before adopting them; Jan chooses when to publish.

- Before implementing a feature or bug fix, report the current branch and ask Jan whether to create or switch to a dedicated branch. Jan makes and verifies the branch decision; do not switch automatically. Documentation, planning, workflow, and other `.memory/`-only updates do not require a new branch unless Jan requests one. Commits, merges, and pushes require a user request.
- Application code: `src/`; manifest source and preserved static icons: `public/`.
- Loadable output: `dist/chromtag/browser/`. Do not load source as an unpacked extension.
- Build, test, and static commands are defined in package.json. Production finalization copies generated dependency notices into the loadable extension root. `ng serve` is not the extension runtime.
- Run standalone manifest checks with `node tools/validate-manifest.mjs --source` and `node --test tools/validate-manifest.test.mjs`. Built validation checks the real Angular output.
- The application uses Angular 22 / TypeScript 6 targeting Chrome 157+. `npm test` retains timestamped HTML reports in ignored `.local/test-results/`. Show the folder cloud initially; its visibility preference persists.
- The standalone legacy diagnostic lives in `tools/legacy-baseline.mjs`. Its dependencies and raw measurements remain under ignored `.local/`; it does not create application tooling.
- Private/local references stay in ignored `.local/`. Shared documentation and memory remain tracked.
- Preserve referenced historical evidence and unrelated private files during release cleanup. Do not present historical screenshots as version 2.0 screenshots.
- Every target feature/criterion requires repository regression coverage. .memory/test-coverage.md maps E-20 criteria; npm test includes native Chrome integration and self-contained timestamped HTML reports with screenshots.
