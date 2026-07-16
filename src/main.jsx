import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SocialProvider } from './context/SocialContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SocialProvider>
      <App />
    </SocialProvider>
  </React.StrictMode>,
)
