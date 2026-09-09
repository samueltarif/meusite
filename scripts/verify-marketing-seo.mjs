import assert from 'node:assert/strict'
import { createJiti } from 'jiti'
const jiti = createJiti(import.meta.url)
const { serviceLandings } = await jiti.import('../app/constants/services.ts')
const { validAdsConfig, isAvyroContact, isCampaignPath } = await jiti.import('../app/utils/ads.ts')
assert.equal(validAdsConfig('', ''), false)
assert.equal(validAdsConfig('AW-123456789', 'abc_def-123'), true)
assert.equal(validAdsConfig('AW-123/x', 'abc'), false)
assert.equal(isAvyroContact('https://wa.me/5511951372631?text=teste'), true)
assert.equal(isAvyroContact('https://wa.me.evil.example/5511951372631'), false)
assert.equal(isAvyroContact('https://wa.me/5511000000000'), false)
assert.equal(isCampaignPath('/dashboard'), false)
assert.equal(isCampaignPath('/criacao-de-sites/floriculturas'), true)
const base = 'http://127.0.0.1:3000'
const routes = ['/', '/modelos-site', '/criacao-de-sites', ...serviceLandings.map(s => `/criacao-de-sites/${s.slug}`)]
for (const route of routes) {
  const response = await fetch(`${base}${route}?utm_source=teste`)
  assert.equal(response.status, 200, route)
  const html = await response.text()
  assert.equal((html.match(/<h1\b/g) || []).length, 1, route)
  assert.ok(html.includes(`href="https://avyro.com.br${route}"`), `Canonical: ${route}`)
  for (const tag of ['og:title', 'og:description', 'og:image', 'twitter:card']) assert.ok(html.includes(tag), `${tag}: ${route}`)
  assert.ok(!html.includes('name="robots" content="noindex'), route)
  assert.ok(!html.includes('family=Pacifico'), `Campaign loads unrelated fonts: ${route}`)
  assert.ok(!html.includes('gtag/js'), 'Unconfigured Google tag loaded')
}
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text()
assert.equal((sitemap.match(/<loc>/g) || []).length, routes.length)
assert.ok(!sitemap.includes('/exemplos/'))
const robots = await (await fetch(`${base}/robots.txt`)).text()
assert.ok(robots.includes('Sitemap: https://avyro.com.br/sitemap.xml'))
assert.equal((await fetch(`${base}/criacao-de-sites/nao-existe`)).status, 404)
assert.equal((await fetch(`${base}/images/avyro-social.png`)).status, 200)
console.log(`${routes.length} commercial pages, metadata, sitemap, 404 and tracking guards passed.`)
