import {chromium} from 'playwright'
import {mkdir,writeFile} from 'node:fs/promises'
import {execFileSync} from 'node:child_process'
import path from 'node:path'
import os from 'node:os'
const root=path.resolve(import.meta.dirname,'..'),dir=path.join(os.tmpdir(),'cefabex-journey-frames')
await mkdir(dir,{recursive:true});await mkdir(path.join(root,'artifacts'),{recursive:true})
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']})
const p=await b.newPage({viewport:{width:1440,height:1000}})
await p.goto(process.env.TARGET_URL||'http://127.0.0.1:4173')
await p.locator('.loader').waitFor({state:'detached',timeout:15000})
const cdp=await p.context().newCDPSession(p),frames=[],writes=[]
cdp.on('Page.screencastFrame',frame=>{const i=frames.length,file=path.join(dir,`${String(i).padStart(5,'0')}.jpg`);frames.push({file,time:frame.metadata.timestamp});writes.push(writeFile(file,Buffer.from(frame.data,'base64')));void cdp.send('Page.screencastFrameAck',{sessionId:frame.sessionId})})
await cdp.send('Page.startScreencast',{format:'jpeg',quality:75,maxWidth:1440,maxHeight:1000,everyNthFrame:2})
await p.waitForFunction(()=>Number(document.querySelector('.cinema-stage').dataset.elapsed)>=40.5,null,{timeout:60000})
await p.waitForTimeout(1000);await cdp.send('Page.stopScreencast');await Promise.all(writes);await b.close()
let list=''
for(let i=0;i<frames.length;i++){list+=`file '${frames[i].file}'\n`;if(i<frames.length-1)list+=`duration ${Math.max(.015,frames[i+1].time-frames[i].time)}\n`}
await writeFile(path.join(dir,'frames.txt'),list)
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',path.join(dir,'frames.txt'),'-fps_mode','vfr','-c:v','libx264','-threads','2','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',path.join(root,'artifacts/journey-preview.mp4')],{timeout:120000})
console.log('Recorded actual timed journey:',frames.length,'frames; artifacts/journey-preview.mp4')
