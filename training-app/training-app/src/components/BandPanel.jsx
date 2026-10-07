import { useEffect, useState } from 'react'
import { emptyDay, formatSleep, getBandDay, localDateKey, parseMetric } from '../lib/band'
import { isNativeHealthAvailable, readTodayFromHealthConnect } from '../lib/healthConnect'

const fieldStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  background: 'var(--surface-2)',
  color: 'var(--text)',
  fontSize: 15,
  fontFamily: 'inherit',
}

export function BandPanel({ band, onChange }) {
  const dateKey = localDateKey()
  const saved = getBandDay(band, dateKey)
  const [draft, setDraft] = useState(saved)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const native = isNativeHealthAvailable()

  useEffect(() => {
    setDraft(getBandDay(band, dateKey))
  }, [band, dateKey])

  const setField = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value === '' ? null : value }))
  }

  const persist = (day, source = 'manual') => {
    const nextDay = {
      steps: parseMetric(day.steps),
      kcal: parseMetric(day.kcal),
      rhr: parseMetric(day.rhr),
      sleepMin: parseMetric(day.sleepMin),
      hrAvg: parseMetric(day.hrAvg),
      hrMax: parseMetric(day.hrMax),
    }
    onChange({
      lastSync: new Date().toISOString(),
      source,
      days: {
        ...(band?.days || {}),
        [dateKey]: nextDay,
      },
    })
    setDraft({ ...emptyDay(), ...nextDay })
  }

  const handleSave = () => {
    persist(draft, band?.source === 'health-connect' ? 'health-connect' : 'manual')
    setMessage('Αποθηκεύτηκε.')
  }

  const handleSync = async () => {
    setBusy(true)
    setMessage('')
    try {
      const result = await readTodayFromHealthConnect()
      if (result.ok) {
        persist({ ...draft, ...result.day }, 'health-connect')
        setMessage('Συγχρονίστηκε από Health Connect.')
        return
      }
      if (result.reason === 'browser') {
        setMessage('Το Health Connect δουλεύει μόνο από την Android εφαρμογή. Μέχρι τότε πέρασε τα νούμερα από το Mi Fitness.')
        return
      }
      setMessage('Ο αυτόματος συγχρονισμός δεν είναι ακόμα συνδεδεμένος. Χρησιμοποίησε τα πεδία παρακάτω.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Xiaomi Band</h2>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{dateKey}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
        <Stat label="Βήματα" value={saved.steps ?? '—'} />
        <Stat label="Ύπνος" value={formatSleep(saved.sleepMin)} />
        <Stat label="Resting HR" value={saved.rhr ? `${saved.rhr} bpm` : '—'} />
        <Stat label="Θερμίδες" value={saved.kcal ? `${saved.kcal} kcal` : '—'} />
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10 }}>
        Band 8 Pro → Mi Fitness → Health Connect. Στο Mi Fitness: Προφίλ → Ρυθμίσεις → Health Connect, και άνοιξε βήματα, καρδιακό ρυθμό, ύπνο, θερμίδες.
      </p>

      <button
        type="button"
        disabled={busy}
        onClick={handleSync}
        style={{
          width: '100%',
          padding: 10,
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-strong)',
          background: 'var(--surface-2)',
          color: 'var(--text)',
          fontSize: 14,
          fontFamily: 'inherit',
          fontWeight: 600,
          cursor: busy ? 'default' : 'pointer',
          marginBottom: 12,
        }}
      >
        {busy ? 'Συγχρονισμός…' : native ? 'Συγχρονισμός Health Connect' : 'Συγχρονισμός Health Connect (Android app)'}
      </button>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 12,
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Σημερινά νούμερα</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Field label="Βήματα" value={draft.steps ?? ''} onChange={(v) => setField('steps', v)} />
          <Field label="Ύπνος (λεπτά)" value={draft.sleepMin ?? ''} onChange={(v) => setField('sleepMin', v)} />
          <Field label="Resting HR" value={draft.rhr ?? ''} onChange={(v) => setField('rhr', v)} />
          <Field label="Θερμίδες" value={draft.kcal ?? ''} onChange={(v) => setField('kcal', v)} />
        </div>
        <button
          type="button"
          onClick={handleSave}
          style={{
            marginTop: 10,
            width: '100%',
            padding: 8,
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-strong)',
            background: 'transparent',
            color: 'var(--text)',
            fontSize: 13,
            fontFamily: 'inherit',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Αποθήκευση ✓
        </button>
      </div>

      {message && (
        <p style={{ marginTop: 10, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.45 }}>{message}</p>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div style={{
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '8px 10px',
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.02em', marginTop: 2 }}>
        {value}
      </div>
    </div>
  )
}

function Field({ label, value, onChange }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      <input
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={fieldStyle}
      />
    </label>
  )
}
