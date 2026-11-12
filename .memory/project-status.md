# Project status

Updated: 2026-11-12

## Current state

- Branch: modernizing-chromtag. T-00/T-01 are user-verified. T-02 remains ready for verification, committed in 8c5cc5b.
- The user authorized the whole E-20 implementation with a separate commit and log entry per task. No E-21 work is authorized by this batch.
- T-03 is ready for verification: Angular 22 standalone popup, TypeScript 6, CLI workspace/lockfile, native Chrome APIs, safe rendering, and an iterative single-snapshot model.
- The manifest and build target now require Chrome 157+. Stable Chrome 157.0.8103.51 loaded the real package in an isolated profile with native bookmark loading and new-tab navigation; no runtime/CSP errors.
- npm test passed: 8 manifest tests, 6 Angular tests, production build, and stable Chrome integration. npm run check and built-manifest validation passed.
- Timestamped HTML test reports remain in ignored .local/test-results/, including failed runs. Latest passing report: 2026-11-12T17-37-52.004Z-6304.html.
- Model tests cover 12,000 nested folders. Literal text remains text. No real user profile was read.
- T-04 through T-07 and US-01 through US-08 remain incomplete. Later releases and post-implementation tasks remain not started.
- Legacy reference and raw baseline reports stay in ignored .local/ through final testing; T-11/T-12 schedule cleanup and plan archival.

## Remaining work and next steps

Continue T-04 under the explicit batch instruction. Keep user verification pending. Real-profile performance is unavailable; report synthetic evidence separately. Version 2.2 appearance bounds/palettes and version 2.3 close default remain later decisions.
