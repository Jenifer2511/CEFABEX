import {useEffect,useState} from 'react'
import App from './App'
import CompanyPages from './CompanyPages'
import SiteMotion from './components/SiteMotion'

export default function SiteRouter(){
 const [path,setPath]=useState(location.pathname)
 useEffect(()=>{
  const go=(url:URL,pop=false)=>{
   if(!pop)history.pushState({},'',url.pathname+url.search+url.hash)
   setPath(url.pathname)
   window.scrollTo({top:0,behavior:'instant'})
   if(url.hash)requestAnimationFrame(()=>document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView())
  }
  const click=(event:MouseEvent)=>{
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return
   const link=(event.target as Element).closest<HTMLAnchorElement>('a[href]')
   if(!link||link.target==='_blank'||link.hasAttribute('download'))return
   const url=new URL(link.href,location.href)
   if(url.origin!==location.origin||url.pathname===location.pathname)return
   event.preventDefault();go(url)
  }
  const pop=()=>go(new URL(location.href),true)
  document.addEventListener('click',click);window.addEventListener('popstate',pop)
  return()=>{document.removeEventListener('click',click);window.removeEventListener('popstate',pop)}
 },[])
 useEffect(()=>{
  if(path==='/')document.title='CEFABEX — Ideas into impact.'
  const frame=requestAnimationFrame(()=>{const title=document.querySelector<HTMLElement>('#site-content main h1');title?.setAttribute('tabindex','-1');title?.focus({preventScroll:true})})
  return()=>cancelAnimationFrame(frame)
 },[path])
 return <div id="site-content">{path==='/'?<App key={path}/>:<CompanyPages key={path}/>}<SiteMotion key={`motion-${path}`} path={path}/></div>
}
