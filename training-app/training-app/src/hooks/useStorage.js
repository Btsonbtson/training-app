import { useCallback, useEffect, useRef, useState } from 'react'

const SYNC_EVENT = 'tp-storage'

let storageAvailable

function canUseStorage() {
  if (typeof window === 'undefined') return false
  if (storageAvailable !== undefined) return storageAvailable
  try {
    const probe = '__tp_ls_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    storageAvailable = true
  } catch {
    storageAvailable = false
  }
  return storageAvailable
}

function readStorage(key, fallback) {
  if (!canUseStorage()) return fallback
  try {
    const stored = window.localStorage.getItem(key)
    if (stored == null) return fallback
    return JSON.parse(stored)
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  if (!canUseStorage()) return false
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('Storage error', error)
    return false
  }
}

function notifyStorage(key, value) {
  window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key, value } }))
}

export function useStorage(key, defaultValue) {
  const defaultRef = useRef(defaultValue)
  defaultRef.current = defaultValue

  const [value, setValue] = useState(() => readStorage(key, defaultValue))

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== key) return
      if (event.newValue == null) {
        setValue(defaultRef.current)
        return
      }
      try {
        setValue(JSON.parse(event.newValue))
      } catch {
        setValue(defaultRef.current)
      }
    }

    const onLocalSync = (event) => {
      if (event.detail?.key !== key) return
      setValue(event.detail.value)
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener(SYNC_EVENT, onLocalSync)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(SYNC_EVENT, onLocalSync)
    }
  }, [key])

  const set = useCallback((updater) => {
    setValue((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      writeStorage(key, next)
      queueMicrotask(() => notifyStorage(key, next))
      return next
    })
  }, [key])

  return [value, set]
}
