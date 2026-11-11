# Signal-screen verification

## Build

`npm run build` typechecks TypeScript and builds the app. The main script is approximately 163 KB gzip, CSS 13.7 KB gzip and the lazy 2D background 1.6 KB gzip. No Three.js engine chunk is emitted or requested by the active site. No new dependency was installed.

## Checks

The production build and all four browser suites passed for this revision.

- `npm run test:landing`: actual wheel progression/reversal, exact paused canvas captures, scroll changes while ambient animation is paused, canvas context events, unavailable Canvas 2D, skip navigation, live reduced motion and no-JavaScript contact content.
- `npm run test:chapters`: reversible horizontal gallery, controls, keyboard interruption/visibility, process progression, phone unpinning, overflow and reduced-motion cleanup.
- `npm run test:browser`: concealed/final/reversed name, matching pose after a large jump, no WebGL draws, live canvas activity, pause/resume, offscreen inactivity, no glass surfaces, forms, routes, repeated navigation, project details, mobile menu, 1440/768/390/320 px layouts and reduced motion.
- `npm run test:story`: route curtains, footer lettering, interrupted browser history, main-content focus and cleanup.

The context-event check dispatches Canvas 2D loss/restoration events to exercise application recovery; it does not claim to force a physical-device graphics failure. Screenshots and temporary visual review scripts are under ignored work/.

## Visual review

Desktop phases 0%, 28%, 50%, 80% and 97% and tablet/phone opening, name and project states are reviewed. Compact 390 × 640 and 844 × 390 frames check first-screen CTA visibility and overflow. The first frame uses paper/ink typography, while the reveal resolves to white on cobalt. Navigation, controls and enquiry surfaces have no backdrop blur or water effect.

The live background intentionally changes while idle. Its pause control, hidden-document/offscreen behavior and reduced-motion fallback are part of the experience. The company-name sequence remains bound to scroll.
