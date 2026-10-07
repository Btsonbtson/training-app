// SVG illustration helpers
const SK = '#C68642'  // skin
const SH = '#2D5A8E'  // shirt
const PT = '#1a1a2e'  // pants
const AC = '#1D6FA5'  // active / highlight
const CH = '#8B4513'  // chair
const BD = '#6c6a64'  // body outline

const ln = (x1, y1, x2, y2, c = BD, w = 2.5) =>
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={w} strokeLinecap="round" />

const ci = (cx, cy, r, f = 'none', sc = BD, sw = 2) =>
  <circle cx={cx} cy={cy} r={r} fill={f} stroke={sc} strokeWidth={sw} />

const pa = (d, c = BD, w = 2.5) =>
  <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />

const tx = (x, y, txt, f = '#9c9a94', sz = 10) =>
  <text x={x} y={y} textAnchor="middle" fontSize={sz} fill={f} fontFamily="-apple-system,sans-serif">{txt}</text>

const Ground = ({ y = 138, x1 = 15, x2 = 265 }) =>
  <line x1={x1} y1={y} x2={x2} y2={y} stroke="#c8c5bc" strokeWidth={1.5} strokeDasharray="5 3" />

const Chair = ({ x, y }) => <>
  {ln(x, y + 28, x + 55, y + 28, CH, 5)}
  {ln(x, y + 28, x, y + 55, CH, 4)}
  {ln(x + 55, y + 28, x + 55, y + 55, CH, 4)}
  {ln(x + 55, y, x + 55, y + 28, CH, 5)}
</>

const Head = ({ x, y }) => ci(x, y, 11, SK, BD, 1.5)

const Seated = ({ hx, hy, al = 'down', ar = 'down', liftL = false }) => {
  const armX = (side, dir) => {
    const m = side === 'L' ? -1 : 1
    if (dir === 'up') return hx + m * 22
    if (dir === 'fwd') return hx + m * 25
    if (dir === 'out') return hx + m * 30
    return hx + m * 12
  }
  const armY = (dir) => {
    if (dir === 'up') return hy + 2
    if (dir === 'fwd') return hy + 8
    if (dir === 'out') return hy + 20
    return hy + 38
  }
  return <>
    <Head x={hx} y={hy} />
    {ln(hx, hy + 11, hx, hy + 39, SH, 10)}
    {ln(hx - 8, hy + 18, armX('L', al), armY(al), SK, 6)}
    {ln(hx + 8, hy + 18, armX('R', ar), armY(ar), SK, 6)}
    {liftL
      ? <>{ln(hx - 6, hy + 38, hx - 6, hy + 52, PT, 8)}{ln(hx - 6, hy + 52, hx + 8, hy + 38, AC, 7)}</>
      : ln(hx - 6, hy + 38, hx - 8, hy + 58, PT, 8)
    }
    {ln(hx + 6, hy + 38, hx + 8, hy + 58, PT, 8)}
  </>
}

const StandSq = ({ hx, hy, al = 'down', ar = 'down' }) => {
  const armX = (side, dir) => {
    const m = side === 'L' ? -1 : 1
    if (dir === 'up') return hx + m * 22
    if (dir === 'fwd') return hx + m * 25
    return hx + m * 12
  }
  const armY = (dir) => dir === 'up' ? hy + 4 : dir === 'fwd' ? hy + 10 : hy + 40
  return <>
    <Head x={hx} y={hy} />
    {ln(hx, hy + 11, hx, hy + 42, SH, 10)}
    {ln(hx - 8, hy + 20, armX('L', al), armY(al), SK, 6)}
    {ln(hx + 8, hy + 20, armX('R', ar), armY(ar), SK, 6)}
    {ln(hx - 8, hy + 42, hx - 18, hy + 65, PT, 8)}
    {ln(hx + 8, hy + 42, hx + 18, hy + 65, PT, 8)}
    {ln(hx - 18, hy + 65, hx - 12, hy + 90, PT, 7)}
    {ln(hx + 18, hy + 65, hx + 22, hy + 90, PT, 7)}
  </>
}

const Wrap = ({ children, label = '', w = 280, h = 150 }) => (
  <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '100%' }}>
    {children}
    {label && tx(w / 2, h - 4, label)}
  </svg>
)

