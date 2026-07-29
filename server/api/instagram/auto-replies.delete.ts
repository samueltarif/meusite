import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const body = await readBody(event)
  const query = getQuery(event)

  const id = body?.id || query?.id

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID da regra é obrigatório.'
    })
  }

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  // Excluir apenas se pertencer ao user.id
  const { error } = await supabaseAdmin
    .from('instagram_auto_replies')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao excluir regra: ' + error.message
    })
  }

  return { success: true, message: 'Regra excluída com sucesso.' }
})
