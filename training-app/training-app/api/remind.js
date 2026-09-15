import {
  athensDateKey,
  athensHour,
  getDay,
  whatsappMessage,
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

async function sendWhatsApp({ phone, apikey, text }) {
  const cleanPhone = String(phone || '').replace(/[^\d]/g, '')
  const key = String(apikey || '').trim()
  if (!cleanPhone || !key || !text) {
    return { ok: false, error: 'Missing phone, API key, or message.' }
  }
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(cleanPhone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(key)}`
  const response = await fetch(url)
  const body = await response.text()
  return { ok: response.ok, status: response.status, body }
}

async function reminderTargets() {
  const targets = []
  if (process.env.WHATSAPP_PHONE && process.env.CALLMEBOT_APIKEY) {
    targets.push({
      phone: process.env.WHATSAPP_PHONE,
      apikey: process.env.CALLMEBOT_APIKEY,
    })
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (supabaseUrl && serviceKey) {
    const { createClient } = await import('@supabase/supabase-js')
    const client = createClient(supabaseUrl, serviceKey)
    const { data } = await client.from('user_state').select('data')
    for (const row of data || []) {
      const reminder = row.data?.tp_reminders
      if (reminder?.enabled && reminder.phone && reminder.apiKey) {
        targets.push({ phone: reminder.phone, apikey: reminder.apiKey })
      }
    }
  }

  const seen = new Set()
  return targets.filter((target) => {
    const key = `${target.phone}:${target.apikey}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
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

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    json(res, 204, {})
    return
  }

  const url = new URL(req.url, 'http://localhost')
  const body = req.method === 'POST' ? await readBody(req) : {}
  const testPhone = body.phone || url.searchParams.get('phone')
  const testKey = body.apikey || url.searchParams.get('apikey')
  const testText = body.text || url.searchParams.get('text')
  const force = url.searchParams.get('force') === '1' || body.force === true

  if (testPhone && testKey) {
    const result = await sendWhatsApp({
      phone: testPhone,
      apikey: testKey,
      text: testText || whatsappMessage(getDay(athensDateKey())),
    })
    json(res, result.ok ? 200 : 502, result)
    return
  }

  if (!isAuthorized(req)) {
    json(res, 401, { ok: false, error: 'Unauthorized' })
    return
  }

  const now = new Date()
  const dateKey = athensDateKey(now)
  const hour = athensHour(now)
  if (!force && hour !== 6) {
    json(res, 200, { ok: true, skipped: 'not-06:00', dateKey, hour })
    return
  }

  const day = getDay(dateKey)
  if (!day || day.kind !== 'train') {
    json(res, 200, { ok: true, skipped: 'rest-or-outside-plan', dateKey })
    return
  }

  const targets = await reminderTargets()
  if (!targets.length) {
    json(res, 200, { ok: false, error: 'Set WHATSAPP_PHONE and CALLMEBOT_APIKEY, or save reminders in the app with a service role key.' })
    return
  }

  const text = whatsappMessage(day)
  const results = []
  for (const target of targets) {
    results.push(await sendWhatsApp({ ...target, text }))
  }
  json(res, results.every((item) => item.ok) ? 200 : 502, { dateKey, trainingNumber: day.trainingNumber, results })
}
