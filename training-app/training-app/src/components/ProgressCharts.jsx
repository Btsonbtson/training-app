export function ProgressCharts({
  progress,
  week,
  streak,
  split,
  hrPoints,
  notes,
  todayKey,
  selected,
  onSelectDate,
}) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
        <ProgressRing pct={progress.pct} done={progress.done} total={progress.total} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <WeekBars
            week={week}
            todayKey={todayKey}
            selected={selected}
            onSelectDate={onSelectDate}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 8, fontSize: 11, color: 'var(--text-secondary)' }}>
            <span>{streak ? `${streak}-day streak` : 'No streak yet'}</span>
            <span>{notes ? `${notes} notes` : 'This week'}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: hrPoints.length ? '1fr 1fr' : '1fr 1fr', gap: 6, marginTop: 10 }}>
        <SplitBar label="Treadmill" color="var(--accent)" item={split.treadmill} />
        <SplitBar label="Chair" color="var(--green)" item={split.chair} />
      </div>

      {hrPoints.length >= 2 && <HrSparkline points={hrPoints} />}
    </div>
  )
}

function ProgressRing({ pct, done, total }) {
  const size = 84
  const r = 30
  const c = 2 * Math.PI * r
  const offset = c * (1 - Math.min(100, Math.max(0, pct)) / 100)
  return (
    <div style={{
      width: size,
      flexShrink: 0,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 6,
    }}>
      <svg width={size - 12} height={size - 12} viewBox="0 0 72 72" aria-label={`${pct}% complete`}>
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--border)" strokeWidth="7" />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform="rotate(-90 36 36)"
        />
        <text x="36" y="34" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--text)">{pct}%</text>
        <text x="36" y="48" textAnchor="middle" fontSize="8" fill="var(--text-muted)">{done}/{total}</text>
      </svg>
    </div>
  )
}

function WeekBars({ week, todayKey, selected, onSelectDate }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '8px 8px 6px',
      height: '100%',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 44 }}>
        {week.map((day) => {
          const isToday = day.date === todayKey
          const isSelected = day.date === selected
          const height = day.kind === 'rest' ? 10 : day.done ? 36 : day.date < todayKey ? 18 : 22
          const bg = day.kind === 'rest'
            ? 'var(--border)'
            : day.done
              ? (day.role === 'army-chair' ? 'var(--green)' : 'var(--accent)')
              : day.date < todayKey
                ? 'var(--amber)'
                : 'var(--surface-2)'
          return (
            <button
              key={day.date}
              type="button"
              title={day.date}
              onClick={() => onSelectDate?.(day.date)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 4,
                height: '100%',
                border: 'none',
                background: 'transparent',
                padding: 0,
                cursor: onSelectDate ? 'pointer' : 'default',
                fontFamily: 'inherit',
              }}
            >
              <div style={{
                width: '100%',
                maxWidth: 18,
                height,
                borderRadius: 4,
                background: bg,
                outline: isSelected || isToday ? '1px solid var(--border-strong)' : 'none',
                outlineOffset: 1,
              }} />
            </button>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
        {week.map((day) => (
          <div key={`${day.date}-l`} style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 9,
            fontWeight: day.date === todayKey ? 700 : 500,
            color: day.date === todayKey ? 'var(--text)' : 'var(--text-muted)',
          }}>
            {day.letter}
          </div>
        ))}
      </div>
    </div>
  )
}

function SplitBar({ label, color, item }) {
  const pct = item.total ? Math.round((item.done / item.total) * 100) : 0
  return (
    <div style={{
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '8px 10px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
        <span>{label}</span>
        <span>{item.done}/{item.total}</span>
      </div>
      <div style={{ height: 4, background: 'var(--border)', borderRadius: 99, marginTop: 6, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color }} />
      </div>
    </div>
  )
}

function HrSparkline({ points }) {
  const width = 320
  const height = 56
  const values = points.map((point) => point.hr)
  const min = Math.min(...values) - 4
  const max = Math.max(...values) + 4
  const span = Math.max(1, max - min)
  const step = width / Math.max(1, points.length - 1)
  const coords = points.map((point, index) => {
    const x = index * step
    const y = height - ((point.hr - min) / span) * height
    return `${x},${y}`
  })
  const last = points[points.length - 1]
  return (
    <div style={{
      marginTop: 8,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '8px 10px 6px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '.04em', textTransform: 'uppercase' }}>
          Treadmill HR avg
        </div>
        <div style={{ fontSize: 13, fontWeight: 700 }}>{last.hr} bpm</div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="48" preserveAspectRatio="none" aria-label="Average heart rate trend">
        <polyline
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={coords.join(' ')}
        />
      </svg>
    </div>
  )
}
