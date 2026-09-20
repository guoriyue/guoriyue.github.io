import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { marked } from 'marked';

export type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  html: string;
};

const postsDirectory = join(process.cwd(), 'content', 'posts');

// Front matter is a small `key: value` block; a full YAML parser is not needed.
function parseFrontMatter(source: string) {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(source);
  const fields: Record<string, string> = {};
  if (!match) return { fields, body: source };
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':');
    if (separator === -1) continue;
    fields[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  return { fields, body: source.slice(match[0].length) };
}

export async function getPost(slug: string): Promise<Post> {
  const source = await readFile(join(postsDirectory, `${slug}.md`), 'utf8');
  const { fields, body } = parseFrontMatter(source);
  return {
    slug,
    title: fields.title ?? slug,
    date: fields.date ?? '',
    description: fields.description ?? '',
    html: await marked.parse(body, { gfm: true }),
  };
}

export async function getPosts(): Promise<Post[]> {
  const entries = await readdir(postsDirectory);
  const posts = await Promise.all(
    entries
      .filter((name) => name.endsWith('.md'))
      .map((name) => getPost(name.slice(0, -3))),
  );
  return posts.sort((a, b) => b.date.localeCompare(a.date));
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
