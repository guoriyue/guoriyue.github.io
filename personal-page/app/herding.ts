export type Vec = { x: number; y: number };
export type Sheep = Vec & { vx: number; vy: number; penned: boolean };
export type Rect = { x: number; y: number; width: number; height: number };

export const SHEEP_SIZE = 18;
export const DOG_SIZE = 34;

// Boids weights. Separation dominates so the flock never collapses to a point;
// fleeing dominates everything so the dog can actually steer the flock.
const NEIGHBOR_RADIUS = 70;
const SEPARATION_RADIUS = 26;
const SEPARATION_WEIGHT = 220;
const COHESION_WEIGHT = 46;
const ALIGNMENT_WEIGHT = 12;
const FLEE_RADIUS = 96;
const FLEE_WEIGHT = 900;
const SHEEP_MAX_SPEED = 108;
const DRAG = 1.4;
// Sheep keep a little off the fences, the way real ones do. It also leaves the
// dog room to get behind a sheep near the edge instead of pinning it there.
const WALL_MARGIN = 34;
const WALL_WEIGHT = 520;
// Two sheep can land on exactly the same point, which has no direction to push
// apart along. Fan them out along the golden angle instead of leaving them stuck.
const GOLDEN_ANGLE = 2.399963;
const BOUNCE = 0.4;

export const DOG_SPEED = 300;
// Strömbom's shepherding model: gather any stray back to the flock first, and
// only then push the whole flock from directly behind. Aiming at a single
// outlier instead makes the dog cut through the middle and scatter everyone.
const COLLECT_RADIUS = 86;
// A stray is released only once it is well back in the flock. Without that gap
// the dog flips between two equally distant strays and pushes neither anywhere.
const RELEASE_RADIUS = 52;
const COLLECT_OFFSET = 32;
const DRIVE_OFFSET = 30;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function rectCenter(rect: Rect): Vec {
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
}

export function isInside(point: Vec, rect: Rect) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

export function countPenned(flock: readonly Sheep[]) {
  return flock.reduce((total, sheep) => total + (sheep.penned ? 1 : 0), 0);
}

// Deterministic scatter, so a reset always produces a fair, reproducible start.
export function createFlock(count: number, field: Rect, seed = 1): Sheep[] {
  let state = seed * 9301 + 49297;
  const random = () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
  return Array.from({ length: count }, () => ({
    x: field.x + field.width * (0.45 + random() * 0.45),
    y: field.y + field.height * (0.15 + random() * 0.7),
    vx: 0,
    vy: 0,
    penned: false,
  }));
}

export function advanceDog(
  position: Vec,
  target: Vec,
  elapsed: number,
  speed = DOG_SPEED,
): Vec & { facing: number } {
  const dx = target.x - position.x;
  const dy = target.y - position.y;
  const distance = Math.hypot(dx, dy);
  const facing = Math.abs(dx) < 0.5 ? 0 : dx < 0 ? -1 : 1;
  if (distance <= 0.5) return { x: target.x, y: target.y, facing };
  const step = Math.min(distance, speed * clamp(elapsed, 0, 0.05));
  return {
    x: position.x + (dx / distance) * step,
    y: position.y + (dy / distance) * step,
    facing,
  };
}

