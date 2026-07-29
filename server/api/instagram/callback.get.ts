import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const code = query.code as string
  const stateRaw = query.state as string
  const error = query.error as string
  const errorReason = query.error_reason as string
  const errorDescription = query.error_description as string

  console.log('[Instagram OAuth Callback Received]:', {
    hasCode: !!code,
    hasError: !!error,
    errorReason,
    errorDescription
  })

  // 1. Tratamento de erro retornado pela Meta
  if (error || errorReason) {
    const errorMsg = errorDescription || errorReason || error || 'Autorização recusada'
    console.warn('[Instagram OAuth Callback Error]:', errorMsg)
    return sendRedirect(event, `/dashboard/instagram?instagram_connected=error&reason=${encodeURIComponent(errorMsg)}`, 302)
  }

  if (!code) {
    return sendRedirect(event, '/dashboard/instagram?instagram_connected=error&reason=Código+ausente', 302)
  }

  // 2. Extrair dados do state (userId) se presente
  let userIdFromState: string | null = null
  if (stateRaw) {
    try {
      const decoded = JSON.parse(Buffer.from(stateRaw, 'base64url').toString('utf-8'))
      userIdFromState = decoded.userId || null
    } catch (e) {
      console.warn('[Instagram OAuth Callback] Falha ao decodificar state:', e)
    }
  }

  const config = useRuntimeConfig()
  const oauthEnabled = config.instagramOauthEnabled ?? (process.env.INSTAGRAM_OAUTH_ENABLED === 'true')

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  // 3. Se INSTAGRAM_OAUTH_ENABLED=false (Aguardando aprovação da Meta)
  if (!oauthEnabled) {
    console.log('[Instagram OAuth Callback]: Código recebido com sucesso, mas INSTAGRAM_OAUTH_ENABLED=false.')
    return sendRedirect(event, '/dashboard/instagram?instagram_connected=pending', 302)
  }

  // 4. Se INSTAGRAM_OAUTH_ENABLED=true, realiza a troca por token real da conta do usuário
  const tokenResult = await exchangeInstagramCodeForToken(code)

  if (!tokenResult.success || !tokenResult.accessToken || !tokenResult.instagramAccountId) {
    console.error('[Instagram OAuth Callback] Falha ao trocar code por token:', tokenResult.error)
    return sendRedirect(event, `/dashboard/instagram?instagram_connected=error&reason=${encodeURIComponent(tokenResult.error || 'Erro na troca de token')}`, 302)
  }

  // Gravar a conta conectada com sucesso em instagram_accounts vinculada ao user_id
  if (userIdFromState) {
    const expiresAt = new Date(Date.now() + (tokenResult.expiresIn || 5184000) * 1000).toISOString()

    await supabaseAdmin.from('instagram_accounts').upsert({
      user_id: userIdFromState,
      instagram_account_id: tokenResult.instagramAccountId,
      instagram_username: tokenResult.instagramUsername || null,
      access_token: tokenResult.accessToken,
      token_expires_at: expiresAt,
      connection_status: 'connected',
      is_active: true,
      updated_at: new Date().toISOString()
    }, { onConflict: 'instagram_account_id' })
  }

  return sendRedirect(event, '/dashboard/instagram?instagram_connected=true', 302)
})
