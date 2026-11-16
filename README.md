# Chromtag

Chromtag is a Chrome extension for browsing and editing native Chrome bookmarks. Add hashtags to bookmark titles, then combine tag, folder, and text filters to find saved pages.

[**Install from Chrome Web Store**](https://chrome.google.com/webstore/detail/chromtag-tag-your-bookmar/epeiimpoigheahfbmmhadnfgimaacipk)

Version **2.0** is the current release scope. Chrome **157+** is required.

- [Extension guide](docs/index.md)
- [Changelog](docs/changelog.md)

## Development

Use Node.js `^22.22.3`, `^24.15.0`, or `^26.0.0`.

```sh
npm ci
npm run build
```

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Select `dist/chromtag/browser/`.

After changes, rebuild and reload the extension. Do not load `public/`; `ng serve` is not the extension runtime.

```sh
npm run watch  # Development rebuilds
npm run check # TypeScript, manifest, and project checks
npm test      # Full suite; requires stable Chrome 157+
```

Test reports: `.local/test-results/`.

Agent workflow: [AGENTS.md](AGENTS.md). Release planning: [.memory/plan.md](.memory/plan.md).
