'use client';

import { useEffect, useRef } from 'react';

export default function Demo({
  src,
  poster,
  label,
}: {
  src: string;
  poster: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduced.matches) {
          void video.play().catch(() => {});
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    const change = () => {
      if (reduced.matches) video.pause();
    };
    reduced.addEventListener('change', change);
    return () => {
      observer.disconnect();
      reduced.removeEventListener('change', change);
    };
  }, []);
  return (
    <video
      ref={ref}
      className="demo"
      src={src}
      poster={poster}
      aria-label={label}
      muted
      loop
      playsInline
      controls
      preload="none"
    />
  );
}
