export const bodyPhases = [
  {
    label: 'Week 1 — Foundation · Iso από το μηδέν (Days 1–7)',
    workouts: [
      {
        id: 'b1', type: 'TC', title: 'Tai Chi — Week 1 Foundation',
        struct: "2' warmup · 3×(40''/20') · 1' cool",
        exercises: [
          { name: 'Opening Breath', sets: '5 deep breaths', desc: 'Sit tall. Feet flat. Breathe deeply and settle in.' },
          { name: 'Rising Hands', sets: '8 reps', desc: 'Lift arms slowly in front to shoulder height.' },
          { name: 'Wave Hands', sets: '8 reps', desc: 'Sway arms side to side like steady waves.' },
          { name: 'Brush Knee', sets: '8 reps each side', desc: 'Brush one hand down the knee. Switch sides.' },
          { name: 'Cloud Hands', sets: '10 reps', desc: 'Move arms in soft circles like moving clouds.' },
          { name: 'Push the Mountain', sets: '10 reps', desc: 'Push both hands forward gently with control.' },
        ],
        note: 'Week 1 Flow: move through Days 1–5 slowly without stopping — 1 full round.',
      },
      {
        id: 'b2', type: 'BW', title: 'Army Chair — Days 1–3 · Iso Intro',
        struct: "2' warmup · 2–3 sets · 1' cool · rest 60–90\" μεταξύ κρατήσεων",
        exercises: [
          { name: 'Chair Push-ups', sets: '2–3 sets × 6–8 reps', desc: 'Hands on chair edge. Body straight. Stop 1–2 reps before failure.' },
          { name: 'Sit to Stand Squats', sets: '2–3 sets × 8–10 reps', desc: 'Stand fully from seated. Slow, controlled descent.' },
          { name: 'Chair Plank', sets: '3 sets × 8–12 sec', desc: 'Hands on seat. Body straight. Short holds — quality over time. Rest 60–90\" between sets.' },
        ],
        note: 'Από το μηδέν: ισομετρική κράτηση 8–12″ μόνο. Σταμάτα πριν «κάψει» — στόχος καθαρή στάση.',
      },
      {
        id: 'b3', type: 'TC', title: 'Tai Chi — Week 1 Days 4–7',
        struct: "2' warmup · 3×(45''/15') · 1' cool",
        exercises: [
          { name: 'Brush Knee', sets: '8 reps each side', desc: 'Brush one hand down the knee. Switch sides.' },
          { name: 'Cloud Hands', sets: '10 reps', desc: 'Soft circles like moving clouds.' },
          { name: 'Push the Mountain', sets: '10 reps', desc: 'Push both hands forward gently.' },
          { name: 'Week 1 Flow', sets: '1 full round', desc: 'Days 1–5 slowly without stopping.' },
        ],
        note: 'Closing flow — build awareness & stability.',
      },
      {
        id: 'b4', type: 'BW', title: 'Army Chair — Days 4–7 · Iso Build',
        struct: "2' warmup · 2–3 sets · 1' cool · rest 60\"",
        exercises: [
          { name: 'Alternating Leg Extensions', sets: '2–3 sets × 8–10 each leg', desc: 'Extend each leg, soft 1-sec hold at top, lower slowly.' },
          { name: 'Chair Dips', sets: '2–3 sets × 6–8 reps', desc: 'Hands on chair edge, shallow dip — only as deep as comfortable.' },
          { name: 'Seated Knee Raises', sets: '2–3 sets × 8–10 reps', desc: 'Alternate knee raises, core gently braced.' },
          { name: 'Seated Hold Finish Strong', sets: '3 sets × 10–15 sec', desc: 'Sit tall, core lightly braced, arms up. First seated isometric — short & clean.' },
        ],
        note: 'Days 4–7: εισαγωγή seated iso 10–15″. Πλάγκα W1 → seated brace — ίδια λογική, λιγότερη πίεση.',
      },
    ],
  },
  {
    label: 'Week 2 — Strength · Iso +5–8″ (Days 8–14)',
    workouts: [
      {
        id: 'b5', type: 'TC', title: 'Tai Chi — Week 2 Strength',
        struct: "2' warmup · 3×(45''/15') · 1' cool",
        exercises: [
          { name: 'Ward Off', sets: '8 reps each side', desc: 'Press one hand forward, other near ear. Switch.' },
          { name: 'Single Whip', sets: '8 reps each side', desc: 'Extend one arm out and down. Other arm back.' },
          { name: 'White Crane', sets: '8 reps', desc: 'Lift arms up, other arm down. Open like wings.' },
          { name: 'Cross Hands', sets: '10 reps', desc: 'Cross arms in front of chest, open wide.' },
        ],
        note: 'Week 2 — improve control & strength.',
      },
      {
        id: 'b6', type: 'BW', title: 'Army Chair — Days 8–10 · Iso Progress',
        struct: "2' warmup · 3 sets · 1' cool · rest 60\"",
        exercises: [
          { name: 'Wide Push-ups (Hands on Chair)', sets: '3 sets × 8–10 reps', desc: 'Wider grip. Controlled tempo — no rush.' },
          { name: 'Seated Leg Raises', sets: '3 sets × 8–10 reps', desc: 'Lift straight leg, brief hold 1–2 sec, lower slowly.' },
          { name: 'Chair Plank', sets: '3 sets × 15–20 sec', desc: 'Progression from Week 1. Add ~5–8″ only if form stays clean.' },
        ],
        note: 'Days 8–10: plank → 15–20″. Μην κυνηγάς χρόνο αν κουνιέται η μέση.',
      },
      {
        id: 'b7', type: 'TC', title: 'Tai Chi — Week 2 Days 12–14',
        struct: "2' warmup · 3×(50''/10') · 1' cool",
        exercises: [
          { name: 'Roll Back', sets: '10 reps', desc: 'Roll both hands back slowly, pull toward hips.' },
          { name: 'Repulse Monkey', sets: '10 reps each side', desc: 'Push one hand forward, pull other back.' },
          { name: 'Week 2 Flow', sets: '1 full round', desc: 'Days 8–13 slowly with control and focus.' },
        ],
        note: 'Week 2 full round — control & strength.',
      },
      {
        id: 'b8', type: 'BW', title: 'Army Chair — Days 11–14 · Iso Stability',
        struct: "2' warmup · 3 sets · 1' cool · rest 60–75\"",
        exercises: [
          { name: 'Sit to Stand Squats', sets: '3 sets × 10 reps', desc: 'Both feet. Build single-leg readiness — no single-leg yet.' },
          { name: 'Seated Oblique Crunch', sets: '3 sets × 8–10 each side', desc: 'Elbow toward opposite knee, slow & controlled.' },
          { name: 'Chair Dips', sets: '3 sets × 8–10 reps', desc: 'Knees bent, feet under hips — easier than legs-extended dips.' },
          { name: 'Chair Plank Shoulder Taps', sets: '3 sets × 8–10 taps', desc: 'Short plank + light taps. Pause if hips twist — reset, then continue.' },
        ],
        note: 'Days 11–14: σταθερότητα πάνω στο plank. Λιγότερα taps, καλύτερη φόρμα.',
      },
    ],
  },
  {
    label: 'Week 3 — Balance · Iso + endurance (Days 15–21)',
    workouts: [
      {
        id: 'b9', type: 'TC', title: 'Tai Chi — Week 3 Balance',
        struct: "2' warmup · 4×(45''/10') · 1' cool",
        exercises: [
          { name: 'Diagonal Flying', sets: '8 reps each side', desc: 'Lift arms diagonally wide. One rises, one drops.' },
          { name: 'Spinal Twist', sets: '8 reps each side', desc: 'Rotate torso out and down each side.' },
          { name: 'Embrace Tiger', sets: '8 reps', desc: 'Circle arms wide as if hugging a tree.' },
          { name: 'Silk Reeling Circles', sets: '8 reps', desc: 'Circle arms to one side then the other.' },
        ],
        note: 'Week 3 — enhance balance & flexibility.',
      },
      {
        id: 'b10', type: 'BW', title: 'Army Chair — Days 15–17 · Iso Endurance',
        struct: "2' warmup · 3 sets · 1' cool · rest 45–60\"",
        exercises: [
          { name: 'Incline Push-ups (Hands on Chair)', sets: '3 sets × 10–12 reps', desc: 'Hands elevated — easier angle than floor. Full control.' },
          { name: 'Seated Marches', sets: '3 sets × 12–15 reps', desc: 'March seated. Drive knees up gently.' },
          { name: 'Chair Plank', sets: '3 sets × 20–25 sec', desc: 'Week 3 target. Steady breathing — no breath-holding.' },
        ],
        note: 'Days 15–17: plank → 20–25″. Αν δεν φτάνεις, μείνε στα 15–20″ από W2.',
      },
      {
        id: 'b11', type: 'TC', title: 'Tai Chi — Week 3 Days 18–21',
        struct: "2' warmup · 4×(50''/10') · 1' cool",
        exercises: [
          { name: 'Shoulder Rolls', sets: '10 reps each direction', desc: 'Roll shoulders back slowly and down.' },
          { name: 'Ankle Circles', sets: '10 circles each foot', desc: 'Lift one foot, slow circles with ankle. Switch.' },
          { name: 'Week 3 Flow', sets: '1 full round', desc: 'Days 15–20 slowly with balance.' },
        ],
        note: 'Week 3 closing — joint mobility focus.',
      },
      {
        id: 'b12', type: 'BW', title: 'Army Chair — Days 18–21 · Iso Pulse',
        struct: "2' warmup · 3 sets · 1' cool · rest 60\"",
        exercises: [
          { name: 'Seated Front Kicks', sets: '3 sets × 10 each leg', desc: 'Kick forward with control — power secondary to form.' },
          { name: 'Seated Bicycle Crunch', sets: '3 sets × 12–15 reps', desc: 'Alternate elbow to opposite knee, slow pace.' },
          { name: 'Chair Dips (Hold & Pulse)', sets: '3 sets × 6–8 reps', desc: 'Dip lightly, 1-sec hold at bottom, tiny pulse — then up. Short holds only.' },
          { name: 'Seated Hold Finish Strong', sets: '3 sets × 15–20 sec', desc: 'Seated brace progress from Week 1. Sit tall, breathe.' },
        ],
        note: 'Days 18–21: seated iso 15–20″ + σύντομα dip holds. Προετοιμασία για squat hold.',
      },
    ],
  },
  {
    label: 'Week 4 — Consolidation · Iso στόχοι (Days 22–28)',
    workouts: [
      {
        id: 'b13', type: 'TC', title: 'Tai Chi — Week 4 Mastery',
        struct: "2' warmup · 4×(50''/10') · 1' cool",
        exercises: [
          { name: 'Seated Press', sets: '10 reps', desc: 'Press palms forward from chest.' },
          { name: 'Fair Lady Works at Shuttles', sets: '4 reps each side', desc: 'One arm pushes forward, other pulls back.' },
          { name: 'Double Wind', sets: '10 reps', desc: 'Both arms sweep to one side parting mist, then other.' },
          { name: 'Knee Sweep Flow', sets: '6–8 reps each side', desc: 'Brush hand past knee, other palm faces up.' },
        ],
        note: 'Week 4 — refine movement & build flow.',
      },
      {
        id: 'b14', type: 'BW', title: 'Army Chair — Days 22–24 · Squat Iso',
        struct: "2' warmup · 3 sets · 1' cool · rest 75–90\"",
        exercises: [
          { name: 'Incline Push-ups (Hands on Chair)', sets: '3 sets × 10–12 reps', desc: 'Keep incline (easier). Decline μόνο αν η φόρμα είναι ήδη σταθερή.' },
          { name: 'Squat Hold (Sit & Hold)', sets: '3 sets × 12–20 sec', desc: 'Hover just above seat — light touch allowed if shaking. First squat isometric.' },
          { name: 'Chair Plank Side to Side', sets: '3 sets × 8–12 reps', desc: 'From plank, small side steps. Reset whenever form breaks.' },
        ],
        note: 'Days 22–24: squat hold 12–20″ (όχι 30–45″). Ξεκίνα από 12″ και πρόσθεσε 2–3″/session.',
      },
      {
        id: 'b15', type: 'TC', title: 'Tai Chi — Week 4 Days 25–28',
        struct: "2' warmup · 5×(50''/10') · 1' cool",
        exercises: [
          { name: "Wild Horse's Mane", sets: '6–8 reps each side', desc: 'Sweep one arm side to side over shoulder.' },
          { name: 'Neck Release', sets: '2 min', desc: 'Tilt head slowly side to side. Breathe deeply.' },
          { name: 'Seated Meditation', sets: '2–5 min', desc: 'Sit tall and still. Breathe deeply and relax.' },
        ],
        note: 'Week 4 finale — seated meditation closing.',
      },
      {
        id: 'b16', type: 'BW', title: 'Army Chair — Days 25–28 · Iso Cap',
        struct: "2' warmup · 3 sets · 1' cool · rest 75\"",
        exercises: [
          { name: 'Seated Leg Circles', sets: '3 sets × 6–8 circles each leg', desc: 'Small, slow circles — control over size.' },
          { name: 'Seated V-ups', sets: '3 sets × 8–10 reps', desc: 'Small lean-back + light lift. Partial range OK.' },
          { name: 'Chair Dips', sets: '3 sets × 8–10 reps', desc: 'Standard dips (no knee tuck yet) — clean depth.' },
          { name: 'Seated Hold Finish Strong', sets: '3 sets × 20–30 sec', desc: 'Week 4 iso cap. Solid posture > max seconds.' },
        ],
        note: 'Days 25–28: seated hold έως 20–30″. Ολοκλήρωσες το beginner iso ladder — όχι αποτυχία αν μείνεις στο κάτω όριο.',
      },
    ],
  },
  {
    label: 'Φάση 5 — Peak · εφαρμόσιμο μετά τις 4 εβδομάδες',
    workouts: [
      {
        id: 'b17', type: 'TC', title: 'Tai Chi Peak — Week 1+2 Flow',
        struct: "2' warmup · 5×(50''/10') · 1' cool",
        exercises: [
          { name: 'Opening Breath', sets: '5 breaths', desc: 'Ground yourself — σύνδεση.' },
          { name: 'Cloud Hands', sets: '10 reps', desc: 'Week 1 signature flow.' },
          { name: 'Ward Off', sets: '8 each side', desc: 'Week 2 strength move.' },
          { name: 'Cross Hands', sets: '10 reps', desc: 'Week 2 control.' },
        ],
        note: 'Week 1+2 combined sequence in flow.',
      },
      {
        id: 'b18', type: 'BW', title: 'Army Push Peak — Gradual Variations',
        struct: "2' warmup · 3 sets · 1' cool",
        exercises: [
          { name: 'Chair Push-ups', sets: '3 sets × 10–12 reps', desc: 'Base variation — solid form first.' },
          { name: 'Wide Push-ups (Hands on Chair)', sets: '3 sets × 8–10 reps', desc: 'Wider grip — controlled.' },
          { name: 'Incline Push-ups (Hands on Chair)', sets: '3 sets × 8–10 reps', desc: 'Elevated angle — manageable volume.' },
          { name: 'Chair Plank', sets: '3 sets × 25–30 sec', desc: 'Peak plank target after 4 weeks of progression.' },
        ],
        note: '3 sets (όχι 4). Decline παραλείπεται μέχρι να νιώθεις άνετα με incline.',
      },
      {
        id: 'b19', type: 'TC', title: 'Tai Chi Peak — Week 3+4 Flow',
        struct: "2' warmup · 5×(55''/5') · 1' cool",
        exercises: [
          { name: 'Diagonal Flying', sets: '8 each side', desc: 'Week 3 balance.' },
          { name: 'Embrace Tiger', sets: '8 reps', desc: 'Week 3 flow.' },
          { name: 'Seated Press', sets: '10 reps', desc: 'Week 4 mastery.' },
          { name: 'Seated Meditation', sets: '5 min', desc: 'Full closing.' },
        ],
        note: 'Week 3+4 combined sequence — balance & mastery peak.',
      },
      {
        id: 'b20', type: 'BW', title: 'Army Core Peak',
        struct: "2' warmup · 3 sets · 1' cool",
        exercises: [
          { name: 'Seated Bicycle Crunch', sets: '3 sets × 15–18 reps', desc: 'Steady core rotation — not max reps.' },
          { name: 'Chair Mountain Climbers', sets: '3 sets × 12–16 reps', desc: 'Controlled drive, not sprint.' },
          { name: 'Seated V-ups', sets: '3 sets × 10–12 reps', desc: 'Partial range OK if needed.' },
          { name: 'Seated Hold Finish Strong', sets: '3 sets × 25–35 sec', desc: 'Core iso peak — reachable after Weeks 1–4.' },
        ],
        note: 'Core peak με 3 sets & ρεαλιστικά holds — όχι 4×25.',
      },
      {
        id: 'b21', type: 'TC', title: 'Tai Chi — Complete 28-Day Flow',
        struct: "2' warmup · 5×(60''/5') · 1' cool",
        exercises: [
          { name: 'Opening Breath', sets: '5 breaths', desc: 'Week 1 — grounding.' },
          { name: 'Wave Hands', sets: '8 reps', desc: 'Week 1 flow.' },
          { name: 'Single Whip', sets: '8 each side', desc: 'Week 2 strength.' },
          { name: 'Silk Reeling Circles', sets: '8 reps', desc: 'Week 3 balance.' },
          { name: 'Seated Meditation', sets: '5 min', desc: 'Week 4 closing.' },
        ],
        note: 'Πλήρης ακολουθία 4 εβδομάδων σε ένα session.',
      },
      {
        id: 'b22', type: 'BW', title: 'Army — Milestone Circuit',
        struct: "2' warmup · 3 sets · 1' cool · rest 75\"",
        exercises: [
          { name: 'Chair Push-ups', sets: '3×10–12', desc: 'Day 1 foundation.' },
          { name: 'Chair Dips', sets: '3×8–10', desc: 'Arms — knees bent OK.' },
          { name: 'Chair Plank', sets: '3×25–30s', desc: 'Iso milestone from the ladder.' },
          { name: 'Seated Hold Finish Strong', sets: '3×25–35s', desc: 'Finale hold — κάτω από το παλιό 60s cap.' },
        ],
        note: 'Milestones με εφαρμόσιμα holds (25–35″), όχι 4×60s.',
      },
      {
        id: 'b23', type: 'TC', title: 'Tai Chi — Grand Finale',
        struct: "2' warmup · 5×(60''/5') · 1' cool",
        exercises: [
          { name: 'Opening Breath', sets: '5 breaths', desc: 'Begin — grounding.' },
          { name: 'Cloud Hands', sets: '10 reps', desc: 'Foundation signature.' },
          { name: 'Repulse Monkey', sets: '10 each side', desc: 'Strength & control.' },
          { name: 'Ankle Circles', sets: '10 each foot', desc: 'Joint mobility.' },
          { name: 'Seated Meditation', sets: '5 min', desc: '🎯 28-Day Tai Chi COMPLETE!' },
        ],
        note: 'Grand Finale — πλήρης Tai Chi ακολουθία.',
      },
      {
        id: 'b24', type: 'BW', title: 'Army — Strength & Isometric Peak',
        struct: "2' warmup · 3 sets · 1' cool · rest 75–90\"",
        exercises: [
          { name: 'Wide Push-ups (Hands on Chair)', sets: '3×8–10', desc: 'Upper push — pike μόνο αν είσαι έτοιμος.' },
          { name: 'Squat Hold (Sit & Hold)', sets: '3×20–30s', desc: 'Isometric peak — progressive από 12–20″ της W4.' },
          { name: 'Chair Plank Side to Side', sets: '3×10–14', desc: 'Plank mobility — controlled steps.' },
          { name: 'Seated Hold Finish Strong', sets: '3×30–40s', desc: 'Final hold. Stop early if form breaks.' },
        ],
        note: 'Iso peak: squat 20–30″ · seated 30–40″. Προοδευτικό, όχι άλμα στα 60″.',
      },
      {
        id: 'b25', type: 'TC', title: 'Tai Chi Deep Flow',
        struct: "2' warmup · 5×(60''/5') · 1' cool",
        exercises: [
          { name: 'Wave Hands', sets: '8 reps', desc: 'Full wave sequence.' },
          { name: 'Diagonal Flying', sets: '8 each side', desc: 'Balance & coordination.' },
          { name: 'Shoulder Rolls', sets: '10 each direction', desc: 'Joint release.' },
          { name: 'Seated Meditation', sets: '5 min', desc: 'Deep closing flow.' },
        ],
        note: 'Tai Chi deep mobility — ultimate session.',
      },
      {
        id: 'b26', type: 'BW', title: 'Army — Grand Finale',
        struct: "2' warmup · 3–4 sets · 1' cool · rest 75\"",
        exercises: [
          { name: 'Incline Push-ups (Hands on Chair)', sets: '3–4×10–12', desc: 'Strong incline finish — decline optional later.' },
          { name: 'Seated V-ups', sets: '3–4×10–12', desc: 'Core finish — quality range.' },
          { name: 'Chair Dips', sets: '3–4×8–10', desc: 'Clean dips (knee tuck optional if ready).' },
          { name: 'Seated Hold Finish Strong', sets: '3×30–40s', desc: '🎯 Beginner iso path COMPLETE — 30–40″ solid hold.' },
        ],
        note: 'Finale με ρεαλιστικό iso cap 30–40″. Αν φτάνεις άνετα, πρόσθεσε +5″ την επόμενη φορά.',
      },
    ],
  },
]
