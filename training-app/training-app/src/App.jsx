import { useEffect } from 'react'
import { treadPhases, TREAD_TYPE_LABEL } from './data/treadmill'
import { bodyPhases } from './data/bodyweight'
import { ILLUSTRATIONS } from './data/illustrations'
import { TreadmillCard, BodyweightCard } from './components/WorkoutCard'
import { ThemeToggle } from './components/ThemeToggle'
import { HiitTimer } from './components/HiitTimer'
import { PosterCell, ProgramPoster } from './components/PosterArt'
import { useStorage } from './hooks/useStorage'

function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'light' || theme === 'dark') {
    root.setAttribute('data-theme', theme)
  } else {
    root.removeAttribute('data-theme')
  }
}

function ProgressBar({ done, total, color }) {
  return (
    <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, marginBottom: '1.25rem' }}>
      <div style={{
        height: '100%',
        borderRadius: 2,
        background: color,
        width: `${total ? (done / total) * 100 : 0}%`,
        transition: 'width .5s ease',
      }} />
    </div>
  )
}

function PhaseLabel({ label }) {
  return (
    <p style={{
      fontSize: 10,
      fontWeight: 600,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '.08em',
      padding: '0 2px',
      margin: '1.25rem 0 6px',
    }}>
      {label}
    </p>
  )
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '8px 6px', border: active ? '1px solid var(--border)' : 'none',
      background: active ? 'var(--surface)' : 'transparent',
      borderRadius: 6, fontSize: 13, fontWeight: 500,
      color: active ? 'var(--text)' : 'var(--text-secondary)',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
      boxShadow: active ? 'var(--shadow)' : 'none', transition: 'all .15s',
    }}>
      {icon}
      {label}
    </button>
  )
}

