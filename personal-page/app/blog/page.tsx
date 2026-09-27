import type { Metadata } from 'next';
import Companion from '../companion';
import { getPosts } from '../posts';
import BlogArchive from './archive';
import BlogNavigation from './navigation';

export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: 'Blog · Mingfei Guo',
  description:
    'Notes and tutorials on 3D graphics and AI systems. Browse articles by topic and follow each series in order.',
  alternates: { canonical: '/blog/' },
  openGraph: {
    title: 'Blog · Mingfei Guo',
    description: 'Building 3D graphics and AI systems, one idea at a time.',
    url: 'https://guoriyue.github.io/blog/',
    type: 'website',
  },
};

export default async function Blog() {
  const posts = (await getPosts()).map(({ html: _html, ...post }) => post);
  return (
    <>
      <BlogNavigation />
      <main className="blog-index" id="main">
        <BlogArchive posts={posts} />
        <footer>
          <a href="/">← About me</a>
        </footer>
      </main>
      <Companion />
    </>
  );
}
