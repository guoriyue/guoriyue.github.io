import type { Metadata } from 'next';
import { formatDate, getPost, getPosts } from '../../posts';

export const dynamic = 'force-static';
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPosts()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { title, description } = await getPost(slug);
  return {
    title: `${title} · Mingfei Guo`,
    description,
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `https://guoriyue.github.io/blog/${slug}/`,
      images: [],
    },
    twitter: { card: 'summary', title, description, images: [] },
  };
}

export default async function BlogPost({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  return (
    <article className="post">
      <header className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.series ? ` • ${post.series}` : null}
        </p>
      </header>
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  );
}
