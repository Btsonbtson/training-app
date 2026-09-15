import { useState } from 'react'
import { whatsappMessage } from '../data/schedule'

const fieldStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  background: 'var(--surface-2)',
  color: 'var(--text)',
  fontSize: 14,
  fontFamily: 'inherit',
}

export function ReminderSettings({ reminders, onChange, today }) {
  const [status, setStatus] = useState('')
  const enabled = Boolean(reminders?.enabled)
  const phone = reminders?.phone || ''
  const apiKey = reminders?.apiKey || ''

  const update = (patch) => onChange({ ...reminders, ...patch })

  const sendTest = async () => {
    setStatus('')
    const text = whatsappMessage(today)
    try {
      const response = await fetch('/api/remind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          apikey: apiKey.trim(),
          text,
        }),
      })
      const payload = await response.json().catch(() => ({}))
      if (payload.ok) {
        setStatus('WhatsApp test sent. Check your phone.')
        return
      }
      throw new Error(payload.error || 'Request failed')
    } catch {
      const params = new URLSearchParams({
        phone: phone.replace(/[^\d]/g, ''),
        apikey: apiKey.trim(),
        text,
      })
      window.open(`https://api.callmebot.com/whatsapp.php?${params.toString()}`, '_blank', 'noopener,noreferrer')
      setStatus('Opened CallMeBot to send the test message.')
    }
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 14,
      marginTop: 8,
    }}>
      <h3 style={{ fontSize: 14, fontWeight: 650 }}>Reminders · 06:00</h3>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
        Training days get a WhatsApp at 06:00 Greece time. Rest days are skipped.
        Add CallMeBot on WhatsApp, send <strong>I allow callmebot to send me messages</strong>,
        then paste the API key here.
      </p>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 13 }}>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => update({ enabled: event.target.checked })}
        />
        Send WhatsApp on training days
      </label>

      <label style={{ display: 'block', marginTop: 10, fontSize: 12, fontWeight: 600 }}>Phone (with country code)</label>
      <input
        value={phone}
        onChange={(event) => update({ phone: event.target.value })}
        placeholder="3069xxxxxxxx"
        style={{ ...fieldStyle, marginTop: 4 }}
      />

      <label style={{ display: 'block', marginTop: 10, fontSize: 12, fontWeight: 600 }}>CallMeBot API key</label>
      <input
        value={apiKey}
        onChange={(event) => update({ apiKey: event.target.value })}
        placeholder="123456"
        style={{ ...fieldStyle, marginTop: 4 }}
      />

      <button
        type="button"
        onClick={sendTest}
        disabled={!phone || !apiKey}
        style={{
          marginTop: 12,
          width: '100%',
          padding: 9,
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-strong)',
          background: 'var(--surface-2)',
          color: 'var(--text)',
          font: 'inherit',
          fontWeight: 600,
          cursor: phone && apiKey ? 'pointer' : 'default',
        }}
      >
        Send test WhatsApp
      </button>
      {status && (
        <p style={{ marginTop: 8, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{status}</p>
      )}
    </div>
  )
}
