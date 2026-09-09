export default defineEventHandler(event => {
  const origin = String(useRuntimeConfig(event).public.siteUrl).replace(/\/$/, '')
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return `User-agent: *\nDisallow: /api/\nDisallow: /dashboard\nSitemap: ${origin}/sitemap.xml\n`
})
