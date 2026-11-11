import {Scene,PerspectiveCamera,WebGLRenderer,Mesh,Group,Color,SRGBColorSpace,ShaderMaterial,BufferGeometry,Float32BufferAttribute,Points,Vector2,Vector3,AdditiveBlending,ACESFilmicToneMapping} from 'three'
import {FontLoader} from 'three/addons/loaders/FontLoader.js'
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js'
import {MeshSurfaceSampler} from 'three/addons/math/MeshSurfaceSampler.js'
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js'
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js'
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js'
import typeface from '../assets/brand-typeface.json'

const titleVertex=`
varying vec3 vNormal; varying vec3 vView; varying vec3 vLocal;
void main(){vNormal=normalize(normalMatrix*normal);vLocal=position;vec4 mv=modelViewMatrix*vec4(position,1.);vView=-mv.xyz;gl_Position=projectionMatrix*mv;}
`
const titleFragment=`
uniform float uProgress; uniform float uIndex; varying vec3 vNormal; varying vec3 vView; varying vec3 vLocal;
void main(){
 vec3 N=normalize(vNormal);vec3 V=normalize(vView);
 float rim=pow(1.-abs(dot(N,V)),2.3);
 float reveal=smoothstep(.08+uIndex*.045,.35+uIndex*.045,uProgress);
 float reflection=smoothstep(-.6,.7,sin(vLocal.y*4.4+vLocal.x*.12));
 vec3 silver=mix(vec3(.10,.18,.23),vec3(.83,.93,1.),reflection);
 float edge=pow(max(dot(N,normalize(vec3(-.3,.8,1.))),0.),12.);
 vec3 metal=silver*.65+edge*.65+rim*vec3(.3,.75,1.)*1.8;
 float sweep=exp(-pow((uProgress*10.-uIndex-1.2)*2.5,2.));
 vec3 dormant=vec3(.013,.035,.054)+rim*vec3(.12,.35,.5)*.7+edge*.08;
 vec3 col=mix(dormant,metal,reveal)+sweep*vec3(.5,.9,1.5)*(rim+.2);
 gl_FragColor=vec4(col,1.);
}
`
const particleVertex=`
attribute vec3 aOrigin;attribute float aSeed;attribute float aKind;
uniform float uProgress;uniform float uWidth;uniform float uHeight;uniform float uDpr;
varying float vAlpha;varying float vSeed;
void main(){
 float p=smoothstep(.02+aSeed*.08,.62+aSeed*.14,uProgress);
 vec3 origin=vec3(aOrigin.x*uWidth*1.2,aOrigin.y*uHeight*2.5,aOrigin.z*6.);
 float angle=(1.-p)*2.4+aSeed*6.283;
 vec3 swirl=vec3(cos(angle),sin(angle),sin(angle*.5))*(1.-p)*1.1;
 vec3 pos=mix(origin+swirl,position,p);
 if(aKind>.5)pos=origin+vec3(sin(uProgress*3.+aSeed*10.)*.2,uProgress*.25,0.);
 vec4 mv=modelViewMatrix*vec4(pos,1.);
 gl_Position=projectionMatrix*mv;
 gl_PointSize=clamp((20.+aSeed*17.)/max(-mv.z,1.)*uDpr,1.,5.);
 vAlpha=aKind>.5?.22:(.75-smoothstep(.55,.92,uProgress)*.7);
 vSeed=aSeed;
}
`
const particleFragment=`
varying float vAlpha;varying float vSeed;
void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;float alpha=pow(1.-d,1.8)*vAlpha;gl_FragColor=vec4(mix(vec3(.18,.55,1.),vec3(.85,.96,1.),vSeed),alpha);}
`
const screenVertex=`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`
const screenFragment=`
uniform sampler2D tDiffuse;uniform float uProgress;uniform float uAspect;uniform vec2 uPixel;varying vec2 vUv;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
 vec2 uv=vUv;float pulse=exp(-pow((uProgress-.4)*6.,2.));
 vec2 shift=(uv-.5)*.0022*pulse;
 vec3 col=vec3(texture2D(tDiffuse,uv+shift).r,texture2D(tDiffuse,uv).g,texture2D(tDiffuse,uv-shift).b);
 vec3 glow=vec3(0.);
 for(int i=1;i<=6;i++){
  vec2 offset=vec2(float(i)*uPixel.x*2.5,float(i)*uPixel.y*.6);
  vec3 a=texture2D(tDiffuse,uv+offset).rgb;vec3 b=texture2D(tDiffuse,uv-offset).rgb;
  glow+=(max(a-.55,0.)+max(b-.55,0.))/float(i+2);
 }
 col+=glow*.45;
 vec2 point=(uv-vec2(.5,.5))*vec2(uAspect,1.);
 float haze=exp(-dot(point,point)*3.5);
 col+=vec3(.008,.024,.046)*haze;
 float flare=exp(-abs(point.y)*320.)*exp(-abs(point.x)*1.5);
 float halo=exp(-length(point)*13.);
 col+=vec3(.08,.4,.8)*(flare*.55+halo*.12)*(.25+pulse*.75)*(1.-smoothstep(.4,1.,uProgress));
 // A single, reversible expanding shockwave; no clock or repeated flashes.
 float radius=.06+uProgress*1.3;
 float wave=exp(-abs(length(point*vec2(.6,1.))-radius)*95.)*pulse;
 col+=vec3(.03,.16,.3)*wave;
 col*=1.-smoothstep(.3,1.1,length(uv-.5))*.4;
 col+=(hash(gl_FragCoord.xy+floor(uProgress*300.))-.5)*.009;
 gl_FragColor=vec4(max(col,0.),1.);
}
`

