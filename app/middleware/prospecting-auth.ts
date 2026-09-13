import { supabase } from '~/composables/useSupabase'

/**
 * Middleware: protects /prospeccao/* routes.
 * Redirects unauthenticated users to /prospeccao/login.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return navigateTo('/prospeccao/login')
  }
})
