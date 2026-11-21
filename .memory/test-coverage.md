# Version 2.0 criterion mapping

Criteria remain authoritative in [the technical specification](../.memory/technical-specification.md). This map names regression evidence without redefining requirements. `npm test` runs the application evidence below; `npm run check` checks mapping completeness and links.

| Criteria | Repository evidence |
|---|---|
| US-12-AC4 (unreleased) | [Chrome integration](../tools/test-browser.mjs): top actions, no header/footer/close button, refresh via Options, folder toggle and reset on reopen. |
| US-12-AC1, US-12-AC2, US-12-AC3 (unreleased) | [Chrome integration](../tools/test-browser.mjs): cloud/search order, same-line folder/tag flow, stable selected chip on a later page, hidden or reachable paging, combined clear and list scrolling. |
| US-01-AC1 | [Chrome integration](../tools/test-browser.mjs): native action renders the registered popup target and natural dimensions. |
| US-01-AC2 | [Model tests](../src/app/model.spec.ts): nested parents and 12,000 levels; [Chrome integration](../tools/test-browser.mjs): nested fixture. |
| US-01-AC3 | [Component tests](../src/app/app.spec.ts): literal fields; [Chrome integration](../tools/test-browser.mjs): row/edit/tooltip rendering. |
| US-01-AC4 | [Store tests](../src/app/bookmark-store.spec.ts): native tab arguments; [Chrome integration](../tools/test-browser.mjs): destination tab. |
| US-01-AC5 | [Model tests](../src/app/model.spec.ts) and [Chrome integration](../tools/test-browser.mjs): omit javascript bookmarks and their tags. |
| US-02-AC1, US-02-AC2, US-02-AC5 | [Model tests](../src/app/model.spec.ts): boundaries, punctuation, first spelling, deduplication and code-point sort; [editor tests](../src/app/bookmark-editor.spec.ts): literal removal. |
| US-02-AC3, US-02-AC4 | [Component tests](../src/app/app.spec.ts): immediate multi-tag toggles/AND; [search tests](../src/app/search.spec.ts): combinations; [Chrome integration](../tools/test-browser.mjs): cloud toggles. |
| US-03-AC1 | [Search tests](../src/app/search.spec.ts): distinct duplicate-name paths/IDs; [Chrome integration](../tools/test-browser.mjs): large sorted cloud. |
| US-03-AC2 | [Component tests](../src/app/app.spec.ts): replace/clear folder selection. |
| US-03-AC3, US-03-AC5 | [Search tests](../src/app/search.spec.ts): all combinations and ID intervals; [Chrome integration](../tools/test-browser.mjs): ancestor selection. |
| US-03-AC4 | [Model tests](../src/app/model.spec.ts): consistent parents; [store tests](../src/app/bookmark-store.spec.ts): one coalesced snapshot. |
| US-04-AC1 | [Component tests](../src/app/app.spec.ts): 149/150 ms boundary and immediate tag flush; [Chrome integration](../tools/test-browser.mjs): live input. |
| US-04-AC2, US-04-AC3 | [Search tests](../src/app/search.spec.ts): field-only phrase, immediate folder, URL, title hashtags and combinations. |
| US-04-AC4, US-04-AC5 | [Search tests](../src/app/search.spec.ts): canonical accents, Turkish, Arabic, Chinese, mixed scripts, emoji and grapheme boundaries. |
| US-04-AC6 | [Search tests](../src/app/search.spec.ts) and [Chrome integration](../tools/test-browser.mjs): literal metacharacters, empty and no-match queries. |
| US-05-AC1, US-05-AC2 | [Component tests](../src/app/app.spec.ts): clear filters/input/pending timer; [Chrome integration](../tools/test-browser.mjs): combined reset and bounded rows. |
| US-05-AC3, US-09-AC1, US-09-AC2, US-09-AC3, US-09-AC4, US-09-AC6 | [Chrome integration](../tools/test-browser.mjs): restore, opt-out, clear, independent folder visibility, storage contents, and restart with the same profile. |
| US-09-AC5 | [Manifest tests](../tools/validate-manifest.test.mjs) and package checks: version, storage permission, and compatible browser floor. |
| US-06-AC1, US-06-AC2 | [Store tests](../src/app/bookmark-store.spec.ts): metadata/default destination; [Chrome integration](../tools/test-browser.mjs): native action grant and creation. |
| US-06-AC3 | [Component tests](../src/app/app.spec.ts) and [Chrome integration](../tools/test-browser.mjs): populated add editor. |
| US-06-AC4 | [Store tests](../src/app/bookmark-store.spec.ts): missing/restricted metadata and rejected grant, no create/read; [Chrome integration](../tools/test-browser.mjs): no grant, no creation. |
| US-07-AC1, US-07-AC2, US-07-AC3 | [Editor tests](../src/app/bookmark-editor.spec.ts): initial fields, literal tag toggle/new-tag policy/spelling; [Chrome integration](../tools/test-browser.mjs): real editor and move. |
| US-07-AC4, US-07-AC5 | [Store tests](../src/app/bookmark-store.spec.ts): update/move/remove and failures; [Chrome integration](../tools/test-browser.mjs): actual native state. |
| US-07-AC6 | [Editor tests](../src/app/bookmark-editor.spec.ts): cancel without writes; [component tests](../src/app/app.spec.ts): cancel retains creation; [Chrome integration](../tools/test-browser.mjs): Cancel/overlay/Escape. |
| US-07-AC7 | [Store tests](../src/app/bookmark-store.spec.ts) and [Chrome integration](../tools/test-browser.mjs): exactly one read per mutation, refreshed native records/clouds, and the saved/moved title visible in Chrome Bookmark Manager. |
| US-08-AC1, US-08-AC2, US-08-AC3 | [Component tests](../src/app/app.spec.ts) and [Chrome integration](../tools/test-browser.mjs): visible default, hide/reopen, no localStorage; [project check](../tools/check-project.mjs): no persistence in runtime source. |
| T-00-AC1, T-00-AC2, T-00-AC3 | Historical verified preparation: commit `e600c02`, [session log](../.memory/log/2026-11-12.md). [Project check](../tools/check-project.mjs) checks preserved links/ignore rules. Branch creation is human evidence, not inferred by tests. |
| T-01-AC1, T-01-AC2, T-01-AC3 | Historical user-verified [baseline](legacy-baseline.md), [measurements](legacy-measurements.md), [diagnostic runner](../tools/legacy-baseline.mjs), and recorded matching decisions. The legacy diagnostic is separate from npm test. |
| T-02-AC1, T-02-AC2, T-02-AC3 | [Manifest regression](../tools/validate-manifest.test.mjs), [validator](../tools/validate-manifest.mjs), [audit](manifest-audit.md), [project check](../tools/check-project.mjs), [Chrome integration](../tools/test-browser.mjs). |
| T-03-AC1, T-03-AC2 | [Angular workspace](../angular.json), [lockfile](../package-lock.json), production build and [Chrome integration](../tools/test-browser.mjs). |
| T-03-AC3 | [Store tests](../src/app/bookmark-store.spec.ts): coalesced refresh and mutation reads; [model tests](../src/app/model.spec.ts); [Chrome integration](../tools/test-browser.mjs): native read counters. |
| T-03-AC4 | [Project/package check](../tools/check-project.mjs): local scripts and transient source policy; [Chrome integration](../tools/test-browser.mjs): no runtime/CSP errors. |
| T-04-AC1 | [Search tests](../src/app/search.spec.ts): pure model predicates; [component tests](../src/app/app.spec.ts): no filter tree reads. |
| T-04-AC2, T-04-AC3 | [Chrome integration](../tools/test-browser.mjs): 10,001 records, timed filters, bounded rows, final-row open/edit and single refreshes. |
| T-04-AC4 | [Model/search tests](../src/app/model.spec.ts), [search tests](../src/app/search.spec.ts), [component tests](../src/app/app.spec.ts), [Chrome integration](../tools/test-browser.mjs): deep/large trees, clouds, scripts and literal rendering. |
| T-05-AC1, T-05-AC2, T-05-AC3, T-05-AC4 | [Chrome integration](../tools/test-browser.mjs): crowded clouds, long content, font/dimension scaling (including URL and row badge text at 80% of title size), overflow, Tab trap/restore/Escape, native dimensions. [HTML runner](../tools/run-tests.mjs) embeds visually reviewed screenshots. |
| T-05-AC5 | [Chrome integration](../tools/test-browser.mjs): no search label, exact placeholder, accessible searchbox. [Manual plan](test-plan.md): UI-01. |
| T-05-AC6 | [Cloud tests](../src/app/filter-cloud.spec.ts): page transitions, pending-layout guard, selection, hide reset; [Chrome integration](../tools/test-browser.mjs): shared folder/tag flow, controls above choices with a standard cursor when disabled, no first-page blank area, collapsed labels, all 116 folders/130 tags reachable via More/Previous/First, hide/reopen behavior. [Manual plan](test-plan.md): UI-02/UI-03. |
| T-05-AC7 | [Chrome integration](../tools/test-browser.mjs): long-title/URL geometry and consistent top/bottom row spacing at default and narrower/larger-font sizes, full article width, CSS truncation, no text/Edit overlap or horizontal list scrolling. [Manual plan](test-plan.md): UI-04. |
| T-05-AC8 | [Chrome integration](../tools/test-browser.mjs): computed cloud default, selected, and hover colors match the requested values; selected buttons and the editor have no shadow; both row badge backgrounds are #9E9E9E. [Manual plan](test-plan.md): UI-05. |
| T-05-AC9 | [Chrome integration](../tools/test-browser.mjs): native 540 × 580 popup, wheel-scroll isolation, stationary header/search/cloud/toolbar, top separator using --border-color, no outer overflow, default and narrower/larger-font layouts. [Manual plan](test-plan.md): UI-06. |
| T-05-AC10 | [Chrome integration](../tools/test-browser.mjs): underlined titles, exact tag-blue hover, hidden Edit, row-hover reveal without layout shift, keyboard Tab reveal and Enter opening the editor. [Manual plan](test-plan.md): UI-07. |
| T-06-AC1, T-06-AC2 | [Project check](../tools/check-project.mjs): links/mapping; [README](../README.md), [technical specification](technical-specification.md), this map and [testing guide](testing.md). |
| T-06-AC3, T-06-AC4, T-06-AC5 | [Test runner](../tools/run-tests.mjs): manifest, Angular mocked API/component, production build, package and stable Chrome integration. Reproducible npm ci is recorded in the log. |
| T-06-AC6 | [Chrome integration](../tools/test-browser.mjs) and [scale evidence](testing.md#scale-evidence-and-limits). Real-profile testing is unavailable and remains a stated limit. |
| T-06-AC7 | [Component tests](../src/app/app.spec.ts) and [search tests](../src/app/search.spec.ts): literal rendering, every filter combination, international text. |
| T-07-AC1, T-07-AC2, T-07-AC3 | T-07 checks in [project/package validation](../tools/check-project.mjs): version agreement, release attribution, no replaced runtime libraries; final production/Chrome checks. User verification remains separate from automated release-candidate checks. |
| T-13-AC1, T-13-AC2 | [Store tests](../src/app/bookmark-store.spec.ts): reading, processing, actual counts, completion/failure and refresh; [model tests](../src/app/model.spec.ts): all URL nodes including excluded schemes; [component tests](../src/app/app.spec.ts): visible states. |
| T-13-AC3, T-13-AC4 | [Store tests](../src/app/bookmark-store.spec.ts): large chunked snapshot and one tree read; [component tests](../src/app/app.spec.ts): threshold message and phase-only live status; [Chrome integration](../tools/test-browser.mjs): real popup progress screenshot and no extra reads. |
| T-13-AC5 | [Full test runner](../tools/run-tests.mjs): Angular, manifest, built-package and stable Chrome integration with 10,001 supported synthetic bookmarks. Representative real-profile timing remains unavailable. |
