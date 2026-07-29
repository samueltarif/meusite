/**
 * Instagram Messaging Helper Service
 * For parsing webhook events and sending replies via Meta Graph API.
 */

export interface ParsedInstagramMessage {
  senderId: string
  recipientId: string
  text: string
  mid?: string
  timestamp?: number
}

/**
 * Extracts incoming direct messages from the Meta Webhook payload
 */
export function parseInstagramWebhookEvent(body: any): ParsedInstagramMessage[] {
  const messages: ParsedInstagramMessage[] = []

  if (!body || !Array.isArray(body.entry)) {
    return messages
  }

  for (const entry of body.entry) {
    // 1. Messaging events (Direct Messages)
    if (Array.isArray(entry.messaging)) {
      for (const messagingItem of entry.messaging) {
        const senderId = messagingItem.sender?.id
        const recipientId = messagingItem.recipient?.id
        const messageText = messagingItem.message?.text
        const mid = messagingItem.message?.mid
        const timestamp = messagingItem.timestamp

        if (senderId && messageText) {
          messages.push({
            senderId,
            recipientId,
            text: messageText,
            mid,
            timestamp
          })
        }
      }
    }

    // 2. Changes events (e.g. comments or feed mentions)
    if (Array.isArray(entry.changes)) {
      for (const change of entry.changes) {
        if (change.field === 'messages' && change.value) {
          const senderId = change.value.sender?.id
          const recipientId = change.value.recipient?.id
          const messageText = change.value.message?.text || change.value.text

          if (senderId && messageText) {
            messages.push({
              senderId,
              recipientId,
              text: messageText
            })
          }
        }
      }
    }
  }

  return messages
}

/**
 * Processes received messages and prepares auto reply
 */
export async function processIncomingInstagramMessages(body: any) {
  const parsedMessages = parseInstagramWebhookEvent(body)

  if (parsedMessages.length === 0) {
    console.log('[Instagram Webhook] Nenhum texto de mensagem direta encontrado no evento.')
    return
  }

  for (const msg of parsedMessages) {
    console.log('----------------------------------------------------')
    console.log('[Instagram Auto-Reply Event Detected]:')
    console.log(`- De (Sender ID): ${msg.senderId}`)
    console.log(`- Para (Recipient ID): ${msg.recipientId}`)
    console.log(`- Conteúdo da Mensagem: "${msg.text}"`)
    console.log('----------------------------------------------------')

    // ─── MODO RESPOSTA AUTOMÁTICA (PREPARADO / SEGURO) ───
    // Para ativar a resposta automática real, altere a flag abaixo para `true`
    const AUTO_REPLY_ENABLED = false

    if (AUTO_REPLY_ENABLED) {
      const replyText = `Olá! Recebemos sua mensagem: "${msg.text}". Em breve entraremos em contato!`
      await sendInstagramMessage(msg.senderId, replyText)
    } else {
      console.log('[Instagram Auto-Reply Info]: Auto-resposta em modo simulação (seguro). Token protegido.')
    }
  }
}

/**
 * Sends a direct message to a user via Meta Graph API
 * Token IS NOT logged in raw format for security.
 */
export async function sendInstagramMessage(recipientId: string, messageText: string): Promise<boolean> {
  const config = useRuntimeConfig()
  const accessToken = config.instagramAccessToken || process.env.INSTAGRAM_ACCESS_TOKEN || ''
  const businessAccountId = config.instagramBusinessAccountId || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || 'me'

  if (!accessToken) {
    console.error('[Instagram API Error]: INSTAGRAM_ACCESS_TOKEN não está configurado no ambiente.')
    return false
  }

  // Token masking for safe logging
  const maskedToken = accessToken.length > 10
    ? `${accessToken.substring(0, 6)}...${accessToken.substring(accessToken.length - 4)}`
    : '***'

  console.log(`[Instagram API Send]: Enviando mensagem para ${recipientId} usando token [${maskedToken}]`)

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

    console.log('[Instagram API Send Success]: Mensagem enviada com sucesso ID:', response.message_id)
    return true
  } catch (err: any) {
    console.error('[Instagram API Send Error]:', err?.data || err?.message || err)
    return false
  }
}
