/** A live, flat halftone screen. Canvas 2D only; no scene graph or WebGL. */
export function createSignalBackground(canvas:HTMLCanvasElement){
 const ctx=canvas.getContext('2d',{alpha:false})
 if(!ctx)throw new Error('Canvas 2D unavailable')
 const mask=document.createElement('canvas'),maskContext=mask.getContext('2d')
 if(!maskContext)throw new Error('Canvas 2D unavailable')
 const raster=document.createElement('canvas'),rasterContext=raster.getContext('2d')
 if(!rasterContext)throw new Error('Canvas 2D unavailable')
 let rasterData=rasterContext.createImageData(1,1)
 let width=1,height=1,cols=1,rows=1,ratio=1,glyph=new Uint8ClampedArray(4)
 let progress=0,time=0,frame=0,lastTime=0,lastPaint=0,paintCount=0,paused=false,visible=true,lost=false,disposed=false,dirty=true
 const smooth=(a:number,b:number,n:number)=>{const t=Math.max(0,Math.min(1,(n-a)/(b-a)));return t*t*(3-2*t)}
 const mix=(a:number,b:number,t:number)=>a+(b-a)*t
 const size=()=>{
  const box=canvas.getBoundingClientRect();width=Math.max(1,box.width);height=Math.max(1,box.height)
  ratio=Math.min(devicePixelRatio,1.5,Math.sqrt(800000/(width*height)))
  canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio)
  cols=width<700?48:104;rows=Math.max(1,Math.round(cols*height/width))
  raster.width=cols*4;raster.height=rows*4;rasterData=rasterContext.createImageData(raster.width,raster.height)
  mask.width=cols;mask.height=rows
  maskContext.clearRect(0,0,cols,rows);maskContext.fillStyle='#fff';maskContext.textAlign='center';maskContext.textBaseline='middle'
  maskContext.font=`500 ${cols*.17}px "Geist Variable", sans-serif`;maskContext.letterSpacing=`${-cols*.009}px`
  maskContext.fillText('CEFABEX',cols*.5,rows*.5)
  glyph=maskContext.getImageData(0,0,cols,rows).data;dirty=true;lastPaint=0
 }
 const paint=()=>{
  const blue=smooth(.1,.45,progress),letter=smooth(.4,.63,progress)*(1-smooth(.79,.91,progress))
  ctx.setTransform(ratio,0,0,ratio,0,0);ctx.globalAlpha=1
  ctx.fillStyle=`rgb(${Math.round(mix(239,32,blue))},${Math.round(mix(243,56,blue))},${Math.round(mix(240,219,blue))})`;ctx.fillRect(0,0,width,height)
  const red=Math.round(mix(29,224,blue)),green=Math.round(mix(61,236,blue)),sky=Math.round(mix(222,255,blue)),pixels=rasterData.data
  for(let y=0;y<rows;y++){
   const ny=y/rows
   for(let x=0;x<cols;x++){
    const nx=x/cols
    const sweep=.5+.5*Math.sin(nx*12-ny*8-time*.32-progress*8)
    const weave=.5+.5*Math.sin(nx*39+ny*21+time*.2)
    const envelope=mix(smooth(.27,.88,ny)*smooth(.02,.65,nx),1,blue)
    const field=(.04+sweep*sweep*.38+weave*.08)*envelope
    const alpha=mix(field,glyph[(y*cols+x)*4+3]/255*.92+field*.12,letter)
    const index=((y*4+1)*raster.width+x*4+1)*4
    pixels[index]=red;pixels[index+1]=green;pixels[index+2]=sky;pixels[index+3]=alpha<.025?0:Math.round(alpha*255)
   }
  }
  // One raster upload and one image blit replace thousands of alpha-changing
  // canvas draw calls. The empty pixels preserve the printed halftone spacing.
  rasterContext.putImageData(rasterData,0,0);ctx.imageSmoothingEnabled=false;ctx.drawImage(raster,0,0,width,height)
  canvas.dataset.frameProgress=progress.toFixed(4);canvas.dataset.frameCount=String(++paintCount)
 }
 const request=(force=false)=>{if(!frame&&!disposed&&!lost&&visible&&!document.hidden&&(!paused||force))frame=requestAnimationFrame(render)}
 const render=(now:number)=>{
  frame=0;if(disposed||lost||!visible||document.hidden)return
  if(!paused&&lastTime)time+=Math.min(now-lastTime,64)/1000
  lastTime=now
  if(!lastPaint||now-lastPaint>=1000/30){paint();lastPaint=now;dirty=false}
  request(dirty)
 }
 const running=()=>{canvas.dataset.running=String(!paused&&visible&&!document.hidden&&!lost)}
 const resize=()=>{if(disposed)return;size();request(true)}
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas)
 const observer=new IntersectionObserver(entries=>{visible=entries[entries.length-1].isIntersecting&&entries[entries.length-1].intersectionRatio>=.002;if(visible){lastTime=0;request(true)}else{cancelAnimationFrame(frame);frame=0}running()},{threshold:[0,.002]});observer.observe(canvas)
 const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else{lastTime=0;request(true)}running()}
 const contextLost=(event:Event)=>{event.preventDefault();lost=true;cancelAnimationFrame(frame);frame=0;canvas.dataset.context='lost';running()}
 const restored=()=>{lost=false;canvas.dataset.context='ready';resize();running()}
 canvas.addEventListener('contextlost',contextLost);canvas.addEventListener('contextrestored',restored);document.addEventListener('visibilitychange',visibility)
 canvas.dataset.context='ready';canvas.dataset.effect='cefabex-signal-screen';canvas.dataset.renderMode='canvas2d';running();resize()
 document.fonts.ready.then(()=>{if(!disposed)resize()})
 return {update:(value:number)=>{progress=Math.max(0,Math.min(1,value));dirty=true;request(true)},setPaused:(value:boolean)=>{paused=value;cancelAnimationFrame(frame);frame=0;lastTime=0;running();if(!paused)request(true)},dispose:()=>{
  disposed=true;cancelAnimationFrame(frame);resizeObserver.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('contextlost',contextLost);canvas.removeEventListener('contextrestored',restored);mask.width=mask.height=0;raster.width=raster.height=0
 }}
}
