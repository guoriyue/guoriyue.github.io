import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const SITE = 'https://guoriyue.github.io';
const OUTPUT = 'dist/client';

// Vinext redirects nested routes during prerender with trailingSlash enabled.
// Render without that redirect, then provide GitHub Pages directory indexes.
async function addDirectoryIndexes(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await addDirectoryIndexes(path);
    } else if (entry.name.endsWith('.html') && entry.name !== 'index.html') {
      const destination = path.slice(0, -5);
      await mkdir(destination, { recursive: true });
      await copyFile(path, join(destination, 'index.html'));
    }
  }
}
await addDirectoryIndexes(join(OUTPUT, 'blog'));

// List every directory index as a canonical trailing-slash URL.
async function collectPages(directory, pages = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('_')) {
      await collectPages(path, pages);
    } else if (entry.name === 'index.html') {
      const route = relative(OUTPUT, directory).split(sep).join('/');
      pages.push(route ? `${SITE}/${route}/` : `${SITE}/`);
    }
  }
  return pages;
}
const pages = (await collectPages(OUTPUT)).sort((a, b) => a.localeCompare(b));
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages.map((url) => `  <url><loc>${url}</loc></url>`),
  '</urlset>',
  '',
].join('\n');
await writeFile(join(OUTPUT, 'sitemap.xml'), sitemap);
