import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { validateManifest } from './validate-manifest.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const local = resolve(root, '.local');
const source = resolve(root, 'public');

async function fixture(run) {
  await mkdir(local, { recursive: true });
  const directory = await mkdtemp(resolve(local, 't02-manifest-test-'));
  try {
    await cp(source, directory, { recursive: true });
    const manifest = JSON.parse(await readFile(resolve(directory, 'manifest.json'), 'utf8'));
    const save = () => writeFile(resolve(directory, 'manifest.json'), JSON.stringify(manifest));
    await run({ directory, manifest, save });
  } finally {
    assert.equal(dirname(resolve(directory)), local);
    assert(basename(directory).startsWith('t02-manifest-test-'));
    await rm(directory, { recursive: true, force: true });
  }
}

test('source validation works without a generated popup; built validation requires it', async () => {
  await fixture(async ({ directory }) => {
    await validateManifest(directory);
    await assert.rejects(validateManifest(directory, { built: true }), /ENOENT/);
    await writeFile(resolve(directory, 'index.html'), '<!doctype html><title>Package fixture</title>');
    await validateManifest(directory, { built: true });
  });
});

test('rejects missing, incorrectly sized, and nonlocal icons', async () => {
  await fixture(async ({ directory, manifest, save }) => {
    manifest.icons['16'] = 'missing.png';
    await save();
    await assert.rejects(validateManifest(directory), /ENOENT/);
    manifest.icons['16'] = 'icon48.png';
    await save();
    await assert.rejects(validateManifest(directory), /Wrong icon width/);
    for (const path of ['../icon.png', 'https://example.invalid/icon.png', 'C:\\icon.png']) {
      manifest.icons['16'] = path;
      await save();
      await assert.rejects(validateManifest(directory), /local relative path/);
    }
  });
});

test('rejects an incompatible popup target or a relaxed script policy', async () => {
  await fixture(async ({ directory, manifest, save }) => {
    manifest.action.default_popup = 'popup.html';
    await save();
    await assert.rejects(validateManifest(directory), /generated index.html/);
    manifest.action.default_popup = 'index.html';
    manifest.content_security_policy.extension_pages = "script-src 'self' 'unsafe-eval'; object-src 'none';";
    await save();
    await assert.rejects(validateManifest(directory), /extension CSP/);
  });
});

test('rejects a background worker and host or content-script capabilities', async () => {
  await fixture(async ({ directory, manifest, save }) => {
    for (const [key, value] of [['background', { service_worker: 'worker.js' }],
      ['host_permissions', ['<all_urls>']], ['content_scripts', [{ matches: ['<all_urls>'], js: ['content.js'] }]]]) {
      manifest[key] = value;
      await save();
      await assert.rejects(validateManifest(directory), /Unneeded manifest capability/);
      delete manifest[key];
    }
  });
});

test('rejects invalid extension versions and an API floor below Chrome 90', async () => {
  await fixture(async ({ directory, manifest, save }) => {
    const version = manifest.version;
    for (const invalid of ['0.0', '01.8', '2.65536', '2.0.0.0.1']) {
      manifest.version = invalid;
      await save();
      await assert.rejects(validateManifest(directory), /Invalid extension version/);
    }
    manifest.version = version;
    manifest.minimum_chrome_version = '89';
    await save();
    await assert.rejects(validateManifest(directory), /API floor/);
  });
});

test('built validation detects stale manifest or icon copies', async () => {
  await fixture(async ({ directory, manifest, save }) => {
    await writeFile(resolve(directory, 'index.html'), '<!doctype html><title>Package fixture</title>');
    manifest.description += ' changed';
    await save();
    await assert.rejects(validateManifest(directory, { built: true }), /Built manifest differs/);
    await cp(resolve(source, 'manifest.json'), resolve(directory, 'manifest.json'));
    const icon = await readFile(resolve(directory, 'icon.png'));
    icon[icon.length - 1] ^= 1;
    await writeFile(resolve(directory, 'icon.png'), icon);
    await assert.rejects(validateManifest(directory, { built: true }), /Built icon differs/);
  });
});

test('storage appears only with preference releases, whose Chrome floor includes session storage', async () => {
  await fixture(async ({ directory, manifest, save }) => {
    manifest.version = '2.0';
    await save();
    await assert.rejects(validateManifest(directory), /storage only for releases/);
    manifest.version = '2.1';
    manifest.minimum_chrome_version = '101';
    await save();
    await assert.rejects(validateManifest(directory), /at least Chrome 102/);
    manifest.minimum_chrome_version = '102';
    await save();
    await validateManifest(directory);
    manifest.permissions = manifest.permissions.filter(permission => permission !== 'storage');
    await save();
    await assert.rejects(validateManifest(directory), /storage only for releases/);
  });
});

test('rejects missing bookmark access, duplicate permissions, and unrelated permission escalation', async () => {
  await fixture(async ({ directory, manifest, save }) => {
    const permissions = [...manifest.permissions];
    for (const invalid of [permissions.filter(permission => permission !== 'bookmarks'),
      permissions.filter(permission => permission !== 'activeTab'), ['bookmarks', 'tabs', 'storage'],
      [...permissions, 'bookmarks'], [...permissions, 'debugger'], [...permissions, 'scripting'],
      ['bookmarks', 'tabs', 'activeTab', 'storage']]) {
      manifest.permissions = invalid;
      await save();
      await assert.rejects(validateManifest(directory), /Unexpected permission set/);
    }
  });
});
