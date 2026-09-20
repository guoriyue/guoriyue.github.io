# Mingfei Guo — personal website

Live at https://guoriyue.github.io/.

## Development

Use Node.js 22.13 or newer:

    npm ci
    npm run dev

Checks: `npm run lint`, `npm run typecheck`, and `npm test` (run `npm run build`
first; the portrait test reads the exported HTML).

## Writing a post

Add a Markdown file to `content/posts/` with a small front matter block:

    ---
    title: Post title
    date: 2026-09-19
    description: One line shown in the blog list.
    ---

    Body in GitHub-flavored Markdown.

The file name becomes the URL (`content/posts/my-post.md` → `/blog/my-post/`).
The home page lists posts newest first.

## Layout

- `app/page.tsx`: biography, Selected Projects, Experience, Education, Personal, and Blog
- `app/content.ts`: publication and project records
- `app/posts.ts`: reads and renders `content/posts/*.md`
- `app/blog/[slug]/page.tsx`: post page
- `app/portrait.tsx`, `app/portrait-rotation.ts`: rotating portrait
- `app/companion.tsx`, `app/collie-motion.ts`: pixel border collie cursor companion
- `app/page-motion.tsx`: scroll reveals and active navigation tab
- `app/globals.css`: mizuiro theme and reduced-motion behavior
- `public/`: portraits, project and research media, pixel artwork, icons, and social card

## Deployment

`npm run build` statically exports the site to `dist/client/`; `scripts/prepare-pages.mjs`
adds directory indexes so nested blog routes work on GitHub Pages. The site needs no
server or secrets at runtime.

This repository has no remote of its own. It is mirrored into the `personal-page/`
directory of https://github.com/guoriyue/guoriyue.github.io, whose GitHub Actions
workflow builds that directory and publishes it to GitHub Pages on every push to `main`.
