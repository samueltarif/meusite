export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // ─── 1. VERIFICAÇÃO DO WEBHOOK META (GET) ──────────────────────────────
  // O GET de verificação deve ser 100% leve, isolado e sem dependência de banco ou Supabase
  if (method === 'GET') {
    const query = getQuery(event)

    const mode = (query['hub.mode'] || query.mode) as string
    const verifyToken = (query['hub.verify_token'] || query.verify_token) as string
    const challenge = (query['hub.challenge'] || query.challenge) as string

    // Ler token configurado no ambiente de forma segura
    const config = useRuntimeConfig()
    const expectedToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || config.instagramWebhookVerifyToken || 'avyro_instagram_webhook_2026'

    // Log de diagnóstico seguro (mascara o secret para não vazar nos logs)
    const maskedExpected = expectedToken && expectedToken.length >= 6
      ? `${expectedToken.substring(0, 3)}...${expectedToken.substring(expectedToken.length - 3)}`
      : '***'

    console.log('[Instagram Webhook GET Verification Request]:', {
      mode,
      receivedTokenLength: verifyToken ? verifyToken.length : 0,
      expectedTokenConfigured: !!expectedToken,
      expectedTokenMasked: maskedExpected
    })

    // Validação estrita do token e modo 'subscribe'
    if (mode === 'subscribe' && verifyToken === expectedToken) {
      console.log('[Instagram Webhook GET Success] Token verificado com sucesso! Retornando hub.challenge.')
      // A Meta exige retorno do hub.challenge como text/plain com HTTP 200
      setResponseHeader(event, 'content-type', 'text/plain')
      return challenge
    }

    console.warn('[Instagram Webhook GET Error] Token de verificação incorreto ou modo inválido.')
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Invalid verify token'
    })
  }

  // ─── 2. RECEBIMENTO DE EVENTOS (POST) ──────────────────────────────────
  if (method === 'POST') {
    try {
      const rawBody = await readRawBody(event, 'utf-8') || ''
      const signature = getRequestHeader(event, 'x-hub-signature-256')
      const config = useRuntimeConfig()
      const appSecret = process.env.INSTAGRAM_APP_SECRET || config.instagramAppSecret || ''

      // Validação opcional da assinatura da Meta (se INSTAGRAM_APP_SECRET estiver configurado)
      if (appSecret && signature) {
        const isValidSignature = validateMetaSignature(rawBody, signature, appSecret)
        if (!isValidSignature) {
          console.warn('[Instagram Webhook POST] Assinatura X-Hub-Signature-256 inválida!')
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

      // Processar salvamento e matching no Supabase de forma assíncrona (não trava o HTTP 200)
      processIncomingInstagramWebhook(body).catch((err) => {
        console.error('[Instagram Webhook Async Process Error]:', err)
      })

      // Retorno imediato de HTTP 200 OK para a Meta
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
