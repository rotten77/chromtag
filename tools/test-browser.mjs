import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { resolve } from 'node:path';
import { validateManifest } from './validate-manifest.mjs';

await validateManifest(resolve('dist/chromtag/browser'), { built: true });
// Chrome's test-only CDP loading uses a fresh temporary profile, never the user's profile.
const context = await chromium.launchPersistentContext('', {
  channel: 'chrome', headless: true, ignoreDefaultArgs: ['--disable-extensions'],
  args: ['--enable-unsafe-extension-debugging'],
});
try {
  const browser = context.browser();
  await context.route('https://example.invalid/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Test destination</title>' }));
  console.log(`Stable Chrome: ${browser.version()}`);
  const session = await browser.newBrowserCDPSession();
  const { id } = await session.send('Extensions.loadUnpacked', { path: resolve('dist/chromtag/browser') });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(`chrome-extension://${id}/index.html`);
  await page.getByText('No bookmarks yet.', { exact: true }).waitFor();
  await page.evaluate(async () => {
    const folder = await chrome.bookmarks.create({ title: '<Folder> café' });
    await chrome.bookmarks.create({ parentId: folder.id, title: '<b>Saved page</b> #C++', url: 'https://example.invalid/test' });
  });
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await page.getByRole('button', { name: '<b>Saved page</b>', exact: true }).waitFor();
  assert.equal(await page.locator('article b').count(), 0, 'Bookmark markup must remain literal text');
  const opened = context.waitForEvent('page');
  await page.getByRole('button', { name: '<b>Saved page</b>', exact: true }).click();
  const tab = await opened;
  await tab.waitForURL('https://example.invalid/test');
  await tab.close();
  await page.evaluate(async () => {
    for (let batch = 0; batch < 40; batch++) {
      await Promise.all(Array.from({ length: 250 }, (_, index) => {
        const number = batch * 250 + index;
        return chrome.bookmarks.create({ title: `Scale bookmark ${number} #scale`, url: `https://example.invalid/scale/${number}` });
      }));
    }
  });
  const started = performance.now();
  await page.reload();
  await page.getByRole('button', { name: 'Scale bookmark 0', exact: true }).waitFor();
  const elapsed = performance.now() - started;
  const liveRows = await page.locator('article.bookmark').count();
  assert(liveRows > 0 && liveRows <= 24, `10,001 records must have bounded live rows, saw ${liveRows}`);
  await page.locator('cdk-virtual-scroll-viewport').evaluate(element => { element.scrollTop = element.scrollHeight; element.dispatchEvent(new Event('scroll')); });
  await page.getByRole('button', { name: 'Scale bookmark 9999', exact: true }).waitFor();
  assert(await page.locator('article.bookmark').count() <= 24);
  console.log(`10,001 native synthetic bookmarks: startup ${elapsed.toFixed(1)} ms, ${liveRows} live rows; last row reached.`);
  assert.deepEqual(errors, [], 'No runtime or CSP errors');
  console.log('PASS: loadable extension, native bookmark snapshot, literal rendering, new-tab navigation, no runtime/CSP errors.');
} finally {
  await context.close();
}
