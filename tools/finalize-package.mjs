import { copyFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { validateManifest } from './validate-manifest.mjs';

// Angular emits notices beside browser/. Keep them in the loadable extension too.
const notices = resolve('dist/chromtag/3rdpartylicenses.txt');
await readFile(notices);
await copyFile(notices, resolve('dist/chromtag/browser/3rdpartylicenses.txt'));
await validateManifest(resolve('dist/chromtag/browser'), { built: true });
console.log('PASS: finalized extension includes third-party notices and validated assets.');
