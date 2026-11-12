# Manifest and API audit

T-02 audit, 2026-11-12. The manifest source and icons belong in `public/`.
The Angular build and generated popup remain T-03 work. The source directory is not a loadable extension.

## Metadata and assets

| Field | Audit result |
|---|---|
| Manifest generation | Retain Manifest V3. The archived version already uses it. |
| Name | Preserve `ChromTag - tag your bookmarks`. |
| Short name | Preserve `ChromTag`. |
| Description | Preserve `Tag your bookmarks with #hashtag!`. |
| Action title | Preserve `Chromtag`. |
| Extension version | Retain `1.8` during preparation. T-07 sets `2.0` after verification. This manifest does not represent a completed 1.8 or 2.0 application. |
| Popup | Change `popup.html` to generated `index.html`. The future loadable root is `dist/chromtag/browser/`. |
| Icons | Copy the existing 16 × 16, 48 × 48, and 128 × 128 PNG files without modification. Use those sizes in both icon maps. |
| Background execution | No service worker, content scripts, or background page. All planned operations can start from the popup. |
| Content Security Policy | Set `script-src 'self'; object-src 'none';` explicitly for extension pages. |

The name and description meet Chrome's documented limits. The short name fits its recommended length.
See Chrome's [name](https://developer.chrome.com/docs/extensions/reference/manifest/name), [short name](https://developer.chrome.com/docs/extensions/reference/manifest/short-name), and [description](https://developer.chrome.com/docs/extensions/reference/manifest/description) references.

