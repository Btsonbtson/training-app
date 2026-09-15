import { getBodySession } from './bodyweight'
import { treadmillByIndex, treadPhaseForIndex } from './treadmill'

export const PROGRAM_START = '2026-09-08'
export const PROGRAM_END = '2026-12-31'
export const TIMEZONE = 'Europe/Athens'
export const OPENING_END = '2026-09-15'
export const TAPER_START = '2026-12-21'

const HOLIDAY_REST = new Set(['2026-12-24', '2026-12-25', '2026-12-26', '2026-12-31'])

function blockFor(dateKey) {
  if (dateKey <= '2026-10-05') return { id: 'foundation', label: 'Foundation' }
  if (dateKey <= '2026-11-02') return { id: 'build', label: 'Build' }
  if (dateKey <= '2026-11-30') return { id: 'strength', label: 'Strength' }
  if (dateKey <= '2026-12-20') return { id: 'peak', label: 'Peak' }
  return { id: 'taper', label: 'Taper' }
}

export function athensDateKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function athensHour(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  return Number(parts.find((part) => part.type === 'hour')?.value)
}

export function addDays(dateKey, count) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const next = new Date(Date.UTC(year, month - 1, day + count, 12))
  return next.toISOString().slice(0, 10)
}

export function weekdayNumber(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const noon = new Date(Date.UTC(year, month - 1, day, 12))
  const utcDay = noon.getUTCDay()
  return utcDay === 0 ? 7 : utcDay
}

export function formatDateLabel(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const noon = new Date(Date.UTC(year, month - 1, day, 12))
  return new Intl.DateTimeFormat('el-GR', {
    timeZone: 'UTC',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(noon)
}

export function weekStart(dateKey) {
  const weekday = weekdayNumber(dateKey)
  return addDays(dateKey, 1 - weekday)
}

export function monthKey(dateKey) {
  return dateKey.slice(0, 7)
}

function roleFor(dateKey) {
  if (dateKey <= OPENING_END) return 'treadmill'
  if (HOLIDAY_REST.has(dateKey)) return 'rest'
  const weekday = weekdayNumber(dateKey)
  if (weekday === 5) return 'rest'
  if (weekday === 1 || weekday === 3) return 'army-chair'
  return 'treadmill'
}

function buildSchedule() {
  const days = []
  let trainNum = 0
  let tmIndex = 0
  let tcIndex = 0
  let acIndex = 0

  for (let dateKey = PROGRAM_START; dateKey <= PROGRAM_END; dateKey = addDays(dateKey, 1)) {
    const role = roleFor(dateKey)
    const block = blockFor(dateKey)
    const weekday = weekdayNumber(dateKey)
    const opening = dateKey <= OPENING_END
    const taper = dateKey >= TAPER_START

    if (role === 'rest') {
      days.push({
        date: dateKey,
        kind: 'rest',
        role: 'rest',
        weekday,
        block,
        label: taper ? 'Rest · taper' : 'Rest',
      })
      continue
    }

    trainNum += 1
    const day = {
      date: dateKey,
      kind: 'train',
      role,
      trainingNumber: trainNum,
      weekday,
      block,
      opening,
    }

    if (role === 'treadmill') {
      tmIndex += 1
      day.primary = 'treadmill'
      day.treadmill = treadmillByIndex(tmIndex, { taper })
      day.treadmillIndex = tmIndex
      day.phaseLabel = taper ? 'Taper — easier quality' : treadPhaseForIndex(tmIndex)
      if (!opening) {
        tcIndex += 1
        day.taiChi = getBodySession('tc', tcIndex)
      }
    }

    if (opening) {
      tcIndex += 1
      acIndex += 1
      day.taiChi = getBodySession('tc', tcIndex)
      day.armyChair = getBodySession('ac', acIndex)
    } else if (role === 'army-chair') {
      acIndex += 1
      day.primary = 'army-chair'
      day.armyChair = getBodySession('ac', acIndex)
      day.phaseLabel = day.armyChair.cycle > 1
        ? `Army Chair · Cycle ${day.armyChair.cycle}`
        : 'Army Chair'
    }

    days.push(day)
  }

  return days
}

let cached
export function getSchedule() {
  if (!cached) cached = buildSchedule()
  return cached
}

export function getDay(dateKey) {
  return getSchedule().find((day) => day.date === dateKey) || null
}

export function daysInWeek(dateKey) {
  const start = weekStart(dateKey)
  const keys = Array.from({ length: 7 }, (_, index) => addDays(start, index))
  return getSchedule().filter((day) => keys.includes(day.date))
}

export function daysInMonth(dateKey) {
  const prefix = monthKey(dateKey)
  return getSchedule().filter((day) => day.date.startsWith(prefix))
}

export function monthGrid(yearMonth) {
  const start = `${yearMonth}-01`
  const weekday = weekdayNumber(start)
  const leading = weekday - 1
  const days = []
  for (let offset = -leading; offset < 42 - leading; offset += 1) {
    const dateKey = addDays(start, offset)
    const scheduled = dateKey >= PROGRAM_START && dateKey <= PROGRAM_END
    days.push({
      date: dateKey,
      inMonth: dateKey.startsWith(yearMonth),
      scheduled,
      day: scheduled ? getDay(dateKey) : null,
    })
  }
  return days
}

export function nextBodySession(dateKey, program) {
  const wantArmy = program === 'ac'
  const pick = (day) => (wantArmy ? day?.armyChair : day?.taiChi) || null
  const today = getDay(dateKey)
  const current = pick(today)
  if (current) {
    return { session: current, date: dateKey, isToday: true }
  }
  const upcoming = getSchedule().find((day) => day.date >= dateKey && pick(day))
  if (upcoming) {
    return { session: pick(upcoming), date: upcoming.date, isToday: upcoming.date === dateKey }
  }
  return null
}

export function primarySession(day) {
  if (!day || day.kind !== 'train') return null
  if (day.primary === 'treadmill') return { type: 'treadmill', workout: day.treadmill }
  if (day.primary === 'tai-chi') return { type: 'tai-chi', workout: day.taiChi }
  if (day.primary === 'army-chair') return { type: 'army-chair', workout: day.armyChair }
  return null
}

export function isDayDone(day, { tDone = {}, bDone = {} } = {}) {
  if (!day || day.kind !== 'train') return false
  if (day.primary === 'treadmill') return Boolean(tDone[day.treadmill?.id])
  if (day.primary === 'tai-chi') return Boolean(bDone[day.taiChi?.id])
  if (day.primary === 'army-chair') return Boolean(bDone[day.armyChair?.id])
  return false
}

export function whatsappMessage(day) {
  if (!day) return 'Δεν υπάρχει πρόγραμμα για σήμερα.'
  if (day.kind === 'rest') {
    return `Καλημέρα. Σήμερα ${formatDateLabel(day.date)} είναι rest day. Ξεκούραση, νερό, και ελαφρύ περπάτημα αν θες.`
  }
  if (day.treadmill) {
    const taiChi = day.taiChi ? ` Μετά, Chair Tai Chi: ${day.taiChi.title}.` : ''
    return `Καλημέρα. Σήμερα προπόνηση #${day.trainingNumber}: διάδρομος ${day.treadmill.type} ${day.treadmill.reps} @ ${day.treadmill.speed} km/h.${taiChi} Καλή δύναμη.`
  }
  const session = day.taiChi || day.armyChair
  const program = day.taiChi ? 'Chair Tai Chi' : 'Army Chair'
  return `Καλημέρα. Σήμερα προπόνηση #${day.trainingNumber}: ${program} — ${session.title} (${session.struct}). Καλή δύναμη.`
}
