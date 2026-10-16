import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const html = readFileSync('dist/client/blog/tinytriton-step-1/index.html', 'utf8');
const bootstrap = html.match(/<script id="site-theme">([\s\S]*?)<\/script>/)?.[1];

function browser({ saved = null, blocked = false } = {}) {
  const root = { dataset: {} };
  const events = {};
  const attributes = {};
  const local = new Map(saved ? [['site-theme', saved]] : []);
  const button = { setAttribute: (name, value) => { attributes[name] = value; } };
  class Element {
    closest(selector) { return selector === '[data-theme-toggle]' ? button : null; }
  }
  const context = vm.createContext({
    Element,
    document: {
      documentElement: root,
      querySelectorAll: (selector) => selector === '[data-theme-toggle]' ? [button] : [],
      addEventListener: (name, fn) => { events[name] = fn; },
    },
    window: { addEventListener: (name, fn) => { events[name] = fn; } },
    localStorage: {
      getItem(key) { if (blocked) throw new Error('Storage blocked'); return local.get(key) ?? null; },
      setItem(key, value) { if (blocked) throw new Error('Storage blocked'); local.set(key, value); },
    },
  });
  vm.runInContext(bootstrap, context);
  return { root, attributes, local, events, click: () => events.click({ target: new Element() }) };
}

test('exported pages apply the theme before the body and include a native toggle', () => {
  assert.ok(bootstrap);
  assert.ok(html.indexOf('id="site-theme"') < html.indexOf('<body'));
  assert.ok(html.includes('data-theme-toggle'));
  assert.ok(html.includes('data-theme-dark'));
  assert.ok(html.includes('05-compile-time-dark.svg'));
});

test('a new visit defaults to dark and a saved light choice is restored', () => {
  assert.equal(browser().root.dataset.theme, 'dark');
  const light = browser({ saved: 'light' });
  assert.equal(light.root.dataset.theme, 'light');
  assert.equal(light.attributes['aria-label'], 'Switch to dark mode');
  assert.equal(light.attributes['aria-pressed'], 'false');
  assert.equal(browser({ saved: 'invalid' }).root.dataset.theme, 'dark');
});

test('clicking a nested icon changes the theme and persists the selection', () => {
  const page = browser();
  page.click();
  assert.equal(page.root.dataset.theme, 'light');
  assert.equal(page.local.get('site-theme'), 'light');
  page.click();
  assert.equal(page.root.dataset.theme, 'dark');
  assert.equal(page.local.get('site-theme'), 'dark');
});

test('switching works when browser storage is unavailable', () => {
  const page = browser({ blocked: true });
  page.click();
  assert.equal(page.root.dataset.theme, 'light');
  page.events.pageshow();
  assert.equal(page.root.dataset.theme, 'light');
});

test('theme changes from another tab and history restoration update the page', () => {
  const page = browser();
  page.events.storage({ key: 'unrelated', newValue: 'light' });
  assert.equal(page.root.dataset.theme, 'dark');
  page.events.storage({ key: 'site-theme', newValue: 'light' });
  assert.equal(page.root.dataset.theme, 'light');
  page.local.set('site-theme', 'light');
  page.events.pageshow();
  assert.equal(page.root.dataset.theme, 'light');
});
