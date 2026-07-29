import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export interface ParsedWebhookEvent {
  eventType: 'message' | 'comment' | 'unknown'
  instagramAccountId: string
  senderId: string
  recipientId: string
  messageId?: string
  messageText?: string
  commentId?: string
  mediaId?: string
  timestamp?: number
  rawItem?: any
}

/**
 * Validates Meta Webhook X-Hub-Signature-256 if INSTAGRAM_APP_SECRET is set
 */
export function validateMetaSignature(rawBody: string, signatureHeader?: string, appSecret?: string): boolean {
  if (!appSecret || !signatureHeader) return true // Se não houver secret configurado, não bloqueia a execução

  try {
    const expectedSignature = 'sha256=' + crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expectedSignature))
  } catch (err) {
    console.warn('[Instagram Webhook] Erro ao validar assinatura X-Hub-Signature-256:', err)
    return false
  }
}

/**
 * Extracts structured events (messages or comments) from Meta Webhook payload
 */
export function parseInstagramWebhookPayload(body: any): ParsedWebhookEvent[] {
  const events: ParsedWebhookEvent[] = []
  if (!body || !Array.isArray(body.entry)) return events

  for (const entry of body.entry) {
    const instagramAccountId = entry.id || ''

    // 1. Direct Messaging Events
    if (Array.isArray(entry.messaging)) {
      for (const item of entry.messaging) {
        const senderId = item.sender?.id || ''
        const recipientId = item.recipient?.id || ''
        const messageId = item.message?.mid || item.message?.id
        const messageText = item.message?.text
        const timestamp = item.timestamp

        // Evitar registrar e-mails ou mensagens vazias sem texto/ID
        if (senderId && (messageText || messageId)) {
          events.push({
            eventType: 'message',
            instagramAccountId,
            senderId,
            recipientId,
            messageId,
            messageText: messageText || '[Mídia/Sticker]',
            timestamp,
            rawItem: item
          })
        }
      }
    }

    // 2. Changes Events (Feed Comments & Mentions)
    if (Array.isArray(entry.changes)) {
      for (const change of entry.changes) {
        const value = change.value || {}
        if (change.field === 'comments' || change.field === 'live_comments') {
          const senderId = value.from?.id || ''
          const commentId = value.id
          const mediaId = value.media?.id
          const messageText = value.text

          if (senderId && commentId) {
            events.push({
              eventType: 'comment',
              instagramAccountId,
              senderId,
              recipientId: instagramAccountId,
              commentId,
              mediaId,
              messageText: messageText || '',
              rawItem: change
            })
          }
        } else if (change.field === 'messages') {
          const senderId = value.sender?.id || value.from?.id || ''
          const recipientId = value.recipient?.id || instagramAccountId
          const messageId = value.message?.mid || value.id
          const messageText = value.message?.text || value.text

          if (senderId) {
            events.push({
              eventType: 'message',
              instagramAccountId,
              senderId,
              recipientId,
              messageId,
              messageText: messageText || '',
              rawItem: change
            })
          }
        }
      }
    }
  }

  return events
}

/**
 * Main Webhook Event Processor:
 * - Saves event to Supabase `instagram_webhook_events` (with deduplication)
 * - Checks active auto reply rules in `instagram_auto_replies`
 * - Sends auto reply if enabled via INSTAGRAM_AUTO_REPLY_ENABLED=true
 */
