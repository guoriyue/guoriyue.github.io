export type PortraitPhoto = { src: string; position: string };

// This self-contained function is also emitted inline beside the image. It runs
// before the React bundle loads, so refreshes do not wait for hydration to choose.
export function rotatePortrait(photos: PortraitPhoto[]) {
  const image = document.getElementById('portrait') as HTMLImageElement | null;
  if (!image || image.dataset.rotationStarted) return;
  image.dataset.rotationStarted = 'true';
  const key = 'portrait-last';
  let localLast: string | null = null;
  let tabLast: string | null = null;
  let historyLast: string | null = null;
  try {
    localLast = localStorage.getItem(key);
  } catch {}
  try {
    tabLast = sessionStorage.getItem(key);
  } catch {}
  try {
    historyLast = history.state?.__portraitLast ?? null;
  } catch {}
  const previous = historyLast || tabLast || localLast;
  // Exclude this tab's last photo and the most recent one in another tab.
  let candidates = photos.filter(
    (photo) => photo.src !== previous && photo.src !== localLast,
  );
  if (!candidates.length)
    candidates = photos.filter((photo) => photo.src !== previous);
  if (!candidates.length) candidates = [...photos];
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  let attempt = 0;
  function showNext() {
    const photo = candidates[attempt++];
    if (!photo) {
      // Keep a usable portrait if every alternative failed to load.
      image!.onerror = null;
      image!.onload = null;
      const fallback =
        photos.find((item) => item.src === previous) || photos[0];
      image!.style.objectPosition = fallback.position;
      image!.src = fallback.src;
      return;
    }
    image!.onload = () => {
      try {
        localStorage.setItem(key, photo.src);
      } catch {}
      try {
        sessionStorage.setItem(key, photo.src);
      } catch {}
      try {
        const state = history.state;
        history.replaceState(
          {
            ...(state && typeof state === 'object' ? state : {}),
            __portraitLast: photo.src,
          },
          '',
        );
      } catch {}
    };
    image!.onerror = showNext;
    image!.style.objectPosition = photo.position;
    image!.src = photo.src;
  }
  showNext();
}
