# Mingfei Guo — personal website

Live at https://guoriyue.github.io/.

## Development

Use Node.js 22.13 or newer:

    npm ci
    npm run dev

## Content

- `app/content.ts`: publication and public project records
- `app/page.tsx`: biography, approved TinyTriton teaser, and future blog block
- `app/companion.tsx`: interactive pixel border collie
- `app/globals.css`: responsive theme and reduced-motion behavior
- `public/`: portrait, original generated collie artwork, and social card

## Deployment

`npm run build` statically exports the site to `dist/client/`. GitHub Actions builds and publishes this directory on pushes to `main`; pull requests receive build and type checks. The site needs no server or secrets at runtime.

The root Astro template is retained as legacy source and is not deployed by this workflow.

## Visual design

Mizuiro blue and white, Arial/Helvetica typography, and section-specific pixel illustrations. The 28px border collie follows mouse movement, stops at rest, and is disabled for touch pointers and reduced-motion preferences. Run its motion checks with `node --experimental-strip-types --test scripts/collie-motion.test.mjs`.

Generated artwork: `collie-sprite.png` (tiny right-facing black-and-white pixel border collie); `section-art.png` (six blue-and-white pixel illustrations: telescope, computer, toolbox, books, notebook, weather); `og.png` (blue-and-white card with the exact name and NVIDIA role). Research thumbnails are figures from the linked papers: arXiv 2604.18468, 2308.10905, 2205.02162, and 2103.05944.
