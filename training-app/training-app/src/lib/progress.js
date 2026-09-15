import {
  daysInMonth,
  daysInWeek,
  getSchedule,
  isDayDone,
  weekdayNumber,
} from '../data/schedule'

export const PROGRESS_RANGES = [
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'total', label: 'Total' },
]

const WEEKDAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function daysFor(range, dateKey) {
  if (range === 'week') return daysInWeek(dateKey)
  if (range === 'month') return daysInMonth(dateKey)
  return getSchedule()
}

export function progressFor(range, dateKey, doneMaps) {
  const days = daysFor(range, dateKey)
  const training = days.filter((day) => day.kind === 'train')
  const done = training.filter((day) => isDayDone(day, doneMaps))
  return {
    done: done.length,
    total: training.length,
    pct: training.length ? Math.round((done.length / training.length) * 100) : 0,
  }
}

export function weekActivity(dateKey, doneMaps) {
  return daysInWeek(dateKey).map((day) => ({
    date: day.date,
    letter: WEEKDAY_LETTERS[weekdayNumber(day.date) - 1],
    kind: day.kind,
    role: day.primary || day.role,
    done: isDayDone(day, doneMaps),
  }))
}

export function completionStreak(dateKey, doneMaps) {
  const past = getSchedule().filter((day) => day.date <= dateKey)
  let streak = 0
  for (let index = past.length - 1; index >= 0; index -= 1) {
    const day = past[index]
    if (day.kind === 'rest') continue
    if (isDayDone(day, doneMaps)) {
      streak += 1
      continue
    }
    if (day.date === dateKey) continue
    break
  }
  return streak
}

export function splitProgress(range, dateKey, doneMaps) {
  const days = daysFor(range, dateKey).filter((day) => day.kind === 'train')
  const treadmill = days.filter((day) => day.treadmill)
  const chair = days.filter((day) => day.armyChair || (!day.treadmill && day.taiChi))
  const count = (list, done) => ({
    done: list.filter(done).length,
    total: list.length,
  })
  return {
    treadmill: count(treadmill, (day) => Boolean(doneMaps.tDone?.[day.treadmill.id])),
    chair: count(chair, (day) => {
      const session = day.armyChair || day.taiChi
      return Boolean(session && doneMaps.bDone?.[session.id])
    }),
  }
}

export function hrTrend(schedule, tMetrics) {
  return schedule
    .filter((day) => day.treadmill && Number(tMetrics?.[day.treadmill.id]?.hrAvg) > 0)
    .slice(-8)
    .map((day) => ({
      date: day.date,
      hr: Number(tMetrics[day.treadmill.id].hrAvg),
    }))
}
