import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

for (const target of ['new', 'current']) test(`worker completes ${target} batch with disconnected popup and rejected tab`, async () => {
  let listener;
  const calls = [];
  let finish;
  const done = new Promise(resolve => { finish = resolve; });
  runInNewContext(readFileSync('public/open-selected.js', 'utf8'), { chrome: {
    runtime: { id: 'self', onMessage: { addListener(value) { listener = value; } } },
    tabs: {
      async create(options) { calls.push(['create', { ...options }]); if (options.url.endsWith('/b')) throw Error('Denied'); },
      async update(id, options) { calls.push(['update', id, { ...options }]); },
    },
  } });
  assert.equal(listener({ type: 'open-selected', urls: ['https://example.org/a', 'https://example.org/b', 'https://example.org/c'], target, tabId: 4, windowId: 8 }, { id: 'self' }, result => {
    assert.equal(result.failures, 1); finish(); throw Error('Popup disconnected');
  }), true);
  await done;
  assert.equal(calls.length, 3);
  for (const call of calls.filter(call => call[0] === 'create')) {
    assert.equal(call[1].active, false); assert.equal(call[1].windowId, 8);
  }
  if (target === 'current') assert.deepEqual(calls.at(-1), ['update', 4, { url: 'https://example.org/a' }]);
});
