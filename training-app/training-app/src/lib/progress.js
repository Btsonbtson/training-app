import {
  daysInMonth,
  daysInWeek,
  getSchedule,
  isDayDone,
  weekdayNumber,
  weekStart,
} from '../data/schedule'

export const PROGRESS_RANGES = [
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'total', label: 'Total' },
]

const WEEKDAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function daysFor(range, dateKey) {
  if (range === 'week') return daysInWeek(dateKey)
  if (range === 'month') return daysInMonth(dateKey)
  return getSchedule()
}

function groupBy(days, keyFor) {
  const groups = []
  for (const day of days) {
    const key = keyFor(day)
    const last = groups[groups.length - 1]
    if (!last || last.key !== key) groups.push({ key, days: [day] })
    else last.days.push(day)
  }
  return groups
}

function majorityRole(days) {
  const training = days.filter((day) => day.kind === 'train')
  const army = training.filter((day) => day.primary === 'army-chair').length
  const treadmill = training.filter((day) => day.primary === 'treadmill').length
  if (army > treadmill) return 'army-chair'
  if (treadmill) return 'treadmill'
  return training[0]?.primary || training[0]?.role || 'rest'
}

function periodBar(days, todayKey, doneMaps, letter, key) {
  const training = days.filter((day) => day.kind === 'train')
  const doneCount = training.filter((day) => isDayDone(day, doneMaps)).length
  const total = training.length
  const first = days[0].date
  const last = days[days.length - 1].date
  const current = first <= todayKey && last >= todayKey
  let status = 'upcoming'
  if (!total) status = 'rest'
  else if (doneCount === total) status = 'done'
  else if (last < todayKey) status = 'missed'
  else if (current) status = doneCount ? 'partial' : 'upcoming'
  return {
    key,
    date: current ? todayKey : first,
    letter,
    fill: total ? Math.max(0.2, doneCount / total) : 0.18,
    status,
    role: majorityRole(days),
    current,
    from: first,
    to: last,
  }
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

export function weekActivity(dateKey, doneMaps, todayKey = dateKey) {
  return daysInWeek(dateKey).map((day) => {
    const done = isDayDone(day, doneMaps)
    return {
      key: day.date,
      date: day.date,
      letter: WEEKDAY_LETTERS[weekdayNumber(day.date) - 1],
      fill: day.kind === 'rest' ? 0.18 : done ? 1 : day.date < todayKey ? 0.4 : 0.5,
      status: day.kind === 'rest' ? 'rest' : done ? 'done' : day.date < todayKey ? 'missed' : 'upcoming',
      role: day.primary || day.role,
      current: day.date === todayKey,
      from: day.date,
      to: day.date,
    }
  })
}

export function monthWeekActivity(dateKey, doneMaps, todayKey = dateKey) {
  return groupBy(daysInMonth(dateKey), (day) => weekStart(day.date)).map((group) => {
    const start = Number(group.days[0].date.slice(8, 10))
    const end = Number(group.days[group.days.length - 1].date.slice(8, 10))
    const letter = start === end ? String(start) : `${start}–${end}`
    return periodBar(group.days, todayKey, doneMaps, letter, group.key)
  })
}

export function programMonthActivity(doneMaps, todayKey) {
  return groupBy(getSchedule(), (day) => day.date.slice(0, 7)).map((group) => {
    const month = Number(group.key.slice(5, 7)) - 1
    return periodBar(group.days, todayKey, doneMaps, MONTH_LABELS[month], group.key)
  })
}

export function rangeActivity(range, dateKey, doneMaps, todayKey = dateKey) {
  if (range === 'month') return monthWeekActivity(dateKey, doneMaps, todayKey)
  if (range === 'total') return programMonthActivity(doneMaps, todayKey)
  return weekActivity(dateKey, doneMaps, todayKey)
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
