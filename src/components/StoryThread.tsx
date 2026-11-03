import {useLayoutEffect,useRef} from 'react'
import {useReducedMotion} from 'motion/react'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// A single measured route joins the real section positions, including scroll holds.
export default function StoryThread({ready}:{ready:boolean}){
 const ref=useRef<SVGSVGElement>(null)
 const reduced=useReducedMotion()
 useLayoutEffect(()=>{
  if(!ready||reduced||!ref.current)return
  const svg=ref.current,root=svg.parentElement!,line=svg.querySelector<SVGPathElement>('.story-thread-ink')!,track=svg.querySelector<SVGPathElement>('.story-thread-track')!,head=svg.querySelector<SVGCircleElement>('.story-thread-head')!
  let stations:{y:number;length:number;name:string}[]=[],total=0,rootTop=0
  const draw=()=>{
   if(!stations.length||!total)return
   const y=scrollY-rootTop+innerHeight*.38
   let length=0,docked=false,name='Beginning'
   for(let i=0;i<stations.length;i++){
    const station=stations[i],next=stations[i+1]
    if(y<station.y-100)break
    name=station.name
    if(!next||y<=station.y+140){length=station.length;docked=true;break}
    const t=Math.max(0,Math.min(1,(y-station.y-140)/(next.y-station.y-240)))
    length=station.length+(next.length-station.length)*t*t*(3-2*t)
   }
   line.style.strokeDasharray=`${length} ${total+1}`
   const point=line.getPointAtLength(Math.max(0,length))
   head.setAttribute('cx',String(point.x));head.setAttribute('cy',String(point.y))
   svg.dataset.station=name;svg.dataset.docked=String(docked);svg.dataset.distance=String(length)
   svg.style.opacity=scrollY-rootTop+innerHeight>stations[0].y?'1':'0'
  }
  const build=()=>{
   const width=root.clientWidth,height=root.offsetHeight;rootTop=root.getBoundingClientRect().top+scrollY
   svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.style.height=`${height}px`
   const gutter=width<600?9:24
   const sections=Array.from(root.querySelectorAll<HTMLElement>('[data-thread-stop]'))
   const hero=root.querySelector<HTMLElement>('.cinema')!
   let x=width*.5,y=hero.offsetHeight-innerHeight*.46
   let d=`M ${x} ${y}`;stations=[{y,length:0,name:'CEFABEX'}]
   sections.forEach((section,i)=>{
    const top=section.getBoundingClientRect().top+scrollY-rootTop
    const nextY=Math.max(y+280,top+96),nextX=i%2===0?width-gutter:gutter
    // The section margin reserves an empty crossing band. Travel down the gutter
    // first, so the ribbon never cuts across the preceding section's controls.
    const bridge=Number.parseFloat(getComputedStyle(section).marginTop)||96
    const turnStart=Math.max(y,top-bridge+12),turnEnd=top-12
    d+=` L ${x} ${turnStart} C ${x} ${turnStart+(turnEnd-turnStart)*.55}, ${nextX} ${turnEnd-(turnEnd-turnStart)*.55}, ${nextX} ${turnEnd} L ${nextX} ${nextY}`
    line.setAttribute('d',d)
    stations.push({y:nextY,length:line.getTotalLength(),name:section.id||section.dataset.threadStop||'Story'})
    const bottom=top+section.offsetHeight
    if(bottom-nextY>innerHeight*1.4){const stopY=bottom-innerHeight*.65;d+=` C ${nextX} ${nextY+160}, ${nextX} ${stopY-160}, ${nextX} ${stopY}`;line.setAttribute('d',d);stations.push({y:stopY,length:line.getTotalLength(),name:section.id||'Story'});y=stopY}else y=nextY
    x=nextX
   })
   line.setAttribute('d',d);track.setAttribute('d',d);total=line.getTotalLength();draw()
  }
  build()
  const trigger=ScrollTrigger.create({trigger:root,start:'top top',end:'bottom bottom',onUpdate:draw})
  ScrollTrigger.addEventListener('refresh',build)
  const contentResize=()=>ScrollTrigger.refresh()
  root.addEventListener('toggle',contentResize,true)
  return()=>{trigger.kill();ScrollTrigger.removeEventListener('refresh',build);root.removeEventListener('toggle',contentResize,true)}
 },[ready,reduced])
 if(reduced)return null
 return <svg ref={ref} className="story-thread" aria-hidden="true" preserveAspectRatio="none"><path className="story-thread-track" fill="none"/><path className="story-thread-ink" fill="none"/><circle className="story-thread-head" r="9"/></svg>
}
