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

`public/company/logo-transparent.webp` is a background-removal edit of the supplied `public/company/logo.webp`, made with the image-editing tool and optimized to 599 × 400 WebP. The original logo remains untouched. The generated edit preserves the blue chrome mark and lettering and uses a real alpha channel rather than blending away a rectangular background. Current company photography remains from the supplied brochure. The current WebGL arcs are an original geometric interpretation of the C emblem and require no third-party textures.
