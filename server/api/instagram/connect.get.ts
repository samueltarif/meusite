export default defineEventHandler(async (event) => {
  // 1. Validar usuário autenticado no backend
  const user = await getAuthenticatedUser(event)

  const config = useRuntimeConfig()
  const oauthEnabled = config.instagramOauthEnabled ?? (process.env.INSTAGRAM_OAUTH_ENABLED === 'true')

  // 2. Se OAuth estiver desativado (aguardando aprovação da Meta), redireciona informando a flag
  if (!oauthEnabled) {
    console.log(`[Instagram OAuth Connect]: Usuário ${user.id} tentou conectar, mas INSTAGRAM_OAUTH_ENABLED=false.`)
    return sendRedirect(event, '/dashboard/instagram?oauth_disabled=true', 302)
  }

  // 3. Se OAuth estiver ativado, gera a URL oficial de autorização do Instagram Login e redireciona
  const authUrl = buildInstagramAuthUrl(user.id)
  console.log(`[Instagram OAuth Connect]: Redirecionando usuário ${user.id} para Instagram Login.`)
  return sendRedirect(event, authUrl, 302)
})
