# Modernization plan

Updated: 2026-11-16

This plan derives from the supplied baseline and modernization steps. Acceptance criteria are in [technical-specification.md](technical-specification.md), under matching IDs. Feature order does not assign features to specific release versions.

## Status and implementation rule

Statuses: **Not started**, **In progress**, **Ready for verification**, **Verified**. Only explicit user verification permits **Verified**.

Implement no more than 1 user story at a time. Supporting tasks do not authorize implementing several stories together. Stop when a story is ready for verification. Start another only after user verification and the user's next instruction.

Completed E-20 batch exception: the user explicitly authorized sequential implementation of the whole epic with task commits/logs. Jan explicitly verified E-20, including T-02 through T-07 and US-01 through US-08, on 2026-11-12. This exception did not authorize later epics.

## E-00 — Repository preparation

| ID | Task | Goal | Status | Criteria |
|---|---|---|---|---|
| T-00 | Prepare the repository | Use the modernization branch, preserve documentation/images, and prepare ignore rules. | Verified | T-00 |

The user verified T-00 on 2026-11-12. Repository preparation is committed in `e600c02`. Historical documentation is now preserved under `.memory/`, with images in `docs/img/`, with working relative links. Dependency, build-output, and Angular-cache ignore rules are in place.

## E-20 — Modernization

### Supporting tasks

These tasks retain the supplied steps 1–7 and support the feature stories below.

| ID | Task | Goal | Status | Criteria |
|---|---|---|---|---|
| T-01 | Define and baseline behavior | Establish behavior, resolve semantics, and measure legacy large-library failure. | Verified | T-01 |
| T-02 | Audit the manifest | Retain MV3; verify metadata, assets, permissions, and compatibility. | Verified | T-02 |
| T-03 | Rebuild the popup with Angular | Establish the standalone TypeScript popup, build, safe bindings, and transient model. | Verified | T-03 |
| T-04 | Fix scale and search | Filter the model, virtualize rows with overscan, and support Unicode safely. | Verified | T-04 |
| T-05 | Preserve and refine the design | Retain the compact interface and improve typography, scaling, overflow, and focus. | Verified | T-05 |
| T-06 | Document and verify | Maintain documentation/test coverage; validate the built extension in Chrome. | Verified | T-06 |
| T-07 | Release version 2.0 | Set version 2.0, document development attribution, and remove replaced runtime code. | Verified | T-07 |

The user verified T-01 on 2026-11-12. It has a reproducible diagnostic runner and [synthetic measurements](legacy-measurements.md), including the 10,000-bookmark readiness timeout. The user approved hashtag, Unicode phrase-search, grapheme-boundary, and folder-filter semantics in the technical specification. Real-profile measurements and target timing budgets remain future work.

T-02 provides the [manifest audit](manifest-audit.md), source manifest/icons in `public/`, and standalone source/package validation. The user selected `activeTab` with unavailable-metadata handling for US-06. Jan verified T-02 as part of E-20 on 2026-11-12. T-03 selected Angular 22 / TypeScript 6 / Chrome 157+ and verified asset copying, generated `index.html`, and native Chrome loadability.

T-05 review follow-up on 2026-11-12: apply Jan's search-field, combined wrapping cloud, full-width/truncated bookmark row, and palette changes. Matching criteria are T-05-AC5 through T-05-AC8; [the layout test plan](test-plan.md) covers manual review. Jan verified E-20 and its T-05 follow-ups on 2026-11-12.

Additional T-05 review: apply selected/hover colors and increase the popup height to 580 px. Jan chose a fixed cloud with collapsed excess labels; pagination keeps all filters reachable while only the bookmark-list area scrolls. Cloud-height follow-up: double its limit from 7rem to 14rem, move pagination above the cloud, avoid first-page blank space, and cap the cloud at smaller sizes to leave list space. Criteria T-05-AC6/AC8/AC9 and the layout test plan record these changes. Jan verified E-20 on 2026-11-12.

Further T-05 review: underline bookmark titles, use the tag color for title hover, and reveal Edit on article hover while preserving keyboard access. URL and row-label typography follow-up: both use 80% of the title font size; row badges use gray #9E9E9E (T-05-AC2/AC8). The virtual row-height follow-up removes excess bottom spacing, and a top border separates the list from controls (T-05-AC7/AC9). Manual cases UI-04/UI-05/UI-06/UI-07 cover these refinements; Jan verified E-20 on 2026-11-12.

### Feature stories

These are the 8 supplied current-app stories, revised for the supplied modernization changes.

| ID | Story | User goal | Status | Criteria |
|---|---|---|---|---|
| US-01 | Browse Chrome bookmarks | Find and open a saved page from the popup. | Verified | US-01 |
| US-02 | See and filter by tags | Find bookmarks by title hashtags. | Verified | US-02 |
| US-03 | Filter by bookmark folder | Narrow the collection by folder. | Verified | US-03 |
| US-04 | Search bookmarks | Find bookmarks across titles, folders, and URLs. | Verified | US-04 |
| US-05 | Reset filters | Return to the full supported collection with 1 action. | Verified | US-05 |
| US-06 | Add the current page | Save the active tab and edit the new bookmark. | Verified | US-06 |
| US-07 | Edit or delete a bookmark | Maintain details, tags, and folder placement. | Verified | US-07 |
| US-08 | Show or hide folders | Adjust the folder cloud during the popup session. | Verified | US-08 |

Statuses describe the new implementation. Behavior in the ignored 1.8 reference does not mark a modernization story complete.

## E-20 follow-up — Bookmark loading and processing feedback

| ID | Task | Goal | Status | Criteria |
|---|---|---|---|---|
| T-13 | Show bookmark processing progress | Show loading and hashtag-processing progress in the popup, with an honest count when available and evidence-based guidance for large libraries. | Verified | T-13 |

