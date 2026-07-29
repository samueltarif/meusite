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
      setResponseHeader(event, 'content-type', 'text/plain')
      return challenge
    }

    console.warn('[Instagram Webhook GET Error] Token de verificação incorreto ou modo inválido.')
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Invalid verify token'
    })
  }

  // ─── 2. RECEBIMENTO E GRAVAÇÃO DE EVENTOS (POST) ──────────────────────
  if (method === 'POST') {
    try {
      const contentType = getRequestHeader(event, 'content-type') || ''
      let rawOrParsedBody: any = null

      try {
        // Ler o body com await readBody(event) APENAS UMA VEZ
        rawOrParsedBody = await readBody(event)
      } catch (readErr: any) {
        console.error('[Instagram Webhook POST Error]: Falha ao ler o body da requisição:', readErr?.message)
      }

      console.log('----------------------------------------------------')
      console.log('[Instagram Webhook POST Diagnostics]:', {
        contentType,
        bodyType: typeof rawOrParsedBody,
        isEmpty: !rawOrParsedBody
      })

      let body: any = rawOrParsedBody

      // Se readBody(event) retornar string (ex: JSON bruto), realiza JSON.parse seguro
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body)
        } catch (parseErr) {
          console.error('[Instagram Webhook POST Error]: String do body não é um JSON válido.')
          return {
            received: true,
            saved: false,
            error: 'Invalid JSON body'
          }
        }
      }

      // Validação do objeto JSON
      if (!body || typeof body !== 'object') {
        console.error('[Instagram Webhook POST Error]: Body é nulo ou não é um objeto válido.', {
          contentType,
          bodyType: typeof body,
          isEmpty: !body
        })
        return {
          received: true,
          saved: false,
          error: 'Invalid JSON body'
        }
      }

      console.log('[Instagram Webhook POST Event Payload Received]:')
      console.log(JSON.stringify(body, null, 2))
      console.log('----------------------------------------------------')

      // Processar e salvar na tabela `instagram_webhook_events` no Supabase
      const processResult = await processIncomingInstagramWebhook(body)

      console.log('[Instagram Webhook POST Result]:', processResult)

      return {
        received: true,
        saved: processResult?.saved ?? false,
        event_id: processResult?.event_id || null,
        error: processResult?.error || null
      }
    } catch (err: any) {
      console.error('[Instagram Webhook POST Exception]:', err?.message || err)
      return {
        received: true,
        saved: false,
        error: err?.message || 'Erro interno ao processar webhook'
      }
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method Not Allowed'
  })
})
