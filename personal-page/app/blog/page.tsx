import type { Metadata } from 'next';
import { formatDate, getPosts } from '../posts';

export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: 'Blog · Mingfei Guo',
  description: 'Notes and tutorials on 3D graphics and AI systems.',
  alternates: { canonical: '/blog/' },
  openGraph: {
    title: 'Blog · Mingfei Guo',
    description: 'Building 3D graphics and AI systems, one idea at a time.',
    url: 'https://guoriyue.github.io/blog/',
    type: 'website',
  },
};

export default async function Blog() {
  return (
    <ul className="post-list">
      {(await getPosts()).map((post) => (
        <li key={post.slug}>
          <span className="post-meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.series ? ` • ${post.series}` : null}
          </span>
          <h3>
            <a className="post-link" href={`/blog/${post.slug}/`}>
              {post.title}
            </a>
          </h3>
        </li>
      ))}
    </ul>
  );
}
