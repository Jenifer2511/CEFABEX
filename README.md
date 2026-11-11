# CEFABEX

A cinematic company website built with React, TypeScript, Vite, GSAP, Lenis and Three.js. The graphite, silver and glacial blue identity draws from the supplied company logo. Company content, photographs, contacts and project areas come from the supplied brochure.

## Development

Use Node.js 24 or later. Use the existing checkout; cloud tasks are isolated, so do not create a Git worktree unless explicitly requested.

```sh
npm ci
npm run dev
npm run build
npm run preview -- --port 4173
```

Static hosting must route application paths to `index.html`. Vercel and Netlify rewrite configuration is included. Routes include Home, About, Services, Projects, Contact and five project detail pages.

## Current experience

The homepage pins a Three.js C-shaped aperture while scroll reveals the CEFABEX name. The sequence reverses with scroll, and the project enquiry and exploration link are available immediately. The rest of the homepage covers company background, services, documented projects, process and questions.

GSAP choreographs distinct text and image entrances on each page. Five lightweight curtain panels handle page changes with route-specific directions, without viewport screenshots. One Lenis instance integrates with the GSAP ticker and ScrollTrigger. Menus, enquiry dialogs and page changes share scroll locks. Reduced-motion users receive a complete static opening, native scrolling and direct navigation.

WebGL is loaded only for the homepage, uses three draw calls and capped resolution, and renders only when its pose changes. It pauses when hidden or offscreen and cleans up when navigating away. The background-removed company logo is served as a transparent WebP; the original remains in the assets. See [docs/DESIGN.md](docs/DESIGN.md) for motion ownership, identity, provenance and performance limits.

## Verify

```sh
npm run build
# Start the preview on port 4173, then:
npm run test:browser
npm run test:landing
npm run test:story
node scripts/verify-pages.mjs
```

The browser suite covers the pinned/reversible name reveal, idle/offscreen WebGL, page transitions, repeated route entry, project links, FAQ, enquiry validation, mobile navigation, responsive overflow and reduced motion. `test:landing` checks the scroll scene and WebGL fallback; `test:story` checks route-specific reveals and navigation cleanup. Set `TARGET_URL` and `CHROMIUM_PATH` as needed. Screenshots and temporary files live in ignored `work/`.

`npm test` retains geometry regression tests for the historical image-gallery implementation. Those modules are not part of the current landing page. Earlier gallery and film assets remain locally available; their provenance is recorded in [docs/ASSETS.md](docs/ASSETS.md) and [docs/NEW_MEDIA.md](docs/NEW_MEDIA.md).

## Enquiries

The dialog validates a brief and supports preview, copy, download and opening an email draft to cefabex.cfb@gmail.com. The visitor sends it in their email app. There is no server-side submission or simulated delivery. Form details stay in the current browser session.
