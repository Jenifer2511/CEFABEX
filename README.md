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

`npm test` runs four deterministic checks for chapter sequencing, inward camera travel, spiral radius and equal arc spacing. `npm run build` performs TypeScript validation and writes the production site to `dist/`. `npm run preview` serves that build for local verification.

## Experience

- The user-supplied particle gimbal sits above a loader that counts from 1 to 200%.
- Three scroll chapters change the central phrase while software imagery travels inward.
- The same images gather from the tunnel into a flowing serpentine trail, move inward, and assemble into the CEFABEX wordmark.
- Interactive expertise tabs, the studio’s approach, FAQs and a project brief complete the page.
- Visitors can skip the introduction. Reduced motion replaces the extended camera journey with a static composition; unavailable WebGL falls back to local images.

One Three.js scene retains every image identity through the tunnel, gathering trail and word formation. GSAP coordinates the scene, Lenis is the sole smooth-scroll engine, and Motion handles interface transitions. No external image or font requests are required.

## Images

The site includes 112 distinct original software interface studies, three large previews and an image atlas. They are concept explorations, not client case studies. See [image provenance](docs/ASSETS.md).

The generated assets are included, so regeneration is optional:

```sh
node scripts/generate-assets.mjs
```

The generator uses the installed Playwright development dependency, Chromium at `/usr/bin/chromium`, and Python 3 with Pillow to assemble the atlas. On another machine, install Chromium and Pillow and adjust the executable path in the generator if necessary. Run `npm ci` first because the generator embeds the installed Geist font.

## Project enquiries

The project dialog validates the visitor’s name, email and brief, then provides a preview, clipboard copy, text-file download and an email-composer link to cefabex.cfb@gmail.com from the supplied company PDF. The visitor must send the email from their email app; there is no server-side submission or simulated delivery. Form details remain in the current browser session.

Before launch, connect the dialog to the intended enquiry endpoint or confirmed company contact destination. For an endpoint integration, keep delivery credentials server-side, validate submitted fields on the server, add abuse protection, and show success only after the endpoint confirms acceptance. Add the actual privacy notice and contact details when that delivery route is established.

## Browser verification

After building and starting the preview server on port 4173, run `npm run test:browser`. The script checks desktop, tablet, mobile, all five scene stages, expertise tabs, form validation, brief download, FAQs, mobile navigation and reduced motion. It saves screenshots to the ignored `artifacts/` directory. Override `TARGET_URL` and `CHROMIUM_PATH` for other environments.

## Connected pages and unified motion

The site now includes /about, /services, /projects, /contact and five /projects/:slug detail pages. All content is grounded in the supplied company brochure; the project pages distinguish specific milestones from broader project areas. Native links connect the pages. Static hosting must send unknown application routes to index.html (a Netlify _redirects file is included).

The intro uses one Three.js InstancedMesh. Persistent image IDs gather from the tunnel walls into an open serpentine trail and then move to font-sampled word targets. A final glyph mask trims the same mesh into smooth typography. There are no crossfaded tunnel/spiral layers or separate name overlay.

Run node scripts/verify-pages.mjs against the production preview to check every page at desktop and phone widths.
