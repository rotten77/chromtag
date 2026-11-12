import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const started = new Date();
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const runs = [];
const commands = [
  ['Manifest regression tests', ['--test', 'tools/validate-manifest.test.mjs']],
  ['Angular unit and component tests', ['node_modules/@angular/cli/bin/ng.js', 'test', '--watch=false']],
  ['Production build', ['node_modules/@angular/cli/bin/ng.js', 'build', '--configuration', 'production']],
  ['Stable Chrome integration', ['tools/test-browser.mjs']],
];
for (const [name, args] of commands) {
  const start = new Date();
  let output = '';
  const child = spawn(process.execPath, args, { cwd: process.cwd(), env: { ...process.env, NO_COLOR: '1' }, stdio: ['ignore', 'pipe', 'pipe'] });
  for (const stream of [child.stdout, child.stderr]) stream.on('data', bytes => { output += bytes; process.stdout.write(bytes); });
  const code = await new Promise(done => { child.on('error', error => { output += error.stack; }); child.on('close', done); });
  runs.push({ name, start, end: new Date(), code, output });
}
const success = runs.every(run => run.code === 0);
const report = resolve('.local/test-results', `${started.toISOString().replaceAll(':', '-')}-${process.pid}.html`);
await mkdir(resolve('.local/test-results'), { recursive: true });
await writeFile(report, `<!doctype html><html lang="en"><meta charset="utf-8"><title>Chromtag test results ${escape(started.toISOString())}</title><style>body{font:15px system-ui;max-width:1100px;margin:2rem auto;padding:1rem}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f3f5f7;padding:1rem}.pass{color:#116b36}.fail{color:#a11}</style><h1 class="${success ? 'pass' : 'fail'}">${success ? 'PASS' : 'FAIL'} — Chromtag tests</h1><p>Started: ${escape(started.toISOString())}<br>Finished: ${escape(new Date().toISOString())}<br>Node: ${escape(process.version)}</p>${runs.map(run => `<section><h2>${escape(run.name)} — exit ${escape(run.code)}</h2><p>${escape(run.start.toISOString())} to ${escape(run.end.toISOString())}</p><pre>${escape(run.output.replace(/\u001b\[[0-9;]*m/gu, ''))}</pre></section>`).join('')}</html>`);
console.log(`HTML test report: ${report}`);
process.exitCode = success ? 0 : 1;
