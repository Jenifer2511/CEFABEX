import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/geist'
import './styles.css'
import 'lenis/dist/lenis.css'
import './cinematic.css'
import './liquid-glass.css'
import './title-sequence.css'
import SiteRouter from './SiteRouter'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><SiteRouter/></React.StrictMode>,
)
