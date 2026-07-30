/**
 * Instagram OAuth Helper Service
 * For generating authorization URLs and exchanging OAuth code for access tokens.
 */

export interface InstagramOAuthResult {
  success: boolean
  accessToken?: string
  instagramAccountId?: string
  instagramUsername?: string
  expiresIn?: number
  error?: string
}

/**
 * Builds the official Instagram Login for Business authorization URL
 * Scopes: instagram_business_basic, instagram_business_manage_messages, instagram_business_manage_comments
 */
export function buildInstagramAuthUrl(userId: string, customRedirectUri?: string): string {
  const config = useRuntimeConfig()
  const appId = config.instagramAppId || process.env.INSTAGRAM_APP_ID || '4609504682619928'
  let redirectUri = customRedirectUri || config.instagramRedirectUri || process.env.INSTAGRAM_REDIRECT_URI || 'https://www.avyro.com.br/api/instagram/callback'

  if (redirectUri.startsWith('//')) {
    redirectUri = 'http:' + redirectUri
  }

  // Generate safe state token containing user_id and timestamp
  const stateData = {
    userId,
    ts: Date.now(),
    nonce: Math.random().toString(36).substring(2, 10)
  }
  const state = Buffer.from(JSON.stringify(stateData)).toString('base64url')

  const scopes = [
    'instagram_business_basic',
    'instagram_business_manage_messages',
    'instagram_business_manage_comments'
  ].join(',')

  const authUrl = `https://www.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&state=${state}`

  return authUrl
}

/**
 * Exchanges authorization code for Instagram Access Token (Short-lived -> Long-lived 60 days)
 * Never logs raw secrets or full access tokens!
 */
export async function exchangeInstagramCodeForToken(code: string, customRedirectUri?: string): Promise<InstagramOAuthResult> {
  const config = useRuntimeConfig()
  const appId = config.instagramAppId || process.env.INSTAGRAM_APP_ID || '4609504682619928'
  const appSecret = config.instagramAppSecret || process.env.INSTAGRAM_APP_SECRET || ''
  const redirectUri = customRedirectUri || config.instagramRedirectUri || process.env.INSTAGRAM_REDIRECT_URI || 'https://www.avyro.com.br/api/instagram/callback'

  if (!appSecret) {
    console.error('[Instagram OAuth Error] INSTAGRAM_APP_SECRET não está configurado.')
    return { success: false, error: 'INSTAGRAM_APP_SECRET missing on server' }
  }

  console.log(`[Instagram OAuth Exchange]: Iniciando troca de código [code=${code.substring(0, 5)}...] para App ID ${appId}`)

  try {
    // 1. Passo 1: Trocar code por Short-Lived Access Token
    const formData = new URLSearchParams()
    formData.append('client_id', appId)
    formData.append('client_secret', appSecret)
    formData.append('grant_type', 'authorization_code')
    formData.append('redirect_uri', redirectUri)
    formData.append('code', code)

    const shortTokenRes = await $fetch<{ access_token: string; user_id: string }>(
      'https://api.instagram.com/oauth/access_token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      }
    )

    const shortToken = shortTokenRes?.access_token
    const instagramAccountId = String(shortTokenRes?.user_id || '')

    if (!shortToken) {
      return { success: false, error: 'Falha ao obter token de curta duração do Instagram' }
    }

    // 2. Passo 2: Trocar Short-Lived por Long-Lived Access Token (valido por ~60 dias)
    const longTokenUrl = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortToken}`
    const longTokenRes = await $fetch<{ access_token: string; token_type: string; expires_in: number }>(longTokenUrl)

    const longToken = longTokenRes?.access_token || shortToken
    const expiresIn = longTokenRes?.expires_in || 5184000 // Default 60 dias em segundos

    const maskedToken = longToken.length > 10
      ? `${longToken.substring(0, 6)}...${longToken.substring(longToken.length - 4)}`
      : '***'

    console.log(`[Instagram OAuth Success]: Token de 60 dias gerado com sucesso [${maskedToken}] para a conta ${instagramAccountId}`)

    return {
      success: true,
      accessToken: longToken,
      instagramAccountId,
      expiresIn
    }
  } catch (err: any) {
    const errorMsg = err?.data?.error_message || err?.message || err
    console.error('[Instagram OAuth Exchange Error]:', errorMsg)
    return { success: false, error: String(errorMsg) }
  }
}
