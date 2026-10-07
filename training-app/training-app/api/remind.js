import {
  athensDateKey,
  athensHour,
  getDay,
  isDayDone,
  whatsappMessage,
  whatsappMissedMessage,
} from '../src/data/schedule.js'

function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-cron-secret')
  res.end(JSON.stringify(body))
}

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      if (!raw) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(raw))
      } catch {
        resolve(Object.fromEntries(new URLSearchParams(raw)))
      }
    })
  })
}

function digits(phone) {
  return String(phone || '').replace(/[^\d]/g, '')
}

function whatsappAddress(phone) {
  const clean = digits(phone)
  return clean ? `whatsapp:+${clean}` : ''
}

async function sendWhatsApp({ phone, text }) {
  const sid = process.env.TWILIO_SID || process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_TOKEN || process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_FROM || 'whatsapp:+14155238886'
  const to = whatsappAddress(phone)
  if (!sid || !token) {
    return { ok: false, error: 'Set TWILIO_SID and TWILIO_TOKEN in .env, then restart the app.' }
  }
  if (!to || !text) {
    return { ok: false, error: 'Missing phone or message.' }
  }

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: from,
        Body: text,
      }),
    },
  )
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: payload.message || payload.error_message || 'Twilio rejected the message.',
    }
  }
  return { ok: true, status: response.status, sid: payload.sid }
}

async function reminderTargets() {
  const byPhone = new Map()

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (supabaseUrl && serviceKey) {
    const { createClient } = await import('@supabase/supabase-js')
    const client = createClient(supabaseUrl, serviceKey)
    const { data } = await client.from('user_state').select('data')
    for (const row of data || []) {
      const reminder = row.data?.tp_reminders
      if (reminder?.enabled && reminder.phone) {
        const key = digits(reminder.phone)
        if (!key) continue
        byPhone.set(key, {
          phone: reminder.phone,
          tDone: row.data?.tp_td || {},
          bDone: row.data?.tp_bd || {},
          hasState: true,
        })
      }
    }
  }

  if (process.env.WHATSAPP_PHONE) {
    const key = digits(process.env.WHATSAPP_PHONE)
    if (key && !byPhone.has(key)) {
      byPhone.set(key, {
        phone: process.env.WHATSAPP_PHONE,
        tDone: {},
        bDone: {},
        hasState: false,
      })
    }
  }

  return [...byPhone.values()]
}

function isAuthorized(req) {
  const secret = process.env.CRON_SECRET
  const headerSecret = req.headers['x-cron-secret'] || ''
  const auth = req.headers.authorization || ''
  const vercelCron = req.headers['x-vercel-cron'] === '1'
  if (vercelCron) return true
  if (secret && (auth === `Bearer ${secret}` || headerSecret === secret)) return true
  return false
}

function reminderKind(hour, requested) {
  if (requested === 'missed' || requested === 'morning') return requested
  if (hour === 22) return 'missed'
  if (hour === 6) return 'morning'
  return null
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    json(res, 204, {})
    return
  }

  const url = new URL(req.url, 'http://localhost')
  const body = req.method === 'POST' ? await readBody(req) : {}
  const testPhone = body.phone || url.searchParams.get('phone')
  const testText = body.text || url.searchParams.get('text')
  const requestedKind = body.kind || url.searchParams.get('kind')
  const force = url.searchParams.get('force') === '1' || body.force === true

  const now = new Date()
  const dateKey = athensDateKey(now)
  const hour = athensHour(now)
  const day = getDay(dateKey)

  if (testPhone) {
    const kind = requestedKind === 'missed' ? 'missed' : 'morning'
    const text = testText
      || (kind === 'missed' ? whatsappMissedMessage(day) : whatsappMessage(day))
    const result = await sendWhatsApp({ phone: testPhone, text })
    json(res, result.ok ? 200 : 502, { ...result, kind })
    return
  }

  if (!isAuthorized(req)) {
    json(res, 401, { ok: false, error: 'Unauthorized' })
    return
  }

  const kind = reminderKind(hour, force ? requestedKind : null)
  if (!kind) {
    json(res, 200, { ok: true, skipped: 'not-06:00-or-22:00', dateKey, hour })
    return
  }

  if (!day || day.kind !== 'train') {
    json(res, 200, { ok: true, skipped: 'rest-or-outside-plan', dateKey, kind })
    return
  }

  const targets = await reminderTargets()
  if (!targets.length) {
    json(res, 200, { ok: false, error: 'Set WHATSAPP_PHONE or save a phone in Reminders.' })
    return
  }

  const text = kind === 'missed' ? whatsappMissedMessage(day) : whatsappMessage(day)
  const results = []
  for (const target of targets) {
    if (kind === 'missed' && target.hasState && isDayDone(day, target)) {
      results.push({ ok: true, skipped: 'already-done' })
      continue
    }
    results.push(await sendWhatsApp({ phone: target.phone, text }))
  }
  json(res, results.every((item) => item.ok) ? 200 : 502, {
    dateKey,
    hour,
    kind,
    trainingNumber: day.trainingNumber,
    results,
  })
}
