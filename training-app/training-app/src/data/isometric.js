import lungeHold from '../assets/isometric/lunge-hold.png'
import squatHold from '../assets/isometric/squat-hold.png'
import elbowPlank from '../assets/isometric/elbow-plank.png'
import wallSit from '../assets/isometric/wall-sit.png'
import legRaiseHold from '../assets/isometric/leg-raise-hold.png'

/** Full-program targets (όπως στις φωτογραφίες). Μην αλλάζεις τα γραφικά. */
export const ISO_FULL = {
  'Lunge Hold': { sets: 3, holdSec: 60 },
  'Squat Hold': { sets: 3, holdSec: 80 },
  'Elbow Plank': { sets: 3, holdSec: 90 },
  'Wall Sit': { sets: 3, holdSec: 90 },
  'Leg Raise Hold': { sets: 2, holdSec: 30 },
}

export const ISO_IMAGES = {
  'Lunge Hold': lungeHold,
  'Squat Hold': squatHold,
  'Elbow Plank': elbowPlank,
  'Wall Sit': wallSit,
  'Leg Raise Hold': legRaiseHold,
}

const CUES = {
  'Lunge Hold': 'Μπροστά πόδι 90°. Πίσω γόνατο σχεδόν αγγίζει. Κράτα σταθερά.',
  'Squat Hold': 'Μηροί παράλληλα όσο γίνεται. Χέρια μπροστά. Σταθερό κάθισμα.',
  'Elbow Plank': 'Αγκώνες κάτω από ώμους. Σώμα σε ευθεία γραμμή.',
  'Wall Sit': 'Πλάτη στον τοίχο. Γόνατα ~90°. Χέρια μπροστά.',
  'Leg Raise Hold': 'Πλάτη στο πάτωμα. Πόδια ίσια, λίγο πάνω από το έδαφος.',
}

