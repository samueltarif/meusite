import { serviceLandings } from '../../app/constants/services'
export default defineEventHandler(event => {
  const origin = String(useRuntimeConfig(event).public.siteUrl).replace(/\/$/, '')
  const paths = ['/', '/modelos-site', '/criacao-de-sites', ...serviceLandings.map(item => `/criacao-de-sites/${item.slug}`)]
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `<url><loc>${escape(origin + path)}</loc></url>`).join('')}</urlset>`
})
