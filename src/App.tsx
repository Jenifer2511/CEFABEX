import {useState} from 'react'
import {Header,Footer,projects} from './CompanyPages'
import ProjectDialog from './components/ProjectDialog'
import ArrowIcon from './components/ArrowIcon'
import BrandJourney from './components/BrandJourney'
import PremiumScrollMotion from './components/PremiumScrollMotion'
import {PremiumMotionProvider,SceneTitle,ProjectTeaser,Question} from './components/PremiumElements'

const services=[
 ['Web design & engineering','Digital experiences built to work beautifully, from the first interaction to cloud deployment.','Websites · Applications · Cloud'],
 ['CAD & automation','Precise 2D and 3D models that move an engineering idea closer to the real world.','Modeling · Drafting · Automation'],
 ['Digital strategy','Search, brand development and considered campaigns that connect your work with the right people.','Search · Brand · Campaigns'],
 ['IoT & connected products','Hardware, software and practical prototypes that bring physical and digital systems together.','Connected systems · Prototypes'],
 ['Career infrastructure','Resumes and digital portfolios that give your next professional step a clear presentation.','Resumes · Portfolios'],
]
const steps=[
 ['Understand','A good beginning is a better question. We explore your idea, your audience and the problem worth solving.'],
 ['Design & build','Thinking becomes tangible. Design and engineering develop together, with regular reviews and clear decisions.'],
 ['Launch & support','The details make the difference. We test, prepare the handover and agree on the support you need next.'],
]
const questions=[
 ['Can you help shape an early idea?','Yes. We can start with your audience, the problem you want to solve and what a useful first release looks like. You do not need a finished specification.'],
 ['Can you improve an existing product?','Yes. We review the experience and technical foundations, then agree on focused improvements or a broader redesign.'],
 ['How are timing and cost agreed?','After understanding the scope and complexity, we propose clear deliverables, a realistic schedule and a cost for you to review.'],
 ['What happens after launch?','We discuss handover, documentation and ongoing support as part of the project scope.'],
]
const statement='We connect research, entrepreneurial thinking and engineering to turn meaningful ideas into practical ventures.'
export default function App(){
 const [enquiry,setEnquiry]=useState(false)
 return <PremiumMotionProvider>
  <a className="skip-link" href="#company">Skip to content</a><Header path=""/>
  <main id="main" className="simple-home premium-home">
   <BrandJourney onEnquire={()=>setEnquiry(true)}/>
   <section className="simple-about simple-section" id="company">
    <div className="about-heading"><p className="section-caption">The company</p><SceneTitle lines={['One team.', 'A wider perspective.']}/></div>
    <figure className="about-portrait"><img src="/company/journey.webp" alt="The CEFABEX founders’ journey, from the supplied company profile" width="1000" height="700" loading="lazy"/><figcaption>Curiosity is where it begins.</figcaption></figure>
    <div className="about-statement"><p className="manifesto-text"><span className="sr-only">{statement}</span>{statement.split(' ').map((word,i)=><span aria-hidden="true" className="manifesto-word" key={i}>{word} </span>)}</p><p className="about-location">Based in Tamil Nadu, India.<br/>Built around ideas with a future.</p><a className="studio-text-link" href="/about">Meet CEFABEX <ArrowIcon/></a></div>
   </section>
   <section className="simple-section premium-expertise" id="expertise"><div className="simple-section-heading"><div><p className="section-caption">Connected expertise</p><SceneTitle lines={['Different disciplines.', 'One shared ambition.']}/></div><a className="studio-text-link" href="/services">Explore our services <ArrowIcon/></a></div><div className="simple-services">{services.map(([title,text,tags],i)=><article key={title}><span className="service-index" aria-hidden="true">{String(i+1).padStart(2,'0')}</span><h3>{title}</h3><div><p>{text}</p><p className="service-tags">{tags}</p></div><a href="/services" aria-label={`Explore ${title}`}><ArrowIcon/></a></article>)}</div></section>
   <section className="simple-section simple-work" id="work"><div className="work-stage"><div className="simple-section-heading"><div><p className="section-caption">Ideas in the world</p><SceneTitle lines={['Possibility, in practice.']}/></div><div className="work-header-actions"><a className="studio-text-link" href="/projects">All project areas <ArrowIcon/></a><div className="work-navigation" role="group" aria-label="Project gallery"><button type="button" data-work-direction="-1" className="work-previous" aria-label="Previous project"><ArrowIcon/></button><button type="button" data-work-direction="1" aria-label="Next project"><ArrowIcon/></button></div></div></div><div className="project-viewport"><div className="project-track">{[projects[3],projects[0],projects[2]].map(project=><ProjectTeaser project={project} key={project.slug}/>)}</div></div><div className="work-scroll-line" aria-hidden="true"><span/></div></div></section>
   <section className="simple-section simple-approach" id="approach"><div className="process-stage"><div className="process-heading"><p className="section-caption">A considered process</p><SceneTitle lines={['Clarity at', 'every step.']}/><div className="process-number" aria-hidden="true">{steps.map((_,i)=><span key={i}>{String(i+1).padStart(2,'0')}</span>)}</div></div><div className="process-body"><div className="process-rule" aria-hidden="true"><span/></div><ol>{steps.map(([title,text])=><li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol></div></div></section>
   <section className="simple-section simple-faq" id="questions"><div><p className="section-caption">A little clarity</p><SceneTitle lines={['Before', 'we begin.']}/></div><div className="studio-questions">{questions.map(([question,answer])=><Question question={question} answer={answer} key={question}/>)}</div></section>
  </main><Footer/><ProjectDialog open={enquiry} onClose={()=>setEnquiry(false)}/><PremiumScrollMotion/>
 </PremiumMotionProvider>
}
