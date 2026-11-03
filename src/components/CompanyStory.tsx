import ScrollHeading from './ScrollHeading'
export default function CompanyStory() {
  return <section id="company" data-thread-stop="company" className="company-story section-shell" aria-labelledby="company-title">
    <div className="company-intro"><ScrollHeading id="company-title" text="Ideas into impact."/><p data-scroll-copy="">From mind to market, CEFABEX brings research, entrepreneurial thinking and engineering together to turn meaningful ideas into practical ventures.</p></div>
    <div className="company-ecosystem">
      <article><div className="company-picture"><img src="/company/journey.webp" alt="A discussion from the CEFABEX journey, pictured in the company profile" loading="lazy" width="640" height="489" /></div><h3>CEFABEX Innovations</h3><p data-scroll-copy="">A deep technology innovation hub where researchers, engineers and creators turn ambitious ideas into technologies, prototypes and scalable ventures.</p></article>
      <article><div className="company-picture"><img src="/company/iot.webp" alt="An IoT hardware and laptop project pictured in the CEFABEX company profile" loading="lazy" width="480" height="420" /></div><h3>CEFABEX Growth</h3><p data-scroll-copy="">Connecting innovation with execution through web engineering, intelligent systems, digital transformation and strategic growth.</p></article>
    </div>
    <div className="company-capabilities" data-scroll-copy=""><h3>Engineering, and beyond.</h3><p>Web engineering · CAD & automation · Digital marketing · Career portfolios · IoT & student projects</p></div>
  </section>
}
