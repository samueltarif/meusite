import { createClient } from '@supabase/supabase-js'

/**
 * Extracts and verifies the Supabase Auth user from the Authorization header
 * Ensures user_id is ALWAYS verified server-side and never trusted from frontend payload.
 */
export async function getAuthenticatedUser(event: any) {
  const authHeader = getRequestHeader(event, 'authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '').trim()

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  if (!token || !supabaseServiceKey) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Não autorizado: Token de autenticação ausente.'
    })
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Sessão de usuário inválida ou expirada.'
    })
  }

  return user
}
