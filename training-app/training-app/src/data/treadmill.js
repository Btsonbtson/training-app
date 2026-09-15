export const TREAD_TYPE_LABEL = {
  RI: 'Ρυθμός Ταχύτητας',
  REH: 'Εκτεταμένη Αερόβια',
  RHR: 'Ρυθμός Ανηφόρας',
  RE: 'Συνεχόμενη',
}

export const treadPhases = [
  {
    label: 'Φάση 1 — Βάση',
    workouts: [
      { id: 't1', type: 'RI', reps: "10x1'", speed: '7.0–8.0', incline: '-', rest: "1', 4' easy" },
      { id: 't2', type: 'RI', reps: "5x2'", speed: '7.4', incline: '-', rest: "1.30', 4' easy" },
      { id: 't3', type: 'RI', reps: "10x1'", speed: '7.5–8.4', incline: '-', rest: "1', 4' easy" },
      { id: 't4', type: 'RHR', reps: "4x2'", speed: '6.0', incline: '+3%', rest: "2', 5' easy" },
      { id: 't5', type: 'RI', reps: "6x1.30'", speed: '7.5', incline: '-', rest: "1.30', 5' easy" },
    ],
  },
  {
    label: 'Φάση 2 — Ανάπτυξη',
    workouts: [
      { id: 't6', type: 'RI', reps: "10x1'", speed: '8.0', incline: '-', rest: "1', 5' easy" },
      { id: 't7', type: 'RI', reps: "10' easy + 4x3'", speed: '7.5', incline: '-', rest: "1.30', 6' easy" },
      { id: 't8', type: 'RI', reps: "6x2'", speed: '7.8', incline: '-', rest: "1.30', 6' easy" },
      { id: 't9', type: 'RHR', reps: "4x2.30'", speed: '6.3', incline: '+3%', rest: "2', 5' easy" },
      { id: 't10', type: 'RI', reps: "4x3'", speed: '8.0', incline: '-', rest: "1.30', 5' easy" },
    ],
  },
  {
    label: 'Φάση 3 — Μέσο',
    workouts: [
      { id: 't11', type: 'RI', reps: "10x1'", speed: '8.5', incline: '-', rest: "1.30', 5' easy" },
      { id: 't12', type: 'RI', reps: "6x2'", speed: '8.2', incline: '-', rest: "1.30', 5' easy" },
      { id: 't13', type: 'RI', reps: "8x1'", speed: '8.5', incline: '-', rest: "1', 5' easy" },
      { id: 't14', type: 'RHR', reps: "4x2.30'", speed: '6.5', incline: '+3%', rest: "2', 5' easy" },
      { id: 't15', type: 'REH', reps: '5k', speed: '8.3', incline: '+2%', rest: '-' },
      { id: 't16', type: 'RI', reps: "5x2'", speed: '8.0', incline: '-', rest: "1.30', 5' easy" },
      { id: 't17', type: 'RI', reps: "6x1.30'", speed: '8.3', incline: '-', rest: "1.30', 5' easy" },
    ],
  },
  {
    label: 'Φάση 4 — Προχωρημένο',
    workouts: [
      { id: 't18', type: 'RI', reps: "10x1'", speed: '8.7', incline: '-', rest: "1', 5' easy" },
      { id: 't19', type: 'RHR', reps: "4x2'", speed: '6.8', incline: '+3%', rest: "2', 5' easy" },
      { id: 't20', type: 'RI', reps: "5x3'", speed: '8.5', incline: '-', rest: "1.30', 5' easy" },
      { id: 't21', type: 'RI', reps: "6x2'", speed: '8.7', incline: '-', rest: "1.30', 5' easy" },
      { id: 't22', type: 'RI', reps: "8x1'", speed: '9.0', incline: '-', rest: "1', 5' easy" },
      { id: 't23', type: 'RHR', reps: "4x(2'-1.30'-1')", speed: '6.5→8.5', incline: '+4%→0%', rest: "1.30'" },
      { id: 't24', type: 'REH', reps: '5.5k', speed: '8.8', incline: '+1%', rest: '-' },
      { id: 't25', type: 'RHR', reps: "4x2.30'", speed: '7.0', incline: '+3%', rest: "2', 5' easy" },
    ],
  },
  {
    label: 'Φάση 5 — Peak',
    workouts: [
      { id: 't26', type: 'RI', reps: "5x2'", speed: '8.8', incline: '-', rest: "1.30', 5' easy" },
      { id: 't27', type: 'RI', reps: "6x1.30'", speed: '9.0', incline: '-', rest: "1.30', 5' easy" },
      { id: 't28', type: 'RI', reps: "10x1'", speed: '9.3', incline: '-', rest: "1', 5' easy" },
      { id: 't29', type: 'RHR', reps: "4x2'", speed: '7.2', incline: '+3%', rest: "2', 5' easy" },
      { id: 't30', type: 'RHR', reps: "4x6'", speed: '7.0', incline: '+5%', rest: "2'" },
      { id: 't31', type: 'RI', reps: "5x3' + 5x1'", speed: '8.7–9.7', incline: '-', rest: "1.30'" },
      { id: 't32', type: 'RHR', reps: "4x(3'-2'-1')", speed: '7.5→9.5', incline: '+4%→0%', rest: "1.30'" },
      { id: 't33', type: 'RE', reps: '6k', speed: '9.3', incline: '-', rest: '-' },
      { id: 't34', type: 'RI', reps: "2x3' + 2x2'", speed: '10.0', incline: '-', rest: "1.30'" },
      { id: 't35', type: 'RI', reps: "5x2.30'", speed: '10.0', incline: '-', rest: "1.30'" },
    ],
  },
]

