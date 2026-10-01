'use client';

import GitHubButton from 'react-github-btn';

export default function GitHubStars({ url }: { url: string }) {
  return (
    <span className="github-stars">
      <GitHubButton
        href={url}
        data-icon="octicon-star"
        data-show-count="true"
        data-size="large"
        data-color-scheme="light"
        aria-label={`Star ${url.replace('https://github.com/', '')} on GitHub`}
      >
        Star
      </GitHubButton>
    </span>
  );
}
