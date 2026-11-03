const RenderTarget = {
    current: () => "preview",
    canvas: "canvas",
    export: "export",
    thumbnail: "thumbnail",
    preview: "preview",
}
import { useEffect, useRef } from "react"

import { createSpiral } from '../lib/spiral'

// 30 stable seeded images (used when no Content is set in Framer).
const DEFAULT_IMAGES = Array.from({length:112}, (_, i) => ({src:`/images/image-${String(i+1).padStart(3,'0')}.webp`}));

/**
 * Spiral Images
 * Images flow along an Archimedean spiral from the outer edge into the center
 * (a "vortex" / whirl), rotating to follow the spiral's tangent and fading in
 * and out at the ends. Reimplements the Cosmos vortex in self-contained
 * Canvas2D — no workers, no WebGL, single file.
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicWidth 600
 * @framerIntrinsicHeight 600
 * @framerDisableUnlink
 */
export default function SpiralImages(props: any) {
    props = { ...COMPONENT_DEFAULTS, ...props }
    const {
        images = DEFAULT_IMAGES,
        turns = 3.5,
        speed = 2,
        spacing = 5,
        spread = 6,
        sizeAttenuation = 2,
        imageSize = 200,
        fadeIn = 20,
        fadeOut = 0,
        cornerRadius = 5,
        style = {},
    } = props

    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rafRef = useRef(0)
    const progressRef = useRef(0)
    const scrollRef = useRef(props.progress); scrollRef.current = props.progress
    const lastRef = useRef(0)
    const imgsRef = useRef<(HTMLImageElement | null)[]>([])

    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    const items: any[] = images.length > 0 ? images : DEFAULT_IMAGES

    // Load images whenever the source list changes.
    const srcKey = items.map((im: any) => im?.src || "").join("|")
    useEffect(() => {
        imgsRef.current = items.map((im: any) => {
            if (!im?.src) return null
            const el = new Image()
            el.crossOrigin = "anonymous"
            el.src = im.src
            return el
        })
    }, [srcKey])

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const dpr = Math.min(
            2,
            typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
        )
        let w = 0
        let h = 0

        const resize = () => {
            w = container.clientWidth || 600
            h = container.clientHeight || 600
            canvas.width = Math.floor(w * dpr)
            canvas.height = Math.floor(h * dpr)
            canvas.style.width = `${w}px`
            canvas.style.height = `${h}px`
        }
        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(container)

        // Archimedean spiral (linear radius) → every turn is equally spaced.
        // n in [0,1] → outer edge (n=0) to center (n=1).
        const {spiral, arcToN} = createSpiral(turns)

        const roundRect = (
            c: CanvasRenderingContext2D,
            x: number,
            y: number,
            rw: number,
            rh: number,
            r: number
        ) => {
            const rr = Math.min(r, rw / 2, rh / 2)
            c.beginPath()
            c.moveTo(x + rr, y)
            c.arcTo(x + rw, y, x + rw, y + rh, rr)
            c.arcTo(x + rw, y + rh, x, y + rh, rr)
            c.arcTo(x, y + rh, x, y, rr)
            c.arcTo(x, y, x + rw, y, rr)
            c.closePath()
        }

        const draw = (now: number) => {
            const dt = lastRef.current ? (now - lastRef.current) / 1000 : 0
            lastRef.current = now
            const f = Math.min(dt, 0.1)

            // Advance the global progress (wraps 0..100).
            const p = scrollRef.current?.current ?? 0;
            if (document.hidden || p < .5 || p > .9) { rafRef.current = requestAnimationFrame(draw); return }
            progressRef.current = scrollRef.current ? Math.max(0, (p - .5) * 300) % 100 : (progressRef.current + speed * f) % 100
            const L = progressRef.current

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.clearRect(0, 0, w, h)

            const cx = w / 2
            const cy = h / 2
            // Spread scales the radius uniformly → wider, still-equal turn gaps
            // (outer arms overflow and are clipped by the container).
            const R = 0.48 * Math.min(w, h) * (1 + (spread - 1) * 0.18)
            const els = imgsRef.current
            const nImgs = els.length || 1

            // Slots fill the whole path with equal ARC spacing (one card every
            // `stepFrac` of the spiral's length). Cards cycle through the images
            // so the stream is continuous and infinite even with one image.
            const stepFrac = Math.max(0.005, (spacing * 0.5) / 100)
            const slots = Math.min(400, Math.ceil(1 / stepFrac) + 2)
            const base = L / 100

            // Build cards, sorted outer→center so center cards draw on top.
            const cards: { tt: number; n: number; img: number }[] = []
            for (let i = 0; i < slots; i++) {
                const s = (((base + i * stepFrac) % 1) + 1) % 1
                const n = arcToN(s)
                cards.push({ tt: s * 100, n, img: (i + Math.floor(base * 112)) % nImgs })
            }
            cards.sort((a, b) => a.n - b.n)

            for (let k = 0; k < cards.length; k++) {
                const { tt, n, img: imgIdx } = cards[k]
                const p = spiral(n, R)
                const dist = Math.sqrt(p.x * p.x + p.y * p.y)

                // Fade at both ends of the path.
                let opacity = 1
                if (tt < fadeIn) opacity = tt / fadeIn
                else if (tt > 100 - fadeOut) opacity = (100 - tt) / fadeOut
                if (opacity < 0.01) continue

                // Size attenuation — smaller toward the center.
                const scale =
                    sizeAttenuation > 0
                        ? Math.pow(Math.min(dist / R, 1), sizeAttenuation * 0.5)
                        : 1

                // Tangent angle (finite difference) for rotation.
                const p2 = spiral(Math.min(n + 0.001, 1), R)
                const angle = Math.atan2(p2.y - p.y, p2.x - p.x)

                const el = els[imgIdx]
                const ready = el && el.complete && el.naturalWidth > 0
                const aspect = ready ? el!.naturalWidth / el!.naturalHeight : 1
                let cw = imageSize * scale
                let ch = cw / aspect
                if (aspect < 1) {
                    ch = imageSize * scale
                    cw = ch * aspect
                }

                const x = cx + p.x
                const y = cy + p.y
                const rad = (cornerRadius / 20) * (Math.min(cw, ch) / 2)

                ctx.save()
                ctx.translate(x, y)
                ctx.rotate(angle)
                ctx.globalAlpha = opacity
                roundRect(ctx, -cw / 2, -ch / 2, cw, ch, rad)
                ctx.clip()
                if (ready) {
                    ctx.drawImage(el!, -cw / 2, -ch / 2, cw, ch)
                } else {
                    ctx.fillStyle = `hsl(${(imgIdx * 360) / nImgs}, 65%, 55%)`
                    ctx.fillRect(-cw / 2, -ch / 2, cw, ch)
                }
                ctx.restore()
            }

            rafRef.current = requestAnimationFrame(draw)
        }

        lastRef.current = 0
        rafRef.current = requestAnimationFrame(draw)
        return () => {
            cancelAnimationFrame(rafRef.current)
            ro.disconnect()
        }
    }, [
        srcKey,
        turns,
        speed,
        spacing,
        spread,
        sizeAttenuation,
        imageSize,
        fadeIn,
        fadeOut,
        cornerRadius,
        isCanvas,
    ])

    return (
        <div
            ref={containerRef}
            style={{
                ...style,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                position: "relative",
            }}
        >
            <canvas ref={canvasRef} style={{ display: "block" }} />
        </div>
    )
}

const COMPONENT_DEFAULTS = {
    images: DEFAULT_IMAGES,
    turns: 3.5,
    speed: 2,
    spacing: 5,
    spread: 6,
    imageSize: 200,
    sizeAttenuation: 2,
    fadeIn: 20,
    fadeOut: 0,
    cornerRadius: 5,
}

SpiralImages.displayName = "Spiral Images"