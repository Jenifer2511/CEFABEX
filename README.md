# CEFABEX

A responsive, scroll-led landing page for the CEFABEX software studio. Built with React, TypeScript and Vite, with locally hosted Geist typography and original software interface imagery.

## Develop

Use Node.js 24 or later and npm.

```sh
npm ci
npm run dev
```

Vite prints the development address. The server binds to `0.0.0.0` for cloud development. Use the existing checkout; a separate Git worktree is unnecessary.

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

`npm test` runs the deterministic scene tests: image coverage, chapter progression, inward movement and the spiral-to-word transition. `npm run build` performs TypeScript validation and writes the production site to `dist/`. `npm run preview` serves that build for local verification.

## Experience

- The user-supplied particle gimbal sits above a loader that counts from 1 to 200%.
- Three scroll chapters change the central phrase while software imagery travels inward.
- Continued scrolling gathers the image tunnel into a spiral, then resolves the tiles into CEFABEX.
- Interactive expertise tabs, the studio’s approach, FAQs and a project brief complete the page.
- Visitors can skip the introduction. Reduced motion replaces the extended camera journey with a static composition; unavailable WebGL falls back to local images.

Three.js renders the gallery with one instanced image atlas. GSAP coordinates the scene, Lenis is the sole smooth-scroll engine, and Motion handles interface transitions. No external image or font requests are required.

## Images

The site includes 112 distinct original software interface studies, three large previews and an image atlas. They are concept explorations, not client case studies. See [image provenance](docs/ASSETS.md).

The generated assets are included, so regeneration is optional:

```sh
node scripts/generate-assets.mjs
```

The generator uses the installed Playwright development dependency, Chromium at `/usr/bin/chromium`, and Python 3 with Pillow to assemble the atlas. On another machine, install Chromium and Pillow and adjust the executable path in the generator if necessary. Run `npm ci` first because the generator embeds the installed Geist font.

## Project enquiries

The project dialog validates the visitor’s name, email and brief, then provides a preview, clipboard copy and a working text-file download. It does **not** send an enquiry. No company contact address or submission backend was supplied, and no delivery is simulated. Form details remain in the current browser session.

Before launch, connect the dialog to the intended enquiry endpoint or confirmed company contact destination. For an endpoint integration, keep delivery credentials server-side, validate submitted fields on the server, add abuse protection, and show success only after the endpoint confirms acceptance. Add the actual privacy notice and contact details when that delivery route is established.

## Browser verification

After building and starting the preview server on port 4173, run `npm run test:browser`. The script checks desktop, tablet, mobile, all five scene stages, expertise tabs, form validation, brief download, FAQs, mobile navigation and reduced motion. It saves screenshots to the ignored `artifacts/` directory. Override `TARGET_URL` and `CHROMIUM_PATH` for other environments.
