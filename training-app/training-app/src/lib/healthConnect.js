import { parseMetric, parseVo2 } from './band'

const READ_TYPES = ['ActivitySession', 'HeartRateSeries', 'ActiveCaloriesBurned', 'Vo2Max']
const TREADMILL_TYPES = new Set([56, 61, 79, 88])

export function isNativeHealthAvailable() {
  return typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.() === true
}

export async function readTodayFromHealthConnect() {
  return { ok: false, reason: 'not-wired' }
}

export async function readLatestTreadmillFromBand(usedIds = []) {
  if (!isNativeHealthAvailable()) {
    return { ok: false, reason: 'browser' }
  }

  let plugin
  try {
    const mod = await import('@devmaxime/capacitor-health-connect')
    plugin = mod.HealthConnect
  } catch {
    return { ok: false, reason: 'missing-plugin' }
  }

  const availability = await plugin.checkAvailability()
  if (availability.availability === 'NotInstalled') {
    return { ok: false, reason: 'not-installed' }
  }
  if (availability.availability !== 'Available') {
    return { ok: false, reason: 'not-supported' }
  }

  await plugin.requestPermissions({ read: READ_TYPES, write: [] })

  const now = new Date()
  const lookback = new Date(now.getTime() - 36 * 60 * 60 * 1000)
  const vo2Start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const range = { start: lookback.toISOString(), end: now.toISOString() }

  const [sessions, vo2Records] = await Promise.all([
    readType(plugin, 'ActivitySession', range),
    readType(plugin, 'Vo2Max', { start: vo2Start.toISOString(), end: now.toISOString() }),
  ])

  const session = pickSession(sessions, usedIds)
  const window = session
    ? { start: session.startTime, end: session.endTime }
    : { start: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), end: now.toISOString() }

  const [hrRecords, kcalRecords] = await Promise.all([
    readType(plugin, 'HeartRateSeries', window),
    readType(plugin, 'ActiveCaloriesBurned', window),
  ])

  const bpms = heartRates(hrRecords)
  const hrAvg = bpms.length ? Math.round(bpms.reduce((sum, value) => sum + value, 0) / bpms.length) : null
  const hrMax = bpms.length ? Math.round(Math.max(...bpms)) : null
  const kcal = sumCalories(kcalRecords)
  const vo2 = latestVo2(vo2Records)

  if (!hrAvg && !hrMax && !kcal && !vo2) {
    return { ok: false, reason: 'no-data' }
  }

  return {
    ok: true,
    metrics: {
      hrAvg: parseMetric(hrAvg),
      hrMax: parseMetric(hrMax),
      kcal: parseMetric(kcal),
      vo2: parseVo2(vo2),
      sessionId: session?.metadata?.id || session?.id || null,
      syncedAt: now.toISOString(),
    },
  }
}

async function readType(plugin, type, range) {
  try {
    const result = await plugin.readRecords({ type, start: range.start, end: range.end })
    return Array.isArray(result?.records) ? result.records : []
  } catch {
    return []
  }
}

function pickSession(records, usedIds) {
  const used = new Set(usedIds)
  const ranked = records
    .filter((record) => {
      const id = record?.metadata?.id || record?.id
      return !id || !used.has(id)
    })
    .map((record) => ({ record, score: sessionScore(record) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.record.endTime) - new Date(a.record.endTime))

  return ranked[0]?.record || null
}

function sessionScore(record) {
  const start = Date.parse(record?.startTime)
  const end = Date.parse(record?.endTime)
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0
  const minutes = (end - start) / 60000
  if (minutes < 8) return 0

  const title = String(record?.title || record?.name || '').toLowerCase()
  const type = Number(record?.exerciseType ?? record?.exerciseTypeInt)
  let score = minutes
  if (/treadmill|indoor|διάδρομ/.test(title)) score += 80
  if (TREADMILL_TYPES.has(type)) score += 40
  if (/run|walk|workout|τρέξ|περπάτ/.test(title)) score += 15
  return score
}

function heartRates(records) {
  const values = []
  for (const record of records) {
    if (Array.isArray(record?.samples)) {
      for (const sample of record.samples) {
        const bpm = Number(sample?.beatsPerMinute ?? sample?.bpm)
        if (Number.isFinite(bpm) && bpm > 30 && bpm < 230) values.push(bpm)
      }
    }
    const bpm = Number(record?.beatsPerMinute ?? record?.bpm)
    if (Number.isFinite(bpm) && bpm > 30 && bpm < 230) values.push(bpm)
  }
  return values
}

function sumCalories(records) {
  let total = 0
  for (const record of records) {
    const value = Number(
      record?.energy?.inKilocalories
      ?? record?.energy?.inCalories / 1000
      ?? record?.kcal
      ?? record?.calories,
    )
    if (Number.isFinite(value) && value > 0) total += value
  }
  return total > 0 ? Math.round(total) : null
}

function latestVo2(records) {
  const dated = records
    .map((record) => ({
      at: Date.parse(record?.time ?? record?.startTime ?? record?.endTime),
      value: Number(
        record?.vo2MillilitersPerMinuteKilogram
        ?? record?.vo2
        ?? record?.value,
      ),
    }))
    .filter((item) => Number.isFinite(item.at) && Number.isFinite(item.value) && item.value > 0)
    .sort((a, b) => b.at - a.at)
  return dated[0]?.value ?? null
}
