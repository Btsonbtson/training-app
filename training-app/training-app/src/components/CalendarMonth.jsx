import { monthGrid, monthKey } from '../data/schedule'

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function tone(day) {
  if (!day || !day.inMonth) return { bg: 'transparent', color: 'var(--text-muted)' }
  if (!day.scheduled) return { bg: 'transparent', color: 'var(--text-muted)' }
  if (day.day?.kind === 'rest') return { bg: 'var(--surface-2)', color: 'var(--text-secondary)' }
  if (day.day?.primary === 'treadmill') return { bg: 'var(--accent-light)', color: 'var(--accent)' }
  if (day.day?.primary === 'tai-chi') return { bg: '#e0f2fe', color: '#0369a1' }
  if (day.day?.primary === 'army-chair') return { bg: 'var(--green-light)', color: 'var(--green)' }
  return { bg: 'var(--surface-2)', color: 'var(--text)' }
}

export function CalendarMonth({ dateKey, selected, todayKey, onSelect }) {
  const yearMonth = monthKey(dateKey)
  const cells = monthGrid(yearMonth)
  const [year, month] = yearMonth.split('-').map(Number)
  const title = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1))

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 12,
      marginBottom: 12,
    }}>
      <div style={{ fontSize: 13, fontWeight: 650, marginBottom: 8 }}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
        {WEEKDAYS.map((label, index) => (
          <div key={`${label}-${index}`} style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', fontWeight: 700 }}>
            {label}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((cell) => {
          const colors = tone(cell)
          const isSelected = cell.date === selected
          const isToday = cell.date === todayKey
          const number = Number(cell.date.slice(8, 10))
          return (
            <button
              key={cell.date}
              type="button"
              disabled={!cell.scheduled}
              onClick={() => cell.scheduled && onSelect(cell.date)}
              style={{
                height: 36,
                borderRadius: 8,
                border: isSelected ? '1px solid var(--border-strong)' : isToday ? '1px solid var(--accent)' : '1px solid transparent',
                background: colors.bg,
                color: cell.inMonth ? colors.color : 'var(--text-muted)',
                opacity: cell.inMonth ? 1 : 0.4,
                fontSize: 12,
                fontWeight: isToday || isSelected ? 700 : 500,
                fontFamily: 'inherit',
                cursor: cell.scheduled ? 'pointer' : 'default',
              }}
            >
              {number}
            </button>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10, fontSize: 10, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
        <Legend color="var(--accent-light)" label="Treadmill + Tai Chi" />
        <Legend color="var(--green-light)" label="Army Chair" />
        <Legend color="var(--surface-2)" label="Friday rest" />
      </div>
    </div>
  )
}

function Legend({ color, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{ width: 8, height: 8, borderRadius: 99, background: color, border: '1px solid var(--border)' }} />
      {label}
    </span>
  )
}
