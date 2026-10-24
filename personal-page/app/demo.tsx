'use client';

import { useState } from 'react';

export default function Demo({
  src,
  poster,
  label,
  width,
  height,
}: {
  src: string;
  poster: string;
  label: string;
  width: number;
  height: number;
}) {
  const [paused, setPaused] = useState(false);
  return (
    <span className="demo-container">
      <picture>
        <source media="(prefers-reduced-motion: reduce)" srcSet={poster} />
        <img
          className="demo"
          src={paused ? poster : src}
          alt={label}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
        />
      </picture>
      {/* Covers the animation so a click anywhere toggles it, as on YouTube. */}
      <button
        type="button"
        className="demo-toggle"
        data-paused={paused}
        onClick={() => setPaused(!paused)}
        aria-label={`${paused ? 'Play' : 'Pause'} animation: ${label}`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {paused ? (
            <path d="M8 5.5v13l10.5-6.5z" />
          ) : (
            <path d="M7 5h3.5v14H7zm6.5 0H17v14h-3.5z" />
          )}
        </svg>
      </button>
    </span>
  );
}
