import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
const artifacts = new URL('../artifacts', import.meta.url).pathname
await mkdir(artifacts, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--enable-webgl', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
const errors = []
page.on('pageerror', error => errors.push(error.message))
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
await page.goto(process.env.TARGET_URL || 'http://127.0.0.1:4173', {waitUntil:'load'})
await page.screenshot({ path: `${artifacts}/loader.png` })
await page.locator('.loader').waitFor({ state: 'detached', timeout: 15000 })
await page.screenshot({ path: `${artifacts}/desktop-hero.png` })
const scenes = await page.locator('.cinema').evaluate(el => ({top:el.offsetTop,range:el.offsetHeight-innerHeight}))
for (const [name, p] of [['phrase-two',.2],['phrase-three',.36],['tunnel',.51],['spiral',.7],['wordmark',.98]]) {
  await page.evaluate(y => window.scrollTo(0,y), scenes.top+scenes.range*p)
  if(p < .46) {
    const phrase = p < .285 ? 'Think beyond.' : 'Build what’s next.'
    await page.waitForFunction(text => {
      const el = document.querySelector('.hero-title')
      return el?.textContent === text && Number(getComputedStyle(el).opacity) > .99 && Number(getComputedStyle(el.parentElement).opacity) > .99
    }, phrase)
  } else await page.waitForTimeout(1600)
  await page.screenshot({path:`${artifacts}/desktop-${name}.png`})
}
await page.getByRole('heading',{ name:'Built around you.' }).scrollIntoViewIfNeeded()
await page.waitForTimeout(900)
await page.screenshot({path:`${artifacts}/desktop-expertise.png`})
await page.getByRole('tab',{name:'Mobile applications'}).click()
await page.getByRole('heading',{name:'A place in someone’s everyday.'}).waitFor()
await page.waitForTimeout(650)
await page.screenshot({path:`${artifacts}/desktop-mobile-tab.png`})
await page.getByRole('button',{name:'Let’s build it'}).click()
await page.getByRole('dialog').waitFor()
await page.getByRole('button',{name:'Prepare enquiry'}).click()
await page.getByText('Please enter your name.').waitFor()
await page.getByLabel('Your name',{exact:true}).fill('Test Visitor')
await page.getByLabel('Email address',{exact:true}).fill('visitor@example.com')
await page.getByLabel('A little about your idea',{exact:true}).fill('We need a thoughtful mobile app for our software business.')
await page.getByRole('button',{name:'Prepare enquiry'}).click()
await page.getByRole('heading',{name:'Your project brief.'}).waitFor()
await page.screenshot({path:`${artifacts}/desktop-brief.png`})
const dl=page.waitForEvent('download')
await page.getByRole('button',{name:'Download brief'}).click()
const download=await dl
console.log('Brief downloaded:',download.suggestedFilename())
await page.keyboard.press('Escape')
await page.getByRole('dialog').waitFor({state:'hidden'})
await page.locator('summary').filter({hasText:'Can you help shape an early idea?'}).click()
await page.getByText('You do not need a finished specification.',{exact:false}).waitFor()
const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)
console.log('Desktop overflow:',overflow,'Console errors:',errors)
for(const width of [768,390]){
 await page.setViewportSize({width,height:844})
 await page.goto(process.env.TARGET_URL || 'http://127.0.0.1:4173')
 await page.locator('.loader').waitFor({state:'detached',timeout:15000})
 await page.screenshot({path:`${artifacts}/${width}-hero.png`})
 await page.getByRole('link',{name:'Skip the journey'}).click()
 await page.waitForTimeout(1800)
 await page.screenshot({path:`${artifacts}/${width}-expertise.png`})
 console.log(width,'overflow:',await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))
 if(width===390){
  await page.evaluate(()=>scrollTo(0,0))
  await page.waitForTimeout(300)
  await page.getByRole('button',{name:'Open menu'}).click()
  await page.waitForTimeout(400)
  await page.screenshot({path:`${artifacts}/mobile-menu.png`})
  await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Our approach'}).click()
  await page.waitForTimeout(1800)
  console.log('Mobile menu navigation y:',await page.evaluate(()=>scrollY))
 }
}
const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'})
await reduced.goto(process.env.TARGET_URL || 'http://127.0.0.1:4173')
console.log('Reduced-motion intro height:',await reduced.locator('.cinema').evaluate(el=>el.offsetHeight))
await reduced.screenshot({path:`${artifacts}/reduced-motion.png`})
await reduced.getByRole('link',{name:'Skip the journey'}).click()
await reduced.screenshot({path:`${artifacts}/reduced-content.png`,fullPage:true})
await browser.close()
if(errors.length || overflow) process.exitCode=1
