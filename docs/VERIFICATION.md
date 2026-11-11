# Current verification

The current graphite / silver / glacial-blue revision uses GSAP, Lenis and a lazy-loaded Three.js homepage scene. Historical loader/gallery/page-curl/film checks have been replaced with tests for the current experience.

- `npm run build`: TypeScript and production Vite build pass. The WebGL scene is emitted as a separate lazy-loaded chunk; internal pages do not load it on direct entry.
- `npm run test:browser`: verifies the pinned company-name reveal and reverse scrolling, completed lettering, idle/offscreen GPU inactivity, visible first-screen CTA, FAQ expansion, invalid/valid enquiry preparation, all main page curtains, current navigation, repeated route entry, project-detail navigation and browser Back. Checks 1440, 768, 390 and 320 px layouts for overflow. Tests the mobile menu focus trap and Escape restoration, plus static reduced motion.
- `npm run test:landing`: production-preview checks for deliberately lost WebGL context, no WebGL from startup, readable company-name resolution, the same-page exploration anchor, live changes to reduced motion and a no-JavaScript contact path.
- `npm run test:story`: production-preview checks for route-specific curtains, completed scroll-revealed footer lettering, no orphaned pins on company pages, browser Back during a page transition, unlocked scrolling and restored main focus.
- `node scripts/verify-pages.mjs`: all nine company/project routes at 1440 and 390 px, correct titles, no horizontal overflow and no runtime errors.
- The optimized 599 × 400 logo asset has an actual alpha range of 0–255, including 132,428 fully transparent pixels. The original logo asset is retained.
- `git diff --check`: no whitespace errors.

Screenshots are recorded in ignored `work/`. Visual review covers desktop and mobile openings, the fully resolved name, and all main company-page introductions. The same-page hash navigation lock found during fallback testing was fixed and regression-tested. Interrupted page transitions were also tested through browser history.

Chromium uses SwiftShader for WebGL in this environment. Checks establish responsive fit, correct interactions and bounded rendering. They do not establish a physical device's GPU frame rate. The current title uses seven extruded glyph meshes and one particle cloud, followed by a bounded optical pass and the output transform. Resolution has a DPR cap and a 600k/1.5m pixel budget; all frames are requested on demand, it pauses while hidden/offscreen and disposes on route exit.

No numerical design-inspector score, hardware frame-rate guarantee or award recognition is claimed. The design follows the cinematic-site skill alongside the landing-page design guidance; asset provenance and motion ownership are recorded in [DESIGN.md](DESIGN.md).

## Liquid glass revision

The glass layer was inspected in desktop/mobile screenshots, including the navigation, contact panel, mobile menu and enquiry dialog. A focused Chromium check verified pointer-following highlights, the newly mounted enquiry-result controls, self-removing press ripples, mobile overflow and suppressed ripples under reduced motion. The production build passes; no dependency or WebGL pass was added. See the liquid-glass section in [DESIGN.md](DESIGN.md) for material and fallback details.


## Name-led title revision

The opening now centers the company name as actual extruded 3D lettering. Desktop screenshots were inspected at scroll positions 0%, 25%, 50% and 85%, with mobile checks at 0%, 50% and 85%. The opening, particle formation and finished silver title use different visual states. The fallback suite additionally checks the 4.2-second Play the reveal control and that replay restarts from the beginning, before testing GPU loss, initial GPU unavailability, anchor navigation and live reduced motion.

The 3D font is a locally derived, licensed Geist subset rather than a downloaded font or image. No Adobe project, stock VFX clip or hardware frame-rate claim is implied by the After Effects-style compositing.
