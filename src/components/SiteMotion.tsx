import {useEffect,useRef} from 'react'
import {useReducedMotion} from 'motion/react'
import * as THREE from 'three'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
type Media={image:HTMLImageElement;mesh:THREE.Mesh<THREE.PlaneGeometry,THREE.ShaderMaterial>;texture:THREE.Texture;hover:number}
export default function SiteMotion({path}:{path:string}){
 const canvasRef=useRef<HTMLCanvasElement>(null)
 const reduced=Boolean(useReducedMotion())
 useEffect(()=>{
  if(reduced)return
  const root=document.getElementById('site-content')!
  const context=gsap.context(()=>{
   root.querySelectorAll<HTMLElement>('.company-page h1,.company-page h2,.company-page h3,.company-intro h2,.company-ecosystem h3').forEach(heading=>{
    heading.setAttribute('aria-label',heading.textContent||'')
    const words=(heading.textContent||'').split(' ')
    heading.replaceChildren(...words.map(word=>{const mask=document.createElement('span');mask.className='motion-word-mask';mask.setAttribute('aria-hidden','true');const inner=document.createElement('span');inner.textContent=word+' ';mask.append(inner);return mask}))
    gsap.fromTo(heading.querySelectorAll('.motion-word-mask > span'),{yPercent:110,rotateX:8},{yPercent:0,rotateX:0,duration:.95,stagger:.045,ease:'power3.out',scrollTrigger:{trigger:heading,start:'top 94%',once:true}})
   })
   root.querySelectorAll<HTMLElement>('.company-page section p,.company-page .page-intro > p,.company-page .project-feature > div:last-child,.page-footer-meta,.company-capabilities,.company-ecosystem article > p').forEach((el,i)=>{
    gsap.fromTo(el,{y:22,opacity:.15},{y:0,opacity:1,duration:.85,delay:(i%3)*.045,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 96%',once:true}})
   })
  },root)
  return()=>context.revert()
 },[path,reduced])
 useEffect(()=>{
  const canvas=canvasRef.current
  if(!canvas||reduced)return
  let renderer:THREE.WebGLRenderer
  try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,preserveDrawingBuffer:true,powerPreference:'low-power'})}catch{return}
  renderer.setClearColor(0,0);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5))
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,4000)
  const geometry=new THREE.PlaneGeometry(1,1,24,20)
  const media:Media[]=[],seen=new WeakSet<HTMLImageElement>()
  let alive=true,wasActive=false,velocity=0,lastY=scrollY,lastTime=performance.now()
  const loader=new THREE.TextureLoader()
  const discover=()=>document.querySelectorAll<HTMLImageElement>('#site-content img').forEach(image=>{
   if(seen.has(image)||image.closest('.gallery-world,.loader,.brand,.page-header,.partner-pictures')||image.src.includes('/logo.')||!image.src)return
   seen.add(image)
   loader.load(image.currentSrc||image.src,texture=>{
    if(!alive){texture.dispose();return}
    texture.colorSpace=THREE.SRGBColorSpace
    const material=new THREE.ShaderMaterial({transparent:true,depthTest:false,uniforms:{map:{value:texture},uHover:{value:0},uVelocity:{value:0},uImage:{value:1},uFrame:{value:1},uContain:{value:0},uOpacity:{value:1}},vertexShader:`uniform float uHover;uniform float uVelocity;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;float curve=sin(uv.x*3.14159265)*sin(uv.y*3.14159265);p.z+=curve*(uHover*75.+uVelocity*22.);p.y+=sin(uv.x*3.14159265)*uVelocity*3.;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,fragmentShader:`uniform sampler2D map;uniform float uOpacity;uniform float uImage;uniform float uFrame;uniform float uContain;varying vec2 vUv;void main(){vec2 uv=vUv;if(uContain<.5){if(uImage>uFrame)uv.x=(uv.x-.5)*uFrame/uImage+.5;else uv.y=(uv.y-.5)*uImage/uFrame+.5;}else{if(uImage>uFrame)uv.y=(uv.y-.5)*uImage/uFrame+.5;else uv.x=(uv.x-.5)*uFrame/uImage+.5;}if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.)discard;gl_FragColor=texture2D(map,uv);gl_FragColor.a*=uOpacity;#include <tonemapping_fragment>\n#include <colorspace_fragment>}`.replace(';#include',';\n#include')})
    const mesh=new THREE.Mesh(geometry,material);mesh.frustumCulled=false;scene.add(mesh)
    media.push({image,mesh,texture,hover:0});image.setAttribute('data-webgl-media','')
   })
  })
  const resize=()=>{renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.position.z=innerHeight/(2*Math.tan(Math.PI/8));camera.updateProjectionMatrix()}
  resize();discover()
  const observer=new MutationObserver(discover);observer.observe(document.getElementById('site-content')!,{childList:true,subtree:true})
  const render=()=>{
   if(document.hidden||!alive)return
   const now=performance.now(),dt=Math.max(8,now-lastTime);lastTime=now
   velocity+=(Math.max(-1,Math.min(1,(scrollY-lastY)/dt)) -velocity)*.08;lastY=scrollY
   let active=0
   for(const m of media){
    if(!m.image.isConnected){m.mesh.visible=false;continue}
    const r=m.image.getBoundingClientRect()
    m.mesh.visible=r.bottom>0&&r.top<innerHeight&&r.width>0&&r.height>0
    if(!m.mesh.visible)continue
    active++
    const style=getComputedStyle(m.image)
    m.hover+=((matchMedia('(hover:hover)').matches&&m.image.matches(':hover')?1:0)-m.hover)*.065
    m.mesh.position.set(r.left+r.width/2-innerWidth/2,innerHeight/2-r.top-r.height/2,0)
    m.mesh.scale.set(r.width,r.height,1)
    let opacity=1,parent=m.image.parentElement
    while(parent&&parent.id!=='site-content'){opacity*=Number(getComputedStyle(parent).opacity);parent=parent.parentElement}
    const u=m.mesh.material.uniforms
    u.uOpacity.value=opacity
    const texImage=m.texture.image as HTMLImageElement
    u.uHover.value=m.hover;u.uVelocity.value=velocity;u.uImage.value=(texImage.naturalWidth||texImage.width)/(texImage.naturalHeight||texImage.height);u.uFrame.value=r.width/r.height;u.uContain.value=style.objectFit==='contain'?1:0
   }
   if(active||wasActive)renderer.render(scene,camera)
   wasActive=active>0
  }
  const lost=(event:Event)=>{event.preventDefault();alive=false;media.forEach(m=>m.image.removeAttribute('data-webgl-media'))}
  canvas.addEventListener('webglcontextlost',lost)
  window.addEventListener('resize',resize);gsap.ticker.add(render)
  return()=>{alive=false;canvas.removeEventListener('webglcontextlost',lost);observer.disconnect();gsap.ticker.remove(render);window.removeEventListener('resize',resize);for(const m of media){m.image.removeAttribute('data-webgl-media');m.texture.dispose();m.mesh.material.dispose()}geometry.dispose();renderer.dispose()}
 },[path,reduced])
 return <canvas ref={canvasRef} className="webgl-media-canvas" aria-hidden="true"/>
}