// ── TAI CHI ILLUSTRATIONS ──────────────────────────────────

const OpeningBreath = () => <Wrap label="Sit tall · deep breaths">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="up" ar="up" />
  {pa('M95 60 Q80 50 83 68', AC)}{pa('M175 60 Q190 50 187 68', AC)}
</Wrap>

const RisingHands = () => <Wrap label="Lift arms to shoulder height · 8 reps">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="up" ar="up" />
  {tx(100, 50, '↑', AC, 18)}
</Wrap>

const WaveHands = () => <Wrap label="Sway side to side · 8 reps">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="out" ar="fwd" />
  {pa('M165 58 Q185 48 180 65 Q195 62 188 78', AC, 2.5)}
</Wrap>

const BrushKnee = () => <Wrap label="Brush hand over knee · 8 each side">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="fwd" ar="down" liftL />
  {pa('M160 68 Q162 82 148 90', AC, 2.5)}{ci(148, 92, 5, AC, AC, 1)}
</Wrap>

const CloudHands = () => <Wrap label="Soft circles like clouds · 10 reps">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="out" ar="out" />
  {pa('M95 65 Q72 55 75 72 Q58 68 65 84', AC, 2.5)}
  {pa('M175 65 Q198 55 195 72 Q212 68 205 84', AC, 2.5)}
</Wrap>

const PushTheMountain = () => <Wrap label="Push both hands forward · 10 reps">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="fwd" ar="fwd" />
  {tx(190, 65, '→', AC, 16)}
</Wrap>

const Week1Flow = () => <Wrap label="Full round · no stopping">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="up" ar="out" />
  {pa('M95 55 Q75 45 80 62', AC)}{pa('M175 65 Q195 55 190 72', AC)}
</Wrap>

const WardOff = () => <Wrap label="One hand fwd other near ear · 8 each">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="fwd" ar="up" />
  {tx(95, 65, '←', AC, 14)}
</Wrap>

const SingleWhip = () => <Wrap label="Extend arm out · 8 each side">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="out" ar="out" />
  {ln(105, 65, 65, 58, AC, 2.5)}{ci(63, 57, 5, AC, AC, 1)}{tx(55, 52, 'hook', AC, 9)}
</Wrap>

const WhiteCrane = () => <Wrap label="Open like wings · 8 reps">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="down" ar="up" />
  {tx(102, 80, '↓', AC, 14)}{tx(168, 48, '↑', AC, 14)}
</Wrap>

const CrossHands = () => <Wrap label="Cross arms in front · 10 reps">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="fwd" ar="fwd" />
  {ln(105, 62, 165, 72, AC, 2)}{ln(165, 62, 105, 72, AC, 2)}{tx(135, 56, '✕', AC, 14)}
</Wrap>

const RollBack = () => <Wrap label="Roll hands back to hips · 10 reps">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="out" ar="fwd" />
  {pa('M170 62 Q185 52 178 70 Q192 68 184 84', AC, 2.5)}
</Wrap>

const RepulseMonkey = () => <Wrap label="Push fwd pull back · 10 each side">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="fwd" ar="up" />
  {tx(92, 62, '←', AC, 14)}
</Wrap>

const Week2Flow = () => <Wrap label="Full round with control">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="fwd" ar="out" />
</Wrap>

const DiagonalFlying = () => <Wrap label="Arms diagonally wide · 8 each">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="down" ar="up" />
  {ln(102, 90, 168, 48, AC, 2)}
</Wrap>

const SpinalTwist = () => <Wrap label="Rotate torso each side · 8 reps">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="out" ar="out" />
  {pa('M118 55 Q105 65 118 75', AC, 2.5)}{tx(104, 82, '↺', AC, 14)}
</Wrap>

const EmbraceTiger = () => <Wrap label="Circle arms wide · 8 reps">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="out" ar="out" />
  {pa('M105 65 Q135 50 165 65', AC, 2.5)}
</Wrap>

const SilkReelingCircles = () => <Wrap label="Circle one arm then other · 8 reps">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="out" ar="out" />
  {pa('M105 62 Q95 50 108 44 Q122 38 128 52 Q132 66 118 72 Q105 76 105 62', AC, 2)}
  {pa('M165 62 Q175 50 162 44 Q148 38 142 52 Q138 66 152 72 Q165 76 165 62', AC, 2)}
