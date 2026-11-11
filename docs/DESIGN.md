# CEFABEX — Enter / Travel / Reveal

The opening is **CEFABEX Liquid Glass Corridor**, a custom visual variation derived from the user-supplied **Endless Tunnel Square — Originkit** code. Curved glass ribs, refracted studio bands and spiral light trails fill a pinned viewport. Scrolling travels through the corridor and turns it gradually; during the final section the scene dims and CEFABEX resolves letter by letter. Scrolling backwards reverses the whole sequence. Stopping holds the exact frame. There is no timed playback button, autoplay loop or pointer-driven scene motion.

## Source and adaptation

Reference: https://www.originkit.dev/components/endless-tunnel-square

The supplied component is retained, with normalized line endings, in `src/vendor/originkit/EndlessTunnelSquare.source.txt`. Its original fragment and vertex shaders and advanced defaults are extracted in `endlessTunnelShader.ts`. The preserved fragment matches the supplied source; the active fragment is the custom variation in `src/lib/glassCorridorShader.ts`. The normalized original source SHA-256 is `07f995c0a32dd1d2c2c5e9b3740f327b38dd3818eb82a592b823f4394ff56a4b`.

`src/lib/originkitTunnel.ts` replaces the component's wall-clock accumulators with absolute scroll functions. The zoom spans 14 mapping steps across the first 78% of the journey, with a gentler turn from the same progress. The custom fragment replaces square tiles with continuous undulating ribs. Analytic reflection/refraction, water caustics and three helical light rails give the glass depth without textures or extra passes. The optical axis bends slightly with scroll and is repositioned for phone screens. Colors are deep marine `#050c13`, cyan `#77cadb`, cool silver `#e8f9ff` and pearl `#e8dbc6`. There is no clock, glow pulse or pointer uniform. The original fixed 1200 × 800 minimum dimensions are replaced with responsive canvas sizing.

The previous custom 3D metallic title is no longer imported by the application. The current effect uses native WebGL2 and one fullscreen-triangle draw, without a Three.js engine, particle cloud or postprocessing chain.

## Composition

- Enter: “Step into what’s next” introduces the journey; project and skip controls are immediately available.
- Travel: the introductory copy recedes, leaving the flowing ribs and light rails to carry the movement. A brief “A different perspective” waypoint accompanies the journey.
- Reveal: the tunnel fades back and CEFABEX emerges from its vanishing point with perspective/scale travel, staggered letter assembly, two outline echoes and a brief horizontal light streak. A text-clipped silver light sweep completes the name, then the company signature appears.

The name stays hidden until the final phase, except when a static fallback is required. The mobile name stays on one line and the lower controls fit the viewport. Short landscape screens use a shorter stage and smaller opening copy.

## Motion and performance

One Lenis instance, advanced through GSAP's ticker, updates ScrollTrigger. `BrandJourney.tsx` owns the pin, reverse scrubbing, copy and company-name timeline. `originkitTunnel.ts` owns GL resources and submits frames only for scroll, resize or visibility/context recovery. The canvas pauses offscreen and when the document is hidden. The pixel budget is 260,000 on phones and 720,000 on larger screens, with a further adaptive reduction after consistently late active frames. Text and controls stay at full CSS resolution.

The GL program, shaders, vertex buffer and VAO are cleaned up on route exit. Context restoration rebuilds GPU resources and rebinds uniforms. GPU failure and reduced motion show a readable static company name. Reduced motion also bypasses pinning and Lenis, while native navigation remains usable.

## Existing identity and site

Graphite `#0b1116`, silver `#dce7ec`, ice blue `#80c9e6` and neutral `#f1f3f2` remain the palette. The company's background-removed logo stays transparent. Company photographs and business details remain from the supplied brochure. About, Services, Projects, Contact and project-detail content retain their layouts, GSAP entrances and route transitions.

The liquid-glass layer remains on navigation, actions, selected panels and the enquiry dialog. `LiquidGlass.tsx` delegates pointer highlights and brief press ripples without a continuous loop. Desktop blur is capped at 14 px and mobile blur at 8 px; reduced transparency and forced-colors modes have solid/system-color fallbacks.

## Verification limits

Headless Chromium uses software WebGL. Browser checks establish source integration, responsive fit, scrolling, fallback behavior and idle resource use; they do not establish a physical device's GPU frame rate. No award recognition or universal frame-rate guarantee is claimed.


## Cinematic name finish

The company-name choreography is retained from the preceding revision. All title effects share the same reversible ScrollTrigger timeline: there are no autoplay sequences or repeating CSS effects. The heading remains one accessible h1; decorative echo and sheen copies are hidden from assistive technology. The light sweep is clipped to the lettering and runs only during the concluding scroll interval. Reduced motion, GPU failure and forced colors suppress the decorative layers and show a complete, stationary name. The new corridor adds no canvas, dependency or render loop.
