import {Scene,PerspectiveCamera,WebGLRenderer,TorusGeometry,Mesh,MeshStandardMaterial,Group,AmbientLight,DirectionalLight,Color,SRGBColorSpace} from 'three'

/** One scene, no textures, no postprocessing; renders only when its pose changes. */
export function createBrandScene(canvas:HTMLCanvasElement){
 const renderer=new WebGLRenderer({canvas,alpha:true,antialias:false,powerPreference:'low-power'})
 renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1:1.35))
 renderer.outputColorSpace=SRGBColorSpace
 const scene=new Scene()
 const camera=new PerspectiveCamera(32,1,.1,60)
 camera.position.z=10
 const group=new Group();scene.add(group)
 const geometry=new TorusGeometry(2,.075,10,120,Math.PI*1.68)
 const materials=[new MeshStandardMaterial({color:'#cbdce5',metalness:.65,roughness:.23}),new MeshStandardMaterial({color:'#55b6d8',metalness:.55,roughness:.28}),new MeshStandardMaterial({color:'#f5f7f4',metalness:.65,roughness:.23})]
 const arcs=materials.map((material,i)=>{const mesh=new Mesh(geometry,material);mesh.scale.setScalar(1+i*.16);mesh.rotation.z=i*.32;mesh.position.z=i*-.17;group.add(mesh);return mesh})
 scene.add(new AmbientLight(0x6c8595,2.3))
 const key=new DirectionalLight(0xe9faff,5);key.position.set(3,4,5);scene.add(key)
 const rim=new DirectionalLight(0x68c6ee,6);rim.position.set(-4,-2,3);scene.add(rim)
 const fill=new DirectionalLight(0xffffff,2);fill.position.set(2,-3,-2);scene.add(fill)
 scene.background=null
 renderer.setClearColor(new Color('#0b1116'),0)
 let disposed=false,visible=true,contextLost=false,frame=0,p=0,mx=0,my=0
 const draw=()=>{
  frame=0
  if(disposed||contextLost||!visible||document.hidden)return
  group.rotation.set(.2+Math.sin(p*Math.PI)*1.2+my*.08,-.35+p*2.3+mx*.12,-.3+p*.8)
  group.position.set(1.6*(1-Math.min(p*2,1)),.05,0)
  group.scale.setScalar(.78+p*1.7)
  arcs.forEach((arc,i)=>{arc.rotation.z=i*.32+p*(i%2?-.8:1.1);arc.position.z=i*-.17-p*i*.14})
  renderer.render(scene,camera)
 }
 const request=()=>{if(!frame&&!disposed&&!contextLost&&visible&&!document.hidden)frame=requestAnimationFrame(draw)}
 const resize=()=>{const box=canvas.getBoundingClientRect();renderer.setSize(box.width,box.height,false);camera.aspect=box.width/Math.max(box.height,1);camera.updateProjectionMatrix();request()}
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas)
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)request();else if(frame){cancelAnimationFrame(frame);frame=0}});observer.observe(canvas)
 const visibility=()=>{if(!document.hidden)request()};document.addEventListener('visibilitychange',visibility)
 const lost=(event:Event)=>{event.preventDefault();contextLost=true;canvas.style.visibility='hidden';canvas.dataset.context='lost'}
 const restored=()=>{contextLost=false;canvas.style.visibility='';canvas.dataset.context='ready';request()}
 canvas.addEventListener('webglcontextlost',lost);canvas.addEventListener('webglcontextrestored',restored)
 canvas.dataset.context='ready';resize()
 return {
  update:(progress:number,x=0,y=0)=>{p=progress;mx=x;my=y;request()},
  dispose:()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();resizeObserver.disconnect();document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored);geometry.dispose();materials.forEach(m=>m.dispose());renderer.dispose();renderer.forceContextLoss()},
 }
}
