/** Re-render the original software studies and native-4K product film. No network requests. */
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import {pathToFileURL} from 'node:url'
import {execFileSync} from 'node:child_process'

const root=path.resolve(import.meta.dirname,'..')
const temp=await fs.mkdtemp(path.join(os.tmpdir(),'cefabex-film-'))
const output=path.join(root,'public/editorial')
const stillsOnly=process.argv.includes('--stills-only')
const requested=process.argv.find(arg=>arg.startsWith('--only='))?.slice(7).split(',')
const studies=[['product-system',1,1],['mobile-experience',11,1],['data-platform',9,1],['web-experience',6,1],['commerce-experience',5,5],['cloud-delivery',13,1]]
const selected=requested?studies.filter(([name])=>requested.includes(name)):studies
if(requested&&!stillsOnly)throw Error('--only requires --stills-only; the complete film needs all source studies.')
if(!selected.length)throw Error('No matching studies requested.')
await fs.mkdir(output,{recursive:true})
try{
 const source=await fs.readFile(path.join(root,'scripts/generate-assets.mjs'),'utf8')
 const marker='const browser = await chromium.launch'
 if(!source.includes(marker))throw Error('The source generator structure changed; update the extraction marker.')
 let prefix=source.slice(0,source.indexOf(marker))
 prefix=prefix.replace("from 'playwright'",`from ${JSON.stringify(pathToFileURL(path.join(root,'node_modules/playwright/index.mjs')).href)}`)
 prefix=prefix.replace("const root = path.resolve(import.meta.dirname, '..')",`const root = ${JSON.stringify(root)}`)
 prefix=prefix.replace("const out = path.join(root, 'public/images')",`const out = ${JSON.stringify(output)}`)
 const render=prefix+`
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']})
const page=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:3})
try{
 for(const [name,family,v] of ${JSON.stringify(selected)}){
  const p=['#f3f3ed','#152927','#9bc8b9','#e4e9e3','#667971']
  const html='<!doctype html><html><head><style>:root{--bg:'+p[0]+';--ink:'+p[1]+';--accent:'+p[2]+';--surface:'+p[3]+';--muted:'+p[4]+'}'+css+'</style></head><body>'+templates[family](v)+'</body></html>'
  await page.setContent(html);await page.evaluate(()=>document.fonts.ready)
  await page.screenshot({path:path.join(${JSON.stringify(temp)},name+'.png')})
  console.log('Rendered native 3840px',name)
 }
}finally{await browser.close()}
`
 const script=path.join(temp,'render-sources.mjs')
 await fs.writeFile(script,render)
 execFileSync(process.execPath,[script],{stdio:'inherit'})
 execFileSync('python3',['-c',`from PIL import Image
from pathlib import Path
import sys
for p in Path(sys.argv[1]).glob('*.png'):
 Image.open(p).convert('RGB').save(Path(sys.argv[2])/(p.stem+'.webp'),quality=90)
`,temp,output],{stdio:'inherit'})
 if(!stillsOnly){
  execFileSync('python3',[path.join(root,'scripts/render-product-film.py'),root,temp],{stdio:'inherit'})
  const films=path.join(root,'public/films')
  for(const [name,size,crf] of [['1080','1920:1080','23'],['mobile','1280:720','24']]){
   execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',path.join(films,'cefabex-software-4k.mp4'),'-vf',`scale=${size}`,'-an','-c:v','libx264','-preset','fast','-crf',crf,'-pix_fmt','yuv420p','-g','1','-movflags','+faststart',path.join(films,`cefabex-software-${name}.mp4`)],{stdio:'inherit'})
  }
 }
}finally{await fs.rm(temp,{recursive:true,force:true})}
