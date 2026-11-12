# Project status

Updated: 2026-11-12

## Current state

- Branch: modernizing-chromtag. T-00/T-01 are user-verified; T-02 verification remains pending (8c5cc5b).
- Jan authorized implementing the entire E-20 sequentially, with per-task commits/logs. User verification remains pending. E-21 and later releases are outside this batch.
- Angular 22 / TypeScript 6 / native Chrome APIs target Chrome 157+. Loadable output: dist/chromtag/browser/. No legacy runtime libraries or persisted bookmark/index data.
- Completed E-20 as version 2.0 release candidate: manifest 2.0 / package and lockfile 2.0.0, machine-assisted development under human guidance documented in CHANGELOG, no replaced legacy runtime dependencies, and generated dependency notices included inside the loadable extension root. Final production build, 54 Angular tests, 8 manifest tests, stable Chrome native integration with 10,001 supported bookmarks, 164 documentation links / 75 mappings, package checks, and static checks passed. User verification and representative-profile testing remain pending; nothing was published.
- Latest passing HTML report: .local/test-results/2026-11-12T18-44-14.742Z-21304.html. Failed reports are retained too.
- Stable Chrome 157.0.8103.51 integration uses a fresh temporary profile with synthetic bookmarks, never the user's profile. A representative real profile is unavailable.

- T-05 review changes are ready for verification: label-free Search... field, 1 wrapping folder/tag cloud without internal scrolling, full-width CSS-truncated bookmark rows with Edit revealed on row hover or visible keyboard focus, folder green #4CAF50 and tag blue #448AFF. The main popup is now 540 x 580 px with selected #F44336 and hover #212121. The cloud stays fixed; excess labels collapse behind First/Previous/More filters, as Jan selected. Only the bookmark-list area scrolls.
- Updated specification/criteria, coverage map, [manual layout test plan](../docs/test-plan.md), and usage documentation. Latest checks passed: 54 Angular tests, 8 manifest tests, production/package checks, 164 documentation links / 75 mappings, and stable Chrome integration at default and narrower/larger-font sizes.

- Latest title/Edit refinement is ready for verification: underline titles, use the tag blue on title hover, hide Edit at rest, and reveal it on article hover or visible keyboard focus. Reserved button space prevents layout shift. Native tests verify Tab/Enter editing and mouse hover.

## E-20 progress

| ID | Work | Goal | Status | Criteria |
|---|---|---|---|---|
| T-00 | Prepare the repository | Use the modernization branch, preserve documentation/images, and prepare ignore rules. | Verified | T-00 |
| T-01 | Define and baseline behavior | Establish behavior, resolve semantics, and measure legacy large-library failure. | Verified | T-01 |
| T-02 | Audit the manifest | Retain MV3; verify metadata, assets, permissions, and compatibility. | Ready for verification | T-02 |
| T-03 | Rebuild the popup with Angular | Establish the standalone TypeScript popup, build, safe bindings, and transient model. | Ready for verification | T-03 |
| T-04 | Fix scale and search | Filter the model, virtualize rows with overscan, and support Unicode safely. | Ready for verification | T-04 |
| T-05 | Preserve and refine the design | Retain the compact interface and improve typography, scaling, overflow, and focus. | Ready for verification | T-05 |
| T-06 | Document and verify | Maintain documentation/test coverage; validate the built extension in Chrome. | Ready for verification | T-06 |
| T-07 | Release version 2.0 | Set version 2.0, document development attribution, and remove replaced runtime code. | Ready for verification | T-07 |
| US-01 | Browse Chrome bookmarks | Find and open a saved page from the popup. | Ready for verification | US-01 |
| US-02 | See and filter by tags | Find bookmarks by title hashtags. | Ready for verification | US-02 |
| US-03 | Filter by bookmark folder | Narrow the collection by folder. | Ready for verification | US-03 |
| US-04 | Search bookmarks | Find bookmarks across titles, folders, and URLs. | Ready for verification | US-04 |
| US-05 | Reset filters | Return to the full supported collection with 1 action. | Ready for verification | US-05 |
| US-06 | Add the current page | Save the active tab and edit the new bookmark. | Ready for verification | US-06 |
| US-07 | Edit or delete a bookmark | Maintain details, tags, and folder placement. | Ready for verification | US-07 |
| US-08 | Show or hide folders | Adjust the folder cloud during the popup session. | Ready for verification | US-08 |

## Next step

Jan verifies the E-20 candidate in Chrome 157+ using dist/chromtag/browser/ and docs/usage.md. All E-20 implementation work is ready for verification; T-02 also remains unverified. Wait for Jan's next instruction before E-21.

## Later work

E-21/E-22/E-23 and T-08 through T-12 remain not started. Version 2.2 defaults/bounds/palettes and version 2.3 popup-close default remain later decisions. Preserve .local/legacy/ through final testing; T-11 owns obsolete-file cleanup and T-12 plan archival.
