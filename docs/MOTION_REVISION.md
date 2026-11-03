# Scroll-driven image journey

The opening gallery responds to scroll position throughout. It has no elapsed-time driver, playback controls or video. The later product-film section is separate and does not replace the WebGL gallery. Lenis owns smooth scrolling; GSAP ScrollTrigger maps the sticky section's scroll range to `progress.current`. The WebGL renderer reads that value. Identical progress produces identical geometry, and idle frames are not rendered again. Pointer movement does not alter image positions.

The constants in `src/lib/journey.ts` describe relative scroll units:

| Interval | Scene behavior |
| --- | --- |
| 0–15 | Inward tunnel travel; phrases change at 0, 5 and 10 |
| 15–20 | The existing image cards gather in a staggered wave |
| 20–30 | The common trail travels inward |
| 30–38 | Every follower traverses the same curved bridge and ordered glyph route |
| 38–39 | Image cards hold their CEFABEX arrangement |
| 39–40.5 | The same material darkens, and a high-resolution glyph mask resolves the word |

These are not seconds. Visitors determine the pace and can reverse the sequence. The desktop section spans eight viewport heights; small screens use seven. The particle-gimbal loader runs from 1 to 200% each time the Home route mounts or reloads, with a skip control and readiness timeout. Reduced motion bypasses the long section, loader, WebGL gallery and smooth scrolling. Desktop, mobile and company-page navigation include Home.

One instanced mesh retains fixed image identities. Cards use planar geometry without vertex displacement. The 112 software interface studies are packed into a shared atlas: 7168 × 2560 on supported desktop devices, 3584 × 1280 otherwise. Mipmaps and anisotropic filtering improve readability at oblique tunnel angles.

As each image starts gathering, its tunnel source depth continues inward without wrapping. This prevents partially gathered cards from jumping back to the front. The trail eases its inward travel at both joins, matches its tangent to the shared letter route and settles each image from a fixed tangent into its final text alignment. These changes preserve the same image identities throughout the sequence.

Company photographs and project previews remain native images. The global photo-deformation renderer has been removed. There is no bulging, pointer deformation or hover enlargement. GSAP handles masked heading entrances and short supporting-copy reveals; Motion handles phrases, menus, previews and dialogs.

Navigation uses the supplied Poster Page Curl's cylindrical WebGL shader, adapted to the actual outgoing page. A page turn takes 3.2 seconds. Fold travel is calibrated to the viewport diagonal so it remains visible during the turn. Incoming titles enter after the peel has begun revealing the new route. Reduced motion and unavailable WebGL use immediate navigation.

Company copy, project areas, logo and photographs remain sourced from the supplied brochure. The current ivory/navy/cobalt palette supersedes the earlier white/black-only direction; image planes remain undeformed.

## Motion after the opening

The landing page now has a sequence of distinct scroll scenes, rather than one animated opening followed by reveal-only sections:

| Section | Scroll behavior | Fallback |
| --- | --- | --- |
| Capability carousel | Seven flat perspective planes advance through software and engineering capabilities | Previous/Next and keyboard controls; natural flow below 740 px viewport height; one flat active panel for reduced motion |
| Story thread | A cobalt SVG route advances between measured section stops, pausing at each | Omitted for reduced motion, together with its extra crossing bands |
| Company story | Offset rectangular photo masks and heading reveals | Full native photographs |
| Expertise | Sticky web → app → software chapters; copy shifts and image wipes | Ordinary accessible service tabs on short viewports or reduced motion |
| Product film | Scroll seeks an original six-second film forward or backward across three copy chapters | Static poster for reduced motion or media failure |
| Service index and company proof | Headings and supporting copy reveal around detailed services, team images and documented milestones | Fully visible semantic content and native images |
| Manifesto | Sticky large type with words resolving in reading order | Fully visible text in normal flow |
| Project collection | Vertical input traverses all five project areas horizontally | Stacked project links and photo masks on tablet/phone |
| Ambient gimbal | Supplied Originkit Particle Gimbal runs automatically near the viewport, independently of scroll | Explicit pause/resume control; static for reduced motion |
| Process | Large counter, active step and progress line advance together | Vertical steps on smaller screens |
| FAQ, contact and footer | Scrubbed row, heading and lettering reveals | Fully visible semantic content |

GSAP coordinates the scroll scenes. Lenis remains the only smooth-scroll engine; tab and keyboard navigation use the same instance, with immediate jumps for keyboard selection. All scrubbed timelines use direct progress without a trailing playback clock. The ambient gimbal is the explicit, pausable automatic-motion exception. Each match-media context reverts its transforms, triggers and pin spacers on route changes or motion-preference changes.

The story thread travels down the side gutters before crossing inside reserved empty margins above the next section: 128 px on desktop and 80 px below 600 px. This route keeps its thick stroke clear of the outgoing section's copy and controls. Its geometry is rebuilt when ScrollTrigger refreshes, so pinned section lengths are included.

The film lazy-loads near the viewport and seeks to the latest scroll progress after metadata or seek completion. It never calls playback. Delivery defaults to 1280 × 720 below 700 px viewport width and 1920 × 1080 otherwise; the visible quality selector also offers the native 3840 × 2160, 24 fps master. Changing quality reapplies the current scroll position after metadata loads. All versions contain the same original six-second motion study, without audio. [NEW_MEDIA.md](NEW_MEDIA.md) records dimensions, frame counts, provenance and the external-sourcing limitations.

The expertise content remains focusable and labeled as tabs and tabpanels. The capability carousel offers Previous/Next, arrow keys and Home/End keys, with a polite status announcement for manual selections. Project links can be reached by keyboard; focusing an offscreen project moves its rail into view. All existing enquiry, routing and page-curl behavior remains available. Native content images stay planar and unscaled; the carousel moves whole flat panels in perspective.
