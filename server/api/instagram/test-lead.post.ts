import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  // 1. Garantir que o usuário possui uma conta do Instagram (criando uma conta demo multi-tenant se não tiver)
  let { data: accounts } = await supabaseAdmin
    .from('instagram_accounts')
    .select('id, instagram_account_id')
    .eq('user_id', user.id)

  let targetAccountId = ''

  if (accounts && accounts.length > 0 && accounts[0].instagram_account_id) {
    targetAccountId = accounts[0].instagram_account_id
  } else {
    // Auto-criar conta de demonstração multi-tenant para este user_id
    targetAccountId = `demo_ig_${user.id.substring(0, 8)}`
    const { error: accErr } = await supabaseAdmin
      .from('instagram_accounts')
      .insert({
        user_id: user.id,
        instagram_account_id: targetAccountId,
        instagram_username: 'demo_review_account',
        is_active: true
      })

    if (accErr) {
      console.warn('[Test Lead] Aviso ao auto-criar conta demo:', accErr.message)
    }
  }

  // 2. Verificar se existe regra de auto-resposta cadastrada pelo usuário que corresponda a "preço"
  let matchedRuleId: string | null = null

  const { data: rules } = await supabaseAdmin
    .from('instagram_auto_replies')
    .select('id, keyword, match_type')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .eq('trigger_type', 'message')

  if (rules && rules.length > 0) {
    const testKeyword = 'preço'
    for (const rule of rules) {
      const kw = (rule.keyword || '').trim().toLowerCase()
      if (rule.match_type === 'exact' && testKeyword === kw) {
        matchedRuleId = rule.id
        break
      } else if (rule.match_type === 'contains' && testKeyword.includes(kw)) {
        matchedRuleId = rule.id
        break
      }
    }
  }

  // 3. Montar raw_payload no padrão oficial do Webhook Meta
  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || targetAccountId
  const timestamp = Date.now()
  const messageId = `test_mid_${timestamp}`
  const senderId = 'cliente_teste_instagram'

  const rawPayload = {
    object: 'instagram',
    entry: [
      {
        id: targetAccountId,
        time: timestamp,
        messaging: [
          {
            sender: { id: senderId },
            recipient: { id: businessAccountId },
            timestamp,
            message: {
              mid: messageId,
              text: 'preço'
            }
          }
        ]
      }
    ]
  }

  // 4. Inserir o lead de teste na tabela instagram_webhook_events
  const { data: newEvent, error: insertErr } = await supabaseAdmin
    .from('instagram_webhook_events')
    .insert({
      instagram_account_id: targetAccountId,
      sender_id: senderId,
      recipient_id: businessAccountId,
      event_type: 'message',
      message_id: messageId,
      message_text: 'preço',
      raw_payload: rawPayload,
      processed: true,
      auto_reply_sent: false,
      matched_rule_id: matchedRuleId,
      created_at: new Date().toISOString()
    })
    .select('*')
    .single()

  if (insertErr) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao gerar lead de teste: ' + insertErr.message
    })
  }

  return {
    success: true,
    event: newEvent
  }
})
