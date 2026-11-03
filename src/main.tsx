import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/geist'
import 'lenis/dist/lenis.css'
import './styles.css'
import App from './App'
import CompanyPages from './CompanyPages'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{location.pathname === "/" ? <App /> : <CompanyPages />}</React.StrictMode>,
)
