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
