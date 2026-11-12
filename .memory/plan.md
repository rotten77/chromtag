# Modernization plan

Updated: 2026-11-12

This plan derives from the supplied baseline and modernization steps. Acceptance criteria are in [technical-specification.md](technical-specification.md), under matching IDs.

## Status and implementation rule

Statuses: **Not started**, **In progress**, **Ready for verification**, **Verified**. Only explicit user verification permits **Verified**.

Implement no more than 1 user story at a time. Supporting tasks do not authorize implementing several stories together. Stop when a story is ready for verification. Start another only after user verification and the user's next instruction.

## E-00 — Repository preparation

| ID | Task | Goal | Status | Criteria |
|---|---|---|---|---|
| T-00 | Prepare the repository | Use the modernization branch, preserve documentation/images, and prepare ignore rules. | In progress | T-00 |

The user-created branch exists and workflow setup is committed. Historical documentation/images are preserved under `docs/`. Angular ignore rules remain pending; this documentation update includes no tooling changes.

## E-20 — Version 2.0 modernization

### Supporting tasks

These tasks retain the supplied steps 1–7 and support the feature stories below.

| ID | Task | Goal | Status | Criteria |
|---|---|---|---|---|
| T-01 | Define and baseline behavior | Establish behavior, resolve semantics, and measure legacy large-library failure. | In progress | T-01 |
| T-02 | Audit the manifest | Retain MV3; verify metadata, assets, permissions, and compatibility. | Not started | T-02 |
| T-03 | Rebuild the popup with Angular | Establish the standalone TypeScript popup, build, safe bindings, and transient model. | Not started | T-03 |
| T-04 | Fix scale and search | Filter the model, virtualize rows with overscan, and support Unicode safely. | Not started | T-04 |
| T-05 | Preserve and refine the design | Retain the compact interface and improve typography, scaling, overflow, and focus. | Not started | T-05 |
| T-06 | Document and verify | Maintain documentation/test coverage; validate the built extension in Chrome. | Not started | T-06 |
| T-07 | Release version 2.0 | Set version 2.0, document development attribution, and remove replaced runtime code. | Not started | T-07 |

T-01 has a documented baseline and target criteria. Performance reproduction, measurements, and semantic decisions remain pending.

### Feature stories

These are the 8 supplied current-app stories, revised for the supplied modernization changes.

| ID | Story | User goal | Status | Criteria |
|---|---|---|---|---|
| US-01 | Browse Chrome bookmarks | Find and open a saved page from the popup. | Not started | US-01 |
| US-02 | See and filter by tags | Find bookmarks by title hashtags. | Not started | US-02 |
| US-03 | Filter by bookmark folder | Narrow the collection by folder. | Not started | US-03 |
| US-04 | Search bookmarks | Find bookmarks across titles, folders, and URLs. | Not started | US-04 |
| US-05 | Reset filters | Return to the full supported collection with 1 action. | Not started | US-05 |
| US-06 | Add the current page | Save the active tab and edit the new bookmark. | Not started | US-06 |
| US-07 | Edit or delete a bookmark | Maintain details, tags, and folder placement. | Not started | US-07 |
| US-08 | Show or hide folders | Adjust the folder cloud during the popup session. | Not started | US-08 |

Statuses describe the new implementation. Behavior in the ignored 1.8 reference does not mark a modernization story complete.

## E-21 — Version 2.1 session filters

| ID | Story | User goal | Status | Criteria |
|---|---|---|---|---|
| US-09 | Restore popup filters | Resume the query and selected tags/folder during the browser session. | Not started | US-09 |

Depends on version 2.0 filters. Include version/permission updates, documentation, and regression tests in this story.

## E-22 — Version 2.2 appearance

| ID | Story | User goal | Status | Criteria |
|---|---|---|---|---|
| US-10 | Configure appearance | Set typography, dimensions, and independent light/dark palettes that persist across restarts. | Not started | US-10 |

Follow version 2.1. Include default/bounds decisions, version update, documentation, and regression tests.

## E-23 — Version 2.3 bookmark clicks

| ID | Story | User goal | Status | Criteria |
|---|---|---|---|---|
| US-11 | Configure bookmark-click behavior | Choose tab target and popup-close behavior, with preferences retained across restarts. | Not started | US-11 |

Follow version 2.2. Include lifecycle verification, version update, documentation, and regression tests.

## Next step

Review the documents and resolve decisions relevant to the next task. The user selects the implementation story. This documentation update does not select or start implementation.
