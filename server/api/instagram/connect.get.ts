export default defineEventHandler(async (event) => {
  // 1. Validar usuário autenticado no backend
  const user = await getAuthenticatedUser(event)

  const config = useRuntimeConfig()
  const rawOauth = config.instagramOauthEnabled ?? process.env.INSTAGRAM_OAUTH_ENABLED ?? process.env.NUXT_PUBLIC_INSTAGRAM_OAUTH_ENABLED
  const oauthEnabled = rawOauth === true || String(rawOauth).toLowerCase() === 'true'

  const appId = config.instagramAppId || process.env.INSTAGRAM_APP_ID || '4609504682619928'
  const redirectUri = config.instagramRedirectUri || process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:3000/api/instagram/callback'

  // Log seguro de diagnóstico em ambiente de desenvolvimento
  if (process.dev || process.env.NODE_ENV !== 'production') {
    console.log('[Instagram Connect GET Dev Diagnostics]:', {
      userId: user.id,
      rawOauth,
      oauthEnabled,
      hasInstagramAppId: !!appId,
      hasRedirectUri: !!redirectUri
    })
  }

  // 2. Se OAuth estiver desativado, redireciona para o dashboard com parâmetro oauth_disabled=true
  if (!oauthEnabled) {
    console.log(`[Instagram OAuth Connect]: Usuário ${user.id} tentou conectar, mas INSTAGRAM_OAUTH_ENABLED=false.`)
    return sendRedirect(event, '/dashboard/instagram?oauth_disabled=true', 302)
  }

  // 3. Se OAuth estiver ativado, gera a URL oficial de autorização do Instagram Login e redireciona
  const authUrl = buildInstagramAuthUrl(user.id)
  console.log(`[Instagram OAuth Connect]: Redirecionando usuário ${user.id} para Instagram Login: ${authUrl}`)
  return sendRedirect(event, authUrl, 302)
})
