import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

test('activation selects the first created tab only after all background tabs exist', async () => {
  let listener, finish;
  const done = new Promise(resolve => { finish = resolve; });
  const calls = [];
  runInNewContext(readFileSync('public/open-selected.js', 'utf8'), { chrome: {
    runtime: { id: 'self', onMessage: { addListener(fn) { listener = fn; } } },
    tabs: {
      async create(options) { calls.push(['create', options.active]); return { id: calls.length + 10 }; },
      async update(id, options) { calls.push(['activate', id, options.active]); },
    },
  } });
  listener({ type: 'open-selected', urls: ['https://a.example', 'https://b.example'], target: 'new', activate: true, windowId: 8 }, { id: 'self' }, finish);
  const result = await done;
  assert.equal(result.failures, 0);
  assert.deepEqual(calls, [['create', false], ['create', false], ['activate', 11, true]]);
});

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
