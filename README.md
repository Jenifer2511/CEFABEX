# CEFABEX

A cinematic company website built with React, TypeScript, Vite, GSAP, Lenis and WebGL2. The graphite, silver and glacial blue identity draws from the supplied company logo. Company content, photographs, contacts and project areas come from the supplied brochure.

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

The homepage follows “From question to signature”: oversized “What if.” typography splits as you scroll, a live 2D field of halftone and water caustics shifts from paper to cobalt, and CEFABEX resolves through letter masks. The background has a pause/resume control; pausing ambient motion still allows scroll-based reveals. A strong aqua-glass material covers navigation, actions, the reveal frame, selected content panels and the enquiry dialog, with frosted depth, bright rims, pointer reflections and bounded press ripples.

GSAP is the primary motion system and one Lenis instance handles smooth scrolling. Company, services, projects and process retain distinct scroll choreography. The project gallery has previous/next controls and keyboard focus mapping; phones receive vertical work/process layouts. Motion for React handles project interactions and native FAQ details. Route-specific shutters connect the other pages.

The live background uses Canvas 2D, caps painting at 30 fps, pauses offscreen/hidden and disposes its resources on exit. The active application does not load a 3D renderer. Glass uses capped CSS blur and delegated pointer/press effects. Reduced motion receives complete static content and native scrolling, with no canvas or pins. The company logo/photos remain from the supplied brochure. See [docs/DESIGN.md](docs/DESIGN.md) and [docs/SKILL_APPLICATION.md](docs/SKILL_APPLICATION.md).

## Verify

```sh
npm run build
# Start the preview on port 4173, then:
npm run test:browser
npm run test:landing
npm run test:chapters
npm run test:story
node scripts/verify-pages.mjs
```

The browser suite covers the pinned/reversible name reveal, live background pause/offscreen cleanup, page transitions, repeated route entry, project links, FAQ, enquiry validation, mobile navigation, responsive overflow and reduced motion. `test:landing` checks the scroll scene and Canvas 2D fallback; `test:story` checks route-specific reveals and navigation cleanup. Set `TARGET_URL` and `CHROMIUM_PATH` as needed. Screenshots and temporary files live in ignored `work/`.

`npm test` retains geometry regression tests for the historical image-gallery implementation. Those modules are not part of the current landing page. Earlier gallery and film assets remain locally available; their provenance is recorded in [docs/ASSETS.md](docs/ASSETS.md) and [docs/NEW_MEDIA.md](docs/NEW_MEDIA.md).

## Enquiries

The dialog validates a brief and supports preview, copy, download and opening an email draft to cefabex.cfb@gmail.com. The visitor sends it in their email app. There is no server-side submission or simulated delivery. Form details stay in the current browser session.
