import {useEffect} from 'react'
import Lenis from 'lenis'
import {gsap,ScrollTrigger,setSmooth,useReducedMotion} from '../lib/motion'

export default function MotionRuntime(){
 const reduced=useReducedMotion()
 useEffect(()=>{
  if(reduced)return
  const lenis=new Lenis({duration:1.05,smoothWheel:true,syncTouch:false,anchors:{offset:-100,duration:1.1},prevent:node=>node.closest('[data-lenis-prevent]')!==null})
  setSmooth(lenis)
  lenis.on('scroll',ScrollTrigger.update)
  const tick=(seconds:number)=>lenis.raf(seconds*1000)
  gsap.ticker.add(tick)
  const refresh=()=>ScrollTrigger.refresh()
  document.fonts.ready.then(refresh)
  window.addEventListener('load',refresh)
  return()=>{window.removeEventListener('load',refresh);gsap.ticker.remove(tick);lenis.destroy();setSmooth(null)}
 },[reduced])
 return null
}
