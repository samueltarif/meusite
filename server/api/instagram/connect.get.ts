export default defineEventHandler(async (event) => {
  // 1. Validar usuário autenticado no backend
  const user = await getAuthenticatedUser(event)

  const config = useRuntimeConfig()
  const rawOauth = config.instagramOauthEnabled ?? process.env.INSTAGRAM_OAUTH_ENABLED ?? process.env.NUXT_PUBLIC_INSTAGRAM_OAUTH_ENABLED
  const oauthEnabled = rawOauth === true || String(rawOauth).toLowerCase() === 'true'

  // Detectar a origem exata da requisição (ex: http://localhost:3001 ou https://www.avyro.com.br)
  const host = getRequestHeader(event, 'host') || 'localhost:3000'
  const protocol = getRequestHeader(event, 'x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
  const currentOrigin = `${protocol}://${host}`

  let redirectUri = config.instagramRedirectUri || process.env.INSTAGRAM_REDIRECT_URI || `${currentOrigin}/api/instagram/callback`
  if (host.includes('localhost')) {
    redirectUri = `${currentOrigin}/api/instagram/callback`
  }

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

  // 3. Se OAuth estiver ativado, gera a URL oficial de autorização do Instagram Login e redireciona
  const authUrl = buildInstagramAuthUrl(user.id, redirectUri)
  console.log(`[Instagram OAuth Connect]: Redirecionando usuário ${user.id} para Instagram Login: ${authUrl}`)
  return sendRedirect(event, authUrl, 302)
})
