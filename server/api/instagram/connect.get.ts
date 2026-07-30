export default defineEventHandler(async (event) => {
  // 1. Validar usuário autenticado no backend
  const user = await getAuthenticatedUser(event)

  const config = useRuntimeConfig()
  const rawOauth = config.instagramOauthEnabled ?? process.env.INSTAGRAM_OAUTH_ENABLED ?? process.env.NUXT_PUBLIC_INSTAGRAM_OAUTH_ENABLED
  const oauthEnabled = rawOauth === true || String(rawOauth).toLowerCase() === 'true'

  // Utilizar a URI exata cadastrada nas configuracoes do Meta Developers
  const redirectUri = config.instagramRedirectUri || process.env.INSTAGRAM_REDIRECT_URI || 'https://www.avyro.com.br/api/instagram/callback'
  const appId = config.instagramAppId || process.env.INSTAGRAM_APP_ID || '4609504682619928'

  if (process.dev || process.env.NODE_ENV !== 'production') {
    console.log('[Instagram Connect GET Dev Diagnostics]:', {
      userId: user.id,
      rawOauth,
      oauthEnabled,
      hasInstagramAppId: !!appId,
      redirectUri
    })
  }

  // 2. Se OAuth estiver desativado, redireciona informando a flag
  if (!oauthEnabled) {
    console.log(`[Instagram OAuth Connect]: Usuário ${user.id} tentou conectar, mas INSTAGRAM_OAUTH_ENABLED=false.`)
    return sendRedirect(event, '/dashboard/instagram?oauth_disabled=true', 302)
  }

  // 3. Se OAuth estiver ativado, gera a URL oficial de autorização do Instagram Login com a redirectUri exata
  const authUrl = buildInstagramAuthUrl(user.id, redirectUri)
  console.log(`[Instagram OAuth Connect]: Redirecionando usuário ${user.id} para Instagram Login: ${authUrl}`)
  return sendRedirect(event, authUrl, 302)
})
