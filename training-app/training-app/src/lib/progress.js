import {
  daysInMonth,
  daysInWeek,
  getSchedule,
  isDayDone,
} from '../data/schedule'

export const PROGRESS_RANGES = [
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'total', label: 'Total' },
]

export function progressFor(range, dateKey, doneMaps) {
  const days = range === 'week'
    ? daysInWeek(dateKey)
    : range === 'month'
      ? daysInMonth(dateKey)
      : getSchedule()
  const training = days.filter((day) => day.kind === 'train')
  const done = training.filter((day) => isDayDone(day, doneMaps))
  return {
    done: done.length,
    total: training.length,
    pct: training.length ? Math.round((done.length / training.length) * 100) : 0,
  }
}
