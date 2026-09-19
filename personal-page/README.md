# Mingfei Guo — personal website

Live at https://guoriyue.github.io/.

## Development

Use Node.js 22.13 or newer:

    npm ci
    npm run dev

## Content

- `app/content.ts`: publication and public project records
- `app/page.tsx`: biography, projects, publications, NuRec blog/replay, and approved TinyTriton teaser
- `app/companion.tsx`: interactive pixel border collie
- `app/globals.css`: responsive theme and reduced-motion behavior
- `public/`: portrait, original generated collie artwork, and social card

## Deployment

`npm run build` statically exports the site to `dist/client/`. GitHub Actions builds and publishes this directory on pushes to `main`; pull requests receive build and type checks. The site needs no server or secrets at runtime.

The root Astro template is retained as legacy source and is not deployed by this workflow.

## Visual design

Mizuiro accents, Arial/Helvetica typography, colorful pixel illustrations, and varied feature sizes. A single Selected Work section mixes NVIDIA contributions, apps, open-source work, and papers. NuRec leads; NyaIcon and Asset Harvester retain large previews. Older papers and small tools use compact entries, with format indicated only by links and metadata. The 32px simplified pixel border collie head follows mouse movement, stops at rest, and is disabled for touch pointers and reduced-motion preferences. Run its motion checks with `node --experimental-strip-types --test scripts/collie-motion.test.mjs`.

Generated artwork: `collie-puppy-head.png` (front-facing black-and-white pixel border collie puppy head, generated with the built-in image tool); `section-art.png` (six blue-and-white pixel illustrations: telescope, computer, toolbox, books, notebook, weather); `og.png` (blue-and-white card with the exact name and NVIDIA role). Research thumbnails are figures from the linked papers: arXiv 2604.18468, 2308.10905, 2205.02162, and 2103.05944.

Puppy asset prompt (built-in imagegen): A single extra-cute border collie puppy HEAD ONLY, front facing, chunky crisp pixel art sprite for a website cursor companion rendered at 56 CSS pixels. Round fluffy cheeks, small floppy black ears, huge friendly dark eyes with white pixel highlights, white central forehead blaze, white muzzle, little black nose, cheerful tiny open mouth. Black and white fur, minimal pale cool-blue shading. Head fills 90-95% square canvas including ears with minimal transparent padding. True transparent background, no body, no neck, no collar, no text, no outline box, no scenery, no shadow. Simple coherent coarse 32x32 pixel-grid look, hard square edges and limited palette, no blur or texture.

## Featured media

- NyaIcon screenshot: https://nyaicon.com/images/product-app-ui.webp
- Asset Harvester original demo: https://research.nvidia.com/labs/sil/projects/asset-harvester/assets/teaser.mp4
- NuRec original animation: https://developer-blogs.nvidia.com/wp-content/uploads/2026/08/figure-2-optimized.gif
- Gaussian Splatting original animation: https://github.com/guoriyue/3dgs-warp-scratch/blob/main/examples/example_train_lego.gif

Demos use looping GIF images, loaded lazily as they approach the viewport. A small pause button swaps in a still poster; reduced-motion preferences select the poster through a picture source. The NuRec article is linked with all four authors; its September 16 livestream is linked as a replay, not an upcoming event.

Colorful `public/section-art.png` generated with built-in imagegen. Prompt: six-cell 3x2 sheet of chunky pixel illustrations on pure white: blue/gold telescope, lavender/mint CRT, red toolbox, green/pink/ochre books, cream notebook and orange pencil, yellow sun and blue cloud. No text, glow, or shadows.

## Current layout

Centered sticky navigation, full-width mizuiro biography with circular portrait, centered section headings, and consistent preview-left/text-right Selected Work rows. Mobile stacks each preview above its description. The name has no decorative icon. The simplified cursor sprite is displayed at 32×32 CSS pixels; the source PNG is an enlarged pixel-art asset.

`public/collie-pixel-32.png` was generated with the built-in image tool. Prompt: tiny 32×32 game sprite, border collie head only, frontal, chunky black ears, white blaze and muzzle, dot eyes, tiny nose and pink tongue, five solid colors, transparent background; no realistic fur, gradients, glossy eyes, fine details, body, or accessories.

## Motion and companion

Blog is the final content section, after Experience and Education. `app/page-motion.tsx` adds one-time scroll reveals and a current-section navigation underline. The mizuiro introduction changes its gradient slowly; previews and links have small hover responses. Reduced-motion disables these effects, and content remains visible without JavaScript.

The 32px cursor companion uses `public/collie-actions.png`, a three-cell transparent sprite sheet: extended running stride, tucked running stride, seated. It faces its direction of travel; running switches to sitting 140ms after the last changed pointer position, stops its animation frame loop, and resumes on movement. Touch/reduced-motion users do not receive the cursor animation. Motion checks cover this idle threshold and restart, viewport boundaries, movement convergence, and stalled-frame limits.

Sprite generated with built-in imagegen: same black-and-white border collie in two right-facing running poses and one sitting pose; white blaze, ruff, paws and tail tip, semi-pricked folded ears. Correction prompt requests a coarse 24-pixel-wide chibi game sprite with flat colors and no realistic fur or shading.

## Current sections and size

Industry Work introduces NVIDIA NuRec with the user's contribution, technical blog, and replay. Projects contains NyaIcon, GPU projects, TinyTriton and open-source contributions. Publications contains Asset Harvester and the other papers. Experience, Education and the final Blog follow. The same run/sit sprite is now displayed at 40×40 CSS pixels. Additional motion includes staggered preview/text entrances, section-icon greetings, link movement, and a CSS scroll progress line where supported; reduced-motion disables these additions.

Navigation uses a compact floating white bar with a pale mizuiro active tab and color-only hover feedback. Underlines and the reading-progress line are removed. The portrait has no hover transform or transition.

Work contains NuRec and the Asset Harvester demo. Asset Harvester also remains in Publications with its full title, author list and paper link. Projects and Open-source Contributions are separate sections.

Navigation exposes About, Work, Experience, Education, and Blog. Work stays active across Work, Projects, Open Source, and Publications; their separate content headings remain. Experience and Education stack in a single column at every screen size.


Projects uses two columns above 700px and one on smaller screens. NyaIcon, 3DGS, VRL, and LangCommand have media above their descriptions; the remaining projects use compact two-column entries. VRL shows the first two rows of the original SD3.5 OCR GRPO qualitative figure, with a link to the complete unmodified image. LangCommand uses a GIF of its actual terminal recording. NyaIcon uses the full 36-second theme showcase as an 800px looping GIF. Existing MP4 paths remain available for old links, but no rendered demo uses video playback.

- VRL figure: https://github.com/guoriyue/VRL/blob/main/docs/training_examples/sd3_5_ocr_grpo/qualitative_ocr_comparison.jpg
- LangCommand recording: https://github.com/guoriyue/LangCommand/blob/main/output.gif

- NyaIcon showcase source: https://nyaicon.com/marketing/videos/nyaicon-dock-showcase-new-look-v3.mp4

Projects now leads with VRL and 3DGS, followed by compact GPU kernel, inference, compiler, and automation entries. LangCommand and NyaIcon retain looping GIFs as smaller entries at the end. Technical descriptions emphasize verified implementation details rather than benchmark claims.

Browser, shortcut, and Apple touch icons reuse the existing pixel collie head. LangCommand and NyaIcon use matching 200px desktop preview frames and equal-width cards; the section heading reads Open Source.
