import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { resolve } from 'node:path';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
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
    const more = page.getByRole('button', { name: 'Next filters', exact: true });
    assert(await more.isVisible() && await more.isEnabled(), `Filter must remain reachable: ${name}`);
    await filterPage(page, 'Next filters');
  }
  throw new Error(`Filter paging did not finish: ${name}`);
}
async function checkFixedLayout(page) {
  const fixedBounds = () => page.evaluate(() => ['.filter-heading', '.search-field', 'app-filter-cloud'].map(selector => {
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
  assert.deepEqual(await fixedBounds(), before, 'Search, cloud, and top actions stay stationary when the list scrolls');
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
      kind: badge.className, fontSize: parseFloat(getComputedStyle(badge).fontSize), background: getComputedStyle(badge).backgroundColor, color: getComputedStyle(badge).color,
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
    assert.equal(badge.color, 'rgb(33, 33, 33)', `${badge.kind} badge uses readable dark text`);
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
const profile = await mkdtemp(resolve(tmpdir(), 'chromtag-test-'));
const launch = () => chromium.launchPersistentContext(profile, {
  channel: 'chrome', headless: true, ignoreDefaultArgs: ['--disable-extensions'],
  args: ['--enable-unsafe-extension-debugging'],
});
let context = await launch();
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
  assert.equal(await page.locator('.popup-content header, .popup-content footer, [aria-label="Close popup"]').count(), 0);
  assert(await page.locator('.filter-heading').getByRole('button', { name: 'Add bookmark' }).isVisible());
  assert(await page.getByRole('searchbox', { name: 'Search bookmarks' }).evaluate(input => document.activeElement === input));
  await page.keyboard.press('Tab');
  assert(await page.getByRole('searchbox', { name: 'Search bookmarks' }).evaluate(input => document.activeElement !== input), 'Tab leaves initially focused search');
  const options = page.getByRole('button', { name: 'Options', exact: true });
  const showFolders = page.getByRole('checkbox', { name: 'Show folders', exact: true });
  assert.equal(await showFolders.isVisible(), false);
  await options.click();
  const optionsDialog = page.getByRole('dialog', { name: 'Options', exact: true });
  assert(await optionsDialog.evaluate(el => {
    const panel = el.getBoundingClientRect(), popup = document.body.getBoundingClientRect();
    return el.matches(':modal') && panel.width > popup.width * .85 && Math.abs(panel.left + panel.width / 2 - popup.width / 2) < 1 && Math.abs(panel.top + panel.height / 2 - popup.height / 2) < 1;
  }), 'Options is a wide modal centered in the popup');
  assert(await optionsDialog.locator('.click-settings-section').evaluate(section => {
    const firstLabel = section.querySelector('label');
    return getComputedStyle(section).borderTopWidth === '1px' &&
      getComputedStyle(section.querySelector('fieldset')).borderTopWidth === '0px' &&
      section.getBoundingClientRect().top < firstLabel.getBoundingClientRect().top &&
      !section.querySelector('legend') &&
      getComputedStyle(section.querySelectorAll('label')[1]).borderTopWidth === '1px';
  }), 'Click-option rows have the same thin separators as the preceding options');
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await page.getByRole('button', { name: '<b>Saved page</b>', exact: true }).waitFor();
  await checkRowSpacing(page);
  assert.equal(await page.locator('label.search').count(), 0);
  assert.equal(await page.getByRole('searchbox', { name: 'Search bookmarks' }).getAttribute('placeholder'), 'Search bookmarks…');

  assert(await page.locator('.filter-cloud').evaluate(cloud => cloud.getBoundingClientRect().bottom <= document.querySelector('.search-field').getBoundingClientRect().top), 'Cloud precedes secondary search');
  const cloudLayout = await page.locator('.filter-cloud').evaluate(cloud => {
    const folders = cloud.querySelectorAll(':scope > .folder');
    const lastFolder = folders[folders.length - 1];
    const firstTag = cloud.querySelector(':scope > .tag');
    return { adjacent: lastFolder.nextElementSibling === firstTag, sameLine: lastFolder.offsetTop === firstTag.offsetTop,
      folderColor: getComputedStyle(lastFolder).backgroundColor, tagColor: getComputedStyle(firstTag).backgroundColor };
  });
  assert(cloudLayout.adjacent && cloudLayout.sameLine, 'Last folder and first tag share a wrapping flow and available line');
  assert.equal(cloudLayout.folderColor, 'rgb(46, 125, 50)');
  assert.equal(cloudLayout.tagColor, 'rgb(25, 118, 210)');
  assert.equal(await page.getByRole('navigation', { name: 'Filter pages' }).count(), 0, 'Hide pagination when every filter fits');
  const title = page.getByRole('button', { name: '<b>Saved page</b>', exact: true });
  const edit = page.getByRole('button', { name: 'Edit <b>Saved page</b>', exact: true });
  await page.mouse.move(20, 20);
  assert.equal(await edit.evaluate(element => getComputedStyle(element).opacity), '0', 'Edit is hidden when its row is not hovered or focused');
  const rowBounds = await title.locator('..').boundingBox();
  await title.hover();
  assert(await title.evaluate(element => getComputedStyle(element).textDecorationLine.includes('underline')));
  assert.equal(await title.evaluate(element => getComputedStyle(element).color), cloudLayout.tagColor, 'Hovered title uses the tag color');
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
    assert.equal(await choice.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(211, 47, 47)', 'Selected cloud label uses #D32F2F');
    assert.equal(await choice.getAttribute('aria-pressed'), 'true');
    assert.equal(await choice.evaluate(element => getComputedStyle(element).color), 'rgb(255, 255, 255)');
    assert.equal(await choice.evaluate(element => getComputedStyle(element).fontWeight), '600');
    assert.equal(await choice.evaluate(element => getComputedStyle(element, '::before').content), 'none', 'Selected cloud label has no tick');
    assert.equal(await choice.evaluate(element => getComputedStyle(element).boxShadow), 'none', 'Selected cloud label has no shadow');
    await choice.hover();
    assert.equal(await choice.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(33, 33, 33)', 'Hovered cloud label uses #212121');
    assert.equal(await choice.evaluate(element => getComputedStyle(element).color), 'rgb(255, 255, 255)', 'Hovered cloud label remains readable');
    await choice.click();
    await page.mouse.move(20, 20);
  }
  await screenshot(page, 'popup');
  assert.equal(await page.locator('article b').count(), 0, 'Bookmark markup must remain literal text');
  assert.equal(await page.getByRole('button', { name: 'Excluded javascript bookmark', exact: true }).count(), 0);
  assert.equal(await page.getByRole('button', { name: '#excluded', exact: true }).count(), 0);
  await options.click();
  const clickTarget = page.getByRole('checkbox', { name: 'Open bookmarks in new tab' });
  assert.equal(await clickTarget.isChecked(), false);
  const closeAfterOpen = page.getByRole('checkbox', { name: 'Close popup after opening a bookmark' });
  assert(await closeAfterOpen.isChecked());
  await clickTarget.check();
  await closeAfterOpen.uncheck();
  await page.getByRole('button', { name: 'Done' }).click();
  const opened = context.waitForEvent('page');
  await page.getByRole('button', { name: '<b>Saved page</b>', exact: true }).click();
  const tab = await opened;
  // Chrome may defer loading inactive tabs; activate only after checking background creation.
  assert.equal(await page.evaluate(() => document.hasFocus()), true);
  await tab.bringToFront();
  await tab.waitForURL('https://example.invalid/test', { waitUntil: 'commit' });
  await tab.close();
  await page.bringToFront();
  await page.evaluate(async () => {
    const [origin] = await chrome.tabs.query({ active: true, currentWindow: true });
    const before = new Set((await chrome.tabs.query({ windowId: origin.windowId })).map(tab => tab.id));
    const result = await chrome.runtime.sendMessage({ type: 'open-selected', target: 'new',
      urls: ['https://example.invalid/bulk-a', 'https://example.invalid/bulk-b', 'https://example.invalid/bulk-c'],
      tabId: origin.id, windowId: origin.windowId });
    const created = (await chrome.tabs.query({ windowId: origin.windowId })).filter(tab => !before.has(tab.id));
    if (result.failures || created.length !== 3 || created.some(tab => tab.active)) throw new Error('Native background bulk opening failed');
    await chrome.tabs.remove(created.map(tab => tab.id));
    const switched = await chrome.runtime.sendMessage({ type: 'open-selected', target: 'new', activate: true,
      urls: ['https://example.invalid/switch-first', 'https://example.invalid/switch-second'], tabId: origin.id, windowId: origin.windowId });
    const switchedTabs = (await chrome.tabs.query({ windowId: origin.windowId })).filter(tab => !before.has(tab.id));
    if (switched.failures || switchedTabs.length !== 2 || !switchedTabs[0].active || switchedTabs[1].active) throw new Error('Native first-selected activation failed');
    await chrome.tabs.update(origin.id, { active: true });
    await chrome.tabs.remove(switchedTabs.map(tab => tab.id));
  });
  await page.evaluate(async () => {
    await Promise.all(Array.from({ length: 112 }, (_, index) => chrome.bookmarks.create({ title: `Folder ${index} — long Unicode 中文 café` })));
    for (let batch = 0; batch < 40; batch++) {
      await Promise.all(Array.from({ length: 250 }, (_, index) => {
        const number = batch * 250 + index;
        return chrome.bookmarks.create({ title: `Scale bookmark ${number}${number === 5000 ? ' Long title <script> 中文 café '.repeat(20) : ''} #scale #tag${number % 128}`, url: `https://example.invalid/scale/${number}${number === 5000 ? '/long'.repeat(200) : ''}` });
      }));
    }
  });
  await page.evaluate(async () => {
    const a = await chrome.bookmarks.create({ title: 'Batch original', url: 'https://example.invalid/mutation-a' });
    const b = await chrome.bookmarks.create({ title: 'Unselected', url: 'https://example.invalid/mutation-b' });
    const folder = await chrome.bookmarks.create({ title: 'Bulk destination' });
    try {
      const result = await chrome.runtime.sendMessage({ type: 'bulk-change', operations: [
        { kind: 'title', id: a.id, title: 'Batch original #中文' },
        { kind: 'move', id: a.id, parentId: folder.id },
      ] });
      const [changed] = await chrome.bookmarks.get(a.id);
      const [untouched] = await chrome.bookmarks.get(b.id);
      if (result.changed !== 2 || result.failures || changed.title !== 'Batch original #中文' || changed.url !== a.url || changed.parentId !== folder.id || untouched.title !== b.title || untouched.parentId !== b.parentId) throw new Error('Native bulk mutation mismatch');
    } finally {
      await chrome.bookmarks.remove(a.id); await chrome.bookmarks.remove(b.id); await chrome.bookmarks.remove(folder.id);
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
  const actions = page.getByRole('button', { name: 'Bulk actions' });
  assert.equal(await actions.isDisabled(), false);
  await actions.click();
  assert.equal(await page.getByRole('button', { name: 'Select all', exact: true }).isEnabled(), true);
  for (const label of ['Deselect all', 'Invert selection', 'Open selected', 'Move to folder', 'Add tag', 'Remove tag']) {
    assert.equal(await page.getByRole('button', { name: label, exact: true }).isDisabled(), true, `${label} requires selection`);
  }
  assert.equal(await page.getByRole('button', { name: 'Open selected', exact: true }).evaluate(button => getComputedStyle(button).cursor), 'default');
  await page.getByRole('button', { name: 'Select all', exact: true }).click();
  await page.getByText('10001 selected', { exact: true }).waitFor();
  assert(await page.locator('article.bookmark').count() <= 24, 'Selecting all does not render every row');
  await actions.click();
  await page.getByRole('button', { name: 'Deselect all', exact: true }).click();
  await page.getByText('0 selected', { exact: true }).waitFor();
  assert.equal(await actions.isDisabled(), false);
  await page.getByRole('checkbox', { name: 'Select Scale bookmark 0', exact: true }).check();
  const tagOnLaterPage = await findFilter(page, '#C++');
  const pageRange = page.locator('.cloud-paging [role="status"]');
  const rangeBefore = await pageRange.innerText();
  const boundsBefore = await tagOnLaterPage.boundingBox();
  await tagOnLaterPage.click();
  await page.getByText('1 of 10001 bookmarks', { exact: true }).waitFor();
  await page.getByText('0 selected', { exact: true }).waitFor();
  assert.equal(await pageRange.innerText(), rangeBefore, 'Selecting a tag keeps the current filter page');
  assert.deepEqual(await tagOnLaterPage.boundingBox(), boundsBefore, 'Selected chip keeps its position');
  await tagOnLaterPage.click();
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
  await page.reload();
  await page.getByText('1 of 10001 bookmarks', { exact: true }).waitFor();
  assert.equal(await search.inputValue(), '<b>Saved');
  assert.equal(await page.locator('.filter-cloud [aria-pressed="true"]').count(), 1, 'Only the selected choice on the current page is rendered');
  assert.equal(await page.evaluate(() => globalThis.treeReads), 1);
  const snapshot = await page.evaluate(() => chrome.storage.session.get(null));
  assert.deepEqual(Object.keys(snapshot), ['sessionFilters']);
  assert.deepEqual(Object.keys(snapshot.sessionFilters).sort(), ['folderId', 'query', 'tags']);
  assert.deepEqual(snapshot.sessionFilters.tags, ['c++']);
  const clearOnOpen = page.getByRole('checkbox', { name: 'Clear filters on popup', exact: true });
  await options.click();
  assert.equal(await clearOnOpen.isChecked(), false, 'Clearing on open is opt-in');
  await clearOnOpen.check();
  await page.waitForFunction(async () => !(await chrome.storage.session.get('sessionFilters')).sessionFilters);
  assert.equal(await page.locator('.search-field').inputValue(), '<b>Saved', 'Opting out preserves the current view');
  await page.reload();
  await page.getByText('10001 of 10001 bookmarks', { exact: true }).waitFor();
  assert.equal(await search.inputValue(), '', 'Opening clears the previous search');
  await search.fill('Scale bookmark 9999');
  await options.click();
  assert.equal(await clearOnOpen.isChecked(), true);
  assert.deepEqual(await page.evaluate(() => chrome.storage.session.get(null)), {});
  await clearOnOpen.uncheck();
  await page.waitForFunction(async () => (await chrome.storage.session.get('sessionFilters')).sessionFilters?.query === 'Scale bookmark 9999');
  await optionsDialog.getByRole('button', {name:'Done'}).click();
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await page.getByText('10001 of 10001 bookmarks', { exact: true }).waitFor();
  assert.equal(await search.inputValue(), '');
  assert.equal(await page.locator('.cloud [aria-pressed="true"]').count(), 0);
  await options.click();
  await showFolders.uncheck();
  await page.keyboard.press('Escape');
  await showFolders.waitFor({ state: 'hidden' });
  await page.locator('.filter-cloud > .folder').first().waitFor({ state: 'detached' });
  assert.equal(await page.locator('.filter-cloud > .folder').count(), 0);
  assert.equal(await page.evaluate(() => localStorage.length), 0);
  await page.reload();
  await options.click();
  await page.waitForFunction(() => !document.querySelector('input[aria-controls="filter-cloud"]').disabled);
  assert.equal(await showFolders.isChecked(), false, 'Folder visibility survives reopening');
  await showFolders.check();
  await optionsDialog.getByRole('button', {name:'Done'}).click();
  await page.getByText('10001 of 10001 bookmarks', { exact: true }).waitFor();
  assert(await page.locator('.filter-cloud > .folder').count() > 1);
  await page.locator('.filter-cloud[aria-busy="false"]').waitFor();
  const fullCloud = await page.locator('.filter-cloud').evaluate(cloud => ({
    height: cloud.clientHeight, scrollHeight: cloud.scrollHeight,
    overflow: getComputedStyle(cloud).overflowY, tags: cloud.querySelectorAll(':scope > .tag').length,
    sections: cloud.querySelectorAll('section').length,
  }));
  assert(fullCloud.tags >= 0 && fullCloud.tags < 130, 'Only the current filter page is rendered');
  assert(await page.locator('.filter-cloud > button').count() <= 32, 'The cloud keeps a bounded rendered window');
  assert.equal(fullCloud.sections, 0);
  assert.equal(fullCloud.overflow, 'hidden');
  assert(fullCloud.scrollHeight <= fullCloud.height + 1, 'The cloud does not scroll or retain hidden pages');
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
    const live = await page.locator('.filter-cloud > button').count();
    assert(live <= 32, `Each page has bounded live buttons (saw ${live})`);
    for (const label of await page.locator('.filter-cloud > button').allTextContents()) reached.add(label);
    const more = page.getByRole('button', { name: 'Next filters', exact: true });
    if (!await more.isEnabled()) break;
    await filterPage(page, 'Next filters');
  } while (true);
  assert.equal([...reached].filter(label => label.startsWith('#')).length, 130, 'All 130 collapsed tags remain reachable by pagination');
  assert.equal(reached.size, 246, 'All 116 folders and 130 tags remain reachable');
  const lastRange = await pageRange.innerText();
  await page.getByRole('button', { name: 'Previous filters', exact: true }).focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(text => document.querySelector('.cloud-paging span')?.textContent !== text, lastRange);
  await page.locator('.filter-cloud[aria-busy="false"]').waitFor();
  assert(await page.locator('.filter-cloud > button').count() <= 32, 'Keyboard paging keeps a bounded page');
  await filterPage(page, 'First filters');
  const firstPage = await page.evaluate(() => {
    const cloud = document.querySelector('.filter-cloud');
    const shown = [...cloud.querySelectorAll('button')];
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
    expression: `new Promise(done => { const check = () => document.querySelector('.filter-heading') ? done({title: document.title, text: document.body.innerText, width: document.body.offsetWidth, height: document.body.offsetHeight, searchFocused: document.activeElement === document.querySelector('input[type="search"]'), selectionCollapsed: document.activeElement.selectionStart === document.activeElement.selectionEnd}) : setTimeout(check, 10); check(); })`,
    awaitPromise: true, returnByValue: true,
  });
  assert.equal(popupResult.result.value.title, 'Chromtag');
  assert(popupResult.result.value.text.includes('Add bookmark'));
  assert.equal(popupResult.result.value.searchFocused, true, 'Actual popup initially focuses Search');
  assert.equal(popupResult.result.value.selectionCollapsed, true, 'Initial focus does not select restored text');
  assert.equal(popupResult.result.value.width, 540);
  assert.equal(popupResult.result.value.height, 580);
  const lifetimeBookmark = await page.evaluate(() => chrome.bookmarks.create({ title: 'Lifetime start', url: 'https://example.invalid/lifetime' }));
  await targetCommand(session, sessionId, 'Runtime.evaluate', {
    expression: `void chrome.runtime.sendMessage({type:'bulk-change',operations:Array.from({length:200},(_,i)=>({kind:'title',id:${JSON.stringify(lifetimeBookmark.id)},title:'Lifetime '+i}))}).catch(()=>{})`,
  });
  // Wait for native evidence that the worker accepted the batch, then destroy the actual popup.
  await page.waitForFunction(async id => (await chrome.bookmarks.get(id))[0].title !== 'Lifetime start', lifetimeBookmark.id);
  await session.send('Target.closeTarget', { targetId: actionTarget.targetId });
  await page.waitForFunction(async id => (await chrome.bookmarks.get(id))[0].title === 'Lifetime 199', lifetimeBookmark.id);
  await page.evaluate(id => chrome.bookmarks.remove(id), lifetimeBookmark.id);
  console.log('PASS: native extension action rendered its registered 540 × 580 popup; accepted bulk writes finished after popup destruction.');
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
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
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
  console.log('PASS: cloud-first layout, compact secondary search, fixed cloud with reachable collapsed pages, requested default/selected/hover colors, full-width CSS-truncated articles, and Edit revealed by row hover or keyboard focus without layout shift.');
  console.log('PASS: activeTab missing-grant rejection and real action grant, default-folder creation, editor population, and cancel retaining creation.');
  console.log(`10,001 supported native synthetic bookmarks: startup ${elapsed.toFixed(1)} ms, ${liveRows} live rows; last row reached.`);
  assert.deepEqual(errors, [], 'No runtime or CSP errors');
  console.log('PASS: loadable extension, native bookmark snapshot, literal rendering, new-tab navigation, no runtime/CSP errors.');
  await options.click();
  await showFolders.uncheck();
  await clearOnOpen.check();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await options.click();
  assert.equal(await showFolders.isChecked(), false, 'Neither opt-out nor Clear filters changes visibility');
  await clearOnOpen.uncheck();
  await page.keyboard.press('Escape');
  await search.fill('example.invalid/scale/5000');
  assert.deepEqual(await page.evaluate(() => chrome.storage.local.get(null)), { rememberFilters: true, showFolders: false, bookmarkClicks: { target: 'new', close: false, activate: false } });
  assert.equal(await page.evaluate(async () => (await chrome.storage.session.get('sessionFilters')).sessionFilters.query), 'example.invalid/scale/5000');
  await options.click();
  assert(await optionsDialog.getByRole('group', { name: 'Appearance', exact: true }).getByRole('spinbutton', { name: 'Popup width' }).isVisible(), 'Appearance controls are visible as soon as Options opens');
  const widthField = page.getByRole('spinbutton', {name:'Popup width'});
  const heightField = page.getByRole('spinbutton', {name:'Popup height'});
  const popupSize = optionsDialog.getByRole('group', {name:'Popup size'});
  assert.equal(await popupSize.locator('input').count(), 2);
  assert.equal((await widthField.boundingBox()).y, (await heightField.boundingBox()).y);
  assert(await popupSize.evaluate(group => {
    const label = group.querySelector('span');
    const inputs = [...group.querySelectorAll('input')];
    return label.textContent.trim() === 'Popup size:' && label.getBoundingClientRect().top < inputs[0].getBoundingClientRect().bottom && inputs[1].getBoundingClientRect().top < label.getBoundingClientRect().bottom;
  }), 'Popup size label and width × height fields share one row');
  await widthField.fill('380'); await widthField.press('Tab');
  await heightField.fill('400'); await heightField.press('Tab');
  await page.getByRole('slider', {name:'Font size'}).press('End');
  const ratio = page.getByRole('slider', {name:'Filter space'});
  await ratio.press('Home');
  const cloudHeight = () => page.locator('app-filter-cloud').evaluate(el => el.clientHeight);
  await page.waitForFunction(() => document.documentElement.style.getPropertyValue('--filter-share') === '0.2');
  await page.locator('.filter-cloud[aria-busy="false"]').waitFor();
  assert(await page.locator('.filter-cloud > button').count() <= 32, 'Small layout keeps cloud buttons bounded');
  const small = await cloudHeight();
  await ratio.press('End');
  await page.waitForFunction(() => document.documentElement.style.getPropertyValue('--filter-share') === '0.6');
  await page.locator('.filter-cloud[aria-busy="false"]').waitFor();
  assert(await page.locator('.filter-cloud > button').count() <= 32, 'Resized layout keeps cloud buttons bounded');
  assert(await cloudHeight() > small, `Cloud height must increase from ${small} (now ${await cloudHeight()})`);
  assert(await page.locator('cdk-virtual-scroll-viewport').evaluate(el => el.clientHeight > 0));
  const theme = page.getByLabel('Theme', {exact:true});
  const currentTheme = () => page.locator('html').getAttribute('data-theme');
  await page.emulateMedia({colorScheme:'dark'});
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  await theme.selectOption('light');
  await page.emulateMedia({colorScheme:'light'}); await page.emulateMedia({colorScheme:'dark'});
  assert.equal(await currentTheme(), 'light');
  await page.getByText('Light colors',{exact:true}).click();
  assert.equal(await page.getByRole('group',{name:'Color family'}).count(),0,'Palette buttons stay hidden until a property is opened');
  const lightTag = page.getByRole('button',{name:/^light tag color:/});
  await lightTag.click();
  const lightPicker = page.getByRole('dialog',{name:'light tag color picker'});
  assert(await lightPicker.evaluate(el => {
    const box = el.getBoundingClientRect();
    return el.matches(':modal') && box.left >= 0 && box.right <= innerWidth && box.top >= 0 && box.bottom <= innerHeight;
  }),'Color picker opens as an in-viewport modal above Options at minimum popup size');
  const purpleFamily = lightPicker.getByRole('button',{name:'deep purple',exact:true});
  assert.equal((await purpleFamily.innerText()).trim(), '', 'The swatch has an accessible name but no visible text');
  await purpleFamily.click();
  await page.waitForFunction(() => document.documentElement.style.getPropertyValue('--tag-color') === '#6200EA');
  const shades = lightPicker.getByRole('group',{name:'Shades'});
  assert(await shades.evaluate(group => getComputedStyle(group).borderTopWidth === '1px'), 'Shades have a separate visible frame');
  assert(await purpleFamily.evaluate(button => {
    const swatch = button.querySelector('i').getBoundingClientRect();
    const target = button.getBoundingClientRect();
    return Math.abs(swatch.width / parseFloat(getComputedStyle(button).fontSize) - 1.2) < .05 && target.width >= 24;
  }), 'Swatches scale with font size inside accessible button targets');
  assert.equal(await shades.getByRole('button',{name:'deep purple A700',exact:true}).getAttribute('aria-pressed'),'true');
  assert.equal(await shades.getByRole('button',{name:'deep purple A100',exact:true}).count(), 0, 'Low-contrast light chip shades cannot be selected');
  await shades.getByRole('button',{name:'deep purple 700',exact:true}).click();
  await lightPicker.getByRole('button',{name:'Done'}).click();
  await lightPicker.waitFor({state:'hidden'});
  assert(await lightTag.evaluate(el => document.activeElement === el),'Closing the palette restores focus to its property');
  await theme.selectOption('dark');
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor),'rgb(33, 33, 33)');
  await page.getByText('Dark colors',{exact:true}).click();
  const darkFolder = page.getByRole('button',{name:/^dark folder color:/});
  await darkFolder.click();
  const darkPicker = page.getByRole('dialog',{name:'dark folder color picker'});
  await darkPicker.getByRole('button',{name:'deep purple',exact:true}).click();
  await darkPicker.getByRole('button',{name:'deep purple A100',exact:true}).click();
  await darkPicker.press('Escape');
  await darkPicker.waitFor({state:'hidden'});
  assert(await optionsDialog.evaluate(el => el.matches(':modal')),'Escape closes the color picker but leaves Options open');
  assert(await darkFolder.evaluate(el => document.activeElement === el),'Escape restores focus to the property');
  await page.waitForFunction(() => document.documentElement.style.getPropertyValue('--folder-color') === '#B388FF');
  await page.getByRole('button',{name:'Reset dark colors to defaults'}).click();
  await page.waitForFunction(() => document.documentElement.style.getPropertyValue('--folder-color') === '#A5D6A7');
  const storedAppearance = await page.evaluate(async () => (await chrome.storage.local.get('appearance')).appearance);
  assert.equal(storedAppearance.dark.tag,'#90CAF9'); assert.equal(storedAppearance.light.tag,'#512DA8');
  await context.close();
  context = await launch();
  const restarted = await context.browser().newBrowserCDPSession();
  await restarted.send('Extensions.loadUnpacked', { path: resolve('dist/chromtag/browser') });
  const fresh = await context.newPage();
  await fresh.goto(`chrome-extension://${id}/index.html`);
  await fresh.getByText('10001 of 10001 bookmarks', { exact: true }).waitFor();
  assert.deepEqual(await fresh.evaluate(() => chrome.storage.session.get(null)), {});
  await fresh.getByRole('button', { name: 'Options', exact: true }).click();
  assert.equal(await fresh.getByRole('checkbox', { name: 'Open bookmarks in new tab' }).isChecked(), true);
  assert.equal(await fresh.getByRole('checkbox', { name: 'Close popup after opening a bookmark' }).isChecked(), false);
  await fresh.waitForFunction(() => !document.querySelector('input[aria-controls="filter-cloud"]').disabled);
  assert.equal(await fresh.getByRole('checkbox', { name: 'Show folders', exact: true }).isChecked(), false);
  assert.equal(await fresh.locator('.filter-cloud .folder').count(), 0);
  assert.deepEqual(await fresh.evaluate(() => chrome.storage.local.get(null)), { rememberFilters: true, showFolders: false, bookmarkClicks: { target: 'new', close: false, activate: false }, appearance:storedAppearance });
  assert.deepEqual(await fresh.locator('body').evaluate(el => [el.offsetWidth,el.offsetHeight,getComputedStyle(el).fontSize,document.documentElement.dataset.theme]),[380,400,'18px','dark']);
  await fresh.getByRole('checkbox', { name: 'Open bookmarks in new tab' }).uncheck();
  await fresh.getByRole('button', { name: 'Done' }).click();
  await context.route('https://example.invalid/**', route => route.fulfill({ contentType:'text/html', body:'<title>Current-tab destination</title>' }));
  const currentBookmark = fresh.locator('article .title').first();
  const currentUrl = await currentBookmark.locator('xpath=..').locator('.url').innerText();
  await currentBookmark.click();
  await fresh.waitForURL(currentUrl);
  console.log('PASS: click preferences default to current tab/close, persist across restart, and navigate the current tab without opening another.');
  console.log('PASS: filters restore on reopen, respect opt-out and clear, and expire on browser restart; independent Options preferences persist.');
  // Exercise the cloud with distinct choices, not just many bookmarks sharing tags.
  const dense = await context.newPage();
  await dense.goto(`chrome-extension://${id}/index.html`);
  await dense.evaluate(async () => {
    for (let batch = 0; batch < 20; batch++) {
      await Promise.all(Array.from({length: 100}, (_, index) => {
        const n = batch * 100 + index;
        return chrome.bookmarks.create({ title: `Distinct filter ${n} #unique${n}`, url: `https://example.invalid/distinct/${n}` });
      }));
    }
  });
  await dense.reload();
  await dense.getByText('12001 of 12001 bookmarks', {exact:true}).waitFor();
  await dense.locator('.filter-cloud[aria-busy="false"]').waitFor();
  assert(await dense.locator('.filter-cloud > button').count() <= 32, '2,000 distinct tags do not render an unbounded cloud');
  await (await findFilter(dense, '#unique1999')).click();
  await dense.getByText('1 of 12001 bookmarks', {exact:true}).waitFor();
  assert(await dense.locator('.filter-cloud > button').count() <= 32, 'Paging to the final distinct tag stays bounded');
  console.log('PASS: 2,000 distinct tags retain bounded cloud buttons and a reachable last choice.');
} finally {
  await context.close();
  await rm(profile, { recursive: true, force: true, maxRetries: 5 });
}
