import {useLayoutEffect} from 'react'
import {gsap,ScrollTrigger,useReducedMotion} from '../lib/motion'

/** A single owner for content reveals. Each route gets a different motion vocabulary. */
export default function SiteMotion({path}:{path:string}){
 const reduced=useReducedMotion()
 useLayoutEffect(()=>{
  const root=document.getElementById('site-content')
  if(!root||reduced)return
  const restorations:(()=>void)[]=[]
  const context=gsap.context(()=>{
   const kind=path.split('/')[1]||'home'
   root.dataset.motionStyle=kind
   // The hero owns its pinned timeline; all other headings use semantic word masks.
   root.querySelectorAll<HTMLElement>('main h1:not(.opening-copy h1),main h2,main h3,.page-footer h2').forEach(heading=>{
    if(heading.closest('.brand-journey,.premium-home'))return
    const original=heading.innerHTML
    const originalLabel=heading.getAttribute('aria-label')
    heading.setAttribute('aria-label',heading.innerText.replace(/\s+/g,' ').trim())
    const textNodes:Text[]=[]
    const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT)
    while(walker.nextNode())textNodes.push(walker.currentNode as Text)
    textNodes.forEach(node=>{
     const fragment=document.createDocumentFragment()
     node.textContent?.split(/(\s+)/).filter(Boolean).forEach(word=>{
      if(/^\s+$/.test(word)){fragment.append(document.createTextNode(word));return}
      const mask=document.createElement('span');mask.className='reveal-mask';mask.setAttribute('aria-hidden','true')
      const inner=document.createElement('span');inner.className='reveal-word';inner.textContent=word;mask.append(inner);fragment.append(mask)
     })
     node.replaceWith(fragment)
    })
    restorations.push(()=>{heading.innerHTML=original;if(originalLabel===null)heading.removeAttribute('aria-label');else heading.setAttribute('aria-label',originalLabel)})
    const words=heading.querySelectorAll('.reveal-word')
    const from=kind==='services'?{xPercent:-105,opacity:.2}:kind==='contact'?{yPercent:105,rotation:3}:{yPercent:110,rotationX:kind==='about'?-30:0}
    gsap.fromTo(words,from,{xPercent:0,yPercent:0,rotationX:0,rotation:0,opacity:1,duration:kind==='contact'?1:.85,stagger:.045,ease:'power3.out',delay:heading.getBoundingClientRect().top<innerHeight?.2:0,scrollTrigger:{trigger:heading,start:'top 93%',toggleActions:'play none none reverse'}})
   })
   // Sequence the text within each section instead of creating a listener per word.
   const groups=root.querySelectorAll<HTMLElement>('.page-split,.page-service-list section,.project-feature,.page-intro,.contact-page-grid,.project-related,.page-footer-meta,.site-page-links')
   groups.forEach(group=>{
    const items=group.querySelectorAll<HTMLElement>('p:not(.page-footer-name),.studio-text-link,.project-button,details,.contact-email,.contact-phone,.studio-contact-button,.company-socials a')
    if(!items.length)return
    gsap.fromTo(items,{y:kind==='contact'?30:18,opacity:0},{y:0,opacity:1,duration:.8,stagger:.07,ease:'power3.out',scrollTrigger:{trigger:group,start:'top 89%',toggleActions:'play none none reverse'}})
   })
   const pictures=root.querySelectorAll<HTMLElement>('.simple-projects img,.project-photo img,.page-split > img,.partner-pictures img,.project-detail-image img')
   pictures.forEach((image,index)=>{
    gsap.fromTo(image,{scale:1.1,y:kind==='projects'?48:24,opacity:.4,clipPath:kind==='about'?'inset(12% 0% 12% 0%)':index%2?'inset(0% 18% 0% 0%)':'inset(18% 0% 0% 0%)',rotation:kind==='projects'?(index%2?2:-2):0},{scale:1,y:0,rotation:0,opacity:1,clipPath:'inset(0% 0% 0% 0%)',ease:'none',scrollTrigger:{trigger:image,start:'top 96%',end:'top 38%',scrub:.65}})
   })
   if(kind==='about')gsap.fromTo('.panorama-frame img',{yPercent:-7,scale:1.15},{yPercent:7,scale:1.15,ease:'none',scrollTrigger:{trigger:'.panorama-frame',start:'top bottom',end:'bottom top',scrub:.7}})
   if(kind==='services'){
    root.querySelectorAll<HTMLElement>('.page-service-list section').forEach((section,index)=>{
     gsap.fromTo(section,{x:index%2?40:-40},{x:0,ease:'none',scrollTrigger:{trigger:section,start:'top 96%',end:'top 55%',scrub:.6}})
    })
   }
   if(kind==='contact')gsap.fromTo('.contact-side',{rotationY:-8,transformPerspective:1000,transformOrigin:'left center'},{rotationY:0,ease:'none',scrollTrigger:{trigger:'.contact-page-grid',start:'top 95%',end:'top 35%',scrub:.6}})
   const footer=root.querySelector('.page-footer-name')
   if(footer)gsap.fromTo(footer.children,{yPercent:110},{yPercent:0,duration:1.1,stagger:.055,ease:'power3.out',scrollTrigger:{trigger:footer,start:'top 98%',once:true}})
   gsap.fromTo('.page-header .header-brand,.page-header .page-nav:not(.open) a,.page-header .header-action',{opacity:0,y:-10},{opacity:1,y:0,duration:.7,stagger:.045,ease:'power3.out',delay:.15})
  },root)
  const refresh=()=>ScrollTrigger.refresh()
  document.fonts.ready.then(refresh)
  const images=Array.from(root.querySelectorAll('img'))
  images.forEach(image=>image.addEventListener('load',refresh,{once:true}))
  return()=>{images.forEach(image=>image.removeEventListener('load',refresh));context.revert();restorations.forEach(restore=>restore())}
 },[path,reduced])
 return null
}
