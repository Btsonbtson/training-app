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

const linkStyle = {
  border: 'none',
  background: 'transparent',
  color: 'var(--accent)',
  fontSize: 13,
  fontFamily: 'inherit',
  fontWeight: 600,
  padding: 0,
  cursor: 'pointer',
}

export function AuthScreen({ onContinueLocal }) {
  const { cloudEnabled, signIn, signUp, resetPassword, updatePassword, recovering } = useAuth()
  const [mode, setMode] = useState(recovering ? 'reset' : 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const screen = recovering ? 'reset' : mode

  const run = async (work, okMessage) => {
    setMessage('')
    setBusy(true)
    try {
      const { error } = await work()
      if (error) {
        setMessage(error.message)
        return
      }
      if (okMessage) setMessage(okMessage)
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
        {screen === 'forgot'
          ? 'Enter the email on your account. We will send a reset link.'
          : screen === 'reset'
            ? 'Choose a new password for your account.'
            : 'Sign in on your phone or computer. Ratings, notes, and completed workouts stay with your account.'}
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
          {screen !== 'reset' && (
            <>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ ...fieldStyle, marginBottom: 10 }}
              />
            </>
          )}

          {screen !== 'forgot' && (
            <>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                {screen === 'reset' ? 'New password' : 'Password'}
              </label>
              <input
                type="password"
                autoComplete={screen === 'login' ? 'current-password' : 'new-password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={fieldStyle}
              />
            </>
          )}

          {screen === 'reset' && (
            <>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, margin: '10px 0 6px' }}>
                Confirm password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                style={fieldStyle}
              />
            </>
          )}

          {screen === 'login' || screen === 'register' ? (
            <>
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setMode('register')
                    run(() => signUp(email.trim(), password), 'Check your email to confirm the account, then sign in.')
                  }}
                  style={btnStyle}
                >
                  Register
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setMode('login')
                    run(() => signIn(email.trim(), password))
                  }}
                  style={btnStyle}
                >
                  Sign in
                </button>
              </div>
              <div style={{ marginTop: 12 }}>
                <button type="button" onClick={() => { setMode('forgot'); setMessage('') }} style={linkStyle}>
                  Forgot password?
                </button>
              </div>
            </>
          ) : null}

          {screen === 'forgot' && (
            <>
              <button
                type="button"
                disabled={busy || !email.trim()}
                onClick={() => run(
                  () => resetPassword(email.trim()),
                  'Check your email for a reset link. Open it on this phone or computer, then set a new password.',
                )}
                style={{ ...btnStyle, width: '100%', marginTop: 12 }}
              >
                Send reset link
              </button>
              <div style={{ marginTop: 12 }}>
                <button type="button" onClick={() => { setMode('login'); setMessage('') }} style={linkStyle}>
                  Back to sign in
                </button>
              </div>
            </>
          )}

          {screen === 'reset' && (
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                if (password.length < 6) {
                  setMessage('Password must be at least 6 characters.')
                  return
                }
                if (password !== confirm) {
                  setMessage('The two passwords do not match.')
                  return
                }
                run(() => updatePassword(password), 'Password updated. You are signed in.')
              }}
              style={{ ...btnStyle, width: '100%', marginTop: 12 }}
            >
              Save new password
            </button>
          )}

          {message && (
            <p style={{ marginTop: 10, fontSize: 13, color: 'var(--amber)', lineHeight: 1.4 }}>{message}</p>
          )}
        </form>
      )}

      {onContinueLocal && screen !== 'reset' && (
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
