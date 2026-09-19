import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceCollie, clampPoint } from '../app/collie-motion.ts';

test('stays inside viewport including windows smaller than the sprite', () => {
  assert.deepEqual(clampPoint({ x: 999, y: -4 }, 320, 200), { x: 288, y: 0 });
  assert.deepEqual(clampPoint({ x: 10, y: 10 }, 20, 20), { x: 0, y: 0 });
});
test('reaches the cursor offset and stops without overshooting in either direction', () => {
  for (const target of [
    { x: 300, y: 180 },
    { x: 0, y: 0 },
  ]) {
    let position = { x: 100, y: 80 };
    let next;
    for (let i = 0; i < 600; i++) {
      next = advanceCollie(position, target, 16);
      assert.ok(
        Math.hypot(next.x - target.x, next.y - target.y) <=
          Math.hypot(position.x - target.x, position.y - target.y),
      );
      position = { x: next.x, y: next.y };
      if (!next.moving) break;
    }
    assert.deepEqual(position, target);
    assert.equal(next.moving, false);
  }
});
test('faces movement and limits motion after a stalled frame', () => {
  const start = { x: 100, y: 100 };
  assert.equal(advanceCollie(start, { x: 0, y: 100 }, 16).facing, -1);
  const next = advanceCollie(start, { x: 1000, y: 100 }, 10000);
  assert.equal(next.facing, 1);
  assert.ok(next.x - start.x <= 14.401);
  assert.equal(advanceCollie(start, { x: 1000, y: 100 }, -1).x, 100);
});
