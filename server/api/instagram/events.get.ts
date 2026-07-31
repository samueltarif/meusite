import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  // 1. Buscar apenas contas do Instagram vinculadas a este user_id
  const { data: accounts } = await supabaseAdmin
    .from('instagram_accounts')
    .select('instagram_account_id')
    .eq('user_id', user.id)

  const accountIds = (accounts || []).map(a => a.instagram_account_id).filter(Boolean)

  if (accountIds.length === 0) {
    return { success: true, events: [] }
  }

  // 2. Buscar eventos no log referentes APENAS às contas de Instagram do usuário logado
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
      human_reply_text,
      human_reply_sent,
      human_reply_status,
      human_reply_at,
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

  // 3. Buscar informações das regras acionadas (matched_rule_id)
  const matchedRuleIds = (eventsList || [])
    .map(ev => ev.matched_rule_id)
    .filter((id): id is string => Boolean(id))

  let rulesMap: Record<string, any> = {}

  if (matchedRuleIds.length > 0) {
    const { data: rules } = await supabaseAdmin
      .from('instagram_auto_replies')
      .select('id, keyword, response_message, trigger_type, match_type')
      .in('id', matchedRuleIds)

    if (rules) {
      for (const r of rules) {
        rulesMap[r.id] = r
      }
    }
  }

  const enrichedEvents = (eventsList || []).map(ev => ({
    ...ev,
    matched_rule: ev.matched_rule_id ? rulesMap[ev.matched_rule_id] || null : null
  }))

  return { success: true, events: enrichedEvents }
})
