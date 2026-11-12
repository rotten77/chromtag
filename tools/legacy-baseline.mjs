import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { cpus, platform, release } from 'node:os';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

// Diagnostic only: serve the archived popup with synthetic, read-only Chrome APIs.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const options = Object.fromEntries(process.argv.slice(2).map(arg => {
  const match = /^--([a-z-]+)=(.+)$/.exec(arg);
  assert(match, `Expected --name=value, received ${arg}`);
  return match.slice(1);
}));
for (const name of Object.keys(options)) {
  assert(['counts', 'runs', 'timeout-ms', 'output', 'playwright-path'].includes(name), `Unknown option: ${name}`);
}
const counts = (options.counts ?? '100,1000,5000,10000').split(',').map(Number);
const runs = Number(options.runs ?? 3);
const timeoutMs = Number(options['timeout-ms'] ?? 120000);
assert(counts.length > 0 && counts.every(n => Number.isSafeInteger(n) && n > 0));
assert(Number.isSafeInteger(runs) && runs > 0);
assert(Number.isSafeInteger(timeoutMs) && timeoutMs > 0);
const { chromium } = await import(pathToFileURL(resolve(root,
  options['playwright-path'] ?? '.local/t01-tools/node_modules/playwright/index.mjs')).href);
const archive = resolve(root, '.local/legacy/chromtag');
const sources = {};
const sourceHashes = {};
for (const name of ['popup.html', 'popup.js', 'popup.css', 'jquery.js', 'nano.js', 'nano.css']) {
  const bytes = await readFile(resolve(archive, name));
  sources[`/${name}`] = bytes;
  sourceHashes[name] = createHash('sha256').update(bytes).digest('hex');
}

function fixture(count) {
  const bar = { id: '1', parentId: '0', title: 'Bookmarks bar', children: [] };
  const other = { id: '2', parentId: '0', title: 'Other bookmarks', children: [] };
  const leaves = [];
  for (let group = 0; group < 10; group++) {
    const parent = { id: `g${group}`, parentId: '1', title: `Group ${group}`, children: [] };
    bar.children.push(parent);
    for (let leaf = 0; leaf < 10; leaf++) {
      const index = group * 10 + leaf;
      const folder = { id: `f${index}`, parentId: parent.id,
        title: `Folder ${String(index).padStart(3, '0')}`, children: [] };
      parent.children.push(folder);
      leaves.push(folder);
    }
  }
  for (let index = 0; index < count; index++) {
    const folder = leaves[index % leaves.length];
    folder.children.push({ id: `b${index}`, parentId: folder.id,
      title: `Bookmark ${String(index).padStart(6, '0')} #tag${index % 64} #tag${(index + 17) % 64}`,
      url: `https://example.invalid/page/${index}` });
  }
  return [{ id: '0', title: '', children: [bar, other] }];
}

// Runs in the page before the original scripts. All data is synthetic.
function setup(tree, reverse) {
  const state = window.baseline = { treeReads: 0, filterCalls: 0, rowSetTotal: 0,
    callbacks: [], errors: [], done: false };
  const queued = [];
  const started = performance.now();
  let heartbeat = performance.now();
  const timer = setInterval(() => {
    state.maxHeartbeatGapMs = Math.max(state.maxHeartbeatGapMs ?? 0, performance.now() - heartbeat);
    heartbeat = performance.now();
  }, 16);
  localStorage.clear();
  window.chrome = { bookmarks: { getTree(callback) {
    state.treeReads++;
    const index = queued.length;
    queued.push({ callback, index });
    if (queued.length === 3) setTimeout(() => {
      if (reverse) queued.reverse();
      for (const { callback: run, index: callIndex } of queued) {
        const before = performance.now();
        try { run(structuredClone(tree)); }
        catch (error) { state.errors.push(String(error)); }
        state.callbacks.push({ callIndex, durationMs: performance.now() - before });
      }
      state.startupMs = performance.now() - state.initStarted;
      state.setupToCompleteMs = performance.now() - started;
      state.rows = document.querySelectorAll('#bookmarks > li').length;
      state.folders = document.querySelectorAll('#folders > li').length;
      state.tags = document.querySelectorAll('#tags > li').length;
      setTimeout(() => {
        state.maxHeartbeatGapMs = Math.max(state.maxHeartbeatGapMs ?? 0, performance.now() - heartbeat);
        clearInterval(timer);
        state.done = true;
      }, 0);
    }, 0);
  } } };
}

