import {useEffect} from 'react'

export default function SiteMotion({path}:{path:string}){
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return
  const elements=document.querySelectorAll<HTMLElement>('.simple-hero > div,.simple-section,.page-intro,.page-split,.page-service-list section,.project-feature')
  const animations=new Set<Animation>()
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting)continue
    const animation=entry.target.animate([{opacity:.65,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.22,1,.36,1)'})
    animations.add(animation)
    animation.onfinish=()=>animations.delete(animation)
    observer.unobserve(entry.target)
   }
  },{threshold:.08})
  elements.forEach(el=>observer.observe(el))
  const preference=matchMedia('(prefers-reduced-motion: reduce)')
  const stop=()=>{if(preference.matches){observer.disconnect();animations.forEach(a=>a.cancel())}}
  preference.addEventListener('change',stop)
  return()=>{observer.disconnect();animations.forEach(a=>a.cancel());preference.removeEventListener('change',stop)}
 },[path])
 return null
}
