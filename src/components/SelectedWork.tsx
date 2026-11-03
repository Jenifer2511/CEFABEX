import {projects} from '../CompanyPages'
import ScrollHeading from './ScrollHeading'
import ArrowIcon from './ArrowIcon'
import type {ScrollToPosition} from './ExpertiseJourney'

const summaries=[
 'An innovation milestone: Tamil Nadu State Finalist recognition within the Nimirndhu Nil framework.',
 'Customized engineering projects that connect practical prototypes with everyday accessibility needs.',
 'Applied engineering and physical prototypes for agricultural environments.',
 'Connected hardware, customized websites and digital experiences built around real systems.',
 'A development environment for students and engineers to turn research into functional prototypes.',
]
export default function SelectedWork({onScrollTo}:{onScrollTo:ScrollToPosition}){
 return <section className="work-journey" id="selected-work" data-thread-stop="projects" aria-labelledby="work-title">
  <div className="work-stage">
   <div className="work-intro section-shell"><ScrollHeading text="Engineering in practice." id="work-title"/><p data-scroll-copy="">Projects, prototypes and milestones from the CEFABEX journey.</p></div>
   <div className="work-viewport section-shell"><div className="work-track">
    {projects.map((project,i)=><a href={`/projects/${project.slug}`} className="work-slide" key={project.slug} onFocus={event=>{
     const section=event.currentTarget.closest<HTMLElement>('.work-journey')
     if(!section?.classList.contains('has-work-scroll')||!event.currentTarget.matches(':focus-visible'))return
     const viewport=section.querySelector<HTMLElement>('.work-viewport')!;viewport.scrollLeft=0
     const start=Number(section.dataset.scrollStart),end=Number(section.dataset.scrollEnd)
     onScrollTo(start+(end-start)*i/(projects.length-1),true)
    }}>
     <figure className="work-image" data-image-reveal=""><img src={`/company/${project.image}.webp`} alt={project.caption} loading="lazy" width="960" height="720"/></figure>
     <div className="work-copy"><span className="work-order" aria-hidden="true">0{i+1} / 0{projects.length}</span><h3>{project.title}</h3><p>{summaries[i]}</p><span className="studio-text-link">Explore the project <ArrowIcon/></span></div>
    </a>)}
   </div></div>
   <div className="work-bottom section-shell"><div className="work-progress" aria-hidden="true"><span/></div><a href="/projects" className="studio-text-link">All project areas <ArrowIcon/></a></div>
  </div>
 </section>
}
