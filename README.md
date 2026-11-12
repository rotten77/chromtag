# Chromtag

Chromtag is a Chrome extension for browsing and editing Chrome bookmarks. Hashtags in bookmark titles provide tags. Users combine tag, folder, and text filters to find saved pages.

## Project state

The repository is prepared for modernization. The version 1.8 implementation is archived locally in ignored `.local/legacy/`. Manifest source and preserved icons are staged in `public/`. No Angular workspace or modernized extension exists yet.

The planned releases are:

- **2.0:** Angular popup, one transient bookmark model per refresh, virtualized rows, safe rendering, and Unicode search across titles, folders, and URLs.
- **2.1:** Search and tag/folder filters retained during the browser session.
- **2.2:** Persistent typography, popup dimensions, and independent light/dark palettes.
- **2.3:** Persistent bookmark tab-target and popup-close preferences.

See the [product specification](docs/SPEC.md), [plan](.memory/plan.md), and [current status](.memory/project-status.md). The [technical specification](.memory/technical-specification.md) defines acceptance criteria and open decisions.

## Data and compatibility

Chrome's native bookmark tree remains the source of truth. Tags remain hashtags in titles. The planned app keeps bookmarks and derived indexes in popup memory, without a separate database, account, backend, or `localStorage`.

Version 2.1 uses `chrome.storage.session` only for the query and selected tags/folder. Versions 2.2/2.3 use `chrome.storage.local` only for appearance/layout and bookmark-click preferences. Folder visibility remains popup-only.

Version 1.8 uses Manifest V3 with `bookmarks` and `tabs`. The staged manifest replaces `tabs` with `activeTab` and defers `storage` until preferences use it. The planned add feature will report unavailable current-page metadata without creating an incomplete bookmark. See the [manifest audit](docs/manifest-audit.md).

The staged manifest retains MV3 and sets the selected API floor to Chrome 90. Angular setup must finalize the framework's browser floor; Chrome 90 is not a tested release-support claim.

## Build, run, and test

Git ignores `node_modules/`, `dist/`, and `.angular/`, along with private files in `.local/`.

Application build and test commands are not available yet. Standalone manifest checks are available:

```powershell
node tools/validate-manifest.mjs --source
node --test tools/validate-manifest.test.mjs
```

The [manifest audit](docs/manifest-audit.md#validation) describes built-package checks and their limits. Do not load `public/` as an unpacked extension.

The following workflow is planned for Angular setup:

| Operation | Planned command | Description |
|---|---|---|
| Initial setup | `npm install` | Install dependencies after workspace creation |
| Reproducible install | `npm ci` | Install from the committed lockfile |
| Build | `npm run build` | Run `ng build --configuration production` |
| Development rebuild | `npm run watch` | Run `ng build --watch --configuration development` |
| Test | `npm test` | Run the configured Angular unit-test runner |
| Run | Chrome **Load unpacked** | Load built `dist/chromtag/browser/` |

Reload the unpacked extension after development builds. `ng serve` is not the extension runtime.

The [legacy diagnostic procedure](docs/legacy-measurements.md) measures the archived popup with synthetic bookmarks. It uses separate local test dependencies.

## Documentation and references

The [documentation index](docs/README.md) links product requirements and historical references. The [historical README](docs/legacy-readme.md) preserves version history and screenshots.

## AI agent workflow

`AGENTS.md` is the primary repository instruction file. Agents restore context from `.memory/`, review recent logs, and inspect the current repository before changes.

Agents implement no more than 1 story at a time. They report completed work and wait for explicit user verification before another story. Relevant README, `docs/`, and `.memory/` updates accompany changes.

After a task passes applicable tests and checks, agents automatically end the session, update the dated log and project status, and commit the completed work. User verification remains required before another story starts. See `AGENTS.md` for the full workflow.
