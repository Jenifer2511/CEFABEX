import {chromium} from 'playwright'
import assert from 'node:assert/strict'
import {mkdir} from 'node:fs/promises'
await mkdir('artifacts',{recursive:true})
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']})
const p=await b.newPage({viewport:{width:1440,height:1000}}),errors=[]
p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())})
const url=process.env.TARGET_URL||'http://127.0.0.1:4173'
const settle=async()=>{await p.waitForTimeout(450)}
const scene=async(selector,t)=>{const r=await p.locator(selector).evaluate(el=>({start:+el.dataset.scrollStart,end:+el.dataset.scrollEnd}));assert.ok(r.end>r.start,selector+' has scroll range');await p.evaluate(y=>scrollTo(0,y),r.start+(r.end-r.start)*t);await settle()}
await p.goto(url);await p.locator('.loader').waitFor();assert.ok(Number(await p.getByRole('progressbar').getAttribute('aria-valuemax'))===200)
await p.screenshot({path:'artifacts/story-loader.png'});await p.locator('.loader').waitFor({state:'detached',timeout:15000})
assert.equal(await p.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Home',exact:true}).count(),1)
await p.screenshot({path:'artifacts/story-hero.png'})
for(const [n,t] of [[0,.01],[3,.5],[6,.99]]){await scene('#possibilities',t);assert.equal(await p.locator('#possibilities').getAttribute('data-active-capability'),String(n));await p.screenshot({path:`artifacts/story-carousel-${n}.png`})}
await p.getByRole('button',{name:'Previous capability'}).click();await p.waitForFunction(()=>document.querySelector('#possibilities').dataset.activeCapability==='5');await p.waitForTimeout(1500)
const distance=await p.locator('.story-thread').getAttribute('data-distance');await p.waitForTimeout(400);assert.equal(await p.locator('.story-thread').getAttribute('data-distance'),distance)
assert.ok(await p.locator('.story-thread-ink').evaluate(el=>el.getTotalLength())>5000)
const stationY=await p.locator('#company').evaluate(el=>el.getBoundingClientRect().top+scrollY+96-innerHeight*.38)
await p.evaluate(y=>scrollTo(0,y),stationY);await settle();assert.equal(await p.locator('.story-thread').getAttribute('data-docked'),'true');assert.equal(await p.locator('.story-thread').getAttribute('data-station'),'company')
assert.equal(await p.locator('.story-thread-ink').evaluate(path=>{
 const root=path.closest('main'),rootTop=root.getBoundingClientRect().top+scrollY
 const bands=[...root.querySelectorAll('[data-thread-stop]')].map(el=>{const top=el.getBoundingClientRect().top+scrollY-rootTop;return [top-parseFloat(getComputedStyle(el).marginTop),top]})
 for(let n=0;n<path.getTotalLength();n+=10){const point=path.getPointAtLength(n);if(point.y>=bands[0][1]&&point.x>32&&point.x<innerWidth-32&&!bands.some(([a,b])=>point.y>=a&&point.y<=b))return false}
 return true
}),true,'The thread must cross only in empty section bands, away from content')
await p.screenshot({path:'artifacts/story-thread-stop.png'})
await scene('#film',.2);await p.waitForFunction(()=>document.querySelector('#film video')?.readyState>=2,null,{timeout:15000});await p.waitForTimeout(700)
const a=await p.locator('#film video').evaluate(v=>v.currentTime)
await scene('#film',.8);await p.waitForFunction(t=>document.querySelector('#film video').currentTime>t+2,a);await p.waitForTimeout(300)
await p.screenshot({path:'artifacts/story-film.png'})
const paused=await p.locator('#film video').evaluate(v=>v.currentTime);await p.waitForTimeout(500);assert.equal(await p.locator('#film video').evaluate(v=>v.currentTime),paused)
await scene('#film',.3);await p.waitForFunction(t=>document.querySelector('#film video').currentTime<t-1,paused)
await p.getByLabel('Film quality').selectOption('4k');await p.waitForFunction(()=>document.querySelector('#film video').videoWidth===3840)
assert.equal(await p.locator('#film video').evaluate(v=>v.videoHeight),2160)
for(const id of ['capabilities','connection','people']){await p.locator('#'+id).scrollIntoViewIfNeeded();await settle();await p.screenshot({path:`artifacts/story-${id}.png`})}
await p.getByRole('button',{name:'Pause ambient motion'}).click();assert.equal(await p.getByRole('button',{name:'Resume ambient motion'}).getAttribute('aria-pressed'),'true')
assert.equal(await p.locator('.cd-capability-row').count(),5)
const heightBefore=await p.locator('.story-thread').evaluate(el=>el.viewBox.baseVal.height)
await p.locator('#questions summary').first().click();await settle()
assert.ok(await p.locator('.story-thread').evaluate(el=>el.viewBox.baseVal.height)>heightBefore,'Thread measurement must follow expanded FAQ content')
await p.locator('#questions summary').first().click();await settle()
assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
await p.reload();await p.locator('.loader').waitFor();await p.locator('.loader').waitFor({state:'detached',timeout:15000})
for(const width of [768,390]){await p.setViewportSize({width,height:844});await p.goto(url);await p.locator('.loader').waitFor({state:'detached',timeout:15000});await scene('#possibilities',.5);await p.screenshot({path:`artifacts/story-${width}-carousel.png`});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await scene('#film',.5);await p.screenshot({path:`artifacts/story-${width}-film.png`})}
const reduced=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await reduced.goto(url);assert.equal(await reduced.locator('.story-thread,.loader').count(),0);await reduced.getByRole('button',{name:'Next capability'}).click();assert.equal(await reduced.locator('#possibilities').getAttribute('data-active-capability'),'1')
await p.goto(url+'/about');await p.getByRole('button',{name:'Open navigation'}).click();assert.equal(await p.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Home',exact:true}).count(),1)
await p.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Home',exact:true}).click();await p.locator('.loader').waitFor();await p.locator('.page-curl-overlay.is-turning').waitFor({state:'hidden',timeout:15000});await p.locator('.loader').waitFor({state:'detached',timeout:15000})
assert.deepEqual(errors,[])
console.log('Loader return, Home navigation, 3D carousel, thread, scroll film/4K decode, content, ambient controls, responsive and reduced-motion checks passed')
await b.close()
