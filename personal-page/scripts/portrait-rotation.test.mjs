import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { rotatePortrait } from '../app/portrait-rotation.ts';

const photos = Array.from({ length: 6 }, (_, i) => ({
  src: `/photo-${i}.jpg`,
  position: '50% 50%',
}));
function environment({
  previous = photos[0].src,
  globalLast = previous,
  blocked = false,
} = {}) {
  const local = new Map([['portrait-last', globalLast]]);
  const session = new Map([['portrait-last', previous]]);
  const storage = (map) => ({
    getItem: (key) => {
      if (blocked) throw new Error('Storage disabled');
      return map.get(key) ?? null;
    },
    setItem: (key, value) => {
      if (blocked) throw new Error('Storage disabled');
      map.set(key, value);
    },
  });
  const history = {
    state: { router: 'preserved', __portraitLast: previous },
    replaceState(state) {
      this.state = state;
    },
  };
  let image;
  const context = vm.createContext({
    localStorage: storage(local),
    sessionStorage: storage(session),
    history,
    document: { getElementById: () => image },
  });
  return {
    history,
    local,
    session,
    run(script = `(${rotatePortrait.toString()})(${JSON.stringify(photos)})`) {
      image = {
        src: photos[0].src,
        dataset: {},
        style: {},
        onload: null,
        onerror: null,
      };
      vm.runInContext(script, context);
      return image;
    },
  };
}

test('random reloads never repeat the visible photo and reach every photo', () => {
  const env = environment();
  const seen = new Set();
  let previous = photos[0].src;
  for (let i = 0; i < 120; i++) {
    const image = env.run();
    assert.notEqual(image.src, previous);
    image.onload();
    previous = image.src;
    seen.add(image.src);
    assert.equal(env.local.get('portrait-last'), image.src);
    assert.equal(env.history.state.router, 'preserved');
  }
  assert.equal(seen.size, photos.length);
});

test('another tab cannot cause this tab to repeat its last photo', () => {
  const env = environment({
    previous: photos[1].src,
    globalLast: photos[4].src,
  });
  for (let i = 0; i < 30; i++) {
    const image = env.run();
    assert.notEqual(image.src, photos[1].src);
    assert.notEqual(image.src, photos[4].src);
  }
});

test('reloads still avoid repeats when web storage is disabled', () => {
  const env = environment({ blocked: true });
  let previous = photos[0].src;
  for (let i = 0; i < 20; i++) {
    const image = env.run();
    assert.notEqual(image.src, previous);
    image.onload();
    previous = image.src;
  }
});

test('a failed image tries another alternative before reverting', () => {
  const env = environment();
  const image = env.run();
  const failed = image.src;
  image.onerror();
  assert.notEqual(image.src, failed);
  assert.notEqual(image.src, photos[0].src);
  image.onload();
  assert.equal(env.local.get('portrait-last'), image.src);
});

test('exported inline script works without React or client bundles', () => {
  const html = readFileSync('dist/client/index.html', 'utf8');
  const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1])
    .find(
      (script) =>
        script.startsWith('(function') && script.includes('rotationStarted'),
    );
  assert.ok(script, 'Portrait selection must be emitted inline');
  const env = environment({ previous: '/portrait.jpg' });
  const image = env.run(script);
  assert.notEqual(image.src, '/portrait.jpg');
  assert.ok(image.src.startsWith('/portraits/'));
  assert.ok(!html.includes('Next photo'));
});
