import { useEffect, useState } from 'react'

const posterLoaders = import.meta.glob('../assets/posters/*.png')

const POSTERS = {
  tc: {
    file: '../assets/posters/tai-chi.png',
    alt: '4 Weeks Progressive Chair Tai Chi Program',
  },
  ac: {
    file: '../assets/posters/army-chair.png',
    alt: '28-Day Military Chair Workout Challenge',
  },
}

export function ProgramPoster({ program }) {
  const poster = POSTERS[program]
  const [src, setSrc] = useState(null)

  useEffect(() => {
    if (!poster) {
      setSrc(null)
      return undefined
    }

    const loader = posterLoaders[poster.file]
    if (!loader) {
      setSrc(null)
      return undefined
    }

    let cancelled = false
    loader()
      .then((mod) => {
        if (!cancelled) setSrc(mod.default)
      })
      .catch(() => {
        if (!cancelled) setSrc(null)
      })

    return () => {
      cancelled = true
    }
  }, [poster])

  if (!poster || !src) return null

  return (
    <figure style={{
      margin: '0 0 1rem',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
    }}>
      <img
        src={src}
        alt={poster.alt}
        decoding="async"
        style={{ display: 'block', width: '100%', height: 'auto' }}
      />
    </figure>
  )
}
