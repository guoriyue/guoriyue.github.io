'use client';

import GitHubButton from 'react-github-btn';
import { useSyncExternalStore } from 'react';

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}

function currentTheme() {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export default function GitHubStars({ url }: { url: string }) {
  const theme = useSyncExternalStore(subscribeToTheme, currentTheme, () => 'dark');
  return (
    <span className="github-stars">
      <GitHubButton
        key={theme}
        href={url}
        data-icon="octicon-star"
        data-show-count="true"
        data-size="large"
        data-color-scheme={theme}
        aria-label={`Star ${url.replace('https://github.com/', '')} on GitHub`}
      >
        Star
      </GitHubButton>
    </span>
  );
}