export const originalTreadWorkouts = treadPhases.flatMap((phase) => phase.workouts)

const EXTRA_TREAD_TEMPLATES = [
  { type: 'RI', reps: "8x1'", speed: 8.4, incline: '-', rest: "1', 5' easy" },
  { type: 'RHR', reps: "4x2'", speed: 6.8, incline: '+3%', rest: "2', 5' easy" },
  { type: 'REH', reps: '5k', speed: 8.2, incline: '+1%', rest: '-' },
  { type: 'RI', reps: "6x2'", speed: 8.0, incline: '-', rest: "1.30', 5' easy" },
  { type: 'RI', reps: "5x3'", speed: 8.1, incline: '-', rest: "1.30', 5' easy" },
  { type: 'RHR', reps: "4x2.30'", speed: 6.6, incline: '+4%', rest: "2', 5' easy" },
  { type: 'RE', reps: '6k', speed: 8.4, incline: '-', rest: '-' },
  { type: 'RI', reps: "10x1'", speed: 8.6, incline: '-', rest: "1', 5' easy" },
]

function bumpSpeed(value, delta) {
  const rounded = Math.round((Number(value) + delta) * 10) / 10
  return rounded.toFixed(1)
}

export function treadmillByIndex(index, options = {}) {
  const original = originalTreadWorkouts[index - 1]
  let workout = original
  if (!workout) {
    const extraIndex = index - originalTreadWorkouts.length - 1
    const template = EXTRA_TREAD_TEMPLATES[extraIndex % EXTRA_TREAD_TEMPLATES.length]
    const wave = Math.floor(extraIndex / EXTRA_TREAD_TEMPLATES.length)
    workout = {
      id: `t${index}`,
      type: template.type,
      reps: template.reps,
      speed: bumpSpeed(template.speed, wave * 0.2),
      incline: template.incline,
      rest: template.rest,
    }
  }
  if (options.taper) {
    const numeric = Number.parseFloat(String(workout.speed).replace(',', '.'))
    if (!Number.isNaN(numeric)) {
      workout = { ...workout, speed: bumpSpeed(numeric, -0.5) }
    }
  }
  return workout
}

export function treadPhaseForIndex(index) {
  let cursor = 0
  for (const phase of treadPhases) {
    cursor += phase.workouts.length
    if (index <= cursor) return phase.label
  }
  return 'Φάση 6 — Διατήρηση'
}
