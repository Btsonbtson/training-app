import { lazy, Suspense, useEffect, useState } from 'react'
import { cleanMetrics, hasMetrics } from '../lib/band'
import { readLatestTreadmillFromBand } from '../lib/healthConnect'

const ExerciseArt = lazy(() => import('./ExerciseArt'))

const BADGE_STYLE = {
  RI:  { background: 'var(--accent-light)', color: 'var(--accent)' },
  REH: { background: 'var(--green-light)', color: 'var(--green)' },
  RHR: { background: 'var(--amber-light)', color: 'var(--amber)' },
  RE:  { background: 'var(--purple-light)', color: 'var(--purple)' },
  BW:  { background: 'var(--green-light)', color: 'var(--green)' },
  TC:  { background: '#e0f2fe', color: '#0369a1' },
}

function ChevronIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      style={{ transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0, color: 'var(--text-muted)' }}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function StarRating({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} onClick={() => onChange(i)}
          style={{ fontSize: 22, cursor: 'pointer', opacity: value >= i ? 1 : 0.25, transition: 'opacity .15s' }}>
          ⭐
        </span>
      ))}
    </div>
  )
}

// ── Treadmill Card ────────────────────────────────────────

export function TreadmillCard({ workout, number, typelabel, stars, note, metrics, done, usedSessionIds = [], onStar, onSave, dateLabel, defaultOpen = false }) {
  const [open, setOpen] = useState(Boolean(defaultOpen))
  const [localNote, setLocalNote] = useState(note || '')
  const [localMetrics, setLocalMetrics] = useState(() => cleanMetrics(metrics))
  const [pullMessage, setPullMessage] = useState('')
  const [pulling, setPulling] = useState(false)

  useEffect(() => {
    setLocalNote(note || '')
  }, [note])

  useEffect(() => {
    setLocalMetrics(cleanMetrics(metrics))
  }, [metrics?.hrAvg, metrics?.hrMax, metrics?.kcal, metrics?.vo2, metrics?.sessionId])

  return (
    <div style={cardStyle}>
      <div
        role="button"
        tabIndex={0}
        style={hdrStyle}
        onClick={() => setOpen(o => !o)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(o => !o) } }}
      >
        <Num value={number} done={done} type="t" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={titleStyle}>{typelabel} #{number}</div>
          <div style={subStyle}>
            {dateLabel ? `${dateLabel} · ` : ''}
            {workout.reps} · {workout.speed} km/h
            {hasMetrics(metrics) ? ` · ${metrics.hrAvg || metrics.hrMax} bpm` : ''}
          </div>
        </div>
        <ChevronIcon open={open} />
      </div>

      {open && (
        <div style={bodyStyle}>
          <Badge type={workout.type} label={workout.type} />
          <div style={gridStyle}>
            {[
              ['Επαναλήψεις', workout.reps],
              ['Ταχύτητα', `${workout.speed} km/h`],
              ['Κλίση', workout.incline],
              ['Ξεκούραση', workout.rest],
            ].map(([l, v]) => (
              <div key={l} style={cellStyle}>
                <div style={lblStyle}>{l}</div>
                <div style={valStyle}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
              Από το Band
            </div>
            <button
              type="button"
              disabled={pulling}
              onClick={async (event) => {
                event.stopPropagation()
                setPulling(true)
                setPullMessage('')
                try {
                  const result = await readLatestTreadmillFromBand(usedSessionIds)
                  if (!result.ok) {
                    setPullMessage(pullError(result.reason))
                    return
                  }
                  const next = cleanMetrics({ ...localMetrics, ...result.metrics })
                  setLocalMetrics(next)
                  onSave(localNote, next)
                  setPullMessage('Πέρασαν HR / kcal / VO2 από το τελευταίο workout του Band.')
                } catch {
                  setPullMessage('Αποτυχία ανάγνωσης από Health Connect.')
                } finally {
                  setPulling(false)
                }
              }}
              style={{
                width: '100%',
                marginBottom: 8,
                padding: 8,
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border-strong)',
                background: 'var(--surface-2)',
                color: 'var(--text)',
                fontSize: 13,
                fontFamily: 'inherit',
                fontWeight: 600,
                cursor: pulling ? 'default' : 'pointer',
              }}
            >
              {pulling ? 'Ανάγνωση Band…' : 'Πάρε HR / kcal / VO2 από το Band'}
            </button>
            <div style={gridStyle}>
              <MetricField
                label="HR avg"
                value={localMetrics.hrAvg ?? ''}
                onChange={(value) => setLocalMetrics((prev) => ({ ...prev, hrAvg: value }))}
              />
              <MetricField
                label="HR max"
                value={localMetrics.hrMax ?? ''}
                onChange={(value) => setLocalMetrics((prev) => ({ ...prev, hrMax: value }))}
              />
              <MetricField
                label="kcal"
                value={localMetrics.kcal ?? ''}
                onChange={(value) => setLocalMetrics((prev) => ({ ...prev, kcal: value }))}
              />
              <MetricField
                label="VO2"
                value={localMetrics.vo2 ?? ''}
                onChange={(value) => setLocalMetrics((prev) => ({ ...prev, vo2: value }))}
              />
            </div>
            {pullMessage && (
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.4 }}>
                {pullMessage}
              </div>
            )}
          </div>
          <Feedback stars={stars} note={localNote} onStar={onStar}
            onNoteChange={setLocalNote} onSave={() => onSave(localNote, localMetrics)} />
        </div>
      )}
    </div>
  )
}

