import {useEffect,useLayoutEffect,useRef} from 'react'
import {gsap,ScrollTrigger,scrollToPosition,resetScroll,useReducedMotion} from '../lib/motion'
import type {createBrandScene} from '../lib/brandScene'
import ArrowIcon from './ArrowIcon'

type Scene=ReturnType<typeof createBrandScene>
export default function BrandJourney({onEnquire}:{onEnquire:()=>void}){
 const root=useRef<HTMLElement>(null)
 const canvas=useRef<HTMLCanvasElement>(null)
 const scene=useRef<Scene|null>(null)
 const pose=useRef({value:0,x:0,y:0})
 const reduced=useReducedMotion()
 useEffect(()=>{
  if(reduced||!canvas.current||!root.current)return
  let cancelled=false
  const element=root.current,screen=canvas.current
  element.dataset.scene='loading'
  const lost=()=>{element.dataset.scene='fallback'}
  const restored=()=>{element.dataset.scene='ready'}
  screen.addEventListener('webglcontextlost',lost);screen.addEventListener('webglcontextrestored',restored)
  import('../lib/brandScene').then(({createBrandScene})=>{
   if(cancelled)return
   try{scene.current=createBrandScene(screen);scene.current.update(pose.current.value,pose.current.x,pose.current.y);screen.dataset.renderMode='webgl';element.dataset.scene='ready'}catch{screen.dataset.renderMode='fallback';element.dataset.scene='fallback'}
  }).catch(()=>{if(!cancelled){screen.dataset.renderMode='fallback';element.dataset.scene='fallback'}})
  const pointer=(event:PointerEvent)=>{
   if(event.pointerType!=='mouse')return
   const box=element.getBoundingClientRect();pose.current.x=(event.clientX/innerWidth-.5)*2;pose.current.y=(event.clientY-box.top)/innerHeight-.5
   scene.current?.update(pose.current.value,pose.current.x,pose.current.y)
  }
  element.addEventListener('pointermove',pointer,{passive:true})
  return()=>{cancelled=true;element.removeEventListener('pointermove',pointer);screen.removeEventListener('webglcontextlost',lost);screen.removeEventListener('webglcontextrestored',restored);scene.current?.dispose();scene.current=null;delete element.dataset.scene}
 },[reduced])
 useLayoutEffect(()=>{
  if(!root.current||reduced)return
  const element=root.current
  const context=gsap.context(()=>{
   gsap.set('.journey-progress-fill',{scaleX:0,transformOrigin:'left'})
   gsap.from('.title-prelude,.title-description,.title-actions,.journey-bottom',{y:20,opacity:0,duration:1.2,stagger:.1,ease:'power3.out',delay:.1})
   const timeline=gsap.timeline({scrollTrigger:{id:'brand-reveal',trigger:element,start:'top top',end:'bottom bottom',pin:element.querySelector('.brand-stage'),pinSpacing:false,scrub:.65,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>{
    element.dataset.progress=self.progress.toFixed(3)
    element.dataset.chapter=self.progress<.28?'ignite':self.progress<.7?'form':'emerge'
   }}})
   timeline.to(pose.current,{value:1,duration:1,ease:'none',onUpdate:()=>scene.current?.update(pose.current.value,pose.current.x,pose.current.y)},0)
    .to('.title-prelude',{opacity:0,y:-20,duration:.18},.08)
    .fromTo('.title-signature',{opacity:0,y:12},{opacity:1,y:0,duration:.2},.65)
    .to('.journey-progress-fill',{scaleX:1,duration:1,ease:'none'},0)
    .to('.title-frame',{scale:.98,duration:.15},.85)
   const observer=new ResizeObserver(()=>ScrollTrigger.refresh());observer.observe(element)
   return()=>observer.disconnect()
  },element)
  return()=>context.revert()
 },[reduced])
 const play=()=>{
  const element=root.current
  if(!element)return
  if(reduced){document.getElementById('company')?.scrollIntoView();return}
  const end=element.offsetTop+element.offsetHeight-innerHeight
  if(window.scrollY>element.offsetTop+40){resetScroll();requestAnimationFrame(()=>scrollToPosition(end,4.2))}
  else scrollToPosition(end,4.2)
 }
 return <section ref={root} className={`brand-journey title-sequence ${reduced?'is-static':''}`} id="top" aria-label="CEFABEX cinematic company reveal" data-progress="0" data-chapter="ignite">
  <div className="brand-stage">
   {!reduced&&<canvas ref={canvas} className="brand-canvas" aria-hidden="true"/>}
   <div className="title-frame">
    <p className="title-prelude">Every possibility begins with a spark.</p>
    <div className="brand-resolution">
     <h1 className="brand-name" aria-label="CEFABEX">{['CEFA','BEX'].map((line,index)=><span className="brand-word-line" aria-hidden="true" key={index}>{line.split('').map((letter,i)=><span className="brand-letter" key={i}>{letter}</span>)}</span>)}</h1>
     <p className="title-signature">Innovation. Engineering. Growth.</p>
    </div>
    <div className="title-description"><p>Ideas, engineered<br/>into impact.</p><p>Research, digital experiences and connected products.<br className="title-desktop-break"/> Built for what comes next.</p></div>
    <div className="title-actions"><button className="project-button" onClick={onEnquire}>Start a project <ArrowIcon/></button>{!reduced&&<button className="play-reveal" onClick={play}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>Play the reveal</button>}</div>
   </div>
   <div className="journey-bottom"><span className="journey-scroll-label"><span aria-hidden="true">↓</span>Scroll to create</span><div className="reveal-chapters" aria-hidden="true"><span>Ignite</span><span>Form</span><span>Emerge</span></div><a href="#company">Explore CEFABEX <ArrowIcon down/></a></div>
   <div className="journey-progress" aria-hidden="true"><span className="journey-progress-fill"/></div>
  </div>
 </section>
}
