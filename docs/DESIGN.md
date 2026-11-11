# CEFABEX — Engineered Light

A kinetic C sculpture turns independent disciplines into a single identity. The opening moves from an off-center, polished form through alignment and separation, then resolves into the company name. The rest of the homepage changes composition and motion with each chapter. The goal is a professional engineering company with a cinematic first impression and a clear route to an enquiry.

## Art direction

The focal asset is an original Three.js sculpture made from three twisted, open ribbons, inspired by the C in CEFABEX's supplied logo. Silver and blue metal share a procedural studio-lighting environment. A fine orbit and a small deterministic point field support the separation phase. This replaces the repeated tunnel pattern. No external model, stock VFX, generated staff photograph or texture download is used.

The system retains locally hosted Geist and the supplied transparent logo. Deep ink `#080e14`, cool white `#f0f2f1`, silver `#dce7ec` and glacial blue `#a0d5ed` alternate between chapters. Large, light display typography and generous spacing distinguish statements from supporting copy. Glass is reserved for navigation, selected actions, the contact panel and the enquiry dialog; service rows, process content and FAQ use simpler surfaces.

The UI/UX Pro Max storytelling recommendation informs the chapter progression, accessible progress cues, responsive simplification and reduced-motion behavior. Its general technology/agency recommendation supports geometric sans typography and clear hierarchy; the existing brand determines the actual font and blue/silver palette. See [SKILL_APPLICATION.md](SKILL_APPLICATION.md) for the requested skill workflows and source details.

## Motion ownership

| Area | Choreography | Owner |
| --- | --- | --- |
| Opening | Polished C rotates, aligns, separates in depth and dissolves | Lazy Three.js scene, absolute scroll pose |
| Name reveal | Perspective entrance, staggered letters, outline echoes, horizontal light streak and clipped silver sweep | GSAP pinned timeline |
| Company | Word-mask heading, cropped photographic reveal, slow image scale and progressive statement emphasis | GSAP scroll timelines |
| Expertise | Alternating heading slides, supporting copy rise, rotating arrow entrances | GSAP row timelines |
| Projects | Desktop pinned horizontal gallery with progress line; vertical crop reveals on phones | GSAP; one scroll engine |
| Project interaction | Image magnification and arrow rotation on hover or keyboard focus | Motion for React |
| Process | Desktop pin with changing large step numbers and a progressing vertical rule; vertical step entrances on phones | GSAP |
| Questions | Sequential row entrances; native disclosure semantics and brief answer/plus transitions | GSAP rows; Motion for React inside each disclosure |
| About | Perspective word entrances, panorama parallax and photographic crop reveals | GSAP |
| Services | Lateral word entrances and alternating scrubbed section movement | GSAP |
| Projects/details | Rotated image/crop reveals and semantic heading masks | GSAP |
| Contact | Tilted word entrances and a shallow perspective settle of the contact panel | GSAP |
| Page changes | Direction-specific, staggered shutters and oversized destination typography | GSAP |
| Footer | Word entrance, then staggered company lettering | GSAP |

One Lenis instance is advanced through GSAP's ticker and updates ScrollTrigger. Motion handles separate interactive children; it does not write transforms owned by GSAP. The hero's timeline contains no timer-driven playback. Forward and backward scrolling produce the same scene pose, and stopping holds it.

Desktop has three intentional pinned chapters: opening, project gallery and process. Below 1000 px width or 720 px height, work and process use normal vertical layouts. Gallery buttons and keyboard focus map to the corresponding scroll position so clipped projects remain reachable. Native links, browser history, focus management, menus and enquiry behavior remain functional.

## Rendering and fallback

`src/lib/engineeredLightScene.ts` owns the renderer, geometry, materials, environment target, observers and listeners. Rendering is requested only for changed scroll poses, resize and visibility/context recovery. It pauses offscreen and when hidden. Pixel budgets are 360k on phones and 1M on larger screens, capped at 1.5 DPR; consecutive late active frames reduce quality further. The scene uses three ribbon meshes, a fine orbit and one small Points draw. There is no postprocessing chain, video or running idle loop.

On context loss, the old lighting target is released while its context is lost. Restoration generates a fresh environment and refreshes pin measurements before drawing the current pose. Cleanup disposes geometry, materials, environment and renderer and releases the context on route exit. The Three.js engine is a separate, cacheable lazy chunk; it is not loaded for the static reduced-motion opening.

Reduced motion bypasses Lenis and all pinned/scrubbed choreography, shows complete content and keeps native scrolling/navigation. GPU failure shows the transparent brand poster and a complete static company name. Decorative split text has an unsplit accessible name. Focus, touch targets, image dimensions, notch insets and responsive overflow follow the web interface guideline review.

## Source history and content

The supplied Originkit Endless Tunnel Square component, normalized original and extracted original shader are retained in `src/vendor/originkit/`. The previous derived liquid-glass corridor remains in source but is no longer imported by the application. Reference: https://www.originkit.dev/components/endless-tunnel-square . Original normalized SHA-256: `07f995c0a32dd1d2c2c5e9b3740f327b38dd3818eb82a592b823f4394ff56a4b`.

The company logo, photographs, contact details and documented project areas still come from the supplied company brochure. Milestone photographs are identified as milestones; they are not presented as product shots or unverified client work. No customer logos, endorsements, numerical performance claims or award recognition were invented.

Browser checks use software WebGL. They establish behavior, responsive fit, cleanup and idle rendering boundaries, not a guaranteed frame rate on every physical device.