// ── Bodyweight Card ───────────────────────────────────────

export function BodyweightCard({ session, number, stars, note, done, onStar, onSave, dateLabel, defaultOpen = false }) {
  const [open, setOpen] = useState(Boolean(defaultOpen))
  const [localNote, setLocalNote] = useState(note || '')
  const isBW = session.type === 'BW'
  const exercise = session.exercises[0]

  useEffect(() => {
    setLocalNote(note || '')
  }, [note])

  return (
    <div style={cardStyle}>
      <div
        role="button"
        tabIndex={0}
        style={hdrStyle}
        onClick={() => setOpen(o => !o)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(o => !o) } }}
      >
        <Num value={session.day || number} done={done} type={isBW ? 'b' : 't'} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={titleStyle}>Day {session.day || number} · {session.title}</div>
          <div style={subStyle}>{dateLabel ? `${dateLabel} · ` : ''}{session.struct}</div>
        </div>
        <ChevronIcon open={open} />
      </div>

      {open && (
        <div style={bodyStyle}>
          <div style={{ paddingTop: 10 }}>
            <Badge type={session.type} label={isBW
              ? `Army Chair${session.cycle > 1 ? ` · Cycle ${session.cycle}` : ''}`
              : `Chair Tai Chi${session.cycle > 1 ? ` · Cycle ${session.cycle}` : ''}`} />
          </div>

          {session.program && session.day && (
            <div style={{
              marginTop: 10,
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid var(--border)',
              background: 'var(--surface-2)',
            }}>
              <Suspense fallback={<div style={{ aspectRatio: '1 / 1', background: 'var(--surface-2)' }} />}>
                <ExerciseArt program={session.program} day={session.day} label={exercise?.name} />
              </Suspense>
            </div>
          )}

          <div style={{ marginTop: 10 }}>
            <div style={exNameStyle}>{exercise?.name}</div>
            <div style={exSetsStyle}>{exercise?.sets}</div>
            <div style={exDescStyle}>{exercise?.desc}</div>
          </div>

          {session.note && <div style={{ ...snoteStyle, marginTop: 8 }}>💡 {session.note}</div>}

          <Feedback stars={stars} note={localNote} onStar={onStar}
            onNoteChange={setLocalNote} onSave={() => onSave(localNote)} />
        </div>
      )}
    </div>
  )
}

// ── Shared sub-components ─────────────────────────────────

function Num({ value, done, type }) {
  const colors = {
    t: { bg: 'var(--accent-light)', color: 'var(--accent)' },
    b: { bg: 'var(--green-light)', color: 'var(--green)' },
  }
  const col = done ? { bg: 'var(--green-light)', color: 'var(--green)' } : colors[type]
  return (
    <div style={{ width: 30, height: 30, borderRadius: '50%', fontSize: 12, fontWeight: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      background: col.bg, color: col.color }}>
      {done ? '✓' : value}
    </div>
  )
}

