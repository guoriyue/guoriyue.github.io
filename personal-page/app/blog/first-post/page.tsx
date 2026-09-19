import type { Metadata } from 'next';
import Companion from '../../companion';

export const dynamic = 'force-static';
const title = 'Test post';
const description = 'A test post while my first article is in the works.';
export const metadata: Metadata = {
  title: `${title} · Mingfei Guo`,
  description,
  openGraph: {
    type: 'article',
    title,
    description,
    url: 'https://guoriyue.github.io/blog/first-post/',
    images: [],
  },
  twitter: { card: 'summary', title, description, images: [] },
};

export default function BlogPost() {
  return (
    <>
      <nav className="navigation" aria-label="Main navigation">
        <div>
          <a href="/">About</a>
          <a href="/#work">Projects</a>
          <a href="/#experience">Experience</a>
          <a href="/#education">Education</a>
          <a href="/#writing" aria-current="location">
            Blog
          </a>
        </div>
      </nav>
      <main className="blog-article" id="main">
        <a className="back-link" href="/#writing">
          ← All notes
        </a>
        <header className="post-header">
          <p className="post-label">Just testing</p>
          <h1>Test post</h1>
        </header>
        <div className="post-body">
          <p>
            This is a test post. My first article is still in the works — I’ll
            share it here when it’s ready.
          </p>
        </div>
        <a className="back-link" href="/#writing">
          ← Back to the blog
        </a>
      </main>
      <Companion />
    </>
  );
}
