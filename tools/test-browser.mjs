import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { resolve } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { validateManifest } from './validate-manifest.mjs';

let commandId = 0;
const screenshotId = process.env['CHROMTAG_TEST_RUN'] ?? new Date().toISOString().replaceAll(':', '-');
await mkdir(resolve('.local/test-results'), { recursive: true });
async function screenshot(page, name) {
  await page.locator('body').screenshot({ path: resolve('.local/test-results', `${screenshotId}-${name}.png`) });
}
async function checkBookmarkWidth(page) {
  const viewport = page.locator('cdk-virtual-scroll-viewport');
  await viewport.scrollIntoViewIfNeeded();
  const layout = await viewport.evaluate(element => {
    const row = element.querySelector('article');
    const edit = row.querySelector('.edit');
    const title = row.querySelector('.title');
    const url = row.querySelector('.url');
    const bounds = node => ({ left: node.getBoundingClientRect().left, right: node.getBoundingClientRect().right });
    return { width: element.clientWidth, scrollWidth: element.scrollWidth, viewport: bounds(element), row: bounds(row), edit: bounds(edit), title: bounds(title), titleTruncated: title.scrollWidth > title.clientWidth, urlTruncated: url.scrollWidth > url.clientWidth };
  });
  assert.equal(layout.scrollWidth, layout.width, 'Long bookmarks must not widen the viewport');
  assert(Math.abs(layout.row.right - layout.row.left - layout.width) <= 1, 'Article fills all available viewport width');
  assert(layout.edit.left >= layout.row.left && layout.edit.right <= layout.viewport.left + layout.width + 1, 'Edit stays inside the visible row');
  assert(layout.title.right <= layout.edit.left, 'Truncated text does not overlap Edit');
  assert(layout.titleTruncated && layout.urlTruncated, 'Long title and URL truncate with CSS');
}
async function targetCommand(session, sessionId, method, params = {}) {
  const id = ++commandId;
  let listener;
  let timer;
  const response = new Promise((done, reject) => {
    timer = setTimeout(() => reject(new Error(`Popup CDP command timed out: ${method}`)), 5000);
    listener = event => {
      if (event.sessionId !== sessionId) return;
      const message = JSON.parse(event.message);
      if (message.id === id) message.error ? reject(new Error(message.error.message)) : done(message.result);
    };
    session.on('Target.receivedMessageFromTarget', listener);
  });
  try {
    await session.send('Target.sendMessageToTarget', { sessionId, message: JSON.stringify({ id, method, params }) });
    return await response;
  } finally { clearTimeout(timer); session.off('Target.receivedMessageFromTarget', listener); }
}

