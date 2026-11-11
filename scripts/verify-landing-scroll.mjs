import {chromium} from 'playwright'
import assert from 'node:assert/strict'
const target=process.env.TARGET_URL||'http://127.0.0.1:4173'
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']})
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}})
 await page.goto(target)
 await page.locator('.brand-canvas[data-context="ready"]').waitFor({timeout:20000})
 // A lost GPU context must not remove the text or controls.
 await page.locator('.brand-canvas').evaluate(canvas=>canvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext())
 await page.locator('.brand-canvas[data-context="lost"]').waitFor({state:'attached'})
 await page.evaluate(()=>scrollTo(0,(document.querySelector('.brand-journey').offsetHeight-innerHeight)*.9))
 await page.waitForTimeout(1000)
 assert.equal(await page.locator('.brand-resolution').evaluate(el=>getComputedStyle(el).visibility),'visible')
 await page.locator('.brand-resolution a').click()
 await page.waitForTimeout(1500)
 assert.ok((await page.locator('#company').boundingBox()).y<900)
 await page.close()
 // Also exercise a device where WebGL is unavailable from the beginning.
 const fallback=await browser.newPage({viewport:{width:390,height:844}})
 await fallback.addInitScript(()=>{
  const original=HTMLCanvasElement.prototype.getContext
  HTMLCanvasElement.prototype.getContext=function(type,...args){if(type==='webgl'||type==='webgl2')return null;return original.call(this,type,...args)}
 })
 await fallback.goto(target)
 await fallback.locator('.brand-canvas[data-render-mode="fallback"]').waitFor({timeout:20000})
 await fallback.evaluate(()=>scrollTo(0,(document.querySelector('.brand-journey').offsetHeight-innerHeight)*.9))
 await fallback.waitForTimeout(1000)
 assert.equal(await fallback.locator('.brand-resolution').evaluate(el=>getComputedStyle(el).visibility),'visible')
 await fallback.emulateMedia({reducedMotion:'reduce'})
 await fallback.locator('.brand-canvas').waitFor({state:'detached'})
 assert.equal(await fallback.locator('.pin-spacer').count(),0)
 assert.equal(await fallback.locator('.brand-journey').evaluate(el=>el.classList.contains('is-static')),true)
 assert.equal(await fallback.locator('.reveal-mask').count(),0)
 const staticPage=await browser.newPage({javaScriptEnabled:false})
 await staticPage.goto(target)
 await staticPage.getByRole('heading',{name:'CEFABEX. Build what comes next.'}).waitFor()
 await staticPage.getByRole('link',{name:'Email cefabex.cfb@gmail.com'}).waitFor()
 console.log('PASS: WebGL context loss, initial WebGL failure, exploration link, live reduced-motion fallback and no-JavaScript contact path.')
}finally{await browser.close()}
