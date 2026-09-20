'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const photos = [
  { src: '/portrait.jpg', position: '50% 50%' },
  { src: '/portraits/x-2073991697978266100.jpg', position: '82% 45%' },
  { src: '/portraits/nvidia-headshot.webp', position: '50% 50%' },
  { src: '/portraits/x-2028395242450501674.jpg', position: '50% 25%' },
];
const storageKey = 'portrait-last';

export default function Portrait() {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const request = useRef(0);
  const photo = photos[index];

  const showPhoto = useCallback((nextIndex: number) => {
    const id = ++request.current;
    setLoading(true);
    const next = photos[nextIndex];
    const image = new Image();
    image.onload = () => {
      if (id !== request.current) return;
      setIndex(nextIndex);
      setLoading(false);
      try {
        localStorage.setItem(storageKey, next.src);
      } catch {
        // Keep switching manually if persistent storage is unavailable.
      }
      try {
        sessionStorage.setItem(storageKey, next.src);
      } catch {
        // Browser storage is optional.
      }
    };
    image.onerror = () => {
      if (id === request.current) setLoading(false);
    };
    image.fetchPriority = 'high';
    image.src = next.src;
  }, []);

  useEffect(() => {
    let previous: string | null = null;
    try {
      previous = localStorage.getItem(storageKey);
    } catch {
      // Fall back to the current tab's history.
    }
    if (!previous) {
      try {
        previous = sessionStorage.getItem(storageKey);
      } catch {
        // Use the first portrait if neither storage is available.
      }
    }
    const previousIndex = photos.findIndex((item) => item.src === previous);
    showPhoto((previousIndex + 1) % photos.length);
    return () => {
      request.current++;
    };
  }, [showPhoto]);

  return (
    <figure className="portrait-gallery">
      <img
        className="portrait"
        src={photo.src}
        alt="Mingfei Guo"
        width="240"
        height="240"
        fetchPriority="high"
        style={{ objectPosition: photo.position }}
      />
      <figcaption className="portrait-controls">
        <span aria-live="polite">
          {index + 1} / {photos.length}
        </span>
        <button
          type="button"
          disabled={loading}
          onClick={() => showPhoto((index + 1) % photos.length)}
          aria-label="Show next portrait"
        >
          Next photo <span aria-hidden="true">↻</span>
        </button>
      </figcaption>
    </figure>
  );
}