</Wrap>

const ShoulderRolls = () => <Wrap label="Roll shoulders back · 10 each direction">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="down" ar="down" />
  {pa('M118 55 Q108 46 122 42 Q135 38 132 52', AC, 2.5)}
  {pa('M152 55 Q162 46 148 42 Q135 38 138 52', AC, 2.5)}
</Wrap>

const AnkleCircles = () => <Wrap label="Lift foot circles with ankle · 10 each">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} liftL />
  {pa('M143 98 Q154 88 158 100 Q156 114 144 116 Q133 114 132 102 Q133 90 143 98', AC, 2.5)}
  {tx(148, 82, '↻', AC, 14)}
</Wrap>

const Week3Flow = () => <Wrap label="Full round · balance focus">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="out" ar="up" />
</Wrap>

const SeatedPress = () => <Wrap label="Press palms from chest · 10 reps">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="up" ar="up" />
  {tx(115, 38, '↑ press', AC, 9)}
</Wrap>

const FairLadyAtShuttles = () => <Wrap label="One pushes fwd other pulls · 4 each">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="up" ar="fwd" />
  {tx(96, 42, '↑', AC, 14)}{tx(172, 58, '→', AC, 14)}
</Wrap>

const DoubleWind = () => <Wrap label="Arms sweep side to side · 10 reps">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="out" ar="out" />
  {pa('M105 62 Q88 50 98 40', AC, 2.5)}{pa('M165 62 Q182 50 172 40', AC, 2.5)}
</Wrap>

const KneeSweepFlow = () => <Wrap label="Sweep hand past knee · 6–8 each">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="fwd" ar="down" liftL />
  {pa('M112 68 Q118 80 128 72', AC, 2.5)}
</Wrap>

const WildHorsesMane = () => <Wrap label="Sweep arm over shoulder · 6–8 each">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="out" ar="up" />
  {ln(105, 62, 72, 50, AC, 2.5)}{tx(65, 46, '→', AC, 12)}
</Wrap>

const NeckRelease = () => <Wrap label="Tilt head L/R breathe · 2 min">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="down" ar="down" />
  {pa('M130 45 Q118 38 122 50', AC, 2.5)}{tx(115, 36, '←→', AC, 11)}
</Wrap>

const SeatedMeditation = () => <Wrap label="Sit still breathe deeply · 2–5 min">
  <Chair x={100} y={40} /><Seated hx={135} hy={45} al="out" ar="out" />
  {pa('M105 90 Q135 105 165 90', AC, 2)}{tx(135, 78, '☯', AC, 18)}
</Wrap>

// ── ARMY CHAIR ILLUSTRATIONS ───────────────────────────────

const ChairPushUps = () => <Wrap label="3 sets × 12–15 reps">
  <Ground />
  <rect x="180" y="82" width="65" height="9" rx="3" fill={CH} />
  {ln(190, 91, 190, 138, CH, 5)}{ln(235, 91, 235, 138, CH, 5)}
  <Head x={75} y={52} />
  {ln(75, 63, 75, 93, SH, 10)}
  {ln(75, 93, 65, 138, PT, 8)}{ln(75, 93, 88, 138, PT, 8)}
  {ln(63, 76, 180, 84, SK, 6)}{ln(87, 76, 245, 87, SK, 6)}
</Wrap>

const SitToStandSquats = () => <Wrap label="3 sets × 15 reps">
  <Ground />
  <rect x="185" y="82" width="60" height="8" rx="3" fill={CH} />
  {ln(195, 90, 195, 138, CH, 5)}{ln(235, 90, 235, 138, CH, 5)}
  <StandSq hx={115} hy={30} al="fwd" ar="fwd" />
</Wrap>

