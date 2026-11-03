import { useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const

const services = [
  {
    name: 'Web experiences',
    title: 'Make your first impression count.',
    description: 'Considered design. Fast, accessible development. Websites that express who you are and make the next step feel natural.',
    detail: 'Company websites · Ecommerce · Web applications',
    image: '/images/web-preview.webp',
    alt: 'Original CEFABEX exploration of a carefully composed web interface',
  },
  {
    name: 'Mobile applications',
    title: 'A place in someone’s everyday.',
    description: 'From the first tap to the smallest interaction, we design and develop apps that feel useful, familiar and easy to return to.',
    detail: 'iOS & Android · Cross platform · Product design',
    image: '/images/mobile-preview.webp',
    alt: 'Original CEFABEX exploration of a mobile application interface',
  },
  {
    name: 'Custom software',
    title: 'Built for the way you work.',
    description: 'Tools that connect the moving parts of your business. We turn complicated processes into clear, dependable digital products.',
    detail: 'Business platforms · Integrations · Internal tools',
    image: '/images/software-preview.webp',
    alt: 'Original CEFABEX exploration of a custom software workspace',
  },
]

const questions = [
  ['What can we build together?', 'We design and develop company websites, ecommerce experiences, mobile applications and custom software. If your idea sits between those categories, we can help define the right direction.'],
  ['Can you help shape an early idea?', 'Yes. We can start with a conversation about the people you want to reach, the problem you want to solve and what a useful first release looks like. You do not need a finished specification.'],
  ['Can you work on an existing product?', 'Yes. We can review the experience and technical foundations, then agree on the work that will make the most useful difference. That might mean a focused improvement or a broader redesign.'],
  ['How do you choose the technology?', 'We choose tools around your product, your team and how it needs to grow. We discuss the options and tradeoffs before committing to an approach.'],
  ['How are timing and cost agreed?', 'Both depend on the scope and complexity of the project. After understanding the work, we propose clear deliverables, a realistic schedule and a cost for you to review.'],
  ['What happens after launch?', 'We discuss handover, documentation and ongoing support as part of the project scope. Your product should have a clear next chapter after it goes live.'],
]

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" className={diagonal ? 'studio-arrow diagonal' : 'studio-arrow'}><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8, delay, ease }}>{children}</motion.div>
}

function Tagline() {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const text = 'Good software starts with people. And grows with you.'
  const words = text.split(' ')
  return <p className="studio-manifesto" ref={ref} aria-label={text}>
    {words.map((word, index) => <ManifestoWord key={`${index}-${word}`} word={word} index={index} count={words.length} progress={scrollYProgress} reduced={Boolean(reduced)} />)}
  </p>
}

function ManifestoWord({ word, index, count, progress, reduced }: { word: string; index: number; count: number; progress: ReturnType<typeof useScroll>['scrollYProgress']; reduced: boolean }) {
  const opacity = useTransform(progress, [index / (count + 2), (index + 2) / (count + 2)], [0.28, 1])
  return <motion.span aria-hidden="true" style={reduced ? { opacity: 1 } : { opacity }}>{word}{' '}</motion.span>
}

