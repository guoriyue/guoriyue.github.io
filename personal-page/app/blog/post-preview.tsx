import type { Post } from '../posts';

export type PostSummary = Omit<Post, 'html'>;

export function topicId(label: string) {
  return `topic-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

export function seriesId(series: string) {
  return `series-${series.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

export function formatDate(date: string) {
  if (!date) return '';
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function PostMetadata({ post }: { post: PostSummary }) {
  return (
    <div className="post-metadata">
      <a className="topic-badge" href={`/blog/#${topicId(post.label)}`}>
        {post.label}
      </a>
      {post.series ? (
        <a className="series-link" href={`/blog/#${seriesId(post.series)}`}>
          {post.series}
        </a>
      ) : null}
      {post.part !== undefined ? (
        <span>{post.part === 0 ? 'Series overview' : `Step ${post.part}`}</span>
      ) : null}
    </div>
  );
}

export default function PostPreview({
  post,
  grouped = false,
}: {
  post: PostSummary;
  grouped?: boolean;
}) {
  return (
    <li className="post-list-item">
      {grouped ? (
        <div className="article-kicker">
          {post.part !== undefined ? (
            <span className="part-badge">
              {post.part === 0 ? 'Overview' : `Step ${post.part}`}
            </span>
          ) : null}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
      ) : (
        <PostMetadata post={post} />
      )}
      <h3>
        <a href={`/blog/${post.slug}/`}>
          <span>{post.title}</span>
          {grouped ? (
            <span className="article-arrow" aria-hidden="true">
              ↗
            </span>
          ) : null}
        </a>
      </h3>
      {!grouped ? (
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      ) : null}
      {post.description ? <p>{post.description}</p> : null}
    </li>
  );
}
