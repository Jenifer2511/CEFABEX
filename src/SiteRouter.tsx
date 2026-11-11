import {useEffect,useLayoutEffect,useRef,useState} from 'react'
import App from './App'
import CompanyPages from './CompanyPages'
import SiteMotion from './components/SiteMotion'
import MotionRuntime from './components/MotionRuntime'
import {gsap,lockScroll,resetScroll,useReducedMotion} from './lib/motion'

const routeTitle=(path:string)=>path==='/'?'CEFABEX':path.startsWith('/projects/')?'The work':({'/about':'Our story','/services':'Possibilities','/projects':'Selected work','/contact':'Let’s talk'}[path]||'CEFABEX')
export default function SiteRouter(){
 const [path,setPath]=useState(location.pathname)
 const currentPath=useRef(path)
 currentPath.current=path
 const overlay=useRef<HTMLDivElement>(null)
 const pending=useRef(false)
 const target=useRef<URL|null>(null)
 const timeline=useRef<gsap.core.Timeline|null>(null)
 const reduced=useReducedMotion()
 useEffect(()=>{
  const go=(url:URL,pop=false)=>{
   if(pending.current)return
   pending.current=true;target.current=url
   const commit=()=>{if(!pop)history.pushState({},'',url.pathname+url.search+url.hash);resetScroll();setPath(url.pathname)}
   if(reduced){commit();pending.current=false;return}
   lockScroll('navigation',true)
   const root=overlay.current!
   root.dataset.destination=url.pathname.split('/')[1]||'home'
   root.querySelector('.transition-title')!.textContent=routeTitle(url.pathname)
   gsap.set(root,{visibility:'visible'})
   const panels=root.querySelectorAll('.transition-panel')
   const horizontal=url.pathname==='/services'
   gsap.set(panels,{xPercent:horizontal?-102:0,yPercent:horizontal?0:102,scaleX:1,scaleY:1})
   timeline.current=gsap.timeline({onComplete:commit}).to(panels,{xPercent:0,yPercent:0,duration:.48,stagger:.035,ease:'power3.inOut'},0).fromTo('.transition-title',{opacity:0,y:20},{opacity:1,y:0,duration:.3},.18)
  }
  const click=(event:MouseEvent)=>{
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return
   const link=(event.target as Element).closest<HTMLAnchorElement>('a[href]')
   if(!link||link.target==='_blank'||link.hasAttribute('download'))return
   const url=new URL(link.href,location.href)
   if(url.origin!==location.origin||url.pathname===location.pathname)return
   event.preventDefault();go(url)
  }
  const pop=()=>{
   // Hash navigation is same-document history, not a page switch.
   if(location.pathname===currentPath.current){
    timeline.current?.kill();pending.current=false;target.current=null
    if(overlay.current)gsap.set(overlay.current,{visibility:'hidden'})
    lockScroll('navigation',false)
    return
   }
   // A history change must always reach the URL, including during an interrupted transition.
   timeline.current?.kill();pending.current=false;go(new URL(location.href),true)
  }
  document.addEventListener('click',click);window.addEventListener('popstate',pop)
  return()=>{document.removeEventListener('click',click);window.removeEventListener('popstate',pop);timeline.current?.kill();lockScroll('navigation',false)}
 },[reduced])
 useLayoutEffect(()=>{
  if(path==='/'){
   document.title='CEFABEX — Ideas into impact.'
   document.querySelector('meta[name="description"]')?.setAttribute('content','CEFABEX brings research, design and engineering together. Websites, software, connected products and ventures from Tamil Nadu, India.')
  }
  const reveal=()=>{
   pending.current=false;lockScroll('navigation',false)
   if(overlay.current)gsap.set(overlay.current,{visibility:'hidden'})
   const main=document.querySelector<HTMLElement>('#site-content main')
   main?.setAttribute('tabindex','-1');main?.focus({preventScroll:true})
   if(target.current?.hash)document.getElementById(decodeURIComponent(target.current.hash.slice(1)))?.scrollIntoView()
   target.current=null
  }
  if(pending.current&&!reduced&&overlay.current){
   const panels=overlay.current.querySelectorAll('.transition-panel')
   const destination=overlay.current.dataset.destination
   timeline.current=gsap.timeline({onComplete:reveal}).to('.transition-title',{opacity:0,y:-20,duration:.25},0)
   if(destination==='projects')timeline.current.to(panels,{scaleX:0,transformOrigin:'right center',duration:.65,stagger:.04,ease:'power3.inOut'},.05)
   else timeline.current.to(panels,{yPercent:-102,duration:.65,stagger:{each:.04,from:destination==='contact'?'center':'start'},ease:'power3.inOut'},.05)
  }else reveal()
 },[path,reduced])
 return <>
  <MotionRuntime/>
  <div id="site-content" data-route={path.split('/')[1]||'home'}>{path==='/'?<App key={path}/>:<CompanyPages key={path}/>}<SiteMotion key={`motion-${path}`} path={path}/></div>
  <div ref={overlay} className="page-transition" aria-hidden="true"><div className="transition-panels">{Array.from({length:5},(_,i)=><span className="transition-panel" key={i}/>)}</div><p className="transition-title">CEFABEX</p></div>
 </>
}
