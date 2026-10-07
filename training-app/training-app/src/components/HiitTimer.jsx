import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { hiitStationsFor, isFlowSession } from '../data/bodyweight'

const ExerciseArt = lazy(() => import('./ExerciseArt'))

const WORK_ROUNDS = 6

function buildPhases(stations) {
  const first = stations[0]
  const phases = [{
    id: 'warmup',
    kind: 'warmup',
    duration: 120,
    label: 'Warm-up',
    title: first ? `Settle in · ${first.name}` : 'Easy mobility',
    cue: 'Breathe, find the chair, move the joints. The first work interval is next.',
  }]

  stations.forEach((station, index) => {
    const next = stations[index + 1] || null
    phases.push({
      id: `work-${index + 1}`,
      kind: 'work',
      duration: 40,
      label: station.setLabel || `Work ${index + 1}/${WORK_ROUNDS}`,
      title: station.name,
      cue: station.desc,
      sets: station.sets,
      station,
      next,
    })
    phases.push({
      id: `rest-${index + 1}`,
      kind: 'rest',
      duration: 20,
      label: `Rest ${index + 1}/${WORK_ROUNDS}`,
      title: next ? `Next · ${next.name}` : 'Last rest',
      cue: next ? next.desc : 'Shake out, then ease into the cool-down.',
      station: next,
      next,
    })
  })

  const last = stations[stations.length - 1]
  phases.push({
    id: 'cooldown',
    kind: 'cooldown',
    duration: 60,
    label: 'Cool-down',
    title: last ? `Ease down · ${last.name}` : 'Cool-down',
    cue: 'Slow the breath. Let the shoulders drop.',
  })
  return phases
}

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
    osc.frequency.value = kind === 'work' ? 880 : kind === 'rest' ? 392 : 523
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
  warmup: 'var(--accent)',
  work: 'var(--green)',
  rest: 'var(--amber)',
  cooldown: 'var(--purple)',
}

const KIND_BG = {
  warmup: 'var(--accent-light)',
  work: 'var(--green-light)',
  rest: 'var(--amber-light)',
  cooldown: 'var(--purple-light)',
}

