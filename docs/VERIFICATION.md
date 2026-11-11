# Engineered Light verification

## Production build

`npm run build` typechecks TypeScript and produces the Vite build. The main script is approximately 164 KB gzip, the lazy Three.js engine about 126 KB gzip and the scene wrapper about 2.8 KB gzip. Vite reports its default 500 KB raw-chunk advisory for the separately lazy-loaded Three.js engine. CSS is approximately 16 KB gzip. No new dependencies were added.

## Behavior checks

The production build and all four suites passed. The final responsive polish was also checked at 390 × 640, 320 × 640, 390 × 500 and 844 × 390, including CTA visibility, overflow, a matching final scroll pose and valid GL state.

- `npm run test:landing`: actual wheel input advances the scene; exact canvas captures hold during idle and pointer movement; reverse wheel input reverses progress. Covers context loss/restoration, a redrawn pose with valid GL state, initial WebGL failure, visible brand-poster fallback, skip navigation, live reduced motion and no-JavaScript contact content.
- `npm run test:chapters`: checks horizontal project progression and reversal, pinned stage position, next-project control, keyboard interruption of gallery scrolling and visibility of the last project, process-number progression, phone unpinning, overflow and live reduced-motion cleanup.
- `npm run test:browser`: checks company-name conceal/reveal/reversal, actual GPU draws, matching poses after a large scroll jump, idle/offscreen inactivity, forms, page transitions, repeated route entry, exactly three desktop pins, project-detail navigation, menu focus, responsive layouts at 1440/768/390/320 px and reduced motion.
- `npm run test:story`: checks route curtains, footer lettering, interrupted browser history, main-content focus and cleanup on non-home pages.

Use `TARGET_URL` to select the production preview and `CHROMIUM_PATH` if the Chromium executable differs. Screenshots and temporary review scripts are under ignored `work/`.

## Visual review

The first pass captured desktop hero phases 0%, 28%, 50%, 80% and 97%, company/services/projects/process/FAQ chapters, and 768/390 px opening, name and project states. Review corrected the mobile sculpture scale/position, name text clipping, company-heading width, portrait milestone composition and a 320 px FAQ overflow. The canvas now follows the parent timeline and explicitly synchronizes on scrub completion, including rapid scroll jumps. The final checks include desktop/phone name completion and compact viewport fit.

Chromium runs software WebGL in this environment. These checks verify behavior and bounded rendering, not a physical-device frame-rate guarantee. All hero animation remains scroll-driven; the renderer is inactive at rest and offscreen. Reduced motion receives the complete static content without any pin or canvas.