// Where an autonomous dog should stand: behind a stray while gathering it back
// to the flock, otherwise behind the whole flock on the line to the pen.
export function autoDogTarget(
  flock: readonly Sheep[],
  pen: Rect,
  field: Rect,
  focus = -1,
): { point: Vec; focus: number } | null {
  const loose = flock.filter((sheep) => !sheep.penned);
  if (loose.length === 0) return null;
  const herd = {
    x: loose.reduce((sum, sheep) => sum + sheep.x, 0) / loose.length,
    y: loose.reduce((sum, sheep) => sum + sheep.y, 0) / loose.length,
  };

  // Keep working the sheep already singled out until it is back in the flock.
  let strayIndex = -1;
  const held = flock[focus];
  if (held && !held.penned) {
    const distance = Math.hypot(held.x - herd.x, held.y - herd.y);
    if (distance > RELEASE_RADIUS) strayIndex = focus;
  }
  if (strayIndex === -1) {
    let strayDistance = COLLECT_RADIUS;
    flock.forEach((sheep, index) => {
      if (sheep.penned) return;
      const distance = Math.hypot(sheep.x - herd.x, sheep.y - herd.y);
      if (distance > strayDistance) {
        strayDistance = distance;
        strayIndex = index;
      }
    });
  }
  const stray = strayIndex === -1 ? null : flock[strayIndex];

  // Drive toward a point just beyond the pen rather than its centre, so the
  // dog keeps pushing while the flock is already at the gate instead of
  // stalling on top of it.
  const center = rectCenter(pen);
  const fieldCenter = rectCenter(field);
  const outX = center.x - fieldCenter.x;
  const outY = center.y - fieldCenter.y;
  const outLength = Math.hypot(outX, outY) || 1;
  const goal = {
    x: center.x + (outX / outLength) * (pen.width / 2),
    y: center.y + (outY / outLength) * (pen.height / 2),
  };

  const anchor = stray ?? herd;
  const from = stray ? herd : goal;
  const offset = stray ? COLLECT_OFFSET : DRIVE_OFFSET;
  const dx = anchor.x - from.x;
  const dy = anchor.y - from.y;
  return {
    point: standingPoint(anchor, Math.atan2(dy, dx), offset, field),
    focus: strayIndex,
  };
}

// The dog wants to stand so that pushing the anchor forward sends it home, but
// against a wall that spot lies outside the field. Rotate around the anchor to
// the nearest angle the dog can actually reach, so a cornered sheep still moves.
function standingPoint(anchor: Vec, angle: number, offset: number, field: Rect): Vec {
  const margin = 6;
  const minX = field.x + margin;
  const maxX = field.x + field.width - margin;
  const minY = field.y + margin;
  const maxY = field.y + field.height - margin;
  for (let step = 0; step <= 12; step++) {
    for (const turn of step === 0 ? [0] : [step, -step]) {
      const candidate = angle + (turn * Math.PI) / 12;
      const x = anchor.x + Math.cos(candidate) * offset;
      const y = anchor.y + Math.sin(candidate) * offset;
      if (x >= minX && x <= maxX && y >= minY && y <= maxY) return { x, y };
    }
  }
  return { x: clamp(anchor.x, minX, maxX), y: clamp(anchor.y, minY, maxY) };
}

