import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createJiti } from 'jiti'
const jiti = createJiti(import.meta.url)
const { filterIndustrialProducts } = await jiti.import('../app/utils/catalog.ts')
const { industrialProducts: products } = await jiti.import('../app/constants/industrial.ts')
assert.equal(filterIndustrialProducts(products, '  ', 'todos').length, 8)
assert.equal(filterIndustrialProducts(products, 'MANOMETRO', 'todos')[0]?.model, '213.53')
assert.equal(filterIndustrialProducts(products, 'WIKA', 'instrumentacao').length, 2)
assert.equal(filterIndustrialProducts(products, 'WIKA', 'valvulas').length, 0)
assert.equal(filterIndustrialProducts(products, 'produto inexistente', 'todos').length, 0)
assert.equal(filterIndustrialProducts(products, '06512', 'todos')[0]?.manufacturer, 'HEROSE')
assert.equal(filterIndustrialProducts(products, '', 'reguladores').length, 3)
assert.equal(filterIndustrialProducts(products, '', 'valvulas').length, 3)
const base = 'http://127.0.0.1:3000'
const routes = ['/', '/modelos-site', '/exemplos/manicure', '/exemplos/arquitetura', '/exemplos/oficina', '/exemplos/industrial', '/exemplos/industrial/catalogo', '/exemplos/climatizacao', '/exemplos/odontologia', '/exemplos/contabilidade', '/exemplos/marcenaria', '/exemplos/engenharia', '/exemplos/fotografia', '/exemplos/floricultura', '/exemplos/floricultura-atelie']
const assets = new Set(products.flatMap(p => [p.image, p.pdf]))
for (const route of routes) {
 const response = await fetch(base + route)
 assert.equal(response.status, 200, route)
 const html = await response.text()
 assert.ok(html.includes('<h1'), `Missing heading: ${route}`)
 const campaignContent = html.replace(/<head[\s\S]*?<\/head>/gi, '').replace(/<script[\s\S]*?<\/script>/gi, '')
 assert.ok(!/Link.?in.?Bio/i.test(campaignContent), `Campaign contains Link Bio: ${route}`)
 assert.ok(!/R\$\s*\d/.test(html), `Campaign contains price: ${route}`)
 assert.ok(html.includes('5511951372631'), `Missing WhatsApp: ${route}`)
 for (const match of html.matchAll(/(?:src|href)="(\/(?:images|datasheets)\/[^"?]+)[^"]*"/g)) assets.add(match[1])
 console.log(`Page OK: ${route}`)
}
for (const asset of assets) {
 const data = await readFile(`public${asset}`)
 assert.ok(data.length > 100, asset)
 if (asset.endsWith('.pdf')) assert.equal(data.subarray(0, 4).toString(), '%PDF', asset)
 const response = await fetch(base + asset, { method: 'HEAD' })
 assert.equal(response.status, 200, asset)
}
console.log(`Filters and ${assets.size} assets passed.`)
