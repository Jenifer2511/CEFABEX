import test from 'node:test'
import assert from 'node:assert/strict'
import {chapterAt,tunnelDepth,scenePhases} from '../src/lib/scene.ts'
import {createSpiral} from '../src/lib/spiral.ts'

test('Three phrases lead to the supplied spiral and polished name reveal',()=>{
 assert.deepEqual([0,.14,.3,.5,.8,1].map(chapterAt),[0,1,2,3,4,4])
 assert.equal(scenePhases(0).tunnelOpacity,1)
 assert.equal(scenePhases(.7).spiralOpacity,1)
 assert.equal(scenePhases(.95).spiralOpacity,0)
 assert.equal(scenePhases(.95).nameOpacity,1)
})
test('Tunnel travel follows scroll inward and reverses precisely',()=>{
 assert.ok(tunnelDepth(.4)<tunnelDepth(.2))
 assert.equal(tunnelDepth(.2),-14)
 assert.equal(tunnelDepth(0),0)
})
test('Supplied spiral follows linear radius from outer edge to center',()=>{
 const {spiral,arcToN}=createSpiral(3.5)
 for(const s of [0,.1,.3,.5,.9,1]){
  const n=arcToN(s);const pt=spiral(n,100)
  assert.ok(Number.isFinite(pt.x+pt.y))
  assert.ok(Math.abs(Math.hypot(pt.x,pt.y)-100*(1-n))<.001)
 }
 assert.equal(arcToN(0),0)
 assert.ok(Math.abs(arcToN(1)-1)<.0001)
})
test('Arc parametrisation spaces images uniformly rather than bunching at the center',()=>{
 const {spiral,arcToN}=createSpiral(3.5)
 const distances=[]
 for(let i=0;i<90;i++){
  const a=spiral(arcToN(i/100),100),b=spiral(arcToN((i+1)/100),100)
  distances.push(Math.hypot(b.x-a.x,b.y-a.y))
 }
 assert.ok(Math.max(...distances)/Math.min(...distances)<1.05)
})
