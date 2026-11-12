# Chromtag

Chromtag is a Chrome extension for browsing and editing Chrome bookmarks. Hashtags in bookmark titles provide tags. Users combine tag, folder, and text filters to find saved pages.

## Project state

The version 2.0 release candidate is implemented and awaits user verification. The standalone Angular popup builds from `src/`; manifest source and preserved icons live in `public/`. The version 1.8 reference remains in ignored `.local/legacy/`.

The current popup supports nested bookmarks and a virtualized list. Select blue tags to filter; multiple selected tags must all match. Select a tag again to clear it.

Select a bookmark title to open its URL in a new tab. Rows show the URL, immediate folder, tags, and an edit control. The list excludes `javascript:` bookmarks.

Select a green folder to include its descendants. Select the active folder again to clear it. Folder and tag filters combine.

Search matches a literal phrase in the full title, immediate folder name, or URL after a short delay. Matching ignores case and preserves accents.

Select **Reset filter** to clear search, tags, and folder together.

Folders appear when the popup opens. **Hide folders** and **Show folders** change visibility for that popup only.

Hover a bookmark row to reveal **Edit**. Keyboard focus also reveals that button. The editor changes title, URL, tags, and folder. **Save** and **Delete** update Chrome bookmarks. **Cancel**, Escape, or the overlay discards unsaved fields.

**Add bookmark** saves the active page in Chrome's default folder and opens the editor. Cancelling that editor keeps the new bookmark. If Chrome withholds required page metadata, Chromtag shows a message and creates no bookmark.

The compact popup uses a 13 px base font and a 540 × 580 px layout. The `Search...` field has no visible label. Green folders (`#4CAF50`) and blue tags (`#448AFF`) share 1 fixed wrapping cloud without its own scrollbar. First/Previous/More controls above the cloud reveal collapsed labels; the cloud yields space to the list at smaller sizes. Selected labels use only a `#F44336` background, with no shadow; hover uses `#212121`. Only the bookmark list scrolls in the main popup. Bookmark rows fill the list width and truncate long text while reserving space for **Edit**. Row folder/tag badges have a `#9E9E9E` background and, like URLs, use 80% of the title font size. Titles are underlined and use the tag blue on hover. The editor has no shadow and scrolls as needed. Appearance settings arrive in 2.2.

Release scope:

- **2.0 (implemented):** Angular popup, one transient bookmark model per refresh, virtualized rows, safe rendering, and Unicode search across titles, folders, and URLs.
- **2.1:** Search and tag/folder filters retained during the browser session.
- **2.2:** Persistent typography, popup dimensions, combined folder/tag cloud height, and independent Material palette choices for light/dark foreground, tags, and folders. Backgrounds stay white/light and `#212121`/dark.
- **2.3:** Persistent bookmark tab-target and popup-close preferences.

See the [product specification](docs/SPEC.md), [plan](.memory/plan.md), and [current status](.memory/project-status.md). The [technical specification](.memory/technical-specification.md) defines acceptance criteria and open decisions.

## Data and compatibility

Chrome's native bookmark tree remains the source of truth. Tags remain hashtags in titles. The app keeps bookmarks and derived indexes in popup memory, without a separate database, account, backend, or `localStorage`.

Version 2.1 uses `chrome.storage.session` only for the query and selected tags/folder. Versions 2.2/2.3 use `chrome.storage.local` only for appearance/layout and bookmark-click preferences. Folder visibility remains popup-only.

The popup uses Manifest V3 with `bookmarks` and `activeTab`. It reports unavailable page metadata without creating an incomplete bookmark. Later preferences add `storage` when required. See the [manifest audit](docs/manifest-audit.md).

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
| Build | `npm run build` | Run the production Angular build and finalize the extension package |
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

Stable Google Chrome 157+ must be installed for `npm test`. Browser tests use a fresh temporary profile with synthetic bookmarks. See [test evidence and reports](docs/testing.md) and the [criterion mapping](docs/test-coverage.md).

## Documentation and references

The [documentation index](docs/README.md) links product requirements and historical references. The [historical README](docs/legacy-readme.md) preserves version history and screenshots.

The [usage guide](docs/usage.md) explains filtering and bookmark changes. The [changelog](docs/CHANGELOG.md) records version 2.0 and its development attribution.

## AI agent workflow

`AGENTS.md` is the primary repository instruction file. Agents restore context from `.memory/`, review recent logs, and inspect the current repository before changes.

Agents implement no more than 1 story at a time. They report completed work and wait for explicit user verification before another story. Relevant README, `docs/`, and `.memory/` updates accompany changes.

After a task passes applicable tests and checks, agents automatically end the session, update the dated log and project status, and commit the completed work. User verification remains required before another story starts. See `AGENTS.md` for the full workflow.
