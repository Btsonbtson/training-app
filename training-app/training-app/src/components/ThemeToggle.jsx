export function resolveTheme(value) {
  if (value === 'dark' || value === 'light') return value
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function applyTheme(theme) {
  const resolved = resolveTheme(theme)
  document.documentElement.setAttribute('data-theme', resolved)
  return resolved
}

export function ThemeToggle({ theme, onChange }) {
  const current = resolveTheme(theme)
  const next = current === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      onClick={() => onChange(next)}
      aria-label={`Switch to ${next} theme`}
      style={{
        border: '1px solid var(--border)',
        background: 'var(--surface-2)',
        color: 'var(--text)',
        borderRadius: 8,
        padding: '4px 10px',
        fontSize: 11,
        fontWeight: 600,
        fontFamily: 'inherit',
        cursor: 'pointer',
        lineHeight: 1.3,
      }}
    >
      {next === 'light' ? 'Light' : 'Dark'}
    </button>
  )
}
