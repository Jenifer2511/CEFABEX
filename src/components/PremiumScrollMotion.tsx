import {useLayoutEffect} from 'react'
import {gsap,ScrollTrigger,scrollToPosition,useReducedMotion} from '../lib/motion'

/** Home chapters own distinct timelines; no second smooth-scroll engine. */
export default function PremiumScrollMotion(){
 const reduced=useReducedMotion()
 useLayoutEffect(()=>{
  const root=document.querySelector<HTMLElement>('.premium-home')
  if(!root||reduced)return
  let alive=true,refreshFrame=0
  const refresh=()=>{cancelAnimationFrame(refreshFrame);refreshFrame=requestAnimationFrame(()=>{if(alive)ScrollTrigger.refresh()})}
  const media=gsap.matchMedia()
  media.add({wide:'(min-width: 1000px) and (min-height: 720px)',all:'(min-width: 0px)'},context=>{
   const cleanups:(()=>void)[]=[]
   const wide=Boolean(context.conditions?.wide)
   root.dataset.choreography='ready'
   root.querySelectorAll<HTMLElement>('.scene-title').forEach((heading,index)=>{
    gsap.fromTo(heading.querySelectorAll('.scene-word'),{yPercent:112,rotation:index%2?-5:5},{yPercent:0,rotation:0,stagger:.07,ease:'none',scrollTrigger:{trigger:heading,start:'top 96%',end:'top 60%',scrub:.5}})
   })
   gsap.fromTo('.about-portrait',{clipPath:'inset(18% 14% 0% 0%)',y:64},{clipPath:'inset(0% 0% 0% 0%)',y:0,ease:'none',scrollTrigger:{trigger:'.about-portrait',start:'top 95%',end:'top 35%',scrub:.6}})
   gsap.fromTo('.about-portrait img',{scale:1.12},{scale:1,ease:'none',scrollTrigger:{trigger:'.about-portrait',start:'top bottom',end:'bottom top',scrub:.8}})
   gsap.fromTo('.manifesto-word',{opacity:.22},{opacity:1,stagger:.09,ease:'none',scrollTrigger:{trigger:'.manifesto-text',start:'top 85%',end:'bottom 58%',scrub:.4}})
   root.querySelectorAll<HTMLElement>('.simple-services article').forEach((row,index)=>{
    const timeline=gsap.timeline({scrollTrigger:{trigger:row,start:'top 96%',end:'top 60%',scrub:.5}})
    timeline.fromTo(row.querySelector('h3'),{x:index%2?48:-48,opacity:.15},{x:0,opacity:1,duration:1,ease:'none'},0)
     .fromTo(row.querySelector('div'),{y:32,opacity:.15},{y:0,opacity:1,duration:.8,ease:'none'},.15)
     .fromTo(row.querySelector('.service-index'),{y:32,opacity:0},{y:0,opacity:1,duration:.8},.1)
     .fromTo(row.querySelector('a'),{rotation:-45,opacity:0},{rotation:0,opacity:1,duration:.8},.2)
   })
   const work=root.querySelector<HTMLElement>('.simple-work')!,track=work.querySelector<HTMLElement>('.project-track')!,viewport=work.querySelector<HTMLElement>('.project-viewport')!
   if(wide){
    work.classList.add('is-horizontal')
    const distance=()=>Math.max(0,track.scrollWidth-viewport.clientWidth)
    const controls=Array.from(work.querySelectorAll<HTMLButtonElement>('[data-work-direction]'))
    const cards=Array.from(track.querySelectorAll<HTMLAnchorElement>('.project-teaser'))
    const tween=gsap.to(track,{x:()=>-distance(),ease:'none',scrollTrigger:{id:'work-gallery',trigger:work,start:'top top',end:()=>`+=${distance()}`,pin:work.querySelector('.work-stage'),scrub:.65,invalidateOnRefresh:true,onRefresh:self=>{work.dataset.scrollStart=String(self.start);work.dataset.scrollEnd=String(self.end)},onUpdate:self=>{work.dataset.progress=self.progress.toFixed(3);gsap.set('.work-scroll-line > span',{scaleX:self.progress});controls.forEach(button=>{button.disabled=Number(button.dataset.workDirection)<0?self.progress<.01:self.progress>.99})}}})
    const showCard=(index:number,immediate=false)=>{
     const trigger=tween.scrollTrigger!,offset=Math.min(distance(),cards[index].offsetLeft)
     const top=trigger.start+(offset/distance())*(trigger.end-trigger.start)
     scrollToPosition(top,immediate)
    }
    const focus=(event:FocusEvent)=>{const card=(event.target as HTMLElement).closest<HTMLAnchorElement>('.project-teaser');if(card?.matches(':focus-visible'))showCard(cards.indexOf(card),true)}
    const click=(event:Event)=>{const button=event.currentTarget as HTMLButtonElement;const next=Math.max(0,Math.min(cards.length-1,Math.round(tween.scrollTrigger!.progress*(cards.length-1))+Number(button.dataset.workDirection)));showCard(next)}
    track.addEventListener('focusin',focus);controls.forEach(button=>button.addEventListener('click',click))
    cleanups.push(()=>{track.removeEventListener('focusin',focus);controls.forEach(button=>{button.removeEventListener('click',click);button.disabled=false})})
   }else{
    work.querySelectorAll<HTMLElement>('.project-visual').forEach((image,index)=>gsap.fromTo(image,{clipPath:index%2?'inset(0% 20% 0% 0%)':'inset(14% 0% 0% 14%)',y:36},{clipPath:'inset(0% 0% 0% 0%)',y:0,ease:'none',scrollTrigger:{trigger:image,start:'top 95%',end:'top 45%',scrub:.5}}))
   }
   const process=root.querySelector<HTMLElement>('.simple-approach')!,digits=process.querySelectorAll('.process-number > span'),steps=process.querySelectorAll('li')
   if(wide){
    process.classList.add('is-pinned')
    gsap.set(digits,{yPercent:112});gsap.set(digits[0],{yPercent:0});gsap.set(steps,{opacity:.78});gsap.set(steps[0],{opacity:1})
    const pose={value:0}
    const timeline=gsap.timeline({scrollTrigger:{id:'process-chapters',trigger:process,start:'top top',end:()=>`+=${innerHeight*1.6}`,pin:process.querySelector('.process-stage'),scrub:.55,invalidateOnRefresh:true,onRefresh:self=>{process.dataset.scrollStart=String(self.start);process.dataset.scrollEnd=String(self.end)},onUpdate:self=>{process.dataset.progress=self.progress.toFixed(3)}}})
    timeline.to(pose,{value:1,duration:1,ease:'none'},0).fromTo('.process-rule > span',{scaleY:0},{scaleY:1,duration:1,ease:'none'},0)
    for(let i=1;i<3;i++){const at=i===1?.26:.6;timeline.to(digits[i-1],{yPercent:-112,duration:.15},at).to(digits[i],{yPercent:0,duration:.15},at).to(steps[i-1],{opacity:.78,duration:.15},at).to(steps[i],{opacity:1,duration:.15},at)}
   }else{
    gsap.set(digits,{display:'none'});gsap.set(digits[0],{display:'block'})
    steps.forEach((step,i)=>gsap.fromTo(step,{x:i%2?24:-24,opacity:.2},{x:0,opacity:1,ease:'none',scrollTrigger:{trigger:step,start:'top 95%',end:'top 65%',scrub:.4}}))
    gsap.fromTo('.process-rule > span',{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:'.process-body',start:'top 70%',end:'bottom 70%',scrub:true}})
   }
   root.querySelectorAll('.studio-questions details').forEach((row,index)=>gsap.fromTo(row,{x:24,opacity:0},{x:0,opacity:1,duration:.7,delay:index*.05,ease:'power3.out',scrollTrigger:{trigger:row,start:'top 96%',once:true}}))
   return()=>{cleanups.forEach(cleanup=>cleanup());work.classList.remove('is-horizontal');process.classList.remove('is-pinned');delete root.dataset.choreography}
  },root)
  const images=Array.from(root.querySelectorAll('img'));images.forEach(image=>image.addEventListener('load',refresh));document.fonts.ready.then(()=>{if(alive)refresh()});refresh()
  return()=>{alive=false;cancelAnimationFrame(refreshFrame);images.forEach(image=>image.removeEventListener('load',refresh));media.revert()}
 },[reduced])
 return null
}
