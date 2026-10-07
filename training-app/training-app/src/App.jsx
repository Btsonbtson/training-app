import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { TREAD_TYPE_LABEL } from './data/treadmill'
import {
  athensDateKey,
  formatDateLabel,
  getSchedule,
  nextBodySession,
  weekStart,
} from './data/schedule'
import { TreadmillCard, BodyweightCard, IsoCard } from './components/WorkoutCard'
import { isoPhases } from './data/isometric'
import { ThemeToggle, applyTheme, resolveTheme } from './components/ThemeToggle'
import { HiitTimer } from './components/HiitTimer'
import { AccountBar } from './components/AccountBar'
import { BandPanel } from './components/BandPanel'
import { PlanPanel } from './components/PlanPanel'
import { ProgressCharts } from './components/ProgressCharts'
import { useStorage } from './hooks/useStorage'
import { cleanMetrics, hasMetrics, usedSessionIds } from './lib/band'
import {
  completionStreak,
  hrTrend,
  progressFor,
  PROGRESS_RANGES,
  rangeActivity,
  splitProgress,
} from './lib/progress'

const ProgramPoster = lazy(() =>
  import('./components/PosterArt').then((mod) => ({ default: mod.ProgramPoster }))
)

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

function findHiitFocus(schedule, program, focusId, todayKey) {
  if (focusId) {
    for (const day of schedule) {
      const session = program === 'ac' ? day.armyChair : day.taiChi
      if (session?.id === focusId) {
        return { session, date: day.date, isToday: day.date === todayKey }
      }
    }
  }
  return nextBodySession(todayKey, program)
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

function countNotes(notes) {
  return Object.values(notes).filter((note) => typeof note === 'string' && note.trim()).length
}

function averageRating(...starMaps) {
  const ratings = starMaps.flatMap((map) => Object.values(map)).filter((value) => Number(value) > 0)
  if (!ratings.length) return '—'
  const avg = ratings.reduce((sum, value) => sum + Number(value), 0) / ratings.length
  return avg.toFixed(1)
}

function groupByWeek(days) {
  const groups = []
  for (const day of days) {
    const key = weekStart(day.date)
    const last = groups[groups.length - 1]
    if (!last || last.key !== key) {
      groups.push({ key, days: [day] })
    } else {
      last.days.push(day)
    }
  }
  return groups
}

export default function App() {
  const [tab, setTab] = useStorage('tp_tab', 'plan')
  const [theme, setTheme] = useStorage('tp_theme', 'system')
  const [progressRange, setProgressRange] = useStorage('tp_prog_range', 'week')
  const [reminders, setReminders] = useStorage('tp_reminders', { enabled: false, phone: '', apiKey: '' })

  const [tStars, setTStars] = useStorage('tp_ts', {})
  const [tNotes, setTNotes] = useStorage('tp_tn', {})
  const [tDone, setTDone] = useStorage('tp_td', {})

  const [bStars, setBStars] = useStorage('tp_bs', {})
  const [bNotes, setBNotes] = useStorage('tp_bn', {})
  const [bDone, setBDone] = useStorage('tp_bd', {})
  const [bwProgram, setBwProgram] = useStorage('tp_bw_prog', 'tc')
  const [hiitFocusId, setHiitFocusId] = useState(null)
  const [band, setBand] = useStorage('tp_band', { lastSync: null, source: null, days: {} })
  const [tMetrics, setTMetrics] = useStorage('tp_tm', {})

  // Isometric — new keys only (tp_is/tp_in/tp_id). Does not touch treadmill/bodyweight data.
  const [iStars, setIStars] = useStorage('tp_is', {})
  const [iNotes, setINotes] = useStorage('tp_in', {})
  const [iDone, setIDone] = useStorage('tp_id', {})

  const todayKey = athensDateKey()
  const [selectedDate, setSelectedDate] = useState(todayKey)
  const schedule = useMemo(() => getSchedule(), [])
  const range = progressRange === 'month' || progressRange === 'total' ? progressRange : 'week'

  useEffect(() => {
    const resolved = resolveTheme(theme)
    if (resolved !== theme) setTheme(resolved)
    applyTheme(resolved)
  }, [theme, setTheme])

  const activeTab = tab === 'b' ? 'b' : tab === 'band' ? 'band' : tab === 't' ? 't' : tab === 'i' ? 'i' : 'plan'
  const totalI = isoPhases.reduce((acc, ph) => acc + ph.workouts.length, 0)
  const doneI = Object.values(iDone).filter(Boolean).length
  const activeProgram = bwProgram === 'ac' ? 'ac' : 'tc'
  const doneMaps = { tDone, bDone }
  const progress = progressFor(range, selectedDate || todayKey, doneMaps)
  const activityBars = rangeActivity(range, selectedDate || todayKey, doneMaps, todayKey)
  const streak = completionStreak(todayKey, doneMaps)
  const split = splitProgress(range, selectedDate || todayKey, doneMaps)
  const hrPoints = hrTrend(schedule, tMetrics)
  const hiitFocus = findHiitFocus(schedule, activeProgram, hiitFocusId, todayKey)

  const treadDays = schedule.filter((day) => day.treadmill)
  const bodyDays = schedule.filter((day) => (activeProgram === 'ac' ? day.armyChair : day.taiChi))
  const treadDone = treadDays.filter((day) => tDone[day.treadmill.id]).length
  const bodyDone = bodyDays.filter((day) => {
    const session = activeProgram === 'ac' ? day.armyChair : day.taiChi
    return session && bDone[session.id]
  }).length

  const handleTStar = (id, val) => {
    setTStars((s) => ({ ...s, [id]: val }))
    if (val > 0) setTDone((d) => ({ ...d, [id]: true }))
  }
  const handleTSave = (id, note, metrics) => {
    const cleaned = cleanMetrics(metrics)
    setTNotes((n) => ({ ...n, [id]: note }))
    setTMetrics((current) => ({ ...current, [id]: cleaned }))
    if (tStars[id] > 0 || (note && note.trim()) || hasMetrics(cleaned)) {
      setTDone((d) => ({ ...d, [id]: true }))
    }
  }
  const handleBStar = (id, val) => {
    setBStars((s) => ({ ...s, [id]: val }))
    if (val > 0) setBDone((d) => ({ ...d, [id]: true }))
  }
  const handleBSave = (id, note) => {
    setBNotes((n) => ({ ...n, [id]: note }))
    if (bStars[id] > 0 || (note && note.trim())) {
      setBDone((d) => ({ ...d, [id]: true }))
    }
  }

  const handleIStar = (id, val) => {
    setIStars((s) => ({ ...s, [id]: val }))
    if (val > 0) setIDone((d) => ({ ...d, [id]: true }))
  }
  const handleISave = (id, note) => {
    setINotes((n) => ({ ...n, [id]: note }))
    if (iStars[id] > 0 || (note && note.trim())) {
      setIDone((d) => ({ ...d, [id]: true }))
    }
  }

  const handleStartHiit = (session) => {
    setHiitFocusId(session.id)
    setBwProgram(session.program === 'ac' ? 'ac' : 'tc')
    setTab('b')
    window.requestAnimationFrame(() => {
      document.getElementById('hiit-timer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
      <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-.02em' }}>Training Program</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              8 Sep – 31 Dec 2026 · Friday rest
            </p>
          </div>
          <ThemeToggle theme={theme} onChange={setTheme} />
        </div>
        <AccountBar />

        <div style={{
          display: 'flex',
          gap: 4,
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius)',
          padding: 3,
          marginTop: 12,
        }}>
          {PROGRESS_RANGES.map((item) => (
            <TabButton
              key={item.id}
              active={range === item.id}
              onClick={() => setProgressRange(item.id)}
              label={item.label}
            />
          ))}
        </div>

        <ProgressCharts
          progress={progress}
          bars={activityBars}
          range={range}
          streak={streak}
          split={split}
          hrPoints={hrPoints}
          notes={countNotes(tNotes) + countNotes(bNotes)}
          selected={selectedDate}
          onSelectDate={(date) => {
            setSelectedDate(date)
            setTab('plan')
          }}
        />
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>
          {progress.done} / {progress.total} sessions
          {averageRating(tStars, bStars) !== '—' ? ` · avg ${averageRating(tStars, bStars)}★` : ''}
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
        <TabButton active={activeTab === 'plan'} onClick={() => setTab('plan')} label="Plan" />
        <TabButton
          active={activeTab === 't'}
          onClick={() => setTab('t')}
          label="Treadmill"
        />
        <TabButton
          active={activeTab === 'b'}
          onClick={() => setTab('b')}
          label="Bodyweight"
        />
        <TabButton
          active={activeTab === 'i'}
          onClick={() => setTab('i')}
          label="Iso"
        />
        <TabButton
          active={activeTab === 'band'}
          onClick={() => setTab('band')}
          label="Band"
        />
      </div>

      {activeTab === 'i' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Isometric · 12 εβδομάδες</h2>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{doneI} / {totalI}</span>
          </div>
          <ProgressBar done={doneI} total={totalI} color="#0e7490" />
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.45 }}>
            Ίδιες φωτογραφίες. W1 από το μηδέν → W12 πλήρες (3×60 · 3×80 · 3×90 · 3×90 · 2×30).
            Τα Plan / Treadmill / Bodyweight δεδομένα σου μένουν ανέπαφα.
          </p>
          {isoPhases.map((ph) => (
            <div key={ph.label}>
              <PhaseLabel label={ph.label} />
              {ph.workouts.map((session) => (
                <IsoCard
                  key={session.id}
                  session={session}
                  number={session.week || 1}
                  stars={iStars[session.id] || 0}
                  note={iNotes[session.id] || ''}
                  done={!!iDone[session.id]}
                  onStar={(val) => handleIStar(session.id, val)}
                  onSave={(note) => handleISave(session.id, note)}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'plan' && (
        <PlanPanel
          selected={selectedDate}
          todayKey={todayKey}
          onSelect={setSelectedDate}
          tDone={tDone}
          bDone={bDone}
          tStars={tStars}
          bStars={bStars}
          tNotes={tNotes}
          bNotes={bNotes}
          tMetrics={tMetrics}
          usedSessionIds={usedSessionIds}
          reminders={reminders}
          onRemindersChange={setReminders}
          onTStar={handleTStar}
          onTSave={handleTSave}
          onBStar={handleBStar}
          onBSave={handleBSave}
        />
      )}

      {activeTab === 't' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Treadmill</h2>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{treadDone} / {treadDays.length}</span>
          </div>
          <ProgressBar done={treadDone} total={treadDays.length} color="var(--accent)" />
          {groupByWeek(treadDays).map((group) => (
            <div key={group.key}>
              <PhaseLabel label={`${formatDateLabel(group.key)} week`} />
              {group.days.map((day) => (
                <TreadmillCard
                  key={day.treadmill.id}
                  workout={day.treadmill}
                  number={day.treadmillIndex}
                  typelabel={TREAD_TYPE_LABEL[day.treadmill.type]}
                  stars={tStars[day.treadmill.id] || 0}
                  note={tNotes[day.treadmill.id] || ''}
                  metrics={tMetrics[day.treadmill.id]}
                  usedSessionIds={usedSessionIds(tMetrics, day.treadmill.id)}
                  done={!!tDone[day.treadmill.id]}
                  dateLabel={formatDateLabel(day.date)}
                  defaultOpen={day.date === todayKey}
                  onStar={(val) => handleTStar(day.treadmill.id, val)}
                  onSave={(note, metrics) => handleTSave(day.treadmill.id, note, metrics)}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'band' && (
        <BandPanel band={band} onChange={setBand} />
      )}

      {activeTab === 'b' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Bodyweight · 9' HIIT</h2>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{bodyDone} / {bodyDays.length}</span>
          </div>
          <ProgressBar done={bodyDone} total={bodyDays.length} color="var(--green)" />
          <HiitTimer
            key={hiitFocus?.session?.id || 'empty'}
            session={hiitFocus?.session}
            dateLabel={hiitFocus ? `${hiitFocus.isToday ? 'Today' : formatDateLabel(hiitFocus.date)}` : ''}
          />

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

          <Suspense fallback={null}>
            <ProgramPoster program={activeProgram} />
          </Suspense>

          {groupByWeek(bodyDays).map((group) => (
            <div key={group.key}>
              <PhaseLabel label={`${formatDateLabel(group.key)} week`} />
              {group.days.map((day) => {
                const session = activeProgram === 'ac' ? day.armyChair : day.taiChi
                return (
                  <BodyweightCard
                    key={session.id}
                    session={session}
                    number={session.day}
                    stars={bStars[session.id] || 0}
                    note={bNotes[session.id] || ''}
                    done={!!bDone[session.id]}
                    dateLabel={formatDateLabel(day.date)}
                    defaultOpen={day.date === todayKey}
                    onStar={(val) => handleBStar(session.id, val)}
                    onSave={(note) => handleBSave(session.id, note)}
                    onStartHiit={() => handleStartHiit(session)}
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
