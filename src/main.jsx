import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import FeedbackButton from './components/FeedbackButton.jsx'
import SoundToggle from './components/SoundToggle.jsx'
import Buzon from './components/Buzon.jsx'
import './index.css'

// Ruta por hash: paicio.vercel.app/#buzon abre la vista privada de Vero.
const esBuzon = window.location.hash.replace('#', '').toLowerCase() === 'buzon'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {esBuzon ? (
      <Buzon />
    ) : (
      <>
        <App />
        <FeedbackButton />
        <SoundToggle />
      </>
    )}
  </React.StrictMode>,
)
