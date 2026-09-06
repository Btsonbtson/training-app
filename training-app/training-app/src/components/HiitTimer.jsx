import { useEffect, useMemo, useRef, useState } from 'react'

const WORK_ROUNDS = 6

function buildPhases() {
  const phases = [{ id: 'warmup', label: 'Warm-up', kind: 'warmup', duration: 120 }]
  for (let i = 1; i <= WORK_ROUNDS; i++) {
    phases.push({ id: `work-${i}`, label: `Work ${i}/${WORK_ROUNDS}`, kind: 'work', duration: 40 })
    phases.push({ id: `rest-${i}`, label: `Rest ${i}/${WORK_ROUNDS}`, kind: 'rest', duration: 20 })
  }
  phases.push({ id: 'cooldown', label: 'Cool-down', kind: 'cooldown', duration: 60 })
  return phases
}

function formatTime(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

const KIND_COLOR = {
  warmup: 'var(--accent)',
  work: 'var(--green)',
  rest: 'var(--amber)',
  cooldown: 'var(--purple)',
}

export function HiitTimer() {
  const phases = useMemo(buildPhases, [])
  const totalMs = useMemo(() => phases.reduce((sum, phase) => sum + phase.duration * 1000, 0), [phases])
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [remainingMs, setRemainingMs] = useState(phases[0].duration * 1000)
  const endAtRef = useRef(null)

  const phase = phases[phaseIndex]
  const elapsedBefore = phases.slice(0, phaseIndex).reduce((sum, item) => sum + item.duration * 1000, 0)
  const elapsedNow = elapsedBefore + (phase.duration * 1000 - remainingMs)
  const overallPct = Math.min(100, (elapsedNow / totalMs) * 100)

  useEffect(() => {
    if (!running) return undefined

    const tick = () => {
      const left = Math.max(0, endAtRef.current - Date.now())
      if (left > 0) {
        setRemainingMs(left)
        return
      }

      setPhaseIndex((current) => {
        if (current >= phases.length - 1) {
          setRunning(false)
          setDone(true)
          setRemainingMs(0)
          return current
        }
        const next = current + 1
        const nextMs = phases[next].duration * 1000
        endAtRef.current = Date.now() + nextMs
        setRemainingMs(nextMs)
        return next
      })
    }

    tick()
    const id = setInterval(tick, 100)
    return () => clearInterval(id)
  }, [running, phases])

  const start = () => {
    if (done) return
    endAtRef.current = Date.now() + remainingMs
    setRunning(true)
  }

  const pause = () => setRunning(false)

  const reset = () => {
    setRunning(false)
    setDone(false)
    setPhaseIndex(0)
    setRemainingMs(phases[0].duration * 1000)
    endAtRef.current = null
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '12px 14px',
      marginBottom: '1.25rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>9' HIIT Timer</div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
          2' warm-up · 6×(40"/20") · 1' cool-down
        </div>
      </div>

      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '.04em',
        textTransform: 'uppercase',
        color: KIND_COLOR[phase.kind],
        marginBottom: 2,
      }}>
        {done ? 'Complete' : phase.label}
      </div>

      <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
        {done ? '0:00' : formatTime(remainingMs)}
      </div>

      <div style={{ height: 4, background: 'var(--border)', borderRadius: 99, margin: '10px 0 12px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${overallPct}%`,
          background: KIND_COLOR[phase.kind],
          transition: 'width .1s linear',
        }} />
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {!running ? (
          <button type="button" onClick={start} disabled={done} style={btnStyle}>
            {phaseIndex === 0 && remainingMs === phases[0].duration * 1000 ? 'Start' : 'Resume'}
          </button>
        ) : (
          <button type="button" onClick={pause} style={btnStyle}>Pause</button>
        )}
        <button type="button" onClick={reset} style={{ ...btnStyle, background: 'transparent' }}>Reset</button>
      </div>
    </div>
  )
}

const btnStyle = {
  flex: 1,
  padding: 8,
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border-strong)',
  background: 'var(--surface-2)',
  color: 'var(--text)',
  fontSize: 13,
  fontFamily: 'inherit',
  fontWeight: 600,
  cursor: 'pointer',
}
