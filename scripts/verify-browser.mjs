import {chromium} from 'playwright'
import assert from 'node:assert/strict'
import {mkdir} from 'node:fs/promises'
const target=process.env.TARGET_URL||'http://127.0.0.1:4173'
await mkdir('work',{recursive:true})
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']})
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}})
 const errors=[]
 page.on('pageerror',error=>errors.push(error.message))
 page.on('console',message=>{if(message.type()==='error')errors.push(message.text())})
 await page.addInitScript(()=>{
  window.__drawCalls=0
  const draw=WebGL2RenderingContext.prototype.drawElements
  WebGL2RenderingContext.prototype.drawElements=function(...args){window.__drawCalls++;return draw.apply(this,args)}
 })
 const settle=()=>page.waitForTimeout(1100)
 const scroll=async y=>{await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),y);await settle()}
 const noOverflow=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow')
 const navigate=async name=>{
  await scroll(0)
  if((await page.viewportSize()).width<=700)await page.getByRole('button',{name:'Open navigation'}).click()
  await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name,exact:true}).click()
  if(!await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)){
   await page.locator('.page-transition').waitFor({state:'visible'})
   await page.locator('.page-transition').waitFor({state:'hidden'})
  }
  assert.equal(await page.locator('html').evaluate(el=>el.classList.contains('scroll-locked')),false)
  await settle()
 }
 await page.goto(target)
 await page.locator('.brand-canvas[data-context="ready"]').waitFor({timeout:20000})
 await settle()
 const cta=page.getByRole('button',{name:'Start a project',exact:true})
 assert.ok((await cta.boundingBox()).y<1000,'Hero CTA visible immediately')
 const range=await page.locator('.brand-journey').evaluate(el=>el.offsetHeight-innerHeight)
 assert.ok(range>1000,'Hero has a pinned scroll interval')
 await scroll(range*.85)
 assert.ok(Number(await page.locator('.brand-journey').getAttribute('data-progress'))>.8)
 assert.ok(Math.abs((await page.locator('.brand-stage').boundingBox()).y)<2,'Hero stays pinned')
 const brand=page.locator('.brand-resolution')
 assert.equal(await brand.evaluate(el=>getComputedStyle(el).visibility),'visible')
 assert.ok(await page.locator('.brand-letter').evaluateAll(els=>els.every(el=>Math.abs(new DOMMatrix(getComputedStyle(el).transform).m42)<1)),'All company letters resolve')
 await page.screenshot({path:'work/cinematic-brand-desktop.png'})
 const idle=await page.evaluate(()=>window.__drawCalls)
 await page.waitForTimeout(400)
 assert.equal(await page.evaluate(()=>window.__drawCalls),idle,'WebGL does not render continuously at rest')
 await scroll(range*.2)
 assert.ok(Number(await page.locator('.brand-journey').getAttribute('data-progress'))<.25,'Scroll reverses the reveal')
 await scroll(range+1000)
 const stopped=await page.evaluate(()=>window.__drawCalls)
 await page.waitForTimeout(400)
 assert.equal(await page.evaluate(()=>window.__drawCalls),stopped,'Offscreen canvas stays idle')
 await page.locator('summary').filter({hasText:'Can you help shape an early idea?'}).click()
 assert.equal(await page.locator('details[open]').count(),1)
 // Exercise the complete enquiry flow, including invalid and valid data.
 await scroll(0);await cta.click();await page.getByRole('dialog').waitFor()
 await page.getByRole('button',{name:'Prepare enquiry'}).click()
 await page.getByText('Please enter your name.',{exact:true}).waitFor()
 await page.getByLabel('Your name',{exact:true}).fill('Test Client')
 await page.getByLabel('Email address',{exact:true}).fill('client@example.com')
 await page.getByLabel('A little about your idea').fill('An accessible company website with a connected product portfolio.')
 await page.getByRole('button',{name:'Prepare enquiry'}).click()
 await page.getByRole('heading',{name:'Your project brief.'}).waitFor()
 await page.keyboard.press('Escape')
 assert.equal(await page.getByRole('dialog').count(),0)
 for(const [name,path] of [['About','about'],['Services','services'],['Projects','projects'],['Contact','contact'],['Home','']]){
  await navigate(name)
  assert.equal(new URL(page.url()).pathname,'/'+path)
  assert.equal(await page.locator('#site-content').getAttribute('data-motion-style'),path||'home')
  assert.equal(await page.locator('.page-nav a[aria-current="page"]').textContent(),name)
  await noOverflow()
  await page.screenshot({path:`work/cinematic-${path||'home'}-desktop.png`})
 }
 // Repeated navigation cleans up pins and WebGL contexts instead of accumulating them.
 assert.equal(await page.locator('.pin-spacer').count(),1)
 assert.equal(await page.locator('.brand-canvas').count(),1)
 await navigate('Projects')
 await page.getByRole('link',{name:/SMARTSEA BELT/}).click()
 await page.locator('.page-transition').waitFor({state:'hidden'})
 await page.locator('[data-page="project-detail"]').waitFor()
 await page.goBack();await page.locator('[data-page="projects"]').waitFor();await page.locator('.page-transition').waitFor({state:'hidden'})
 for(const width of [768,390,320]){
  await page.setViewportSize({width,height:844})
  for(const path of ['/','/about','/services','/projects','/contact']){
   await page.goto(target+path);await settle();await noOverflow()
   assert.equal(await page.locator('main h1').count(),1)
   if(path==='/'){
    await page.screenshot({path:`work/cinematic-home-${width}.png`})
    const distance=await page.locator('.brand-journey').evaluate(el=>el.offsetHeight-innerHeight)
    await scroll(distance*.85);await noOverflow()
    assert.ok((await page.locator('.brand-name').boundingBox()).width<=width,'Company name fits mobile')
   }
  }
  if(width===390){
   await page.getByRole('button',{name:'Open navigation'}).click()
   await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Home',exact:true}).focus()
   await page.keyboard.press('Shift+Tab')
   assert.equal(await page.getByRole('button',{name:'Close navigation'}).evaluate(el=>el===document.activeElement),true,'Mobile focus is contained')
   await page.keyboard.press('Escape')
   assert.equal(await page.getByRole('button',{name:'Open navigation'}).evaluate(el=>el===document.activeElement),true)
   await navigate('Home')
  }
 }
 await page.emulateMedia({reducedMotion:'reduce'})
 await page.goto(target);await settle()
 assert.equal(await page.locator('.brand-canvas,.pin-spacer').count(),0,'Reduced motion has no GPU scene or pinned journey')
 assert.equal(await page.locator('.brand-resolution').evaluate(el=>getComputedStyle(el).visibility),'visible')
 assert.equal(await page.locator('.reveal-mask').count(),0,'Reduced-motion content stays unsplit and visible')
 await navigate('About')
 assert.equal(await page.locator('.page-transition').evaluate(el=>getComputedStyle(el).display),'none')
 assert.deepEqual(errors,[])
 console.log('PASS: pinned/reversible brand reveal; idle/offscreen WebGL; page transitions; repeated navigation; project details; FAQ; enquiry; mobile menu/overflow; reduced motion.')
}finally{await browser.close()}
