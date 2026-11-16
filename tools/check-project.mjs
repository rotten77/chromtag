import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { validateManifest } from './validate-manifest.mjs';

const read = file => readFile(resolve(file), 'utf8');
const documents = ['README.md', 'AGENTS.md', 'CLAUDE.md'];
for (const directory of ['docs', '.memory', '.memory/log']) {
  for (const name of await readdir(directory)) if (name.endsWith('.md')) documents.push(`${directory}/${name}`);
}
let links = 0;
for (const file of documents) {
  const content = await read(file);
  for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/gu)) {
    const link = match[1].replace(/^<|>$/gu, '');
    if (/^(?:https?:|mailto:|#)/iu.test(link)) continue;
    const path = decodeURIComponent(link.split('#')[0]);
    if (!path) continue;
    await readFile(resolve(dirname(file), path));
    links++;
  }
}
const spec = await read('.memory/technical-specification.md');
const criteria = [...spec.matchAll(/\*\*((?:US-0[1-8]|T-0[0-7])-AC\d+):\*\*/gu)].map(match => match[1]);
const coverage = await read('.memory/test-coverage.md');
const mapped = new Set([...coverage.matchAll(/\b(?:US-0[1-8]|T-0[0-7])-AC\d+\b/gu)].map(match => match[0]));
assert.equal(criteria.length, new Set(criteria).size, 'Criteria must be unique');
assert.deepEqual(new Set(criteria), mapped, 'Every E-20/preparation criterion needs an evidence mapping');
const manifest = JSON.parse(await read('public/manifest.json'));
const pkg = JSON.parse(await read('package.json'));
assert.equal(pkg.version.split('.').slice(0, 2).join('.'), manifest.version, 'Package and manifest release versions must agree');
assert.equal((await read('.browserslistrc')).trim(), `Chrome >= ${manifest.minimum_chrome_version}`, 'Manifest and build browser floors must agree');
for (const pattern of ['.local/', 'node_modules/', 'dist/', '.angular/']) assert((await read('.gitignore')).split(/\r?\n/u).includes(pattern));
for (const dep of Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })) assert(!/jquery|nanoscroller|yui/iu.test(dep), 'Replaced runtime dependencies must stay removed');
async function checkSource(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) { if (entry.name !== 'testing') await checkSource(path); }
    else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')) {
      assert(!/\b(?:localStorage|sessionStorage)\b|chrome\.storage|\b(?:eval|new Function)\s*\(/u.test(await read(path)), `Transient/local-code policy violated in ${path}`);
    }
  }
}
await checkSource('src');
if (manifest.version === '2.0') {
  const changelog = await read('docs/changelog.md');
  assert(changelog.includes('## 2.0') && /machine-assisted/iu.test(changelog) && /human guidance/iu.test(changelog), 'Version 2.0 needs the required development attribution');
}
await validateManifest(resolve('public'));
if (process.argv.includes('--built')) {
  await validateManifest(resolve('dist/chromtag/browser'), { built: true });
  const dom = new JSDOM(await read('dist/chromtag/browser/index.html'));
  const scripts = [...dom.window.document.querySelectorAll('script')];
  assert(scripts.length > 0, 'Generated popup must load scripts');
  for (const element of [...scripts, ...dom.window.document.querySelectorAll('link[href]')]) {
    const path = element.getAttribute(element.tagName === 'SCRIPT' ? 'src' : 'href');
    assert(path && !/^[/\\]|:|\.\./u.test(path), 'Generated scripts/styles must use local paths');
    await readFile(resolve('dist/chromtag/browser', path));
    if (element.tagName === 'SCRIPT') assert(!element.textContent.trim(), 'Inline scripts violate extension CSP');
  }
  for (const element of dom.window.document.querySelectorAll('*')) {
    assert(![...element.attributes].some(attribute => /^on/iu.test(attribute.name)), 'No inline event handlers');
  }
  assert.equal(await read('dist/chromtag/browser/3rdpartylicenses.txt'), await read('dist/chromtag/3rdpartylicenses.txt'), 'Ship the generated dependency notices inside the extension root');
  dom.window.close();
}
console.log(`PASS: ${links} documentation links, ${mapped.size} criterion mappings, browser/version consistency, source/ignore policy${process.argv.includes('--built') ? ', generated package' : ''}.`);
