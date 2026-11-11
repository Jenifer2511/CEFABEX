import {useEffect,useState} from 'react'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import type Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
export {gsap,ScrollTrigger}
export const EASE='power3.out'
let smooth:Lenis|null=null
const locks=new Set<string>()
export function setSmooth(instance:Lenis|null){smooth=instance;if(locks.size)smooth?.stop()}
export function lockScroll(key:string,locked:boolean){
 if(locked)locks.add(key);else locks.delete(key)
 document.documentElement.classList.toggle('scroll-locked',locks.size>0)
 if(locks.size)smooth?.stop();else smooth?.start()
}
export function resetScroll(){smooth?.scrollTo(0,{immediate:true,force:true});window.scrollTo({top:0,behavior:'instant'})}
export function scrollToPosition(top:number,immediate=false){if(smooth)smooth.scrollTo(top,{duration:1.05,immediate});else window.scrollTo({top,behavior:immediate?'instant':'smooth'})}
export function useReducedMotion(){
 const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[])
 return reduced
}
