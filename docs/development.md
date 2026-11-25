# Develop Chromtag

Use Node.js `^22.22.3`, `^24.15.0`, or `^26.0.0`. The published extension is version 2.0; the development build is version 2.12. Its scoped `open-selected.js` worker completes accepted tab-opening batches independently of popup lifetime; it does not store a bookmark queue or resume after browser shutdown/reload. The same worker now executes precomputed bulk title/move operations sequentially. Popup dismissal does not cancel accepted operations; results are returned only to the initiating popup, with no persistent job history. Title computation retains the documented snapshot-overwrite risk.

## Build and load the extension

From the repository root, run:

```sh
npm ci
npm run build
```

1. Open `chrome://extensions` in Chrome 157 or later.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Select `dist/chromtag/browser/`.

After changes, rebuild and reload the extension. Do not load `public/`; `ng serve` is not the extension runtime.

## Rebuild and test

```sh
npm run watch  # Development rebuilds
npm run check  # TypeScript, manifest, and project checks
npm test       # Full suite; requires stable Chrome 157+
```

Test reports: `.local/test-results/`.

See the [agent workflow](../AGENTS.md) and [plan](../.memory/plan.todo).
