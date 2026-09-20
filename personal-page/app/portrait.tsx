'use client';

import { useEffect, useState } from 'react';

const photos = [
  { src: '/portrait.jpg', position: '50% 50%' },
  { src: '/portraits/x-2073991697978266100.jpg', position: '82% 45%' },
  { src: '/portraits/x-profile.jpg', position: '50% 50%' },
  { src: '/portraits/x-2028395242450501674.jpg', position: '50% 25%' },
];

export default function Portrait() {
  const [photo, setPhoto] = useState(photos[0]);

  useEffect(() => {
    let previous: string | null = null;
    try {
      previous = sessionStorage.getItem('portrait-last');
    } catch {
      // The portrait still works when browser storage is unavailable.
    }
    const candidates = photos.filter((item) => item.src !== previous);
    const next = candidates[Math.floor(Math.random() * candidates.length)];
    const image = new Image();
    let active = true;
    image.onload = () => {
      if (!active) return;
      setPhoto(next);
      try {
        sessionStorage.setItem('portrait-last', next.src);
      } catch {
        // Remembering the previous photo is optional.
      }
    };
    image.src = next.src;
    return () => {
      active = false;
    };
  }, []);

  return (
    <img
      className="portrait"
      src={photo.src}
      alt="Mingfei Guo"
      width="240"
      height="240"
      style={{ objectPosition: photo.position }}
    />
  );
}
