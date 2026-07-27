export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const q = (query.q as string) || 'aesthetic background'
    const page = parseInt((query.page as string) || '1', 10)
    const perPage = parseInt((query.per_page as string) || '28', 10)
    const offset = (page - 1) * perPage

    const config = useRuntimeConfig()
    const apiKey = config.giphyApiKey || process.env.GIPHY_API_KEY

    if (!apiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Chave da API do Giphy não configurada no servidor.'
      })
    }

    const data = await $fetch<any>(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(q)}&limit=${perPage}&offset=${offset}&rating=g`)

    return {
      success: true,
      pagination: data.pagination,
      gifs: (data.data || []).map((g: any) => ({
        id: g.id,
        title: g.title || 'Giphy GIF',
        author: g.username || 'Giphy Creator',
        url: g.images?.original?.url || g.images?.downsized_large?.url,
        thumb: g.images?.fixed_height?.url || g.images?.downsized_medium?.url || g.images?.original?.url
      }))
    }
  } catch (error: any) {
    console.error('Giphy API Proxy Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Erro ao buscar GIFs no Giphy.'
    })
  }
})
