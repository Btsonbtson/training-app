import { formatDateLabel } from '../data/schedule'

export function RestCard({ day }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px dashed var(--border-strong)',
      borderRadius: 'var(--radius-lg)',
      marginBottom: 8,
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <div style={{
        width: 30,
        height: 30,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: 'var(--surface-2)',
        color: 'var(--text-muted)',
        fontSize: 11,
        fontWeight: 700,
      }}>
        R
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{day.label || 'Rest day'}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          {formatDateLabel(day.date)} · walk, mobility, or full rest
        </div>
      </div>
    </div>
  )
}
