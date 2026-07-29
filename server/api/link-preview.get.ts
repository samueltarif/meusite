export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string

  if (!url || !url.startsWith('http')) {
    throw createError({ statusCode: 400, statusMessage: 'URL inválida ou ausente.' })
  }

  // Parse the origin to resolve relative URLs later
  let origin = ''
  try {
    origin = new URL(url).origin
  } catch (e) {
    throw createError({ statusCode: 400, statusMessage: 'URL malformada.' })
  }

  try {
    const response = await fetch(url, {
      headers: {
        // Mimic a real browser/bot so sites serve OG meta tags
        'User-Agent': 'Mozilla/5.0 (compatible; WhatsApp/2.0; +https://www.whatsapp.com/)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
      signal: AbortSignal.timeout(6000),
    })

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` }
    }

    const html = await response.text()

    // ─── Regex helpers ──────────────────────────────────────────────────────
    function getOgProperty(prop: string): string {
      const re1 = new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i')
      const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, 'i')
      return (html.match(re1) || html.match(re2))?.[1]?.trim() || ''
    }

    function getMetaName(name: string): string {
      const re1 = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i')
      const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i')
      return (html.match(re1) || html.match(re2))?.[1]?.trim() || ''
    }

    function getTitle(): string {
      return html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || ''
    }

    // ─── Extract OG / Twitter meta tags ────────────────────────────────────
    const title       = getOgProperty('og:title')       || getMetaName('twitter:title')       || getTitle()
    const description = getOgProperty('og:description') || getMetaName('twitter:description') || getMetaName('description')
    const image       = getOgProperty('og:image')       || getMetaName('twitter:image')       || getOgProperty('og:image:secure_url')
    const siteName    = getOgProperty('og:site_name')   || ''

    // ─── Resolve image URL (may be relative) ────────────────────────────────
    let resolvedImage = ''
    if (image) {
      resolvedImage = image.startsWith('http') ? image : image.startsWith('//') ? `https:${image}` : `${origin}${image.startsWith('/') ? '' : '/'}${image}`
    }

    // ─── Extract favicon ────────────────────────────────────────────────────
    let favicon = ''
    const faviconMatch =
      html.match(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["']/i) ||
      html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*icon[^"']*["']/i)

    if (faviconMatch?.[1]) {
      const raw = faviconMatch[1].trim()
      favicon = raw.startsWith('http') ? raw : raw.startsWith('//') ? `https:${raw}` : `${origin}${raw.startsWith('/') ? '' : '/'}${raw}`
    } else {
      favicon = `${origin}/favicon.ico`
    }

    return {
      success: true,
      title:       title       || null,
      description: description || null,
      image:       resolvedImage || null,
      siteName:    siteName    || null,
      favicon:     favicon     || null,
      url,
    }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Timeout ou erro de rede.' }
  }
})
