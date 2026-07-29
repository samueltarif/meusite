export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const config = useRuntimeConfig()

  // ─── 1. VERIFICAÇÃO DO WEBHOOK (GET) ───────────────────────────────────
  if (method === 'GET') {
    const query = getQuery(event)

    const mode = (query['hub.mode'] || query.mode) as string
    const verifyToken = (query['hub.verify_token'] || query.verify_token) as string
    const challenge = (query['hub.challenge'] || query.challenge) as string

    const expectedToken = config.instagramWebhookVerifyToken || process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || 'avyro_instagram_webhook_2026'

    console.log('[Instagram Webhook GET Verification]:', { mode, verifyToken, challenge })

    if (mode === 'subscribe' && verifyToken === expectedToken) {
      console.log('[Instagram Webhook] Token verificado com sucesso!')
      setResponseHeader(event, 'content-type', 'text/plain')
      return challenge
    } else {
      console.warn('[Instagram Webhook] Token incorreto ou modo inválido:', verifyToken)
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Invalid verify token'
      })
    }
  }

  // ─── 2. RECEBIMENTO DE EVENTOS (POST) ──────────────────────────────────
  if (method === 'POST') {
    try {
      const rawBody = await readRawBody(event, 'utf-8') || ''
      const signature = getRequestHeader(event, 'x-hub-signature-256')
      const appSecret = config.instagramAppSecret || process.env.INSTAGRAM_APP_SECRET || ''

      // Validação opcional da assinatura da Meta (se INSTAGRAM_APP_SECRET estiver configurado)
      if (appSecret && signature) {
        const isValidSignature = validateMetaSignature(rawBody, signature, appSecret)
        if (!isValidSignature) {
          console.warn('[Instagram Webhook] Assinatura X-Hub-Signature-256 inválida!')
          throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Invalid signature' })
        }
      }

      let body: any = {}
      try {
        body = JSON.parse(rawBody)
      } catch (e) {
        body = await readBody(event) || {}
      }

      console.log('----------------------------------------------------')
      console.log('[Instagram Webhook POST Event Received]:')
      console.log(JSON.stringify(body, null, 2))
      console.log('----------------------------------------------------')

      // Processar o evento de forma assíncrona para garantir resposta rápida HTTP 200 à Meta
      processIncomingInstagramWebhook(body).catch((err) => {
        console.error('[Instagram Webhook Async Process Error]:', err)
      })

      // Retornar 200 OK imediatamente para a Meta não expirar o webhook
      return { received: true }
    } catch (err: any) {
      console.error('[Instagram Webhook POST Error]:', err?.message || err)
      return { received: false, error: err?.message }
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method Not Allowed'
  })
})
