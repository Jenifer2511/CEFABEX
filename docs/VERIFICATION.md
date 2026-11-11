# Current verification — Liquid-glass scroll sequence

The opening uses a custom curved-glass fragment derived from the user-supplied Originkit mapping. The original component and extracted shaders remain unchanged in the vendor directory. The production TypeScript/Vite build passes. The corridor adapter is a separate lazy chunk of about 3.3 KB gzipped; the previous Three.js title engine is not part of this opening's bundle. The active canvas identifies itself as `cefabex-liquid-glass-corridor`, with `originkit-derived` provenance.

## Browser checks

The production build, tunnel/fallback suite and full browser suite passed for this integration.

- `npm run test:landing`: actual wheel input advances the shader, the canvas holds exactly while idle and while moving the pointer, and reverse wheel input reverses progress. It also exercises GPU context loss/restoration, a redrawn pose with valid restored resources, initial WebGL unavailability, the skip anchor, live reduced motion and the no-JavaScript contact fallback.
- `npm run test:browser`: checks the tunnel source marker, the initially concealed company name, pinned viewport, completed name reveal, reversed name concealment, actual GL draws, idle/offscreen GPU inactivity, enquiry validation, main-page transitions, repeated route entry, project-detail navigation, mobile menu focus, responsive overflow and reduced motion. Viewports include 1440, 768, 390 and 320 px widths.
- `npm run test:story` retains the route curtain, footer and interrupted browser-history checks. Other company pages and their transition implementation were not changed by this integration.

## Visual inspection

Desktop frames at 0%, 25%, 50% and 85% and mobile frames at 0%, 50% and 85% show the new glass corridor, scroll-driven travel and the concluding name reveal. Curved ribs, cyan reflections and pearl light trails replace the original square tile pattern. The name finishes by 97% of the pinned interval. Compact 390 × 640 portrait and 844 × 390 landscape layouts retain the previously checked CTA positioning. Screenshots are saved under ignored `work/`.

## Performance and limitations

The adapter uses one fullscreen-triangle draw and no textures or postprocessing. It has a 260k-pixel phone budget and 720k-pixel larger-screen budget, with a further quality reduction after a run of late active frames. It does not run an idle animation loop. Programs, shaders, buffers, vertex arrays, event listeners and observers are disposed or rebuilt at the appropriate lifecycle boundaries.

Chromium uses SwiftShader in this environment. Checks establish behavior, responsive fit and bounded rendering, not a guaranteed physical-device frame rate. No award recognition or hardware performance guarantee is claimed. Source attribution, scroll mapping and retained branding are described in [DESIGN.md](DESIGN.md).


## Cinematic name finish

The preceding title revision was inspected at desktop progress 62%, 70%, 80%, 90% and 98%, and mobile progress 70%, 80% and 98%. Its idle composition, mobile fit and static reduced-motion heading were verified. This background revision retains that title choreography; the new corridor and retained name effects share the existing scroll progress.
