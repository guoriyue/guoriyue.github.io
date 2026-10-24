import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Marked } from 'marked';

export type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  html: string;
  series: string;
  part?: number;
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

// Kramdown-style anchors: lowercase words joined by hyphens, numbered on repeat.
function slugify(html: string) {
  return html
    .replace(/<[^>]*>|&[a-z]+;|&#\d+;/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 _-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Renders the Markdown with anchored headings and puts a "Contents" list of
// the h2/h3 sections after the introduction, before the first section.
function renderArticle(body: string) {
  const headings: { depth: number; id: string; html: string }[] = [];
  const seen = new Map<string, number>();
  const markdown = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens);
        const base = slugify(html);
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        const id = count ? `${base}-${count}` : base;
        if (depth === 2 || (depth === 3 && headings.length)) {
          headings.push({ depth, id, html });
        }
        return `<h${depth} id="${id}">${html}</h${depth}>\n`;
      },
    },
  });
  const html = markdown.parse(body, { async: false });
  if (!headings.length) return html;

  let toc = '';
  let nested = false;
  for (const { depth, id, html: label } of headings) {
    const link = `<a href="#${id}">${label}</a>`;
    if (depth === 2) {
      toc += nested ? '</ul></li>' : toc ? '</li>' : '';
      toc += `<li>${link}`;
      nested = false;
    } else {
      toc += `${nested ? '' : '<ul>'}<li>${link}</li>`;
      nested = true;
    }
  }
  toc += nested ? '</ul></li>' : '</li>';
  const contents = `<p><strong>Contents</strong></p>\n<ul class="markdown-toc">${toc}</ul>\n`;
  const first = html.indexOf('<h2');
  return html.slice(0, first) + contents + html.slice(first);
}

export function formatDate(date: string) {
  if (!date) return '';
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export async function getPost(slug: string): Promise<Post> {
  const source = await readFile(join(postsDirectory, `${slug}.md`), 'utf8');
  const { fields, body } = parseFrontMatter(source);
  return {
    slug,
    title: fields.title ?? slug,
    date: fields.date ?? '',
    description: fields.description ?? '',
    html: renderArticle(body),
    series: fields.series ?? '',
    part: fields.part === undefined ? undefined : Number(fields.part),
  };
}

// Newest first; posts published together list later series parts first.
export async function getPosts(): Promise<Post[]> {
  const entries = await readdir(postsDirectory);
  const posts = await Promise.all(
    entries
      .filter((name) => name.endsWith('.md'))
      .map((name) => getPost(name.slice(0, -3))),
  );
  return posts.sort(
    (a, b) =>
      b.date.localeCompare(a.date) ||
      (b.part ?? -1) - (a.part ?? -1) ||
      a.title.localeCompare(b.title),
  );
}
