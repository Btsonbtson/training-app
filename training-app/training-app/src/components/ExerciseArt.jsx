import { useEffect, useState } from 'react'

const exerciseLoaders = import.meta.glob('../assets/exercises/*.png')

function exerciseKey(program, day) {
  return `../assets/exercises/${program}-${String(day).padStart(2, '0')}.png`
}

export default function ExerciseArt({ program, day, label }) {
  const [src, setSrc] = useState(null)

  useEffect(() => {
    const loader = exerciseLoaders[exerciseKey(program, day)]
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
  }, [program, day])

  if (!src) {
    return (
      <div
        aria-hidden="true"
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          background: 'var(--surface-2)',
        }}
      />
    )
  }

  return (
    <img
      src={src}
      alt={label || ''}
      decoding="async"
      style={{
        display: 'block',
        width: '100%',
        aspectRatio: '1 / 1',
        objectFit: 'cover',
        objectPosition: 'center',
        backgroundColor: 'var(--surface-2)',
      }}
    />
  )
}
