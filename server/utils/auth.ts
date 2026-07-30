import { createClient } from '@supabase/supabase-js'

/**
 * Extracts and verifies the Supabase Auth user from:
 * 1. Authorization header: Bearer <token>
 * 2. Query parameters: ?token=... or ?access_token=...
 * 3. Supabase Auth Cookies (sb-access-token, sb-*-auth-token)
 * 
 * Ensures user_id is ALWAYS verified server-side via Supabase auth.getUser(token)
 */
export async function getAuthenticatedUser(event: any) {
  let token = ''

  // 1. Tentar obter pelo Header Authorization: Bearer <token>
  const authHeader = getRequestHeader(event, 'authorization') || ''
  if (authHeader) {
    token = authHeader.replace(/^Bearer\s+/i, '').trim()
  }

  // 2. Tentar obter pelos Query Parameters: ?token= ou ?access_token= (útil para navegação via window.location.href)
  if (!token) {
    const query = getQuery(event)
    token = (query.token || query.access_token) as string || ''
  }

  // 3. Tentar obter pelos Cookies de Sessão do Supabase
  if (!token) {
    const cookies = parseCookies(event)
    token = cookies['sb-access-token'] || cookies['sb-auth-token'] || ''

    if (!token) {
      for (const [key, val] of Object.entries(cookies)) {
        if (key.includes('auth-token') && val) {
          try {
            const parsed = JSON.parse(val)
            token = parsed.access_token || (Array.isArray(parsed) ? parsed[0] : val)
            if (token) break
          } catch {
            token = val
            break
          }
        }
      }
    }
  }

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
