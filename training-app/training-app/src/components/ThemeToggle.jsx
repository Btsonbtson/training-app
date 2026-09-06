const OPTIONS = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
]

export function ThemeToggle({ theme, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      style={{
        display: 'inline-flex',
        gap: 2,
        background: 'var(--surface-2)',
        borderRadius: 8,
        padding: 2,
        border: '1px solid var(--border)',
      }}
    >
      {OPTIONS.map((option) => {
        const active = theme === option.id
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.id)}
            style={{
              border: 'none',
              background: active ? 'var(--surface)' : 'transparent',
              color: active ? 'var(--text)' : 'var(--text-secondary)',
              boxShadow: active ? 'var(--shadow)' : 'none',
              borderRadius: 6,
              padding: '4px 8px',
              fontSize: 11,
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              lineHeight: 1.3,
            }}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
