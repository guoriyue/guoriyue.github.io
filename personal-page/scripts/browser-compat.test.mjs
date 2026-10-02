import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import test from 'node:test';

const html = await readFile('dist/client/index.html', 'utf8');
const bootstrap = html.match(/<script id="browser-compat">([\s\S]*?)<\/script>/)?.[1];

test('static page requests the Chromium renderer and includes the startup fallback', () => {
  assert.ok(html.includes('<meta name="renderer" content="webkit"'));
  assert.ok(bootstrap);
  assert.ok(html.indexOf('id="browser-compat"') < html.indexOf('<body'));
});

test('older browsers can distinguish own, inherited, and shadowed properties', () => {
  const context = vm.createContext({});
  vm.runInContext('delete Object.hasOwn', context);
  vm.runInContext(bootstrap, context);
  assert.equal(vm.runInContext(`Object.hasOwn({ value: 0 }, 'value')`, context), true);
  assert.equal(vm.runInContext(`Object.hasOwn({}, 'toString')`, context), false);
  assert.equal(vm.runInContext(`Object.hasOwn({ hasOwnProperty: null }, 'hasOwnProperty')`, context), true);
  assert.equal(vm.runInContext(`Object.hasOwn(Object.create(null), 'missing')`, context), false);
  assert.equal(vm.runInContext(`Object.keys(Object).includes('hasOwn')`, context), false);
});

test('modern browsers keep their native implementation', () => {
  const context = vm.createContext({});
  vm.runInContext('globalThis.original = Object.hasOwn', context);
  vm.runInContext(bootstrap, context);
  assert.equal(vm.runInContext('Object.hasOwn === original', context), true);
});