/** W1 (από το μηδέν) → W12 (πλήρες πρόγραμμα στις φωτογραφίες). */
const WEEK_HOLD_SEC = {
  'Lunge Hold':      [15, 19, 23, 27, 31, 35, 40, 44, 48, 52, 56, 60],
  'Squat Hold':      [20, 25, 31, 36, 42, 47, 53, 58, 64, 69, 75, 80],
  'Elbow Plank':     [20, 26, 33, 39, 45, 52, 58, 65, 71, 78, 84, 90],
  'Wall Sit':        [20, 26, 33, 39, 45, 52, 58, 65, 71, 78, 84, 90],
  'Leg Raise Hold':  [ 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
}

const EXERCISE_ORDER = [
  'Lunge Hold',
  'Squat Hold',
  'Elbow Plank',
  'Wall Sit',
  'Leg Raise Hold',
]

const TOTAL_WEEKS = 12

function lerpRest(holdSec, weekIndex) {
  // Rest grows gently with hold length; slightly shorter early on
  const base = Math.round(holdSec * 0.75)
  const floor = weekIndex < 3 ? 40 : 45
  return Math.max(floor, Math.min(90, base))
}

function hold(name, sets, holdSec, restSec) {
  const full = ISO_FULL[name]
  return {
    name,
    sets,
    holdSec,
    restSec,
    setsLabel: `${sets} × ${holdSec} sec`,
    fullLabel: `${full.sets} × ${full.holdSec} sec`,
    desc: CUES[name],
    image: ISO_IMAGES[name],
  }
}

function weekWorkout(weekNum) {
  const i = weekNum - 1
  const pct = Math.round((weekNum / TOTAL_WEEKS) * 100)
  const exercises = EXERCISE_ORDER.map((name) => {
    const full = ISO_FULL[name]
    const holdSec = WEEK_HOLD_SEC[name][i]
    return hold(name, full.sets, holdSec, lerpRest(holdSec, i))
  })

  const totalHold = exercises.reduce((s, e) => s + e.sets * e.holdSec, 0)
  const totalRest = exercises.reduce((s, e) => s + Math.max(0, e.sets - 1) * e.restSec, 0)
  const transitions = Math.max(0, exercises.length - 1) * 20
  const approxMin = Math.round((totalHold + totalRest + transitions) / 60)

  const isFirst = weekNum === 1
  const isFull = weekNum === TOTAL_WEEKS

  let note
  if (isFirst) {
    note = 'Ξεκίνα εδώ από το μηδέν. Στόχος φόρμας. Πλήρες πρόγραμμα στο Week 12: 3×60 / 3×80 / 3×90 / 3×90 / 2×30.'
  } else if (isFull) {
    note = 'Πλήρες πρόγραμμα — ίδια νούμερα με τις φωτογραφίες: 3×60 · 3×80 · 3×90 · 3×90 · 2×30.'
  } else {
    note = `Εβδομάδα ${weekNum}/12 (~${pct}%). Ίδιες ασκήσεις — μόνο η διάρκεια ανεβαίνει προς το πλήρες.`
  }

  return {
    id: `iso${weekNum}`,
    type: 'ISO',
    title: isFull
      ? `Isometric — Week ${weekNum} · Πλήρες`
      : `Isometric — Week ${weekNum}`,
    struct: `~${pct}% ένταση · ~${approxMin}' · rest μεταξύ sets`,
    note,
    week: weekNum,
    exercises,
  }
}

/**
 * 12 εβδομάδες προοδευτικής αύξησης διάρκειας:
 * W1 εισαγωγικό → W12 πλήρες πρόγραμμα (φωτογραφίες).
 */
export const isoPhases = Array.from({ length: TOTAL_WEEKS }, (_, idx) => {
  const weekNum = idx + 1
  const pct = Math.round((weekNum / TOTAL_WEEKS) * 100)
  const label =
    weekNum === 1
      ? `Week 1 — Από το μηδέν (~${pct}%)`
      : weekNum === TOTAL_WEEKS
        ? `Week ${TOTAL_WEEKS} — Πλήρες πρόγραμμα (100%)`
        : `Week ${weekNum} — Progressive (~${pct}%)`

  return {
    label,
    workouts: [weekWorkout(weekNum)],
  }
})

/** Φάσεις χρονομέτρου για μία προπόνηση — hold/rest ανά set με βάση τα progressive secs. */
export function buildIsoPhases(workout) {
  const phases = [
    {
      id: 'ready',
      kind: 'ready',
      duration: 10,
      label: 'Ready',
      title: 'Ετοιμάσου',
      cue: 'Βρες θέση. Πρώτο hold σε 10″.',
      exercise: workout.exercises[0] || null,
    },
  ]

  workout.exercises.forEach((ex, ei) => {
    for (let s = 1; s <= ex.sets; s++) {
      phases.push({
        id: `hold-${ei + 1}-${s}`,
        kind: 'hold',
        duration: ex.holdSec,
        label: `Hold ${s}/${ex.sets}`,
        title: ex.name,
        cue: ex.desc,
        setsLabel: ex.setsLabel,
        exercise: ex,
        setIndex: s,
        setTotal: ex.sets,
      })
      const isLastSet = s === ex.sets
      const isLastEx = ei === workout.exercises.length - 1
      if (!isLastSet) {
        phases.push({
          id: `rest-${ei + 1}-${s}`,
          kind: 'rest',
          duration: ex.restSec,
          label: `Rest ${s}/${ex.sets}`,
          title: `Ξεκούραση · ${ex.name}`,
          cue: `Επόμενο: set ${s + 1}/${ex.sets} · ${ex.holdSec}″`,
          exercise: ex,
        })
      } else if (!isLastEx) {
        const next = workout.exercises[ei + 1]
        phases.push({
          id: `trans-${ei + 1}`,
          kind: 'rest',
          duration: 20,
          label: 'Αλλαγή',
          title: `Επόμενο · ${next.name}`,
          cue: `${next.setsLabel} — ${next.desc}`,
          exercise: next,
        })
      }
    }
  })

  phases.push({
    id: 'done',
    kind: 'done',
    duration: 5,
    label: 'Τέλος',
    title: 'Ολοκληρώθηκε',
    cue: 'Καλή δουλειά. Σημείωσε πώς πήγε.',
    exercise: null,
  })

  return phases
}
