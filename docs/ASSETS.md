# CEFABEX image provenance

All 112 gallery images are original interface studies authored for this website. They depict software interfaces: project boards, product analytics, calendars, mobile product concepts, team messaging, commerce tools, editorial websites, music players, notes, finance apps, mobile products, file management and deployment tools.

These are concept explorations, not client projects, testimonials or evidence of delivered work. Any sample names, figures and product names exist only inside the interface studies. No third-party screenshots, stock images, customer marks or default Originkit imagery are included.

- `public/images/image-001.webp` through `image-112.webp`: 112 distinct studies, 640 × 400 pixels.
- `public/images/atlas.webp`: all 112 images in a 14-column × 8-row grid, 3584 × 1280 pixels. Each cell is 256 × 160 pixels; row-major order, starting at image 001 in the top-left corner.
- `public/images/atlas-hd.webp`: the same images and grid, 7168 × 2560 pixels, with 512 × 320 cells for supported desktop devices. This is generated from the same 640 × 400 image files.
- `web-preview.webp`, `mobile-preview.webp`, `software-preview.webp`: selected full-resolution studies, 1280 × 800 pixels.
- `public/social-cover.webp`: original typographic social sharing cover, 1200 × 750 pixels.

The studies use locally installed Geist, licensed under the SIL Open Font License by its package. All images are local and make no external media requests.

To regenerate, run `node scripts/generate-assets.mjs`. The script uses the environment's Playwright installation and Chromium at `/usr/bin/chromium`, plus Pillow for resizing and atlas assembly. These paths can be changed for another machine. The generator embeds the project's installed Geist font and performs no network requests.

## Supplied company profile

The user supplied Page 1 Home Page.pdf (seven pages). The original CEFABEX logo (page1), journey photograph (page3), team photograph (page3), milestone photo (page4), and agricultural/IoT project photos (page5) were extracted as WebP to public/company. The site uses the logo, journey and IoT images. These are supplied company materials, not invented portfolio work. Contact details from page7 are used verbatim apart from formatting the Indian phone number with +91. Code-editor screenshot variants025–032 were replaced by mobile app concepts.

## Current transparent logo

`public/company/logo-transparent.webp` is a background-removal edit of the supplied `public/company/logo.webp`, made with the image-editing tool and optimized to 599 × 400 WebP. The original logo remains untouched. The generated edit preserves the blue chrome mark and lettering and uses a real alpha channel rather than blending away a rectangular background. Current company photography remains from the supplied brochure.


## Previous title typography and effects

An earlier opening replaced the C-shaped arcs with extruded CEFABEX lettering. `src/assets/brand-typeface.json` contains only the CEFABEX glyphs, derived from the already installed Geist variable font at weight 600; `src/assets/Geist-OFL.txt` retains its license. Particle assembly, chrome shading and the optical compositing shader are original code. These historical assets are not imported by the current opening.


## Previous liquid-glass corridor

The user supplied the complete Endless Tunnel Square component from Originkit. The normalized source is retained at `src/vendor/originkit/EndlessTunnelSquare.source.txt`, with the original fragment/vertex shader and defaults extracted unchanged into `endlessTunnelShader.ts`. Reference: https://www.originkit.dev/components/endless-tunnel-square . The previous `src/lib/glassCorridorShader.ts` is a custom derivative of its log-polar zoom mapping: curved glass ribs replace square tiles, with procedural refraction, water caustics, spiral light rails and cyan/pearl reflections. That adapter supplied absolute scroll-derived zoom and turn instead of wall-clock values. No remote request, API key, image texture or animation video is needed at runtime. Originkit attribution is retained. The company name remains accessible HTML with scroll-driven decorative echoes and a light sweep.


## Current Engineered Light sculpture

`src/lib/engineeredLightScene.ts` builds an original three-ribbon C sculpture using BufferGeometry, silver/blue physical materials, a fine orbit and a small deterministic point field. Its studio-lighting environment uses Three.js RoomEnvironment and PMREM. This is procedural geometry/lighting, not a downloaded model, image or a claim that the real company owns a physical sculpture. Three.js is the existing MIT-licensed dependency. The original transparent company logo doubles as the static fallback poster.

Home photography uses the supplied journey, IoT, milestone and agriculture images. The milestone composition explicitly labels the documented Tamil Nadu State Finalist context. Company and project copy retain the brochure provenance and do not imply unsupported customers or delivery results. No external image or font request was added. The previous tunnel adapters remain in source but are not imported by the active opening.
