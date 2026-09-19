'use client';
import { useEffect, useRef } from 'react';
import { advanceCollie, clampPoint, COLLIE_SIZE } from './collie-motion';

export default function Companion() {
  const dog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = dog.current;
    if (!element) return;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let position = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };
    let initialized = false;
    let frame = 0;
    let previousTime = 0;
    const hide = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      initialized = false;
      element.dataset.visible = 'false';
      element.dataset.moving = 'false';
    };
    const tick = (time: number) => {
      const next = advanceCollie(
        position,
        target,
        previousTime ? time - previousTime : 16,
      );
      position = clampPoint(next, window.innerWidth, window.innerHeight);
      previousTime = time;
      element.style.transform = `translate3d(${Math.round(position.x)}px, ${Math.round(position.y)}px, 0)`;
      element.dataset.moving = String(next.moving);
      frame = next.moving ? requestAnimationFrame(tick) : 0;
    };
    const move = (event: PointerEvent) => {
      if (
        event.pointerType !== 'mouse' ||
        !finePointer.matches ||
        reducedMotion.matches
      )
        return;
      target = clampPoint(
        { x: event.clientX + 18, y: event.clientY + 16 },
        window.innerWidth,
        window.innerHeight,
      );
      if (!initialized) {
        position = clampPoint(
          { x: target.x - 80, y: target.y + 20 },
          window.innerWidth,
          window.innerHeight,
        );
        initialized = true;
        element.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
      }
      element.dataset.visible = 'true';
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
      aria-hidden="true"
    >
      <img
        src="/collie-pixel-32.png"
        alt=""
        width={COLLIE_SIZE}
        height={COLLIE_SIZE}
        draggable="false"
      />
    </div>
  );
}
