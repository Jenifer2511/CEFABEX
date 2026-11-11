import {TUNNEL_VERTEX} from '../vendor/originkit/endlessTunnelShader'
import {GLASS_CORRIDOR_FRAGMENT} from './glassCorridorShader'

/** CEFABEX's glass variation of the supplied Originkit scroll mapping. */
export function createOriginkitTunnel(canvas:HTMLCanvasElement){
 const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,depth:false,powerPreference:'low-power'})
 if(!gl)throw new Error('WebGL2 unavailable')
 const compile=(type:number,source:string)=>{
  const shader=gl.createShader(type)!
  gl.shaderSource(shader,source);gl.compileShader(shader)
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const message=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw new Error(message||'Tunnel shader failed')}
  return shader
 }
 const createResources=()=>{
  const program=gl.createProgram()!
  const vertex=compile(gl.VERTEX_SHADER,TUNNEL_VERTEX)
  let fragment:WebGLShader
  try{fragment=compile(gl.FRAGMENT_SHADER,GLASS_CORRIDOR_FRAGMENT)}catch(error){gl.deleteShader(vertex);gl.deleteProgram(program);throw error}
  gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program)
  gl.deleteShader(vertex);gl.deleteShader(fragment)
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){const message=gl.getProgramInfoLog(program);gl.deleteProgram(program);throw new Error(message||'Tunnel program failed')}
  gl.useProgram(program)
  const buffer=gl.createBuffer(),vao=gl.createVertexArray()
  gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buffer)
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW)
  const position=gl.getAttribLocation(program,'aPos');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0)
  return {program,buffer,vao}
 }
 let {program,buffer,vao}=createResources()
 const uniforms=new Map<string,WebGLUniformLocation|null>()
 const location=(name:string)=>{if(!uniforms.has(name))uniforms.set(name,gl.getUniformLocation(program,name));return uniforms.get(name)!}
 const scalar=(name:string,value:number)=>gl.uniform1f(location(name),value)
 const color=(name:string,hex:string)=>{const value=parseInt(hex.slice(1),16);gl.uniform3f(location(name),((value>>16)&255)/255,((value>>8)&255)/255,(value&255)/255)}
 const configure=()=>{
  gl.useProgram(program);gl.bindVertexArray(vao)
  color('uBg','#050C13');color('uBase','#77CADB');color('uAccent','#E8F9FF');color('uPearl','#E8DBC6')
 }
 let disposed=false,visible=true,contextLost=false,frame=0,progress=0,quality=1,lastDraw=0,lastRequest=0,lateFrames=0
 const size=()=>{
  const box=canvas.getBoundingClientRect(),w=Math.max(1,box.width),h=Math.max(1,box.height)
  const pixelBudget=w<700?260000:720000
  const dpr=Math.min(devicePixelRatio,w<700?1:1.15,Math.sqrt(pixelBudget/(w*h)))*quality
  canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr))
  canvas.dataset.renderScale=dpr.toFixed(2)
 }
 const draw=(now:number)=>{
  frame=0
  if(disposed||contextLost||!visible||document.hidden)return
  // Reduce only during a run of late active frames, never because of an idle gap.
  if(lastDraw&&now-lastRequest<75&&now-lastDraw>40&&now-lastDraw<160)lateFrames++
  else lateFrames=Math.max(0,lateFrames-1)
  if(lateFrames>=8&&quality>.55){quality=Math.max(.55,quality*.85);size();lateFrames=0}
  lastDraw=now
  gl.useProgram(program);gl.bindVertexArray(vao);gl.viewport(0,0,canvas.width,canvas.height)
  gl.uniform2f(location('uRes'),canvas.width,canvas.height)
  const travel=Math.min(1,progress/.78),rings=travel*14,lnk=Math.PI*2/16
  // Absolute pose functions preserve hold and exact reversal of the new design.
  scalar('uProgress',progress)
  scalar('uZ',rings*lnk)
  scalar('uTurn',rings*.5/16*.28)
  gl.drawArrays(gl.TRIANGLES,0,3)
  canvas.dataset.frameProgress=progress.toFixed(4)
 }
 const request=()=>{lastRequest=performance.now();if(!frame&&!disposed&&!contextLost&&visible&&!document.hidden)frame=requestAnimationFrame(draw)}
 const resize=()=>{if(disposed)return;size();request()}
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas)
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)request();else if(frame){cancelAnimationFrame(frame);frame=0}});observer.observe(canvas)
 const visibility=()=>{if(!document.hidden)request()};document.addEventListener('visibilitychange',visibility)
 const lost=(event:Event)=>{event.preventDefault();contextLost=true;canvas.style.visibility='hidden';canvas.dataset.context='lost'}
 const restored=()=>{
  try{({program,buffer,vao}=createResources());uniforms.clear();contextLost=false;configure();canvas.style.visibility='';canvas.dataset.context='ready';resize()}catch{canvas.dataset.context='lost';canvas.style.visibility='hidden'}
 }
 canvas.addEventListener('webglcontextlost',lost);canvas.addEventListener('webglcontextrestored',restored)
 configure();canvas.dataset.context='ready';canvas.dataset.effect='cefabex-liquid-glass-corridor';canvas.dataset.source='originkit-derived';resize()
 return {
  update:(value:number)=>{progress=Math.max(0,Math.min(1,value));request()},
  dispose:()=>{
   disposed=true;cancelAnimationFrame(frame);resizeObserver.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',visibility)
   canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored)
   gl.deleteBuffer(buffer);gl.deleteVertexArray(vao);gl.deleteProgram(program);gl.getExtension('WEBGL_lose_context')?.loseContext()
  },
 }
}
