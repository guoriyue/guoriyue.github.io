import type { Metadata } from 'next';
import Companion from '../../companion';
import { getPost, getPosts } from '../../posts';
import { formatDate, PostMetadata } from '../post-preview';
import BlogNavigation from '../navigation';

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
    <>
      <BlogNavigation />
      <main className="blog-article" id="main">
        <article>
          <header className="post-header">
            <a className="back-link" href="/blog/">
              ← Blog
            </a>
            <PostMetadata post={post} />
            <h1>{post.title}</h1>
            {post.date ? (
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            ) : null}
          </header>
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>
      </main>
      <Companion />
    </>
  );
}
