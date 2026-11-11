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

The homepage follows “Engineered Light”: an original Three.js chrome C sculpture aligns and separates with scroll before the cinematic CEFABEX name reveal. The company chapter uses photographic and word reveals; expertise uses alternating row choreography; projects form a pinned desktop gallery; the process unfolds through changing step numbers. Phones receive vertical work/process layouts. Motion for React handles project interactions and native FAQ details. Selected controls retain a restrained water-glass finish.

GSAP is the primary motion system. One Lenis instance integrates with its ticker and ScrollTrigger. Route-specific shutters connect the pages, while About, Services, Projects and Contact use different text/media reveals. The gallery includes previous/next controls and brings focused projects into view. Menus, enquiries and page changes share scroll locks.

The Three.js scene is lazy-loaded, has an adaptive pixel budget, draws only when its pose changes, pauses offscreen/hidden, and disposes resources on exit. Context recovery rebuilds its studio lighting. Reduced motion receives complete static content, native scrolling and direct navigation, with no GPU scene or pins. The transparent company logo and brochure photographs are retained. See [docs/DESIGN.md](docs/DESIGN.md) for motion ownership and [docs/SKILL_APPLICATION.md](docs/SKILL_APPLICATION.md) for the requested skill workflows.

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

The browser suite covers the pinned/reversible name reveal, idle/offscreen WebGL, page transitions, repeated route entry, project links, FAQ, enquiry validation, mobile navigation, responsive overflow and reduced motion. `test:landing` checks the scroll scene and WebGL fallback; `test:story` checks route-specific reveals and navigation cleanup. Set `TARGET_URL` and `CHROMIUM_PATH` as needed. Screenshots and temporary files live in ignored `work/`.

`npm test` retains geometry regression tests for the historical image-gallery implementation. Those modules are not part of the current landing page. Earlier gallery and film assets remain locally available; their provenance is recorded in [docs/ASSETS.md](docs/ASSETS.md) and [docs/NEW_MEDIA.md](docs/NEW_MEDIA.md).

## Enquiries

The dialog validates a brief and supports preview, copy, download and opening an email draft to cefabex.cfb@gmail.com. The visitor sends it in their email app. There is no server-side submission or simulated delivery. Form details stay in the current browser session.
