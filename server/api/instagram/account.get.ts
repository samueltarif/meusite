import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // 1. Obter user_id estritamente pela sessão autenticada do Supabase (nunca aceitar do frontend)
  const user = await getAuthenticatedUser(event)

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  // 2. Buscar APENAS o registro pertencente ao user_id autenticado
  const { data: account, error } = await supabaseAdmin
    .from('instagram_accounts')
    .select(`
      id,
      user_id,
      instagram_account_id,
      instagram_username,
      connection_status,
      is_active,
      token_expires_at,
      created_at,
      updated_at,
      last_error
    `)
    .eq('user_id', user.id)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao buscar status da conta do Instagram: ' + error.message
    })
  }

  // NUNCA retornar dados da conta global/admin como fallback para outros usuários!
  // Se o usuário não possuir conta cadastrada em instagram_accounts, retorna account: null
  return {
    success: true,
    account: account || null
  }
})
