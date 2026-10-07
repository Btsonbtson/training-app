import { useEffect, useMemo, useRef, useState } from 'react'
import { buildIsoPhases } from '../data/isometric'

function formatTime(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function cueBeep(kind) {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = kind === 'hold' ? 880 : kind === 'rest' ? 392 : 523
    gain.gain.value = 0.08
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
    osc.stop(ctx.currentTime + 0.2)
    osc.onended = () => ctx.close()
  } catch {
    // ignore autoplay / unsupported audio
  }
}

const KIND_COLOR = {
  ready: 'var(--accent)',
  hold: 'var(--green)',
  rest: 'var(--amber)',
  done: 'var(--purple)',
}

const KIND_BG = {
  ready: 'var(--accent-light)',
  hold: 'var(--green-light)',
  rest: 'var(--amber-light)',
  done: 'var(--purple-light)',
}

export function IsoTimer({ workout }) {
  const phases = useMemo(() => buildIsoPhases(workout), [workout])
  const totalMs = useMemo(() => phases.reduce((sum, p) => sum + p.duration * 1000, 0), [phases])

  const [running, setRunning] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [remainingMs, setRemainingMs] = useState(phases[0].duration * 1000)
  const [elapsedMs, setElapsedMs] = useState(0)

  const phaseIndexRef = useRef(0)
  const remainingRef = useRef(phases[0].duration * 1000)
  const elapsedRef = useRef(0)
  const lastTickRef = useRef(null)
  const finishedRef = useRef(false)

  const phase = phases[phaseIndex] || phases[phases.length - 1]

  useEffect(() => {
    // Reset when workout (progressive week) changes — timer follows new holdSec values
    setRunning(false)
    setPhaseIndex(0)
    setRemainingMs(phases[0].duration * 1000)
    setElapsedMs(0)
    phaseIndexRef.current = 0
    remainingRef.current = phases[0].duration * 1000
    elapsedRef.current = 0
    lastTickRef.current = null
    finishedRef.current = false
  }, [workout.id, phases])

  useEffect(() => {
    if (!running) {
      lastTickRef.current = null
      return undefined
    }

    const id = setInterval(() => {
      const now = performance.now()
      if (lastTickRef.current == null) lastTickRef.current = now
      const delta = now - lastTickRef.current
      lastTickRef.current = now

      let rem = remainingRef.current - delta
      let idx = phaseIndexRef.current
      let elapsed = elapsedRef.current + delta

      while (rem <= 0 && idx < phases.length - 1) {
        const overflow = -rem
        const next = phases[idx + 1]
        cueBeep(next.kind === 'hold' ? 'hold' : next.kind === 'rest' ? 'rest' : 'done')
        idx += 1
        rem = next.duration * 1000 - overflow
      }

      if (idx >= phases.length - 1 && rem <= 0) {
        rem = 0
        if (!finishedRef.current) {
          finishedRef.current = true
          cueBeep('done')
          setRunning(false)
        }
      }

      phaseIndexRef.current = idx
      remainingRef.current = rem
      elapsedRef.current = Math.min(elapsed, totalMs)

      setPhaseIndex(idx)
      setRemainingMs(rem)
      setElapsedMs(elapsedRef.current)
    }, 100)

    return () => clearInterval(id)
  }, [running, phases, totalMs])

  const progress = totalMs ? Math.min(1, elapsedMs / totalMs) : 0
  const phaseProgress = phase.duration
    ? 1 - remainingMs / (phase.duration * 1000)
    : 1

  const reset = () => {
    setRunning(false)
    setPhaseIndex(0)
    setRemainingMs(phases[0].duration * 1000)
    setElapsedMs(0)
    phaseIndexRef.current = 0
    remainingRef.current = phases[0].duration * 1000
    elapsedRef.current = 0
    lastTickRef.current = null
    finishedRef.current = false
  }

  return (
    <div style={{
      marginTop: 10,
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      background: 'var(--surface)',
    }}>
      <div style={{
        padding: '10px 12px',
        background: KIND_BG[phase.kind] || KIND_BG.ready,
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: KIND_COLOR[phase.kind], textTransform: 'uppercase', letterSpacing: '.06em' }}>
              Χρονόμετρο · {phase.label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{phase.title}</div>
            {phase.setsLabel && (
              <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, marginTop: 2 }}>
                Αυτή η προπόνηση: {phase.setsLabel}
              </div>
            )}
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: KIND_COLOR[phase.kind] }}>
            {formatTime(remainingMs)}
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.4 }}>
          {phase.cue}
        </div>
      </div>

      {phase.exercise?.image && (
        <div style={{ background: '#000', display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
          <img
            src={phase.exercise.image}
            alt={phase.exercise.name}
            style={{ maxHeight: 160, width: 'auto', objectFit: 'contain' }}
          />
        </div>
      )}

      <div style={{ padding: '10px 12px' }}>
        <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: 8 }}>
          <div style={{
            height: '100%',
            width: `${phaseProgress * 100}%`,
            background: KIND_COLOR[phase.kind],
            borderRadius: 2,
            transition: 'width .1s linear',
          }} />
        </div>
        <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, marginBottom: 10 }}>
          <div style={{
            height: '100%',
            width: `${progress * 100}%`,
            background: 'var(--text-muted)',
            borderRadius: 2,
          }} />
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            onClick={() => setRunning(r => !r)}
            disabled={phase.kind === 'done' && remainingMs <= 0}
            style={btnStyle}
          >
            {running ? 'Παύση' : phaseIndex === 0 && elapsedMs === 0 ? 'Έναρξη' : 'Συνέχεια'}
          </button>
          <button type="button" onClick={reset} style={{ ...btnStyle, flex: '0 0 auto', padding: '8px 12px' }}>
            Reset
          </button>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
          Συνολικά ~{formatTime(totalMs)} · holds προσαρμοσμένα σε αυτή τη φάση
        </div>
      </div>
    </div>
  )
}

const btnStyle = {
  flex: 1,
  padding: 8,
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border-strong)',
  background: 'transparent',
  color: 'var(--text)',
  fontSize: 13,
  fontFamily: 'inherit',
  fontWeight: 500,
  cursor: 'pointer',
}
