import React, { Component, Suspense, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { UserDataProvider } from './context/UserDataContext.jsx'
import { AuthScreen } from './components/AuthScreen.jsx'
import './index.css'

const App = React.lazy(() =>
  import('./App.jsx').catch(() => ({
    default: function FailedApp() {
      return (
        <div style={{ minHeight: '100dvh', padding: '2rem 1rem', background: 'var(--bg)', color: 'var(--text)' }}>
          <h1 style={{ fontSize: 20, fontWeight: 650 }}>Training Program</h1>
          <p style={{ marginTop: 8, color: 'var(--text-secondary)' }}>
            Could not open the workouts. Reload the page to continue.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: 16,
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid var(--border-strong)',
              background: 'var(--surface-2)',
              color: 'var(--text)',
              font: 'inherit',
            }}
          >
            Reload
          </button>
        </div>
      )
    },
  }))
)

try {
  const storedTheme = JSON.parse(localStorage.getItem('tp_theme'))
  const theme = storedTheme === 'light' || storedTheme === 'dark'
    ? storedTheme
    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  document.documentElement.setAttribute('data-theme', theme)
} catch {
  document.documentElement.setAttribute(
    'data-theme',
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  )
}

function LoadingScreen({ label = 'Loading…' }) {
  return (
    <div style={{
      minHeight: '100dvh',
      padding: '2rem 1rem',
      background: 'var(--bg)',
      color: 'var(--text)',
    }}>
      <h1 style={{ fontSize: 20, fontWeight: 650 }}>Training Program</h1>
      <p style={{ marginTop: 8, color: 'var(--text-secondary)' }}>{label}</p>
    </div>
  )
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return (
        <div style={{ minHeight: '100dvh', padding: '2rem 1rem', background: 'var(--bg)', color: 'var(--text)' }}>
          <h1 style={{ fontSize: 20, fontWeight: 650 }}>Training Program</h1>
          <p style={{ marginTop: 8, color: 'var(--text-secondary)' }}>
            Something went wrong. Reload the page to continue.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: 16,
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid var(--border-strong)',
              background: 'var(--surface-2)',
              color: 'var(--text)',
              font: 'inherit',
            }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function Root() {
  const { ready, user, recovering } = useAuth()
  const [guest, setGuest] = useState(() => {
    try {
      return localStorage.getItem('tp_guest') === '1'
    } catch {
      return false
    }
  })

  if (!ready) {
    return <LoadingScreen />
  }

  if (recovering || (!user && !guest)) {
    return (
      <AuthScreen
        onContinueLocal={() => {
          try {
            localStorage.setItem('tp_guest', '1')
          } catch {
            // Ignore if storage is blocked.
          }
          setGuest(true)
        }}
      />
    )
  }

  return (
    <UserDataProvider>
      <Suspense fallback={<LoadingScreen label="Opening workouts…" />}>
        <App />
      </Suspense>
    </UserDataProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
