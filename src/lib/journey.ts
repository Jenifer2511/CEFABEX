// Scroll timeline units only: these values are NOT elapsed seconds.
import {clamp,mix,smooth} from './scene.ts'
export const JOURNEY={tunnelEnd:15,gatherEnd:20,trailEnd:30,writeEnd:38,inkStart:39,span:40.5} as const
export type Position={x:number;y:number;z:number}
export type GlyphPoint={x:number;y:number}
export function journeyPhase(t:number){return t<15?'tunnel':t<20?'gather':t<30?'trail':t<38?'write':t<39?'hold':'ink'}
export function journeyChapter(t:number){return t<5?0:t<10?1:t<15?2:t<38?3:4}
export function trailPoint(u:number,t:number,aspect:number):Position{
 const advance=clamp((t-20)/10)*.72
 const n=1-Math.exp(-(u*1.6+advance))
 return {x:Math.sin(n*Math.PI*3.1)*Math.pow(1-n,.65)*12*Math.min(aspect,1.65),y:Math.sin(n*Math.PI*2.2+.5)*(1-n)*6.8,z:7-n*40}
}
export function routeFor(targets:GlyphPoint[],aspect:number):Position[]{
 const width=Math.min(27,19.5*aspect)
 const entry=targets.map((_,i)=>trailPoint(i/Math.max(1,targets.length-1),30,aspect))
 const glyphs=targets.map(p=>({x:p.x*width,y:p.y*width,z:-4}))
 const a=entry[entry.length-1],d=glyphs[0],b={x:a.x-2,y:a.y+3,z:a.z+7},c={x:d.x-3,y:d.y+2,z:d.z-3}
 const bridge=Array.from({length:48},(_,i)=>{const u=(i+1)/49,v=1-u;return {x:v*v*v*a.x+3*v*v*u*b.x+3*v*u*u*c.x+u*u*u*d.x,y:v*v*v*a.y+3*v*v*u*b.y+3*v*u*u*c.y+u*u*u*d.y,z:v*v*v*a.z+3*v*v*u*b.z+3*v*u*u*c.z+u*u*u*d.z}})
 return [...entry,...bridge,...glyphs]
}
// Cubic interpolation travels through the SAME route nodes for every follower.
export function followRoute(nodes:Position[],index:number):Position{
 const j=Math.floor(index),t=index-j
 const a=nodes[Math.max(0,j-1)],b=nodes[Math.min(nodes.length-1,j)],c=nodes[Math.min(nodes.length-1,j+1)],d=nodes[Math.min(nodes.length-1,j+2)]
 const component=(key:keyof Position)=>.5*((2*b[key])+(-a[key]+c[key])*t+(2*a[key]-5*b[key]+4*c[key]-d[key])*t*t+(-a[key]+3*b[key]-3*c[key]+d[key])*t*t*t)
 return {x:component('x'),y:component('y'),z:component('z')}
}
export function journeyTile(i:number,count:number,t:number,aspect:number,route:Position[]){
 const u=i/Math.max(1,count-1)
 const gather=smooth(15+u*3.3,16.7+u*3.3,t)
 const slot=i%16,side=slot%4,lane=Math.floor(slot/4),layer=Math.floor(i/16)
 const z=7-((layer*3.2+Math.min(t,20)*1.8)%68)
 const tx=side<2?(lane-1.5)*3.4*Math.min(aspect,1.7):(side===2?-1:1)*11*Math.min(aspect,1.7)
 const ty=side<2?(side===0?-7.8:7.8):(lane-1.5)*3.5
 let a=trailPoint(u,t,aspect),b=trailPoint(Math.min(1,u+.001),t,aspect)
 let deposit=0
 if(t>=30){
  const wordStart=route.length-count
  const index=i+wordStart*smooth(30,38,t)
  a=followRoute(route,index);b=followRoute(route,Math.min(route.length-1,index+.025))
  deposit=smooth(wordStart-16,wordStart,index)
 }
 const angle=Math.atan2(b.y-a.y,b.x-a.x)
 const width=Math.min(27,19.5*aspect),cell=width*.014
 const settle=smooth(37.7,38.3,t)
 return {x:mix(tx,a.x,gather),y:mix(ty,a.y,gather),z:mix(z,a.z,gather),rx:(side<2?Math.PI/2:0)*(1-gather),ry:(side>=2?Math.PI/2:0)*(1-gather),rz:angle*gather*(1-settle),w:mix(3.2,mix(2.1*(1-u*.5),cell*1.6,deposit),gather),h:mix(2.2,mix(1.31*(1-u*.5),cell*1.6,deposit),gather),alpha:mix(smooth(-55,-18,z)*(1-smooth(5.5,7,z)),1,gather)}
}
// Nearest-neighbour snake fills each letter before crossing to the next one.
export function orderGlyphs(points:GlyphPoint[]):GlyphPoint[]{
 const groups=Array.from({length:7},()=>[] as GlyphPoint[])
 points.forEach(p=>groups[Math.min(6,Math.max(0,Math.floor((p.x+.5)*7)))].push(p))
 const result:GlyphPoint[]=[];let last={x:-.5,y:.1}
 for(const group of groups)while(group.length){let best=0,dist=Infinity;group.forEach((p,i)=>{const d=(p.x-last.x)**2+(p.y-last.y)**2;if(d<dist){best=i;dist=d}});last=group.splice(best,1)[0];result.push(last)}
 return result
}
