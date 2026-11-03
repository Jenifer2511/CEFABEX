# Current verification

The storytelling revision is checked with the production build, geometry tests and Chromium interaction suites.

- `npm test`: scroll-stage proportions, staggered gathering, inward trail travel, shared follower paths, finite forward/reverse geometry, complete glyph ordering and regressions for visible depth wraps, tangent continuity and final alignment.
- `npm run typecheck` and `npm run build`: production TypeScript and Vite checks.
- `npm run test:browser`: Chromium wheel input advances the gallery; reverse wheel input reverses it; stopping leaves both the progress value and rendered canvas unchanged. The test reaches tunnel, gathering, trail, writing, image-word hold and solid-text stages by scrolling.
- The same browser check verifies no autoplay video or gallery playback controls, undeformed native company photos, a page curl still visible after one second and lasting approximately 3.2 seconds, tablet/phone layouts without horizontal overflow, reduced motion and enquiry validation. The separate scroll-controlled product film is intentional and is covered by `test:story`.
- `node scripts/verify-pages.mjs`: checks all nine About, Services, Projects, Contact and project-detail paths at 1440 px and 390 px widths.
- `npm run test:landing`: checks image-mask progress, all three service chapters, idle stability, keyboard tab and project access, horizontal project travel/reversal, manifesto ink, all process stages, responsive stage controls, reduced motion and scene cleanup across client-side route changes.
- `npm run test:story`: covers the 1–200% loader on initial entry and reload, Home links, progression through the seven-plane carousel and its Previous control, thread route length, content-stop holds, clear crossing bands, FAQ remeasurement and idle stability, film seeking forward/backward and holding while idle, native 3840 × 2160 decoding through the quality selector, five service rows, ambient pause/resume, tablet/phone layouts, reduced-motion manual carousel control and browser errors.

Screenshots are stored in the ignored artifacts directory. Visual review covers the opening, trail, image-word, final text, flat company photographs, page curl, carousel, film, service content and people sections. An independent review identified the story thread crossing outgoing copy; the route was changed to use reserved 128 px desktop / 80 px phone crossing bands. The revised boundaries, ivory/navy/cobalt palette and responsive content fit were inspected directly in screenshots.

The film's dimensions, 24 fps rate, 144-frame count and six-second duration were verified with `ffprobe`; media provenance and delivery details are recorded in [NEW_MEDIA.md](NEW_MEDIA.md). The default is 720p below 700 px and 1080p on wider screens, with optional 4K. The gallery itself remains a live scroll-controlled WebGL scene, and the supplied Originkit gimbal is the separate pausable automatic animation.

Browser checks use Chromium's software WebGL renderer; physical-device GPU performance and film-seek performance have not been measured.

The taste skill's bundled inspector was unavailable; no inspector score or award recognition is claimed. Direct Chromium renders and interaction checks are the evidence.
