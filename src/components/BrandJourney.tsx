import {useEffect,useLayoutEffect,useRef} from 'react'
import {gsap,ScrollTrigger,useReducedMotion} from '../lib/motion'
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
  if(reduced||!canvas.current)return
  let cancelled=false
  import('../lib/brandScene').then(({createBrandScene})=>{
   if(cancelled||!canvas.current)return
   try{scene.current=createBrandScene(canvas.current);scene.current.update(pose.current.value);canvas.current.dataset.renderMode='webgl'}catch{if(canvas.current)canvas.current.dataset.renderMode='fallback'}
  }).catch(()=>{if(!cancelled&&canvas.current)canvas.current.dataset.renderMode='fallback'})
  const pointer=(event:PointerEvent)=>{
   if(event.pointerType!=='mouse'||!root.current)return
   const box=root.current.getBoundingClientRect()
   pose.current.x=(event.clientX/innerWidth-.5)*2
   pose.current.y=(event.clientY-box.top)/innerHeight-.5
   scene.current?.update(pose.current.value,pose.current.x,pose.current.y)
  }
  const element=root.current!
  element.addEventListener('pointermove',pointer,{passive:true})
  return()=>{cancelled=true;element.removeEventListener('pointermove',pointer);scene.current?.dispose();scene.current=null}
 },[reduced])
 useLayoutEffect(()=>{
  if(!root.current||reduced)return
  const element=root.current
  const context=gsap.context(()=>{
   const letters=element.querySelectorAll('.brand-letter')
   gsap.set('.brand-resolution',{autoAlpha:0})
   gsap.set(letters,{yPercent:110,rotateX:-35})
   gsap.set('.brand-resolution-copy',{opacity:0,y:24})
   gsap.set('.journey-progress-fill',{scaleX:0,transformOrigin:'left'})
   gsap.from('.opening-copy > *',{y:24,opacity:0,duration:1,stagger:.1,ease:'power3.out',delay:.1})
   const timeline=gsap.timeline({scrollTrigger:{id:'brand-reveal',trigger:element,start:'top top',end:'bottom bottom',pin:element.querySelector('.brand-stage'),pinSpacing:false,scrub:.55,anticipatePin:1,invalidateOnRefresh:true,onUpdate:self=>{element.dataset.progress=self.progress.toFixed(3)}}})
   timeline.to('.opening-copy',{y:-70,opacity:0,ease:'power2.in',duration:.23},0)
    .to(pose.current,{value:1,duration:.8,ease:'none',onUpdate:()=>scene.current?.update(pose.current.value,pose.current.x,pose.current.y)},0)
    .to('.brand-canvas',{opacity:.15,scale:1.15,duration:.35},.37)
    .set('.brand-resolution',{autoAlpha:1},.35)
    .to(letters,{yPercent:0,rotateX:0,duration:.27,stagger:.035,ease:'power3.out'},.36)
    .to('.brand-resolution-copy',{opacity:1,y:0,duration:.22},.65)
    .to('.journey-scroll-label',{opacity:0,duration:.12},.1)
    .to('.journey-progress-fill',{scaleX:1,duration:1,ease:'none'},0)
    .to('.brand-resolution',{scale:.98,duration:.14},.86)
   const observer=new ResizeObserver(()=>ScrollTrigger.refresh());observer.observe(element)
   return()=>observer.disconnect()
  },element)
  return()=>context.revert()
 },[reduced])
 return <section ref={root} className={`brand-journey ${reduced?'is-static':''}`} id="top" aria-label="CEFABEX introduction" data-progress="0">
  <div className="brand-stage">
   {!reduced&&<canvas ref={canvas} className="brand-canvas" aria-hidden="true"/>}
   <div className="opening-copy"><h1>Ideas into<br/>impact.</h1><p>Research. Design. Engineering.<br/>Made to move the world forward.</p><button className="project-button" onClick={onEnquire}>Start a project <ArrowIcon/></button></div>
   <div className="brand-resolution"><p className="brand-name" aria-label="CEFABEX">{'CEFABEX'.split('').map((letter,i)=><span className="brand-letter-mask" aria-hidden="true" key={i}><span className="brand-letter">{letter}</span></span>)}</p><div className="brand-resolution-copy"><p>From a first spark.<br/>To what comes next.</p><a href="#company" className="studio-text-link">Discover our world <ArrowIcon down/></a></div></div>
   <div className="journey-bottom"><span className="journey-scroll-label">Scroll to reveal <span aria-hidden="true">↓</span></span><a href="#company">Explore CEFABEX <ArrowIcon down/></a><span className="journey-location">Tamil Nadu, India<br/>Innovation. Engineering. Growth.</span></div>
   <div className="journey-progress" aria-hidden="true"><span className="journey-progress-fill"/></div>
  </div>
 </section>
}
