export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // ─── 1. VERIFICAÇÃO DO WEBHOOK (GET) ───────────────────────────────────
  if (method === 'GET') {
    const query = getQuery(event)

    // A Meta envia parâmetros com formato hub.* (ex: hub.mode, hub.verify_token, hub.challenge)
    const mode = (query['hub.mode'] || query.mode) as string
    const verifyToken = (query['hub.verify_token'] || query.verify_token) as string
    const challenge = (query['hub.challenge'] || query.challenge) as string

    // Token configurado no ambiente ou fallback seguro
    const expectedToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || 'avyro_instagram_webhook_2026'

    console.log('[Instagram Webhook GET Verification]:', { mode, verifyToken, challenge })

    if (mode === 'subscribe' && verifyToken === expectedToken) {
      console.log('[Instagram Webhook] Token verificado com sucesso!')
      // A Meta exige o retorno bruto/text-plain do hub.challenge com HTTP 200
      setResponseHeader(event, 'content-type', 'text/plain')
      return challenge
    } else {
      console.warn('[Instagram Webhook] Token de verificação incorreto ou modo inválido:', verifyToken)
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Invalid verify token'
      })
    }
  }

  // ─── 2. RECEBIMENTO DE EVENTOS (POST) ──────────────────────────────────
  if (method === 'POST') {
    try {
      const body = await readBody(event)

      console.log('----------------------------------------------------')
      console.log('[Instagram Webhook POST Event Received]:')
      console.log(JSON.stringify(body, null, 2))
      console.log('----------------------------------------------------')

      // Responder 200 OK para a Meta confirmar a entrega do evento
      return { received: true }
    } catch (err: any) {
      console.error('[Instagram Webhook POST Error]:', err?.message || err)
      return { received: false, error: err?.message }
    }
  }

  // Método não suportado
  throw createError({
    statusCode: 405,
    statusMessage: 'Method Not Allowed'
  })
})
