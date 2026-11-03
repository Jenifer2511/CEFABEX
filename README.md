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

## The scroll-controlled image journey

After the loader exits, GSAP ScrollTrigger maps the sticky introduction's scroll distance to a single WebGL scene. Lenis smooths wheel input. There is no clock driving the gallery: stop scrolling and it holds; scroll backward and it reverses.

- First 37% of the scroll: inward tunnel travel with three phrase changes.
- Next 12%: the same image cards gather into a trail in a staggered wave.
- Next 25%: the assembled trail travels inward.
- Next 20%: followers travel along the same curved bridge and glyph route, filling CEFABEX.
- Final 6%: the image arrangement holds, then resolves into solid text using the same mesh and a glyph mask.

The timeline constants in src/lib/journey.ts are relative scroll units, not seconds. The duration depends on the visitor's input. One persistent instanced mesh keeps the same image identities throughout. All image cards are flat planes. The desktop renderer uses a higher-resolution atlas when supported; smaller screens use the lighter atlas. A skip link bypasses the journey, and reduced motion presents a short static opening.

## Page and content motion

Internal navigation captures the outgoing viewport locally with html-to-image and peels it away using the supplied Poster Page Curl's cylindrical WebGL shader. The page turn lasts 3.2 seconds, with fold travel adjusted to remain visible through the turn. Native history and back/forward navigation are supported. Reduced motion bypasses the curl.

Company photos and project previews are native, undeformed images. GSAP provides restrained masked word reveals and supporting copy entrances; Motion handles menus, phrases and the enquiry dialog. Supporting images do not bulge, warp or scale on hover. WebGL failure retains static content and functional navigation.

## Landing-page scroll scenes

The story continues beyond the opening:

- Company photographs open through rectangular masks as their sections enter.
- A sticky expertise stage progresses through web, app and software chapters. Images wipe into place while the copy changes. Tabs remain usable with a pointer or arrow keys.
- The large manifesto stays in view while its words resolve in reading order.
- Desktop scrolling moves horizontally through all five brochure project areas. Phones and tablets get a stacked collection with image-mask reveals.
- A pinned desktop process stage advances its large counter, active step and progress line. Smaller screens use a vertical process sequence.
- Headings, FAQ rows, the contact section and footer lettering respond directly to scroll position.

All these scenes use GSAP ScrollTrigger and the existing Lenis instance. Scrubbed effects hold and reverse with scroll; none are timed playback. Reduced motion shows static, readable content and ordinary service tabs. Short viewports use natural-flow layouts instead of the service hold. No additional image deformation or animation dependency is introduced.

## Verify

```sh
npm test
npm run typecheck
npm run build
# With the production preview running on port 4173:
npm run test:browser
npm run test:landing
node scripts/verify-pages.mjs
```

The six unit tests cover relative scroll stages, staggered gathering, shared-route following, forward/reverse geometry and glyph ordering. The browser script checks actual wheel control, idle stability, reverse scrolling, all six scene stages, flat photographs, the visible slow curl, responsive layouts, reduced motion and enquiry validation. The route script checks all nine company/project paths at desktop and phone widths. Screenshots are saved to the ignored artifacts directory. Set TARGET_URL or CHROMIUM_PATH for the main browser script when needed.

The landing browser script checks chapter progression, masked photos, idle stability, horizontal travel and reversal, keyboard project access, the manifesto, process stages, responsive controls, reduced motion and cleanup across client-side navigation.

## Images and company material

The 112 software interface images, three previews and both atlases are included locally. Regeneration is optional: `node scripts/generate-assets.mjs`. It uses Playwright, Chromium at /usr/bin/chromium, Python 3 and Pillow. See docs/ASSETS.md for provenance.

The project pages distinguish the documented SMARTSEA BELT milestone from broader accessibility, agriculture, IoT and student/prototype development areas. No unsupported technical specifications, results or testimonials have been added.

## Enquiries

The dialog validates a brief and supports preview, copy, download and opening an email draft to cefabex.cfb@gmail.com. The visitor must send the email in their email app. There is no server-side submission or simulated delivery. Form details stay in the current browser session. Connect an approved backend if automatic submission is required.
