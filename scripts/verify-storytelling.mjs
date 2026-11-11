import {chromium} from 'playwright'
import assert from 'node:assert/strict'
const target=process.env.TARGET_URL||'http://127.0.0.1:4173'
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']})
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}})
 const errors=[];page.on('pageerror',e=>errors.push(e.message))
 await page.goto(target+'/about')
 await page.waitForTimeout(1200)
 const routes=[['Services','/services'],['Projects','/projects'],['Contact','/contact'],['About','/about']]
 for(const [name,path] of routes){
  await page.locator('.page-nav').getByRole('link',{name,exact:true}).click()
  await page.locator('.page-transition').waitFor({state:'visible'})
  assert.equal(await page.locator('.page-transition').getAttribute('data-destination'),path.slice(1))
  await page.locator('.page-transition').waitFor({state:'hidden'})
  assert.equal(new URL(page.url()).pathname,path)
  assert.equal(await page.locator('.pin-spacer').count(),0,'Non-home pages have no orphaned pin')
  await page.evaluate(()=>scrollTo(0,document.body.scrollHeight))
  await page.waitForTimeout(1600)
  const letters=await page.locator('.page-footer-name > span').evaluateAll(els=>els.map(el=>new DOMMatrix(getComputedStyle(el).transform).m42))
  assert.ok(letters.every(value=>Math.abs(value)<1),'Footer lettering completes')
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(800)
 }
 // Browser back during the opening curtain must cancel the old transition and unlock scrolling.
 await page.locator('.page-nav').getByRole('link',{name:'Services',exact:true}).click()
 await page.waitForURL('**/services')
 await page.goBack()
 await page.waitForURL('**/about')
 await page.locator('.page-transition').waitFor({state:'hidden'})
 assert.equal(await page.locator('html').evaluate(el=>el.classList.contains('scroll-locked')),false)
 assert.equal(await page.locator('main').count(),1)
 assert.equal(await page.locator('main').evaluate(el=>el===document.activeElement),true)
 assert.deepEqual(errors,[])
 console.log('PASS: route-specific curtains, scroll-revealed footer, interrupted browser history, focus and cleanup.')
}finally{await browser.close()}