export function HiitTimer({ session, dateLabel }) {
  const stations = useMemo(() => hiitStationsFor(session), [session])
  const phases = useMemo(() => buildPhases(stations), [stations])
  const totalMs = useMemo(() => phases.reduce((sum, phase) => sum + phase.duration * 1000, 0), [phases])
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [remainingMs, setRemainingMs] = useState(phases[0]?.duration * 1000 || 0)
  const [muted, setMuted] = useState(false)
  const endAtRef = useRef(null)
  const prevPhaseRef = useRef(0)

  useEffect(() => {
    setRunning(false)
    setDone(false)
    setPhaseIndex(0)
    setRemainingMs((phases[0]?.duration || 0) * 1000)
    endAtRef.current = null
    prevPhaseRef.current = 0
  }, [session?.id])

  const phase = phases[phaseIndex] || phases[0]
  const elapsedBefore = phases.slice(0, phaseIndex).reduce((sum, item) => sum + item.duration * 1000, 0)
  const elapsedNow = elapsedBefore + ((phase?.duration || 0) * 1000 - remainingMs)
  const overallPct = totalMs ? Math.min(100, (elapsedNow / totalMs) * 100) : 0
  const workIndex = phase?.kind === 'work' || phase?.kind === 'rest'
    ? Number(String(phase.id).split('-')[1]) - 1
    : phase?.kind === 'cooldown' ? stations.length : -1
  const artStation = phase?.station || stations[0]
  const programLabel = session?.type === 'BW' ? 'Army Chair' : 'Chair Tai Chi'
  const flow = isFlowSession(session)

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

  useEffect(() => {
    if (phaseIndex === prevPhaseRef.current) return
    prevPhaseRef.current = phaseIndex
    const nextPhase = phases[phaseIndex]
    if (!nextPhase || muted) return
    cueBeep(nextPhase.kind)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(nextPhase.kind === 'work' ? [40, 40, 80] : 40)
    }
  }, [phaseIndex, phases, muted])

  const start = () => {
    if (done || !phase) return
    endAtRef.current = Date.now() + remainingMs
    setRunning(true)
    if (!muted && phaseIndex === 0 && remainingMs === phases[0].duration * 1000) {
      cueBeep('warmup')
    }
  }

  const pause = () => setRunning(false)

  const reset = () => {
    setRunning(false)
    setDone(false)
    setPhaseIndex(0)
    setRemainingMs(phases[0].duration * 1000)
    endAtRef.current = null
    prevPhaseRef.current = 0
  }

  if (!session || !phase) {
    return (
      <div id="hiit-timer" style={shellStyle}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>9' HIIT Timer</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
          Pick a Chair Tai Chi or Army Chair session below to load the exercise into the timer.
        </div>
      </div>
    )
  }

  return (
    <div id="hiit-timer" style={{
      ...shellStyle,
      background: done ? 'var(--green-light)' : KIND_BG[phase.kind] || 'var(--surface)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700 }}>9' HIIT · {programLabel}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            {dateLabel ? `${dateLabel} · ` : ''}
            {flow ? '6 stations from this week’s flow' : session.title}
          </div>
        </div>
        <button type="button" onClick={() => setMuted((value) => !value)} style={muteStyle}>
          {muted ? 'Sound off' : 'Sound on'}
        </button>
      </div>

      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '.04em',
        textTransform: 'uppercase',
        color: KIND_COLOR[phase.kind],
        marginBottom: 4,
      }}>
        {done ? 'Complete' : phase.label}
      </div>

      <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
        {done ? '0:00' : formatTime(remainingMs)}
      </div>

      <div style={{ height: 5, background: 'var(--border)', borderRadius: 99, margin: '10px 0 12px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${overallPct}%`,
          background: KIND_COLOR[phase.kind],
          transition: 'width .1s linear',
        }} />
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
        {artStation?.program && artStation?.day ? (
          <div style={{
            width: 92,
            flexShrink: 0,
            borderRadius: 10,
            overflow: 'hidden',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            opacity: phase.kind === 'rest' ? 0.55 : 1,
          }}>
            <Suspense fallback={<div style={{ aspectRatio: '1 / 1', background: 'var(--surface-2)' }} />}>
              <ExerciseArt program={artStation.program} day={artStation.day} label={artStation.name} />
            </Suspense>
          </div>
        ) : null}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.25 }}>
            {done ? 'Session done' : phase.title}
          </div>
          {phase.sets && phase.kind === 'work' && (
            <div style={{ fontSize: 11, fontWeight: 700, color: KIND_COLOR.work, marginTop: 2 }}>
              {phase.sets}
            </div>
          )}
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.45 }}>
            {done ? 'Mark the session complete on the card below.' : phase.cue}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
        {stations.map((station, index) => {
          const active = index === workIndex && (phase.kind === 'work' || phase.kind === 'rest')
          const passed = index < workIndex || done
          return (
            <div key={`${station.day}-${index}`} title={station.name} style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                height: 6,
                borderRadius: 99,
                background: passed || (active && phase.kind === 'work')
                  ? 'var(--green)'
                  : active
                    ? 'var(--amber)'
                    : 'var(--border)',
              }} />
              <div style={{
                fontSize: 9,
                color: active ? 'var(--text)' : 'var(--text-muted)',
                fontWeight: active ? 700 : 500,
                marginTop: 4,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {flow ? station.name.split(' ')[0] : index + 1}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
        {!running ? (
          <button type="button" onClick={start} disabled={done} style={btnStyle}>
            {phaseIndex === 0 && remainingMs === phases[0].duration * 1000 ? `Start · ${stations[0]?.name || 'HIIT'}` : 'Resume'}
          </button>
        ) : (
          <button type="button" onClick={pause} style={btnStyle}>Pause</button>
        )}
        <button type="button" onClick={reset} style={{ ...btnStyle, background: 'transparent' }}>Reset</button>
      </div>
    </div>
  )
}

const shellStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: '14px',
  marginBottom: '1.25rem',
}

const muteStyle = {
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text-secondary)',
  fontSize: 10,
  fontWeight: 600,
  fontFamily: 'inherit',
  borderRadius: 99,
  padding: '4px 8px',
  cursor: 'pointer',
}

const btnStyle = {
  flex: 1,
  padding: 10,
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border-strong)',
  background: 'var(--surface)',
  color: 'var(--text)',
  fontSize: 13,
  fontFamily: 'inherit',
  fontWeight: 600,
  cursor: 'pointer',
}
