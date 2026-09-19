'use client';
import { useEffect, useRef } from 'react';
import { advanceCollie, clampPoint, isCollieRunning } from './collie-motion';

export default function Companion() {
  const dog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = dog.current;
    if (!element) return;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let position = { x: 0, y: 0 },
      target = { x: 0, y: 0 };
    let initialized = false,
      frame = 0,
      previousTime = 0,
      lastPointerTime = -Infinity;
    let pointer = { x: -1, y: -1 };
    const hide = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      initialized = false;
      element.dataset.visible = 'false';
      element.dataset.state = 'sit';
    };
    const tick = (time: number) => {
      if (!isCollieRunning(lastPointerTime, time)) {
        element.dataset.state = 'sit';
        frame = 0;
        return;
      }
      const next = advanceCollie(
        position,
        target,
        previousTime ? time - previousTime : 16,
      );
      if (Math.abs(target.x - position.x) > 1)
        element.style.setProperty('--facing', String(next.facing));
      position = clampPoint(next, window.innerWidth, window.innerHeight);
      previousTime = time;
      element.style.transform = `translate3d(${Math.round(position.x)}px, ${Math.round(position.y)}px, 0)`;
      element.dataset.state = 'run';
      frame = requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      if (
        event.pointerType !== 'mouse' ||
        !finePointer.matches ||
        reducedMotion.matches
      )
        return;
      if (
        initialized &&
        event.clientX === pointer.x &&
        event.clientY === pointer.y
      )
        return;
      pointer = { x: event.clientX, y: event.clientY };
      lastPointerTime = performance.now();
      target = clampPoint(
        { x: event.clientX + 18, y: event.clientY + 16 },
        window.innerWidth,
        window.innerHeight,
      );
      if (!initialized) {
        position = clampPoint(
          { x: target.x - 45, y: target.y },
          window.innerWidth,
          window.innerHeight,
        );
        initialized = true;
        element.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
      }
      element.dataset.visible = 'true';
      element.dataset.state = 'run';
      if (!frame) {
        previousTime = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    const leave = (event: PointerEvent) => {
      if (event.relatedTarget === null) hide();
    };
    const visibility = () => {
      if (document.hidden) hide();
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('blur', hide);
    window.addEventListener('resize', hide);
    document.addEventListener('pointerout', leave);
    document.addEventListener('visibilitychange', visibility);
    finePointer.addEventListener('change', hide);
    reducedMotion.addEventListener('change', hide);
    return () => {
      hide();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('blur', hide);
      window.removeEventListener('resize', hide);
      document.removeEventListener('pointerout', leave);
      document.removeEventListener('visibilitychange', visibility);
      finePointer.removeEventListener('change', hide);
      reducedMotion.removeEventListener('change', hide);
    };
  }, []);
  return (
    <div
      ref={dog}
      className="cursor-collie"
      data-visible="false"
      data-state="sit"
      aria-hidden="true"
    >
      <span className="collie-sprite" />
    </div>
  );
}
