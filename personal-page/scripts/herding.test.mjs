import test from 'node:test';
import assert from 'node:assert/strict';
import {
  advanceDog,
  autoDogTarget,
  countPenned,
  createFlock,
  isInside,
  rectCenter,
  stepFlock,
} from '../app/herding.ts';

const field = { x: 0, y: 0, width: 600, height: 300 };
// The pen is the full-height paddock along the left fence, as the page renders it.
const pen = { x: 0, y: 0, width: 104, height: 300 };
const far = { x: 10_000, y: 10_000 };

test('the flock starts loose, inside the field, and clear of the pen', () => {
  const flock = createFlock(7, field);
  assert.equal(flock.length, 7);
  assert.equal(countPenned(flock), 0);
  for (const sheep of flock) {
    assert.ok(isInside(sheep, field));
    assert.equal(isInside(sheep, pen), false);
  }
});

test('sheep run away from the dog and stay inside the field', () => {
  let flock = [{ x: 300, y: 150, vx: 0, vy: 0, penned: false }];
  const dog = { x: 340, y: 150 };
  for (let i = 0; i < 20; i++) flock = stepFlock(flock, dog, pen, field, 1 / 60);
  assert.ok(flock[0].x < 300, 'moved away from the dog');

  // Pinned against the left wall, a sheep must not be pushed out of the field.
  let cornered = [{ x: 12, y: 40, vx: 0, vy: 0, penned: false }];
  for (let i = 0; i < 200; i++) {
    cornered = stepFlock(cornered, { x: 60, y: 40 }, pen, field, 1 / 60);
    assert.ok(isInside(cornered[0], field));
  }
});

test('crowded sheep push apart instead of stacking up', () => {
  let flock = [
    { x: 300, y: 150, vx: 0, vy: 0, penned: false },
    { x: 304, y: 152, vx: 0, vy: 0, penned: false },
  ];
  for (let i = 0; i < 60; i++) flock = stepFlock(flock, far, pen, field, 1 / 60);
  assert.ok(Math.hypot(flock[0].x - flock[1].x, flock[0].y - flock[1].y) > 8);
});

test('a penned sheep settles in the pen and ignores the dog', () => {
  const center = rectCenter(pen);
  let flock = [{ ...center, vx: 0, vy: 0, penned: true }];
  for (let i = 0; i < 300; i++) {
    flock = stepFlock(flock, center, pen, field, 1 / 60);
    assert.equal(flock[0].penned, true);
    assert.ok(isInside(flock[0], pen));
  }
});

test('penned sheep spread out inside the pen instead of stacking on one spot', () => {
  const center = rectCenter(pen);
  let flock = Array.from({ length: 6 }, () => ({
    ...center,
    vx: 0,
    vy: 0,
    penned: true,
  }));
  for (let i = 0; i < 400; i++) flock = stepFlock(flock, far, pen, field, 1 / 60);
  for (const sheep of flock) assert.ok(isInside(sheep, pen));
  for (let a = 0; a < flock.length; a++) {
    for (let b = a + 1; b < flock.length; b++) {
      const gap = Math.hypot(flock[a].x - flock[b].x, flock[a].y - flock[b].y);
      assert.ok(gap > 6, `sheep ${a} and ${b} overlap (gap ${gap.toFixed(1)})`);
    }
  }
});

test('a tight flock is driven from behind, on the far side from the pen', () => {
  const flock = [
    { x: 400, y: 150, vx: 0, vy: 0, penned: false },
    { x: 430, y: 160, vx: 0, vy: 0, penned: false },
  ];
  const { point, focus } = autoDogTarget(flock, pen, field);
  assert.equal(focus, -1, 'no stray to collect');
  assert.ok(point.x > 430, 'stands beyond the flock, away from the pen');
  assert.equal(autoDogTarget([{ ...flock[0], penned: true }], pen, field), null);
});

test('a stray is collected first, and kept as the target until it rejoins', () => {
  const flock = [
    { x: 400, y: 150, vx: 0, vy: 0, penned: false },
    { x: 410, y: 160, vx: 0, vy: 0, penned: false },
    { x: 560, y: 280, vx: 0, vy: 0, penned: false },
  ];
  const first = autoDogTarget(flock, pen, field);
  assert.equal(first.focus, 2, 'goes for the sheep that left the flock');
  // Still committed while the stray is on its way back...
  const returning = [...flock];
  returning[2] = { ...flock[2], x: 470, y: 210 };
  assert.equal(autoDogTarget(returning, pen, field, 2).focus, 2);
  // ...and released once it is properly back in the flock.
  const rejoined = [...flock];
  rejoined[2] = { ...flock[2], x: 415, y: 158 };
  assert.equal(autoDogTarget(rejoined, pen, field, 2).focus, -1);
});

test('the dog can still get behind a sheep pinned against the far fence', () => {
  const flock = [{ x: field.width - 2, y: 150, vx: 0, vy: 0, penned: false }];
  const { point } = autoDogTarget(flock, pen, field);
  assert.ok(point.x <= field.width, 'stays on the field');
  assert.ok(
    Math.hypot(point.x - flock[0].x, point.y - flock[0].y) > 10,
    'does not stand on top of the sheep',
  );
});

test('sheep keep off the fences, leaving the dog room to work', () => {
  let flock = [{ x: 500, y: 150, vx: 0, vy: 0, penned: false }];
  // Dog pressing from the left drives this sheep toward the right-hand fence.
  for (let i = 0; i < 600; i++)
    flock = stepFlock(flock, { x: flock[0].x - 40, y: 150 }, pen, field, 1 / 60);
  assert.ok(
    flock[0].x < field.width - 12,
    `stopped short of the fence (x ${flock[0].x.toFixed(1)})`,
  );
});

test('the dog approaches its target without overshooting, and stalled frames are capped', () => {
  let position = { x: 0, y: 0 };
  const target = { x: 120, y: 90 };
  for (let i = 0; i < 400; i++) position = advanceDog(position, target, 1 / 60);
  assert.deepEqual({ x: position.x, y: position.y }, target);
  assert.equal(advanceDog({ x: 0, y: 0 }, { x: 9999, y: 0 }, 60).x, 15);
  assert.equal(advanceDog({ x: 0, y: 0 }, { x: 9999, y: 0 }, -1).x, 0);
});

test('the autonomous dog pens the whole flock, from every starting scatter', () => {
  for (const [width, height] of [
    [600, 300],
    [720, 300],
    [340, 240],
  ]) {
    const ground = { x: 0, y: 0, width, height };
    const paddock = { x: 0, y: 0, width: 104, height };
    for (let seed = 1; seed <= 12; seed++) {
      let flock = createFlock(6, ground, seed);
      let dog = { x: width - 20, y: height - 20 };
      let focus = -1;
      let frames = 0;
      for (; frames < 60 * 60 && countPenned(flock) < flock.length; frames++) {
        const plan = autoDogTarget(flock, paddock, ground, focus);
        if (plan) {
          focus = plan.focus;
          dog = advanceDog(dog, plan.point, 1 / 60);
        }
        flock = stepFlock(flock, dog, paddock, ground, 1 / 60);
      }
      assert.equal(
        countPenned(flock),
        6,
        `${width}x${height} seed ${seed} stalled at ${countPenned(flock)}/6`,
      );
    }
  }
});
