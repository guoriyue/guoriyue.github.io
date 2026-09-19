export type Point = { x: number; y: number };
export const COLLIE_SIZE = 40;
export function clampPoint(point: Point, width: number, height: number): Point {
  return {
    x: Math.max(0, Math.min(Math.max(0, width - COLLIE_SIZE), point.x)),
    y: Math.max(0, Math.min(Math.max(0, height - COLLIE_SIZE), point.y)),
  };
}
export function advanceCollie(position: Point, target: Point, elapsed: number) {
  const dx = target.x - position.x;
  const dy = target.y - position.y;
  const distance = Math.hypot(dx, dy);
  if (distance <= 1)
    return { ...target, moving: false, facing: dx < 0 ? -1 : 1 };
  const step = Math.min(
    distance,
    (Math.min(360, Math.max(70, distance * 4)) *
      Math.max(0, Math.min(40, elapsed))) /
      1000,
  );
  return {
    x: position.x + (dx / distance) * step,
    y: position.y + (dy / distance) * step,
    moving: step < distance,
    facing: dx < 0 ? -1 : 1,
  };
}

export const COLLIE_IDLE_DELAY = 140;
export function isCollieRunning(lastPointerTime: number, now: number) {
  return now - lastPointerTime < COLLIE_IDLE_DELAY;
}
