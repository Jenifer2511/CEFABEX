# CEFABEX

A cinematic company website built with React, TypeScript, Vite, Three.js, GSAP, Lenis and Motion. Company content, logo, photos, contact details and project areas come from the supplied brochure. Original software interface studies provide the image collection and a native 4K product film. The current visual system uses ivory, navy ink and cobalt, with self-hosted Geist typography.

## Development

Use Node.js 24 or later. Use the existing checkout; cloud tasks are isolated, so do not create a Git worktree unless explicitly requested.

```sh
npm ci
npm run dev
npm run build
npm run preview -- --port 4173
```

The production build includes routes for Home, About, Services, Projects, Contact and five project-detail pages. Home is available in desktop and mobile navigation and from the company pages. Static hosting must route application paths to index.html; Netlify and Vercel rewrite configuration is included.

## The scroll-controlled image journey

The particle-gimbal loader counts from 1 to 200% on each Home route entry or reload, with a skip control and a readiness timeout. Reduced motion bypasses it. After the loader exits, GSAP ScrollTrigger maps the sticky introduction's scroll distance to a single WebGL scene. Lenis smooths wheel input. There is no clock driving the gallery: stop scrolling and it holds; scroll backward and it reverses. The later product film is a separate section and does not replace this live WebGL gallery.

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

- A seven-plane capability carousel rotates flat image panels through web, mobile, business platforms, commerce, cloud, connected systems and prototyping. Scroll advances it on sufficiently tall viewports; Previous/Next and keyboard controls remain available, with screen-reader announcements for manual changes.
- A cobalt story thread follows a measured route between the real sections and pauses at content stops. Its side-to-side crossings use reserved empty bands: 128 px on desktop and 80 px on phones, keeping the stroke clear of copy and controls.
- Company photographs open through rectangular masks as their sections enter.
- A sticky expertise stage progresses through web, app and software chapters. Images wipe into place while the copy changes. Tabs remain usable with a pointer or arrow keys.
- A separate six-second original product film seeks forward and backward with scroll. It defaults to 720p below 700 px and 1080p on wider screens; its quality control offers a native 3840 × 2160 version. It has no audio or autoplay. Reduced motion and media failure show a still image.
- Five detailed service areas explain concrete outputs, followed later by team photography, the SMARTSEA BELT milestone, technical validation and the two company registrations from the brochure.
- The large manifesto stays in view while its words resolve in reading order.
- Desktop scrolling moves horizontally through all five brochure project areas. Phones and tablets get a stacked collection with image-mask reveals.
- An ambient Particle Gimbal adapted from the supplied Originkit code provides a deliberately automatic motion moment, with an explicit pause/resume control and a static reduced-motion state.
- A pinned desktop process stage advances its large counter, active step and progress line. Smaller screens use a vertical process sequence.
- Headings, FAQ rows, the contact section and footer lettering respond directly to scroll position.

GSAP ScrollTrigger and the existing Lenis instance coordinate the scroll scenes. Scrubbed effects and film frames hold and reverse with scroll; the explicitly pausable ambient gimbal is automatic. Reduced motion shows static, readable content, ordinary service tabs and a manually controlled carousel. Short viewports use natural-flow layouts instead of the service and carousel holds. No additional image deformation or animation dependency is introduced.

## Verify

```sh
npm test
npm run typecheck
npm run build
# With the production preview running on port 4173:
npm run test:browser
npm run test:landing
npm run test:story
node scripts/verify-pages.mjs
```

The geometry tests cover relative scroll stages, staggered gathering, shared-route following, forward/reverse geometry, glyph ordering and continuity when images leave the tunnel, join the letter route and settle into text. The browser script checks actual wheel control, idle stability, reverse scrolling, all six scene stages, flat photographs, the visible slow curl, responsive layouts, reduced motion and enquiry validation. The route script checks all nine company/project paths at desktop and phone widths. Screenshots are saved to the ignored artifacts directory. Set TARGET_URL or CHROMIUM_PATH for the main browser script when needed.

The landing browser script checks chapter progression, masked photos, idle stability, horizontal travel and reversal, keyboard project access, the manifesto, process stages, responsive controls, reduced motion and cleanup across client-side navigation.

The story browser script covers the returning loader, Home navigation, seven-plane carousel, thread progress, scroll-film seeking and reversal, native 4K decoding, service content, the ambient pause control, responsive layouts and reduced motion. These are coverage descriptions; see [docs/VERIFICATION.md](docs/VERIFICATION.md) for the current verification status.

## Images and company material

The 112 software interface images, three previews and both atlases are included locally. Regeneration is optional: `node scripts/generate-assets.mjs`. It uses Playwright, Chromium at /usr/bin/chromium, Python 3 and Pillow. See docs/ASSETS.md for provenance.

The new product film and large editorial images were rendered locally from original interface studies. [docs/NEW_MEDIA.md](docs/NEW_MEDIA.md) records source dimensions, native 4K rendering, delivery versions and provenance. External Originkit and stock-footage requests were blocked by the environment's network policy; the site uses previously supplied Originkit code and original media rather than claiming a newly fetched effect or clip.

The project pages distinguish the documented SMARTSEA BELT milestone from broader accessibility, agriculture, IoT and student/prototype development areas. No unsupported technical specifications, results or testimonials have been added.

## Enquiries

The dialog validates a brief and supports preview, copy, download and opening an email draft to cefabex.cfb@gmail.com. The visitor must send the email in their email app. There is no server-side submission or simulated delivery. Form details stay in the current browser session. Connect an approved backend if automatic submission is required.
