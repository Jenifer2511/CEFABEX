import test from 'node:test'
import assert from 'node:assert/strict'
import {JOURNEY,journeyPhase,journeyChapter,routeFor,followRoute,journeyTile,trailPoint,orderGlyphs} from '../src/lib/journey.ts'
const points=Array.from({length:112},(_,i)=>({x:i/112-.5,y:Math.sin(i)*.04}));const route=routeFor(points,1.6)
test('Scroll timeline preserves tunnel/trail proportions without a clock',()=>{assert.equal(JOURNEY.tunnelEnd,15);assert.equal(JOURNEY.trailEnd-JOURNEY.gatherEnd,10);assert.equal(JOURNEY.span,40.5);assert.equal(journeyPhase(14.99),'tunnel');assert.equal(journeyPhase(15),'gather');assert.equal(journeyPhase(20),'trail');assert.equal(journeyPhase(29.99),'trail');assert.equal(journeyPhase(30),'write')})
test('Gathering is staggered across the scroll interval',()=>{const first=journeyTile(0,112,17,1.6,route),last=journeyTile(111,112,17,1.6,route);assert.equal(first.rx,0);assert.notEqual(last.ry,0);for(let i=0;i<112;i++){const t=journeyTile(i,112,20,1.6,route);assert.equal(t.rx,0);assert.equal(t.ry,0)}})
test('Shared trail advances as scroll position advances',()=>{for(const u of [.05,.3,.7,.99]){assert.ok(trailPoint(u,30,1.6).z<trailPoint(u,25,1.6).z);assert.ok(trailPoint(u,25,1.6).z<trailPoint(u,20,1.6).z)}})
test('Every follower traverses the same bridge and letter route and deposits at its own target',()=>{const offset=route.length-points.length;for(let i=0;i<112;i++){const start=journeyTile(i,112,30,1.6,route),end=journeyTile(i,112,38.3,1.6,route);const source=followRoute(route,i),target=followRoute(route,i+offset);assert.ok(Math.hypot(start.x-source.x,start.y-source.y,start.z-source.z)<1e-9);assert.ok(Math.hypot(end.x-target.x,end.y-target.y,end.z-target.z)<1e-9)}})
test('Route and geometry remain finite through forward/reverse scroll samples',()=>{for(const time of [0,5,14.99,15,19.9,20,25,30,35,38,39,40.5])for(let i=0;i<112;i++){const t=journeyTile(i,112,time,1.6,route);assert.ok(Object.values(t).every(Number.isFinite));assert.ok(t.w>0&&t.h>0)}})
test('Glyph ordering keeps every supplied image target exactly once',()=>{const ordered=orderGlyphs(points);assert.equal(ordered.length,points.length);assert.equal(new Set(ordered).size,points.length);assert.deepEqual([0,5,10,15,38].map(journeyChapter),[0,1,2,3,4])})
test('Visible gathering cards stay continuous across the tunnel depth wrap',()=>{
 const count=259,targets=Array.from({length:count},(_,i)=>({x:i/count-.5,y:Math.sin(i)*.04})),nodes=routeFor(targets,1.6)
 const wrap=(68-11*3.2)/1.8,epsilon=1e-5
 for(let i=176;i<=191;i++){
  const before=journeyTile(i,count,wrap-epsilon,1.6,nodes),after=journeyTile(i,count,wrap+epsilon,1.6,nodes)
  assert.ok(before.alpha>.4,'The regression must exercise a visible card, not an invisible tunnel reset')
  assert.ok(Math.hypot(after.x-before.x,after.y-before.y,after.z-before.z)<.005,`Card ${i} jumped at its former source-depth wrap`)
 }
})
test('Every follower preserves its tangent when the trail enters the letter route',()=>{
 const count=259,targets=Array.from({length:count},(_,i)=>({x:i/count-.5,y:Math.sin(i)*.04}))
 for(const aspect of [.46,1.44,2]){
  const nodes=routeFor(targets,aspect)
  for(let i=0;i<count;i++){
   const before=journeyTile(i,count,30-1e-6,aspect,nodes),after=journeyTile(i,count,30,aspect,nodes)
   const difference=Math.abs(Math.atan2(Math.sin(after.rz-before.rz),Math.cos(after.rz-before.rz)))
   assert.ok(difference<.01,`Card ${i} snapped its orientation at aspect ${aspect}`)
  }
 }
})
test('Inward trail motion eases into and out of both joins',()=>{
 const epsilon=1e-4
 for(const u of [0,.25,.5,.75,1])for(const [start,end] of [[20,20+epsilon],[30-epsilon,30]]){
  const a=trailPoint(u,start,1.6),b=trailPoint(u,end,1.6)
  assert.ok(Math.hypot(b.x-a.x,b.y-a.y,b.z-a.z)/epsilon<.01,'Trail velocity must settle at the join')
 }
})
test('Final alignment stays continuous when the glyph path crosses the atan2 branch',()=>{
 // Leftward, alternating tangents deliberately cross +PI/-PI during the settle.
 const count=259,targets=Array.from({length:count},(_,i)=>({x:.5-i/count,y:Math.sin(i)*.04})),nodes=routeFor(targets,1.44)
 for(let t=37.7;t<38.3;t+=.005)for(let i=0;i<count;i++){
  const before=journeyTile(i,count,t,1.44,nodes),after=journeyTile(i,count,t+.005,1.44,nodes)
  const difference=Math.abs(Math.atan2(Math.sin(after.rz-before.rz),Math.cos(after.rz-before.rz)))
  assert.ok(difference<.05,`Card ${i} flipped while settling at ${t}`)
 }
 for(let i=0;i<count;i++)assert.equal(Math.abs(journeyTile(i,count,38.3,1.44,nodes).rz),0)
})
