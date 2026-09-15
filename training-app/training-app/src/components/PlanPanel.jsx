import { useEffect, useMemo, useState } from 'react'
import { TREAD_TYPE_LABEL } from '../data/treadmill'
import {
  daysInWeek,
  formatDateLabel,
  getDay,
  isDayDone,
  monthKey,
  PROGRAM_END,
  PROGRAM_START,
} from '../data/schedule'
import { hasMetrics } from '../lib/band'
import { CalendarMonth } from './CalendarMonth'
import { ReminderSettings } from './ReminderSettings'
import { RestCard } from './RestCard'
import { HiitTimer } from './HiitTimer'
import { BodyweightCard, TreadmillCard } from './WorkoutCard'

function shiftMonth(yearMonth, delta) {
  const [year, month] = yearMonth.split('-').map(Number)
  const date = new Date(year, month - 1 + delta, 1)
  const next = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  if (next < PROGRAM_START.slice(0, 7) || next > PROGRAM_END.slice(0, 7)) return yearMonth
  return next
}

export function PlanPanel({
  selected,
  todayKey,
  onSelect,
  tDone,
  bDone,
  tStars,
  bStars,
  tNotes,
  bNotes,
  tMetrics,
  usedSessionIds,
  reminders,
  onRemindersChange,
  onTStar,
  onTSave,
  onBStar,
  onBSave,
}) {
  const [month, setMonth] = useState(monthKey(selected || todayKey))
  const [planHiitId, setPlanHiitId] = useState('')
  const day = getDay(selected) || getDay(todayKey)
  const week = useMemo(() => daysInWeek(selected || todayKey), [selected, todayKey])

  useEffect(() => {
    setMonth(monthKey(selected || todayKey))
  }, [selected, todayKey])

  const startPlanHiit = (session) => {
    setPlanHiitId(session.id)
    window.requestAnimationFrame(() => {
      document.getElementById('hiit-timer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <button type="button" onClick={() => setMonth((value) => shiftMonth(value, -1))} style={navBtn}>‹</button>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Plan to 31 Dec</h2>
        <button type="button" onClick={() => setMonth((value) => shiftMonth(value, 1))} style={navBtn}>›</button>
      </div>

      <CalendarMonth
        dateKey={`${month}-01`}
        selected={selected}
        todayKey={todayKey}
        tDone={tDone}
        bDone={bDone}
        onSelect={(date) => {
          onSelect(date)
          setMonth(monthKey(date))
        }}
      />

      {day && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
            {day.date === todayKey ? 'Today' : formatDateLabel(day.date)}
            {day.block?.label ? ` · ${day.block.label}` : ''}
            {day.kind === 'train' ? (isDayDone(day, { tDone, bDone }) ? ' · Done' : ' · Planned') : ''}
          </p>
          <DayLog
            day={day}
            tStars={tStars}
            bStars={bStars}
            tNotes={tNotes}
            bNotes={bNotes}
            tMetrics={tMetrics}
          />
          <DayWorkouts
            day={day}
            tDone={tDone}
            bDone={bDone}
            tStars={tStars}
            bStars={bStars}
            tNotes={tNotes}
            bNotes={bNotes}
            tMetrics={tMetrics}
            usedSessionIds={usedSessionIds}
            onTStar={onTStar}
            onTSave={onTSave}
            onBStar={onBStar}
            onBSave={onBSave}
            onStartHiit={day.date >= todayKey ? startPlanHiit : undefined}
          />
          {day.date >= todayKey && (
            <DayHiit key={day.date} day={day} sessionId={planHiitId} onSessionId={setPlanHiitId} />
          )}
        </div>
      )}

      <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em', margin: '8px 0 6px' }}>
        This week
      </p>
      {week.map((item) => (
        <button
          key={item.date}
          type="button"
          onClick={() => {
            onSelect(item.date)
            setMonth(monthKey(item.date))
          }}
          style={{
            width: '100%',
            textAlign: 'left',
            border: item.date === selected ? '1px solid var(--border-strong)' : '1px solid var(--border)',
            background: item.date === todayKey ? 'var(--surface)' : 'var(--surface-2)',
            borderRadius: 'var(--radius)',
            padding: '8px 10px',
            marginBottom: 6,
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 650, color: 'var(--text)' }}>
            {formatDateLabel(item.date)}
            {item.kind === 'train' ? ` · #${item.trainingNumber}` : ' · Rest'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            {item.kind === 'rest'
              ? item.label
              : item.treadmill
                ? `${TREAD_TYPE_LABEL[item.treadmill.type]} ${item.treadmill.reps}${item.taiChi ? ' + Tai Chi' : ''}`
                : (item.taiChi || item.armyChair)?.title}
          </div>
        </button>
      ))}

      <ReminderSettings
        reminders={reminders}
        onChange={onRemindersChange}
        today={getDay(todayKey)}
      />
    </div>
  )
}

function DayWorkouts({
  day,
  tDone,
  bDone,
  tStars,
  bStars,
  tNotes,
  bNotes,
  tMetrics,
  usedSessionIds,
  onTStar,
  onTSave,
  onBStar,
  onBSave,
  onStartHiit,
}) {
  if (day.kind === 'rest') return <RestCard day={day} />
  const open = true

  return (
    <>
      {day.treadmill && (
        <TreadmillCard
          key={day.treadmill.id}
          workout={day.treadmill}
          number={day.trainingNumber}
          typelabel={TREAD_TYPE_LABEL[day.treadmill.type]}
          stars={tStars[day.treadmill.id] || 0}
          note={tNotes[day.treadmill.id] || ''}
          metrics={tMetrics[day.treadmill.id]}
          usedSessionIds={usedSessionIds(tMetrics, day.treadmill.id)}
          done={!!tDone[day.treadmill.id]}
          dateLabel={formatDateLabel(day.date)}
          defaultOpen={open}
          onStar={(val) => onTStar(day.treadmill.id, val)}
          onSave={(note, metrics) => onTSave(day.treadmill.id, note, metrics)}
        />
      )}
      {day.taiChi && (
        <BodyweightCard
          key={day.taiChi.id}
          session={day.taiChi}
          number={day.taiChi.day}
          stars={bStars[day.taiChi.id] || 0}
          note={bNotes[day.taiChi.id] || ''}
          done={!!bDone[day.taiChi.id]}
          dateLabel={formatDateLabel(day.date)}
          defaultOpen={open}
          onStar={(val) => onBStar(day.taiChi.id, val)}
          onSave={(note) => onBSave(day.taiChi.id, note)}
          onStartHiit={onStartHiit ? () => onStartHiit(day.taiChi) : undefined}
        />
      )}
      {day.armyChair && (
        <BodyweightCard
          key={day.armyChair.id}
          session={day.armyChair}
          number={day.armyChair.day}
          stars={bStars[day.armyChair.id] || 0}
          note={bNotes[day.armyChair.id] || ''}
          done={!!bDone[day.armyChair.id]}
          dateLabel={formatDateLabel(day.date)}
          defaultOpen={open}
          onStar={(val) => onBStar(day.armyChair.id, val)}
          onSave={(note) => onBSave(day.armyChair.id, note)}
          onStartHiit={onStartHiit ? () => onStartHiit(day.armyChair) : undefined}
        />
      )}
    </>
  )
}

function DayLog({ day, tStars, bStars, tNotes, bNotes, tMetrics }) {
  if (!day || day.kind !== 'train') return null

  const rows = []
  if (day.treadmill) {
    const metrics = tMetrics[day.treadmill.id]
    const note = (tNotes[day.treadmill.id] || '').trim()
    const stars = tStars[day.treadmill.id] || 0
    if (hasMetrics(metrics) || note || stars) {
      rows.push({
        key: day.treadmill.id,
        title: `${TREAD_TYPE_LABEL[day.treadmill.type]} #${day.trainingNumber}`,
        stars,
        note,
        stats: [
          metrics?.hrAvg ? `HR avg ${metrics.hrAvg}` : null,
          metrics?.hrMax ? `HR max ${metrics.hrMax}` : null,
          metrics?.kcal ? `${metrics.kcal} kcal` : null,
          metrics?.vo2 ? `VO2 ${metrics.vo2}` : null,
        ].filter(Boolean),
      })
    }
  }
  for (const session of [day.taiChi, day.armyChair].filter(Boolean)) {
    const note = (bNotes[session.id] || '').trim()
    const stars = bStars[session.id] || 0
    if (note || stars) {
      rows.push({
        key: session.id,
        title: session.title,
        stars,
        note,
        stats: [session.struct],
      })
    }
  }

  if (!rows.length) return null

  return (
    <div style={{
      background: 'var(--green-light)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '10px 12px',
      marginBottom: 8,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 6 }}>
        Logged after training
      </div>
      {rows.map((row) => (
        <div key={row.key} style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 650 }}>{row.title}</div>
          {row.stars > 0 && (
            <div style={{ fontSize: 12, marginTop: 2 }}>{'★'.repeat(row.stars)}{'☆'.repeat(5 - row.stars)}</div>
          )}
          {row.stats.length > 0 && (
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              {row.stats.join(' · ')}
            </div>
          )}
          {row.note && (
            <div style={{ fontSize: 12, color: 'var(--text)', marginTop: 4, lineHeight: 1.45 }}>{row.note}</div>
          )}
        </div>
      ))}
    </div>
  )
}

function DayHiit({ day, sessionId, onSessionId }) {
  const options = [day.taiChi, day.armyChair].filter(Boolean)
  const session = options.find((item) => item.id === sessionId) || options[0]
  if (!session) return null

  return (
    <div style={{ marginTop: 8 }}>
      {options.length > 1 && (
        <div style={{
          display: 'flex',
          gap: 4,
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius)',
          padding: 3,
          marginBottom: 8,
        }}>
          {options.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSessionId(item.id)}
              style={{
                flex: 1,
                padding: '6px 8px',
                border: session.id === item.id ? '1px solid var(--border)' : 'none',
                background: session.id === item.id ? 'var(--surface)' : 'transparent',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text)',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              {item.program === 'ac' ? 'Army Chair HIIT' : 'Tai Chi HIIT'}
            </button>
          ))}
        </div>
      )}
      <HiitTimer key={session.id} session={session} dateLabel={formatDateLabel(day.date)} />
    </div>
  )
}

const navBtn = {
  width: 32,
  height: 32,
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--surface-2)',
  color: 'var(--text)',
  font: 'inherit',
  cursor: 'pointer',
}
