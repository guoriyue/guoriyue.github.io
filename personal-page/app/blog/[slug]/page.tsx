import type { Metadata } from 'next';
import Companion from '../../companion';
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
      <nav className="navigation" aria-label="Main navigation">
        <div>
          <a href="/">About</a>
          <a href="/#work">Projects</a>
          <a href="/#experience">Experience</a>
          <a href="/#education">Education</a>
          <a href="/#personal">Personal</a>
          <a href="/#writing" aria-current="location">
            Blog
          </a>
        </div>
      </nav>
      <main className="blog-article" id="main">
        <article>
          <header className="post-header">
            <a className="back-link" href="/#writing">
              ← Blog
            </a>
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
