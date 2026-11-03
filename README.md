# CEFABEX

A cinematic company website built with React, TypeScript, Vite, Three.js, GSAP, Lenis and Motion. Company content, logo, photos, contact details and project areas come from the supplied brochure. Original software interface studies provide the image collection.

## Development

Use Node.js 24 or later. Use the existing checkout; cloud tasks are isolated, so do not create a Git worktree unless explicitly requested.

```sh
npm ci
npm run dev
npm run build
npm run preview -- --port 4173
```

The production build includes routes for Home, About, Services, Projects, Contact and five project-detail pages. Static hosting must route application paths to index.html; Netlify and Vercel rewrite configuration is included.

## The timed image journey

The opening starts after the loader has fully exited:

- 0–15 seconds: images travel inward through the tunnel. Three phrases change at0,5 and10 seconds.
- 15–20 seconds: images gather into a trail in a staggered wave.
- 20–30 seconds: that trail travels inward for10 seconds.
- 30–38 seconds: each image follows the same curved bridge and glyph route, like a snake filling the letters.
- 38–39 seconds: the images hold their CEFABEX arrangement.
- 39–40.5 seconds: the same material resolves into solid text.

There is one persistent instanced mesh and a 112-image atlas. Images follow the same route through the glyphs; there is no crossfade to a second scene or independent slide into letter targets. Pause, replay and skip controls are visible. The clock pauses while hidden, offscreen, or interacting with menus or enquiries. Reduced motion presents a static opening.

## Page and content motion

Internal navigation captures the outgoing viewport locally with html-to-image and peels it away using the supplied Poster Page Curl’s cylindrical WebGL shader. Native history and back/forward navigation are supported. The original poster artwork, external sample images and lavender styling are not used.

A shared WebGL renderer gives company photos and project previews gentle depth deformation and scroll response. GSAP provides masked word reveals and staggered supporting copy. Images and navigation retain static fallbacks if WebGL is unavailable; reduced-motion preferences bypass the effects.

## Verify

```sh
npm test
npm run typecheck
npm run build
# With the production preview running on port 4173:
npm run test:browser
node scripts/verify-pages.mjs
```

The six unit tests cover exact stage durations, staggered gathering,10 second inward travel, shared-route following, finite geometry and glyph ordering. The browser script runs the full 40.5 second journey, pause/resume, actual-page curl navigation, mobile enquiry and reduced motion. The route script checks all nine company/project paths at desktop and phone widths. Screenshots are saved to the ignored artifacts directory. Set TARGET_URL or CHROMIUM_PATH when needed.

Optional: `node scripts/record-journey.mjs` records the real-time journey to artifacts/journey-preview.mp4 using Chromium’s screencast and local ffmpeg. No recording is claimed unless that file was actually produced.

## Images and company material

The112 software interface images, three previews and atlas are included locally. Regeneration is optional: `node scripts/generate-assets.mjs`. It uses Playwright, Chromium at /usr/bin/chromium, Python 3 and Pillow. See docs/ASSETS.md for provenance.

The project pages distinguish the documented SMARTSEA BELT milestone from broader accessibility, agriculture, IoT and student/prototype development areas. No unsupported technical specifications, results or testimonials have been added.

## Enquiries

The dialog validates a brief and supports preview, copy, download and opening an email draft to cefabex.cfb@gmail.com. The visitor must send the email in their email app. There is no server-side submission or simulated delivery. Form details stay in the current browser session. Connect an approved backend if automatic submission is required.
