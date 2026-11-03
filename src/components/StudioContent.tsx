import ScrollHeading from './ScrollHeading'
import ExpertiseJourney from './ExpertiseJourney'
import type {ScrollToPosition} from './ExpertiseJourney'
import SelectedWork from './SelectedWork'
import ArrowIcon from './ArrowIcon'
import ScrollFilm from './ScrollFilm'
import AmbientSignal from './AmbientSignal'
import {CapabilityIndex,CompanyProof} from './CompanyDepth'

const questions=[
 ['What can we build together?','We design and develop company websites, ecommerce experiences, mobile applications and custom software. If your idea sits between those categories, we can help define the right direction.'],
 ['Can you help shape an early idea?','Yes. We can start with a conversation about the people you want to reach, the problem you want to solve and what a useful first release looks like. You do not need a finished specification.'],
 ['Can you work on an existing product?','Yes. We can review the experience and technical foundations, then agree on the work that will make the most useful difference. That might mean a focused improvement or a broader redesign.'],
 ['How do you choose the technology?','We choose tools around your product, your team and how it needs to grow. We discuss the options and tradeoffs before committing to an approach.'],
 ['How are timing and cost agreed?','Both depend on the scope and complexity of the project. After understanding the work, we propose clear deliverables, a realistic schedule and a cost for you to review.'],
 ['What happens after launch?','We discuss handover, documentation and ongoing support as part of the project scope. Your product should have a clear next chapter after it goes live.'],
]
const steps=[
 {title:'First, we listen.',text:'We get close to your idea, your audience and the problem worth solving. Together, we decide what matters most.'},
 {title:'Then, we make it real.',text:'We explore, prototype and build. Design and engineering work together, with you in the conversation at every stage.'},
 {title:'And keep it moving.',text:'We test the details, prepare for launch and plan what comes next. The goal is a useful product with room to grow.'},
]
const manifesto='Good software starts with people. And grows with you.'

export default function StudioContent({onEnquire,onScrollTo,ready}:{onEnquire:(service?:string)=>void;onScrollTo:ScrollToPosition;ready:boolean}){
 return <>
  <ExpertiseJourney ready={ready} onEnquire={onEnquire} onScrollTo={onScrollTo}/>
  <ScrollFilm ready={ready}/>
  <CapabilityIndex onEnquire={onEnquire}/>
  <section className="manifesto-journey section-shell" aria-label="Our philosophy">
   <div className="manifesto-content"><p className="studio-manifesto" aria-label={manifesto}>{manifesto.split(' ').map((word,i)=><span className="manifesto-word" aria-hidden="true" key={i}>{word}{' '}</span>)}</p><p className="manifesto-note" data-scroll-copy="">Thoughtful design meets practical engineering.</p></div>
  </section>
  <SelectedWork onScrollTo={onScrollTo}/>
  <AmbientSignal/>
  <CompanyProof onEnquire={onEnquire}/>
  <section className="process-journey" id="approach" data-thread-stop="process" aria-labelledby="approach-title" data-active-step="0">
   <div className="process-stage section-shell">
    <div className="process-intro"><ScrollHeading text="From idea to everyday." id="approach-title"/><div className="process-counter" aria-hidden="true">{['01','02','03'].map((n,i)=><span className={`process-digit ${i===0?'is-current':''}`} key={n}>{n}</span>)}</div><p data-scroll-copy="">A shared direction. Every step of the way.</p></div>
    <div className="process-steps-wrap"><span className="process-line" aria-hidden="true"><span/></span><ol className="process-steps">{steps.map((step,i)=><li key={step.title}><span className="process-step-number" aria-hidden="true">0{i+1}</span><div className="process-step-copy"><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol></div>
   </div>
  </section>
  <section className="studio-faq section-shell" id="questions" data-thread-stop="questions" aria-labelledby="faq-title">
   <div><ScrollHeading text="Good questions." id="faq-title"/><p className="studio-faq-intro" data-scroll-copy="">A little clarity before we get started.</p></div>
   <div className="studio-questions">{questions.map(([question,answer])=><details key={question}><summary>{question}<span className="studio-plus" aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
  </section>
  <section className="studio-contact section-shell" id="contact" data-thread-stop="contact" aria-labelledby="contact-title">
   <ScrollHeading text="Have a good idea?" id="contact-title"/>
   <div className="studio-contact-bottom"><p data-scroll-copy="">Innovation begins with a conversation.</p><button className="studio-contact-button" onClick={()=>onEnquire()}>Start a project <ArrowIcon/></button></div>
  </section>
  <footer className="studio-footer section-shell">
   <div className="studio-footer-top"><p>Tamil Nadu, India.<br/>Innovation. Engineering. Growth.</p><a href="#top" className="studio-text-link">Back to the beginning <ArrowIcon/></a></div>
   <p className="studio-footer-wordmark" aria-label="CEFABEX">{'CEFABEX'.split('').map((letter,i)=><span className="footer-letter" aria-hidden="true" key={i}>{letter}</span>)}</p>
   <div className="company-socials"><a href="https://www.instagram.com/cefabex.cfb" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.linkedin.com/company/cefabex-innovations/" target="_blank" rel="noreferrer">LinkedIn</a></div>
   <div className="studio-footer-bottom"><p>© {new Date().getFullYear()} CEFABEX</p><p><a href="mailto:cefabex.cfb@gmail.com">cefabex.cfb@gmail.com</a> · <a href="tel:+919699371766">+91 96993 71766</a></p><button className="studio-footer-contact" onClick={()=>onEnquire()}>Let’s talk <ArrowIcon/></button></div>
  </footer>
 </>
}
