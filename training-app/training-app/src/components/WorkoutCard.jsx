import { useEffect, useState } from 'react'

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

export function TreadmillCard({ workout, number, typelabel, stars, note, done, onStar, onSave }) {
  const [open, setOpen] = useState(false)
  const [localNote, setLocalNote] = useState(note || '')

  useEffect(() => {
    setLocalNote(note || '')
  }, [note])

  return (
    <div style={cardStyle}>
      <div style={hdrStyle} onClick={() => setOpen(o => !o)}>
        <Num value={number} done={done} type="t" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={titleStyle}>{typelabel} #{number}</div>
          <div style={subStyle}>{workout.reps} · {workout.speed} km/h</div>
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
          <Feedback stars={stars} note={localNote} onStar={onStar}
            onNoteChange={setLocalNote} onSave={() => onSave(localNote)} />
        </div>
      )}
    </div>
  )
}

// ── Bodyweight Card ───────────────────────────────────────

export function BodyweightCard({ session, number, stars, note, done, onStar, onSave, illustrations }) {
  const [open, setOpen] = useState(false)
  const [localNote, setLocalNote] = useState(note || '')
  const isBW = session.type === 'BW'

  useEffect(() => {
    setLocalNote(note || '')
  }, [note])

  return (
    <div style={cardStyle}>
      <div style={hdrStyle} onClick={() => setOpen(o => !o)}>
        <Num value={number} done={done} type={isBW ? 't' : 'b'} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={titleStyle}>{session.title}</div>
          <div style={subStyle}>{session.struct}</div>
        </div>
        <ChevronIcon open={open} />
      </div>

      {open && (
        <div style={bodyStyle}>
          <Badge type={session.type} label={isBW ? 'Army Chair 28-Day' : 'Chair Tai Chi 28-Day'} />
          <Badge type="HIIT" label="9' HIIT" style={{ marginLeft: 4 }} />

          <div style={{ ...snoteStyle, marginTop: 8 }}>{session.struct}</div>

          <div style={{ marginTop: 10 }}>
            {session.exercises.map((ex, i) => {
              const fig = illustrations?.[ex.name]
              return (
                <div key={i} style={exCardStyle}>
                  <div style={exHdrStyle}>
                    <span style={exNumStyle}>{i + 1}.</span>
                    <div style={{ flex: 1 }}>
                      <div style={exNameStyle}>{ex.name}</div>
                      <div style={exSetsStyle}>{ex.sets}</div>
                      <div style={exDescStyle}>{ex.desc}</div>
                    </div>
                  </div>
                  {fig && (
                    <div style={exFigStyle}>{fig}</div>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ ...snoteStyle, marginTop: 8 }}>💡 {session.note}</div>

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
