# Project status

Updated: 2026-11-16

## Current state

- Branch: modernizing-chromtag. Jan explicitly verified T-00/T-01 earlier and E-20, including T-02 through T-07 and US-01 through US-08, on 2026-11-12.
- Jan authorized implementing the entire E-20 sequentially, with per-task commits/logs. That batch is now user-verified; E-21 and later releases are outside the authorization.
- Angular 22 / TypeScript 6 / native Chrome APIs target Chrome 157+. Loadable output: dist/chromtag/browser/. No legacy runtime libraries or persisted bookmark/index data.
- Completed E-20 as version 2.0 release candidate: manifest 2.0 / package and lockfile 2.0.0, machine-assisted development under human guidance documented in CHANGELOG, no replaced legacy runtime dependencies, and generated dependency notices included inside the loadable extension root. Final production build, 54 Angular tests, 8 manifest tests, stable Chrome native integration with 10,001 supported bookmarks, 164 documentation links / 75 mappings, package checks, and static checks passed. User verification is complete; representative-profile testing remains pending and nothing was published.
- Latest passing HTML report: .local/test-results/2026-11-12T20-35-09.179Z-24312.html. It embeds the T-13 processing screenshot; the standalone PNG is .local/test-results/2026-11-12T20-35-09.179Z-24312-processing-progress.png. Failed reports are retained too.
- Stable Chrome 157.0.8103.51 integration uses a fresh temporary profile with synthetic bookmarks, never the user's profile. A representative real profile is unavailable.

- Jan verified the T-05 review changes with E-20: label-free Search... field, 1 wrapping folder/tag cloud without internal scrolling, full-width CSS-truncated bookmark rows with Edit revealed on row hover or visible keyboard focus, folder green #4CAF50 and tag blue #448AFF. The main popup is now 540 x 580 px with selected #F44336 and hover #212121. The cloud stays fixed; excess labels collapse behind First/Previous/More filters, as Jan selected. Only the bookmark-list area scrolls.
- Updated specification/criteria, coverage map, [manual layout test plan](test-plan.md), and usage documentation. Latest checks passed: 54 Angular tests, 8 manifest tests, production/package checks, 164 documentation links / 75 mappings, and stable Chrome integration at default and narrower/larger-font sizes.

- Jan verified the title/Edit refinement with E-20: underline titles, use the tag blue on title hover, hide Edit at rest, and reveal it on article hover or visible keyboard focus. Reserved button space prevents layout shift. Native tests verify Tab/Enter editing and mouse hover.

- Jan verified the T-05 follow-ups with E-20: virtual rows are 5.6 × base font with even top/bottom spacing, and a 1 px `--border-color` top border separates the bookmark list from controls. Selected cloud buttons retain only the red background, and the editor has no shadow. URL text and row folder/tag badges use 80% of the title size; both row badge types use #9E9E9E, while cloud colors remain green/blue. Cloud pagination sits above the labels; disabled pagination buttons keep the standard cursor. The first page has no large blank area, and the 14rem cloud yields space to the list at narrow/larger-font sizes. Static checks, 54 Angular tests, 8 manifest tests, production/package checks, and stable Chrome integration pass. The earlier narrow-layout blocker is resolved.

## E-20 progress

| ID | Work | Goal | Status | Criteria |
|---|---|---|---|---|
| T-00 | Prepare the repository | Use the modernization branch, preserve documentation/images, and prepare ignore rules. | Verified | T-00 |
| T-01 | Define and baseline behavior | Establish behavior, resolve semantics, and measure legacy large-library failure. | Verified | T-01 |
| T-02 | Audit the manifest | Retain MV3; verify metadata, assets, permissions, and compatibility. | Verified | T-02 |
| T-03 | Rebuild the popup with Angular | Establish the standalone TypeScript popup, build, safe bindings, and transient model. | Verified | T-03 |
| T-04 | Fix scale and search | Filter the model, virtualize rows with overscan, and support Unicode safely. | Verified | T-04 |
| T-05 | Preserve and refine the design | Retain the compact interface and improve typography, scaling, overflow, and focus. | Verified | T-05 |
| T-06 | Document and verify | Maintain documentation/test coverage; validate the built extension in Chrome. | Verified | T-06 |
| T-07 | Release version 2.0 | Set version 2.0, document development attribution, and remove replaced runtime code. | Verified | T-07 |
| US-01 | Browse Chrome bookmarks | Find and open a saved page from the popup. | Verified | US-01 |
| US-02 | See and filter by tags | Find bookmarks by title hashtags. | Verified | US-02 |
| US-03 | Filter by bookmark folder | Narrow the collection by folder. | Verified | US-03 |
| US-04 | Search bookmarks | Find bookmarks across titles, folders, and URLs. | Verified | US-04 |
| US-05 | Reset filters | Return to the full supported collection with 1 action. | Verified | US-05 |
| US-06 | Add the current page | Save the active tab and edit the new bookmark. | Verified | US-06 |
| US-07 | Edit or delete a bookmark | Maintain details, tags, and folder placement. | Verified | US-07 |
| US-08 | Show or hide folders | Adjust the folder cloud during the popup session. | Verified | US-08 |

