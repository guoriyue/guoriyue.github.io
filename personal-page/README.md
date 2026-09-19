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

Mizuiro blue and white, Arial/Helvetica typography, and section-specific pixel illustrations. The 56px border collie puppy head follows mouse movement, stops at rest, and is disabled for touch pointers and reduced-motion preferences. Run its motion checks with `node --experimental-strip-types --test scripts/collie-motion.test.mjs`.

Generated artwork: `collie-puppy-head.png` (front-facing black-and-white pixel border collie puppy head, generated with the built-in image tool); `section-art.png` (six blue-and-white pixel illustrations: telescope, computer, toolbox, books, notebook, weather); `og.png` (blue-and-white card with the exact name and NVIDIA role). Research thumbnails are figures from the linked papers: arXiv 2604.18468, 2308.10905, 2205.02162, and 2103.05944.

Puppy asset prompt (built-in imagegen): A single extra-cute border collie puppy HEAD ONLY, front facing, chunky crisp pixel art sprite for a website cursor companion rendered at 56 CSS pixels. Round fluffy cheeks, small floppy black ears, huge friendly dark eyes with white pixel highlights, white central forehead blaze, white muzzle, little black nose, cheerful tiny open mouth. Black and white fur, minimal pale cool-blue shading. Head fills 90-95% square canvas including ears with minimal transparent padding. True transparent background, no body, no neck, no collar, no text, no outline box, no scenery, no shadow. Simple coherent coarse 32x32 pixel-grid look, hard square edges and limited palette, no blur or texture.
