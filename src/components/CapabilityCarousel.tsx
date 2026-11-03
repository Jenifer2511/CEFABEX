import {useLayoutEffect,useRef,useState} from 'react'
import type {KeyboardEvent} from 'react'
import {useReducedMotion} from 'motion/react'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import type {ScrollToPosition} from './ExpertiseJourney'
import ScrollHeading from './ScrollHeading'
import ArrowIcon from './ArrowIcon'
import '../capability-carousel.css'

gsap.registerPlugin(ScrollTrigger)

const capabilities=[
 {name:'Web experiences',description:'A distinctive digital presence, engineered for clarity, speed and the people using it.',image:'/editorial/web-experience.webp',alt:'CEFABEX website interface exploration',kind:'Interface study'},
 {name:'Mobile products',description:'Thoughtful journeys from the first tap to the everyday interactions that keep a product useful.',image:'/editorial/mobile-experience.webp',alt:'CEFABEX mobile application interface exploration',kind:'Interface study'},
 {name:'Business platforms',description:'Purpose-built workspaces that connect your information, your processes and your team.',image:'/editorial/data-platform.webp',alt:'CEFABEX business software interface exploration',kind:'Interface study'},
 {name:'Commerce experiences',description:'Clear product discovery, considered purchasing flows and tools for the business behind the store.',image:'/editorial/commerce-experience.webp',alt:'Original commerce dashboard interface study',kind:'Interface study'},
 {name:'Cloud delivery',description:'Frontend architecture, backend systems and cloud deployment brought together as one working product.',image:'/editorial/cloud-delivery.webp',alt:'Original application deployment interface study',kind:'Interface study'},
 {name:'Connected systems',description:'Digital experiences that reach into the physical world through customized IoT and hardware projects.',image:'/company/iot.webp',alt:'Connected hardware and laptop project from the CEFABEX company profile',kind:'Company project'},
 {name:'Research to prototype',description:'A practical path from an early engineering idea to a physical or digital prototype.',image:'/company/agriculture.webp',alt:'Agricultural engineering prototype from the CEFABEX company profile',kind:'Company project'},
]
const limit=(value:number)=>Math.max(0,Math.min(capabilities.length-1,value))

