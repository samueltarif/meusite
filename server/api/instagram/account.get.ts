import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  // Seleção estrita de campos públicos/seguros (NUNCA envia access_token para o frontend!)
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

  const defaultAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '17841401920784631'

  return {
    success: true,
    account: account || {
      instagram_account_id: defaultAccountId,
      instagram_username: 'samueltarif_',
      connection_status: 'pending',
      is_active: false,
      created_at: null,
      token_expires_at: null
    }
  }
})
