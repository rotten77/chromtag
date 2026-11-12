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
async function clickEdit(button) {
  await button.locator('..').hover();
  await button.click();
}
async function filterPage(page, name) {
  const status = page.locator('.cloud-paging span');
  const previous = await status.textContent();
  await page.getByRole('button', { name, exact: true }).click();
  await page.waitForFunction(text => document.querySelector('.cloud-paging span')?.textContent !== text, previous);
  await page.locator('.filter-cloud[aria-busy="false"]').waitFor();
}
async function findFilter(page, name) {
  const choice = page.locator('.filter-cloud').getByRole('button', { name, exact: true });
  await page.locator('.filter-cloud[aria-busy="false"]').waitFor();
  if (await choice.isVisible()) return choice;
  const first = page.getByRole('button', { name: 'First filters', exact: true });
  if (await first.isVisible() && await first.isEnabled()) await filterPage(page, 'First filters');
  for (let attempt = 0; attempt < 1000; attempt++) {
    if (await choice.isVisible()) return choice;
    const more = page.getByRole('button', { name: 'More filters', exact: true });
    assert(await more.isVisible() && await more.isEnabled(), `Filter must remain reachable: ${name}`);
    await filterPage(page, 'More filters');
  }
  throw new Error(`Filter paging did not finish: ${name}`);
}
async function checkFixedLayout(page) {
  const fixedBounds = () => page.evaluate(() => ['header', '.search-field', 'app-filter-cloud', 'footer'].map(selector => {
    const rect = document.querySelector(selector).getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom };
  }));
  const viewport = page.locator('cdk-virtual-scroll-viewport');
  await viewport.evaluate(element => { element.scrollTop = 0; element.dispatchEvent(new Event('scroll')); });
  const before = await fixedBounds();
  assert(await viewport.isVisible(), 'Bookmark list remains visible at this popup size');
  const listBorder = await page.locator('app-bookmark-list').evaluate(element => {
    const style = getComputedStyle(element);
    return { width: style.borderTopWidth, color: style.borderTopColor, expected: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() };
  });
  assert.equal(listBorder.width, '1px', 'Bookmark list has a top separator');
  assert.equal(listBorder.color, await page.evaluate(color => { const probe = document.createElement('span'); probe.style.color = color; document.body.append(probe); const value = getComputedStyle(probe).color; probe.remove(); return value; }, listBorder.expected), 'Separator uses --border-color');
  await viewport.hover();
  await page.mouse.wheel(0, 900);
  await page.waitForFunction(() => document.querySelector('cdk-virtual-scroll-viewport').scrollTop > 0);
  assert.deepEqual(await fixedBounds(), before, 'Search, cloud, header, and toolbar stay stationary when the list scrolls');
  const scrollable = await page.evaluate(() => [...document.querySelectorAll('body, .popup-content, .filter-cloud, cdk-virtual-scroll-viewport')]
    .filter(element => /auto|scroll/u.test(getComputedStyle(element).overflowY) && element.scrollHeight > element.clientHeight + 1)
    .map(element => element.tagName));
  assert.deepEqual(scrollable, ['CDK-VIRTUAL-SCROLL-VIEWPORT'], 'Only the bookmark-list area scrolls');
  assert(await page.locator('.popup-content').evaluate(element => element.scrollHeight <= element.clientHeight + 1), 'The popup content fits its fixed height');
}
async function checkRowSpacing(page) {
  const spacing = await page.locator('article.bookmark').first().evaluate(row => {
    const url = row.querySelector('.url');
    const labels = row.querySelector('.labels');
    const lastContentBottom = Math.max(url.getBoundingClientRect().bottom, labels.getBoundingClientRect().bottom);
    const bounds = row.getBoundingClientRect();
    return { height: bounds.height, bottomGap: bounds.bottom - lastContentBottom, topPadding: parseFloat(getComputedStyle(row).paddingTop) };
  });
  assert(spacing.bottomGap >= spacing.topPadding - 1 && spacing.bottomGap <= spacing.topPadding + 4,
    `Row bottom spacing matches top padding: ${JSON.stringify(spacing)}`);
}
async function checkBookmarkWidth(page) {
  const viewport = page.locator('cdk-virtual-scroll-viewport');
  await viewport.scrollIntoViewIfNeeded();
  await viewport.locator('article').first().hover();
  const layout = await viewport.evaluate(element => {
    const row = element.querySelector('article');
    const edit = row.querySelector('.edit');
    const title = row.querySelector('.title');
    const url = row.querySelector('.url');
    const labels = row.querySelector('.labels');
    const fontRatio = parseFloat(getComputedStyle(url).fontSize) / parseFloat(getComputedStyle(title).fontSize);
    const labelRatio = parseFloat(getComputedStyle(labels).fontSize) / parseFloat(getComputedStyle(title).fontSize);
    const badges = [...labels.querySelectorAll('.tag, .folder')].map(badge => ({
      kind: badge.className, fontSize: parseFloat(getComputedStyle(badge).fontSize), background: getComputedStyle(badge).backgroundColor,
    }));
    const bounds = node => ({ left: node.getBoundingClientRect().left, right: node.getBoundingClientRect().right });
    return { fontRatio, labelRatio, badges, urlFontSize: parseFloat(getComputedStyle(url).fontSize), width: element.clientWidth, scrollWidth: element.scrollWidth, viewport: bounds(element), row: bounds(row), edit: bounds(edit), title: bounds(title), titleTruncated: title.scrollWidth > title.clientWidth, urlTruncated: url.scrollWidth > url.clientWidth };
  });
  assert.equal(layout.scrollWidth, layout.width, 'Long bookmarks must not widen the viewport');
  assert(Math.abs(layout.fontRatio - .8) < .001, 'URL text stays at 80% of the title size');
  assert(Math.abs(layout.labelRatio - .8) < .001, 'Row labels stay at 80% of the title size');
  assert(layout.badges.some(badge => badge.kind === 'folder') && layout.badges.some(badge => badge.kind === 'tag'), 'Check both folder and tag row badges');
  for (const badge of layout.badges) {
    assert(Math.abs(badge.fontSize - layout.urlFontSize) < .001, `${badge.kind} badge matches the URL font size`);
    assert.equal(badge.background, 'rgb(158, 158, 158)', `${badge.kind} badge uses #9E9E9E`);
  }
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
  await checkRowSpacing(page);
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
  const title = page.getByRole('button', { name: '<b>Saved page</b>', exact: true });
  const edit = page.getByRole('button', { name: 'Edit <b>Saved page</b>', exact: true });
  await page.mouse.move(20, 20);
  assert.equal(await edit.evaluate(element => getComputedStyle(element).opacity), '0', 'Edit is hidden when its row is not hovered or focused');
  const rowBounds = await title.locator('..').boundingBox();
  await title.hover();
  assert(await title.evaluate(element => getComputedStyle(element).textDecorationLine.includes('underline')));
  assert.equal(await title.evaluate(element => getComputedStyle(element).color), 'rgb(68, 138, 255)', 'Hovered title uses the tag color');
  assert.equal(await title.evaluate(element => getComputedStyle(element).filter), 'none', 'Title hover preserves the exact tag color');
  assert.equal(await edit.evaluate(element => getComputedStyle(element).opacity), '1', 'Row hover reveals Edit');
  assert.deepEqual(await title.locator('..').boundingBox(), rowBounds, 'Revealing Edit does not shift the row');
  await page.mouse.move(20, 20);
  await title.focus();
  await page.keyboard.press('Tab');
  assert(await edit.evaluate(element => document.activeElement === element && getComputedStyle(element).opacity === '1'), 'Tab focus reveals Edit without mouse hover');
  await page.keyboard.press('Enter');
  await page.getByRole('dialog', { name: 'Edit bookmark' }).waitFor();
  assert.equal(await page.locator('.editor').evaluate(element => getComputedStyle(element).boxShadow), 'none', 'Editor has no shadow');
  await page.getByRole('dialog').getByLabel('Title', { exact: true }).focus();
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({ state: 'detached' });
  await page.getByRole('searchbox', { name: 'Search bookmarks' }).focus();
  for (const label of ['#C++', '<Folder> café']) {
    const choice = await findFilter(page, label);
    await choice.click();
    await page.locator('.filter-cloud .active').waitFor();
    await page.mouse.move(20, 20);
    assert.equal(await choice.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(244, 67, 54)', 'Selected cloud label uses #F44336');
    assert.equal(await choice.evaluate(element => getComputedStyle(element).boxShadow), 'none', 'Selected cloud label has no shadow');
    await choice.hover();
    assert.equal(await choice.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(33, 33, 33)', 'Hovered cloud label uses #212121');
    await choice.click();
    await page.mouse.move(20, 20);
  }
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
  await page.reload({ waitUntil: 'commit' });
  const progress = await page.evaluate(() => new Promise((resolve, reject) => {
    const deadline = performance.now() + 10000;
    const poll = () => {
      const element = document.querySelector('.loading-progress');
      const text = element?.textContent;
      if (text?.includes('Processing bookmarks and hashtags:') && /\d+\/10002/u.test(text)) {
        requestAnimationFrame(() => requestAnimationFrame(() => {
          const current = document.querySelector('.loading-progress');
          if (current) resolve(current.textContent);
          else reject(new Error('Progress disappeared before capture'));
        }));
      } else if (performance.now() < deadline) setTimeout(poll, 0);
      else reject(new Error('Did not observe processing progress'));
    };
    poll();
  }));
  assert.match(progress, /Processing bookmarks and hashtags: \d+\/10002/u, 'Progress counts all URL nodes, including excluded javascript: bookmarks');
  assert.match(progress, /10,001 synthetic bookmarks/u, 'Large-library guidance cites measured synthetic evidence');
  await screenshot(page, 'processing-progress');
  await page.getByRole('button', { name: 'Scale bookmark 0', exact: true }).waitFor();
  await page.locator('.loading-progress').waitFor({ state: 'detached' });
  assert.equal(await page.evaluate(() => globalThis.treeReads), 1, 'Initial large popup reads one tree');
  const elapsed = performance.now() - started;
  const liveRows = await page.locator('article.bookmark').count();
  assert(liveRows > 0 && liveRows <= 24, `10,001 records must have bounded live rows, saw ${liveRows}`);
  await (await findFilter(page, '#C++')).click();
  await page.getByText('1 of 10001 bookmarks', { exact: true }).waitFor();
  await (await findFilter(page, '#C++')).click();
  await page.getByText('10001 of 10001 bookmarks', { exact: true }).waitFor();
  await (await findFilter(page, '<Folder> café')).click();
  await page.getByText('1 of 10001 bookmarks', { exact: true }).waitFor();
  await (await findFilter(page, '<Folder> café')).click();
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
  await (await findFilter(page, '#C++')).click();
  await (await findFilter(page, '<Folder> café')).click();
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
  await page.getByText('10001 of 10001 bookmarks', { exact: true }).waitFor();
  assert(await page.locator('.filter-cloud > .folder').count() > 1);
  await page.locator('.filter-cloud[aria-busy="false"]').waitFor();
  const fullCloud = await page.locator('.filter-cloud').evaluate(cloud => ({
    height: cloud.clientHeight, scrollHeight: cloud.scrollHeight,
    overflow: getComputedStyle(cloud).overflowY, tags: cloud.querySelectorAll(':scope > .tag').length,
    sections: cloud.querySelectorAll('section').length,
  }));
  assert.equal(fullCloud.tags, 130);
  assert.equal(fullCloud.sections, 0);
  assert.equal(fullCloud.overflow, 'hidden');
  assert(fullCloud.scrollHeight > fullCloud.height, 'Excess cloud labels collapse without a scrollbar');
  const pagingPosition = await page.evaluate(() => {
    const nav = document.querySelector('app-filter-cloud .cloud-paging').getBoundingClientRect();
    const cloud = document.querySelector('.filter-cloud').getBoundingClientRect();
    return { navBottom: nav.bottom, cloudTop: cloud.top };
  });
  assert(pagingPosition.navBottom <= pagingPosition.cloudTop + 1, 'Paging controls stay above the filter choices');
  for (const name of ['First filters', 'Previous filters']) {
    const button = page.getByRole('button', { name, exact: true });
    assert.equal(await button.isDisabled(), true, `${name} is disabled on the first page`);
    assert.equal(await button.evaluate(element => getComputedStyle(element).cursor), 'default', `${name} keeps the standard cursor when disabled`);
  }
  const reached = new Set();
  do {
    for (const label of await page.locator('.filter-cloud button:not([inert])').allTextContents()) reached.add(label);
    const more = page.getByRole('button', { name: 'More filters', exact: true });
    if (!await more.isEnabled()) break;
    await filterPage(page, 'More filters');
  } while (true);
  assert.equal([...reached].filter(label => label.startsWith('#')).length, 130, 'All 130 collapsed tags remain reachable by pagination');
  assert.equal(reached.size, 246, 'All 116 folders and 130 tags remain reachable');
  await filterPage(page, 'Previous filters');
  await filterPage(page, 'First filters');
  const firstPage = await page.evaluate(() => {
    const cloud = document.querySelector('.filter-cloud');
    const shown = [...cloud.querySelectorAll('button:not([inert])')];
    const last = shown.at(-1)?.getBoundingClientRect();
    const bounds = cloud.getBoundingClientRect();
    return { lastBottom: last?.bottom, cloudBottom: bounds.bottom, cloudHeight: bounds.height, listHeight: document.querySelector('cdk-virtual-scroll-viewport').getBoundingClientRect().height };
  });
  assert(firstPage.cloudBottom - firstPage.lastBottom < 40, 'First filter page leaves no large blank area below the choices');
  assert(firstPage.listHeight > 0, 'Bookmark list stays visible below the filter cloud');
  await checkFixedLayout(page);
  await screenshot(page, 'crowded');
  await page.locator('cdk-virtual-scroll-viewport').evaluate(element => { element.scrollTop = element.scrollHeight; element.dispatchEvent(new Event('scroll')); });
  await clickEdit(page.getByRole('button', { name: 'Edit Scale bookmark 9999', exact: true }));
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
  await clickEdit(page.getByRole('button', { name: 'Edit Scale bookmark 9999', exact: true }));
  await dialog.waitFor();
  await dialog.getByLabel('Title', { exact: true }).focus();
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'detached' });
  await clickEdit(page.getByRole('button', { name: 'Edit Scale bookmark 9999', exact: true }));
  await dialog.getByLabel('Title', { exact: true }).fill('Discard through overlay');
  await page.locator('.overlay').click({ position: { x: 5, y: 5 } });
  await dialog.waitFor({ state: 'detached' });
  assert.equal(await page.evaluate(() => globalThis.treeReads), 1);
  await clickEdit(page.getByRole('button', { name: 'Edit Scale bookmark 9999', exact: true }));
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
  await (await findFilter(page, '#中文')).waitFor();
  const manager = await context.newPage();
  await manager.goto(`chrome://bookmarks/?id=${folderId}`);
  await manager.getByText(saved.title, { exact: true }).waitFor();
  await manager.close();
  await page.bringToFront();
  console.log('PASS: saved and moved bookmark appears in Chrome Bookmark Manager.');
  await search.fill('example.invalid/edited');
  await page.getByText('1 of 10001 bookmarks', { exact: true }).waitFor();
  await clickEdit(page.getByRole('button', { name: 'Edit Edited <b>literal</b>', exact: true }));
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
  assert.equal(popupResult.result.value.height, 580);
  await session.send('Target.detachFromTarget', { sessionId });
  console.log('PASS: native extension action rendered its registered 540 × 580 popup.');
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
  await page.waitForFunction(() => Math.abs(document.querySelector('article.bookmark')?.getBoundingClientRect().height - 89.6) < 1);
  await search.fill('example.invalid/scale/5000');
  await page.getByText('1 of 10001 bookmarks', { exact: true }).waitFor();
  await checkRowSpacing(page);
  await search.fill('');
  await page.getByText('10001 of 10001 bookmarks', { exact: true }).waitFor();
  await checkFixedLayout(page);
  await search.fill('example.invalid/scale/5000');
  await page.getByText('1 of 10001 bookmarks', { exact: true }).waitFor();
  await checkBookmarkWidth(page);
  await clickEdit(page.locator('article.bookmark .edit'));
  await dialog.waitFor();
  await dialog.getByLabel('Title', { exact: true }).fill('Long editable title 中文 café <b>literal</b> '.repeat(20));
  await screenshot(page, 'scaled');
  assert(await page.evaluate(() => document.body.scrollWidth <= document.body.clientWidth), 'No horizontal body overflow at scaled dimensions');
  assert(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth), 'Editor content must fit its width');
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  await dialog.waitFor({ state: 'detached' });
  assert(await page.locator('article.bookmark').count() <= 24, 'Font scaling keeps virtual rows bounded');
  console.log('PASS: crowded 112-folder/130-tag clouds, long title/URL, keyboard trap/restore/Escape, CSS font/dimension scaling, and editor overflow.');
  console.log('PASS: label-free Search... input, fixed cloud with reachable collapsed pages, requested default/selected/hover colors, full-width CSS-truncated articles, and Edit revealed by row hover or keyboard focus without layout shift.');
  console.log('PASS: activeTab missing-grant rejection and real action grant, default-folder creation, editor population, and cancel retaining creation.');
  console.log(`10,001 supported native synthetic bookmarks: startup ${elapsed.toFixed(1)} ms, ${liveRows} live rows; last row reached.`);
  assert.deepEqual(errors, [], 'No runtime or CSP errors');
  console.log('PASS: loadable extension, native bookmark snapshot, literal rendering, new-tab navigation, no runtime/CSP errors.');
} finally {
  await context.close();
}
