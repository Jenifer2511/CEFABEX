import {useEffect,useLayoutEffect,useRef,useState} from 'react'
import {useReducedMotion} from 'motion/react'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import gsap from 'gsap'

gsap.registerPlugin(ScrollTrigger)
const chapters=[['Imagine the experience.','Start with the people, the problem and the possibility.'],['Connect the moving parts.','Interfaces, information and engineering working as one.'],['Build what comes next.','A clear product. A useful release. A foundation to grow.']]
export default function ScrollFilm({ready}:{ready:boolean}){
 const ref=useRef<HTMLElement>(null),video=useRef<HTMLVideoElement>(null),progress=useRef(0)
 const [armed,setArmed]=useState(false),[quality,setQuality]=useState(()=>innerWidth<700?'mobile':'1080'),[chapter,setChapter]=useState(0),[failed,setFailed]=useState(false)
 const reduced=Boolean(useReducedMotion())
 useEffect(()=>{if(reduced)return;const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setArmed(true);observer.disconnect()}},{rootMargin:'100%'});if(ref.current)observer.observe(ref.current);return()=>observer.disconnect()},[reduced])
 useLayoutEffect(()=>{
  if(!ready||reduced||!ref.current)return
  const element=ref.current,clip=video.current!
  const seek=()=>{if(clip.readyState>=1&&Number.isFinite(clip.duration)&&!clip.seeking){const target=progress.current*Math.max(0,clip.duration-.06);if(Math.abs(clip.currentTime-target)>.035)clip.currentTime=target}}
  clip.addEventListener('loadedmetadata',seek);clip.addEventListener('seeked',seek)
  const trigger=ScrollTrigger.create({trigger:element,start:'top top',end:'bottom bottom',onRefresh:self=>{element.dataset.scrollStart=String(self.start);element.dataset.scrollEnd=String(self.end)},onUpdate:self=>{progress.current=self.progress;element.dataset.filmProgress=String(self.progress);setChapter(Math.min(2,Math.floor(self.progress*3)));seek()}})
  return()=>{trigger.kill();clip.removeEventListener('loadedmetadata',seek);clip.removeEventListener('seeked',seek)}
 },[ready,reduced])
 return <section ref={ref} className={`scroll-film ${reduced?'is-static':''}`} id="film" data-thread-stop="film" aria-labelledby="film-title">
  <div className="film-stage section-shell">
   <div className="film-heading"><h2 id="film-title">From possibility<br/>to product.</h2><p>A closer look at the digital experiences we imagine, design and engineer.</p></div>
   <div className="film-frame">
    {reduced||failed?<img src="/films/cefabex-software-poster.webp" alt="CEFABEX original software and product motion study"/>:<video ref={video} src={armed?`/films/cefabex-software-${quality}.mp4`:undefined} poster="/films/cefabex-software-poster.webp" preload="auto" muted playsInline aria-label="Software product film controlled by scrolling" onError={()=>setFailed(true)}/>}
    <span className="film-credit">CEFABEX · Original motion study</span>
   </div>
   <div className="film-caption"><div><span className="film-chapter">0{chapter+1} / 03</span><h3>{chapters[chapter][0]}</h3><p>{chapters[chapter][1]}</p></div>{!reduced&&<label className="film-quality">Film quality<select value={quality} onChange={e=>setQuality(e.target.value)}><option value="mobile">720p</option><option value="1080">1080p</option><option value="4k">4K</option></select></label>}</div>
  </div>
 </section>
}
