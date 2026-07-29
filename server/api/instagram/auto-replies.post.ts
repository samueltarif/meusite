import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // 1. Validar usuário autenticado no backend (nunca confia no user_id vindo do frontend)
  const user = await getAuthenticatedUser(event)
  const body = await readBody(event)

  const { keyword, response_message, trigger_type, match_type, is_active, instagram_account_id } = body || {}

  if (!keyword || !response_message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Palavra-chave e mensagem de resposta são obrigatórias.'
    })
  }

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  const insertData = {
    user_id: user.id, // Forçado pelo backend
    keyword: String(keyword).trim(),
    response_message: String(response_message).trim(),
    trigger_type: ['message', 'comment'].includes(trigger_type) ? trigger_type : 'message',
    match_type: ['exact', 'contains'].includes(match_type) ? match_type : 'contains',
    is_active: typeof is_active === 'boolean' ? is_active : true,
    instagram_account_id: instagram_account_id || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  const { data: rule, error } = await supabaseAdmin
    .from('instagram_auto_replies')
    .insert(insertData)
    .select('*')
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao criar regra: ' + error.message
    })
  }

  return { success: true, rule }
})
