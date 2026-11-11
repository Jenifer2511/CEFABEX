import {useLayoutEffect} from 'react'
import {useReducedMotion} from '../lib/motion'

const surfaces='.page-nav,.header-action,.project-button,.studio-contact-button,.brief-submit,.brief-secondary,.brief-dialog,.journey-bottom > a,.brand-resolution-copy > a,.contact-side'
const controls='.header-action,.project-button,.studio-contact-button,.brief-submit,.brief-secondary,.journey-bottom > a,.brand-resolution-copy > a,.studio-questions summary'

/** One delegated listener and one requested frame; no permanent animation loop. */
export default function LiquidGlass({path}:{path:string}){
 const reduced=useReducedMotion()
 useLayoutEffect(()=>{
  const root=document.getElementById('site-content')
  if(!root)return
  const elements=new Set<HTMLElement>()
  const apply=(element:HTMLElement)=>{
   if(elements.has(element))return
   elements.add(element);element.dataset.liquid=''
   element.style.setProperty('--glass-x','50%');element.style.setProperty('--glass-y','0%')
  }
  root.querySelectorAll<HTMLElement>(surfaces).forEach(apply)
  // The enquiry swaps its form for a result; style those newly mounted controls too.
  const observer=new MutationObserver(records=>{
   for(const record of records)for(const node of record.addedNodes){
    if(!(node instanceof HTMLElement)||node.classList.contains('glass-ripple'))continue
    if(node.matches(surfaces))apply(node)
    node.querySelectorAll<HTMLElement>(surfaces).forEach(apply)
   }
   elements.forEach(element=>{if(!root.contains(element))elements.delete(element)})
  })
  observer.observe(root,{childList:true,subtree:true})
  const clear=()=>{observer.disconnect();elements.forEach(element=>{element.removeAttribute('data-liquid');element.style.removeProperty('--glass-x');element.style.removeProperty('--glass-y')})}
  if(reduced)return clear
  let frame=0,active:HTMLElement|null=null,x=0,y=0
  const ripples=new Set<HTMLElement>()
  const render=()=>{
   frame=0
   active?.style.setProperty('--glass-x',`${x}px`)
   active?.style.setProperty('--glass-y',`${y}px`)
  }
  const move=(event:PointerEvent)=>{
   if(event.pointerType!=='mouse')return
   const surface=(event.target as Element).closest<HTMLElement>('[data-liquid]')
   if(!surface||!root.contains(surface))return
   const box=surface.getBoundingClientRect();active=surface;x=event.clientX-box.left;y=event.clientY-box.top
   if(!frame)frame=requestAnimationFrame(render)
  }
  const press=(event:PointerEvent)=>{
   if(event.button!==0)return
   const control=(event.target as Element).closest<HTMLElement>(controls)
   const surface=control?.closest<HTMLElement>('[data-liquid]')
   if(!surface||!root.contains(surface))return
   // Keep repeated input bounded; each surface holds at most one ripple.
   const previous=surface.querySelector<HTMLElement>(':scope > .glass-ripple')
   if(previous){ripples.delete(previous);previous.remove()}
   const box=surface.getBoundingClientRect()
   const ripple=document.createElement('span');ripple.className='glass-ripple';ripple.setAttribute('aria-hidden','true')
   ripple.style.left=`${event.clientX-box.left}px`;ripple.style.top=`${event.clientY-box.top}px`
   ripple.addEventListener('animationend',()=>{ripples.delete(ripple);ripple.remove()},{once:true})
   surface.append(ripple);ripples.add(ripple)
  }
  root.addEventListener('pointermove',move,{passive:true})
  root.addEventListener('pointerdown',press,{passive:true})
  return()=>{
   root.removeEventListener('pointermove',move);root.removeEventListener('pointerdown',press);cancelAnimationFrame(frame)
   ripples.forEach(ripple=>ripple.remove())
   clear()
  }
 },[path,reduced])
 return null
}
