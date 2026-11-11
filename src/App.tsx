import {useState} from 'react'
import {Header, Footer, projects} from './CompanyPages'
import ProjectDialog from './components/ProjectDialog'
import ArrowIcon from './components/ArrowIcon'

const services = [
 ['Web design & engineering', 'Fast, accessible websites and applications, from the first design to cloud deployment.'],
 ['CAD & automation', 'Precision 2D and 3D models that turn engineering drafts into practical designs.'],
 ['Digital marketing & strategy', 'Search optimization, brand development and campaigns built around your business.'],
 ['IoT & project development', 'Connected hardware, engineering prototypes and guidance for student projects.'],
 ['Career infrastructure', 'Considered resumes and digital portfolios for your next professional step.'],
]
const steps = [
 ['Understand', 'We discuss your idea, your audience and the problem to solve, then agree on a clear scope.'],
 ['Design & build', 'Design and engineering work together, with regular reviews and practical decisions.'],
 ['Launch & support', 'We test the details, prepare the handover and agree on the support you need next.'],
]
const questions = [
 ['Can you help shape an early idea?', 'Yes. We can start with your audience, the problem you want to solve and what a useful first release looks like. You do not need a finished specification.'],
 ['Can you improve an existing product?', 'Yes. We review the experience and technical foundations, then agree on focused improvements or a broader redesign.'],
 ['How are timing and cost agreed?', 'After understanding the scope and complexity, we propose clear deliverables, a realistic schedule and a cost for you to review.'],
 ['What happens after launch?', 'We discuss handover, documentation and ongoing support as part of the project scope.'],
]

export default function App(){
 const [enquiry,setEnquiry]=useState(false)
 return <>
  <a className="skip-link" href="#main">Skip to content</a>
  <Header path=""/>
  <main id="main" className="simple-home">
   <section className="simple-hero" id="top">
    <div><h1>Ideas into impact.</h1><p>We bring design and engineering together to build thoughtful websites, software and connected products.</p><button className="project-button" onClick={()=>setEnquiry(true)}>Start a project <ArrowIcon/></button><a className="simple-secondary" href="/projects">Explore our work <ArrowIcon/></a></div>
    <figure><img src="/company/iot.webp" alt="CEFABEX connected hardware and laptop project" width="480" height="420"/><figcaption>Engineering ideas into working products.</figcaption></figure>
   </section>
   <section className="simple-about simple-section" id="company"><h2>One team.<br/>From idea to delivery.</h2><div><p>CEFABEX brings research, entrepreneurial thinking and engineering together to turn meaningful ideas into practical ventures.</p><p>Based in Tamil Nadu, India, our innovation and growth teams connect technical exploration with digital delivery.</p><a className="studio-text-link" href="/about">Meet CEFABEX <ArrowIcon/></a></div></section>
   <section className="simple-section" id="expertise"><div className="simple-section-heading"><h2>How we can help.</h2><a className="studio-text-link" href="/services">All services <ArrowIcon/></a></div><div className="simple-services">{services.map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
   <section className="simple-section simple-work" id="work"><div className="simple-section-heading"><h2>Work in practice.</h2><a className="studio-text-link" href="/projects">All projects <ArrowIcon/></a></div><div className="simple-projects">{projects.slice(0,3).map(p=><a href={`/projects/${p.slug}`} key={p.slug}><img src={`/company/${p.image}.webp`} alt={p.caption} loading="lazy" width="640" height="480"/><h3>{p.title}</h3><p>{p.type}</p><span className="studio-text-link">View project <ArrowIcon/></span></a>)}</div></section>
   <section className="simple-section simple-approach" id="approach"><h2>A clear path forward.</h2><ol>{steps.map(([title,text])=><li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol></section>
   <section className="simple-section simple-faq" id="questions"><h2>Before we begin.</h2><div className="studio-questions">{questions.map(([question,answer])=><details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>
  </main>
  <Footer/>
  <ProjectDialog open={enquiry} onClose={()=>setEnquiry(false)}/>
 </>
}
