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

function hold(name, sets, holdSec, restSec, cue) {
  const full = ISO_FULL[name]
  return {
    name,
    sets,
    holdSec,
    restSec,
    setsLabel: `${sets} × ${holdSec} sec`,
    fullLabel: `${full.sets} × ${full.holdSec} sec`,
    desc: cue,
    image: ISO_IMAGES[name],
  }
}

function week(id, title, pctLabel, note, exercises) {
  const totalHold = exercises.reduce((s, e) => s + e.sets * e.holdSec, 0)
  const totalRest = exercises.reduce((s, e) => s + Math.max(0, e.sets - 1) * e.restSec, 0)
  const transitions = Math.max(0, exercises.length - 1) * 20
  const approxMin = Math.round((totalHold + totalRest + transitions) / 60)
  return {
    id,
    type: 'ISO',
    title,
    struct: `${pctLabel} · ~${approxMin}' · rest μεταξύ sets`,
    note,
    exercises,
  }
}

/**
 * Προοδευτική κλίμακα από το μηδέν → πλήρες πρόγραμμα στις φωτογραφίες.
 * W1 ~25% · W2 ~50% · W3 ~75% · W4 100%
 */
export const isoPhases = [
  {
    label: 'Week 1 — Από το μηδέν (~25%)',
    workouts: [
      week(
        'iso1',
        'Isometric — Week 1',
        '~25% ένταση',
        'Ξεκίνα εδώ. Στόχος φόρμας, όχι χρόνου. Πλήρες: 3×60 / 3×80 / 3×90 / 3×90 / 2×30.',
        [
          hold('Lunge Hold', 3, 15, 45, 'Μπροστά πόδι 90°. Πίσω γόνατο σχεδόν αγγίζει. Κράτα σταθερά.'),
          hold('Squat Hold', 3, 20, 50, 'Μηροί παράλληλα όσο γίνεται. Χέρια μπροστά. Σταθερό κάθισμα.'),
          hold('Elbow Plank', 3, 25, 50, 'Αγκώνες κάτω από ώμους. Σώμα σε ευθεία γραμμή.'),
          hold('Wall Sit', 3, 25, 50, 'Πλάτη στον τοίχο. Γόνατα ~90°. Χέρια μπροστά.'),
          hold('Leg Raise Hold', 2, 8, 40, 'Πλάτη στο πάτωμα. Πόδια ίσια, λίγο πάνω από το έδαφος.'),
        ],
      ),
    ],
  },
  {
    label: 'Week 2 — Build (~50%)',
    workouts: [
      week(
        'iso2',
        'Isometric — Week 2',
        '~50% ένταση',
        'Διπλάσια διάρκεια από W1. Ίδια ασκήσεις — μόνο ο χρόνος ανεβαίνει.',
        [
          hold('Lunge Hold', 3, 30, 50, 'Μπροστά πόδι 90°. Πίσω γόνατο σχεδόν αγγίζει. Κράτα σταθερά.'),
          hold('Squat Hold', 3, 40, 60, 'Μηροί παράλληλα όσο γίνεται. Χέρια μπροστά. Σταθερό κάθισμα.'),
          hold('Elbow Plank', 3, 45, 60, 'Αγκώνες κάτω από ώμους. Σώμα σε ευθεία γραμμή.'),
          hold('Wall Sit', 3, 45, 60, 'Πλάτη στον τοίχο. Γόνατα ~90°. Χέρια μπροστά.'),
          hold('Leg Raise Hold', 2, 15, 45, 'Πλάτη στο πάτωμα. Πόδια ίσια, λίγο πάνω από το έδαφος.'),
        ],
      ),
    ],
  },
  {
    label: 'Week 3 — Push (~75%)',
    workouts: [
      week(
        'iso3',
        'Isometric — Week 3',
        '~75% ένταση',
        'Κοντά στο πλήρες. Αν σπάει η φόρμα, μείνε στα νούμερα της W2 και ξαναδοκίμασε.',
        [
          hold('Lunge Hold', 3, 45, 55, 'Μπροστά πόδι 90°. Πίσω γόνατο σχεδόν αγγίζει. Κράτα σταθερά.'),
          hold('Squat Hold', 3, 60, 70, 'Μηροί παράλληλα όσο γίνεται. Χέρια μπροστά. Σταθερό κάθισμα.'),
          hold('Elbow Plank', 3, 70, 75, 'Αγκώνες κάτω από ώμους. Σώμα σε ευθεία γραμμή.'),
          hold('Wall Sit', 3, 70, 75, 'Πλάτη στον τοίχο. Γόνατα ~90°. Χέρια μπροστά.'),
          hold('Leg Raise Hold', 2, 22, 45, 'Πλάτη στο πάτωμα. Πόδια ίσια, λίγο πάνω από το έδαφος.'),
        ],
      ),
    ],
  },
  {
    label: 'Week 4 — Πλήρες πρόγραμμα (100%)',
    workouts: [
      week(
        'iso4',
        'Isometric — Week 4 · Full',
        'πλήρες πρόγραμμα',
        'Ίδια νούμερα με τις φωτογραφίες: 3×60 · 3×80 · 3×90 · 3×90 · 2×30.',
        [
          hold('Lunge Hold', 3, 60, 60, 'Μπροστά πόδι 90°. Πίσω γόνατο σχεδόν αγγίζει. Κράτα σταθερά.'),
          hold('Squat Hold', 3, 80, 75, 'Μηροί παράλληλα όσο γίνεται. Χέρια μπροστά. Σταθερό κάθισμα.'),
          hold('Elbow Plank', 3, 90, 90, 'Αγκώνες κάτω από ώμους. Σώμα σε ευθεία γραμμή.'),
          hold('Wall Sit', 3, 90, 90, 'Πλάτη στον τοίχο. Γόνατα ~90°. Χέρια μπροστά.'),
          hold('Leg Raise Hold', 2, 30, 45, 'Πλάτη στο πάτωμα. Πόδια ίσια, λίγο πάνω από το έδαφος.'),
        ],
      ),
    ],
  },
]

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