export default function CapabilityCarousel({ready,onScrollTo,onEnquire}:{ready:boolean;onScrollTo:ScrollToPosition;onEnquire?:(service?:string)=>void}){
 const root=useRef<HTMLElement>(null)
 const trigger=useRef<ScrollTrigger|null>(null)
 const renderRef=useRef<(position:number)=>void>(()=>{})
 const position=useRef({value:0})
 const manualTween=useRef<gsap.core.Tween|null>(null)
 const selected=useRef(0)
 const [active,setActive]=useState(0)
 const [manualAnnouncement,setManualAnnouncement]=useState('')
 const reduced=Boolean(useReducedMotion())

 useLayoutEffect(()=>{
  if(!root.current)return
  const element=root.current
  const cards=Array.from(element.querySelectorAll<HTMLElement>('.cap-card'))
  const progress=element.querySelector<HTMLElement>('.cap-progress-fill')!
  const render=(value:number)=>{
   position.current.value=limit(value)
   const index=Math.round(position.current.value)
   element.dataset.carouselPosition=String(position.current.value)
   if(selected.current!==index){selected.current=index;setActive(index)}
   const mobile=innerWidth<650
   const step=Math.min(innerWidth*(mobile?.43:.39),570)
   cards.forEach((card,i)=>{
    let distance=i-position.current.value
    // Wrap the side cards around the centre so the collection reads as a carousel.
    if(distance>capabilities.length/2)distance-=capabilities.length
    if(distance<-capabilities.length/2)distance+=capabilities.length
    const magnitude=Math.abs(distance)
    const x=distance*step
    const y=magnitude*(mobile?10:20)
    const z=-magnitude*(mobile?140:230)
    card.style.transform=reduced?'translate(-50%, -50%)':`translate(-50%, -50%) translate3d(${x}px,${y}px,${z}px) rotateY(${-distance*23}deg)`
    card.style.opacity=reduced?(i===index?'1':'0'):String(Math.max(0,1-Math.max(0,magnitude-1)*.65))
    card.style.visibility=(reduced?i!==index:magnitude>2.55)?'hidden':'visible'
    card.style.zIndex=String(20-Math.round(magnitude*4))
   })
   progress.style.transform=`scaleX(${(position.current.value+1)/capabilities.length})`
  }
  renderRef.current=render
  render(position.current.value)
  const resize=()=>render(position.current.value)
  window.addEventListener('resize',resize,{passive:true})
  const media=gsap.matchMedia()
  if(ready&&!reduced)media.add('(min-height: 740px)',()=>{
   element.classList.add('cap-scroll-enabled')
   trigger.current=ScrollTrigger.create({trigger:element,start:'top top',end:'bottom bottom',invalidateOnRefresh:true,onRefresh:self=>{
    element.dataset.scrollStart=String(self.start);element.dataset.scrollEnd=String(self.end);render(self.progress*(capabilities.length-1))
   },onUpdate:self=>render(self.progress*(capabilities.length-1))})
   return()=>{trigger.current=null;element.classList.remove('cap-scroll-enabled')}
  },element)
  return()=>{manualTween.current?.kill();media.revert();window.removeEventListener('resize',resize);renderRef.current=()=>{}}
 },[ready,reduced])

 const select=(index:number,immediate=false)=>{
  const next=limit(index)
  if(next!==selected.current)setManualAnnouncement(`${capabilities[next].name}. ${next+1} of ${capabilities.length}. ${capabilities[next].description}`)
  manualTween.current?.kill()
  if(trigger.current){
   const scene=trigger.current
   onScrollTo(scene.start+(scene.end-scene.start)*next/(capabilities.length-1),immediate)
  }else if(reduced||immediate)renderRef.current(next)
  else manualTween.current=gsap.to(position.current,{value:next,duration:.85,ease:'power3.out',onUpdate:()=>renderRef.current(position.current.value)})
 }
 const key=(event:KeyboardEvent<HTMLElement>)=>{
  if(event.key==='ArrowRight'){event.preventDefault();select(active+1,true)}
  else if(event.key==='ArrowLeft'){event.preventDefault();select(active-1,true)}
  else if(event.key==='Home'){event.preventDefault();select(0,true)}
  else if(event.key==='End'){event.preventDefault();select(capabilities.length-1,true)}
 }

 return <section ref={root} className="capability-carousel" id="possibilities" aria-labelledby="capability-title" data-thread-stop="right" data-active-capability={active} onKeyDown={key}>
  <div className="cap-stage">
   <div className="cap-heading section-shell"><ScrollHeading text="Possibility, in every direction." id="capability-title"/><p>From a first impression to a connected system. Explore what we can bring to life together.</p></div>
   <div className="cap-viewport" role="region" aria-roledescription="carousel" aria-label="CEFABEX capabilities">
    {capabilities.map((item,i)=><figure key={item.name} className="cap-card" aria-hidden={active!==i}>
     <img src={item.image} alt={item.alt} width="1280" height="800" loading="lazy"/>
     <figcaption><span>{item.name}</span><span>{item.kind}</span></figcaption>
    </figure>)}
   </div>
   <div className="cap-bottom section-shell">
    <div className="cap-detail" aria-live="off"><span className="cap-counter">0{active+1}<span> / 0{capabilities.length}</span></span><div><h3>{capabilities[active].name}</h3><p>{capabilities[active].description}</p></div></div>
    <div className="cap-actions"><div className="cap-controls"><button type="button" aria-label="Previous capability" onClick={()=>select(active-1)} disabled={active===0}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6"/></svg></button><button type="button" aria-label="Next capability" onClick={()=>select(active+1)} disabled={active===capabilities.length-1}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button></div>{onEnquire&&<button type="button" className="cap-enquire" onClick={()=>onEnquire(capabilities[active].name)}>Discuss your idea <ArrowIcon/></button>}</div>
   </div>
   <div className="cap-progress" aria-hidden="true"><span className="cap-progress-fill"/></div>
   <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{manualAnnouncement}</p>
  </div>
 </section>
}
