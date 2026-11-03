# Scroll-driven image journey

The gallery responds to scroll position throughout. It has no elapsed-time driver, playback controls or video. Lenis owns smooth scrolling; GSAP ScrollTrigger maps the sticky section's scroll range to `progress.current`. The WebGL renderer reads that value. Identical progress produces identical geometry, and idle frames are not rendered again. Pointer movement does not alter image positions.

The constants in `src/lib/journey.ts` describe relative scroll units:

| Interval | Scene behavior |
| --- | --- |
| 0–15 | Inward tunnel travel; phrases change at 0, 5 and 10 |
| 15–20 | The existing image cards gather in a staggered wave |
| 20–30 | The common trail travels inward |
| 30–38 | Every follower traverses the same curved bridge and ordered glyph route |
| 38–39 | Image cards hold their CEFABEX arrangement |
| 39–40.5 | The same material darkens, and a high-resolution glyph mask resolves the word |

These are not seconds. Visitors determine the pace and can reverse the sequence. The desktop section spans eight viewport heights; small screens use seven. Reduced motion bypasses the long section, loader, WebGL gallery and smooth scrolling.

One instanced mesh retains fixed image identities. Cards use planar geometry without vertex displacement. The 112 software interface studies are packed into a shared atlas: 7168 × 2560 on supported desktop devices, 3584 × 1280 otherwise. Mipmaps and anisotropic filtering improve readability at oblique tunnel angles.

Company photographs and project previews remain native images. The global photo-deformation renderer has been removed. There is no bulging, pointer deformation or hover enlargement. GSAP handles masked heading entrances and short supporting-copy reveals; Motion handles phrases, menus, previews and dialogs.

Navigation uses the supplied Poster Page Curl's cylindrical WebGL shader, adapted to the actual outgoing page. A page turn takes 3.2 seconds. Fold travel is calibrated to the viewport diagonal so it remains visible during the turn. Incoming titles enter after the peel has begun revealing the new route. Reduced motion and unavailable WebGL use immediate navigation.

Company copy, project areas, logo and photographs remain sourced from the supplied brochure.

## Motion after the opening

The landing page now has a sequence of distinct scroll scenes, rather than one animated opening followed by reveal-only sections:

| Section | Scroll behavior | Fallback |
| --- | --- | --- |
| Company story | Offset rectangular photo masks and heading reveals | Full native photographs |
| Expertise | Sticky web → app → software chapters; copy shifts and image wipes | Ordinary accessible service tabs on short viewports or reduced motion |
| Manifesto | Sticky large type with words resolving in reading order | Fully visible text in normal flow |
| Project collection | Vertical input traverses all five project areas horizontally | Stacked project links and photo masks on tablet/phone |
| Process | Large counter, active step and progress line advance together | Vertical steps on smaller screens |
| FAQ, contact and footer | Scrubbed row, heading and lettering reveals | Fully visible semantic content |

GSAP owns each scene. Lenis remains the only smooth-scroll engine; tab and keyboard navigation use the same instance, with immediate jumps for keyboard selection. All scrubbed timelines use direct progress without a trailing playback clock. Each match-media context reverts its transforms, triggers and pin spacers on route changes or motion-preference changes.

The expertise content remains focusable and labeled as tabs and tabpanels. Project links can be reached by keyboard; focusing an offscreen project moves its rail into view. All existing enquiry, routing and page-curl behavior remains available. Native images stay planar and unscaled.