const ChairPlank = () => <Wrap label="progressive hold · start 8–12 sec">
  <Ground />
  <rect x="18" y="82" width="58" height="9" rx="3" fill={CH} />
  {ln(28, 91, 28, 138, CH, 5)}{ln(66, 91, 66, 138, CH, 5)}
  <Head x={215} y={55} />
  {ln(215, 66, 75, 80, SH, 10)}
  {ln(215, 66, 230, 108, PT, 8)}{ln(230, 108, 235, 138, PT, 7)}
  {ln(215, 66, 222, 110, PT, 8)}{ln(222, 110, 225, 138, PT, 7)}
  {ln(195, 73, 75, 82, SK, 6)}
</Wrap>

const AlternatingLegExtensions = () => <Wrap label="3 sets × 15 reps each leg">
  <Chair x={105} y={42} /><Seated hx={138} hy={47} al="down" ar="down" />
  {ln(128, 78, 175, 52, AC, 8)}{ci(177, 50, 7, AC, AC, 1)}{tx(186, 48, '↗', AC, 10)}
</Wrap>

const ChairDips = () => <Wrap label="3 sets × 12–15 reps">
  <Ground />
  <rect x="18" y="68" width="60" height="8" rx="3" fill={CH} />
  {ln(28, 76, 28, 138, CH, 5)}{ln(68, 76, 68, 138, CH, 5)}
  <Head x={120} y={48} />
  {ln(120, 59, 120, 92, SH, 10)}
  {ln(120, 92, 108, 138, PT, 8)}{ln(120, 92, 132, 138, PT, 8)}
  {ln(120, 72, 68, 72, SK, 7)}{ln(120, 72, 178, 72, SK, 7)}
  {tx(28, 58, '↕', AC, 16)}
</Wrap>

const SeatedKneeRaises = () => <Wrap label="3 sets × 15 reps">
  <Chair x={105} y={42} /><Seated hx={138} hy={47} al="down" ar="down" liftL />
  {tx(112, 65, '↑', AC, 18)}
</Wrap>

const RussianTwists = () => <Wrap label="3 sets × 20 reps">
  <Chair x={105} y={42} /><Seated hx={138} hy={47} al="out" ar="out" />
  {pa('M122 60 Q110 72 124 82', AC, 2.5)}{tx(106, 88, '↺', AC, 16)}
</Wrap>

const WidePushUps = () => <Wrap label="3 sets × 12–15 reps wide grip">
  <Ground />
  <rect x="178" y="80" width="72" height="9" rx="3" fill={CH} />
  {ln(188, 89, 188, 138, CH, 5)}{ln(240, 89, 240, 138, CH, 5)}
  <Head x={68} y={50} />
  {ln(68, 61, 68, 93, SH, 10)}
  {ln(68, 93, 58, 138, PT, 8)}{ln(68, 93, 80, 138, PT, 8)}
  {ln(52, 75, 178, 82, SK, 6)}{ln(84, 75, 250, 84, SK, 6)}
</Wrap>

const SeatedLegRaises = () => <Wrap label="3 sets × 15 reps">
  <Chair x={105} y={42} /><Seated hx={138} hy={47} al="down" ar="down" liftL />
  {ln(128, 75, 172, 48, AC, 8)}{tx(180, 46, '↑↑', AC, 11)}
</Wrap>

const ChairPikePushUps = () => <Wrap label="3 sets × 10–12 reps">
  <Ground />
  <rect x="178" y="60" width="60" height="9" rx="3" fill={CH} />
  {ln(188, 69, 188, 138, CH, 5)}{ln(228, 69, 228, 138, CH, 5)}
  <Head x={88} y={32} />
  {ln(88, 43, 128, 85, SH, 10)}
  {ln(128, 85, 178, 68, SK, 6)}{ln(128, 85, 158, 115, PT, 8)}{ln(158, 115, 165, 138, PT, 7)}
  {ln(88, 43, 72, 80, SK, 6)}
</Wrap>

const SingleLegSitToStand = () => <Wrap label="3 sets × 10 reps each leg">
  <Ground />
  <rect x="188" y="82" width="58" height="8" rx="3" fill={CH} />
  {ln(198, 90, 198, 138, CH, 5)}{ln(236, 90, 236, 138, CH, 5)}
  <Head x={112} y={30} />
  {ln(112, 41, 112, 76, SH, 10)}
  {ln(112, 76, 135, 112, PT, 8)}{ln(135, 112, 142, 138, PT, 7)}
  {ln(112, 76, 100, 48, AC, 7)}{ci(100, 45, 6, AC, AC, 1)}
