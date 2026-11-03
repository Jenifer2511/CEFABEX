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
  const previouslyLoaded=useRef(sessionStorage.getItem('cefabex-ready')==='1')
  const [loaded, setLoaded] = useState(previouslyLoaded.current)
  const [started,setStarted]=useState(previouslyLoaded.current)
  const [ready, setReady] = useState(false)
  const [chapter, setChapter] = useState(0)
  const [paused,setPaused]=useState(false)
  const [elapsed,setElapsed]=useState(0)
  const [menu, setMenu] = useState(false)
  const [enquiry, setEnquiry] = useState(false)
  const [service, setService] = useState<string>()
  const progress = useRef(0)
  const sceneRef = useRef<HTMLElement>(null)
  const progressBar = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const complete = useCallback(() => {sessionStorage.setItem('cefabex-ready','1');setLoaded(true)}, [])
  const onReady = useCallback(() => setReady(true), [])
  const openEnquiry = useCallback((type?: string) => { setService(type); setEnquiry(true); setMenu(false) }, [])

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
    let visible=true,last=performance.now(),uiTime=-1
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;last=performance.now()},{threshold:.2})
    observer.observe(sceneRef.current)
    const tick=()=>{
      const now=performance.now(),dt=(now-last)/1000;last=now
      if(paused||menu||enquiry||document.hidden||!visible)return
      progress.current=Math.min(JOURNEY.duration,progress.current+dt)
      setChapter(current=>{const next=journeyChapter(progress.current);return current===next?current:next})
      const rounded=Math.floor(progress.current*2)/2
      if(rounded!==uiTime){uiTime=rounded;setElapsed(rounded)}
      progressBar.current?.style.setProperty('transform',`scaleX(${progress.current/JOURNEY.duration})`)
    }
    const visibility=()=>{last=performance.now()}
    document.addEventListener('visibilitychange',visibility)
    gsap.ticker.add(tick)
    return()=>{document.removeEventListener('visibilitychange',visibility);gsap.ticker.remove(tick);observer.disconnect()}
  },[reduced,loaded,started,paused,menu,enquiry])

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
        <nav className="desktop-nav" aria-label="Main navigation"><a href="/about">About</a><a href="/services">Services</a><a href="/projects">Projects</a><a href="/contact">Contact</a></nav>
        <button className="project-button" onClick={() => openEnquiry()}>Start a project <ArrowIcon /></button>
        <button className={`menu-toggle ${menu ? 'is-open' : ''}`} aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="mobile-navigation" onClick={() => setMenu(!menu)}><span /><span /></button>
      </header>
      <AnimatePresence>{menu && <motion.nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: .3 }}>
        {['About', 'Services', 'Projects', 'Contact'].map((label, i) => <motion.a key={label} href={['/about', '/services', '/projects', '/contact'][i]} onClick={() => setMenu(false)} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * .06, ease: easing }}>{label}<ArrowIcon /></motion.a>)}
        <p>Thoughtful design.<br />Exceptional engineering.</p>
      </motion.nav>}</AnimatePresence>
      <main inert={menu}>
        <section ref={sceneRef} id="top" className={`cinema timed-cinema ${reduced ? 'is-reduced' : ''}`} aria-label="CEFABEX introduction">
          <div className="cinema-stage" data-chapter={chapter} data-elapsed={elapsed} data-phase={journeyPhase(elapsed)}>
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
              {!reduced ? <div className="journey-controls"><button className="journey-toggle" onClick={()=>{if(progress.current>=JOURNEY.duration){progress.current=0;setElapsed(0);setChapter(0);setPaused(false)}else setPaused(!paused)}}>{elapsed>=JOURNEY.duration?'Replay journey':paused?'Play journey':'Pause journey'}</button><span className="journey-time">{Math.floor(elapsed)} / {JOURNEY.duration}s</span></div> : <a className="text-action" href="#company">Explore CEFABEX <ArrowIcon down/></a>}
              <div className="chapter-indicator" aria-label={`Introduction chapter ${Math.min(chapter + 1, 3)} of 3`}><span className={chapter === 0 ? 'active' : ''} /><span className={chapter === 1 ? 'active' : ''} /><span className={chapter >= 2 ? 'active' : ''} /></div>
              <a className="skip-intro" href="#company">Skip the journey <ArrowIcon /></a>
            </div>
            <div className="cinema-progress"><div ref={progressBar} /></div>
          </div>
        </section>
        <CompanyStory />
        <StudioContent onEnquire={openEnquiry} /><SiteLinks/>
      </main>
    </div>
    <ProjectDialog open={enquiry} onClose={() => setEnquiry(false)} initialService={service} />
  </>
}