Jan verified T-08 and requested T-13 implementation on 2026-11-12. The existing generic loading message is not counted as completion. The count covers all URL-bearing tree nodes, including unsupported `javascript:` bookmarks. Chunked processing yields for large snapshots; a 10,000-node threshold triggers evidence-based guidance. Jan tested with an imported 50,000-bookmark synthetic collection and approved the result on 2026-11-12. Do not claim a supported bookmark limit from synthetic tests.

## E-21 — Session filters

| ID | Story | User goal | Status | Criteria |
|---|---|---|---|---|
| US-09 | Restore popup filters | Resume filters during the browser session and retain independent folder visibility across restarts. | Ready for verification | US-09 |

Depends on the current filters. Include permission updates, documentation, and regression tests in this story.

## E-22 — Appearance

| ID | Story | User goal | Status | Criteria |
|---|---|---|---|---|
| US-10 | Configure appearance | Set font size, popup width and height, and the filter-to-bookmark space ratio. Choose Light, Dark, or System mode and configure colors separately for light and dark themes. | Not started | US-10 |

Include default/bounds decisions, documentation, and regression tests.

## E-23 — Bookmark clicks

| ID | Story | User goal | Status | Criteria |
|---|---|---|---|---|
| US-11 | Configure bookmark-click behavior | Choose tab target and popup-close behavior, with preferences retained across restarts. | Not started | US-11 |

Include lifecycle verification, documentation, and regression tests.

## E-24 — UI redesign

| ID | Story | User goal | Status | Criteria |
|---|---|---|---|---|
| US-12 | Redesign the popup layout | Use filters, search, pagination, and reset actions in a clearer and more compact layout. | Verified | US-12 |

Jan verified the cloud-first redesign on 2026-11-20.

## E-25 — Filter-selector exclusions

| ID | Story | User goal | Status | Criteria |
|---|---|---|---|---|
| US-13 | Exclude folders or tags from filter choices | Hide selected folders or tags from the filter selector without hiding their bookmarks from results. | Not started | US-13 |

This can keep special-purpose folders, such as `Quick access`, out of the selector when users normally open them from Chrome's bookmark menu. The exclusion scope, configuration UI, tag behavior, persistence, interaction with active filters, and treatment of descendant folders require clarification before acceptance criteria are defined.

## E-26 — Bulk bookmark actions

| ID | Story | User goal | Status | Criteria |
|---|---|---|---|---|
| US-14 | Bulk edit bookmarks | Select bookmarks from filtered results to manage title hashtags, open tabs, or move bookmarks together. | Not started | US-14 |
| US-15 | Rename a tag across bookmarks | Replace a title hashtag throughout the bookmark library with an existing or newly entered tag. | Not started | US-15 |

Source: [Chromtag issue #4 — manage tags across bookmarks](https://github.com/rotten77/chromtag/issues/4).

## Workflow update before T-13

| ID | Task | Owner | Goal | Status | Criteria |
|---|---|---|---|---|---|
| T-08 | Remove automatic logging and commit instructions | AI agent, at Jan's request | Remove the automatic log and commit requirements from agent guidance. | Verified | T-08 |

Jan moved T-08 forward on 2026-11-12 and requested a final log and commit for this change. Future logs and commits require an explicit request. Jan verified T-08 on 2026-11-12.

## Release 2.0 cleanup and remaining verification tasks

Jan brought T-11 forward to prepare the frozen version 2.0 release. Planned features are not assigned to specific future versions. The plan stays active; T-12 (plan archival) is removed at Jan's request. T-09 now maintains `.memory/test-cases.md` for per-feature verification, at Jan's request. The request concerning E-23 versus T-10 awaits clarification. Criteria are in the technical specification under matching IDs.

| ID | Task | Owner | Goal | Status | Criteria |
|---|---|---|---|---|---|
| T-09 | Maintain manual test cases | AI agent | Maintain `.memory/test-cases.md` and its report template with each new feature. | Verified | T-09 |
| T-10 | Perform final manual verification | Jan Zatloukal | Manually test all implemented features and report issues while using the extension for a user-chosen period. | Not started | T-10 |
| T-11 | Clean the repository for the current version | AI agent | Simplify README, consolidate extension documentation and full changelog, for frozen version 2.0. | Verified | T-11 |

T-09 supplies cases for each feature/epic and release; it does not wait for E-23. T-10's separate final-testing role awaits clarification. T-11 now precedes future feature updates by Jan's authorization. Retain historical evidence where referenced; do not delete unrelated private files. Publication remains a separate manual action. Existing story-by-story verification remains part of implementation.

## E-MAINT — Maintenance and issue review

This epic is independent of future feature releases and plan archival.

| ID | Task | Owner | Goal | Status | Criteria |
|---|---|---|---|---|---|
| T-15 | Package and publish version 2.0 | Jan Zatloukal and AI agent | Follow [distribution procedure](distribution.md), prepare the store package and listing, and submit the release. Jan reported approval and publication on 2026-11-20; installed-store verification remains pending. | In progress | T-15 |
| T-14 | Review open GitHub issues | Jan Zatloukal and AI agent | Check open issues on GitHub and decide what to do with each. | Not started | T-14 |
| T-16 | Add support and rating links | Jan Zatloukal and AI agent | Let users support Chromtag or rate it from the README and the Options dialog. | Not started | T-16 |

## Next step

T-09 and T-11 are verified. Jan reported Chrome Web Store approval and publication on 2026-11-20; verify the installed store version to complete T-15. Instructions are in `.memory/distribution.md`. Jan verified E-20, T-08, and T-13. Every planned feature requires a separate instruction. US-12 is verified. Clarify US-13 exclusion behavior before implementation. No plan archival is scheduled.
