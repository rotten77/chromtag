# Chromtag

Chromtag is a Chrome extension for browsing and editing Chrome bookmarks. Hashtags in bookmark titles provide tags. Users combine tag, folder, and text filters to find saved pages.

## Project state

The repository is prepared for modernization. The version 1.8 implementation is archived locally in ignored `.local/legacy/`. No Angular workspace or modernized extension exists yet.

The planned releases are:

- **2.0:** Angular popup, one transient bookmark model per refresh, virtualized rows, safe rendering, and Unicode search across titles, folders, and URLs.
- **2.1:** Search and tag/folder filters retained during the browser session.
- **2.2:** Persistent typography, popup dimensions, and independent light/dark palettes.
- **2.3:** Persistent bookmark tab-target and popup-close preferences.

See the [product specification](docs/SPEC.md), [plan](.memory/plan.md), and [current status](.memory/project-status.md). The [technical specification](.memory/technical-specification.md) defines acceptance criteria and open decisions.

## Data and compatibility

Chrome's native bookmark tree remains the source of truth. Tags remain hashtags in titles. The planned app keeps bookmarks and derived indexes in popup memory, without a separate database, account, backend, or `localStorage`.

Version 2.1 uses `chrome.storage.session` only for the query and selected tags/folder. Versions 2.2/2.3 use `chrome.storage.local` only for appearance/layout and bookmark-click preferences. Folder visibility remains popup-only.

Version 1.8 already uses Manifest V3 with `bookmarks` and `tabs`. Modernization retains MV3, reviews the active-tab permission, and adds `storage` for preferences. The minimum supported Chrome version remains to be selected against the chosen APIs.

## Build, run, and test

No build, run, or test commands are available in the current repository. The following workflow is planned for Angular setup:

| Operation | Planned command | Description |
|---|---|---|
| Initial setup | `npm install` | Install dependencies after workspace creation |
| Reproducible install | `npm ci` | Install from the committed lockfile |
| Build | `npm run build` | Run `ng build --configuration production` |
| Development rebuild | `npm run watch` | Run `ng build --watch --configuration development` |
| Test | `npm test` | Run the configured Angular unit-test runner |
| Run | Chrome **Load unpacked** | Load built `dist/chromtag/browser/` |

Reload the unpacked extension after development builds. `ng serve` is not the extension runtime.

## Documentation and references

The [documentation index](docs/README.md) links product requirements and historical references. The [historical README](docs/legacy-readme.md) preserves version history and screenshots.

## AI agent workflow

`AGENTS.md` is the primary repository instruction file. Agents restore context from `.memory/`, review recent logs, and inspect the current repository before changes.

Agents implement no more than 1 story at a time. They report completed work and wait for explicit user verification before another story. Relevant README, `docs/`, and `.memory/` updates accompany changes.

At session end, agents record a dated log, update current state when needed, and suggest a commit message. Agents create commits only on request.