All 3 preserved icons have the dimensions declared in the manifest.
Chrome supports these PNG assets and selects an available action size for the display scale.
See [manifest icons](https://developer.chrome.com/docs/extensions/reference/manifest/icons) and [action icons](https://developer.chrome.com/docs/extensions/reference/api/action#icon).

The explicit policy permits packaged scripts and prohibits inline JavaScript, string evaluation, and plugin objects.
It does not add a style restriction that would prevent Angular's component styles.
See Chrome's [extension Content Security Policy](https://developer.chrome.com/docs/extensions/reference/manifest/content-security-policy).
T-03 must verify the actual production bundles and generated HTML under this policy.

## Permissions

The archived manifest requests `bookmarks` and `tabs`. It requests no host permissions or storage permission.
The staged manifest uses `bookmarks` and `activeTab`, following the user's T-02 decision on 2026-11-12.

| Operation | Required access |
|---|---|
| Read or change Chrome bookmarks | `bookmarks`. |
| Open a saved URL in a new tab | `chrome.tabs.create()` does not require the `tabs` permission. |
| Navigate the current tab in 2.3 | `chrome.tabs.update()` does not require broad tab-metadata access merely to set its URL. |
| Read the current page's title and URL | Use temporary `activeTab` access after action invocation. Do not request broad `tabs` access. |
| Retain filters in 2.1 | Add `storage` when implementing `chrome.storage.session`. |
| Retain preferences in 2.2/2.3 | Keep `storage` for `chrome.storage.local`. |

The permission for the `chrome.tabs` namespace differs from permission to read sensitive tab properties.
Most tab operations require no `tabs` permission. See the [Tabs API permission reference](https://developer.chrome.com/docs/extensions/reference/api/tabs#permissions).
Bookmark operations require [the bookmarks permission](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#permissions).

`activeTab` grants temporary metadata access following a user invocation. Navigation can revoke that grant.
Chrome restricts this access on internal pages. See [activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab).
The user selected `activeTab` with unavailable-metadata handling.
US-06 must show a clear message and make no bookmark-creation call when Chrome does not expose the required current-page metadata.
This includes restricted pages or a missing/revoked grant. The implementation must inspect available metadata rather than assume access from the URL alone.
The technical specification records this supported-page clarification under US-06; the add feature is not implemented by T-02.

No planned feature requires host permissions, `scripting`, `unlimitedStorage`, or externally accessible resources.
Do not add `storage` before a preference feature uses it. The [Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage#permissions) requires that permission.

## API compatibility

Use the native `chrome.*` namespace. Current documentation also shows `browser.*`, whose Chrome availability differs.
The popup will use Promise-returning APIs without a compatibility wrapper.

| API or feature | Chrome API floor | Use |
|---|---|---|
| Manifest V3 and `chrome.action` | 88 | Action popup registration. |
| Bookmark Promises: `getTree`, `get`, `create`, `update`, `move`, `remove` | 90 | Load and mutate bookmarks. |
| Tab Promises: `query`, `create`, `update` | 88 | Current-page metadata and saved-link navigation. |
| `Intl.Segmenter` with grapheme granularity | 87 | Implement the approved grapheme-boundary matching policy. |
| `chrome.storage.session` | 102 | Version 2.1 session filters. |

Sources: [action availability](https://developer.chrome.com/docs/extensions/reference/api/action#availability),
[bookmark methods](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#methods),
[tab methods](https://developer.chrome.com/docs/extensions/reference/api/tabs#methods),
[MDN's Segmenter compatibility data](https://github.com/mdn/browser-compat-data/blob/main/javascript/builtins/Intl/Segmenter.json),
and [session storage](https://developer.chrome.com/docs/extensions/reference/api/storage#property-session).

The staged manifest sets `minimum_chrome_version` to `90`, the highest selected 2.0 API floor.
This value is an API floor, not a tested Angular support promise.
T-03 must raise it if the selected Angular release, browser target, or implementation requires newer Chrome.
Angular defines its supported browser set by release. See [Angular browser compatibility](https://angular.dev/reference/versions#browser-support).

Version 2.1 requires at least Chrome 102 for session storage. Keep any higher framework floor.
Version 2.2/2.3 must retain the highest applicable floor and recheck newly used APIs.
Never lower the manifest floor automatically when adding a release.
Chrome uses [`minimum_chrome_version`](https://developer.chrome.com/docs/extensions/reference/manifest/minimum-chrome-version) to restrict installation.

## Validation

The standalone validator uses Node.js built-in modules. It does not install Angular or any application dependencies.

1. Open PowerShell in the repository root.
2. Validate the manifest source:

   ```powershell
   node tools/validate-manifest.mjs --source
   ```

3. Run the validator regression checks:

   ```powershell
   node --test tools/validate-manifest.test.mjs
   ```

After T-03 creates the production build, validate the package:

```powershell
node tools/validate-manifest.mjs --built
```

Source mode checks metadata, API floors, capability declarations, policy, popup target, and local PNG headers/dimensions.
The exact permission set excludes duplicate or unrelated permissions. Preference releases require `storage` and at least the Chrome 102 session-API floor.
It deliberately does not require generated `index.html` inside `public/`.
Built mode also requires that popup file. It compares the manifest and icon bytes against `public/`.
An optional directory argument lets tests validate an isolated package fixture.

These checks do not parse all JavaScript bundles, decode PNG pixels, or replace Chrome's manifest/runtime validation.
T-03 must copy `public/` into the output and run built mode against the real artifact.
T-03/T-06 must check loadability, popup behavior, permissions, API errors, and CSP violations in Chrome.
T-06 must integrate the applicable validator checks with application tooling.

## Acceptance evidence and handoff

| Criterion | T-02 evidence and remaining integration |
|---|---|
| T-02-AC1 | Metadata/icon audit, permission analysis, API compatibility table, and staged manifest floor. T-03 must finalize the framework floor. |
| T-02-AC2 | Source manifest targets local icons and generated `index.html`, with no background worker. Actual output copying and loadability await T-03. |
| T-02-AC3 | Storage permission and Chrome 102 session-API check are assigned to US-09. Later preference releases retain and recheck the floor. |

The source and validator are reviewable before Angular setup. No generated popup or application build exists at this stage.
T-02 is ready for user verification. The permission choice is resolved; actual Angular packaging and runtime checks remain assigned to T-03.