</Wrap>

const SeatedObliqueCrunch = () => <Wrap label="3 sets × 15 reps each side">
  <Chair x={105} y={42} /><Seated hx={138} hy={47} al="up" ar="down" liftL />
  {pa('M148 60 Q140 72 148 80', AC, 2.5)}{tx(155, 86, 'elbow→knee', AC, 8)}
</Wrap>

const TricepDips = () => <Wrap label="3 sets × 12–15 reps legs straight">
  <Ground />
  <rect x="18" y="58" width="60" height="8" rx="3" fill={CH} />
  {ln(28, 66, 28, 138, CH, 5)}{ln(68, 66, 68, 138, CH, 5)}
  <Head x={118} y={42} />
  {ln(118, 53, 118, 88, SH, 10)}
  {ln(118, 88, 185, 95, PT, 8)}{ln(185, 95, 255, 92, PT, 8)}
  {ln(118, 65, 68, 62, SK, 7)}{tx(28, 50, '↕', AC, 16)}
</Wrap>

const ChairPlankShoulderTaps = () => <Wrap label="3 sets × 8–10 taps">
  <Ground />
  <rect x="18" y="82" width="58" height="9" rx="3" fill={CH} />
  {ln(28, 91, 28, 138, CH, 5)}{ln(66, 91, 66, 138, CH, 5)}
  <Head x={215} y={55} />
  {ln(215, 66, 76, 80, SH, 10)}
  {ln(215, 66, 232, 108, PT, 8)}{ln(232, 108, 235, 138, PT, 7)}
  {ln(195, 72, 76, 80, SK, 6)}
  {ln(165, 76, 148, 62, AC, 6)}{ci(146, 60, 6, AC, AC, 1)}{tx(140, 52, 'tap ↗', AC, 9)}
</Wrap>

const InclinePushUps = () => <Wrap label="3 sets × 15 reps elevated angle">
  <Ground />
  <rect x="185" y="90" width="62" height="9" rx="3" fill={CH} />
  {ln(195, 99, 195, 138, CH, 5)}{ln(237, 99, 237, 138, CH, 5)}
  <Head x={72} y={58} />
  {ln(72, 69, 72, 102, SH, 10)}
  {ln(72, 102, 62, 138, PT, 8)}{ln(72, 102, 84, 138, PT, 8)}
  {ln(58, 80, 185, 92, SK, 6)}{ln(86, 80, 248, 95, SK, 6)}
</Wrap>

const SeatedMarches = () => <Wrap label="3 sets × 20 reps">
  <Chair x={105} y={42} /><Seated hx={138} hy={47} al="fwd" ar="down" liftL />
  {tx(108, 62, '↑↓', AC, 14)}
</Wrap>

const ChairMountainClimbers = () => <Wrap label="3 sets × 20 reps">
  <Ground />
  <rect x="178" y="76" width="60" height="9" rx="3" fill={CH} />
  {ln(188, 85, 188, 138, CH, 5)}{ln(228, 85, 228, 138, CH, 5)}
  <Head x={82} y={42} />
  {ln(82, 53, 130, 80, SH, 10)}
  {ln(130, 80, 178, 78, SK, 6)}
  {ln(130, 80, 160, 112, PT, 8)}{ln(160, 112, 168, 138, PT, 7)}
  {ln(115, 80, 100, 60, AC, 7)}{ci(100, 57, 6, AC, AC, 1)}{tx(92, 52, 'knee→chest', AC, 9)}
</Wrap>

const SeatedFrontKicks = () => <Wrap label="3 sets × 15 reps each leg">
  <Chair x={105} y={42} /><Seated hx={138} hy={47} al="down" ar="down" />
  {ln(128, 78, 176, 45, AC, 8)}{ci(178, 43, 7, AC, AC, 1)}{tx(185, 40, 'kick!', AC, 10)}
</Wrap>

const SeatedBicycleCrunch = () => <Wrap label="3 sets × 20 reps">
  <Chair x={105} y={42} /><Seated hx={138} hy={47} al="up" ar="down" liftL />
  {pa('M148 60 Q138 72 148 80', AC, 2.5)}{tx(104, 86, '↺ bicycle', AC, 9)}
