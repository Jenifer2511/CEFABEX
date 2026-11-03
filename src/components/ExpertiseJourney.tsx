import {useLayoutEffect,useRef,useState} from 'react'
import type {KeyboardEvent} from 'react'
import {useReducedMotion} from 'motion/react'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import ScrollHeading from './ScrollHeading'
import ArrowIcon from './ArrowIcon'

gsap.registerPlugin(ScrollTrigger)
export type ScrollToPosition=(position:number,immediate?:boolean)=>void
const services=[
 {name:'Web experiences',short:'Web',title:'Make your first impression count.',description:'Considered design. Fast, accessible development. Websites that express who you are and make the next step feel natural.',detail:'Company websites · Ecommerce · Web applications',image:'/images/web-preview.webp',alt:'Original CEFABEX exploration of a composed web interface'},
 {name:'Mobile applications',short:'Apps',title:'A place in someone’s everyday.',description:'From the first tap to the smallest interaction, we design and develop apps that feel useful, familiar and easy to return to.',detail:'iOS & Android · Cross platform · Product design',image:'/images/mobile-preview.webp',alt:'Original CEFABEX exploration of a mobile application'},
 {name:'Custom software',short:'Software',title:'Built for the way you work.',description:'Tools that connect the moving parts of your business. We turn complicated processes into clear, dependable digital products.',detail:'Business platforms · Integrations · Internal tools',image:'/images/software-preview.webp',alt:'Original CEFABEX exploration of a custom software workspace'},
]

export default function ExpertiseJourney({ready,onEnquire,onScrollTo}:{ready:boolean;onEnquire:(service?:string)=>void;onScrollTo:ScrollToPosition}){
 const root=useRef<HTMLElement>(null)
 const triggerRef=useRef<ScrollTrigger|null>(null)
 const tabs=useRef<(HTMLButtonElement|null)[]>([])
 const [active,setActive]=useState(0)
 const current=useRef(0)
 const reduced=Boolean(useReducedMotion())
 useLayoutEffect(()=>{
  if(!ready||reduced||!root.current)return
  const element=root.current
  const media=gsap.matchMedia()
  media.add('(min-height: 740px)',()=>{
   element.classList.add('has-scroll-chapters')
   const panels=element.querySelectorAll<HTMLElement>('.expertise-panel')
   const images=element.querySelectorAll<HTMLElement>('.expertise-image')
   const bars=element.querySelectorAll<HTMLElement>('.expertise-tab-fill')
   gsap.set(panels,{autoAlpha:0,y:24});gsap.set(panels[0],{autoAlpha:1,y:0})
   gsap.set(images,{clipPath:'inset(100% 0% 0% 0%)'});gsap.set(images[0],{clipPath:'inset(0% 0% 0% 0%)'})
   const renderProgress=(p:number)=>{
    const next=p<.32?0:p<.66?1:2
    element.dataset.scrollProgress=String(p)
    if(next!==current.current){current.current=next;setActive(next)}
    bars.forEach((bar,i)=>gsap.set(bar,{scaleX:Math.max(0,Math.min(1,(p-i/3)*3))}))
   }
   const dummy={value:0}
   const timeline=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:element,start:'top top',end:'bottom bottom',scrub:true,invalidateOnRefresh:true,onRefresh:self=>{element.dataset.scrollStart=String(self.start);element.dataset.scrollEnd=String(self.end);renderProgress(self.progress)},onUpdate:self=>renderProgress(self.progress)}})
   timeline.to(dummy,{value:1,duration:1},0)
   for(let i=1;i<services.length;i++){
    const at=i===1?.26:.6
    timeline.to(panels[i-1],{autoAlpha:0,y:-24,duration:.12},at)
     .fromTo(panels[i],{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:.12},at+.04)
     .to(images[i],{clipPath:'inset(0% 0% 0% 0%)',duration:.16},at)
   }
   triggerRef.current=timeline.scrollTrigger!
   return()=>{triggerRef.current=null;element.classList.remove('has-scroll-chapters');element.removeAttribute('data-scroll-progress')}
  },element)
  return()=>media.revert()
 },[ready,reduced])

 const select=(index:number,immediate=false)=>{
  const trigger=triggerRef.current
  if(trigger)onScrollTo(trigger.start+(trigger.end-trigger.start)*[.1,.48,.86][index],immediate)
  else{current.current=index;setActive(index)}
 }
 const key=(event:KeyboardEvent<HTMLButtonElement>,index:number)=>{
  let next=index
  if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%3
  else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index+2)%3
  else if(event.key==='Home')next=0
  else if(event.key==='End')next=2
  else return
  event.preventDefault();select(next,true);tabs.current[next]?.focus({preventScroll:true})
 }
 return <section ref={root} className="expertise-journey" id="expertise" aria-labelledby="expertise-title" data-active-stage={active}>
  <div className="expertise-stage section-shell">
   <div className="expertise-intro"><ScrollHeading id="expertise-title" text="Built around you."/><p data-scroll-copy="">Your ambition, translated into software that feels right. From the first impression to the everyday details.</p></div>
   <div className="expertise-layout">
    <div className="expertise-copy">
     <div className="expertise-panels">{services.map((service,i)=><div key={service.name} id={`expertise-panel-${i}`} role="tabpanel" aria-labelledby={`expertise-tab-${i}`} aria-hidden={active!==i} tabIndex={active===i?0:-1} className={`expertise-panel ${active===i?'is-current':''}`}>
      <span className="expertise-number" aria-hidden="true">0{i+1}</span><h3>{service.title}</h3><p>{service.description}</p><p className="expertise-detail">{service.detail}</p>
     </div>)}</div>
     <button className="studio-text-link" onClick={()=>onEnquire(services[active].name)}>Let’s build it <ArrowIcon/></button>
    </div>
    <div className="expertise-media"><div className="expertise-image-stack">{services.map((service,i)=><figure key={service.name} className={`expertise-image ${active===i?'is-current':''}`} aria-hidden={active!==i}><img src={service.image} alt={service.alt} width="1280" height="800" loading="lazy"/></figure>)}</div><p>Interface explorations by CEFABEX</p></div>
   </div>
   <div role="tablist" aria-label="Explore our expertise" className="expertise-tabs">{services.map((service,i)=><button key={service.name} role="tab" id={`expertise-tab-${i}`} aria-controls={`expertise-panel-${i}`} aria-selected={active===i} tabIndex={active===i?0:-1} ref={node=>{tabs.current[i]=node}} onClick={()=>select(i)} onKeyDown={event=>key(event,i)} className={active===i?'is-current':''}><span className="expertise-tab-track"><span className="expertise-tab-fill"/></span><span className="expertise-tab-number">0{i+1}</span><span className="expertise-tab-name">{service.name}</span><span className="expertise-tab-short">{service.short}</span><ArrowIcon/></button>)}</div>
  </div>
 </section>
}
