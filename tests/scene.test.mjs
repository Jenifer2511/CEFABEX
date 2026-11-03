import test from 'node:test'
import assert from 'node:assert/strict'
import {organicTile} from '../src/lib/organic.ts'
import {chapterAt} from '../src/lib/scene.ts'
test('One image identity reaches its assigned word position',()=>{
 for(const aspect of [.46,1,1.6])for(let i=0;i<336;i++){
 const target={x:i/336-.5,y:.04};const tile=organicTile(i,336,1,aspect,target)
 assert.ok(Math.abs(tile.x-target.x*tile.width)<1e-10);assert.ok(Math.abs(tile.y-target.y*tile.width)<1e-10);assert.ok(Math.abs(tile.z+4)<1e-10);assert.equal(tile.alpha,1)
 }
})
test('The gathering trail and word assembly are continuous across phase boundaries',()=>{
 for(const p of [.48,.55,.62,.67,.77,.9,.985])for(const i of [0,60,140,260]){
 const a=organicTile(i,336,p-.000001,1.6,{x:.1,y:0}),b=organicTile(i,336,p+.000001,1.6,{x:.1,y:0})
 assert.ok(Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)<.01)
 }
})
test('Images retain finite geometry throughout forward and reverse scrubbing',()=>{
 for(let k=0;k<=100;k++)for(let i=0;i<336;i+=5){const t=organicTile(i,336,k/100,.46,{x:.1,y:0});assert.ok(Object.values(t).every(Number.isFinite));assert.ok(t.w>0&&t.h>0)}
})
test('Narrative keeps its three phrases before gathering and identity',()=>assert.deepEqual([0,.14,.3,.5,.8,1].map(chapterAt),[0,1,2,3,4,4]))
