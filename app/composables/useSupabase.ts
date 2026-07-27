import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'

const supabaseUrl = 'https://mwrtluebbiyrmjrqwhut.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnRsdWViYml5cm1qcnF3aHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNzk3MjcsImV4cCI6MjEwMDY1NTcyN30.EV4I4bd00ecgiTutVkhj1CwdO0mHrTv0--sgwVv6Muo'

let wsConstructor: any = undefined

if (import.meta.server) {
  try {
    const wsModule = await import('ws')
    wsConstructor = wsModule.default || wsModule
    if (typeof globalThis.WebSocket === 'undefined') {
      globalThis.WebSocket = wsConstructor
    }
  } catch (e) {
    console.warn('WS import warning:', e)
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: import.meta.client,
    autoRefreshToken: import.meta.client,
    detectSessionInUrl: import.meta.client,
  },
  ...(wsConstructor ? { realtime: { transport: wsConstructor } } : {}),
})

export const useSupabaseUser = () => {
  const user = ref(supabase.auth.getUser())
  return user
}
