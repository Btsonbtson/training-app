import { useState } from 'react'

export function useStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const set = (newValue) => {
    try {
      const resolved = typeof newValue === 'function' ? newValue(value) : newValue
      setValue(resolved)
      localStorage.setItem(key, JSON.stringify(resolved))
    } catch (e) {
      console.error('Storage error', e)
    }
  }

  return [value, set]
}
