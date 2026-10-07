export const bodyPhases = [
  {
    label: 'Week 1 — Foundation · ~40% ένταση → πλήρες πρόγραμμα',
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
        id: 'b2', type: 'BW', title: 'Army Chair — Days 1–3',
        struct: "2' warmup · 3 sets · 1' cool",
        exercises: [
          { name: 'Chair Push-ups', sets: '3 sets × 6–8 reps', desc: 'Hands on chair edge. Body straight. Lower slowly.' },
          { name: 'Sit to Stand Squats', sets: '3 sets × 8–10 reps', desc: 'Stand fully from seated. Control the descent.' },
          { name: 'Chair Plank', sets: '3 sets × 8–12 sec', desc: 'Hands on seat. Body straight as a plank.' },
        ],
        note: 'Days 1–3: ξεκίνα χαμηλά (~40%). Στόχος πλήρες: 12–15 reps / plank 30″ μέχρι W4–Peak.',
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
        id: 'b4', type: 'BW', title: 'Army Chair — Days 4–7',
        struct: "2' warmup · 3 sets · 1' cool",
        exercises: [
          { name: 'Alternating Leg Extensions', sets: '3 sets × 8–10 reps each leg', desc: 'Extend each leg fully, hold 1 sec, lower.' },
          { name: 'Chair Dips', sets: '3 sets × 6–8 reps', desc: 'Hands on chair edge, dip down, push up.' },
          { name: 'Seated Knee Raises', sets: '3 sets × 8–10 reps', desc: 'Alternate knee raises, core tight.' },
          { name: 'Russian Twists (Seated)', sets: '3 sets × 10–12 reps', desc: 'Hands clasped, rotate torso L/R.' },
        ],
        note: 'Days 4–7: ~40% ένταση. Πλήρες αργότερα: 15 / 12–15 / 15 / 20 reps.',
      },
    ],
  },
  {
    label: 'Week 2 — Strength · ~60% ένταση → πλήρες πρόγραμμα',
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
        id: 'b6', type: 'BW', title: 'Army Chair — Days 8–10',
        struct: "2' warmup · 3 sets · 1' cool",
        exercises: [
          { name: 'Wide Push-ups (Hands on Chair)', sets: '3 sets × 8–10 reps', desc: 'Wider grip, targets chest & back.' },
          { name: 'Seated Leg Raises', sets: '3 sets × 10–12 reps', desc: 'Lift straight leg, hold, lower slowly.' },
          { name: 'Chair Pike Push-ups', sets: '3 sets × 6–8 reps', desc: 'Hips high V-shape, press head toward floor.' },
        ],
        note: 'Days 8–10: ~60% ένταση. Πλήρες: 12–15 / 15 / 10–12 reps.',
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
        id: 'b8', type: 'BW', title: 'Army Chair — Days 11–14',
        struct: "2' warmup · 3 sets · 1' cool",
        exercises: [
          { name: 'Single Leg Sit to Stand', sets: '3 sets × 5–6 reps each leg', desc: 'One foot off floor. Stand on single leg.' },
          { name: 'Seated Oblique Crunch', sets: '3 sets × 8–10 reps each side', desc: 'Elbow to opposite knee, controlled crunch.' },
          { name: 'Tricep Dips (Legs Extended)', sets: '3 sets × 8–10 reps', desc: 'Legs straight out. Deep dip with control.' },
          { name: 'Chair Plank Shoulder Taps', sets: '3 sets × 10–12 taps', desc: 'Plank on chair. Tap opposite shoulder, no rotation.' },
        ],
        note: 'Days 11–14: ~60% ένταση. Πλήρες: 10 / 15 / 12–15 / 20 taps.',
      },
    ],
  },
  {
    label: 'Week 3 — Balance · ~80% ένταση → πλήρες πρόγραμμα',
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
        id: 'b10', type: 'BW', title: 'Army Chair — Days 15–17',
        struct: "2' warmup · 3 sets · 1' cool",
        exercises: [
          { name: 'Incline Push-ups (Hands on Chair)', sets: '3 sets × 10–12 reps', desc: 'Hands elevated on chair. Targets upper chest.' },
          { name: 'Seated Marches', sets: '3 sets × 14–16 reps', desc: 'March in place seated. Drive knees up alternately.' },
          { name: 'Chair Mountain Climbers', sets: '3 sets × 14–16 reps', desc: 'Plank on chair. Drive knee to chest alternately.' },
        ],
        note: 'Days 15–17: ~80% ένταση. Πλήρες: 15 / 20 / 20 reps.',
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
        id: 'b12', type: 'BW', title: 'Army Chair — Days 18–21',
        struct: "2' warmup · 3 sets · 1' cool",
        exercises: [
          { name: 'Seated Front Kicks', sets: '3 sets × 10–12 reps each leg', desc: 'Kick leg forward powerfully from seated.' },
          { name: 'Seated Bicycle Crunch', sets: '3 sets × 14–16 reps', desc: 'Alternate elbow to opposite knee.' },
          { name: 'Chair Dips (Hold & Pulse)', sets: '3 sets × 10–12 reps', desc: 'Dip down, hold at bottom, small pulses.' },
          { name: 'Seated Twist & Reach', sets: '3 sets × 10–12 reps each side', desc: 'Twist torso + reach arm high opposite side.' },
        ],
        note: 'Days 18–21: ~80% ένταση. Πλήρες: 15 / 20 / 15 / 15 reps.',
      },
    ],
  },
  {
    label: 'Week 4 — Mastery · πλήρες 28-Day πρόγραμμα',
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
        id: 'b14', type: 'BW', title: 'Army Chair — Days 22–24',
        struct: "2' warmup · 3 sets · 1' cool",
        exercises: [
          { name: 'Decline Push-ups (Feet on Chair)', sets: '3 sets × 12–15 reps', desc: 'Feet elevated. Targets upper chest & shoulders.' },
          { name: 'Squat Hold (Sit & Hold)', sets: '3 sets × 30–45 sec', desc: 'Hover just above chair seat. Isometric burn.' },
          { name: 'Chair Plank Side to Side', sets: '3 sets × 20 reps', desc: 'From plank position, step feet side to side.' },
        ],
        note: 'Days 22–24: πλήρη νούμερα προγράμματος — squat hold 30–45″.',
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
        id: 'b16', type: 'BW', title: 'Army Chair — Days 25–28',
        struct: "2' warmup · 3 sets · 1' cool",
        exercises: [
          { name: 'Seated Leg Circles', sets: '3 sets × 10 circles each leg', desc: 'Extend leg, draw large slow circles.' },
          { name: 'Seated V-ups', sets: '3 sets × 15 reps', desc: 'Lean back, lift legs + reach arms forward.' },
          { name: 'Chair Dips with Knee Tuck', sets: '3 sets × 12–15 reps', desc: 'Dip + tuck one knee up at bottom.' },
          { name: 'Seated Hold Finish Strong', sets: '3 sets × 45–60 sec', desc: 'Final isometric hold — Finish Strong!' },
        ],
        note: 'Days 25–28: πλήρες πρόγραμμα — seated hold 45–60″. 28-Day Challenge COMPLETE!',
      },
    ],
  },
  {
    label: 'Φάση 5 — Peak · πλήρες πρόγραμμα (στόχος μετά W1–W4)',
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
        id: 'b18', type: 'BW', title: 'Army Push Peak — All 4 Variations',
        struct: "2' warmup · 4 sets · 1' cool",
        exercises: [
          { name: 'Chair Push-ups', sets: '4 sets × 15 reps', desc: 'Day 1 — standard base.' },
          { name: 'Wide Push-ups (Hands on Chair)', sets: '4 sets × 15 reps', desc: 'Day 8 — wider grip.' },
          { name: 'Incline Push-ups (Hands on Chair)', sets: '4 sets × 15 reps', desc: 'Day 15 — elevated angle.' },
          { name: 'Decline Push-ups (Feet on Chair)', sets: '4 sets × 12 reps', desc: 'Day 22 — peak variation.' },
        ],
        note: 'All 4 push-up progressions — peak circuit.',
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
        struct: "2' warmup · 4 sets · 1' cool",
        exercises: [
          { name: 'Seated Bicycle Crunch', sets: '4 sets × 25 reps', desc: 'Max core rotation.' },
          { name: 'Chair Mountain Climbers', sets: '4 sets × 25 reps', desc: 'Max cardio drive.' },
          { name: 'Seated V-ups', sets: '4 sets × 20 reps', desc: 'Max core compression.' },
          { name: 'Chair Dips with Knee Tuck', sets: '4 sets × 15 reps', desc: 'Strength + tuck peak.' },
        ],
        note: 'Core + cardio peak circuit — 4 rounds.',
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
        struct: "2' warmup · 4 sets · 1' cool",
        exercises: [
          { name: 'Chair Push-ups', sets: '4×15', desc: 'Day 1 foundation.' },
          { name: 'Tricep Dips (Legs Extended)', sets: '4×15', desc: 'Day 13 arms.' },
          { name: 'Chair Mountain Climbers', sets: '4×25', desc: 'Day 17 cardio.' },
          { name: 'Seated Hold Finish Strong', sets: '4×60s', desc: 'Day 28 finale.' },
        ],
        note: '4 milestone exercises — full program highlights.',
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
        struct: "2' warmup · 4 sets · 1' cool",
        exercises: [
          { name: 'Chair Pike Push-ups', sets: '4×12', desc: 'Shoulder peak.' },
          { name: 'Squat Hold (Sit & Hold)', sets: '4×45s', desc: 'Isometric peak.' },
          { name: 'Chair Plank Side to Side', sets: '4×20', desc: 'Plank mobility peak.' },
          { name: 'Seated Hold Finish Strong', sets: '4×60s', desc: 'Final hold.' },
        ],
        note: 'Strength & isometric peak.',
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
        struct: "2' warmup · 5 sets · 1' cool",
        exercises: [
          { name: 'Decline Push-ups (Feet on Chair)', sets: '5×15', desc: 'Peak push.' },
          { name: 'Seated V-ups', sets: '5×20', desc: 'Peak core.' },
          { name: 'Chair Dips with Knee Tuck', sets: '5×15', desc: 'Peak dips.' },
          { name: 'Seated Hold Finish Strong', sets: '5×60s', desc: '🎯 28-Day Army COMPLETE!' },
        ],
        note: '28-Day Military Chair Challenge — COMPLETE!',
      },
    ],
  },
]
