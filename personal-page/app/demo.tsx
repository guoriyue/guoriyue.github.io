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
      <button
        type="button"
        className="demo-toggle"
        onClick={() => setPaused(!paused)}
        aria-label={`${paused ? 'Play' : 'Pause'} animation: ${label}`}
      >
        {paused ? 'Play' : 'Pause'}
      </button>
    </span>
  );
}
