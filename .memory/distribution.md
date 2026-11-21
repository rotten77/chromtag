# T-15 — Package and publish version 2.0

Status: **Verified by Jan's confirmation**. At Jan's request, created `.local/releases/chromtag-2.0.zip` (95,365 bytes) from the production build on 2026-11-16. Inspected the archive: manifest, popup, generated scripts/styles, icons, and dependency notices are at the root; no private or repository files are included. Jan submitted version 2.0 on 2026-11-16 and reported Chrome Web Store approval and publication on 2026-11-20. Jan closed T-15 on 2026-11-21 based on his confirmation of packaging, release, and publication; an independent installed-store check was not reported and is not required to close T-15.

Validation: `npm run check`, `npm test`, production build, and built-package checks passed. The first test run failed while capturing transient processing progress; the complete rerun passed without source changes. Passing report: `.local/test-results/2026-11-16T16-53-23.842Z-93900.html`.

The Chrome Web Store accepts a ZIP archive of the built extension. Do not upload the repository or the `public/` directory.

Publication requires access to the developer account that owns the existing Chromtag listing. This procedure does not publish automatically.

## Build and test

Use the Node.js version range in [the development guide](../docs/development.md). Stable Chrome 157+ is required for browser tests.

1. Run `npm ci` from the repository root.
2. Run `npm run check`.
3. Run `npm test`.
4. Run `npm run build`.
5. Run `node tools/check-project.mjs --built`.
6. Load `dist/chromtag/browser/` through `chrome://extensions`.
7. Verify browsing, filtering, adding, editing, deleting, and refresh in Chrome.

**Caution:** Bookmark edits change native Chrome data. Use a dedicated test profile or back up bookmarks before manual testing.

Automated checks use a separate temporary profile with synthetic bookmarks. Representative real-profile testing remains open. Synthetic results do not guarantee performance for every library.

## Create the upload ZIP

Run this PowerShell block from the repository root after a successful production build:

```powershell
$ErrorActionPreference = 'Stop'
$source = Join-Path $PWD 'dist/chromtag/browser'
$manifest = Get-Content (Join-Path $source 'manifest.json') -Raw | ConvertFrom-Json
if ($manifest.version -ne '2.0') { throw 'Expected extension version 2.0' }
New-Item -ItemType Directory -Force '.local/releases' | Out-Null
$zip = Join-Path $PWD ".local/releases/chromtag-$($manifest.version).zip"
Compress-Archive -Path (Join-Path $source '*') -DestinationPath $zip -Force
Write-Output $zip
```

The output is `.local/releases/chromtag-2.0.zip`. This local artifact is Gitignored.

1. Open the ZIP archive.
2. Confirm that `manifest.json` is directly at the archive root.
3. Confirm that `index.html`, generated scripts/styles, icons, and `3rdpartylicenses.txt` are present.
4. Confirm that no repository files, credentials, test reports, or private data appear in the archive.

Do not put a containing `browser/` or `chromtag/` directory inside the ZIP. Chrome's **Pack extension** creates a CRX; that is not the ZIP upload procedure.

## Prepare the store listing

Use the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole). Register and pay the registration fee if the account is not registered.

For the existing extension, update the existing item rather than creating a duplicate. The historical listing ID is `epeiimpoigheahfbmmhadnfgimaacipk`; confirm ownership and identity before uploading.

Prepare:

- A current description based on the [extension guide](../docs/README.md).
- Version 2.0 release notes from the [changelog](../docs/changelog.md).
- Current screenshots of the built 2.0 popup, filtering, and editor. Do not use the historical `docs/img/` screenshots.
- Store icons and promotional images that meet the dashboard's current size requirements.
- A privacy policy URL and accurate privacy declarations that satisfy the dashboard's current requirements.

Suggested single purpose: “Browse and edit native Chrome bookmarks using title hashtags, folder filters, and text search.”

Permission justifications:

| Permission | Purpose |
|---|---|
| `bookmarks` | Display and filter native bookmarks; create, edit, move, and delete bookmarks on user request. |
| `activeTab` | Read the active page's title and URL after the user invokes the extension, to add that page as a bookmark. |

The implementation has no backend, analytics, remote code, or separate bookmark storage. Bookmarks and URLs are processed locally through Chrome APIs. Review actual behavior before completing privacy declarations; do not assume that local processing exempts the listing from policy requirements.

## Submit the update

1. Open the existing Chromtag item in the developer dashboard.
2. Upload `.local/releases/chromtag-2.0.zip` as a new package.
3. Resolve all package validation errors.
4. Update the description, release notes, and screenshots.
5. Complete the privacy and permission declarations.
6. Review distribution and visibility settings.
7. Submit the update for review.
8. Publish after approval, according to the selected publication option.
9. Optionally install the store version in a test profile and verify its version and core bookmark workflows. This is not a T-15 completion requirement.
10. Record the actual publication date in `docs/changelog.md` and project status.

The dashboard controls the exact submission steps and available options. Store review and publication are separate from creating a ZIP. Jan confirmed package submission on 2026-11-16 and approval/publication on 2026-11-20. Jan closed T-15 based on his confirmation of packaging and publication. No future release is scheduled by this procedure.

Keep version 2.0 frozen for this release. Later updates require a higher manifest version; Chrome does not accept reusing a published version number.

## Official references

- [Publish in the Chrome Web Store](https://developer.chrome.com/docs/webstore/publish)
- [Update a published extension](https://developer.chrome.com/docs/webstore/update)
- [Chrome Web Store program policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Listing image requirements](https://developer.chrome.com/docs/webstore/images)
