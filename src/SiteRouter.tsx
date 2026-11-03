import {useEffect,useRef,useState} from 'react'
import {toCanvas} from 'html-to-image'
import gsap from 'gsap'
import App from './App'
import CompanyPages from './CompanyPages'
import {createPageCurl} from './lib/pageCurl'
import SiteMotion from './components/SiteMotion'
import {PAGE_TURN} from './lib/motionConfig'

export default function SiteRouter(){
 const [path,setPath]=useState(location.pathname)
 const [turning,setTurning]=useState(false)
 const canvas=useRef<HTMLCanvasElement>(null)
 const locked=useRef(false)
 useEffect(()=>{
  const go=async(url:URL,pop=false)=>{
   if(locked.current)return
   locked.current=true
   const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches
   let snapshot:HTMLCanvasElement|null=null
   if(!reduce){
    document.documentElement.classList.add('navigation-pending')
    try{snapshot=await Promise.race([toCanvas(document.getElementById('site-content')!,{width:innerWidth,height:innerHeight,pixelRatio:Math.min(devicePixelRatio,1.25),backgroundColor:'#ffffff',cacheBust:false,style:{transform:`translateY(${-scrollY}px)`,transformOrigin:'top left'},filter:node=>!(node instanceof HTMLElement&&node.hasAttribute('data-transition-ignore'))}),new Promise<null>(resolve=>setTimeout(()=>resolve(null),2500))])}catch{snapshot=null}
   }
   let curl:ReturnType<typeof createPageCurl>=null
   if(snapshot&&canvas.current){try{curl=createPageCurl(canvas.current,snapshot);curl?.render(0)}catch{curl=null}}
   document.documentElement.classList.toggle('is-page-turning',Boolean(curl))
   if(!pop)history.pushState({},'',url.pathname+url.search+url.hash)
   setTurning(Boolean(curl));setPath(url.pathname);window.scrollTo(0,0)
   document.documentElement.classList.remove('navigation-pending')
   if(curl){const state={p:0};gsap.to(state,{p:1,duration:PAGE_TURN.duration,ease:'power2.inOut',onUpdate:()=>curl?.render(state.p),onComplete:()=>{curl?.dispose();document.documentElement.classList.remove('is-page-turning');setTurning(false);locked.current=false}})}
   else{locked.current=false}
   if(url.hash)requestAnimationFrame(()=>document.querySelector(url.hash)?.scrollIntoView())
  }
  const click=(event:MouseEvent)=>{
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return
   const link=(event.target as Element).closest<HTMLAnchorElement>('a[href]')
   if(!link||link.target==='_blank'||link.hasAttribute('download'))return
   const url=new URL(link.href,location.href)
   if(url.origin!==location.origin||url.pathname===location.pathname)return
   event.preventDefault();void go(url)
  }
  const pop=()=>{if(!locked.current)void go(new URL(location.href),true)}
  document.addEventListener('click',click);window.addEventListener('popstate',pop)
  return()=>{document.removeEventListener('click',click);window.removeEventListener('popstate',pop)}
 },[])
 useEffect(()=>{if(path==='/')document.title='CEFABEX — Build what comes next.'},[path])
 useEffect(()=>{if(turning)return;const frame=requestAnimationFrame(()=>{const title=document.querySelector<HTMLElement>('#site-content main h1');title?.setAttribute('tabindex','-1');title?.focus({preventScroll:true})});return()=>cancelAnimationFrame(frame)},[path,turning])
 return <><div id="site-content" aria-busy={turning}>{path==='/'?<App key={path}/>:<CompanyPages key={path}/>}<SiteMotion key={`motion-${path}`} path={path}/></div><canvas ref={canvas} className={`page-curl-overlay ${turning?'is-turning':''}`} aria-hidden="true" data-transition-ignore=""/><div className="navigation-progress" aria-hidden="true"/></>
}
