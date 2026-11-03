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