function Stat({ label, value }) {
  return (
    <div style={{
      flex: 1,
      minWidth: 0,
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '8px 10px',
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.02em', marginTop: 2 }}>
        {value}
      </div>
    </div>
  )
}

function countNotes(notes) {
  return Object.values(notes).filter((note) => typeof note === 'string' && note.trim()).length
}

function averageRating(...starMaps) {
  const ratings = starMaps.flatMap((map) => Object.values(map)).filter((value) => Number(value) > 0)
  if (!ratings.length) return '—'
  const avg = ratings.reduce((sum, value) => sum + Number(value), 0) / ratings.length
  return avg.toFixed(1)
}

export default function App() {
  const [tab, setTab] = useStorage('tp_tab', 't')
  const [theme, setTheme] = useStorage('tp_theme', 'system')

  const [tStars, setTStars] = useStorage('tp_ts', {})
  const [tNotes, setTNotes] = useStorage('tp_tn', {})
  const [tDone, setTDone] = useStorage('tp_td', {})

  const [bStars, setBStars] = useStorage('tp_bs', {})
  const [bNotes, setBNotes] = useStorage('tp_bn', {})
  const [bDone, setBDone] = useStorage('tp_bd', {})
  const [bwProgram, setBwProgram] = useStorage('tp_bw_prog', 'tc')

  useEffect(() => {
    applyTheme(theme === 'light' || theme === 'dark' ? theme : 'system')
  }, [theme])

  const activeTab = tab === 'b' ? 'b' : 't'
  const activeProgram = bwProgram === 'ac' ? 'ac' : 'tc'
  const visiblePhases = bodyPhases.filter((phase) => phase.program === activeProgram)
  const totalT = treadPhases.reduce((acc, ph) => acc + ph.workouts.length, 0)
  const doneT = Object.values(tDone).filter(Boolean).length
  const totalB = bodyPhases.reduce((acc, ph) => acc + ph.workouts.length, 0)
  const doneB = Object.values(bDone).filter(Boolean).length
  const visibleWorkouts = visiblePhases.flatMap((phase) => phase.workouts)
  const visibleDone = visibleWorkouts.filter((workout) => bDone[workout.id]).length
  const totalAll = totalT + totalB
  const doneAll = doneT + doneB
  const progressPct = totalAll ? Math.round((doneAll / totalAll) * 100) : 0

  let tNum = 0
  const handleTStar = (id, val) => {
    setTStars((s) => ({ ...s, [id]: val }))
    if (val > 0) setTDone((d) => ({ ...d, [id]: true }))
  }
  const handleTSave = (id, note) => {
    setTNotes((n) => ({ ...n, [id]: note }))
    if (tStars[id] > 0) setTDone((d) => ({ ...d, [id]: true }))
  }

  let bNum = 0
  const handleBStar = (id, val) => {
    setBStars((s) => ({ ...s, [id]: val }))
    if (val > 0) setBDone((d) => ({ ...d, [id]: true }))
  }
  const handleBSave = (id, note) => {
    setBNotes((n) => ({ ...n, [id]: note }))
    if (bStars[id] > 0) setBDone((d) => ({ ...d, [id]: true }))
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
      <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-.02em' }}>Training Program</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              Treadmill · Chair Tai Chi · Army Chair HIIT
            </p>
          </div>
          <ThemeToggle theme={theme === 'light' || theme === 'dark' ? theme : 'system'} onChange={setTheme} />
        </div>

        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
          <Stat label="Progress" value={`${progressPct}%`} />
          <Stat label="Saved notes" value={countNotes(tNotes) + countNotes(bNotes)} />
          <Stat label="Avg rating" value={averageRating(tStars, bStars)} />
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: 4,
        background: 'var(--surface-2)',
        borderRadius: 'var(--radius)',
        padding: 3,
        marginBottom: '1.25rem',
      }}>
        <TabButton
          active={activeTab === 't'}
          onClick={() => setTab('t')}
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 4v7l3 3-3 3v3M6 20l3-3-3-3 3-3V4"/></svg>}
          label="Treadmill"
        />
        <TabButton
          active={activeTab === 'b'}
          onClick={() => setTab('b')}
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 8v4l3 3"/></svg>}
          label="Bodyweight"
        />
      </div>

      {activeTab === 't' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Treadmill</h2>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{doneT} / {totalT}</span>
          </div>
          <ProgressBar done={doneT} total={totalT} color="var(--accent)" />
          {treadPhases.map((ph) => (
            <div key={ph.label}>
              <PhaseLabel label={ph.label} />
              {ph.workouts.map((w) => {
                tNum++
                const n = tNum
                return (
                  <TreadmillCard
                    key={w.id}
                    workout={w}
                    number={n}
                    typelabel={TREAD_TYPE_LABEL[w.type]}
                    stars={tStars[w.id] || 0}
                    note={tNotes[w.id] || ''}
                    done={!!tDone[w.id]}
                    onStar={(val) => handleTStar(w.id, val)}
                    onSave={(note) => handleTSave(w.id, note)}
                  />
                )
              })}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'b' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Bodyweight · 9' HIIT</h2>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{visibleDone} / {visibleWorkouts.length}</span>
          </div>
          <ProgressBar done={visibleDone} total={visibleWorkouts.length} color="var(--green)" />
          <HiitTimer />

          <div style={{
            display: 'flex',
            gap: 4,
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius)',
            padding: 3,
            marginBottom: '1rem',
          }}>
            <TabButton active={activeProgram === 'tc'} onClick={() => setBwProgram('tc')} label="Chair Tai Chi" />
            <TabButton active={activeProgram === 'ac'} onClick={() => setBwProgram('ac')} label="Army Chair" />
          </div>

          <ProgramPoster program={activeProgram} />

          {visiblePhases.map((ph) => (
            <div key={`${ph.program}-${ph.label}`}>
              <PhaseLabel label={`${ph.label} — ${ph.focus}`} />
              {ph.workouts.map((session) => {
                bNum++
                const n = bNum
                return (
                  <BodyweightCard
                    key={session.id}
                    session={session}
                    number={n}
                    stars={bStars[session.id] || 0}
                    note={bNotes[session.id] || ''}
                    done={!!bDone[session.id]}
                    illustrations={ILLUSTRATIONS}
                    thumb={<PosterCell program={session.program} day={session.day} label={session.title} compact />}
                    onStar={(val) => handleBStar(session.id, val)}
                    onSave={(note) => handleBSave(session.id, note)}
                  />
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
