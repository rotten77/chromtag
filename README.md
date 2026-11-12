# Chromtag

Chromtag is a Chrome extension for browsing and editing Chrome bookmarks. Hashtags in bookmark titles provide tags. Users combine tag, folder, and text filters to find saved pages.

## Project state

E-20 implementation is in progress. The standalone Angular popup now builds from `src/`; manifest source and preserved icons live in `public/`. The version 1.8 reference remains in ignored `.local/legacy/`.

The current popup supports nested bookmarks and a virtualized list. Select blue tags to filter; multiple selected tags must all match. Select a tag again to clear it.

Select a green folder to include its descendants. Select the active folder again to clear it. Folder and tag filters combine.

Search matches a literal phrase in the full title, immediate folder name, or URL after a short delay. Matching ignores case and preserves accents.

Select **Reset filter** to clear search, tags, and folder together.

Folders appear when the popup opens. **Hide folders** and **Show folders** change visibility for that popup only.

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

The Angular 22 popup targets Chrome 157 or later. The manifest and browser build target use the same floor. See [Angular compatibility](https://angular.dev/reference/versions).

## Build, run, and test

Git ignores `node_modules/`, `dist/`, and `.angular/`, along with private files in `.local/`.

Use Node.js `^22.22.3`, `^24.15.0`, or `^26.0.0`. The lockfile pins application and test dependencies. Standalone manifest checks are also available:

```powershell
node tools/validate-manifest.mjs --source
node --test tools/validate-manifest.test.mjs
```

The [manifest audit](docs/manifest-audit.md#validation) describes package checks and their limits. Do not load `public/` as an unpacked extension.

Use these commands from the repository root:

| Operation | Command | Description |
|---|---|---|
| Initial setup | `npm install` | Install dependencies |
| Reproducible install | `npm ci` | Install from the committed lockfile |
| Build | `npm run build` | Run `ng build --configuration production` |
| Development rebuild | `npm run watch` | Run `ng build --watch --configuration development` |
| Test | `npm test` | Run manifest, Angular/Vitest, build, and stable Chrome checks; save a timestamped HTML report in `.local/test-results/` |
| Static checks | `npm run check` | Check TypeScript and the source manifest |
| Run | Chrome **Load unpacked** | Load built `dist/chromtag/browser/` |

Reload the unpacked extension after development builds. `ng serve` is not the extension runtime.

1. Run `npm ci`.
2. Run `npm run build`.
3. Open `chrome://extensions` in Chrome.
4. Enable **Developer mode**.
5. Select **Load unpacked**.
6. Select `dist/chromtag/browser/`.

The [legacy diagnostic procedure](docs/legacy-measurements.md) measures the archived popup with synthetic bookmarks. It uses separate local test dependencies.

## Documentation and references

The [documentation index](docs/README.md) links product requirements and historical references. The [historical README](docs/legacy-readme.md) preserves version history and screenshots.

## AI agent workflow

`AGENTS.md` is the primary repository instruction file. Agents restore context from `.memory/`, review recent logs, and inspect the current repository before changes.

Agents implement no more than 1 story at a time. They report completed work and wait for explicit user verification before another story. Relevant README, `docs/`, and `.memory/` updates accompany changes.

After a task passes applicable tests and checks, agents automatically end the session, update the dated log and project status, and commit the completed work. User verification remains required before another story starts. See `AGENTS.md` for the full workflow.
