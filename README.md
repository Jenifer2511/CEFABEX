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

The homepage uses the supplied Originkit Endless Tunnel Square shader as a pinned scroll sequence: enter the tunnel, travel through it, then reveal CEFABEX. The actual shader source is preserved in `src/vendor/originkit/`; its clock-based motion is replaced with absolute scroll progress. Stopping holds the frame and reverse scrolling reverses the scene. No timed playback or autoplay remains. Company background, services, documented projects, process and questions follow the reveal. A water-inspired liquid-glass layer styles navigation, actions and selected panels.

GSAP choreographs distinct text and image entrances on each page. Five lightweight curtain panels handle page changes with route-specific directions, without viewport screenshots. One Lenis instance integrates with the GSAP ticker and ScrollTrigger. Menus, enquiry dialogs and page changes share scroll locks. Reduced-motion users receive a complete static opening, native scrolling and direct navigation.

The tunnel is lazy-loaded, uses one WebGL2 fullscreen triangle and a bounded/adaptive pixel budget. It draws only when its pose changes, pauses when hidden or offscreen, and cleans up on route exit. The current opening does not load the previous Three.js title engine. The transparent company logo and original source asset are both retained. See [docs/DESIGN.md](docs/DESIGN.md) for attribution, scroll mapping, motion ownership and limitations.

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
