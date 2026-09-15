import { useAuth } from '../context/AuthContext'
import { useUserData } from '../context/UserDataContext'

const STATUS_LABEL = {
  loading: 'Loading…',
  saving: 'Saving…',
  saved: 'Saved in account',
  error: 'Save failed',
  local: 'Saved on this device',
  'signed-out': 'Not signed in',
}

export function AccountBar() {
  const { user, cloudEnabled, signOut } = useAuth()
  const { status } = useUserData()

  if (!user && !cloudEnabled) return null

  const goToAuth = () => {
    try {
      localStorage.removeItem('tp_guest')
    } catch {
      // Ignore if storage is blocked.
    }
    window.location.reload()
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      marginTop: 10,
      fontSize: 12,
      color: 'var(--text-secondary)',
    }}>
      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {user ? user.email : 'Guest'}
        {' · '}
        {STATUS_LABEL[status] || status}
      </span>
      {user ? (
        <button
          type="button"
          onClick={() => signOut()}
          style={{
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            borderRadius: 6,
            padding: '3px 8px',
            fontSize: 11,
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          Sign out
        </button>
      ) : (
        <button
          type="button"
          onClick={goToAuth}
          style={{
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            borderRadius: 6,
            padding: '3px 8px',
            fontSize: 11,
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          Sign in
        </button>
      )}
    </div>
  )
}
