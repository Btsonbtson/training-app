import taiChiPoster from '../assets/posters/tai-chi.png'
import armyPoster from '../assets/posters/army-chair.png'

export const POSTERS = {
  tc: {
    src: taiChiPoster,
    alt: '4 Weeks Progressive Chair Tai Chi Program',
    frame: { top: 0.108, left: 0.138, right: 0.012, bottom: 0.012 },
  },
  ac: {
    src: armyPoster,
    alt: '28-Day Military Chair Workout Challenge',
    frame: { top: 0.238, left: 0.018, right: 0.018, bottom: 0.168 },
  },
}

function cellBox(day, frame, cols = 7, rows = 4) {
  const index = Math.max(0, day - 1)
  const col = index % cols
  const row = Math.floor(index / cols)
  const gridW = 1 - frame.left - frame.right
  const gridH = 1 - frame.top - frame.bottom
  const cellW = gridW / cols
  const cellH = gridH / rows
  const insetX = cellW * 0.018
  const insetY = cellH * 0.018
  return {
    x: frame.left + col * cellW + insetX,
    y: frame.top + row * cellH + insetY,
    w: cellW - insetX * 2,
    h: cellH - insetY * 2,
  }
}

function cropStyle(src, box) {
  return {
    backgroundImage: `url(${src})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${(1 / box.w) * 100}% ${(1 / box.h) * 100}%`,
    backgroundPosition: `${(box.x / (1 - box.w)) * 100}% ${(box.y / (1 - box.h)) * 100}%`,
  }
}

export function PosterCell({ program, day, label, compact = false }) {
  const poster = POSTERS[program]
  if (!poster) return null
  const box = cellBox(day, poster.frame)
  return (
    <div
      role="img"
      aria-label={label || poster.alt}
      style={{
        width: '100%',
        aspectRatio: compact ? '1 / 1' : `${box.w} / ${box.h}`,
        borderRadius: compact ? 8 : 10,
        backgroundColor: 'var(--surface-2)',
        ...cropStyle(poster.src, box),
      }}
    />
  )
}

export function ProgramPoster({ program }) {
  const poster = POSTERS[program]
  if (!poster) return null
  return (
    <figure style={{
      margin: '0 0 1rem',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
    }}>
      <img
        src={poster.src}
        alt={poster.alt}
        style={{ display: 'block', width: '100%', height: 'auto' }}
      />
    </figure>
  )
}
