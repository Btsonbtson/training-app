import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { isCloudEnabled, supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(!isCloudEnabled)
  const [recovering, setRecovering] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setReady(true)
      return undefined
    }

    let settled = false
    const finish = (next) => {
      if (settled) {
        setSession(next ?? null)
        return
      }
      settled = true
      setSession(next ?? null)
      setReady(true)
    }

    const timeout = window.setTimeout(() => finish(null), 4000)
    supabase.auth.getSession()
      .then(({ data }) => finish(data.session ?? null))
      .catch(() => finish(null))
      .finally(() => window.clearTimeout(timeout))

    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      if (event === 'PASSWORD_RECOVERY') setRecovering(true)
      finish(next)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  const value = useMemo(() => ({
    ready,
    cloudEnabled: isCloudEnabled,
    session,
    user: session?.user ?? null,
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    resetPassword: (email) => supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    }),
    updatePassword: async (password) => {
      const result = await supabase.auth.updateUser({ password })
      if (!result.error) setRecovering(false)
      return result
    },
    recovering,
    signOut: async () => {
      try {
        localStorage.removeItem('tp_guest')
      } catch {
        // Ignore if storage is blocked.
      }
      if (supabase) await supabase.auth.signOut()
    },
  }), [ready, session, recovering])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
