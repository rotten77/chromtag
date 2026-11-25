import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

test('bulk worker completes sequential writes after popup dismissal, preserves fields and counts rejection', async () => {
  let listener, resume, complete;
  const delayed = new Promise(resolve => { resume = resolve; });
  const done = new Promise(resolve => { complete = resolve; });
  const rows = new Map([['a', { title: 'Old', url: 'https://a.example', parentId: 'old' }], ['b', { title: 'Untouched', url: 'https://b.example', parentId: 'old' }]]);
  const calls = [];
  runInNewContext(readFileSync('public/open-selected.js', 'utf8'), { chrome: {
    runtime: { id: 'self', onMessage: { addListener(fn) { listener = fn; } } },
    bookmarks: {
      async update(id, patch) { calls.push(id); await delayed; if (!rows.has(id)) throw Error('Missing'); Object.assign(rows.get(id), patch); },
      async move(id, patch) { calls.push(id); if (!rows.has(id)) throw Error('Missing'); Object.assign(rows.get(id), patch); },
    },
  } });
  const request = { type: 'bulk-change', operations: [
    { kind: 'title', id: 'a', title: 'New #中文' },
    { kind: 'title', id: 'missing', title: 'Rejected' },
    { kind: 'move', id: 'a', parentId: 'new' },
  ] };
  assert.equal(listener(request, { id: 'self' }, result => { complete(result); throw Error('Popup disconnected'); }), true);
  assert.deepEqual(calls, ['a']);
  resume(); // Native API completes after the initiating popup has gone away.
  const result = await done;
  assert.equal(result.changed, 2); assert.equal(result.failures, 1);
  assert.deepEqual(calls, ['a', 'missing', 'a']);
  assert.deepEqual(rows.get('a'), { title: 'New #中文', url: 'https://a.example', parentId: 'new' });
  assert.deepEqual(rows.get('b'), { title: 'Untouched', url: 'https://b.example', parentId: 'old' });
  let rejected;
  listener({ type: 'bulk-change', operations: [{ kind: 'delete', id: 'a' }] }, { id: 'self' }, result => { rejected = result; });
  assert.equal(rejected.error, 'Invalid bulk request');
  assert.equal(listener(request, { id: 'other' }, () => assert.fail()), undefined);
});
