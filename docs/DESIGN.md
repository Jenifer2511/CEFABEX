# CEFABEX — From question to signature

The opening treats an idea as a signal that becomes a company signature. A paper-white first frame carries oversized “What if.” typography. Scrolling separates the words, shifts the field to cobalt and introduces “An idea is only the beginning.” A live halftone screen then forms CEFABEX before white letters rise through individual masks inside a broad glass frame. The sequence reverses with scroll.

## Visual system

Paper `#eff3f0`, ink `#132421`, cobalt `#2038db` and cool white `#f5f8ff` define the opening. Locally hosted Geist carries both monumental display text and small controls. The transparent supplied logo remains unboxed beside the frosted navigation. Navigation, actions, the hero caption/reveal frame, company statement, process steps, FAQ and enquiry dialog use a pronounced aqua-glass material. Frosted transparency, bright beveled rims, layered reflections and bounded press ripples create the water/glass treatment. Text stays opaque and the logo remains free of a panel.

The primary project action is available from the first frame. “Pause background” stops ambient movement without freezing the scroll sequence; “Skip intro” leads directly to the company content. On phones the bottom controls simplify to pause/resume and skip. The canvas is decorative; the company name remains one semantic h1 with an accessible unsplit name.

## Live 2D background

`src/lib/signalBackground.ts` uses Canvas 2D, not WebGL or Three.js. A fixed screen of small square marks changes intensity as diagonal signal bands move slowly across it. A second small raster adds slowly moving caustic light using interference ridges. This supplies the water effect in 2D; it does not run a 3D scene or a fluid simulation. A small offscreen text mask samples the existing Geist font to form the company name during the middle of the scroll.

Ambient time and scroll progress are separate. Pausing freezes ambient time; scrolling still redraws the requested pose. Ambient rendering is capped at 30 paints per second and an 800k-pixel budget, with at most 1.5 DPR. The logical field uses 104 columns on desktop and 48 on phones. The halftone and caustics use reusable small raster buffers, composited in two image draws rather than thousands of separate canvas commands. Rendering stops offscreen and when the document is hidden. Frames, observers and context listeners are disposed on route exit.

The active opening does not import the previous Three.js engine or Originkit tunnel. LiquidGlass.tsx delegates pointer highlights and one press ripple per surface. CSS blur is capped at 18 px on desktop and 10 px on phones; reduced transparency and forced colors use opaque/system-color fallbacks. There is no additional continuous glass-animation loop. The former implementations remain available in source history. The current lazy background module is about 1.9 KB gzip, and the previous 126 KB gzip Three.js chunk is absent from the production build.

## Motion ownership

| Area | Choreography | Owner |
| --- | --- | --- |
| Opening words | Opposing horizontal exits | GSAP scroll timeline |
| Signal screen | Live water caustics/halftone, scroll-driven color and a sampled name mask | Canvas 2D |
| Company name | Vertical letter masks and signature entrance | GSAP scroll timeline |
| Company | Word-mask heading, cropped photo reveal and progressive statement emphasis | GSAP |
| Expertise | Alternating heading slides, copy rise and arrow entrances | GSAP |
| Projects | Pinned horizontal gallery on desktop; vertical crop reveals on phones | GSAP |
| Project interaction | Image magnification and arrow response | Motion for React |
| Process | Pinned changing step numbers on desktop; vertical steps on phones | GSAP |
| Questions | Sequential row entrances and native disclosure transitions | GSAP and Motion for React on separate elements |
| Other pages | Route-specific text, image and section reveals | GSAP |
| Navigation | Staggered shutters and destination typography | GSAP |

One Lenis instance integrates with GSAP's ticker and ScrollTrigger. The background follows absolute ScrollTrigger progress and synchronizes on refresh so glass layout changes and large scroll jumps cannot retain an old pose. Text uses its own scrubbed timeline. Desktop has three intended pins: opening, gallery and process. Work/process revert to vertical layouts below 1000 px width or 720 px height. Gallery controls and keyboard focus use the same Lenis instance, including interruption of an in-progress gallery movement.

## Fallbacks and content

Reduced motion removes the live canvas, smooth scrolling and pinned timelines, and shows the complete company name and static content. If Canvas 2D is unavailable or its context is lost, the opening switches to a solid, readable brand composition. Restoration redraws the current pose and refreshes pin measurements. No-JavaScript contact content remains in index.html.

Company photos, logo, contacts and project areas come from the supplied brochure. No stock models, external texture, new font, fictional endorsement or numerical performance claim was added. The original Originkit source and previous title implementations remain attributed in the asset history.

Browser checks establish responsive fit, interaction, pause/resume, resource cleanup and bounded rendering. They do not establish a frame-rate guarantee for every physical device.