</Wrap>

const ChairDipsHoldPulse = () => <Wrap label="3 sets × 6–8 reps · short hold">
  <Ground />
  <rect x="18" y="68" width="60" height="8" rx="3" fill={CH} />
  {ln(28, 76, 28, 138, CH, 5)}{ln(68, 76, 68, 138, CH, 5)}
  <Head x={120} y={52} />
  {ln(120, 63, 120, 96, SH, 10)}
  {ln(120, 96, 108, 138, PT, 8)}{ln(120, 96, 132, 138, PT, 8)}
  {ln(120, 74, 68, 72, SK, 7)}{ln(120, 74, 178, 72, SK, 7)}
  {tx(28, 58, 'hold', AC, 9)}{pa('M115 52 Q120 44 125 52', AC, 2)}
</Wrap>

const SeatedTwistReach = () => <Wrap label="3 sets × 15 reps each side">
  <Chair x={105} y={42} /><Seated hx={138} hy={47} al="out" ar="up" />
  {pa('M122 58 Q108 68 120 78', AC, 2.5)}
</Wrap>

const DeclinePushUps = () => <Wrap label="3 sets × 12–15 reps feet elevated">
  <Ground />
  <rect x="182" y="52" width="65" height="9" rx="3" fill={CH} />
  {ln(192, 61, 192, 138, CH, 5)}{ln(237, 61, 237, 138, CH, 5)}
  <Head x={62} y={70} />
  {ln(62, 81, 182, 62, SH, 10)}
  {ln(62, 81, 52, 118, PT, 8)}{ln(52, 118, 45, 138, PT, 7)}{ln(52, 118, 62, 138, PT, 7)}
  {ln(48, 88, 182, 64, SK, 6)}{ln(76, 88, 250, 66, SK, 6)}
</Wrap>

const SquatHold = () => <Wrap label="3 sets × 12–20 sec · build up">
  <Ground />
  <rect x="188" y="82" width="58" height="8" rx="3" fill={CH} />
  {ln(198, 90, 198, 138, CH, 5)}{ln(236, 90, 236, 138, CH, 5)}
  <StandSq hx={115} hy={28} al="fwd" ar="fwd" />
  {tx(82, 88, 'hold', AC, 10)}
</Wrap>

const ChairPlankSideToSide = () => <Wrap label="3 sets × 20 reps">
  <Ground />
  <rect x="18" y="82" width="58" height="9" rx="3" fill={CH} />
  {ln(28, 91, 28, 138, CH, 5)}{ln(66, 91, 66, 138, CH, 5)}
  <Head x={215} y={58} />
  {ln(215, 69, 76, 80, SH, 10)}
  {ln(215, 69, 232, 108, PT, 8)}{ln(232, 108, 235, 138, PT, 7)}
  {ln(195, 74, 76, 80, SK, 6)}
  {ln(185, 78, 168, 98, AC, 6)}{tx(155, 105, '←→ side', AC, 9)}
</Wrap>

const SeatedLegCircles = () => <Wrap label="3 sets × 10 circles each leg">
  <Chair x={105} y={42} /><Seated hx={138} hy={47} liftL />
  {pa('M145 78 Q162 65 168 82 Q165 100 150 104 Q135 104 130 88 Q130 72 145 78', AC, 2.5)}
  {tx(150, 60, '↻ circle', AC, 9)}
</Wrap>

const SeatedVUps = () => <Wrap label="3 sets × 15 reps">
  <Chair x={105} y={42} /><Seated hx={138} hy={47} al="fwd" ar="fwd" liftL />
  {ln(148, 65, 168, 48, AC, 2)}{tx(140, 48, 'V', AC, 16)}
</Wrap>

const ChairDipsKneeTuck = () => <Wrap label="3 sets × 12–15 reps">
  <Ground />
  <rect x="18" y="68" width="60" height="8" rx="3" fill={CH} />
  {ln(28, 76, 28, 138, CH, 5)}{ln(68, 76, 68, 138, CH, 5)}
  <Head x={120} y={46} />
  {ln(120, 57, 120, 92, SH, 10)}
  {ln(120, 92, 105, 78, AC, 7)}{ci(104, 75, 6, AC, AC, 1)}
  {ln(120, 92, 132, 138, PT, 7)}
  {ln(120, 70, 68, 68, SK, 7)}{ln(120, 70, 178, 68, SK, 7)}
  {tx(98, 68, 'tuck↑', AC, 9)}
