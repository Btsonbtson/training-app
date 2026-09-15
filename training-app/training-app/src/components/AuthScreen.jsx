import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const fieldStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  background: 'var(--surface-2)',
  color: 'var(--text)',
  fontSize: 15,
  fontFamily: 'inherit',
}

const btnStyle = {
  flex: 1,
  padding: 10,
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border-strong)',
  background: 'var(--surface-2)',
  color: 'var(--text)',
  fontSize: 14,
  fontFamily: 'inherit',
  fontWeight: 600,
  cursor: 'pointer',
}

export function AuthScreen({ onContinueLocal }) {
  const { cloudEnabled, signIn, signUp } = useAuth()
  const [mode, setMode] = useState('register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (action) => {
    setMessage('')
    setBusy(true)
    try {
      const { error, data } = await action(email.trim(), password)
      if (error) {
        setMessage(error.message)
        return
      }
      if (action === signUp && !data.session) {
        setMessage('Check your email to confirm the account, then sign in.')
      }
    } catch (error) {
      setMessage(error.message || 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      <h1 style={{ fontSize: 22, fontWeight: 650, letterSpacing: '-.02em' }}>Training Program</h1>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
        Sign in on your phone or computer. Ratings, notes, and completed workouts stay with your account.
      </p>

      {!cloudEnabled && (
        <div style={{
          marginTop: 16,
          padding: 12,
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          background: 'var(--surface-2)',
          fontSize: 13,
          lineHeight: 1.5,
        }}>
          Cloud accounts are not connected yet. Add a free Supabase project and the
          {' '}<code>VITE_SUPABASE_URL</code> / <code>VITE_SUPABASE_ANON_KEY</code> keys
          to enable registration. Until then you can continue on this device only.
        </div>
      )}

      {cloudEnabled && (
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{
            marginTop: 18,
            padding: 14,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Email</label>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ ...fieldStyle, marginBottom: 10 }}
          />
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Password</label>
          <input
            type="password"
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={fieldStyle}
          />

          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            <button
              type="button"
              disabled={busy}
              onClick={() => { setMode('register'); submit(signUp) }}
              style={btnStyle}
            >
              Register
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => { setMode('login'); submit(signIn) }}
              style={btnStyle}
            >
              Sign in
            </button>
          </div>

          {message && (
            <p style={{ marginTop: 10, fontSize: 13, color: 'var(--amber)', lineHeight: 1.4 }}>{message}</p>
          )}
        </form>
      )}

      {onContinueLocal && (
        <button
          type="button"
          onClick={onContinueLocal}
          style={{ ...btnStyle, width: '100%', marginTop: 12, background: 'transparent' }}
        >
          Continue on this device only
        </button>
      )}
    </div>
  )
}
