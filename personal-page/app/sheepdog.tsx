'use client';
import { useEffect, useRef } from 'react';
import {
  advanceDog,
  autoDogTarget,
  countPenned,
  createFlock,
  DOG_SIZE,
  stepFlock,
  type Sheep,
  type Vec,
} from './herding';

const FLOCK_SIZE = 6;
// The pen is a paddock along the left fence, full height: a sheep pressed into
// any left-hand corner is home rather than stuck somewhere the dog cannot reach.
const PEN_WIDTH = 104;
// Pause on the win state, then scatter a fresh flock so the field is never dead.
const CELEBRATION_MS = 2600;
// How long a player keeps the lead after the pointer leaves the field.
const HANDOVER_MS = 1200;
// Safety net for a flock the dog cannot crack: start over rather than sit dead.
const STALL_MS = 25000;

// 'w' wool, 'd' head and legs; the outline is derived from the wool cells.
const SHEEP_PIXELS = [
  '..wwww....',
  '.wwwwwww..',
  'wwwwwwwdd.',
  'wwwwwwwddd',
  '.wwwwwwdd.',
  '.d.d.d.d..',
];

function SheepSprite() {
  const wool: string[] = [];
  const dark: string[] = [];
  const outline = new Set<string>();
  SHEEP_PIXELS.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const cell = row[x];
      if (cell === 'w') {
        wool.push(`${x},${y}`);
        for (const [ox, oy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const nx = x + ox;
          const ny = y + oy;
          if (SHEEP_PIXELS[ny]?.[nx] !== 'w') outline.add(`${nx},${ny}`);
        }
      } else if (cell === 'd') {
        dark.push(`${x},${y}`);
      }
    }
  });
  const cells = (list: Iterable<string>, className: string) =>
    [...list].map((key) => {
      const [x, y] = key.split(',');
      return (
        <rect key={`${className}-${key}`} className={className} x={x} y={y} width="1" height="1" />
      );
    });
  return (
    <svg className="sheep-sprite" viewBox="-1 -1 12 8" aria-hidden="true">
      {cells(outline, 'sheep-edge')}
      {cells(dark, 'sheep-edge')}
      {cells(wool, 'sheep-wool')}
    </svg>
  );
}

// A four-point star with tapered arms reads as a sparkle; a plain cross does not.
const SPARKLE_PIXELS = [
  '...s...',
  '...s...',
  '..sss..',
  'sssssss',
  '..sss..',
  '...s...',
  '...s...',
];
const HEART_PIXELS = [
  '.hh.hh.',
  'hhhhhhh',
  'hhhhhhh',
  '.hhhhh.',
  '..hhh..',
  '...h...',
  '.......',
];

function PixelBurst({ rows, className }: { rows: string[]; className: string }) {
  const size = rows[0].length;
  return (
    <svg
      className={className}
      viewBox={`0 0 ${size} ${rows.length}`}
      aria-hidden="true"
    >
      {rows.flatMap((row, y) =>
        [...Array(row.length).keys()]
          .filter((x) => row[x] !== '.')
          .map((x) => (
            <rect key={`${x},${y}`} x={x} y={y} width="1" height="1" />
          )),
      )}
    </svg>
  );
}

// Fixed offsets so the burst looks scattered without re-randomising on render.
// Clustered around where the settled flock sits, rather than the whole paddock.
const CHEERS = [
  { left: '16%', bottom: '40%', delay: '0s', heart: false },
  { left: '62%', bottom: '46%', delay: '0.16s', heart: true },
  { left: '34%', bottom: '58%', delay: '0.32s', heart: false },
  { left: '72%', bottom: '34%', delay: '0.46s', heart: false },
  { left: '46%', bottom: '64%', delay: '0.6s', heart: true },
  { left: '24%', bottom: '30%', delay: '0.76s', heart: false },
];

