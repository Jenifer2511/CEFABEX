import {chromium} from 'playwright'
import assert from 'node:assert/strict'
const target=process.env.TARGET_URL||'http://127.0.0.1:4173'
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']})
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}})
 const errors=[];page.on('pageerror',error=>errors.push(error.message))
 await page.goto(target);await page.locator('.brand-canvas[data-context="ready"]').waitFor({timeout:30000});await page.waitForTimeout(1400)
 assert.equal(await page.locator('.pin-spacer').count(),3)
 const chapter=async(id,progress)=>{
  await page.evaluate(([id,p])=>{const el=document.getElementById(id);const start=Number(el.dataset.scrollStart),end=Number(el.dataset.scrollEnd);scrollTo(0,start+(end-start)*p)},[id,progress])
  await page.waitForTimeout(1300)
 }
 const trackX=()=>page.locator('.project-track').evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m41)
 await chapter('work',.15);const early=await trackX()
 await chapter('work',.8);assert.ok(await trackX()<early-500,'Projects advance through their pinned scene')
 assert.ok(Math.abs((await page.locator('.work-stage').boundingBox()).y)<2)
 await chapter('work',.25);assert.ok(await trackX()>early-500,'Project scene reverses')
 await page.getByRole('button',{name:'Next project',exact:true}).click();await page.waitForTimeout(1800)
 assert.ok(Number(await page.locator('#work').getAttribute('data-progress'))>.45,'Gallery controls move the scene')
 // Keyboard focus must bring an offscreen project into the visible gallery.
 await page.getByRole('button',{name:'Previous project',exact:true}).click();await page.waitForTimeout(150)
 await page.keyboard.press('Tab');await page.locator('.project-teaser').last().focus();await page.waitForTimeout(1300)
 const last=await page.locator('.project-teaser').last().boundingBox();assert.ok(last.x>=0&&last.x+last.width<=1442,'Focused project is visible')
 await chapter('approach',.5)
 const second=page.locator('.process-number > span').nth(1)
 assert.ok(Math.abs(await second.evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m42))<2,'Second process chapter resolves')
 await chapter('approach',.95)
 assert.ok(Math.abs(await page.locator('.process-number > span').nth(2).evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m42))<2,'Third process chapter resolves')
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(1400)
 assert.equal(await page.locator('.pin-spacer').count(),1,'Phone uses native vertical work and process layouts')
 assert.equal(await page.locator('.simple-work.is-horizontal,.simple-approach.is-pinned').count(),0)
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(700)
 assert.equal(await page.locator('.pin-spacer,.brand-canvas').count(),0,'Live reduced motion cleans up every pin and canvas')
 assert.equal(await page.locator('.project-track').evaluate(el=>getComputedStyle(el).transform),'none')
 assert.deepEqual(errors,[])
 console.log('PASS: distinct work/process chapters, reversible horizontal travel, gallery controls, keyboard visibility, responsive unpinning and live reduced-motion cleanup.')
}finally{await browser.close()}