await validateManifest(resolve('dist/chromtag/browser'), { built: true });
// Chrome's test-only CDP loading uses a fresh temporary profile, never the user's profile.
const context = await chromium.launchPersistentContext('', {
  channel: 'chrome', headless: true, ignoreDefaultArgs: ['--disable-extensions'],
  args: ['--enable-unsafe-extension-debugging'],
});
context.setDefaultTimeout(10000);
context.setDefaultNavigationTimeout(10000);
try {
  const browser = context.browser();
  await context.route('https://example.invalid/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Test destination</title>' }));
  await context.route('https://other.invalid/**', route => route.fulfill({ contentType: 'text/html', body: '<title>New origin without grant</title>' }));
  console.log(`Stable Chrome: ${browser.version()}`);
  const session = await browser.newBrowserCDPSession();
  const { id } = await session.send('Extensions.loadUnpacked', { path: resolve('dist/chromtag/browser') });
  const page = await context.newPage();
  await page.addInitScript(() => {
    const getTree = chrome.bookmarks.getTree.bind(chrome.bookmarks);
    globalThis.treeReads = 0;
    chrome.bookmarks.getTree = (...args) => { globalThis.treeReads++; return getTree(...args); };
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(`chrome-extension://${id}/index.html`);
  await page.getByText('No bookmarks yet.', { exact: true }).waitFor();
  await page.evaluate(async () => {
    const folder = await chrome.bookmarks.create({ title: '<Folder> café' });
    const nested = await chrome.bookmarks.create({ parentId: folder.id, title: 'Nested' });
    await chrome.bookmarks.create({ parentId: nested.id, title: '<b>Saved page</b> #C++', url: 'https://example.invalid/test' });
    await chrome.bookmarks.create({ title: 'Excluded javascript bookmark #excluded', url: 'javascript:alert(1)' });
  });
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await page.getByRole('button', { name: '<b>Saved page</b>', exact: true }).waitFor();
  assert.equal(await page.locator('label.search').count(), 0);
  assert.equal(await page.getByRole('searchbox', { name: 'Search bookmarks' }).getAttribute('placeholder'), 'Search...');
  const cloudLayout = await page.locator('.filter-cloud').evaluate(cloud => {
    const folders = cloud.querySelectorAll(':scope > .folder');
    const lastFolder = folders[folders.length - 1];
    const firstTag = cloud.querySelector(':scope > .tag');
    return { adjacent: lastFolder.nextElementSibling === firstTag, sameLine: lastFolder.offsetTop === firstTag.offsetTop,
      folderColor: getComputedStyle(lastFolder).backgroundColor, tagColor: getComputedStyle(firstTag).backgroundColor };
  });
  assert(cloudLayout.adjacent && cloudLayout.sameLine, 'Last folder and first tag share a wrapping flow and available line');
  assert.equal(cloudLayout.folderColor, 'rgb(76, 175, 80)');
  assert.equal(cloudLayout.tagColor, 'rgb(68, 138, 255)');
  await screenshot(page, 'popup');
  assert.equal(await page.locator('article b').count(), 0, 'Bookmark markup must remain literal text');
  assert.equal(await page.getByRole('button', { name: 'Excluded javascript bookmark', exact: true }).count(), 0);
  assert.equal(await page.getByRole('button', { name: '#excluded', exact: true }).count(), 0);
  const opened = context.waitForEvent('page');
  await page.getByRole('button', { name: '<b>Saved page</b>', exact: true }).click();
  const tab = await opened;
  await tab.waitForURL('https://example.invalid/test');
  await tab.close();
  await page.evaluate(async () => {
    await Promise.all(Array.from({ length: 112 }, (_, index) => chrome.bookmarks.create({ title: `Folder ${index} — long Unicode 中文 café` })));
    for (let batch = 0; batch < 40; batch++) {
      await Promise.all(Array.from({ length: 250 }, (_, index) => {
        const number = batch * 250 + index;
        return chrome.bookmarks.create({ title: `Scale bookmark ${number}${number === 5000 ? ' Long title <script> 中文 café '.repeat(20) : ''} #scale #tag${number % 128}`, url: `https://example.invalid/scale/${number}${number === 5000 ? '/long'.repeat(200) : ''}` });
      }));
    }
  });
  const started = performance.now();
  await page.reload();
  await page.getByRole('button', { name: 'Scale bookmark 0', exact: true }).waitFor();
  const elapsed = performance.now() - started;
  const liveRows = await page.locator('article.bookmark').count();
  assert(liveRows > 0 && liveRows <= 24, `10,001 records must have bounded live rows, saw ${liveRows}`);
  await page.getByRole('button', { name: '#C++', exact: true }).click();
  await page.getByText('1 of 10001 bookmarks', { exact: true }).waitFor();
  await page.getByRole('button', { name: '#C++', exact: true }).click();
  await page.getByText('10001 of 10001 bookmarks', { exact: true }).waitFor();
  await page.getByRole('button', { name: '<Folder> café', exact: true }).click();
  await page.getByText('1 of 10001 bookmarks', { exact: true }).waitFor();
  await page.getByRole('button', { name: '<Folder> café', exact: true }).click();
  await page.getByText('10001 of 10001 bookmarks', { exact: true }).waitFor();
  await page.locator('cdk-virtual-scroll-viewport').evaluate(element => { element.scrollTop = element.scrollHeight; element.dispatchEvent(new Event('scroll')); });
  await page.getByRole('button', { name: 'Scale bookmark 9999', exact: true }).waitFor();
  assert(await page.locator('article.bookmark').count() <= 24);
  const search = page.getByRole('searchbox', { name: 'Search bookmarks' });
  const filterStart = performance.now();
  await search.fill('Scale bookmark 9999');
  await page.getByText('1 of 10001 bookmarks', { exact: true }).waitFor();
  console.log(`10,001-record filter including 150 ms debounce: ${(performance.now() - filterStart).toFixed(1)} ms.`);
  await search.fill('.*["');
  await page.getByText('No matching bookmarks.', { exact: true }).waitFor();
  await search.fill('example.invalid/scale/9999');
  await page.getByText('1 of 10001 bookmarks', { exact: true }).waitFor();
  await search.fill('example.invalid/scale/5000');
  await page.getByRole('button', { name: /^Scale bookmark 5000 /u }).waitFor();
  await checkBookmarkWidth(page);
  await search.fill('<b>Saved');
  await page.getByText('1 of 10001 bookmarks', { exact: true }).waitFor();
  await page.getByRole('button', { name: '#C++', exact: true }).click();
  await page.getByRole('button', { name: '<Folder> café', exact: true }).click();
  await page.getByRole('button', { name: 'Reset filter', exact: true }).click();
  await page.getByText('10001 of 10001 bookmarks', { exact: true }).waitFor();
  assert.equal(await search.inputValue(), '');
  assert.equal(await page.locator('.cloud [aria-pressed="true"]').count(), 0);
  await page.getByRole('button', { name: 'Hide folders', exact: true }).click();
  await page.locator('.filter-cloud > .folder').first().waitFor({ state: 'detached' });
  assert.equal(await page.locator('.filter-cloud > .folder').count(), 0);
  assert.equal(await page.evaluate(() => localStorage.length), 0);
  await page.reload();
  await page.getByRole('button', { name: 'Hide folders', exact: true }).waitFor();
  assert(await page.locator('.filter-cloud > .folder').count() > 1);
  const fullCloud = await page.locator('.filter-cloud').evaluate(cloud => ({
    height: cloud.clientHeight, scrollHeight: cloud.scrollHeight,
    overflow: getComputedStyle(cloud).overflowY, tags: cloud.querySelectorAll(':scope > .tag').length,
    sections: cloud.querySelectorAll('section').length,
  }));
  assert.equal(fullCloud.tags, 130);
  assert.equal(fullCloud.sections, 0);
  assert.equal(fullCloud.overflow, 'visible');
  assert(fullCloud.scrollHeight <= fullCloud.height + 1, 'The entire cloud wraps without internal scrolling or clipping');
  await page.locator('.filter-cloud > .tag').last().scrollIntoViewIfNeeded();
  assert(await page.locator('.filter-cloud > .tag').last().isVisible(), 'All tags remain reachable through popup scrolling');
  await screenshot(page, 'crowded');
  await page.locator('cdk-virtual-scroll-viewport').evaluate(element => { element.scrollTop = element.scrollHeight; element.dispatchEvent(new Event('scroll')); });
  await page.getByRole('button', { name: 'Edit Scale bookmark 9999', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Edit bookmark' });
  assert.equal(await dialog.getByLabel('Title', { exact: true }).inputValue(), 'Scale bookmark 9999 #scale #tag15');
  await page.waitForFunction(() => document.activeElement?.id === 'edit-title');
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press('Tab');
    assert(await dialog.evaluate(element => element.contains(document.activeElement)), 'Tab focus stays in the editor');
  }
  await screenshot(page, 'editor');
  await dialog.getByLabel('Title', { exact: true }).fill('Unsaved change');
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  await dialog.waitFor({ state: 'detached' });
  await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Edit Scale bookmark 9999');
  assert.equal(await page.evaluate(() => globalThis.treeReads), 1);
  await page.getByRole('button', { name: 'Edit Scale bookmark 9999', exact: true }).click();
  await dialog.waitFor();
  await dialog.getByLabel('Title', { exact: true }).focus();
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'detached' });
  await page.getByRole('button', { name: 'Edit Scale bookmark 9999', exact: true }).click();
  await dialog.getByLabel('Title', { exact: true }).fill('Discard through overlay');
  await page.locator('.overlay').click({ position: { x: 5, y: 5 } });
  await dialog.waitFor({ state: 'detached' });
  assert.equal(await page.evaluate(() => globalThis.treeReads), 1);
  await page.getByRole('button', { name: 'Edit Scale bookmark 9999', exact: true }).click();
  await dialog.getByLabel('Title', { exact: true }).fill('Edited <b>literal</b> #C++');
  await dialog.getByLabel('New tag', { exact: true }).fill('#中文');
  await dialog.getByRole('button', { name: 'Add tag', exact: true }).click();
  await dialog.getByLabel('URL', { exact: true }).fill('https://example.invalid/edited');
  const folderId = await page.evaluate(async () => (await chrome.bookmarks.search({ title: '<Folder> café' }))[0].id);
  await dialog.getByLabel('Folder', { exact: true }).selectOption(folderId);
  await dialog.getByRole('button', { name: 'Save', exact: true }).click();
  await dialog.waitFor({ state: 'detached' });
  assert.equal(await page.evaluate(() => globalThis.treeReads), 2, 'Successful save/move refreshes once');
  const saved = await page.evaluate(async () => (await chrome.bookmarks.search({ url: 'https://example.invalid/edited' }))[0]);
  assert.equal(saved.title, 'Edited <b>literal</b> #C++ #中文');
  assert.equal(saved.parentId, folderId);
  await page.locator('.filter-cloud').getByRole('button', { name: '#中文', exact: true }).waitFor();
  const manager = await context.newPage();
  await manager.goto(`chrome://bookmarks/?id=${folderId}`);
  await manager.getByText(saved.title, { exact: true }).waitFor();
  await manager.close();
  await page.bringToFront();
  console.log('PASS: saved and moved bookmark appears in Chrome Bookmark Manager.');
  await search.fill('example.invalid/edited');
  await page.getByText('1 of 10001 bookmarks', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Edit Edited <b>literal</b>', exact: true }).click();
  await dialog.getByRole('button', { name: 'Delete', exact: true }).click();
  await dialog.waitFor({ state: 'detached' });
  await page.getByText('0 of 10000 bookmarks', { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => globalThis.treeReads), 3, 'Successful delete refreshes once');
  assert.equal(await page.evaluate(async () => (await chrome.bookmarks.search({ url: 'https://example.invalid/edited' })).length), 0);
  await page.locator('.filter-cloud').getByRole('button', { name: '#中文', exact: true }).waitFor({ state: 'detached' });
  const activePage = await context.newPage();
  await activePage.goto('https://example.invalid/current');
  await activePage.bringToFront();
  await page.getByRole('button', { name: 'Add bookmark', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: 'Chrome did not provide' }).waitFor();
  assert.equal(await page.evaluate(async () => (await chrome.bookmarks.search({ url: 'https://example.invalid/current' })).length), 0, 'Missing grant must not create a bookmark');
  const { targetInfos } = await session.send('Target.getTargets', { filter: [{ type: 'tab', exclude: false }] });
  await session.send('Extensions.triggerAction', { id, targetId: targetInfos.find(target => target.url === activePage.url()).targetId });
  const mainTarget = await (await context.newCDPSession(page)).send('Target.getTargetInfo');
  let actionTarget;
  for (let attempt = 0; attempt < 100 && !actionTarget; attempt++) {
    actionTarget = (await session.send('Target.getTargets', { filter: [{}] })).targetInfos.find(target =>
      target.type === 'page' && target.url === page.url() && target.targetId !== mainTarget.targetInfo.targetId);
    if (!actionTarget) await new Promise(done => setTimeout(done, 50));
  }
  assert(actionTarget, 'The native extension action must open its registered popup');
  // Chrome's toolbar popup is a CDP target outside Playwright's normal tab list.
  const { sessionId } = await session.send('Target.attachToTarget', { targetId: actionTarget.targetId, flatten: false });
  const popupResult = await targetCommand(session, sessionId, 'Runtime.evaluate', {
    expression: `new Promise(done => { const check = () => document.querySelector('header') ? done({title: document.title, text: document.body.innerText, width: document.body.offsetWidth, height: document.body.offsetHeight}) : setTimeout(check, 10); check(); })`,
    awaitPromise: true, returnByValue: true,
  });
  assert.equal(popupResult.result.value.title, 'Chromtag');
  assert(popupResult.result.value.text.includes('Add bookmark'));
  assert.equal(popupResult.result.value.width, 540);
  assert.equal(popupResult.result.value.height, 540);
  await session.send('Target.detachFromTarget', { sessionId });
  console.log('PASS: native extension action rendered its registered 540 × 540 popup.');
  await activePage.bringToFront();
  await page.getByRole('button', { name: 'Add bookmark', exact: true }).click();
  await dialog.waitFor();
  assert.equal(await dialog.getByLabel('Title', { exact: true }).inputValue(), 'Test destination');
  assert.equal(await dialog.getByLabel('URL', { exact: true }).inputValue(), 'https://example.invalid/current');
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  await dialog.waitFor({ state: 'detached' });
  const added = await page.evaluate(async () => (await chrome.bookmarks.search({ url: 'https://example.invalid/current' }))[0]);
  assert(added.parentId, 'Chrome selected the default folder');
  assert.equal(added.title, 'Test destination', 'Cancel must retain the already created bookmark');
  assert.equal(await page.evaluate(() => globalThis.treeReads), 4, 'Add refreshes the tree once');
  await activePage.goto('https://other.invalid/revoked');
  await activePage.bringToFront();
  await page.getByRole('button', { name: 'Add bookmark', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: 'Chrome did not provide' }).waitFor();
  assert.equal(await page.evaluate(async () => (await chrome.bookmarks.search({ url: 'https://other.invalid/revoked' })).length), 0);
  assert.equal(await page.evaluate(() => globalThis.treeReads), 4, 'Revoked grant must not mutate or refresh');
  await activePage.close();
  await page.getByRole('button', { name: 'Reset filter', exact: true }).click();
  await page.getByText('10001 of 10001 bookmarks', { exact: true }).waitFor();
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--base-font-size', '16px');
    document.documentElement.style.setProperty('--popup-width', '380px');
    document.documentElement.style.setProperty('--popup-height', '500px');
  });
  await page.waitForFunction(() => Math.abs(document.querySelector('article.bookmark')?.getBoundingClientRect().height - 112) < 1);
  await search.fill('example.invalid/scale/5000');
  await page.getByText('1 of 10001 bookmarks', { exact: true }).waitFor();
  await checkBookmarkWidth(page);
  await page.locator('article.bookmark .edit').click();
  await dialog.waitFor();
  await dialog.getByLabel('Title', { exact: true }).fill('Long editable title 中文 café <b>literal</b> '.repeat(20));
  await screenshot(page, 'scaled');
  assert(await page.evaluate(() => document.body.scrollWidth <= document.body.clientWidth), 'No horizontal body overflow at scaled dimensions');
  assert(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth), 'Editor content must fit its width');
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  await dialog.waitFor({ state: 'detached' });
  assert(await page.locator('article.bookmark').count() <= 24, 'Font scaling keeps virtual rows bounded');
  console.log('PASS: crowded 112-folder/130-tag clouds, long title/URL, keyboard trap/restore/Escape, CSS font/dimension scaling, and editor overflow.');
  console.log('PASS: label-free Search... input, joined flowing cloud without internal scrolling, requested green/blue colors, full-width CSS-truncated articles, and always-visible Edit at both sizes.');
  console.log('PASS: activeTab missing-grant rejection and real action grant, default-folder creation, editor population, and cancel retaining creation.');
  console.log(`10,001 supported native synthetic bookmarks: startup ${elapsed.toFixed(1)} ms, ${liveRows} live rows; last row reached.`);
  assert.deepEqual(errors, [], 'No runtime or CSP errors');
  console.log('PASS: loadable extension, native bookmark snapshot, literal rendering, new-tab navigation, no runtime/CSP errors.');
} finally {
  await context.close();
}
