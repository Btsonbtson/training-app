import { useState } from 'react'
import { whatsappMessage, whatsappMissedMessage } from '../data/schedule'

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

  const update = (patch) => onChange({ ...reminders, ...patch })

  const sendTest = async (kind) => {
    setStatus('')
    const text = kind === 'missed' ? whatsappMissedMessage(today) : whatsappMessage(today)
    try {
      const response = await fetch('/api/remind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, text, kind }),
      })
      const payload = await response.json().catch(() => ({}))
      if (payload.ok) {
        setStatus(kind === 'missed'
          ? '22:00 missed-training WhatsApp sent. Check your phone.'
          : '06:00 WhatsApp test sent. Check your phone.')
        return
      }
      setStatus(payload.error || 'Could not send. Join the Twilio WhatsApp sandbox first, then try again.')
    } catch (error) {
      setStatus(error.message || 'Could not reach the reminder server.')
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
      <h3 style={{ fontSize: 14, fontWeight: 650 }}>Reminders · 06:00 & 22:00</h3>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
        Στέλνει WhatsApp μέσω Twilio, ώρα Ελλάδας. 06:00 το πρωί της προπόνησης,
        και 22:00 αν δεν την έχεις σημειώσει ως done. Πρώτα άνοιξε το WhatsApp, στείλε στο
        {' '}<strong>+1 415 523 8886</strong> το <strong>join …</strong> code από το Twilio
        (Messaging → Try it out → Send a WhatsApp message). Μετά βάλε το κινητό σου εδώ
        (30 + αριθμός χωρίς το αρχικό 0) και πάτα test. Για το 22:00, κάνε Sign in
        ώστε ο server να βλέπει αν την έκανες.
      </p>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 13 }}>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => update({ enabled: event.target.checked })}
        />
        Send WhatsApp at 06:00, and at 22:00 if not done
      </label>

      <label style={{ display: 'block', marginTop: 10, fontSize: 12, fontWeight: 600 }}>Phone (with country code)</label>
      <input
        value={phone}
        onChange={(event) => update({ phone: event.target.value })}
        placeholder="3069xxxxxxxx"
        style={{ ...fieldStyle, marginTop: 4 }}
      />

      <button
        type="button"
        onClick={() => sendTest('morning')}
        disabled={!phone}
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
          cursor: phone ? 'pointer' : 'default',
        }}
      >
        Send 06:00 test
      </button>
      <button
        type="button"
        onClick={() => sendTest('missed')}
        disabled={!phone}
        style={{
          marginTop: 8,
          width: '100%',
          padding: 9,
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-strong)',
          background: 'var(--surface-2)',
          color: 'var(--text)',
          font: 'inherit',
          fontWeight: 600,
          cursor: phone ? 'pointer' : 'default',
        }}
      >
        Send 22:00 missed test
      </button>
      {status && (
        <p style={{ marginTop: 8, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{status}</p>
      )}
    </div>
  )
}
