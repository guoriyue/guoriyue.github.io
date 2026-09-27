'use client';

import { useEffect, useState } from 'react';
import PostPreview, { seriesId, topicId } from './post-preview';
import type { PostSummary } from './post-preview';

export default function BlogArchive({ posts }: { posts: PostSummary[] }) {
  const [selected, setSelected] = useState('');
  const labels = [...new Set(posts.map((post) => post.label))].sort();
  useEffect(() => {
    const sync = () => setSelected(window.location.hash.slice(1));
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  const activeLabel = labels.find((label) => topicId(label) === selected);
  const visible = posts.filter(
    (post) => !activeLabel || post.label === activeLabel,
  );
  const series = [...new Set(visible.map((post) => post.series))];

  return (
    <>
      <nav className="topic-filters" aria-label="Filter articles by topic">
        <a href="#all" aria-current={!activeLabel ? 'true' : undefined}>
          All <span>{posts.length}</span>
        </a>
        {labels.map((label) => (
          <a
            key={label}
            href={`#${topicId(label)}`}
            aria-current={activeLabel === label ? 'true' : undefined}
          >
            {label}{' '}
            <span>{posts.filter((post) => post.label === label).length}</span>
          </a>
        ))}
      </nav>
      <output className="archive-count">
        {visible.length} {visible.length === 1 ? 'article' : 'articles'}
        {activeLabel ? ` in ${activeLabel}` : ' across all topics'}
      </output>
      <div className="archive-series">
        {series.map((name) => {
          const articles = visible
            .filter((post) => post.series === name)
            .sort(
              (a, b) =>
                (a.part ?? Infinity) - (b.part ?? Infinity) ||
                b.date.localeCompare(a.date) ||
                a.title.localeCompare(b.title),
            );
          return (
            <section
              className="series-section"
              key={name}
              id={seriesId(name || 'other-writing')}
              aria-labelledby={`${seriesId(name || 'other-writing')}-title`}
            >
              <header className="series-heading">
                <div className="series-context">
                  {[...new Set(articles.map((post) => post.label))].map(
                    (label) => (
                      <a
                        className="series-topic"
                        key={label}
                        href={`#${topicId(label)}`}
                      >
                        {label}
                      </a>
                    ),
                  )}
                  <span>
                    {articles.length}{' '}
                    {articles.length === 1 ? 'article' : 'articles'}
                  </span>
                </div>
                <h2 id={`${seriesId(name || 'other-writing')}-title`}>
                  {name || 'Other writing'}
                </h2>
              </header>
              <ul className="post-list">
                {articles.map((post) => (
                  <PostPreview key={post.slug} post={post} grouped />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