export default function StudioContent({ onEnquire }: { onEnquire: (service?: string) => void }) {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const reduced = useReducedMotion()
  const service = services[active]

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % services.length
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + services.length - 1) % services.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = services.length - 1
    else return
    event.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return <>
    <section className="studio-expertise section-shell" id="expertise" aria-labelledby="expertise-title">
      <div className="studio-section-intro">
        <Reveal><h2 id="expertise-title">Built around you.</h2></Reveal>
        <Reveal delay={0.1}><p>Not another template. Your ambition, translated into software that feels right.</p></Reveal>
      </div>
      <div className="studio-expertise-layout">
        <div className="studio-service-copy">
          <div className="studio-service-tabs" role="tablist" aria-label="Explore our expertise" aria-orientation="vertical">
            {services.map((item, index) => <button key={item.name} id={`service-tab-${index}`} ref={(node) => { tabRefs.current[index] = node }} role="tab" aria-selected={active === index} aria-controls="service-panel" tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => handleTabKey(event, index)} className={`studio-service-tab ${active === index ? 'is-active' : ''}`}><span>{item.name}</span><Arrow diagonal /></button>)}
          </div>
          <div role="tabpanel" id="service-panel" aria-labelledby={`service-tab-${active}`} tabIndex={0} className="studio-service-panel">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -8 }} transition={{ duration: 0.25, ease }}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <p className="studio-service-detail">{service.detail}</p>
              </motion.div>
            </AnimatePresence>
            <button className="studio-text-link" onClick={() => onEnquire(service.name)}>Let’s build it <Arrow /></button>
          </div>
        </div>
        <div className={`studio-preview studio-preview-${active}`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure key={active} initial={reduced ? false : { opacity: 0, scale: 0.96, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: reduced ? 1 : 1.02 }} transition={{ duration: 0.5, ease }}>
              <img src={service.image} alt={service.alt} loading="lazy" width="1200" height="800" />
              <figcaption>Interface explorations by CEFABEX</figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>
    </section>

    <section className="studio-approach section-shell" id="approach" aria-labelledby="approach-title">
      <div className="studio-approach-top">
        <Reveal><h2 id="approach-title">From idea.<br />To everyday.</h2></Reveal>
        <Reveal delay={0.1}><Tagline /></Reveal>
      </div>
      <ol className="studio-process">
        <li><Reveal><h3>First, we listen.</h3><p>We get close to your idea, your audience and the problem worth solving. Together, we decide what matters most.</p></Reveal></li>
        <li><Reveal delay={0.08}><h3>Then, we make it real.</h3><p>We explore, prototype and build. Design and engineering work together, with you in the conversation at every stage.</p></Reveal></li>
        <li><Reveal delay={0.16}><h3>And keep it moving.</h3><p>We test the details, prepare for launch and plan what comes next. The goal is a useful product with room to grow.</p></Reveal></li>
      </ol>
    </section>

    <section className="studio-faq section-shell" aria-labelledby="faq-title">
      <Reveal><h2 id="faq-title">Good questions.</h2><p className="studio-faq-intro">A little clarity before we get started.</p></Reveal>
      <div className="studio-questions">
        {questions.map(([question, answer]) => <details key={question}><summary>{question}<span className="studio-plus" aria-hidden="true">+</span></summary><p>{answer}</p></details>)}
      </div>
    </section>

    <section className="studio-contact section-shell" id="contact" aria-labelledby="contact-title">
      <Reveal><h2 id="contact-title">Have a good idea?</h2></Reveal>
      <div className="studio-contact-bottom"><Reveal><p>Innovation begins with a conversation.</p></Reveal><button className="studio-contact-button" onClick={() => onEnquire()}>Start a project <Arrow diagonal /></button></div>
    </section>
    <footer className="studio-footer section-shell">
      <div className="studio-footer-top"><p>Tamil Nadu, India.<br />Innovation. Engineering. Growth.</p><a href="#top" className="studio-text-link">Back to the beginning <Arrow diagonal /></a></div>
      <p className="studio-footer-wordmark">CEFABEX</p><div className="company-socials"><a href="https://www.instagram.com/cefabex.cfb" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.linkedin.com/company/cefabex-innovations/" target="_blank" rel="noreferrer">LinkedIn</a></div>
      <div className="studio-footer-bottom"><p>© {new Date().getFullYear()} CEFABEX</p><p><a href="mailto:cefabex.cfb@gmail.com">cefabex.cfb@gmail.com</a> · <a href="tel:+919699371766">+91 96993 71766</a></p><button className="studio-footer-contact" onClick={() => onEnquire()}>Let’s talk <Arrow diagonal /></button></div>
    </footer>
  </>
}
