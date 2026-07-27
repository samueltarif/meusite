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

// Safe storage detection to avoid SecurityError crashes in Safari Private Browsing / iOS in-app WebViews
const isStorageAvailable = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false
    const testKey = '__storage_test__'
    window.localStorage.setItem(testKey, testKey)
    window.localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

const memoryStorage: Record<string, string> = {}
const safeStorage = {
  getItem: (key: string): string | null => {
    if (isStorageAvailable()) return window.localStorage.getItem(key)
    return memoryStorage[key] || null
  },
  setItem: (key: string, value: string): void => {
    if (isStorageAvailable()) {
      try {
        window.localStorage.setItem(key, value)
        return
      } catch (e) {}
    }
    memoryStorage[key] = value
  },
  removeItem: (key: string): void => {
    if (isStorageAvailable()) {
      try {
        window.localStorage.removeItem(key)
        return
      } catch (e) {}
    }
    delete memoryStorage[key]
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: import.meta.client,
    autoRefreshToken: import.meta.client,
    detectSessionInUrl: import.meta.client,
    storage: import.meta.client ? safeStorage : undefined,
  },
  ...(wsConstructor ? { realtime: { transport: wsConstructor } } : {}),
})

export const useSupabaseUser = () => {
  const user = ref(supabase.auth.getUser())
  return user
}
