import { supabase } from '~/composables/useSupabase'

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const router = useRouter()

    // 1. Check if the current URL hash or query contains type=recovery
    const hash = window.location.hash || ''
    const search = window.location.search || ''

    if (hash.includes('type=recovery') || search.includes('type=recovery')) {
      if (window.location.pathname !== '/auth/reset-password') {
        router.push('/auth/reset-password' + hash)
      }
    }

    // 2. Listen to Supabase Auth state change for PASSWORD_RECOVERY event
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        if (window.location.pathname !== '/auth/reset-password') {
          router.push('/auth/reset-password')
        }
      }
    })
  }
})
