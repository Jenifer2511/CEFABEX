import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import ParticleGimbal from './ParticleGimbal'
import ArrowIcon from './ArrowIcon'

export default function Loader({ ready, onComplete }: { ready: boolean; onComplete: () => void }) {
  const [value, setValue] = useState(1)
  const readyRef = useRef(ready)
  readyRef.current = ready
  useEffect(() => {
    let frame = 0
    let finish: ReturnType<typeof setTimeout>
    let n = 1
    const start = performance.now()
    const tick = (time: number) => {
      const elapsed = time - start
      const target = readyRef.current ? 200 : Math.min(174, 1 + elapsed / 19)
      n = Math.min(target, Math.max(n, 1 + elapsed / 14))
      setValue(Math.floor(n))
      if (n >= 200) finish = setTimeout(onComplete, 300)
      else frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frame); clearTimeout(finish) }
  }, [onComplete])
  return <motion.div className="loader" initial={{ opacity: 1 }} exit={{ y: '-100%' }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}>
    <div className="loader-top"><span className="loader-brand">CEFABEX</span><button className="plain-button" onClick={onComplete}>Skip intro <ArrowIcon /></button></div>
    <div className="loader-center">
      <div className="loader-orb"><ParticleGimbal width={220} height={220} dotColor="#141414" accentColor="#141414" density={230} dotSize={115} pointer={{ drag: 0 }} /></div>
      <div className="loader-counter" role="progressbar" aria-label="Preparing the CEFABEX experience" aria-valuemin={1} aria-valuemax={200} aria-valuenow={value}><span>{String(value).padStart(3, '0')}</span><span className="loader-percent">%</span></div>
      <p>Good things go beyond 100%.</p>
    </div>
    <div className="loader-bottom"><span>A little imagination. A lot of possibility.</span><span>Loading your next chapter</span></div>
    <div className="loader-track"><div style={{ transform: `scaleX(${value / 200})` }} /></div>
  </motion.div>
}