function instrument() {
  const search = App.getSearch;
  App.getSearch = function (...args) {
    window.baseline.filterCalls++;
    window.baseline.rowSetTotal += document.getElementsByClassName('bookmark').length;
    return search.apply(this, args);
  };
  const init = App.init;
  App.init = function (...args) {
    window.baseline.initStarted = performance.now();
    return init.apply(this, args);
  };
}

let activeTree;
let reverse = false;
const server = createServer((request, response) => {
  const path = new URL(request.url, 'http://localhost').pathname;
  let body = sources[path];
  if (path === '/popup.html') {
    body = body.toString().replace('<script src="jquery.js">', '<script src="baseline-setup.js"></script><script src="jquery.js">')
      .replace('<script src="popup.js"></script>', '<script src="popup.js"></script><script src="baseline-instrument.js"></script>');
  } else if (path === '/baseline-setup.js') {
    body = `(${setup})(${JSON.stringify(activeTree)}, ${reverse});`;
  } else if (path === '/baseline-instrument.js') {
    body = `(${instrument})();`;
  }
  if (body === undefined) { response.writeHead(404).end(); return; }
  response.setHeader('Content-Type', path.endsWith('.html') ? 'text/html; charset=utf-8'
    : path.endsWith('.css') ? 'text/css' : 'text/javascript; charset=utf-8');
  response.end(body);
});
await new Promise(resolveReady => server.listen(0, '127.0.0.1', resolveReady));
const url = `http://127.0.0.1:${server.address().port}/popup.html`;
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
} catch (error) {
  await new Promise(resolveClosed => server.close(resolveClosed));
  throw error;
}
const report = { date: new Date().toISOString(), node: process.version, browser: browser.version(),
  os: `${platform()} ${release()}`, cpu: cpus()[0].model,
  viewport: { width: 500, height: 600 }, timeoutMs, sourceHashes,
  fixture: { folders: 112, distinctTags: 64, tagsPerBookmark: 2, bookmarkDepthFromRoot: 4 },
  samples: [], probes: {} };