export default function Herding() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const dogRef = useRef<HTMLDivElement>(null);
  const sheepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const field = fieldRef.current;
    const dogElement = dogRef.current;
    if (!field || !dogElement) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let bounds = { x: 0, y: 0, width: 0, height: 0 };
    let pen = { x: 0, y: 0, width: PEN_WIDTH, height: 0 };
    let flock: Sheep[] = [];
    let dog: Vec = { x: 0, y: 0 };
    let pointer: Vec | null = null;
    let pointerUntil = 0;
    let wonAt = 0;
    let focus = -1;
    let progressAt = 0;
    let frame = 0;
    let previous = 0;
    let reportedPenned = -1;
    let facing = -1;

    const paint = () => {
      dogElement.style.transform = `translate3d(${Math.round(dog.x - DOG_SIZE / 2)}px, ${Math.round(dog.y - DOG_SIZE / 2)}px, 0)`;
      flock.forEach((sheep, index) => {
        const node = sheepRefs.current[index];
        if (node) {
          node.style.transform = `translate3d(${Math.round(sheep.x)}px, ${Math.round(sheep.y)}px, 0) translate(-50%, -50%) scaleX(${sheep.vx < -2 ? -1 : 1})`;
          node.dataset.penned = String(sheep.penned);
        }
      });
    };

    const scatter = () => {
      flock = createFlock(FLOCK_SIZE, bounds, Math.floor(Math.random() * 1000) + 1);
      dog = { x: bounds.x + bounds.width - DOG_SIZE, y: bounds.y + bounds.height - DOG_SIZE };
      dogElement.dataset.state = 'run';
      wonAt = 0;
      focus = -1;
      progressAt = performance.now();
      reportedPenned = 0;
      field.dataset.complete = 'false';
      paint();
    };

    const measure = () => {
      const rect = field.getBoundingClientRect();
      const width = Math.max(240, rect.width);
      const height = Math.max(180, rect.height);
      const previousBounds = bounds;
      bounds = { x: 0, y: 0, width, height };
      pen = { x: 0, y: 0, width: PEN_WIDTH, height };
      field.style.setProperty('--pen-w', `${pen.width}px`);
      if (previousBounds.width === 0) scatter();
    };

    const tick = (time: number) => {
      const elapsed = previous ? (time - previous) / 1000 : 1 / 60;
      previous = time;

      const playing = pointer !== null && time < pointerUntil;
      const next =
        playing && pointer
          ? advanceDog(dog, pointer, elapsed, 620)
          : (() => {
              const plan = autoDogTarget(flock, pen, bounds, focus);
              if (!plan) return null;
              focus = plan.focus;
              return advanceDog(dog, plan.point, elapsed);
            })();
      if (playing) focus = -1;
      if (next) {
        dog = { x: next.x, y: next.y };
        // Keep the last real heading so the sprite does not flip while idling.
        if (next.facing !== 0 && next.facing !== facing) {
          facing = next.facing;
          dogElement.style.setProperty('--facing', String(facing));
        }
      }

      flock = stepFlock(flock, dog, pen, bounds, elapsed);
      paint();

      const total = countPenned(flock);
      if (total !== reportedPenned) {
        if (total > reportedPenned) progressAt = time;
        reportedPenned = total;
        const done = total === flock.length;
        field.dataset.complete = String(done);
        // Work over: the collie sits down and watches the flock.
        dogElement.dataset.state = done ? 'sit' : 'run';
      }
      if (total === flock.length) {
        if (!wonAt) wonAt = time;
        else if (time - wonAt > CELEBRATION_MS) scatter();
      } else if (time - progressAt > STALL_MS) {
        scatter();
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame || reducedMotion.matches) return;
      previous = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const move = (event: PointerEvent) => {
      const rect = field.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      pointerUntil = performance.now() + HANDOVER_MS;
      // Only one dog on screen: the cursor companion steps aside for this one.
      document.body.dataset.herding = 'true';
    };
    const release = () => {
      pointer = null;
      document.body.dataset.herding = 'false';
    };
    const visibility = () => {
      if (document.hidden) stop();
      else start();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(field);
    field.addEventListener('pointermove', move, { passive: true });
    field.addEventListener('pointerleave', release);
    document.addEventListener('visibilitychange', visibility);
    const motionPreference = () => {
      if (reducedMotion.matches) stop();
      else start();
    };
    reducedMotion.addEventListener('change', motionPreference);
    start();

    return () => {
      stop();
      document.body.dataset.herding = 'false';
      observer.disconnect();
      field.removeEventListener('pointermove', move);
      field.removeEventListener('pointerleave', release);
      document.removeEventListener('visibilitychange', visibility);
      reducedMotion.removeEventListener('change', motionPreference);
    };
  }, []);

  return (
    <div
      ref={fieldRef}
      className="herding-field"
      data-complete="false"
      aria-hidden="true"
    >
      <div className="herding-pen">
        <span>pen</span>
        <div className="herding-cheer">
          {CHEERS.map((cheer) => (
            <span
              key={cheer.left + cheer.bottom}
              style={{
                left: cheer.left,
                bottom: cheer.bottom,
                animationDelay: cheer.delay,
              }}
            >
              <PixelBurst
                rows={cheer.heart ? HEART_PIXELS : SPARKLE_PIXELS}
                className={cheer.heart ? 'cheer-heart' : 'cheer-sparkle'}
              />
            </span>
          ))}
        </div>
      </div>
      {Array.from({ length: FLOCK_SIZE }, (_, index) => (
        <div
          key={index}
          className="herding-sheep"
          data-penned="false"
          ref={(node) => {
            sheepRefs.current[index] = node;
          }}
        >
          <SheepSprite />
        </div>
      ))}
      <div ref={dogRef} className="herd-dog" data-state="run">
        <span className="collie-sprite" />
      </div>
    </div>
  );
}
