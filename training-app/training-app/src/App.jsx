import { useState } from 'react'
import { treadPhases, TREAD_TYPE_LABEL } from './data/treadmill'
import { bodyPhases } from './data/bodyweight'
import { isoPhases } from './data/isometric'
import { ILLUSTRATIONS } from './data/illustrations'
import { TreadmillCard, BodyweightCard, IsoCard } from './components/WorkoutCard'
import { useStorage } from './hooks/useStorage'

// ── Progress Bar ──────────────────────────────────────────

function ProgressBar({ done, total, color }) {
  return (
    <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, marginBottom: '1.25rem' }}>
      <div style={{ height: '100%', borderRadius: 2, background: color,
        width: `${(done / total) * 100}%`, transition: 'width .5s ease' }} />
    </div>
  )
}

// ── Phase Label ───────────────────────────────────────────

function PhaseLabel({ label }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase',
      letterSpacing: '.08em', padding: '0 2px', margin: '1.25rem 0 6px' }}>
      {label}
    </p>
  )
}

// ── Tab Button ────────────────────────────────────────────

function TabButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '8px 6px', border: active ? '1px solid var(--border)' : 'none',
      background: active ? 'var(--surface)' : 'transparent',
      borderRadius: 6, fontSize: 13, fontWeight: 500,
      color: active ? 'var(--text)' : 'var(--text-secondary)',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
    }}>
      {icon}
      {label}
    </button>
  )
}

// ── App ───────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState('i')

  // Treadmill state
  const [tStars, setTStars] = useStorage('tp_ts', {})
  const [tNotes, setTNotes] = useStorage('tp_tn', {})
  const [tDone,  setTDone]  = useStorage('tp_td', {})

  // Bodyweight state
  const [bStars, setBStars] = useStorage('tp_bs', {})
  const [bNotes, setBNotes] = useStorage('tp_bn', {})
  const [bDone,  setBDone]  = useStorage('tp_bd', {})

  // Isometric state
  const [iStars, setIStars] = useStorage('tp_is', {})
  const [iNotes, setINotes] = useStorage('tp_in', {})
  const [iDone,  setIDone]  = useStorage('tp_id', {})

  const totalT = treadPhases.reduce((acc, ph) => acc + ph.workouts.length, 0)
  const doneT  = Object.values(tDone).filter(Boolean).length

  const totalB = bodyPhases.reduce((acc, ph) => acc + ph.workouts.length, 0)
  const doneB  = Object.values(bDone).filter(Boolean).length

  const totalI = isoPhases.reduce((acc, ph) => acc + ph.workouts.length, 0)
  const doneI  = Object.values(iDone).filter(Boolean).length

  // Treadmill handlers
  let tNum = 0
  const handleTStar = (id, val) => {
    setTStars(s => ({ ...s, [id]: val }))
    if (val > 0) setTDone(d => ({ ...d, [id]: true }))
  }
  const handleTSave = (id, note) => {
    setTNotes(n => ({ ...n, [id]: note }))
    if (tStars[id] > 0) setTDone(d => ({ ...d, [id]: true }))
  }

  // Bodyweight handlers
  let bNum = 0
  const handleBStar = (id, val) => {
    setBStars(s => ({ ...s, [id]: val }))
    if (val > 0) setBDone(d => ({ ...d, [id]: true }))
  }
  const handleBSave = (id, note) => {
    setBNotes(n => ({ ...n, [id]: note }))
    if (bStars[id] > 0) setBDone(d => ({ ...d, [id]: true }))
  }

  // Isometric handlers
  let iNum = 0
  const handleIStar = (id, val) => {
    setIStars(s => ({ ...s, [id]: val }))
    if (val > 0) setIDone(d => ({ ...d, [id]: true }))
  }
  const handleISave = (id, note) => {
    setINotes(n => ({ ...n, [id]: note }))
    if (iStars[id] > 0) setIDone(d => ({ ...d, [id]: true }))
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-.02em' }}>Training Program</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
          Isometric · Treadmill · Chair Tai Chi · Army Chair
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--surface-2)',
        borderRadius: 'var(--radius)', padding: 3, marginBottom: '1.25rem' }}>
        <TabButton active={tab === 'i'} onClick={() => setTab('i')}
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>}
          label="Isometric" />
        <TabButton active={tab === 't'} onClick={() => setTab('t')}
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 4v7l3 3-3 3v3M6 20l3-3-3-3 3-3V4"/></svg>}
          label="Treadmill" />
        <TabButton active={tab === 'b'} onClick={() => setTab('b')}
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 8v4l3 3"/></svg>}
          label="Bodyweight" />
      </div>

      {/* Isometric Tab */}
      {tab === 'i' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Isometric · 12 εβδομάδες</h2>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{doneI} / {totalI}</span>
          </div>
          <ProgressBar done={doneI} total={totalI} color="#0e7490" />
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.45 }}>
            Ίδιες φωτογραφίες. Διάρκειες ανεβαίνουν προοδευτικά: W1 από το μηδέν → W12 πλήρες (3×60 · 3×80 · 3×90 · 3×90 · 2×30).
          </p>
          {isoPhases.map(ph => (
            <div key={ph.label}>
              <PhaseLabel label={ph.label} />
              {ph.workouts.map(session => {
                iNum++
                const n = iNum
                return (
                  <IsoCard key={session.id} session={session} number={n}
                    stars={iStars[session.id] || 0}
                    note={iNotes[session.id] || ''}
                    done={!!iDone[session.id]}
                    onStar={val => handleIStar(session.id, val)}
                    onSave={note => handleISave(session.id, note)} />
                )
              })}
            </div>
          ))}
        </div>
      )}

      {/* Treadmill Tab */}
      {tab === 't' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Treadmill</h2>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{doneT} / {totalT}</span>
          </div>
          <ProgressBar done={doneT} total={totalT} color="var(--accent)" />
          {treadPhases.map(ph => (
            <div key={ph.label}>
              <PhaseLabel label={ph.label} />
              {ph.workouts.map(w => {
                tNum++
                const n = tNum
                return (
                  <TreadmillCard key={w.id} workout={w} number={n}
                    typelabel={TREAD_TYPE_LABEL[w.type]}
                    stars={tStars[w.id] || 0}
                    note={tNotes[w.id] || ''}
                    done={!!tDone[w.id]}
                    onStar={val => handleTStar(w.id, val)}
                    onSave={note => handleTSave(w.id, note)} />
                )
              })}
            </div>
          ))}
        </div>
      )}

      {/* Bodyweight Tab */}
      {tab === 'b' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Bodyweight · 9' HIIT</h2>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{doneB} / {totalB}</span>
          </div>
          <ProgressBar done={doneB} total={totalB} color="var(--green)" />
          {bodyPhases.map(ph => (
            <div key={ph.label}>
              <PhaseLabel label={ph.label} />
              {ph.workouts.map(session => {
                bNum++
                const n = bNum
                return (
                  <BodyweightCard key={session.id} session={session} number={n}
                    stars={bStars[session.id] || 0}
                    note={bNotes[session.id] || ''}
                    done={!!bDone[session.id]}
                    illustrations={ILLUSTRATIONS}
                    onStar={val => handleBStar(session.id, val)}
                    onSave={note => handleBSave(session.id, note)} />
                )
              })}
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
