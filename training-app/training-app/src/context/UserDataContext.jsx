import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { applyLocalSnapshot, fetchUserState, saveUserState, snapshotLocal } from '../lib/userState'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const UserDataContext = createContext(null)

export function UserDataProvider({ children }) {
  const { user, cloudEnabled } = useAuth()
  const [status, setStatus] = useState(cloudEnabled ? 'loading' : 'local')
  const skipSave = useRef(false)

  useEffect(() => {
    if (!cloudEnabled || !supabase) {
      setStatus('local')
      return undefined
    }
    if (!user) {
      setStatus('signed-out')
      return undefined
    }

    let cancelled = false
    setStatus('loading')

    fetchUserState(supabase, user.id)
      .then((cloud) => {
        if (cancelled) return
        skipSave.current = true
        if (cloud && Object.keys(cloud).length) {
          applyLocalSnapshot(cloud)
        } else {
          return saveUserState(supabase, user.id, snapshotLocal())
        }
      })
      .then(() => {
        if (!cancelled) setStatus('saved')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
      .finally(() => {
        queueMicrotask(() => { skipSave.current = false })
      })

    return () => { cancelled = true }
  }, [cloudEnabled, user])

  useEffect(() => {
    if (!cloudEnabled || !supabase || !user) return undefined

    let timer
    const persist = () => {
      if (skipSave.current) return
      clearTimeout(timer)
      timer = setTimeout(() => {
        setStatus('saving')
        saveUserState(supabase, user.id, snapshotLocal())
          .then(() => setStatus('saved'))
          .catch(() => setStatus('error'))
      }, 450)
    }

    window.addEventListener('tp-storage', persist)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('tp-storage', persist)
    }
  }, [cloudEnabled, user])

  return (
    <UserDataContext.Provider value={{ status }}>
      {children}
    </UserDataContext.Provider>
  )
}

export function useUserData() {
  return useContext(UserDataContext) ?? { status: 'local' }
}