## Current release preparation

Jan froze release scope at version 2.0 and brought T-11 forward. Simplified README, added `docs/index.md`, consolidated full 1.0–2.0 history in `docs/changelog.md`, and drafted `.memory/distribution.md` with PowerShell ZIP creation and Chrome Web Store submission for T-15, the next planned issue. Distribution instructions were moved out of user docs at Jan's request. `docs/` now contains README.md, index.md, changelog.md, and restored images in `docs/img/`. Removed the duplicate docs/SPEC.md; `.memory/technical-specification.md` is the sole specification. Internal test/coverage/audit and historical documents moved to `.memory/`; images remain in `docs/img/` at Jan's request; redundant docs/usage.md was removed. Referenced historical evidence remains preserved; current store screenshots still need preparation. Jan subsequently confirmed submission on 2026-11-16; approval/publication remain pending.

T-09 now provides `.memory/test-cases.md` with v2.0 actions, expected results, and a report template, maintained with every future feature. It is ready for review, not a new manual test result. T-12 archival is removed; the plan remains active. T-14 moves to E-MAINT. E-23 (click preferences) and T-10 await clarification of the request to remove the separate testing phase.

## Next step

T-11/T-09 are ready for Jan's verification. `npm run check` and `npm test` passed: 57 Angular tests, 8 manifest tests, build/package validation, and stable Chrome integration. Report: `.local/test-results/2026-11-16T16-42-32.195Z-15696.html`. T-15 is in progress: created and inspected `.local/releases/chromtag-2.0.zip` (95,365 bytes). Check, full test rerun, production build, and built-package checks passed; report `.local/test-results/2026-11-16T16-53-23.842Z-93900.html`. The first run hit a transient progress-screenshot capture failure; the rerun passed without source changes. Jan confirmed submission to the Chrome Web Store on 2026-11-16. Await approval; do not treat submission as publication. After approval/publication, verify the installed store version and record the publication date. Jan previously verified E-20, T-08, and T-13. E-21 requires a separate instruction; representative real-profile testing remains open. Store submission is complete per Jan; approval/publication and installed-store verification remain pending.

## Later work

T-13 is user-verified: the popup shows reading/processing states, processed/total counts for all URL-bearing nodes after the tree returns, and synthetic-evidence guidance at 10,000+ nodes. Large snapshots use chunked processing and yield to paint; assistive technology gets phase-only updates. `npm test` (57 Angular tests, 8 manifest tests, stable Chrome with 10,001 supported synthetic bookmarks and a processing screenshot) and `npm run check` pass. Jan's separate 50,000-bookmark synthetic import is manual verification, not a real-profile benchmark or guaranteed limit. Jan moved T-08 forward and asked the agent to perform it, log it, and commit it; T-08 is Verified. Automatic session ending, logs, and commits are no longer required; this requested log and commit close T-08. E-21/E-22/E-23 remain not started. T-09 and T-11 are ready for review for release 2.0; T-10 awaits clarification. T-12 is removed. T-14 remains not started under E-MAINT: review open GitHub issues with Jan and record decisions. Version 2.2 now plans configurable combined cloud height and per-theme Material palette choices for foreground/tags/folders, with fixed white/light and #212121/dark backgrounds. Editable-color defaults, cloud-height bounds, and exact palette choices remain later decisions; version 2.3 popup-close default also remains open. Preserve referenced legacy evidence and unrelated private files during cleanup. The active plan will not be archived.
