import {useEffect,useLayoutEffect,useRef,useState} from 'react'
import {gsap,ScrollTrigger,useReducedMotion} from '../lib/motion'
import type {createSignalBackground} from '../lib/signalBackground'
import ArrowIcon from './ArrowIcon'

type Signal=ReturnType<typeof createSignalBackground>
export default function BrandJourney({onEnquire}:{onEnquire:()=>void}){
 const root=useRef<HTMLElement>(null),canvas=useRef<HTMLCanvasElement>(null),scene=useRef<Signal|null>(null),pose=useRef(0),pausedRef=useRef(false)
 const [paused,setPaused]=useState(false),reduced=useReducedMotion()
 useEffect(()=>{pausedRef.current=paused;scene.current?.setPaused(paused)},[paused])
 useEffect(()=>{
  if(reduced||!canvas.current||!root.current)return
  let cancelled=false,recoveryFrame=0
  const element=root.current,screen=canvas.current
  element.dataset.scene='loading'
  const lost=()=>{element.dataset.scene='fallback'}
  const restored=()=>{element.dataset.scene=screen.dataset.context==='ready'?'ready':'fallback';cancelAnimationFrame(recoveryFrame);recoveryFrame=requestAnimationFrame(()=>ScrollTrigger.refresh())}
  screen.addEventListener('contextlost',lost)
  import('../lib/signalBackground').then(({createSignalBackground})=>{
   if(cancelled)return
   try{scene.current=createSignalBackground(screen);scene.current.setPaused(pausedRef.current);scene.current.update(pose.current);element.dataset.scene='ready';screen.addEventListener('contextrestored',restored)}catch{screen.dataset.renderMode='fallback';element.dataset.scene='fallback'}
  }).catch(()=>{if(!cancelled){screen.dataset.renderMode='fallback';element.dataset.scene='fallback'}})
  return()=>{cancelled=true;cancelAnimationFrame(recoveryFrame);screen.removeEventListener('contextlost',lost);screen.removeEventListener('contextrestored',restored);scene.current?.dispose();scene.current=null;delete element.dataset.scene}
 },[reduced])
 useLayoutEffect(()=>{
  if(!root.current||reduced)return
  const element=root.current
  const context=gsap.context(()=>{
   gsap.set('.brand-resolution',{opacity:0})
   gsap.set('.brand-letter',{yPercent:112})
   gsap.set('.brand-glass',{opacity:0,y:24})
   gsap.set('.signal-thought',{opacity:0,y:40})
   gsap.set('.title-signature',{opacity:0,y:16})
   gsap.set('.journey-progress-fill',{scaleX:0,transformOrigin:'left'})
   const sync=(value:number)=>{pose.current=value;scene.current?.update(value)}
   const timeline=gsap.timeline({scrollTrigger:{id:'brand-reveal',trigger:element,start:'top top',end:'bottom bottom',pin:element.querySelector('.brand-stage'),pinSpacing:false,scrub:.5,anticipatePin:1,invalidateOnRefresh:true,onRefresh:self=>sync(self.progress),onUpdate:self=>{sync(self.progress);element.dataset.progress=self.progress.toFixed(3);element.dataset.tone=self.progress<.33?'light':'dark';element.dataset.chapter=self.progress<.22?'enter':self.progress<.6?'travel':'reveal'}}})
   timeline.to({value:0},{value:1,duration:1,ease:'none'},0)
    .to('.signal-question .question-first',{xPercent:-24,opacity:0,duration:.2,ease:'power2.inOut'},.015)
    .to('.signal-question .question-last',{xPercent:35,opacity:0,duration:.2,ease:'power2.inOut'},.04)
    .to('.signal-caption',{opacity:0,y:-20,duration:.13},.07)
    .to('.signal-thought',{opacity:1,y:0,duration:.12,ease:'power3.out'},.24)
    .to('.signal-thought',{opacity:0,y:-36,duration:.12},.43)
    .set('.brand-resolution',{opacity:1},.6)
    .to('.brand-glass',{opacity:1,y:0,duration:.14,ease:'power3.out'},.6)
    .to('.brand-letter',{yPercent:0,duration:.17,stagger:.018,ease:'power3.out'},.62)
    .to('.title-signature',{opacity:1,y:0,duration:.12},.83)
    .to('.journey-progress-fill',{scaleX:1,duration:1,ease:'none'},0)
   const observer=new ResizeObserver(()=>ScrollTrigger.refresh());observer.observe(element)
   return()=>observer.disconnect()
  },element)
  return()=>context.revert()
 },[reduced])
 return <section ref={root} className={`brand-journey signal-journey ${reduced?'is-static':''}`} id="top" aria-label="CEFABEX scroll journey" data-progress="0" data-chapter="enter" data-tone="light">
  <div className="brand-stage">
   {!reduced&&<canvas ref={canvas} className="brand-canvas" aria-hidden="true"/>}
   <p className="signal-question"><span className="sr-only">What if.</span><span className="question-first" aria-hidden="true">What</span><span className="question-last" aria-hidden="true">if.</span></p>
   <p className="signal-thought" aria-hidden="true">An idea is only<br/>the beginning.</p>
   <p className="signal-caption">From a question<br/>to something real.</p>
   <div className="brand-resolution"><div className="brand-glass" aria-hidden="true"/><h1 className="brand-name" aria-label="CEFABEX">{'CEFABEX'.split('').map((letter,i)=><span className="brand-letter-mask" aria-hidden="true" key={i}><span className="brand-letter">{letter}</span></span>)}</h1><p className="title-signature">Research, engineering<br/>and digital experiences.</p></div>
   <div className="signal-actions"><button className="project-button" onClick={onEnquire}>Start a project <ArrowIcon/></button></div>
   <div className="journey-bottom"><span className="journey-scroll-label"><span aria-hidden="true">↓</span>Scroll to reveal</span><div className="reveal-chapters" aria-hidden="true"><span>Question</span><span>Possibility</span><span>CEFABEX</span></div><div className="signal-tools">{!reduced&&<button className="background-toggle" aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused?'Resume background':'Pause background'}</button>}<a href="#company">Skip intro <ArrowIcon down/></a></div></div>
   <div className="journey-progress" aria-hidden="true"><span className="journey-progress-fill"/></div>
  </div>
 </section>
}
