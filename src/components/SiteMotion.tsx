import {useEffect} from 'react'
import {useReducedMotion} from 'motion/react'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {PAGE_TURN} from '../lib/motionConfig'

gsap.registerPlugin(ScrollTrigger)
export default function SiteMotion({path}:{path:string}){
 const reduced=Boolean(useReducedMotion())
 useEffect(()=>{
  if(reduced||path==='/')return
  const root=document.getElementById('site-content')!
  const entryDelay=document.documentElement.classList.contains('is-page-turning')?PAGE_TURN.contentDelay:0
  const context=gsap.context(()=>{
   root.querySelectorAll<HTMLElement>('.company-page h1,.company-page h2,.company-page h3,.company-intro h2,.company-ecosystem h3').forEach(heading=>{
    heading.setAttribute('aria-label',heading.textContent||'')
    const words=(heading.textContent||'').split(' ')
    heading.replaceChildren(...words.map(word=>{const mask=document.createElement('span');mask.className='motion-word-mask';mask.setAttribute('aria-hidden','true');const inner=document.createElement('span');inner.textContent=word+' ';mask.append(inner);return mask}))
    gsap.fromTo(heading.querySelectorAll('.motion-word-mask > span'),{yPercent:100},{yPercent:0,duration:.7,stagger:.03,delay:heading.getBoundingClientRect().top<innerHeight?entryDelay:0,ease:'power3.out',scrollTrigger:{trigger:heading,start:'top 94%',once:true}})
   })
   root.querySelectorAll<HTMLElement>('.company-page section p,.company-page .page-intro > p,.company-page .project-feature > div:last-child,.page-footer-meta,.company-capabilities,.company-ecosystem article > p').forEach((el,i)=>{
    gsap.fromTo(el,{y:12,opacity:0},{y:0,opacity:1,duration:.6,delay:(i%3)*.045+(el.getBoundingClientRect().top<innerHeight?entryDelay:0),ease:'power3.out',scrollTrigger:{trigger:el,start:'top 96%',once:true}})
   })
  },root)
  return()=>context.revert()
 },[path,reduced])
 return null
}
