export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const q = (query.q as string) || 'aesthetic background'
    const page = (query.page as string) || '1'
    const perPage = (query.per_page as string) || '16'

    const config = useRuntimeConfig()
    const accessKey = config.unsplashAccessKey || process.env.UNSPLASH_ACCESS_KEY

    if (!accessKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Chave de acesso da API do Unsplash não configurada no servidor.'
      })
    }

    const data = await $fetch<any>(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=${perPage}&page=${page}`, {
      headers: {
        Authorization: `Client-ID ${accessKey}`
      }
    })

    return {
      success: true,
      total: data.total,
      total_pages: data.total_pages,
      results: (data.results || []).map((img: any) => ({
        id: img.id,
        description: img.alt_description || img.description || 'Unsplash Photo',
        photographer: img.user?.name || 'Unsplash Artist',
        photographer_url: img.user?.links?.html || 'https://unsplash.com',
        urls: {
          raw: img.urls.raw,
          full: img.urls.full,
          regular: img.urls.regular,
          small: img.urls.small,
          thumb: img.urls.thumb
        }
      }))
    }
  } catch (error: any) {
    console.error('Unsplash API Proxy Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erro ao buscar imagens na API do Unsplash.'
    })
  }
})
