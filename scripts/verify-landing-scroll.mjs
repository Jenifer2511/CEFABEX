import {chromium} from 'playwright'
import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
const digest=buffer=>createHash('sha256').update(buffer).digest('hex')
const target=process.env.TARGET_URL||'http://127.0.0.1:4173'
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']})
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}})
 await page.goto(target);await page.locator('.brand-canvas[data-context="ready"]').waitFor({timeout:20000})
 assert.equal(await page.locator('.brand-canvas').getAttribute('data-effect'),'cefabex-signal-screen')
 assert.equal(await page.getByRole('button',{name:'Play the reveal'}).count(),0)
 const before=Number(await page.locator('.brand-journey').getAttribute('data-progress'))
 await page.mouse.wheel(0,700)
 await page.waitForFunction(start=>Number(document.querySelector('.brand-journey').dataset.progress)>start+.05,before)
 await page.waitForTimeout(1900)
 await page.getByRole('button',{name:'Pause background',exact:true}).click();await page.waitForTimeout(100)
 const held=digest(await page.locator('.brand-canvas').evaluate(canvas=>canvas.toDataURL('image/png')))
 await page.mouse.move(640,450);await page.waitForTimeout(400)
 assert.equal(digest(await page.locator('.brand-canvas').evaluate(canvas=>canvas.toDataURL('image/png'))),held,'Paused live background holds during idle and pointer movement')
 const forward=Number(await page.locator('.brand-journey').getAttribute('data-progress'))
 await page.mouse.wheel(0,-350);await page.waitForTimeout(1900)
 assert.ok(Number(await page.locator('.brand-journey').getAttribute('data-progress'))<forward)
 assert.notEqual(digest(await page.locator('.brand-canvas').evaluate(canvas=>canvas.toDataURL('image/png'))),held,'Scroll still changes the scene when ambient animation is paused')
 // Canvas 2D has its own loss/restoration events; no WebGL is created.
 await page.locator('.brand-canvas').evaluate(canvas=>canvas.dispatchEvent(new Event('contextlost',{cancelable:true})))
 await page.locator('.brand-canvas[data-context="lost"]').waitFor({state:'attached'})
 assert.equal(await page.locator('.brand-name').evaluate(el=>getComputedStyle(el).opacity),'1')
 assert.ok(await page.locator('.brand-letter').evaluateAll(els=>els.every(el=>getComputedStyle(el).transform==='none')))
 await page.getByRole('link',{name:'Skip intro',exact:true}).click();await page.waitForTimeout(1500)
 assert.ok((await page.locator('#company').boundingBox()).y<900)
 await page.locator('.brand-canvas').evaluate(canvas=>canvas.dispatchEvent(new Event('contextrestored')))
 await page.locator('.brand-canvas[data-context="ready"]').waitFor()
 await page.evaluate(()=>scrollTo(0,(document.querySelector('.brand-journey').offsetHeight-innerHeight)*.35))
 await page.waitForFunction(()=>Math.abs(Number(document.querySelector('.brand-canvas')?.dataset.frameProgress)-.35)<.01,{},{timeout:15000})
 await page.close()
 const fallback=await browser.newPage({viewport:{width:390,height:844}})
 await fallback.addInitScript(()=>{
  const original=HTMLCanvasElement.prototype.getContext
  HTMLCanvasElement.prototype.getContext=function(type,...args){if(type==='2d')return null;return original.call(this,type,...args)}
 })
 await fallback.goto(target);await fallback.locator('.brand-canvas[data-render-mode="fallback"]').waitFor({state:'attached'})
 assert.equal(await fallback.locator('.brand-resolution').evaluate(el=>getComputedStyle(el).opacity),'1')
 assert.equal(await fallback.getByRole('button',{name:'Pause background',exact:true}).isVisible(),false)
 await fallback.emulateMedia({reducedMotion:'reduce'});await fallback.locator('.brand-canvas').waitFor({state:'detached'})
 assert.equal(await fallback.locator('.pin-spacer').count(),0)
 assert.equal(await fallback.locator('.reveal-mask').count(),0)
 const staticPage=await browser.newPage({javaScriptEnabled:false});await staticPage.goto(target)
 await staticPage.getByRole('heading',{name:'CEFABEX. Build what comes next.'}).waitFor()
 await staticPage.getByRole('link',{name:'Email cefabex.cfb@gmail.com'}).waitFor()
 console.log('PASS: wheel/reversal, live-background pause, scroll while paused, 2D context recovery, canvas failure, skip navigation, reduced motion and no-JavaScript contact.')
}finally{await browser.close()}
