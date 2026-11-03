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
import CompanyStory from './components/CompanyStory'
import { chapterAt } from './lib/scene'

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
  const [ready, setReady] = useState(false)
  const [chapter, setChapter] = useState(0)
  const [menu, setMenu] = useState(false)
  const [enquiry, setEnquiry] = useState(false)
  const [service, setService] = useState<string>()
  const progress = useRef(0)
  const sceneRef = useRef<HTMLElement>(null)
  const progressBar = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const complete = useCallback(() => setLoaded(true), [])
  const onReady = useCallback(() => setReady(true), [])
  const openEnquiry = useCallback((type?: string) => { setService(type); setEnquiry(true); setMenu(false) }, [])

  useEffect(() => {
    if (reduced) { setLoaded(true); return }
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
    if (!sceneRef.current || reduced) return
    const trigger = ScrollTrigger.create({
      trigger: sceneRef.current, start: 'top top', end: 'bottom bottom',
      onUpdate: self => {
        progress.current = self.progress
        const next = chapterAt(self.progress)
        setChapter(current => current === next ? current : next)
        progressBar.current?.style.setProperty('transform', `scaleX(${self.progress})`)
      },
    })
    document.fonts.ready.then(() => { ScrollTrigger.refresh() })
    return () => trigger.kill()
  }, [reduced])

  useEffect(() => {
    if (!menu) return
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenu(false); document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus() } }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [menu])

  return <>
    <a className="skip-link" href="#expertise" onClick={complete}>Skip to company information</a>
    <AnimatePresence>{!loaded && !reduced && <Loader ready={ready} onComplete={complete} />}</AnimatePresence>
    <div inert={!loaded}>
      <header className="site-header">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#expertise">Expertise</a><a href="#approach">Our approach</a></nav>
        <button className="project-button" onClick={() => openEnquiry()}>Start a project <ArrowIcon /></button>
        <button className={`menu-toggle ${menu ? 'is-open' : ''}`} aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="mobile-navigation" onClick={() => setMenu(!menu)}><span /><span /></button>
      </header>
      <AnimatePresence>{menu && <motion.nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: .3 }}>
        {['Expertise', 'Our approach', 'Let’s talk'].map((label, i) => <motion.a key={label} href={['#expertise', '#approach', '#contact'][i]} onClick={e => { setMenu(false); if (lenisRef.current) { e.preventDefault(); lenisRef.current.start(); lenisRef.current.scrollTo(['#expertise', '#approach', '#contact'][i], { force: true, offset: -24 }) } }} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * .06, ease: easing }}>{label}<ArrowIcon /></motion.a>)}
        <p>Thoughtful design.<br />Exceptional engineering.</p>
      </motion.nav>}</AnimatePresence>
      <main inert={menu}>
        <section ref={sceneRef} id="top" className={`cinema ${reduced ? 'is-reduced' : ''}`} aria-label="CEFABEX introduction">
          <div className="cinema-stage" data-chapter={chapter}>
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
            <AnimatePresence>{chapter === 3 && !reduced && <motion.div className="spiral-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .6 }}><p>Every possibility.<br />Coming together.</p></motion.div>}</AnimatePresence>
            <AnimatePresence>{chapter === 4 && !reduced && <motion.div className="brand-resolve" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .7 }}><p>Many possibilities. One partner.</p><a className="text-action" href="#company">Meet CEFABEX <ArrowIcon down /></a></motion.div>}</AnimatePresence>
            <div className="cinema-bottom">
              <a className="scroll-prompt" href="#expertise" onClick={e => { if (!reduced && chapter < 3) { e.preventDefault(); const section = sceneRef.current; if (section) lenisRef.current?.scrollTo(section.offsetTop + (section.offsetHeight - innerHeight) * [0.15, .30, .52][chapter], { duration: 1.6 }) } }}><span className="scroll-circle" aria-hidden="true">↓</span><span>{chapter < 3 ? 'Scroll into possibility' : 'Keep going. It gets good.'}</span></a>
              <div className="chapter-indicator" aria-label={`Introduction chapter ${Math.min(chapter + 1, 3)} of 3`}><span className={chapter === 0 ? 'active' : ''} /><span className={chapter === 1 ? 'active' : ''} /><span className={chapter >= 2 ? 'active' : ''} /></div>
              <a className="skip-intro" href="#expertise">Skip the journey <ArrowIcon /></a>
            </div>
            <div className="cinema-progress"><div ref={progressBar} /></div>
          </div>
        </section>
        <CompanyStory />
        <StudioContent onEnquire={openEnquiry} />
      </main>
    </div>
    <ProjectDialog open={enquiry} onClose={() => setEnquiry(false)} initialService={service} />
  </>
}