</Wrap>

const SeatedHoldFinishStrong = () => <Wrap label="progressive · start 10–15 sec">
  <Chair x={105} y={42} /><Seated hx={138} hy={47} al="up" ar="up" />
  {tx(138, 30, 'FINISH STRONG', AC, 10)}
  {pa('M108 38 Q138 28 168 38', AC, 2)}
</Wrap>

// ── EXPORT MAP ─────────────────────────────────────────────
export const ILLUSTRATIONS = {
  // Tai Chi
  'Opening Breath': <OpeningBreath />,
  'Rising Hands': <RisingHands />,
  'Wave Hands': <WaveHands />,
  'Brush Knee': <BrushKnee />,
  'Cloud Hands': <CloudHands />,
  'Push the Mountain': <PushTheMountain />,
  'Week 1 Flow': <Week1Flow />,
  'Ward Off': <WardOff />,
  'Single Whip': <SingleWhip />,
  'White Crane': <WhiteCrane />,
  'Cross Hands': <CrossHands />,
  'Roll Back': <RollBack />,
  'Repulse Monkey': <RepulseMonkey />,
  'Week 2 Flow': <Week2Flow />,
  'Diagonal Flying': <DiagonalFlying />,
  'Spinal Twist': <SpinalTwist />,
  'Embrace Tiger': <EmbraceTiger />,
  'Silk Reeling Circles': <SilkReelingCircles />,
  'Shoulder Rolls': <ShoulderRolls />,
  'Ankle Circles': <AnkleCircles />,
  'Week 3 Flow': <Week3Flow />,
  'Seated Press': <SeatedPress />,
  'Fair Lady Works at Shuttles': <FairLadyAtShuttles />,
  'Double Wind': <DoubleWind />,
  'Knee Sweep Flow': <KneeSweepFlow />,
  "Wild Horse's Mane": <WildHorsesMane />,
  'Neck Release': <NeckRelease />,
  'Seated Meditation': <SeatedMeditation />,
  // Army
  'Chair Push-ups': <ChairPushUps />,
  'Sit to Stand Squats': <SitToStandSquats />,
  'Chair Plank': <ChairPlank />,
  'Alternating Leg Extensions': <AlternatingLegExtensions />,
  'Chair Dips': <ChairDips />,
  'Seated Knee Raises': <SeatedKneeRaises />,
  'Russian Twists (Seated)': <RussianTwists />,
  'Wide Push-ups (Hands on Chair)': <WidePushUps />,
  'Seated Leg Raises': <SeatedLegRaises />,
  'Chair Pike Push-ups': <ChairPikePushUps />,
  'Single Leg Sit to Stand': <SingleLegSitToStand />,
  'Seated Oblique Crunch': <SeatedObliqueCrunch />,
  'Tricep Dips (Legs Extended)': <TricepDips />,
  'Chair Plank Shoulder Taps': <ChairPlankShoulderTaps />,
  'Incline Push-ups (Hands on Chair)': <InclinePushUps />,
  'Seated Marches': <SeatedMarches />,
  'Chair Mountain Climbers': <ChairMountainClimbers />,
  'Seated Front Kicks': <SeatedFrontKicks />,
  'Seated Bicycle Crunch': <SeatedBicycleCrunch />,
  'Chair Dips (Hold & Pulse)': <ChairDipsHoldPulse />,
  'Seated Twist & Reach': <SeatedTwistReach />,
  'Decline Push-ups (Feet on Chair)': <DeclinePushUps />,
  'Squat Hold (Sit & Hold)': <SquatHold />,
  'Chair Plank Side to Side': <ChairPlankSideToSide />,
  'Seated Leg Circles': <SeatedLegCircles />,
  'Seated V-ups': <SeatedVUps />,
  'Chair Dips with Knee Tuck': <ChairDipsKneeTuck />,
  'Seated Hold Finish Strong': <SeatedHoldFinishStrong />,
}
