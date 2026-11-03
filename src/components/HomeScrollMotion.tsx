import {useLayoutEffect} from 'react'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
export default function HomeScrollMotion({ready}:{ready:boolean}){
 useLayoutEffect(()=>{
  if(!ready)return
  const root=document.querySelector<HTMLElement>('main[data-homepage]')
  if(!root)return
  const media=gsap.matchMedia()
  let alive=true,refreshFrame=0
  const refresh=()=>{cancelAnimationFrame(refreshFrame);refreshFrame=requestAnimationFrame(()=>{if(alive)ScrollTrigger.refresh()})}
  media.add({motion:'(prefers-reduced-motion: no-preference)',wide:'(min-width: 1000px) and (min-height: 740px)'},context=>{
   if(!context.conditions?.motion)return
   const wide=Boolean(context.conditions.wide)
   root.dataset.homeMotion='ready'

   root.querySelectorAll<HTMLElement>('[data-scroll-heading]').forEach(heading=>{
    gsap.fromTo(heading.querySelectorAll('.home-word-mask > span'),{yPercent:110},{yPercent:0,stagger:.06,ease:'none',scrollTrigger:{trigger:heading,start:'top 94%',end:'top 56%',scrub:true}})
   })
   root.querySelectorAll<HTMLElement>('[data-scroll-copy]').forEach(copy=>{
    gsap.fromTo(copy,{y:24,opacity:.2},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:copy,start:'top 96%',end:'top 72%',scrub:true}})
   })
   root.querySelectorAll<HTMLElement>('.company-picture').forEach((picture,i)=>{
    gsap.fromTo(picture,{clipPath:i?'inset(24% 0% 0% 18%)':'inset(0% 18% 24% 0%)',y:i?72:40},{clipPath:'inset(0% 0% 0% 0%)',y:0,ease:'none',scrollTrigger:{trigger:picture,start:'top 98%',end:'top 25%',scrub:true}})
   })

   const manifesto=root.querySelector<HTMLElement>('.manifesto-journey')!
   gsap.fromTo(manifesto.querySelectorAll('.manifesto-word'),{opacity:.18},{opacity:1,stagger:.09,duration:.12,ease:'none',scrollTrigger:{trigger:manifesto,start:'top 48%',end:'bottom 90%',scrub:true,onUpdate:self=>{manifesto.dataset.scrollProgress=String(self.progress)}}})

   const work=root.querySelector<HTMLElement>('.work-journey')!
   const track=work.querySelector<HTMLElement>('.work-track')!
   const viewport=work.querySelector<HTMLElement>('.work-viewport')!
   if(wide){
    work.classList.add('has-work-scroll')
    const distance=()=>Math.max(0,track.scrollWidth-viewport.clientWidth+parseFloat(getComputedStyle(viewport).paddingLeft)*2)
    gsap.to(track,{x:()=>-distance(),ease:'none',scrollTrigger:{trigger:work,pin:work.querySelector<HTMLElement>('.work-stage')!,start:'top top',end:()=>`+=${distance()*.8}`,scrub:true,invalidateOnRefresh:true,onRefresh:self=>{work.dataset.scrollStart=String(self.start);work.dataset.scrollEnd=String(self.end)},onUpdate:self=>{
     work.dataset.scrollProgress=String(self.progress)
     gsap.set(work.querySelector('.work-progress > span'),{scaleX:self.progress})
    }}})
   }else{
    work.querySelectorAll<HTMLElement>('.work-image').forEach(picture=>{
     gsap.fromTo(picture,{clipPath:'inset(16% 0% 16% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',ease:'none',scrollTrigger:{trigger:picture,start:'top 96%',end:'top 40%',scrub:true}})
    })
   }

   const process=root.querySelector<HTMLElement>('.process-journey')!
   const digits=process.querySelectorAll('.process-digit')
   const steps=process.querySelectorAll('.process-step-copy')
   if(wide){
    process.classList.add('has-process-scroll')
    gsap.set(digits,{yPercent:110});gsap.set(digits[0],{yPercent:0})
    gsap.set(steps,{opacity:.62});gsap.set(steps[0],{opacity:1})
    const dummy={value:0}
    const timeline=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:process,pin:process.querySelector<HTMLElement>('.process-stage')!,start:'top top',end:()=>`+=${innerHeight*1.8}`,scrub:true,invalidateOnRefresh:true,onRefresh:self=>{process.dataset.scrollStart=String(self.start);process.dataset.scrollEnd=String(self.end)},onUpdate:self=>{process.dataset.scrollProgress=String(self.progress);process.dataset.activeStep=String(self.progress<.32?0:self.progress<.66?1:2)}}})
    timeline.to(dummy,{value:1,duration:1},0).fromTo(process.querySelector('.process-line > span'),{scaleY:0},{scaleY:1,duration:1},0)
    for(let i=1;i<3;i++){
     const at=i===1?.26:.6
     timeline.to(digits[i-1],{yPercent:-110,duration:.12},at).to(digits[i],{yPercent:0,duration:.12},at)
      .to(steps[i-1],{opacity:.62,duration:.12},at).to(steps[i],{opacity:1,duration:.12},at)
    }
   }else{
    process.querySelectorAll('li').forEach(step=>gsap.fromTo(step,{y:24,opacity:.35},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:step,start:'top 96%',end:'top 65%',scrub:true}}))
    gsap.fromTo(process.querySelector('.process-line > span'),{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:process.querySelector('.process-steps'),start:'top 70%',end:'bottom 70%',scrub:true}})
   }
   root.querySelectorAll<HTMLElement>('.studio-questions details').forEach(row=>gsap.fromTo(row,{y:24,opacity:.3},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:row,start:'top 98%',end:'top 78%',scrub:true}}))
   const footer=root.querySelector<HTMLElement>('.studio-footer')!
   gsap.fromTo(footer.querySelectorAll('.footer-letter'),{yPercent:100},{yPercent:0,stagger:.04,ease:'none',scrollTrigger:{trigger:footer,start:'top 94%',end:'top 20%',scrub:true}})
   return()=>{work.classList.remove('has-work-scroll');process.classList.remove('has-process-scroll');delete root.dataset.homeMotion}
  },root)
  const images=Array.from(root.querySelectorAll('img'))
  images.forEach(image=>image.addEventListener('load',refresh))
  document.fonts.ready.then(()=>{if(alive)refresh()})
  refresh()
  return()=>{alive=false;cancelAnimationFrame(refreshFrame);images.forEach(image=>image.removeEventListener('load',refresh));media.revert()}
 },[ready])
 return null
}
