import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let client = null
try {
  if (url && anonKey) {
    client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
} catch (error) {
  console.error('Supabase init failed', error)
  client = null
}

export const supabase = client
export const isCloudEnabled = Boolean(client)