/** Extruded Geist title + GPU particle assembly + one bounded optical effects pass. */
export function createBrandScene(canvas:HTMLCanvasElement){
 const renderer=new WebGLRenderer({canvas,alpha:false,antialias:false,powerPreference:'low-power'})
 let dpr=Math.min(devicePixelRatio,innerWidth<700?1:1.15)
 renderer.setPixelRatio(dpr);renderer.outputColorSpace=SRGBColorSpace;renderer.toneMapping=ACESFilmicToneMapping
 const scene=new Scene();scene.background=new Color('#050a10')
 const camera=new PerspectiveCamera(34,1,.1,100)
 const group=new Group();scene.add(group)
 const font=new FontLoader().parse(typeface)
 const glyphs='CEFABEX'.split('').map((letter,index)=>{
  const geometry=new TextGeometry(letter,{font,size:2,depth:.18,curveSegments:8,bevelEnabled:true,bevelThickness:.025,bevelSize:.018,bevelSegments:2})
  geometry.computeBoundingBox();const box=geometry.boundingBox!;const width=box.max.x-box.min.x
  geometry.translate(-(box.min.x+box.max.x)/2,-(box.min.y+box.max.y)/2,0)
  const material=new ShaderMaterial({vertexShader:titleVertex,fragmentShader:titleFragment,uniforms:{uProgress:{value:0},uIndex:{value:index}}})
  const mesh=new Mesh(geometry,material);group.add(mesh)
  return {mesh,geometry,material,width,x:0,y:0}
 })
 let seed=8241
 const random=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646}
 const perLetter=innerWidth<700?110:220,dust=innerWidth<700?90:160,count=perLetter*7+dust
 const targets=new Float32Array(count*3),local=new Float32Array(count*3),origins=new Float32Array(count*3),seeds=new Float32Array(count),kinds=new Float32Array(count)
 const point=new Vector3()
 glyphs.forEach((glyph,i)=>{
  const sampler=new MeshSurfaceSampler(glyph.mesh).build()
  ;(sampler as MeshSurfaceSampler & {setRandomGenerator:(fn:()=>number)=>MeshSurfaceSampler}).setRandomGenerator(random)
  for(let j=0;j<perLetter;j++){
   sampler.sample(point);const k=(i*perLetter+j)*3;local[k]=point.x;local[k+1]=point.y;local[k+2]=point.z
  }
 })
 for(let i=0;i<count;i++){origins[i*3]=random()*2-1;origins[i*3+1]=random()*2-1;origins[i*3+2]=random()*2-1;seeds[i]=random();kinds[i]=i>=perLetter*7?1:0}
 const particlesGeometry=new BufferGeometry();particlesGeometry.setAttribute('position',new Float32BufferAttribute(targets,3));particlesGeometry.setAttribute('aOrigin',new Float32BufferAttribute(origins,3));particlesGeometry.setAttribute('aSeed',new Float32BufferAttribute(seeds,1));particlesGeometry.setAttribute('aKind',new Float32BufferAttribute(kinds,1))
 const particlesMaterial=new ShaderMaterial({vertexShader:particleVertex,fragmentShader:particleFragment,uniforms:{uProgress:{value:0},uWidth:{value:10},uHeight:{value:2},uDpr:{value:dpr}},transparent:true,blending:AdditiveBlending,depthWrite:false})
 const particles=new Points(particlesGeometry,particlesMaterial);particles.frustumCulled=false;group.add(particles)
 const composer=new EffectComposer(renderer);const renderPass=new RenderPass(scene,camera)
 const optics=new ShaderPass({uniforms:{tDiffuse:{value:null},uProgress:{value:0},uAspect:{value:1},uPixel:{value:new Vector2(1,1)}},vertexShader:screenVertex,fragmentShader:screenFragment})
 const output=new OutputPass();composer.addPass(renderPass);composer.addPass(optics);composer.addPass(output)
 let disposed=false,visible=true,contextLost=false,frame=0,p=0,mx=0,my=0,baseZ=12
 const draw=()=>{
  frame=0;if(disposed||contextLost||!visible||document.hidden)return
  const formed=Math.min(1,p/.7)
  group.rotation.set((1.-formed)*.1+my*.025,(1.-formed)*-.12+mx*.035,(1.-formed)*-.025)
  for(let i=0;i<glyphs.length;i++){
   const glyph=glyphs[i];glyph.material.uniforms.uProgress.value=p
   glyph.mesh.position.set(glyph.x,glyph.y+Math.sin(i*2.1)*(1.-formed)*.12,0)
   glyph.mesh.rotation.y=(1.-formed)*(i-3)*.025
  }
  camera.position.z=baseZ*(1.07-.07*formed)
  particlesMaterial.uniforms.uProgress.value=p;optics.uniforms.uProgress.value=p
  composer.render(0)
 }
 const request=()=>{if(!frame&&!disposed&&!contextLost&&visible&&!document.hidden)frame=requestAnimationFrame(draw)}
 const resize=()=>{
  const box=canvas.getBoundingClientRect(),w=box.width,h=Math.max(box.height,1),mobile=w<700
  const rows=mobile?[glyphs.slice(0,4),glyphs.slice(4)]:[glyphs]
  let maxWidth=0
  rows.forEach((row,index)=>{
   const width=row.reduce((sum,glyph)=>sum+glyph.width+.08,0)-.08;maxWidth=Math.max(width,maxWidth)
   let x=-width/2
   row.forEach(glyph=>{glyph.x=x+glyph.width/2;glyph.y=mobile?(index===0?.95:-.95):0;x+=glyph.width+.08})
  })
  const attr=particlesGeometry.getAttribute('position')
  for(let i=0;i<count;i++){
   const glyph=glyphs[Math.min(6,Math.floor(i/perLetter))]
   attr.setXYZ(i,local[i*3]+glyph.x,local[i*3+1]+glyph.y,local[i*3+2])
  }
  attr.needsUpdate=true
  const aspect=w/h,titleHeight=mobile?3.5:1.6
  baseZ=Math.max(maxWidth/(2*Math.tan(17*Math.PI/180)*aspect*.87),titleHeight/(2*Math.tan(17*Math.PI/180)*.55))
  camera.aspect=aspect;camera.position.z=baseZ;camera.updateProjectionMatrix()
  // A pixel budget also protects large/4K displays, not just high-DPR phones.
  const nextDpr=Math.min(devicePixelRatio,mobile?1:1.15,Math.sqrt((mobile?600000:1500000)/(w*h)))
  if(Math.abs(nextDpr-dpr)>.005){dpr=nextDpr;renderer.setPixelRatio(dpr);composer.setPixelRatio(dpr)}
  renderer.setSize(w,h,false);composer.setSize(w,h)
  particlesMaterial.uniforms.uDpr.value=dpr
  particlesMaterial.uniforms.uWidth.value=maxWidth;particlesMaterial.uniforms.uHeight.value=mobile?2.5:1.6
  optics.uniforms.uAspect.value=aspect;optics.uniforms.uPixel.value.set(1/(w*dpr),1/(h*dpr));request()
 }
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas)
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)request();else if(frame){cancelAnimationFrame(frame);frame=0}});observer.observe(canvas)
 const visibility=()=>{if(!document.hidden)request()};document.addEventListener('visibilitychange',visibility)
 const lost=(event:Event)=>{event.preventDefault();contextLost=true;canvas.style.visibility='hidden';canvas.dataset.context='lost'}
 const restored=()=>{contextLost=false;canvas.style.visibility='';canvas.dataset.context='ready';request()}
 canvas.addEventListener('webglcontextlost',lost);canvas.addEventListener('webglcontextrestored',restored)
 canvas.dataset.context='ready';canvas.dataset.effect='particle-title-optics';resize()
 return {update:(progress:number,x=0,y=0)=>{p=progress;mx=x;my=y;request()},dispose:()=>{
  disposed=true;cancelAnimationFrame(frame);observer.disconnect();resizeObserver.disconnect();document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored)
  glyphs.forEach(g=>{g.geometry.dispose();g.material.dispose()});particlesGeometry.dispose();particlesMaterial.dispose();optics.dispose();output.dispose();renderPass.dispose();composer.dispose();renderer.dispose();renderer.forceContextLoss()
 }}
}
