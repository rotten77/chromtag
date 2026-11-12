# Modernization plan

Updated: 2026-11-12

This plan derives from the supplied baseline and modernization steps. Acceptance criteria are in [technical-specification.md](technical-specification.md), under matching IDs.

## Status and implementation rule

Statuses: **Not started**, **In progress**, **Ready for verification**, **Verified**. Only explicit user verification permits **Verified**.

Implement no more than 1 user story at a time. Supporting tasks do not authorize implementing several stories together. Stop when a story is ready for verification. Start another only after user verification and the user's next instruction.

Completed E-20 batch exception: the user explicitly authorized sequential implementation of the whole epic with task commits/logs. Jan explicitly verified E-20, including T-02 through T-07 and US-01 through US-08, on 2026-11-12. This exception did not authorize E-21 or later releases.

## E-00 — Repository preparation

| ID | Task | Goal | Status | Criteria |
|---|---|---|---|---|
| T-00 | Prepare the repository | Use the modernization branch, preserve documentation/images, and prepare ignore rules. | Verified | T-00 |

The user verified T-00 on 2026-11-12. Repository preparation is committed in `e600c02`. Historical documentation/images are preserved under `docs/`, with working relative links. Dependency, build-output, and Angular-cache ignore rules are in place.

## E-20 — Version 2.0 modernization

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

The user verified T-01 on 2026-11-12. It has a reproducible diagnostic runner and [synthetic measurements](../docs/legacy-measurements.md), including the 10,000-bookmark readiness timeout. The user approved hashtag, Unicode phrase-search, grapheme-boundary, and folder-filter semantics in the technical specification. Real-profile measurements and target timing budgets remain future work.

T-02 provides the [manifest audit](../docs/manifest-audit.md), source manifest/icons in `public/`, and standalone source/package validation. The user selected `activeTab` with unavailable-metadata handling for US-06. Jan verified T-02 as part of E-20 on 2026-11-12. T-03 selected Angular 22 / TypeScript 6 / Chrome 157+ and verified asset copying, generated `index.html`, and native Chrome loadability.

T-05 review follow-up on 2026-11-12: apply Jan's search-field, combined wrapping cloud, full-width/truncated bookmark row, and palette changes. Matching criteria are T-05-AC5 through T-05-AC8; [the layout test plan](../docs/test-plan.md) covers manual review. Jan verified E-20 and its T-05 follow-ups on 2026-11-12.

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

## E-21 — Version 2.1 session filters

| ID | Story | User goal | Status | Criteria |
|---|---|---|---|---|
| US-09 | Restore popup filters | Resume the query and selected tags/folder during the browser session. | Not started | US-09 |

Depends on version 2.0 filters. Include version/permission updates, documentation, and regression tests in this story.

## E-22 — Version 2.2 appearance

| ID | Story | User goal | Status | Criteria |
|---|---|---|---|---|
| US-10 | Configure appearance | Set typography, popup and combined folder/tag cloud height, and independent light/dark Material palette colors that persist across restarts; theme backgrounds are fixed. | Not started | US-10 |

Follow version 2.1. Include default/bounds decisions, version update, documentation, and regression tests.

## E-23 — Version 2.3 bookmark clicks

| ID | Story | User goal | Status | Criteria |
|---|---|---|---|---|
| US-11 | Configure bookmark-click behavior | Choose tab target and popup-close behavior, with preferences retained across restarts. | Not started | US-11 |

Follow version 2.2. Include lifecycle verification, version update, documentation, and regression tests.

## Workflow update before T-13

| ID | Task | Owner | Goal | Status | Criteria |
|---|---|---|---|---|---|
| T-08 | Remove automatic logging and commit instructions | AI agent, at Jan's request | Remove the automatic log and commit requirements from agent guidance. | Verified | T-08 |

Jan moved T-08 forward on 2026-11-12 and requested a final log and commit for this change. Future logs and commits require an explicit request. Jan verified T-08 on 2026-11-12.

## After E-23 — Verification, cleanup, plan archival, and issue review

These tasks follow completion of all implementation work in E-00 through E-23. Criteria are in the technical specification under matching IDs.

| ID | Task | Owner | Goal | Status | Criteria |
|---|---|---|---|---|---|
| T-09 | Prepare manual test materials | AI agent | Create a simple manual test case and a reusable test-report file/template for final verification and extended use. | Not started | T-09 |
| T-10 | Perform final manual verification | Jan Zatloukal | Manually test all implemented features and report issues while using the extension for a user-chosen period. | Not started | T-10 |
| T-11 | Clean the repository for the current version | AI agent | Remove obsolete legacy/work files, review user documentation, and update screenshots after final testing. | Not started | T-11 |
| T-12 | Archive the completed plan | AI agent | Archive the modernization plan after repository cleanup and update references to it. | Not started | T-12 |
| T-14 | Review open GitHub issues | Jan Zatloukal and AI agent | Check open issues on GitHub and decide what to do with each. | Not started | T-14 |

T-10 uses the materials from T-09. Jan performs the final overall verification. T-11 follows that testing; T-12 follows cleanup. T-14 follows plan archival. The final working repository contains the current version and its required supporting files. Existing story-by-story verification remains part of implementation.

## Next step

Jan verified E-20, T-08, and T-13. E-21 still requires a separate instruction.
