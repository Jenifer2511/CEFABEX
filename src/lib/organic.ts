import {mix,smooth} from './scene.ts'
export type WordPoint={x:number;y:number}
// A single material and persistent image IDs travel through all three poses.
export function organicTile(i:number,count:number,p:number,aspect:number,target:WordPoint){
 const u=i/Math.max(1,count-1)
 const gather=smooth(.38+u*.09,.62+u*.05,p)
 const form=smooth(.77+u*.035,.96+u*.025,p)
 const travel=Math.min(p,.48)*62
 const slot=i%16, layer=Math.floor(i/16)
 const z=7-((layer*3.2+travel)%68)
 const side=slot%4, lane=Math.floor(slot/4)
 const lateral=(lane-1.5)*3.4
 const tx=side<2?lateral*(Math.min(aspect,1.7)): (side===2?-1:1)*11*Math.min(aspect,1.7)
 const ty=side<2?(side===0?-7.8:7.8):(lane-1.5)*3.5
 const flow=smooth(.6,.8,p)*.36
 const t=u*(1-flow)+flow
 // Open, serpentine path: no radius/angle spiral and no looping carousel.
 const path=(n:number)=>({x:Math.sin(n*Math.PI*3.1)*Math.pow(1-n,.7)*11*Math.min(aspect,1.65),y:Math.sin(n*Math.PI*2.2+.5)*(1-n)*6,z:7-n*34})
 const a=path(t),b=path(Math.min(1,t+.001))
 const theta=Math.atan2(b.y-a.y,b.x-a.x)
 const width=Math.min(27,19.5*aspect)
 const cell=width*.014
 return {x:mix(mix(tx,a.x,gather),target.x*width,form),y:mix(mix(ty,a.y,gather),target.y*width,form),z:mix(mix(z,a.z,gather),-4,form),rx:mix(side<2?Math.PI/2:0,0,gather),ry:mix(side>=2?Math.PI/2:0,0,gather),rz:mix(theta*gather,0,form),w:mix(mix(3.2,2.1*(1-t*.65),gather),cell*1.6,form),h:mix(mix(2.2,1.31*(1-t*.65),gather),cell*1.6,form),alpha:mix(smooth(-55,-18,z)*(1-smooth(5.5,7,z)),1,gather),width}
}
