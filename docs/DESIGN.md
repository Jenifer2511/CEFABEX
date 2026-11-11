# CEFABEX — From a spark to a working idea

The CEFABEX name itself is the three-dimensional opening. Seven extruded Geist glyphs emerge from a dispersed particle field; an emissive sweep travels across them before they settle into a polished metallic title. A custom optical pass adds bloom, a horizontal lens streak, chromatic separation, a single expanding shockwave and restrained film grain. The user controls the sequence in both directions or presses Play the reveal for a 4.2 second Lenis-driven title ident. Replaying restarts the sequence. Navigation, an immediate project action and an exploration link remain available without completing it.

## Identity

Graphite `#0b1116`, silver `#dce7ec`, glacial blue `#80c9e6` and a light neutral `#f1f3f2` extend the existing blue chrome company mark. Geist is self hosted. Large, left aligned typography, flat fields and documentary company photographs carry the content. The original opaque logo is preserved; `public/company/logo-transparent.webp` is the background-removed derivative generated from that exact asset and optimized for the header. Its alpha channel is real transparency.

## Page sequence

Home: pinned identity reveal, company introduction, five service areas, three documented project areas, process, questions and contact invitation. About uses word lifts and a scrubbed photograph. Services uses lateral word reveals and alternating section entrances on graphite. Projects pairs perspective image entrances with large editorial text. Contact uses a slower rotational word lift and cascading contact details on silver. Project detail pages retain the full brochure descriptions and related links.

All photographs and business details remain from the provided company brochure. The WebGL lettering is built from a seven-character subset of the existing Geist font at weight 600. The subset and its OFL license are bundled in src/assets. There are no downloaded VFX textures or stock images; the particle field and optical pass are original shaders. No new claims, customers, endorsements or awards are introduced.

## Motion ownership

- `MotionRuntime.tsx` owns the only Lenis instance. Its RAF is advanced by GSAP's ticker and its scroll event updates ScrollTrigger.
- `BrandJourney.tsx` owns the pinned, reversible homepage timeline. `brandScene.ts` owns its lazy-loaded Three.js WebGL renderer. Seven glyph meshes and one GPU particle cloud form the title. A scene pass, one optical shader pass and the output color transform compose the finish. DPR is capped at 1 on small screens and 1.15 elsewhere; a second cap limits the framebuffer to 600,000 pixels on phones and 1.5 million pixels on larger screens. There is no continuous render loop: scroll, pointer and resize request a single frame. Rendering pauses offscreen, when hidden and during context loss; all resources dispose when Home unmounts.
- `SiteMotion.tsx` owns one-time content entrances. Accessible names stay intact while decorative word spans are hidden from assistive technology. Scoped GSAP contexts and ScrollTriggers revert at route changes.
- `SiteRouter.tsx` owns page switching with five GSAP curtain panels. Services enters laterally, Projects opens from the side, Contact opens from the center and About uses a vertical lift. No outgoing page screenshot is captured. Browser history, focus and anchor navigation remain functional.
- CSS owns hover, focus, tap, menu icon and FAQ answer states. `ProjectDialog.tsx` owns dialog and field entrances. A shared lock prevents scroll behind navigation, menus and dialogs.

Reduced motion destroys the smooth-scroll engine, bypasses pinning, WebGL, splitting and transition curtains, and shows the complete static brand name. Changes to the preference are observed during a session. WebGL failure leaves semantic content, scroll-driven name lettering and all controls functional. Scrollbar measurements refresh after fonts and images load.

## Validation limits

Browser checks and measurements use headless Chromium with software WebGL, not a physical phone GPU. These checks establish behavior, cleanup, idle rendering and responsive fit; they are not a guarantee of a particular frame rate on every device. Historical gallery, page-curl and film components remain in the source and public asset history but are not imported by the current entry point.


## Liquid glass layer

The requested water-inspired glass treatment is concentrated on the navigation capsule, primary actions, exploration links, company introduction, process panels, FAQ rows, contact panel and enquiry dialog. Translucent blue tints, specular edge highlights, static caustic gradients and bounded backdrop blur create the material. The logo stays transparent and the large editorial sections retain the underlying graphite/silver palette.

`LiquidGlass.tsx` delegates pointer input to one listener and requests one animation frame for a moving highlight. Press ripples run for 850 ms, with at most one per surface, and remove themselves. Dynamic enquiry result controls receive the same material via a child-list observer; the observer, listeners, pending frame and ripples clean up on navigation. Text itself is not distorted. This is CSS glass and a water-inspired highlight/ripple treatment, not a fluid simulation or an additional WebGL rendering pass.

Desktop blur is capped at 14 px and mobile blur at 8 px. Form fields avoid nested backdrop filters. Reduced motion suppresses pointer highlights and ripples; reduced transparency substitutes solid materials, and forced-colors mode uses system colors. Browsers without backdrop filtering retain the tinted surfaces and contrast. No new dependency, image asset or permanent animation loop is introduced by the glass layer.


## Title layout and fallback

The former two-column “Ideas into impact” hero and abstract C arcs have been replaced with a full-screen, name-led title composition. The 3D name uses one line on desktop and two balanced lines, CEFA / BEX, on phones. Supporting copy and project/skip controls are available from the first frame. The three scroll phases are Ignite, Form and Emerge. The optical effects are rendered live in the browser in an After Effects-style title sequence; this implementation does not contain an Adobe After Effects project or prerecorded video.

A semantic HTML h1 provides the same company name while WebGL loads, on failure/context loss, and under reduced motion. The font subset was derived locally from the project's self-hosted Geist variable font using fontTools; the original font is unchanged. The existing company logo, page content and liquid-glass treatment remain in place.
