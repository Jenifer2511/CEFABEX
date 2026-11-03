import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { IMAGE_COUNT, WORD_POINTS, smooth, tileAt } from '../lib/scene'

type Props = { progress: React.RefObject<number>; reduced: boolean; onReady: () => void }

export default function GalleryTunnel({ progress, reduced, onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const readyRef = useRef(onReady)
  readyRef.current = onReady
  const [fallback, setFallback] = useState(reduced)

  useEffect(() => {
    if (reduced) { setFallback(true); readyRef.current(); return }
    const canvas = canvasRef.current
    if (!canvas) return
    let alive = true
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch { setFallback(true); readyRef.current(); return }
    setFallback(false)
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 768 ? 1.25 : 1.65))
    renderer.setClearColor(0xffffff, 0)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, .1, 150)
    camera.position.z = 22
    const count = WORD_POINTS.length
    const geometry = new THREE.PlaneGeometry(1, 1)
    const offsets = new Float32Array(count * 2)
    const alpha = new Float32Array(count).fill(1)
    for (let i = 0; i < count; i++) {
      const image = (i * 37) % IMAGE_COUNT
      offsets[i * 2] = image % 14
      offsets[i * 2 + 1] = 7 - Math.floor(image / 14)
    }
    geometry.setAttribute('aTile', new THREE.InstancedBufferAttribute(offsets, 2))
    geometry.setAttribute('aAlpha', new THREE.InstancedBufferAttribute(alpha, 1))
    const uniforms = {
      atlas: { value: null as THREE.Texture | null },
      uForm: { value: 0 }, uHole: { value: 1 }, uAspect: { value: 1 },
    }
    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      vertexShader: `
        attribute vec2 aTile;
        attribute float aAlpha;
        varying vec2 vUv;
        varying vec2 vScreen;
        varying float vAlpha;
        void main() {
          vUv = (uv * .984 + .008 + aTile) / vec2(14., 8.);
          vec4 viewPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.);
          vec4 clip = projectionMatrix * viewPosition;
          vScreen = clip.xy / clip.w;
          vAlpha = aAlpha;
          gl_Position = clip;
        }
      `,
      fragmentShader: `
        uniform sampler2D atlas;
        uniform float uForm;
        uniform float uHole;
        uniform float uAspect;
        varying vec2 vUv;
        varying vec2 vScreen;
        varying float vAlpha;
        void main() {
          vec4 sampleColor = texture2D(atlas, vUv);
          float grey = dot(sampleColor.rgb, vec3(.2126, .7152, .0722));
          vec3 color = mix(vec3(grey), sampleColor.rgb, .72);
          color = mix(color, vec3(.025), uForm * .92);
          float vertical = mix(1.65, 1., smoothstep(.6, 1.2, uAspect));
          float mobile = 1. - smoothstep(.6, 1.2, uAspect);
          float clearCenter = smoothstep(.55 + .35 * mobile, .95 + .28 * mobile, length(vec2(vScreen.x * max(uAspect, 1.), vScreen.y * vertical)));
          float opacity = vAlpha * mix(1., clearCenter, uHole);
          opacity *= 1. - smoothstep(.82, 1., abs(vScreen.y));
          if (opacity < .008) discard;
          gl_FragColor = vec4(color, opacity);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
    })
    const mesh = new THREE.InstancedMesh(geometry, material, count)
    mesh.frustumCulled = false
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    scene.add(mesh)
    let texture: THREE.Texture | undefined
    new THREE.TextureLoader().load('/images/atlas.webp', tex => {
      if (!alive) { tex.dispose(); return }
      texture = tex
      tex.colorSpace = THREE.SRGBColorSpace
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.generateMipmaps = false
      uniforms.atlas.value = tex
      renderer.compile(scene, camera)
      readyRef.current()
    }, undefined, () => { if (alive) { setFallback(true); readyRef.current() } })
    const dummy = new THREE.Object3D()
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    let visible = true
    const resize = () => {
      const w = canvas.clientWidth || innerWidth
      const h = canvas.clientHeight || innerHeight
      camera.aspect = w / h
      uniforms.uAspect.value = camera.aspect
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    observer.observe(canvas)
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      pointer.tx = (event.clientX / innerWidth - .5) * .5
      pointer.ty = (event.clientY / innerHeight - .5) * .35
    }
    const leave = () => { pointer.tx = 0; pointer.ty = 0 }
    const render = () => {
      if (!visible || document.hidden || !uniforms.atlas.value) return
      const p = progress.current
      pointer.x += (pointer.tx - pointer.x) * .035
      pointer.y += (pointer.ty - pointer.y) * .035
      const form = smooth(.76, .94, p)
      for (let i = 0; i < count; i++) {
        const tile = tileAt(i, p, camera.aspect)
        dummy.position.set(tile.x + pointer.x * (1 - form), tile.y - pointer.y * (1 - form), tile.z)
        dummy.rotation.set(tile.rx, tile.ry, tile.rz)
        dummy.scale.set(tile.w, tile.h, 1)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
        alpha[i] = tile.alpha
      }
      mesh.instanceMatrix.needsUpdate = true
      geometry.attributes.aAlpha.needsUpdate = true
      uniforms.uForm.value = smooth(.89, .975, p)
      uniforms.uHole.value = 1 - smooth(.45, .58, p)
      renderer.render(scene, camera)
    }
    const contextLost = (event: Event) => { event.preventDefault(); setFallback(true); readyRef.current() }
    canvas.addEventListener('webglcontextlost', contextLost)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('blur', leave)
    gsap.ticker.add(render)
    return () => {
      alive = false
      gsap.ticker.remove(render)
      ro.disconnect(); observer.disconnect()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('blur', leave)
      canvas.removeEventListener('webglcontextlost', contextLost)
      geometry.dispose(); material.dispose(); texture?.dispose(); renderer.dispose()
    }
  }, [progress, reduced])

  return <div className="gallery-world" aria-hidden="true">
    <canvas ref={canvasRef} className={fallback ? 'gallery-canvas is-hidden' : 'gallery-canvas'} />
    {fallback && <div className="gallery-fallback">
      {[3, 19, 47, 68, 91, 105].map((n, i) => <img key={n} className={`fallback-image fallback-${i}`} src={`/images/image-${String(n).padStart(3, '0')}.webp`} alt="" />)}
    </div>}
  </div>
}
