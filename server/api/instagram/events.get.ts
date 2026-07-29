import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  // 1. Buscar contas do Instagram vinculadas a este usuário
  const { data: accounts } = await supabaseAdmin
    .from('instagram_accounts')
    .select('instagram_account_id')
    .eq('user_id', user.id)

  const accountIds = (accounts || []).map(a => a.instagram_account_id)
  const defaultBusinessId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '17841401920784631'
  if (!accountIds.includes(defaultBusinessId)) {
    accountIds.push(defaultBusinessId)
  }

  // 2. Buscar eventos no log referentes às contas de Instagram do usuário
  const { data: eventsList, error } = await supabaseAdmin
    .from('instagram_webhook_events')
    .select(`
      id,
      instagram_account_id,
      sender_id,
      recipient_id,
      event_type,
      message_text,
      comment_id,
      media_id,
      processed,
      auto_reply_sent,
      matched_rule_id,
      error_message,
      created_at
    `)
    .in('instagram_account_id', accountIds)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao buscar eventos do Instagram: ' + error.message
    })
  }

  return { success: true, events: eventsList || [] }
})
