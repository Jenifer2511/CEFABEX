# Product film and editorial media

The film is an original CEFABEX software-interface motion study, rendered locally for this site. It is not stock footage, a recording of a delivered client application, or evidence of client results.

The four interface sources reuse the site's original HTML/CSS studies from `scripts/generate-assets.mjs`: web design, project workflow, mobile applications and product analytics. Chromium rendered those vector interfaces at **3840 × 2400**, with a 1280 × 800 CSS viewport and a device scale factor of 3. The source textures were then placed on flat perspective planes and filmed with a continuous camera path on a dark forest stage. Images remain flat; there is no curvature or displacement.

The film is **3840 × 2160, 24 fps, 6 seconds**, with 144 separately rendered native-resolution frames. It has no audio. The 1080p and mobile files are delivery derivatives of this 4K master. MP4 files use H.264, yuv420p and fast-start metadata. The master uses a keyframe every 12 frames; smaller delivery files use every frame as a keyframe to make scroll seeking responsive.

`ffprobe` verified every delivered video at 24 fps, 144 frames and 6.000 seconds. File sizes are 6,089,635 bytes for the 4K master, 6,428,755 bytes for the all-intra 1080p version, and 3,169,366 bytes for the all-intra mobile version. The smaller-resolution files prioritize independent-frame seeking over the smallest possible file size.

## Files

- `public/films/cefabex-software-4k.mp4`: native 4K master.
- `public/films/cefabex-software-1080.mp4`: 1920 × 1080 delivery version.
- `public/films/cefabex-software-mobile.mp4`: 1280 × 720 delivery version.
- `public/films/cefabex-software-poster.webp`: 3840 × 2160 still at the middle of the camera path.
- `public/editorial/product-system.webp`, `mobile-experience.webp`, `data-platform.webp`, `web-experience.webp`, `commerce-experience.webp`, `cloud-delivery.webp`: six native 3840 × 2400 interface studies. Commerce and cloud delivery re-render the original image-046 and image-106 HTML families at native resolution, rather than enlarging the smaller gallery images.
- `public/editorial/film-web.webp`, `film-product.webp`, `film-mobile.webp`, `film-data.webp`: four 3840 × 2160 camera compositions for editorial use.

Geist is provided by the project's existing SIL Open Font License package. Product names, sample people and figures inside the interface studies are fictional UI sample content. No third-party screenshots, stock people, customer marks, or externally sourced footage are included in these new assets.

## Regeneration

Run `node scripts/generate-film.mjs` from the checkout to recreate all six interface stills, the four film compositions, poster, native 4K film and both delivery variants. This requires the project's Node dependencies, Chromium (default `/usr/bin/chromium`, override with `CHROMIUM_PATH`), Python 3 with Pillow and NumPy, and FFmpeg with the libx264 encoder. The Python renderer is `scripts/render-product-film.py`; the JS entry point reuses the original HTML/CSS templates in `scripts/generate-assets.mjs`.

Use `node scripts/generate-film.mjs --stills-only` to regenerate just the six interface images. To regenerate selected images, use for example `node scripts/generate-film.mjs --stills-only --only=commerce-experience,cloud-delivery`.

Generation uses local fonts and source code without network requests. Temporary PNG sources are created in the OS temporary directory and removed afterward. Film frames stream directly into FFmpeg; no frame collection is stored in the repository. The native render can take several minutes depending on CPU resources.

## External sourcing limitation

On 2026-11-03, attempts to access `https://originkit.dev`, Mixkit's technology footage collection, and Pexels' circuit-board video search returned explicit proxy `403 Forbidden` responses. The environment's current network policy is enforced and permits package-hosting destinations, not those media sites. No access restriction was bypassed.

Consequently, no claim is made that this film was fetched from a stock site or that a new effect was fetched from Originkit. The existing Particle Gimbal and Poster Page Curl adaptations originate from the code the user supplied earlier. Those supplied references can continue to be used, while the newly rendered original media provides a locally available film and image collection.
