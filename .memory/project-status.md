# Project status

Updated: 2026-11-12

## Current state

- Branch: modernizing-chromtag. T-00/T-01 are user-verified; T-02 verification remains pending (8c5cc5b).
- Jan authorized implementing the entire E-20 sequentially, with per-task commits/logs. User verification remains pending. E-21 and later releases are outside this batch.
- Angular 22 / TypeScript 6 / native Chrome APIs target Chrome 157+. Loadable output: dist/chromtag/browser/. No legacy runtime libraries or persisted bookmark/index data.
- Implemented 150 ms debounced literal phrase search across full title, immediate folder name, and URL with approved Unicode/grapheme semantics. Tag/folder changes immediately flush the visible query; filter changes make no tree reads. Passed 26 Angular tests and stable Chrome 10,001-record search (214.4 ms including debounce).
- Latest passing HTML report: .local/test-results/2026-11-12T17-43-46.970Z-33136.html. Failed reports are retained too.
- Stable Chrome 157.0.8103.51 integration uses a fresh temporary profile with synthetic bookmarks, never the user's profile. A representative real profile is unavailable.

## E-20 progress

| ID | Work | Goal | Status | Criteria |
|---|---|---|---|---|
| T-00 | Prepare the repository | Use the modernization branch, preserve documentation/images, and prepare ignore rules. | Verified | T-00 |
| T-01 | Define and baseline behavior | Establish behavior, resolve semantics, and measure legacy large-library failure. | Verified | T-01 |
| T-02 | Audit the manifest | Retain MV3; verify metadata, assets, permissions, and compatibility. | Ready for verification | T-02 |
| T-03 | Rebuild the popup with Angular | Establish the standalone TypeScript popup, build, safe bindings, and transient model. | Ready for verification | T-03 |
| T-04 | Fix scale and search | Filter the model, virtualize rows with overscan, and support Unicode safely. | In progress | T-04 |
| T-05 | Preserve and refine the design | Retain the compact interface and improve typography, scaling, overflow, and focus. | Not started | T-05 |
| T-06 | Document and verify | Maintain documentation/test coverage; validate the built extension in Chrome. | Not started | T-06 |
| T-07 | Release version 2.0 | Set version 2.0, document development attribution, and remove replaced runtime code. | Not started | T-07 |
| US-01 | Browse Chrome bookmarks | Find and open a saved page from the popup. | Not started | US-01 |
| US-02 | See and filter by tags | Find bookmarks by title hashtags. | Ready for verification | US-02 |
| US-03 | Filter by bookmark folder | Narrow the collection by folder. | Ready for verification | US-03 |
| US-04 | Search bookmarks | Find bookmarks across titles, folders, and URLs. | Ready for verification | US-04 |
| US-05 | Reset filters | Return to the full supported collection with 1 action. | Not started | US-05 |
| US-06 | Add the current page | Save the active tab and edit the new bookmark. | Not started | US-06 |
| US-07 | Edit or delete a bookmark | Maintain details, tags, and folder placement. | Not started | US-07 |
| US-08 | Show or hide folders | Adjust the folder cloud during the popup session. | Not started | US-08 |

## Next step

Continue US-05 Reset filter.

## Later work

E-21/E-22/E-23 and T-08 through T-12 remain not started. Version 2.2 defaults/bounds/palettes and version 2.3 popup-close default remain later decisions. Preserve .local/legacy/ through final testing; T-11 owns obsolete-file cleanup and T-12 plan archival.
