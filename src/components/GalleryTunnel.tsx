import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ReferenceTunnel from './ReferenceTunnel'
import ReferenceSpiral from './ReferenceSpiral'
import { scenePhases, smooth } from '../lib/scene'

type Props = { progress: React.RefObject<number>; reduced: boolean; onReady: () => void }
export default function GalleryTunnel({ progress, reduced, onReady }: Props) {
  const tunnel = useRef<HTMLDivElement>(null)
  const spiral = useRef<HTMLDivElement>(null)
  const reveal = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    if (reduced) { onReady(); return }
    const letters = reveal.current?.querySelectorAll<HTMLElement>(".name-letter")
    const render = () => {
      const p = progress.current
      const {gather,resolve,tunnelOpacity,spiralOpacity,nameOpacity} = scenePhases(p)
      if (tunnel.current) {
        tunnel.current.style.opacity = String(tunnelOpacity)
        tunnel.current.style.transform = `scale(${1 + gather * .12})`
      }
      if (spiral.current) {
        spiral.current.style.opacity = String(spiralOpacity)
        spiral.current.style.transform = `scale(${1 - resolve * .22})`
      }
      letters?.forEach((letter,i) => { letter.style.transform = `translateY(${(1-smooth(.8+i*.009,.88+i*.009,p))*110}%)` })
      if (reveal.current) {
        reveal.current.style.opacity = String(nameOpacity)
        reveal.current.style.transform = `translateY(${(1 - resolve) * 32}px) scale(${1.06 - resolve * .06})`
        reveal.current.style.clipPath = `inset(${(1 - resolve) * 100}% 0 0 0)`
      }
    }
    gsap.ticker.add(render); render()
    return () => gsap.ticker.remove(render)
  }, [progress, reduced, onReady])
  return <div className="gallery-world" aria-hidden="true">
    {!reduced && <>
      {!failed && <div ref={tunnel} className="reference-layer reference-tunnel"><ReferenceTunnel progress={progress} onReady={onReady} onFailure={() => setFailed(true)} background="#FFFFFF" fade={48} grid={5} label={false} /></div>}
      <div ref={spiral} className="reference-layer reference-spiral"><ReferenceSpiral progress={progress} turns={3.5} spacing={5} spread={6} imageSize={200} sizeAttenuation={2} fadeIn={20} fadeOut={8} cornerRadius={5} /></div>
      <div ref={reveal} className="cinematic-name"><span className="cinematic-word">{[..."CEFABEX"].map((letter,i)=><span className="name-letter" key={i}>{letter}</span>)}</span><div className="reveal-caption">Think beyond limits. Build what matters.</div></div>
    </>}
    {(reduced || failed) && <div className="gallery-fallback">{[3,19,47,68,91,105].map((n,i) => <img key={n} className={`fallback-image fallback-${i}`} src={`/images/image-${String(n).padStart(3,'0')}.webp`} alt="" />)}</div>}
  </div>
}
