# Mingfei Guo — personal website

Live at https://guoriyue.github.io/.

## Development

Use Node.js 22.13 or newer:

    npm ci
    npm run dev

Checks: `npm run lint`, `npm run typecheck`, and `npm test` (run `npm run build`
first; the portrait test reads the exported HTML).

## The sheepdog field

`app/herding.ts` is the simulation, kept free of the DOM so it can be tested
directly. Sheep are boids — separation, cohesion, alignment, plus fleeing the
dog and keeping off the fences. The collie follows Strömbom's shepherding
model: gather whichever sheep has left the flock, then push the whole flock
from directly behind, on the line to the pen. It commits to a stray until that
sheep is properly back, because re-picking the farthest one every frame makes
the dog flip between two strays and move neither.

The pen is a full-height paddock along the left fence. A pen that floats off
the wall leaves corners a sheep can be pushed into but never out of, and the
run stalls. `scripts/herding.test.mjs` covers those failure modes and herds 36
full flocks to make sure a round always finishes; the page also reshuffles
after 25 seconds without progress.

Moving the pointer over the field takes the lead from the collie, and the
cursor companion hides while you are in there so there is only ever one dog.
The field carries no caption or controls: it runs itself, scattering a fresh
flock a moment after the last sheep is penned.

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
- `app/sheepdog.tsx`, `app/herding.ts`: the sheepdog field in the Personal section
- `app/page-motion.tsx`: scroll reveals and active navigation tab
- `app/globals.css`: mizuiro theme and reduced-motion behavior
- `public/`: portraits, project and research media, pixel artwork, icons, and social card

## Deployment

`npm run build` statically exports the site to `dist/client/`; `scripts/prepare-pages.mjs`
adds directory indexes so nested blog routes work on GitHub Pages. The site needs no
server or secrets at runtime.

`public/robots.txt`, a generated `sitemap.xml`, canonical URLs, and Person JSON-LD
are emitted for search engines. After each deploy, CI runs `npm run indexnow`,
which submits every page to IndexNow (Bing, DuckDuckGo, Yandex); the key is the
`public/<key>.txt` file. Google does not support IndexNow — it needs the site
registered once in Google Search Console.

This repository has no remote of its own. It is mirrored into the `personal-page/`
directory of https://github.com/guoriyue/guoriyue.github.io, whose GitHub Actions
workflow builds that directory and publishes it to GitHub Pages on every push to `main`.
