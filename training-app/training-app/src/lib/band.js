export function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function emptyDay() {
  return {
    steps: null,
    kcal: null,
    rhr: null,
    sleepMin: null,
    hrAvg: null,
    hrMax: null,
  }
}

export function getBandDay(band, dateKey = localDateKey()) {
  return { ...emptyDay(), ...(band?.days?.[dateKey] || {}) }
}

export function formatSleep(minutes) {
  const value = Number(minutes)
  if (!Number.isFinite(value) || value <= 0) return '—'
  const hours = Math.floor(value / 60)
  const mins = Math.round(value % 60)
  return `${hours}h ${String(mins).padStart(2, '0')}m`
}

export function parseMetric(value) {
  if (value === '' || value == null) return null
  const number = Number(value)
  if (!Number.isFinite(number) || number <= 0) return null
  return Math.round(number)
}

export function parseVo2(value) {
  if (value === '' || value == null) return null
  const number = Number(value)
  if (!Number.isFinite(number) || number <= 0) return null
  return Math.round(number * 10) / 10
}

export function cleanMetrics(metrics) {
  return {
    hrAvg: parseMetric(metrics?.hrAvg),
    hrMax: parseMetric(metrics?.hrMax),
    kcal: parseMetric(metrics?.kcal),
    vo2: parseVo2(metrics?.vo2),
    sessionId: typeof metrics?.sessionId === 'string' && metrics.sessionId ? metrics.sessionId : null,
    syncedAt: typeof metrics?.syncedAt === 'string' && metrics.syncedAt ? metrics.syncedAt : null,
  }
}

export function hasMetrics(metrics) {
  return Boolean(
    parseMetric(metrics?.hrAvg)
    || parseMetric(metrics?.hrMax)
    || parseMetric(metrics?.kcal)
    || parseVo2(metrics?.vo2),
  )
}

export function usedSessionIds(metricsMap, exceptId) {
  return Object.entries(metricsMap || {})
    .filter(([id, metrics]) => id !== exceptId && metrics?.sessionId)
    .map(([, metrics]) => metrics.sessionId)
}
