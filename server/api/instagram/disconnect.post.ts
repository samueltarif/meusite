import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // 1. Autenticar usuário server-side
  const user = await getAuthenticatedUser(event)

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  // 2. Marcar conta como desconectada e inativa sem apagar o histórico de eventos/leads
  const { error } = await supabaseAdmin
    .from('instagram_accounts')
    .update({
      is_active: false,
      connection_status: 'disconnected',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao desconectar conta do Instagram: ' + error.message
    })
  }

  console.log(`[Instagram Disconnect]: Conta do usuário ${user.id} foi desconectada com sucesso.`)

  return {
    success: true,
    message: 'Conta do Instagram desconectada com sucesso.'
  }
})
