import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { IMAGE_COUNT, smooth } from '../lib/scene'

import {journeyTile,routeFor,orderGlyphs} from '../lib/journey'

type Props = { progress: React.RefObject<number>; reduced: boolean; onReady: () => void }

export default function GalleryTunnel({ progress, reduced, onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const readyRef = useRef(onReady)
  readyRef.current = onReady
  const [fallback, setFallback] = useState(reduced)
  const [fontReady,setFontReady]=useState(false)
  useEffect(()=>{ document.fonts.load('500 360px "Geist Variable"').then(()=>setFontReady(true)) },[])

  useEffect(() => {
    if (reduced) { setFallback(true); readyRef.current(); return }
    if (!fontReady) return
    const canvas = canvasRef.current
    if (!canvas) return
    let alive = true
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' })
    } catch { setFallback(true); readyRef.current(); return }
    setFallback(false)
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 768 ? 1.25 : 1.65))
    renderer.setClearColor(0xffffff, 0)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, .1, 150)
    camera.position.z = 22
    const maskCanvas=document.createElement('canvas'); maskCanvas.width=2000; maskCanvas.height=400
    const ink=maskCanvas.getContext('2d')!
    ink.fillStyle='white'; ink.textAlign='center'; ink.textBaseline='middle'; ink.font='500 360px "Geist Variable"'
    ink.fillText('CEFABEX',1000,200,1960)
    const pixels=ink.getImageData(0,0,maskCanvas.width,maskCanvas.height).data
    const targets:{x:number;y:number}[]=[]
    for(let y=12;y<400;y+=24) for(let x=12;x<2000;x+=24) if(pixels[(y*2000+x)*4+3]>120) targets.push({x:x/2000-.5,y:(.5-y/400)*.2})
    const orderedTargets=orderGlyphs(targets)
    const count=orderedTargets.length
    canvas.dataset.imageCount=String(count)
    let route=routeFor(orderedTargets,1)
    const maskTexture=new THREE.CanvasTexture(maskCanvas)
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
      uMask:{value:maskTexture},uWidth:{value:27},uForm: { value: 0 }, uHole: { value: 1 }, uAspect: { value: 1 },
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
        varying vec2 vWorld;
        varying float vAlpha;
        void main() {
          vUv = (uv * .984 + .008 + aTile) / vec2(14., 8.);
          vec4 viewPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.);
          vec4 clip = projectionMatrix * viewPosition;
          vScreen = clip.xy / clip.w;
          vWorld=(instanceMatrix * vec4(position,1.)).xy;
          vAlpha = aAlpha;
          gl_Position = clip;
        }
      `,
      fragmentShader: `
        uniform sampler2D atlas;
        uniform sampler2D uMask;
        uniform float uWidth;
        uniform float uForm;
        uniform float uHole;
        uniform float uAspect;
        varying vec2 vUv;
        varying vec2 vScreen;
        varying vec2 vWorld;
        varying float vAlpha;
        void main() {
          vec4 sampleColor = texture2D(atlas, vUv);
          float grey = dot(sampleColor.rgb, vec3(.2126, .7152, .0722));
          vec3 color = mix(vec3(grey), sampleColor.rgb, .72);
          color = mix(color, vec3(.008), uForm);
          float vertical = mix(1.65, 1., smoothstep(.6, 1.2, uAspect));
          float mobile = 1. - smoothstep(.6, 1.2, uAspect);
          float clearCenter = smoothstep(.55 + .35 * mobile, .95 + .28 * mobile, length(vec2(vScreen.x * max(uAspect, 1.), vScreen.y * vertical)));
          float opacity = vAlpha * mix(1., clearCenter, uHole);
          opacity *= 1. - smoothstep(.82, 1., abs(vScreen.y));
          opacity *= mix(1.,texture2D(uMask,vWorld/vec2(uWidth,uWidth*.2)+.5).a,smoothstep(.96,1.,uForm));
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
    const atlasPath=innerWidth>=1024&&renderer.capabilities.maxTextureSize>=8192?'/images/atlas-hd.webp':'/images/atlas.webp'
    new THREE.TextureLoader().load(atlasPath, tex => {
      if (!alive) { tex.dispose(); return }
      texture = tex
      tex.colorSpace = THREE.SRGBColorSpace
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy())
      tex.magFilter = THREE.LinearFilter
      tex.generateMipmaps = true
      uniforms.atlas.value = tex
      renderer.compile(scene, camera)
      readyRef.current()
    }, undefined, () => { if (alive) { setFallback(true); readyRef.current() } })
    const dummy = new THREE.Object3D()
    let visible = true
    let lastRendered=-1
    const resize = () => {
      lastRendered=-1
      const w = canvas.clientWidth || innerWidth
      const h = canvas.clientHeight || innerHeight
      camera.aspect = w / h
      route=routeFor(orderedTargets,camera.aspect)
      uniforms.uAspect.value = camera.aspect
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    observer.observe(canvas)
    const render = () => {
      if (!visible || document.hidden || !uniforms.atlas.value) return
      const p = progress.current
      if(p===lastRendered)return
      lastRendered=p
      for (let i = 0; i < count; i++) {
        const tile = journeyTile(i,count,p,camera.aspect,route)
        dummy.position.set(tile.x, tile.y, tile.z)
        dummy.rotation.set(tile.rx, tile.ry, tile.rz)
        dummy.scale.set(tile.w, tile.h, 1)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
        alpha[i] = tile.alpha
      }
      mesh.instanceMatrix.needsUpdate = true
      geometry.attributes.aAlpha.needsUpdate = true
      uniforms.uForm.value = smooth(39,40.5,p)
      uniforms.uWidth.value = Math.min(27,19.5*camera.aspect)
      uniforms.uHole.value = 1 - smooth(14,20,p)
      renderer.render(scene, camera)
    }
    const contextLost = (event: Event) => { event.preventDefault(); setFallback(true); readyRef.current() }
    canvas.addEventListener('webglcontextlost', contextLost)
    gsap.ticker.add(render)
    return () => {
      alive = false
      gsap.ticker.remove(render)
      ro.disconnect(); observer.disconnect()
      canvas.removeEventListener('webglcontextlost', contextLost)
      geometry.dispose(); material.dispose(); texture?.dispose(); maskTexture.dispose(); renderer.dispose()
    }
  }, [progress, reduced, fontReady])

  return <div className="gallery-world" aria-hidden="true">
    <canvas ref={canvasRef} className={fallback ? 'gallery-canvas is-hidden' : 'gallery-canvas'} />
    {fallback && <div className="gallery-fallback">
      {[3, 19, 47, 68, 91, 105].map((n, i) => <img key={n} className={`fallback-image fallback-${i}`} src={`/images/image-${String(n).padStart(3, '0')}.webp`} alt="" />)}
    </div>}
  </div>
}
