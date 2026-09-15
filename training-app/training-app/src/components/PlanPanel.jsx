import { useMemo, useState } from 'react'
import { TREAD_TYPE_LABEL } from '../data/treadmill'
import {
  daysInWeek,
  formatDateLabel,
  getDay,
  monthKey,
  PROGRAM_END,
  PROGRAM_START,
} from '../data/schedule'
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
          </p>
          <DayWorkouts
            day={day}
            isToday={day.date === todayKey}
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
            onStartHiit={startPlanHiit}
          />
          <DayHiit key={day.date} day={day} sessionId={planHiitId} onSessionId={setPlanHiitId} />
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
  isToday,
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

  return (
    <>
      {day.treadmill && (
        <TreadmillCard
          workout={day.treadmill}
          number={day.trainingNumber}
          typelabel={TREAD_TYPE_LABEL[day.treadmill.type]}
          stars={tStars[day.treadmill.id] || 0}
          note={tNotes[day.treadmill.id] || ''}
          metrics={tMetrics[day.treadmill.id]}
          usedSessionIds={usedSessionIds(tMetrics, day.treadmill.id)}
          done={!!tDone[day.treadmill.id]}
          dateLabel={formatDateLabel(day.date)}
          defaultOpen={isToday}
          onStar={(val) => onTStar(day.treadmill.id, val)}
          onSave={(note, metrics) => onTSave(day.treadmill.id, note, metrics)}
        />
      )}
      {day.taiChi && (
        <BodyweightCard
          session={day.taiChi}
          number={day.taiChi.day}
          stars={bStars[day.taiChi.id] || 0}
          note={bNotes[day.taiChi.id] || ''}
          done={!!bDone[day.taiChi.id]}
          dateLabel={formatDateLabel(day.date)}
          defaultOpen={isToday && !day.treadmill}
          onStar={(val) => onBStar(day.taiChi.id, val)}
          onSave={(note) => onBSave(day.taiChi.id, note)}
          onStartHiit={() => onStartHiit?.(day.taiChi)}
        />
      )}
      {day.armyChair && (
        <BodyweightCard
          session={day.armyChair}
          number={day.armyChair.day}
          stars={bStars[day.armyChair.id] || 0}
          note={bNotes[day.armyChair.id] || ''}
          done={!!bDone[day.armyChair.id]}
          dateLabel={formatDateLabel(day.date)}
          defaultOpen={false}
          onStar={(val) => onBStar(day.armyChair.id, val)}
          onSave={(note) => onBSave(day.armyChair.id, note)}
          onStartHiit={() => onStartHiit?.(day.armyChair)}
        />
      )}
    </>
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
