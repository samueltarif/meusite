export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const q = (query.q as string) || 'aesthetic background'
    const page = (query.page as string) || '1'
    const perPage = (query.per_page as string) || '28'

    const config = useRuntimeConfig()
    const apiKey = config.pexelsApiKey || process.env.PEXELS_API_KEY

    if (!apiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Chave da API do Pexels não configurada no servidor.'
      })
    }

    const data = await $fetch<any>(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=${perPage}&page=${page}`, {
      headers: {
        Authorization: apiKey
      }
    })

    return {
      success: true,
      total_results: data.total_results,
      page: data.page,
      per_page: data.per_page,
      photos: (data.photos || []).map((p: any) => ({
        id: p.id,
        photographer: p.photographer,
        photographer_url: p.photographer_url,
        src: {
          original: p.src.original,
          large2x: p.src.large2x,
          large: p.src.large,
          medium: p.src.medium,
          small: p.src.small,
          tiny: p.src.tiny
        },
        alt: p.alt
      }))
    }
  } catch (error: any) {
    console.error('Pexels API Proxy Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erro ao buscar fotos na API do Pexels.'
    })
  }
})
