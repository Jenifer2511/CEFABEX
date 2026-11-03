import {useEffect,useRef,useState} from 'react'
import {useReducedMotion} from 'motion/react'
import ParticleGimbal from './ParticleGimbal'
import ArrowIcon from './ArrowIcon'
export default function AmbientSignal(){
 const ref=useRef<HTMLElement>(null),[visible,setVisible]=useState(false),[paused,setPaused]=useState(false),reduced=useReducedMotion()
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:'80px'});if(ref.current)observer.observe(ref.current);return()=>observer.disconnect()},[])
 return <section ref={ref} className="ambient-signal section-shell" id="connection" data-thread-stop="signal" aria-labelledby="signal-title"><div className="signal-orbit" aria-hidden="true">{visible&&<ParticleGimbal width={380} height={380} density={220} dotSize={110} dotColor="#e5eaff" accentColor="#7495ff" speed={paused||reduced?0:18} spinTurns={1} pointer={{drag:0}}/>}</div><div className="signal-copy"><h2 id="signal-title">Different disciplines.<br/>One direction.</h2><p>Research, design, engineering and growth. Connected around your next idea, with one team helping you find the way forward.</p><a href="/about" className="studio-text-link">Inside the CEFABEX ecosystem <ArrowIcon/></a>{!reduced&&<button className="signal-toggle" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?'Resume ambient motion':'Pause ambient motion'}</button>}</div></section>
}
