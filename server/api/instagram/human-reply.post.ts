import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const body = await readBody(event)

  const eventId = body?.event_id
  const replyText = (body?.reply_text || '').trim()

  if (!eventId || !replyText) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID do evento e texto da resposta manual são obrigatórios.'
    })
  }

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  // 1. Buscar o evento de destino
  const { data: targetEvent, error: fetchErr } = await supabaseAdmin
    .from('instagram_webhook_events')
    .select('*')
    .eq('id', eventId)
    .single()

  if (fetchErr || !targetEvent) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Evento não encontrado.'
    })
  }

  // 2. Garantir isolamento Multi-tenant: o evento pertence a uma conta do usuário logado?
  const { data: userAccounts } = await supabaseAdmin
    .from('instagram_accounts')
    .select('instagram_account_id, access_token')
    .eq('user_id', user.id)

  const ownedAccountIds = (userAccounts || []).map(a => a.instagram_account_id).filter(Boolean)
  const isOwner = ownedAccountIds.includes(targetEvent.instagram_account_id)

  if (!isOwner) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Acesso negado: Você só pode responder a eventos das suas próprias contas vinculadas.'
    })
  }

  // 3. Verificar se o envio deve ser simulado ou real
  const config = useRuntimeConfig()
  const autoReplyEnabled = config.instagramAutoReplyEnabled ?? (process.env.INSTAGRAM_AUTO_REPLY_ENABLED === 'true')

  // Buscar token ativo da conta do usuário ou fallback .env
  const targetAccountObj = (userAccounts || []).find(a => a.instagram_account_id === targetEvent.instagram_account_id)
  const accessToken = targetAccountObj?.access_token || config.instagramAccessToken || process.env.INSTAGRAM_ACCESS_TOKEN || ''

  let replyStatus = 'simulated'
  let replySent = false
  let responseNotice = 'Resposta simulada para revisão'

  if (autoReplyEnabled && accessToken) {
    // Tentar envio via Graph API oficial da Meta
    const sendSuccess = await sendInstagramMessage(
      targetEvent.sender_id,
      replyText,
      accessToken,
      targetEvent.instagram_account_id
    )

    if (sendSuccess) {
      replyStatus = 'sent'
      replySent = true
      responseNotice = 'Resposta enviada com sucesso via API oficial do Instagram'
    } else {
      replyStatus = 'error'
      replySent = false
      responseNotice = 'Erro ao enviar resposta via API do Instagram'
    }
  } else {
    // Modo de revisão / simulação
    replyStatus = 'simulated'
    replySent = false
    responseNotice = 'Resposta simulada para revisão'
  }

  // 4. Salvar atendimento manual (Human Agent) no banco
  const now = new Date().toISOString()
  const { data: updatedEvent, error: updateErr } = await supabaseAdmin
    .from('instagram_webhook_events')
    .update({
      human_reply_text: replyText,
      human_reply_sent: replySent,
      human_reply_status: replyStatus,
      human_reply_at: now
    })
    .eq('id', eventId)
    .select('*')
    .single()

  if (updateErr) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao salvar resposta manual no banco: ' + updateErr.message
    })
  }

  return {
    success: true,
    status: replyStatus,
    sent: replySent,
    notice: responseNotice,
    event: updatedEvent
  }
})
