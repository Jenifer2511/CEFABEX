import {useEffect,useLayoutEffect,useRef} from 'react'
import {gsap,ScrollTrigger,useReducedMotion} from '../lib/motion'
import type {createOriginkitTunnel} from '../lib/originkitTunnel'
import ArrowIcon from './ArrowIcon'

type Tunnel=ReturnType<typeof createOriginkitTunnel>
export default function BrandJourney({onEnquire}:{onEnquire:()=>void}){
 const root=useRef<HTMLElement>(null)
 const canvas=useRef<HTMLCanvasElement>(null)
 const scene=useRef<Tunnel|null>(null)
 const pose=useRef({value:0})
 const reduced=useReducedMotion()
 useEffect(()=>{
  if(reduced||!canvas.current||!root.current)return
  let cancelled=false
  const element=root.current,screen=canvas.current
  element.dataset.scene='loading'
  const lost=()=>{element.dataset.scene='fallback'}
  const restored=()=>{element.dataset.scene=screen.dataset.context==='ready'?'ready':'fallback'}
  screen.addEventListener('webglcontextlost',lost)
  import('../lib/originkitTunnel').then(({createOriginkitTunnel})=>{
   if(cancelled)return
   try{scene.current=createOriginkitTunnel(screen);scene.current.update(pose.current.value);screen.dataset.renderMode='webgl';element.dataset.scene='ready';screen.addEventListener('webglcontextrestored',restored)}catch{screen.dataset.renderMode='fallback';element.dataset.scene='fallback'}
  }).catch(()=>{if(!cancelled){screen.dataset.renderMode='fallback';element.dataset.scene='fallback'}})
  return()=>{cancelled=true;screen.removeEventListener('webglcontextlost',lost);screen.removeEventListener('webglcontextrestored',restored);scene.current?.dispose();scene.current=null;delete element.dataset.scene}
 },[reduced])
 useLayoutEffect(()=>{
  if(!root.current||reduced)return
  const element=root.current
  const context=gsap.context(()=>{
   gsap.set('.brand-resolution',{opacity:0})
   gsap.set('.brand-letter',{yPercent:115,rotationX:-35})
   gsap.set('.title-signature',{opacity:0,y:16})
   gsap.set('.journey-progress-fill',{scaleX:0,transformOrigin:'left'})
   const timeline=gsap.timeline({scrollTrigger:{id:'brand-reveal',trigger:element,start:'top top',end:'bottom bottom',pin:element.querySelector('.brand-stage'),pinSpacing:false,scrub:.55,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>{
    element.dataset.progress=self.progress.toFixed(3)
    element.dataset.chapter=self.progress<.2?'enter':self.progress<.7?'travel':'reveal'
   }}})
   timeline.to(pose.current,{value:1,duration:1,ease:'none',onUpdate:()=>scene.current?.update(pose.current.value)},0)
    .to('.tunnel-opening',{opacity:0,scale:.85,y:-24,duration:.18,ease:'power2.in'},.02)
    .fromTo('.tunnel-waypoint',{opacity:0,y:20},{opacity:1,y:0,duration:.1},.29)
    .to('.tunnel-waypoint',{opacity:0,y:-20,duration:.1},.46)
    .to('.brand-canvas',{opacity:.1,duration:.24},.62)
    .set('.brand-resolution',{opacity:1},.64)
    .to('.brand-letter',{yPercent:0,rotationX:0,duration:.18,stagger:.018,ease:'power3.out'},.65)
    .to('.title-signature',{opacity:1,y:0,duration:.13},.84)
    .to('.journey-progress-fill',{scaleX:1,duration:1,ease:'none'},0)
   const observer=new ResizeObserver(()=>ScrollTrigger.refresh());observer.observe(element)
   return()=>observer.disconnect()
  },element)
  return()=>context.revert()
 },[reduced])
 return <section ref={root} className={`brand-journey title-sequence originkit-sequence ${reduced?'is-static':''}`} id="top" aria-label="CEFABEX scroll journey" data-progress="0" data-chapter="enter">
  <div className="brand-stage">
   {!reduced&&<canvas ref={canvas} className="brand-canvas" aria-hidden="true"/>}
   <div className="title-frame">
    <div className="tunnel-opening"><p>Step into<br/>what’s next.</p><span>A journey from possibility to impact.</span></div>
    <p className="tunnel-waypoint" aria-hidden="true">A different perspective.</p>
    <div className="brand-resolution">
     <h1 className="brand-name" aria-label="CEFABEX">{'CEFABEX'.split('').map((letter,i)=><span className="brand-letter-mask" aria-hidden="true" key={i}><span className="brand-letter">{letter}</span></span>)}</h1>
     <p className="title-signature">Innovation. Engineering. Growth.</p>
    </div>
    <div className="title-description"><p>Ideas, engineered into impact.</p><p>Research, digital experiences<br/>and connected products.</p></div>
    <div className="title-actions"><button className="project-button" onClick={onEnquire}>Start a project <ArrowIcon/></button></div>
   </div>
   <div className="journey-bottom"><span className="journey-scroll-label"><span aria-hidden="true">↓</span>Scroll to explore</span><div className="reveal-chapters" aria-hidden="true"><span>Enter</span><span>Travel</span><span>Reveal</span></div><a href="#company">Skip to company <ArrowIcon down/></a></div>
   <div className="journey-progress" aria-hidden="true"><span className="journey-progress-fill"/></div>
  </div>
 </section>
}
