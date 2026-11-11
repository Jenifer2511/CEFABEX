import {useEffect,useLayoutEffect,useRef} from 'react'
import {gsap,ScrollTrigger,useReducedMotion} from '../lib/motion'
import type {createEngineeredLightScene} from '../lib/engineeredLightScene'
import ArrowIcon from './ArrowIcon'

type Tunnel=ReturnType<typeof createEngineeredLightScene>
export default function BrandJourney({onEnquire}:{onEnquire:()=>void}){
 const root=useRef<HTMLElement>(null)
 const canvas=useRef<HTMLCanvasElement>(null)
 const scene=useRef<Tunnel|null>(null)
 const pose=useRef({value:0})
 const reduced=useReducedMotion()
 useEffect(()=>{
  if(reduced||!canvas.current||!root.current)return
  let cancelled=false,recoveryFrame=0
  const element=root.current,screen=canvas.current
  element.dataset.scene='loading'
  const lost=()=>{element.dataset.scene='fallback'}
  const restored=()=>{
   element.dataset.scene=screen.dataset.context==='ready'?'ready':'fallback'
   // Reconcile pin measurements after the fallback canvas becomes visible again.
   cancelAnimationFrame(recoveryFrame);recoveryFrame=requestAnimationFrame(()=>ScrollTrigger.refresh())
  }
  screen.addEventListener('webglcontextlost',lost)
  import('../lib/engineeredLightScene').then(({createEngineeredLightScene})=>{
   if(cancelled)return
   try{scene.current=createEngineeredLightScene(screen);scene.current.update(pose.current.value);screen.dataset.renderMode='webgl';element.dataset.scene='ready';screen.addEventListener('webglcontextrestored',restored)}catch{screen.dataset.renderMode='fallback';element.dataset.scene='fallback'}
  }).catch(()=>{if(!cancelled){screen.dataset.renderMode='fallback';element.dataset.scene='fallback'}})
  return()=>{cancelled=true;cancelAnimationFrame(recoveryFrame);screen.removeEventListener('webglcontextlost',lost);screen.removeEventListener('webglcontextrestored',restored);scene.current?.dispose();scene.current=null;delete element.dataset.scene}
 },[reduced])
 useLayoutEffect(()=>{
  if(!root.current||reduced)return
  const element=root.current
  const context=gsap.context(()=>{
   gsap.from('.tunnel-opening > p',{y:32,opacity:0,duration:1.1,ease:'power3.out'})
   gsap.set('.brand-resolution',{opacity:0})
   gsap.set('.brand-name',{opacity:0,scale:.38,z:-240,rotationX:18,transformPerspective:1000,transformOrigin:'50% 50%'})
   gsap.set('.brand-letter',{opacity:0,xPercent:i=>(i-3)*16,yPercent:i=>i%2?18:-18,rotationZ:i=>(i-3)*-1.2})
   gsap.set('.name-echo',{opacity:0,scale:.5})
   gsap.set('.name-sheen',{opacity:0,backgroundPosition:'170% 50%'})
   gsap.set('.name-axis',{opacity:0,scaleX:0})
   gsap.set('.title-signature',{opacity:0,y:16})
   gsap.set('.journey-progress-fill',{scaleX:0,transformOrigin:'left'})
   const timeline=gsap.timeline({onUpdate:function(this:gsap.core.Timeline){pose.current.value=this.progress();scene.current?.update(pose.current.value)},scrollTrigger:{id:'brand-reveal',trigger:element,start:'top top',end:'bottom bottom',pin:element.querySelector('.brand-stage'),pinSpacing:false,scrub:.55,anticipatePin:1,invalidateOnRefresh:true,onScrubComplete:self=>{pose.current.value=self.progress;scene.current?.update(pose.current.value)},onUpdate:self=>{
    element.dataset.progress=self.progress.toFixed(3)
    element.dataset.chapter=self.progress<.2?'enter':self.progress<.7?'travel':'reveal'
   }}})
   timeline.to({value:0},{value:1,duration:1,ease:'none'},0)
    .to('.tunnel-opening',{opacity:0,scale:.85,y:-24,duration:.18,ease:'power2.in'},.02)
    .fromTo('.tunnel-waypoint',{opacity:0,y:20},{opacity:1,y:0,duration:.1},.29)
    .to('.tunnel-waypoint',{opacity:0,y:-20,duration:.1},.46)
    .to('.brand-canvas',{opacity:.22,duration:.24},.65)
    .set('.brand-resolution',{opacity:1},.59)
    .to('.name-axis',{opacity:.8,scaleX:1.15,duration:.1,ease:'power2.out'},.59)
    .to('.name-axis',{opacity:0,scaleX:1.5,duration:.13},.7)
    .to('.name-echo-far',{opacity:.32,scale:1.32,duration:.13,ease:'power2.out'},.59)
    .to('.name-echo-far',{opacity:0,scale:1.5,duration:.16},.72)
    .to('.name-echo-near',{opacity:.4,scale:1.08,duration:.15,ease:'power3.out'},.62)
    .to('.name-echo-near',{opacity:0,scale:1,duration:.13},.77)
    .to('.brand-name',{opacity:1,scale:1,z:0,rotationX:0,duration:.25,ease:'power3.out'},.61)
    .to('.brand-letter',{opacity:1,xPercent:0,yPercent:0,rotationZ:0,duration:.18,stagger:.009,ease:'power3.out'},.65)
    .set('.name-sheen',{opacity:1},.78)
    .to('.name-sheen',{backgroundPosition:'-70% 50%',duration:.16,ease:'power2.inOut'},.78)
    .to('.name-sheen',{opacity:0,duration:.025},.94)
    .to('.title-signature',{opacity:1,y:0,duration:.12},.86)
    .to('.journey-progress-fill',{scaleX:1,duration:1,ease:'none'},0)
   const observer=new ResizeObserver(()=>ScrollTrigger.refresh());observer.observe(element)
   return()=>observer.disconnect()
  },element)
  return()=>context.revert()
 },[reduced])
 return <section ref={root} className={`brand-journey title-sequence originkit-sequence engineered-sequence ${reduced?'is-static':''}`} id="top" aria-label="CEFABEX scroll journey" data-progress="0" data-chapter="enter">
  <div className="brand-stage">
   <img className="brand-poster" src="/company/logo-transparent.webp" alt="" aria-hidden="true" width="599" height="400"/>
   {!reduced&&<canvas ref={canvas} className="brand-canvas" aria-hidden="true"/>}
   <div className="title-frame">
    <div className="tunnel-opening"><p>Ideas deserve<br/>a real future.</p><span>Research. Engineering. A world of possibility.</span></div>
    <p className="tunnel-waypoint" aria-hidden="true">Think deeply.<br/>Build boldly.</p>
    <div className="brand-resolution">
     <div className="name-stage">
      <div className="name-axis" aria-hidden="true"/>
      <div className="name-echo name-echo-far" aria-hidden="true">{'CEFABEX'.split('').map((letter,i)=><span key={i}>{letter}</span>)}</div>
      <div className="name-echo name-echo-near" aria-hidden="true">{'CEFABEX'.split('').map((letter,i)=><span key={i}>{letter}</span>)}</div>
      <h1 className="brand-name" aria-label="CEFABEX">{'CEFABEX'.split('').map((letter,i)=><span className="brand-letter-mask" aria-hidden="true" key={i}><span className="brand-letter">{letter}</span></span>)}</h1>
      <div className="name-sheen" aria-hidden="true">{'CEFABEX'.split('').map((letter,i)=><span key={i}>{letter}</span>)}</div>
     </div>
     <p className="title-signature">Innovation. Engineering. Growth.</p>
    </div>
    <div className="title-description"><p>From the first question<br/>to something that matters.</p><p>Independent thinking.<br/>Connected expertise.</p></div>
    <div className="title-actions"><button className="project-button" onClick={onEnquire}>Start a project <ArrowIcon/></button></div>
   </div>
   <div className="journey-bottom"><span className="journey-scroll-label"><span aria-hidden="true">↓</span>Scroll to discover</span><div className="reveal-chapters" aria-hidden="true"><span>Imagine</span><span>Engineer</span><span>Reveal</span></div><a href="#company">Skip to company <ArrowIcon down/></a></div>
   <div className="journey-progress" aria-hidden="true"><span className="journey-progress-fill"/></div>
  </div>
 </section>
}
