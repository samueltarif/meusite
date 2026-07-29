import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const body = await readBody(event)

  const { id, keyword, response_message, trigger_type, match_type, is_active } = body || {}

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID da regra é obrigatório.'
    })
  }

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  const updateFields: Record<string, any> = {
    updated_at: new Date().toISOString()
  }

  if (keyword !== undefined) updateFields.keyword = String(keyword).trim()
  if (response_message !== undefined) updateFields.response_message = String(response_message).trim()
  if (trigger_type !== undefined) updateFields.trigger_type = trigger_type
  if (match_type !== undefined) updateFields.match_type = match_type
  if (is_active !== undefined) updateFields.is_active = Boolean(is_active)

  // Atualizar apenas se a regra pertencer ao usuário autenticado (segurança server-side)
  const { data: updatedRule, error } = await supabaseAdmin
    .from('instagram_auto_replies')
    .update(updateFields)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao atualizar regra: ' + error.message
    })
  }

  return { success: true, rule: updatedRule }
})
