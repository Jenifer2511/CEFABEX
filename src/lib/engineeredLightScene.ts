import * as THREE from 'three'
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js'

/** A scroll-driven, machined C sculpture. No clock or continuous render loop. */
export function createEngineeredLightScene(canvas:HTMLCanvasElement){
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'})
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,60)
 const createEnvironment=()=>{
  const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment()
  const target=pmrem.fromScene(room,.03);room.dispose();pmrem.dispose();return target
 }
 let environment:THREE.WebGLRenderTarget|null=createEnvironment()
 scene.environment=environment.texture;scene.environmentIntensity=1.2
 const sculpture=new THREE.Group();scene.add(sculpture)
 const silver=new THREE.MeshPhysicalMaterial({color:'#c1d0da',metalness:1,roughness:.24,clearcoat:1,clearcoatRoughness:.16,side:THREE.DoubleSide,transparent:true,forceSinglePass:true})
 const blue=new THREE.MeshPhysicalMaterial({color:'#416b87',metalness:.96,roughness:.24,clearcoat:1,side:THREE.DoubleSide,transparent:true,forceSinglePass:true})
 const edge=new THREE.MeshBasicMaterial({color:'#9bd7ee',transparent:true,opacity:.6})
 function ribbon(radius:number,width:number,twist:number){
  const positions:number[]=[],indices:number[]=[],segments=170,slices=10
  for(let i=0;i<=segments;i++){
   const angle=.47+i/segments*(Math.PI*2-.94)
   for(let j=0;j<=slices;j++){
    const cross=(j/slices-.5)*width
    const roll=angle*twist+.5
    const r=radius+cross*Math.cos(roll)
    positions.push(Math.cos(angle)*r,Math.sin(angle)*r,cross*Math.sin(roll)+Math.sin(angle*2)*.16)
    if(i<segments&&j<slices){const a=i*(slices+1)+j,b=a+slices+1;indices.push(a,b,a+1,b,b+1,a+1)}
   }
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry
 }
 const ribbons=[1.72,1.35,.98].map((radius,i)=>{
  const mesh=new THREE.Mesh(ribbon(radius,.5-i*.035,1.15+i*.3),i===1?blue:silver)
  mesh.rotation.z=i*.14;mesh.position.z=-i*.14;sculpture.add(mesh);return mesh
 })
 const orbit=new THREE.Mesh(new THREE.TorusGeometry(1.92,.006,6,160,Math.PI*1.65),edge)
 orbit.rotation.x=.5;orbit.rotation.y=-.4;sculpture.add(orbit)
 const light=new THREE.DirectionalLight('#e8f7ff',4);light.position.set(-3,5,5);scene.add(light)
 const fill=new THREE.DirectionalLight('#6babc8',3);fill.position.set(4,-2,3);scene.add(fill)
 // Fine particles only emerge as the sculpture separates; each position is deterministic.
 const particlePositions=new Float32Array(180*3)
 for(let i=0;i<180;i++){const a=i*2.399963,r=1.9+((i*37)%101)/35;particlePositions[i*3]=Math.cos(a)*r;particlePositions[i*3+1]=Math.sin(a)*r;particlePositions[i*3+2]=-((i*13)%57)/12}
 const particlesGeometry=new THREE.BufferGeometry();particlesGeometry.setAttribute('position',new THREE.BufferAttribute(particlePositions,3))
 const particleMaterial=new THREE.PointsMaterial({color:'#99bdd0',size:.012,transparent:true,opacity:0,depthWrite:false})
 const particles=new THREE.Points(particlesGeometry,particleMaterial);scene.add(particles)
 let progress=0,frame=0,disposed=false,visible=true,lost=false,quality=1,lastDraw=0,lastRequest=0,late=0,viewportHeight=0
 const smooth=(a:number,b:number,x:number)=>{const t=THREE.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)}
 const size=()=>{
  const {width,height}=canvas.getBoundingClientRect()
  viewportHeight=height
  const budget=width<700?360000:1000000
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5,Math.sqrt(budget/(Math.max(width,1)*Math.max(height,1))))*quality)
  renderer.setSize(Math.max(width,1),Math.max(height,1),false);camera.aspect=width/Math.max(height,1);camera.updateProjectionMatrix()
  canvas.dataset.renderScale=renderer.getPixelRatio().toFixed(2)
 }
 const draw=(now:number)=>{
  frame=0;if(disposed||lost||!visible||document.hidden)return
  if(lastDraw&&now-lastRequest<75&&now-lastDraw>45&&now-lastDraw<180)late++;else late=Math.max(0,late-1)
  if(late>=8&&quality>.6){quality=Math.max(.6,quality*.85);size();late=0}lastDraw=now
  const gather=smooth(.12,.38,progress),open=smooth(.38,.7,progress),dissolve=smooth(.65,.91,progress)
  const phone=camera.aspect<.85
  camera.position.set(0,0,phone?9.8:8.5);camera.lookAt(0,0,0)
  sculpture.position.set((phone?.06:1.6)*(1-gather),phone?.08:.28,-open*1.3)
  sculpture.rotation.set(.15+gather*.5+open*.6,-.55+gather*.8+open*.65,-.16+gather*.5+open*.4)
  const scale=phone?(viewportHeight<=500?.4:viewportHeight<=700?.48:.52):.88
  sculpture.scale.setScalar(scale*(1+dissolve*.4))
  ribbons.forEach((mesh,i)=>{mesh.position.z=-i*.14-open*i*.72;mesh.rotation.z=i*.14+open*(i-1)*.6;mesh.position.x=open*(i-1)*.22})
  orbit.rotation.z=-progress*1.8;edge.opacity=.45*(1-dissolve)
  silver.opacity=blue.opacity=1-dissolve
  particleMaterial.opacity=open*.4*(1-dissolve);particles.rotation.z=progress*.12
  renderer.render(scene,camera);canvas.dataset.frameProgress=progress.toFixed(4)
 }
 const request=()=>{lastRequest=performance.now();if(!frame&&!disposed&&!lost&&visible&&!document.hidden)frame=requestAnimationFrame(draw)}
 const resize=()=>{size();request()}
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas)
 // The full journey bounds remain reliable while ScrollTrigger reparents its pin.
 const observer=new IntersectionObserver(entries=>{visible=entries[entries.length-1].isIntersecting;if(visible)request();else{cancelAnimationFrame(frame);frame=0}});observer.observe(canvas.closest('.brand-journey')||canvas)
 const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else request()}
 const onLost=(event:Event)=>{
  event.preventDefault();lost=true;cancelAnimationFrame(frame);frame=0
  // Release the old target's listeners while its context is lost. Deleting its
  // obsolete framebuffer after restoration would produce INVALID_OPERATION.
  environment?.dispose();environment=null;scene.environment=null
  canvas.dataset.context='lost';canvas.style.visibility='hidden'
 }
 const onRestored=()=>{
  try{environment=createEnvironment();scene.environment=environment.texture;lost=false;canvas.dataset.context='ready';canvas.style.visibility='';resize()}
  catch{lost=true;canvas.dataset.context='lost';canvas.style.visibility='hidden'}
 }
 document.addEventListener('visibilitychange',visibility);canvas.addEventListener('webglcontextlost',onLost);canvas.addEventListener('webglcontextrestored',onRestored)
 canvas.dataset.context='ready';canvas.dataset.effect='cefabex-engineered-light';resize()
 return {update:(value:number)=>{progress=THREE.MathUtils.clamp(value,0,1);request()},dispose:()=>{
  disposed=true;cancelAnimationFrame(frame);resizeObserver.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',onLost);canvas.removeEventListener('webglcontextrestored',onRestored)
  ribbons.forEach(mesh=>mesh.geometry.dispose());orbit.geometry.dispose();particlesGeometry.dispose();particleMaterial.dispose();silver.dispose();blue.dispose();edge.dispose();environment?.dispose();renderer.dispose();renderer.forceContextLoss()
 }}
}