const output = resolve(root, options.output ?? '.local/t01-baseline/results.json');
async function save() {
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify(report, null, 2) + '\n');
}
async function load(count, reversed = false) {
  activeTree = fixture(count);
  reverse = reversed;
  const context = await browser.newContext({ viewport: report.viewport });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  try {
    await page.goto(url, { waitUntil: 'commit', timeout: timeoutMs });
    await page.waitForFunction(() => window.baseline?.done, undefined, { timeout: timeoutMs });
  } catch (error) {
    await context.close();
    throw error;
  }
  return { context, page, pageErrors };
}
try {
  // Warm up the browser and legacy code without including the run in the results.
  const warmup = await load(100);
  await warmup.context.close();
  for (const count of counts) {
    let timedOut = false;
    for (let run = 1; run <= runs; run++) {
      let loaded;
      try {
        loaded = await load(count);
        const { page } = loaded;
        const metrics = await page.evaluate(() => window.baseline);
        assert.equal(metrics.treeReads, 3);
        assert.equal(metrics.rows, count);
        assert.equal(metrics.filterCalls, count);
        assert.equal(metrics.rowSetTotal, count * (count + 1) / 2);
        assert.deepEqual(metrics.errors, []);
        assert.deepEqual(loaded.pageErrors, []);
        const searches = await page.evaluate(() => {
          return ['Bookmark 000042', 'Folder 001', 'no-match-sentinel', ''].map(query => {
            $('#search').val(query);
            const start = performance.now();
            App.getSearch();
            const durationMs = performance.now() - start;
            const visible = [...document.querySelectorAll('#bookmarks > li')]
              .filter(row => getComputedStyle(row).display !== 'none').length;
            return { query, durationMs, visible };
          });
        });
        assert.deepEqual(searches.map(search => search.visible),
          [count > 42 ? 1 : 0, Math.floor((count + 98) / 100), 0, count]);
        const sample = { count, run, ...metrics, searches };
        report.samples.push(sample);
        console.log(JSON.stringify({ count, run, startupMs: metrics.startupMs,
          rows: metrics.rows, rowSetTotal: metrics.rowSetTotal, searches }));
      } catch (error) {
        timedOut = error.name === 'TimeoutError';
        report.samples.push({ count, run, timedOut, error: String(error) });
        if (!timedOut) throw error;
        process.exitCode = 1;
        console.error(`Timed out at ${count} bookmarks after ${timeoutMs} ms; skipping remaining runs at this size.`);
      } finally {
        if (loaded) await loaded.context.close();
        await save();
      }
      if (timedOut) break;
    }
  }
  for (const reversed of [false, true]) {
    const { context, page } = await load(100, reversed);
    report.probes[reversed ? 'bookmarksFirst' : 'foldersFirst'] = await page.evaluate(() => {
      const row = document.querySelector('#bookmarks > li');
      const firstRowFolder = row.querySelector('.labels .label:not(.hashtag)')?.textContent ?? null;
      $('#search').val('Folder 000');
      App.getSearch();
      return { firstRowFolder, folderSearchMatches: [...document.querySelectorAll('#bookmarks > li')]
        .filter(row => getComputedStyle(row).display !== 'none').length };
    });
    if (!reversed) report.probes.tags = await page.evaluate(() => {
      return ['word#tag', '#', 'Title #C++', 'Title #Žluťoučký', 'Title #work,'].map(title => {
        try { return { title, tags: App.matchTags(title), displayed: App.removeTag(title) }; }
        catch (error) { return { title, tags: App.matchTags(title), error: String(error) }; }
      });
    });
    if (!reversed) report.probes.searches = await page.evaluate(() => {
      return ['example.invalid', 'Bookmark 000042', 'Bookmark Folder', '"', '"]'].map(query => {
        $('#search').val(query);
        try {
          App.getSearch();
          return { query, matches: [...document.querySelectorAll('#bookmarks > li')]
            .filter(row => getComputedStyle(row).display !== 'none').length };
        } catch (error) { return { query, error: String(error) }; }
      });
    });
    if (!reversed) report.probes.unicode = await page.evaluate(() => {
      const titles = ['Café', 'Cafe\u0301', 'I', 'İ', 'ı', 'العربية', '中文', '😀', 'C++'];
      $('#bookmarks').empty();
      $('#search').val('');
      titles.forEach((title, index) => App.processBookmark({
        id: `unicode${index}`, parentId: 'f0', title, url: 'https://example.invalid/'
      }));
      return ['cafe', 'café', 'cafe\u0301', 'i', 'İ', 'ı', 'العربية', '中文', '😀', 'C++'].map(query => {
        $('#search').val(query);
        App.getSearch();
        return { query, titles: [...document.querySelectorAll('#bookmarks > li')]
          .filter(row => getComputedStyle(row).display !== 'none')
          .map(row => row.querySelector('.title').getAttribute('data-title')) };
      });
    });
    if (!reversed) report.probes.literalRendering = await page.evaluate(() => {
      $('#bookmarks').empty();
      $('#search').val('');
      App.processBookmark({ id: 'markup', parentId: 'f0', title: 'Literal <b>bold</b>',
        url: 'https://example.invalid/' });
      const title = document.querySelector('#bookmarks .title');
      return { text: title.textContent, containsMarkupElement: title.querySelector('b') !== null };
    });
    await context.close();
  }
  assert.equal(report.probes.foldersFirst.firstRowFolder, 'Folder 000');
  assert.equal(report.probes.bookmarksFirst.firstRowFolder, null);
  assert.equal(report.probes.bookmarksFirst.folderSearchMatches, 0);
  assert.match(report.probes.tags.find(probe => probe.title === 'Title #C++').error, /SyntaxError/);
  assert.equal(report.probes.literalRendering.containsMarkupElement, true);
  console.log(JSON.stringify({ probes: report.probes }));
} finally {
  await save();
  await browser.close();
  await new Promise(resolveClosed => server.close(resolveClosed));
}
