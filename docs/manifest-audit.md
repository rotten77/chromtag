# Manifest and API audit

The Manifest V3 popup uses native Chrome APIs without a background worker. T-02 established the permission policy; T-03 integrated the Angular package. User verification remains separate from automated checks.

## Metadata and assets

| Field | Current implementation |
|---|---|
| Name | ChromTag - tag your bookmarks |
| Short name | ChromTag |
| Description | Tag your bookmarks with #hashtag! |
| Version | Preparation retains 1.8; T-07 sets 2.0 after automated checks |
| Icons | Preserved local PNG files at 16, 48, and 128 px |
| Action | Local icons, title Chromtag, generated index.html popup |
| Source | public/manifest.json and public/icon*.png |
| Loadable root | dist/chromtag/browser/ |
| Browser floor | Chrome 157+, matching the Angular build target |
| Extension CSP | script-src 'self'; object-src 'none'; |

See Chrome's [manifest format](https://developer.chrome.com/docs/extensions/reference/manifest), [icons](https://developer.chrome.com/docs/extensions/reference/manifest/icons), and [action API](https://developer.chrome.com/docs/extensions/reference/api/action).

## Permissions

Version 2.0 declares exactly `bookmarks` and `activeTab`. It declares no host permissions, content scripts, sandbox, background worker, or web-accessible resources.

The [bookmarks API](https://developer.chrome.com/docs/extensions/reference/api/bookmarks) reads and mutates the native tree. The [tabs API](https://developer.chrome.com/docs/extensions/reference/api/tabs#permissions) opens saved links and queries the active tab.

The user selected [activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab) instead of broad `tabs` access. Chrome grants temporary metadata access following action invocation. Restricted pages or expired access can leave required title/URL fields unavailable.

The add feature checks exposed metadata. When required fields are unavailable, the popup shows a message and makes no bookmark-creation call. It does not assume access from the URL alone.

Versions 2.1–2.3 add [storage](https://developer.chrome.com/docs/extensions/reference/api/storage#permissions) for explicit preferences. Version 2.0 does not use either Chrome storage area or localStorage.

## Compatibility

| API or feature | API floor | Use |
|---|---|---|
| Manifest V3 and action | Chrome 88 | Popup registration |
| Bookmark Promises | Chrome 90 | getTree/create/update/move/remove |
| Tab Promises | Chrome 88 | query/create |
| Intl.Segmenter graphemes | Chrome 87 | Literal phrase boundaries |
| storage.session | Chrome 102 | Version 2.1 filters |

Use native `chrome.*` Promises. These API floors alone do not establish Angular support. T-03 raised the preparation floor from 90 to a conservative Chrome 157 application target, tested in stable Chrome 157.0.8103.51. The manifest and `.browserslistrc` agree.

Angular 22 uses TypeScript 6. Supported Node ranges follow [Angular compatibility](https://angular.dev/reference/versions): `^22.22.3`, `^24.15.0`, or `^26.0.0`. Keep any higher framework floor when later APIs arrive.

Sources: [bookmark methods](https://developer.chrome.com/docs/extensions/reference/api/bookmarks#methods), [tab methods](https://developer.chrome.com/docs/extensions/reference/api/tabs#methods), [Segmenter compatibility](https://github.com/mdn/browser-compat-data/blob/main/javascript/builtins/Intl/Segmenter.json), [session storage](https://developer.chrome.com/docs/extensions/reference/api/storage#property-session), and [minimum Chrome version](https://developer.chrome.com/docs/extensions/reference/manifest/minimum-chrome-version).

## Validation

1. Run `node tools/validate-manifest.mjs --source` to check source metadata and PNG dimensions.
2. Run `node --test tools/validate-manifest.test.mjs` to check validator regressions.
3. Run `npm run build` to create the production package.
4. Run `node tools/validate-manifest.mjs --built` to check the generated popup and copied assets.
5. Run `npm test` to check the built extension in stable Chrome.

The exact permission set excludes duplicates and unrelated capabilities. Preference versions require `storage` and at least Chrome 102, retaining the higher framework floor. Built validation compares manifest/icon bytes with `public/`.

Source validation does not establish loadability. The project/package check inspects generated local script paths. Browser tests establish actual native API behavior and check runtime/CSP errors. See [testing and reports](testing.md).

Angular production optimization disables critical-CSS inlining and remote-font processing. The package contains local AOT scripts and styles. Chrome enforces the declared [extension CSP](https://developer.chrome.com/docs/extensions/reference/manifest/content-security-policy).

The standalone validator checks PNG headers/dimensions without decoding pixels. It does not parse all JavaScript bundles or replace Chrome's own manifest validation.
