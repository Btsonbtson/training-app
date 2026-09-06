import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

try {
  const storedTheme = JSON.parse(localStorage.getItem('tp_theme'))
  if (storedTheme === 'light' || storedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', storedTheme)
  }
} catch {
  // Ignore invalid persisted theme and fall back to system.
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