export function stepFlock(
  flock: readonly Sheep[],
  dog: Vec,
  pen: Rect,
  field: Rect,
  elapsed: number,
): Sheep[] {
  const dt = clamp(elapsed, 0, 0.05);
  const goal = rectCenter(pen);
  const minX = field.x + SHEEP_SIZE / 2;
  const maxX = field.x + field.width - SHEEP_SIZE / 2;
  const minY = field.y + SHEEP_SIZE / 2;
  const maxY = field.y + field.height - SHEEP_SIZE / 2;

  return flock.map((sheep, index) => {
    // A penned sheep settles down and stops reacting to the dog, but still
    // keeps its distance so the flock spreads out instead of stacking up.
    if (sheep.penned) {
      let ax = (goal.x - sheep.x) * 3.2;
      let ay = (goal.y - sheep.y) * 3.2;
      for (const other of flock) {
        if (other === sheep) continue;
        const dx = sheep.x - other.x;
        const dy = sheep.y - other.y;
        const distance = Math.hypot(dx, dy);
        if (distance >= SEPARATION_RADIUS) continue;
        if (distance === 0) {
          ax += Math.cos(index * GOLDEN_ANGLE) * SEPARATION_WEIGHT;
          ay += Math.sin(index * GOLDEN_ANGLE) * SEPARATION_WEIGHT;
          continue;
        }
        ax += (dx / distance) * (SEPARATION_WEIGHT / distance);
        ay += (dy / distance) * (SEPARATION_WEIGHT / distance);
      }
      const vx = (sheep.vx + ax * dt) * 0.84;
      const vy = (sheep.vy + ay * dt) * 0.84;
      const x = clamp(sheep.x + vx * dt, pen.x + SHEEP_SIZE / 3, pen.x + pen.width - SHEEP_SIZE / 3);
      const y = clamp(sheep.y + vy * dt, pen.y + SHEEP_SIZE / 3, pen.y + pen.height - SHEEP_SIZE / 3);
      return { x, y, vx, vy, penned: true };
    }

    let ax = 0;
    let ay = 0;
    let neighbors = 0;
    let centerX = 0;
    let centerY = 0;
    let flowX = 0;
    let flowY = 0;

    for (const other of flock) {
      if (other === sheep || other.penned) continue;
      const dx = sheep.x - other.x;
      const dy = sheep.y - other.y;
      const distance = Math.hypot(dx, dy);
      if (distance > NEIGHBOR_RADIUS) continue;
      if (distance === 0) {
        ax += Math.cos(index * GOLDEN_ANGLE) * SEPARATION_WEIGHT;
        ay += Math.sin(index * GOLDEN_ANGLE) * SEPARATION_WEIGHT;
        continue;
      }
      neighbors += 1;
      centerX += other.x;
      centerY += other.y;
      flowX += other.vx;
      flowY += other.vy;
      if (distance < SEPARATION_RADIUS) {
        ax += (dx / distance) * (SEPARATION_WEIGHT / distance);
        ay += (dy / distance) * (SEPARATION_WEIGHT / distance);
      }
    }

    if (neighbors > 0) {
      ax += (centerX / neighbors - sheep.x) * (COHESION_WEIGHT / 100);
      ay += (centerY / neighbors - sheep.y) * (COHESION_WEIGHT / 100);
      ax += (flowX / neighbors - sheep.vx) * (ALIGNMENT_WEIGHT / 100);
      ay += (flowY / neighbors - sheep.vy) * (ALIGNMENT_WEIGHT / 100);
    }

    const west = sheep.x - (field.x + WALL_MARGIN);
    const east = field.x + field.width - WALL_MARGIN - sheep.x;
    const north = sheep.y - (field.y + WALL_MARGIN);
    const south = field.y + field.height - WALL_MARGIN - sheep.y;
    // The pen side is home, not a fence to avoid.
    if (west < 0 && !isInside({ x: sheep.x, y: sheep.y }, pen))
      ax += (-west / WALL_MARGIN) * WALL_WEIGHT;
    if (east < 0) ax -= (-east / WALL_MARGIN) * WALL_WEIGHT;
    if (north < 0) ay += (-north / WALL_MARGIN) * WALL_WEIGHT;
    if (south < 0) ay -= (-south / WALL_MARGIN) * WALL_WEIGHT;

    const dogX = sheep.x - dog.x;
    const dogY = sheep.y - dog.y;
    const dogDistance = Math.hypot(dogX, dogY);
    if (dogDistance > 0 && dogDistance < FLEE_RADIUS) {
      const urgency = 1 - dogDistance / FLEE_RADIUS;
      ax += (dogX / dogDistance) * FLEE_WEIGHT * urgency * urgency;
      ay += (dogY / dogDistance) * FLEE_WEIGHT * urgency * urgency;
    }

    let vx = (sheep.vx + ax * dt) * (1 - DRAG * dt);
    let vy = (sheep.vy + ay * dt) * (1 - DRAG * dt);
    const speed = Math.hypot(vx, vy);
    if (speed > SHEEP_MAX_SPEED) {
      vx = (vx / speed) * SHEEP_MAX_SPEED;
      vy = (vy / speed) * SHEEP_MAX_SPEED;
    }

    let x = sheep.x + vx * dt;
    let y = sheep.y + vy * dt;
    if (x < minX) {
      x = minX;
      vx = Math.abs(vx) * BOUNCE;
    } else if (x > maxX) {
      x = maxX;
      vx = -Math.abs(vx) * BOUNCE;
    }
    if (y < minY) {
      y = minY;
      vy = Math.abs(vy) * BOUNCE;
    } else if (y > maxY) {
      y = maxY;
      vy = -Math.abs(vy) * BOUNCE;
    }

    return { x, y, vx, vy, penned: isInside({ x, y }, pen) };
  });
}