function Badge({ type, label }) {
  const hiit = { background: '#fef9c3', color: '#854d0e' }
  const s = type === 'HIIT' ? hiit : (BADGE_STYLE[type] || BADGE_STYLE.TC)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 10, fontWeight: 600,
      padding: '2px 8px', borderRadius: 99, ...s }}>
      {label}
    </span>
  )
}

function pullError(reason) {
  if (reason === 'browser' || reason === 'missing-plugin') {
    return 'Ο αυτόματος συγχρονισμός δουλεύει από την Android εφαρμογή, αφού το Mi Fitness γράψει στο Health Connect. Άνοιξε το Mi Fitness μετά το διάδρομο και μετά πάτα το κουμπί από το κινητό app.'
  }
  if (reason === 'not-installed') return 'Εγκατέστησε το Health Connect στο κινητό.'
  if (reason === 'not-supported') return 'Το Health Connect δεν υποστηρίζεται σε αυτή τη συσκευή.'
  if (reason === 'no-data') return 'Δεν βρέθηκε πρόσφατο workout με HR/kcal. Σύγχρονισε πρώτα το Band στο Mi Fitness και ξαναπροσπάθησε.'
  return 'Δεν ήταν δυνατή η ανάγνωση από το Band.'
}

function MetricField({ label, value, onChange }) {
  return (
    <label style={cellStyle} onClick={(event) => event.stopPropagation()}>
      <div style={lblStyle}>{label}</div>
      <input
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: '100%',
          border: 'none',
          background: 'transparent',
          color: 'var(--text)',
          fontSize: 12,
          fontWeight: 600,
          fontFamily: 'inherit',
          outline: 'none',
          padding: 0,
        }}
      />
    </label>
  )
}

function Feedback({ stars, note, onStar, onNoteChange, onSave }) {
  const [saved, setSaved] = useState(false)
  const handleSave = () => {
    onSave()
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }
  return (
    <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>Πώς πήγε;</div>
      <StarRating value={stars} onChange={onStar} />
      <textarea value={note} onChange={e => onNoteChange(e.target.value)}
        placeholder="Σχόλια, ένταση, παρατηρήσεις..."
        style={{ width: '100%', resize: 'none', minHeight: 52, fontSize: 13,
          fontFamily: 'inherit', padding: '8px 10px', borderRadius: 'var(--radius)',
          border: '1px solid var(--border)', background: 'var(--surface-2)',
          color: 'var(--text)', outline: 'none' }} />
      <button onClick={handleSave}
        style={{ marginTop: 6, width: '100%', padding: 8, borderRadius: 'var(--radius)',
          border: '1px solid var(--border-strong)', background: 'transparent',
          color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', fontWeight: 500,
          cursor: 'pointer' }}>
        Αποθήκευση ✓
      </button>
      {saved && <div style={{ fontSize: 12, color: 'var(--green)', textAlign: 'center', marginTop: 4 }}>Αποθηκεύτηκε!</div>}
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────

const cardStyle = {
  background: 'var(--surface)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)', marginBottom: 8, overflow: 'hidden',
}
const hdrStyle = {
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '12px 14px', cursor: 'pointer', userSelect: 'none',
}
const bodyStyle = { padding: '0 14px 14px', borderTop: '1px solid var(--border)' }
const titleStyle = { fontSize: 13, fontWeight: 600, color: 'var(--text)' }
const subStyle = { fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginTop: 10 }
const cellStyle = { background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: '8px 10px' }
const lblStyle = { fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }
const valStyle = { fontSize: 12, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }
const snoteStyle = { fontSize: 11, color: 'var(--text-secondary)', background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: '6px 9px', lineHeight: 1.5 }
const exCardStyle = { background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: 6, overflow: 'hidden' }
const exHdrStyle = { display: 'flex', alignItems: 'flex-start', gap: 8, padding: '9px 10px' }
const exNumStyle = { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', minWidth: 20, paddingTop: 1 }
const exNameStyle = { fontSize: 12, fontWeight: 600, color: 'var(--text)' }
const exSetsStyle = { fontSize: 10, color: 'var(--accent)', fontWeight: 600, marginTop: 1 }
const exDescStyle = { fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }
const exFigStyle = { borderTop: '1px solid var(--border)', padding: '10px 0 6px', display: 'flex', justifyContent: 'center', background: 'var(--surface)' }