export async function processIncomingInstagramWebhook(body: any) {
  const events = parseInstagramWebhookPayload(body)
  if (events.length === 0) {
    console.log('[Instagram Webhook] Nenhum evento de mensagem/comentário encontrado no payload.')
    return
  }

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  if (!supabaseServiceKey) {
    console.error('[Instagram Webhook Error] SUPABASE_SERVICE_ROLE_KEY ausente.')
    return
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
  const config = useRuntimeConfig()
  const autoReplyEnabled = config.instagramAutoReplyEnabled ?? (process.env.INSTAGRAM_AUTO_REPLY_ENABLED === 'true')

  for (const ev of events) {
    console.log('----------------------------------------------------')
    console.log(`[Instagram Event Received - ${ev.eventType.toUpperCase()}]:`)
    console.log(`- Conta IG: ${ev.instagramAccountId}`)
    console.log(`- De (Sender ID): ${ev.senderId}`)
    console.log(`- Texto: "${ev.messageText}"`)
    console.log('----------------------------------------------------')

    // ─── 1. DEDUPLICAÇÃO DE EVENTOS ──────────────────────────────────
    if (ev.messageId) {
      const { data: existingMsg } = await supabaseAdmin
        .from('instagram_webhook_events')
        .select('id')
        .eq('message_id', ev.messageId)
        .maybeSingle()

      if (existingMsg) {
        console.log(`[Instagram Webhook] Evento duplicado ignorado (message_id: ${ev.messageId})`)
        continue
      }
    }

    if (ev.commentId) {
      const { data: existingComment } = await supabaseAdmin
        .from('instagram_webhook_events')
        .select('id')
        .eq('comment_id', ev.commentId)
        .maybeSingle()

      if (existingComment) {
        console.log(`[Instagram Webhook] Evento duplicado ignorado (comment_id: ${ev.commentId})`)
        continue
      }
    }

    // ─── 2. PROTEÇÃO ANTI-LOOP ───────────────────────────────────────
    // Evitar responder mensagens enviadas pela própria conta do Instagram
    const ownBusinessAccountId = config.instagramBusinessAccountId || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || ''
    if (ev.senderId && (ev.senderId === ev.instagramAccountId || ev.senderId === ownBusinessAccountId)) {
      console.log('[Instagram Webhook] Anti-loop ativado: Mensagem enviada pela própria conta do Instagram.')
      // Salva o evento como processado sem enviar resposta
      await supabaseAdmin.from('instagram_webhook_events').insert({
        instagram_account_id: ev.instagramAccountId,
        sender_id: ev.senderId,
        recipient_id: ev.recipientId,
        event_type: ev.eventType,
        message_id: ev.messageId || null,
        message_text: ev.messageText || null,
        comment_id: ev.commentId || null,
        media_id: ev.mediaId || null,
        raw_payload: body,
        processed: true,
        auto_reply_sent: false,
        error_message: 'Anti-loop: mensagem enviada pela própria conta.'
      })
      continue
    }

    // ─── 3. BUSCAR REGRA CORRESPONDENTE (MATCHING) ───────────────
    let matchedRule: any = null
    const textToMatch = (ev.messageText || '').trim().toLowerCase()

    if (textToMatch) {
      // Buscar regras ativas no Supabase para o tipo de evento (message ou comment)
      const { data: rules } = await supabaseAdmin
        .from('instagram_auto_replies')
        .select('*')
        .eq('is_active', true)
        .eq('trigger_type', ev.eventType)

      if (rules && rules.length > 0) {
        for (const rule of rules) {
          const kw = (rule.keyword || '').trim().toLowerCase()
          if (!kw) continue

          if (rule.match_type === 'exact' && textToMatch === kw) {
            matchedRule = rule
            break
          } else if (rule.match_type === 'contains' && textToMatch.includes(kw)) {
            matchedRule = rule
            break
          }
        }
      }
    }

    // ─── 4. SALVAR EVENTO EM instagram_webhook_events ────────────────
    const insertPayload: Record<string, any> = {
      instagram_account_id: ev.instagramAccountId,
      sender_id: ev.senderId,
      recipient_id: ev.recipientId,
      event_type: ev.eventType,
      message_id: ev.messageId || null,
      message_text: ev.messageText || null,
      comment_id: ev.commentId || null,
      media_id: ev.mediaId || null,
      raw_payload: body,
      processed: false,
      auto_reply_sent: false,
      matched_rule_id: matchedRule ? matchedRule.id : null
    }

    const { data: savedEvent, error: saveErr } = await supabaseAdmin
      .from('instagram_webhook_events')
      .insert(insertPayload)
      .select('id')
      .single()

    if (saveErr) {
      console.error('[Instagram Webhook DB Error]: Erro ao salvar evento no Supabase:', saveErr)
      continue
    }

    const eventRecordId = savedEvent?.id

    // ─── 5. EXECUTAR RESPOSTA AUTOMÁTICA (SE CONFIGURADO) ────────────
    if (!matchedRule) {
      console.log(`[Instagram Auto-Reply] Nenhuma regra encontrada para o texto: "${ev.messageText}"`)
      if (eventRecordId) {
        await supabaseAdmin.from('instagram_webhook_events').update({ processed: true }).eq('id', eventRecordId)
      }
      continue
    }

    console.log(`[Instagram Auto-Reply Match!] Regra acionada: "${matchedRule.keyword}" -> Resposta: "${matchedRule.response_message}"`)

    if (!autoReplyEnabled) {
      console.log('[Instagram Auto-Reply Modos de Segurança]: INSTAGRAM_AUTO_REPLY_ENABLED=false. Resposta registrada no banco sem envio real.')
      if (eventRecordId) {
        await supabaseAdmin.from('instagram_webhook_events').update({
          processed: true,
          auto_reply_sent: false,
          error_message: 'Modo seguro ativo (INSTAGRAM_AUTO_REPLY_ENABLED=false)'
        }).eq('id', eventRecordId)
      }
      continue
    }

    // Tentar buscar token específico da conta em `instagram_accounts` se existir
    let activeAccessToken = ''
    let activeBusinessId = ''

    if (ev.instagramAccountId) {
      const { data: accountData } = await supabaseAdmin
        .from('instagram_accounts')
        .select('access_token, instagram_account_id')
        .eq('instagram_account_id', ev.instagramAccountId)
        .eq('is_active', true)
        .maybeSingle()

      if (accountData?.access_token) {
        activeAccessToken = accountData.access_token
        activeBusinessId = accountData.instagram_account_id
      }
    }

    // Se não houver conta vinculada em `instagram_accounts`, usa o token global do .env
    if (!activeAccessToken) {
      activeAccessToken = config.instagramAccessToken || process.env.INSTAGRAM_ACCESS_TOKEN || ''
      activeBusinessId = config.instagramBusinessAccountId || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || ev.instagramAccountId
    }

    // Enviar mensagem via Graph API
    const sendSuccess = await sendInstagramMessage(
      ev.senderId,
      matchedRule.response_message,
      activeAccessToken,
      activeBusinessId
    )

    if (eventRecordId) {
      await supabaseAdmin.from('instagram_webhook_events').update({
        processed: true,
        auto_reply_sent: sendSuccess,
        error_message: sendSuccess ? null : 'Falha no envio via Instagram Graph API'
      }).eq('id', eventRecordId)
    }
  }
}

/**
 * Sends a Direct Message to an Instagram user via Meta Graph API
 * Never logs raw tokens!
 */
export async function sendInstagramMessage(
  recipientId: string,
  messageText: string,
  customAccessToken?: string,
  customBusinessAccountId?: string
): Promise<boolean> {
  const config = useRuntimeConfig()
  const accessToken = customAccessToken || config.instagramAccessToken || process.env.INSTAGRAM_ACCESS_TOKEN || ''
  const businessAccountId = customBusinessAccountId || config.instagramBusinessAccountId || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || 'me'

  if (!accessToken) {
    console.error('[Instagram API Error] INSTAGRAM_ACCESS_TOKEN ausente.')
    return false
  }

  // Sanitização de token para logs seguros
  const maskedToken = accessToken.length > 10
    ? `${accessToken.substring(0, 6)}...${accessToken.substring(accessToken.length - 4)}`
    : '***'

  console.log(`[Instagram API Send]: Enviando para ${recipientId} via conta ${businessAccountId} usando token [${maskedToken}]`)

  const url = `https://graph.facebook.com/v19.0/${businessAccountId}/messages`

  try {
    const response = await $fetch<{ message_id?: string; recipient_id?: string }>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: {
        recipient: { id: recipientId },
        message: { text: messageText }
      }
    })

    console.log('[Instagram API Send Success] ID da mensagem:', response.message_id)
    return true
  } catch (err: any) {
    const errorDetails = err?.data || err?.message || err
    console.error('[Instagram API Send Error]:', errorDetails)
    return false
  }
}
