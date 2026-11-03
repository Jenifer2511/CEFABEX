import ScrollHeading from './ScrollHeading'
import ArrowIcon from './ArrowIcon'
import '../company-depth.css'

type EnquiryProps={onEnquire:(service?:string)=>void}
const capabilities=[
 {name:'Web & cloud engineering',description:'Company websites and web applications, connected from the interface to the database. We bring responsive frontend development, backend systems and cloud deployment into one delivery conversation.',outputs:['Responsive websites','Web applications','Database & cloud delivery']},
 {name:'CAD & automation',description:'Move from an engineering draft to a model you can develop. Our work translates industrial blueprints and design requirements into 2D and 3D models for practical engineering workflows.',outputs:['2D drafting','3D models','Automation design']},
 {name:'Digital strategy & growth',description:'Give a digital product a clear route to its audience. Search optimization, brand direction and campaign planning connect the experience you build with the people you want to reach.',outputs:['SEO & AEO','Brand architecture','Campaign strategy']},
 {name:'Career portfolios',description:'Make your work easier to understand and your experience easier to find. We support professional resumes and digital portfolios with a clear structure for both people and hiring systems.',outputs:['ATS resume structure','Digital portfolios','Professional presentation']},
 {name:'IoT & working prototypes',description:'Turn research and early ideas into something you can test. Customized connected projects, physical and digital prototypes, and hackathon roadmap guidance support students, engineers and emerging ventures.',outputs:['Connected systems','Functional prototypes','Hackathon guidance']},
]

export function CapabilityIndex({onEnquire}:EnquiryProps){
 return <section className="cd-capabilities section-shell" id="capabilities" aria-labelledby="cd-capability-title" data-thread-stop="capabilities">
  <div className="cd-section-opening"><ScrollHeading id="cd-capability-title" text="One partner. Many disciplines."/><p data-scroll-copy="">The right solution can cross more than one field. CEFABEX brings digital delivery, applied engineering and growth support into a connected practice.</p></div>
  <div className="cd-capability-layout">
   <aside className="cd-capability-aside">
    <figure className="cd-capability-photo"><img src="/company/iot.webp" alt="CEFABEX connected hardware and laptop prototype" width="480" height="420" loading="lazy"/><figcaption>Physical systems. Digital possibilities.</figcaption></figure>
    <h3>Start with what you need.</h3><p>Your brief might be a website, a prototype or a problem that needs both. We help connect the disciplines around it.</p><a href="/services" className="cd-text-action">Explore our services <ArrowIcon/></a>
   </aside>
   <div className="cd-capability-list">{capabilities.map((item,index)=><article className="cd-capability-row" key={item.name} data-scroll-copy="">
    <span className="cd-capability-number" aria-hidden="true">0{index+1}</span>
    <div className="cd-capability-body"><h3>{item.name}</h3><p>{item.description}</p><ul aria-label={`${item.name} capabilities`}>{item.outputs.map(output=><li key={output}>{output}</li>)}</ul><button className="cd-text-action" onClick={()=>onEnquire(item.name)}>Discuss this work <ArrowIcon/></button></div>
   </article>)}</div>
  </div>
 </section>
}

export function CompanyProof({onEnquire}:EnquiryProps){
 return <section className="cd-proof section-shell" id="people" aria-labelledby="cd-proof-title" data-thread-stop="people">
  <div className="cd-section-opening"><ScrollHeading id="cd-proof-title" text="People behind possibility."/><p data-scroll-copy="">CEFABEX began with business thinking, curiosity and a belief that ambitious ideas belong in the real world.</p></div>
  <div className="cd-people-layout">
   <figure className="cd-team-photo"><img src="/company/team.webp" alt="The CEFABEX team and support network pictured together" width="512" height="324" loading="lazy"/><figcaption>The people and support system behind CEFABEX.</figcaption></figure>
   <div className="cd-people-copy" data-scroll-copy=""><h3>Research meets real life.</h3><p>Our innovation hub brings researchers, engineers and creators together to turn conceptual work into physical and digital prototypes.</p><p>CEFABEX Growth connects that engineering with execution: digital platforms, intelligent systems and the practical work of reaching a market.</p><a href="/about" className="cd-text-action">Meet CEFABEX <ArrowIcon/></a></div>
  </div>
  <div className="cd-milestone-layout">
   <figure className="cd-milestone-photo"><img src="/company/milestone.webp" alt="CEFABEX representatives at the Nimirndhu Nil event" width="462" height="640" loading="lazy"/><figcaption>A milestone in the CEFABEX journey.</figcaption></figure>
   <div className="cd-milestone-copy"><h3>Ideas with a path forward.</h3><div className="cd-milestone-item"><h4>SMARTSEA BELT</h4><p>The company journey includes Tamil Nadu State Finalist recognition for the SMARTSEA BELT innovation project within the Nimirndhu Nil framework.</p><a href="/projects/smartsea-belt" className="cd-text-action">Explore the milestone <ArrowIcon/></a></div><div className="cd-milestone-item"><h4>From pitch to technical validation.</h4><p>CEFABEX presented its technology at IDEA HACKATHON – PITCH FEAST, supported by StartupTN and MIIC, and progressed to advanced technical validation.</p></div><button className="cd-text-action cd-proof-action" onClick={()=>onEnquire('Innovation & prototype development')}>Bring your idea to the team <ArrowIcon/></button></div>
  </div>
  <div className="cd-company-record"><p>Rooted in Tamil Nadu.<br/><span>Building for what comes next.</span></p><div><span>CEFABEX Innovations</span><p>MSME · UDYAM-TN-09-0119792</p></div><div><span>CEFABEX Growth</span><p>MSME · UDYAM-TN-09-0125510</p></div></div>
 </section>
}
