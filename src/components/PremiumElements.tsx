import {useState} from 'react'
import {LazyMotion,domAnimation,m,useReducedMotion} from 'motion/react'
import type {ReactNode} from 'react'
import ArrowIcon from './ArrowIcon'
import type {projects} from '../CompanyPages'

export function PremiumMotionProvider({children}:{children:ReactNode}){return <LazyMotion features={domAnimation}>{children}</LazyMotion>}
export function SceneTitle({lines}:{lines:string[]}){return <h2 className="scene-title" aria-label={lines.join(' ')}>{lines.map((line,i)=><span className="scene-line" aria-hidden="true" key={i}>{line.split(' ').map((word,j)=><span className="scene-mask" key={j}><span className="scene-word">{word}</span></span>)}</span>)}</h2>}
export function ProjectTeaser({project}:{project:typeof projects[number]}){
 const reduced=useReducedMotion()
 return <m.a className="project-teaser" href={`/projects/${project.slug}`} initial={false} whileHover="active" whileFocus="active">
  <div className={`project-visual ${project.slug==='smartsea-belt'?'is-milestone':''}`}>{project.slug==='smartsea-belt'&&<div className="project-media-note"><p>Tamil Nadu<br/>State Finalists.</p><span>SMARTSEA BELT</span></div>}<m.img src={`/company/${project.image}.webp`} alt={project.caption} loading="lazy" width="1000" height="650" variants={{active:{transform:reduced?'none':'scale(1.035)'}}} transition={{duration:.3,ease:[.23,1,.32,1]}}/></div>
  <div className="project-teaser-copy"><div><p className="project-category">{project.type}</p><h3>{project.title}</h3></div><m.span className="project-open" variants={{active:{transform:reduced?'none':'rotate(-45deg)'}}} transition={{duration:.2}}> <ArrowIcon/></m.span></div>
  <p className="project-context">{project.slug==='smartsea-belt'?'A documented milestone in our journey.':project.description}</p>
 </m.a>
}
export function Question({question,answer}:{question:string;answer:string}){
 const [open,setOpen]=useState(false),reduced=useReducedMotion()
 return <details onToggle={event=>setOpen(event.currentTarget.open)}><summary>{question}<m.span aria-hidden="true" animate={{transform:open?'rotate(45deg)':'rotate(0deg)'}} transition={{duration:reduced?0:.2}}>+</m.span></summary>{open&&<m.div initial={reduced?false:{opacity:0,transform:'translateY(8px)'}} animate={{opacity:1,transform:'translateY(0px)'}} transition={{duration:.25,ease:[.23,1,.32,1]}}><p>{answer}</p></m.div>}</details>
}
