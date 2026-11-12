import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const started = new Date();
const runId = `${started.toISOString().replaceAll(':', '-')}-${process.pid}`;
const sourceCommit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
const dirty = !!execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim();
const manifest = JSON.parse(await readFile('public/manifest.json', 'utf8'));
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const runs = [];
const commands = [
  ['Manifest regression tests', ['--test', 'tools/validate-manifest.test.mjs']],
  ['Angular unit and component tests', ['node_modules/@angular/cli/bin/ng.js', 'test', '--watch=false']],
  ['Production build', ['node_modules/@angular/cli/bin/ng.js', 'build', '--configuration', 'production']],
  ['Finalize release package', ['tools/finalize-package.mjs']],
  ['Project and package checks', ['tools/check-project.mjs', '--built']],
  ['Stable Chrome integration', ['tools/test-browser.mjs']],
];
for (const [name, args] of commands) {
  const start = new Date();
  let output = '';
  const child = spawn(process.execPath, args, { cwd: process.cwd(), env: { ...process.env, NO_COLOR: '1', CHROMTAG_TEST_RUN: runId }, stdio: ['ignore', 'pipe', 'pipe'] });
  for (const stream of [child.stdout, child.stderr]) stream.on('data', bytes => { output += bytes; process.stdout.write(bytes); });
  const code = await new Promise(done => { child.on('error', error => { output += error.stack; }); child.on('close', done); });
  runs.push({ name, start, end: new Date(), code, output });
}
const success = runs.every(run => run.code === 0);
const report = resolve('.local/test-results', `${runId}.html`);
let screenshots = '';
for (const [suffix, label] of [['popup', 'Popup with one combined cloud'], ['processing-progress', 'Processing progress with 10,001 supported synthetic bookmarks'], ['crowded', 'Collapsed cloud with fixed controls and list-only scrolling'], ['editor', 'Editor'], ['scaled', '380 × 500 px with 16 px font']]) {
  try {
    const png = await readFile(resolve('.local/test-results', `${runId}-${suffix}.png`));
    screenshots += `<figure><figcaption>${escape(label)}</figcaption><img style="max-width:100%;border:1px solid #ccd" alt="${escape(label)}" src="data:image/png;base64,${png.toString('base64')}"></figure>`;
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
}
await mkdir(resolve('.local/test-results'), { recursive: true });
await writeFile(report, `<!doctype html><html lang="en"><meta charset="utf-8"><title>Chromtag test results ${escape(started.toISOString())}</title><style>body{font:15px system-ui;max-width:1100px;margin:2rem auto;padding:1rem}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f3f5f7;padding:1rem}.pass{color:#116b36}.fail{color:#a11}</style><h1 class="${success ? 'pass' : 'fail'}">${success ? 'PASS' : 'FAIL'} — Chromtag tests</h1><p>Started: ${escape(started.toISOString())}<br>Finished: ${escape(new Date().toISOString())}<br>Node: ${escape(process.version)}<br>Manifest: ${escape(manifest.version)}<br>Source HEAD: ${escape(sourceCommit)}; uncommitted changes: ${dirty ? 'yes' : 'no'}</p>${runs.map(run => `<section><h2>${escape(run.name)} — exit ${escape(run.code)}</h2><p>${escape(run.start.toISOString())} to ${escape(run.end.toISOString())}</p><pre>${escape(run.output.replace(/\u001b\[[0-9;]*m/gu, ''))}</pre></section>`).join('')}${screenshots}</html>`);
console.log(`HTML test report: ${report}`);
process.exitCode = success ? 0 : 1;
