import assert from 'node:assert/strict';
import { readFile, realpath, stat } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const localOnlyCsp = "script-src 'self'; object-src 'none';";

async function localAsset(root, name) {
  assert(typeof name === 'string' && name.length > 0, 'Asset path must be a nonempty string');
  assert(!/[\\:?#%]/u.test(name) && !name.startsWith('/')
    && !name.split('/').includes('..'), `Asset must be a local relative path: ${name}`);
  const path = await realpath(resolve(root, name));
  const fromRoot = relative(root, path);
  assert(fromRoot !== '..' && !fromRoot.startsWith(`..${sep}`)
    && !isAbsolute(fromRoot), `Asset escapes extension root: ${name}`);
  assert((await stat(path)).isFile(), `Asset is not a file: ${name}`);
  return path;
}

export async function validateManifest(directory, { built = false } = {}) {
  const root = await realpath(directory);
  const manifest = JSON.parse(await readFile(resolve(root, 'manifest.json'), 'utf8'));
  assert.equal(manifest.manifest_version, 3, 'Manifest V3 is required');
  for (const [key, limit] of [['name', 75], ['short_name', 12], ['description', 132]]) {
    assert(typeof manifest[key] === 'string' && manifest[key].trim().length > 0
      && [...manifest[key]].length <= limit, `Invalid manifest ${key}`);
  }
  assert(typeof manifest.version === 'string' && /^(0|[1-9]\d*)(\.(0|[1-9]\d*)){0,3}$/u.test(manifest.version),
    'Invalid extension version');
  const version = manifest.version.split('.').map(Number);
  assert(version.every(part => part <= 65535) && version.some(part => part > 0), 'Invalid extension version');
  assert(typeof manifest.minimum_chrome_version === 'string'
    && /^[1-9]\d*(\.\d+){0,3}$/u.test(manifest.minimum_chrome_version)
    && Number(manifest.minimum_chrome_version.split('.')[0]) >= 90, 'Chrome API floor must be at least 90');
  assert(Array.isArray(manifest.permissions), 'Permissions must be an array');
  const preferenceRelease = version[0] > 2 || (version[0] === 2 && (version[1] ?? 0) >= 1);
  assert.equal(manifest.permissions.includes('storage'), preferenceRelease,
    'Declare storage only for releases 2.1 and later');
  if (preferenceRelease) {
    assert(Number(manifest.minimum_chrome_version.split('.')[0]) >= 102,
      'Session filters require at least Chrome 102; retain any higher framework floor');
  }
  const expectedPermissions = ['bookmarks', 'activeTab', ...(preferenceRelease ? ['storage'] : [])];
  assert.deepEqual([...manifest.permissions].sort(), expectedPermissions.sort(),
    'Unexpected permission set for this release');
  for (const key of ['background', 'content_scripts', 'host_permissions', 'optional_host_permissions',
    'optional_permissions', 'web_accessible_resources', 'sandbox']) {
    assert(!(key in manifest), `Unneeded manifest capability: ${key}`);
  }
  assert.deepEqual(manifest.content_security_policy, { extension_pages: localOnlyCsp },
    'Use the local-script-only extension CSP');
  assert.equal(manifest.action?.default_popup, 'index.html', 'Popup must target generated index.html');
  assert(typeof manifest.action.default_title === 'string' && manifest.action.default_title.trim().length > 0,
    'Action title is required');
  const checkedIcons = new Set();
  for (const [name, icons] of [['icons', manifest.icons], ['action.default_icon', manifest.action.default_icon]]) {
    assert(icons && typeof icons === 'object' && !Array.isArray(icons), `${name} must map sizes to files`);
    assert.deepEqual(Object.keys(icons).sort(), ['128', '16', '48'], `${name} must declare the preserved sizes`);
    for (const [size, path] of Object.entries(icons)) {
      const bytes = await readFile(await localAsset(root, path));
      assert(bytes.length >= 24 && bytes.subarray(0, 8).equals(pngSignature)
        && bytes.toString('ascii', 12, 16) === 'IHDR', `Invalid PNG header: ${path}`);
      assert.equal(bytes.readUInt32BE(16), Number(size), `Wrong icon width: ${path}`);
      assert.equal(bytes.readUInt32BE(20), Number(size), `Wrong icon height: ${path}`);
      checkedIcons.add(path);
    }
  }
  if (built) {
    await localAsset(root, manifest.action.default_popup);
    const sourceRoot = resolve(repositoryRoot, 'public');
    const sourceManifest = JSON.parse(await readFile(resolve(sourceRoot, 'manifest.json'), 'utf8'));
    assert.deepEqual(manifest, sourceManifest, 'Built manifest differs from public/manifest.json');
    for (const name of checkedIcons) {
      assert((await readFile(resolve(root, name))).equals(await readFile(resolve(sourceRoot, name))),
        `Built icon differs from public/${name}`);
    }
  }
  return { root, built, iconFiles: checkedIcons.size, minimumChrome: manifest.minimum_chrome_version };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const [mode = '--source', directory, ...extra] = process.argv.slice(2);
    assert(['--source', '--built'].includes(mode) && extra.length === 0,
      'Usage: node tools/validate-manifest.mjs [--source [directory] | --built [directory]]');
    const built = mode === '--built';
    const result = await validateManifest(resolve(directory ?? resolve(repositoryRoot,
      built ? 'dist/chromtag/browser' : 'public')), { built });
    console.log(`PASS: ${built ? 'built package' : 'manifest source'}; ${result.iconFiles} PNG icons; Chrome API floor ${result.minimumChrome}.`);
    if (!built) console.log('Generated index.html, Angular compatibility, and browser runtime checks remain pending T-03.');
  } catch (error) {
    console.error(`Manifest validation failed: ${error.message}`);
    process.exitCode = 1;
  }
}
