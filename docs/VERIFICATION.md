# Current verification

The current scroll revision is checked with:

- `npm test`: six passing tests for scroll-stage proportions, staggered gathering, inward trail travel, shared follower paths, finite forward/reverse geometry and complete glyph ordering.
- `npm run typecheck` and `npm run build`: production TypeScript and Vite checks.
- `npm run test:browser`: Chromium wheel input advances the gallery; reverse wheel input reverses it; stopping leaves both the progress value and rendered canvas unchanged. The test reaches tunnel, gathering, trail, writing, image-word hold and solid-text stages by scrolling.
- The same browser check verifies no video or playback buttons, undeformed native company photos, a page curl still visible after one second and lasting approximately 3.2 seconds, tablet/phone layouts without horizontal overflow, reduced motion and enquiry validation.
- `node scripts/verify-pages.mjs`: checks all nine About, Services, Projects, Contact and project-detail paths at 1440 px and 390 px widths.

Screenshots are stored in the ignored artifacts directory. The opening, trail, image-word, final text, flat company photograph and page-curl frames are inspected directly. Browser checks use Chromium's software WebGL renderer; physical-device GPU performance has not been measured.

The taste skill's bundled inspector was unavailable; no inspector score or award recognition is claimed. Direct Chromium renders and interaction checks are the evidence.
