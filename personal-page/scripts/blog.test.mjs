import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { getPosts } from '../app/posts.ts';

const exported = (path) => readFile(`dist/client/${path}`, 'utf8');

test('every published article is reachable from the static blog archive', async () => {
  const posts = await getPosts();
  const html = await exported('blog/index.html');
  for (const post of posts) {
    assert.ok(html.includes(`href="/blog/${post.slug}/"`), post.slug);
    const article = await exported(`blog/${post.slug}/index.html`);
    assert.ok(article.includes('class="topic-badge"'));
    assert.ok(article.includes('href="/blog/"'));
  }
});

test('homepage links to the blog without embedding article previews', async () => {
  const html = await exported('index.html');
  assert.ok(html.includes('href="/blog/"'));
  assert.ok(!html.includes('<section id="writing"'));
  assert.ok(!html.includes('class="post-list-item"'));
});

test('blog archive and all articles are included in the sitemap', async () => {
  const sitemap = await exported('sitemap.xml');
  assert.ok(sitemap.includes('<loc>https://guoriyue.github.io/blog/</loc>'));
  for (const post of await getPosts()) {
    assert.ok(
      sitemap.includes(
        `<loc>https://guoriyue.github.io/blog/${post.slug}/</loc>`,
      ),
    );
  }
});
