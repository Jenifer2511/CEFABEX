import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import GalleryTunnel from './components/GalleryTunnel'
import Loader from './components/Loader'
import StudioContent from './components/StudioContent'
import ProjectDialog from './components/ProjectDialog'
import ArrowIcon from './components/ArrowIcon'
import {SiteLinks} from './CompanyPages'
import CompanyStory from './components/CompanyStory'
import {JOURNEY,journeyChapter,journeyPhase} from './lib/journey'
import HomeScrollMotion from './components/HomeScrollMotion'
import CapabilityCarousel from './components/CapabilityCarousel'
import StoryThread from './components/StoryThread'

gsap.registerPlugin(ScrollTrigger)
const phrases = [
  { title: 'Let’s start.', detail: 'With a spark. A question. An idea worth building.' },
  { title: 'Think beyond.', detail: 'The familiar. The expected. The way it’s always been.' },
  { title: 'Build what’s next.', detail: 'Thoughtfully designed. Beautifully engineered.' },
]
const easing = [.22, 1, .36, 1] as const

function Brand() {
  return <a href="#top" className="brand" aria-label="CEFABEX home"><img className="company-logo" src="/company/logo.webp" alt="CEFABEX" width="110" height="74" /></a>
}

export default function App() {
  const reduced = Boolean(useReducedMotion())
  const [loaded, setLoaded] = useState(false)
  const [started,setStarted]=useState(false)
  const [ready, setReady] = useState(false)
  const [chapter, setChapter] = useState(0)
  const [menu, setMenu] = useState(false)
  const [enquiry, setEnquiry] = useState(false)
  const [service, setService] = useState<string>()
  const progress = useRef(0)
  const sceneRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const chapterRef=useRef(0)
  const progressBar = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const complete = useCallback(() => setLoaded(true), [])
  const onReady = useCallback(() => setReady(true), [])
  const openEnquiry = useCallback((type?: string) => { setService(type); setEnquiry(true); setMenu(false) }, [])
  const scrollToPosition=useCallback((position:number,immediate=false)=>{
    if(lenisRef.current)lenisRef.current.scrollTo(position,{duration:1.1,immediate})
    else window.scrollTo({top:position,behavior:'instant'})
  },[])

  useEffect(() => {
    if (reduced) { setLoaded(true);setStarted(true); return }
    // The loader remains escapable, even if a graphics driver or asset stalls.
    const timeout = setTimeout(() => setReady(true), 7000)
    return () => clearTimeout(timeout)
  }, [reduced])

  useEffect(() => {
    document.body.style.overflow = !loaded || menu || enquiry ? 'hidden' : ''
    const lenis = lenisRef.current
    if (!loaded || menu || enquiry) lenis?.stop()
    else lenis?.start()
    return () => { document.body.style.overflow = '' }
  }, [loaded, menu, enquiry])

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -80, duration: 1.4 } })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const ticker = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(ticker)
    if (!loaded) lenis.stop()
    return () => { gsap.ticker.remove(ticker); lenis.destroy(); lenisRef.current = null }
    // Stable smooth-scroll instance; loader/menu effects start and stop it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  useEffect(() => {
    if (!sceneRef.current || reduced || !loaded || !started) return
    const update=(value:number)=>{
      progress.current=value*JOURNEY.span
      const stage=stageRef.current
      if(stage){stage.dataset.journeyPosition=String(progress.current);stage.dataset.scrollProgress=String(value);stage.dataset.phase=journeyPhase(progress.current)}
      const next=journeyChapter(progress.current)
      if(next!==chapterRef.current){chapterRef.current=next;setChapter(next)}
      progressBar.current?.style.setProperty('transform',`scaleX(${value})`)
    }
    const trigger=ScrollTrigger.create({trigger:sceneRef.current,start:'top top',end:'bottom bottom',onUpdate:self=>update(self.progress),onRefresh:self=>update(self.progress)})
    document.fonts.ready.then(()=>ScrollTrigger.refresh())
    return()=>trigger.kill()
  },[reduced,loaded,started])

  useEffect(() => {
    if (!menu) return
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenu(false); document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus() } }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [menu])

  return <>
    <a className="skip-link" href="#expertise" onClick={complete}>Skip to company information</a>
    <AnimatePresence onExitComplete={()=>setStarted(true)}>{!loaded && !reduced && <Loader ready={ready} onComplete={complete} />}</AnimatePresence>
    <div inert={!loaded}>
      <header className="site-header">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#top" aria-current="page">Home</a><a href="/about">About</a><a href="/services">Services</a><a href="/projects">Projects</a><a href="/contact">Contact</a></nav>
        <button className="project-button" onClick={() => openEnquiry()}>Start a project <ArrowIcon /></button>
        <button className={`menu-toggle ${menu ? 'is-open' : ''}`} aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="mobile-navigation" onClick={() => setMenu(!menu)}><span /><span /></button>
      </header>
      <AnimatePresence>{menu && <motion.nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: .3 }}>
        {['Home', 'About', 'Services', 'Projects', 'Contact'].map((label, i) => <motion.a key={label} href={['#top', '/about', '/services', '/projects', '/contact'][i]} onClick={() => setMenu(false)} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * .06, ease: easing }}>{label}<ArrowIcon /></motion.a>)}
        <p>Thoughtful design.<br />Exceptional engineering.</p>
      </motion.nav>}</AnimatePresence>
      <main inert={menu} data-homepage="">
        <section ref={sceneRef} id="top" className={`cinema scroll-cinema ${reduced ? 'is-reduced' : ''}`} aria-label="CEFABEX introduction">
          <div ref={stageRef} className="cinema-stage" data-chapter={chapter} data-journey-position="0" data-scroll-progress="0" data-phase="tunnel">
            <GalleryTunnel progress={progress} reduced={reduced} onReady={onReady} />
            <div className="hero-center">
              <h1 className="sr-only">CEFABEX. Websites, apps and software. Build what comes next.</h1>
              <AnimatePresence mode="wait">
                {(chapter < 3 || reduced) && <motion.div key={reduced ? 'reduced' : chapter} className="phrase" initial={false} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} exit={{ y: -28, opacity: 0, filter: 'blur(5px)' }} transition={{ duration: .48, ease: easing }}>
                  <motion.p className="hero-title" aria-hidden="true" key={`title-${chapter}`} initial={loaded ? { y: 32, opacity: 0 } : false} animate={{ y: 0, opacity: 1 }} transition={{ duration: .8, ease: easing }}>{reduced ? 'Build what’s next.' : phrases[chapter].title}</motion.p>
                  <p className="hero-description">We turn ambitious ideas into<br className="desktop-break" /> thoughtful websites, apps & software.</p>
                  <p className="phrase-detail">{reduced ? phrases[2].detail : phrases[chapter].detail}</p>
                </motion.div>}
              </AnimatePresence>
            </div>
            <AnimatePresence>{chapter === 3 && !reduced && <motion.div className="spiral-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .6 }}><p>A thousand possibilities.<br />One continuous thread.</p></motion.div>}</AnimatePresence>
            <AnimatePresence>{chapter === 4 && !reduced && <motion.div className="brand-resolve" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .7 }}><p>Many possibilities. One partner.</p><a className="text-action" href="#company">Meet CEFABEX <ArrowIcon down /></a></motion.div>}</AnimatePresence>
            <div className="cinema-bottom">
              <a className="scroll-prompt" href="#company"><span className="scroll-circle" aria-hidden="true">↓</span><span>Scroll to explore</span></a>
              <div className="chapter-indicator" aria-label={`Introduction chapter ${Math.min(chapter + 1, 3)} of 3`}><span className={chapter === 0 ? 'active' : ''} /><span className={chapter === 1 ? 'active' : ''} /><span className={chapter >= 2 ? 'active' : ''} /></div>
              <a className="skip-intro" href="#company">Skip the journey <ArrowIcon /></a>
            </div>
            <div className="cinema-progress"><div ref={progressBar} /></div>
          </div>
        </section>
        <CapabilityCarousel ready={loaded&&started} onScrollTo={scrollToPosition} onEnquire={openEnquiry}/>
        <CompanyStory />
        <StudioContent ready={loaded&&started} onEnquire={openEnquiry} onScrollTo={scrollToPosition} /><SiteLinks/>
        <HomeScrollMotion ready={loaded&&started}/>
        <StoryThread ready={loaded&&started}/>
      </main>
    </div>
    <ProjectDialog open={enquiry} onClose={() => setEnquiry(false)} initialService={service} />
  </>
}
