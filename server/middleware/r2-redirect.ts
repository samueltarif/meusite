export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const pathname = decodeURI(url.pathname)

  if (
    pathname.startsWith('/images/') ||
    pathname.startsWith('/imagens campanha gmk/') ||
    pathname.startsWith('/videos/') ||
    pathname.startsWith('/datasheets/')
  ) {
    // Redireciona permanentemente (301) para a CDN Cloudflare R2
    const target = `https://media.avyro.com.br${encodeURI(pathname)}${url.search}`
    return sendRedirect(event, target, 301)
  }
})
