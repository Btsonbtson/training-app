export const USER_STATE_KEYS = [
  'tp_tab',
  'tp_theme',
  'tp_ts',
  'tp_tn',
  'tp_td',
  'tp_bs',
  'tp_bn',
  'tp_bd',
  'tp_bw_prog',
  'tp_band',
  'tp_tm',
  'tp_prog_range',
  'tp_reminders',
]

export function snapshotLocal() {
  const data = {}
  for (const key of USER_STATE_KEYS) {
    try {
      const raw = localStorage.getItem(key)
      data[key] = raw == null ? null : JSON.parse(raw)
    } catch {
      data[key] = null
    }
  }
  return data
}

export function applyLocalSnapshot(data) {
  if (!data || typeof data !== 'object') return
  for (const key of USER_STATE_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) continue
    const value = data[key]
    if (value == null) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
    window.dispatchEvent(new CustomEvent('tp-storage', { detail: { key, value } }))
  }
}

export async function fetchUserState(client, userId) {
  const { data, error } = await client
    .from('user_state')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data?.data ?? null
}

export async function saveUserState(client, userId, data) {
  const { error } = await client.from('user_state').upsert({
    user_id: userId,
    data,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
}
