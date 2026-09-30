import assert from 'node:assert/strict'
import { createJiti } from 'jiti'
const jiti = createJiti(import.meta.url, { alias: { '~': `${process.cwd()}/app` } })
const { newProspect, contactCounted } = await jiti.import('../app/utils/prospecting.ts')
const { prospectSchema, prospectDataSchema } = await jiti.import('../app/validation/prospecting.ts')
const { compareProspects, returnBucket, prospectPhones, whatsappUrl, prospectsInPeriod } = await jiti.import('../app/utils/prospecting-workspace.ts')
const base = { ...newProspect(), company: 'Água', city: 'Osasco', segment: 'Serviços', createdAt: '2026-09-01T12:00:00Z' }
const oldBackup = { ...base }; delete oldBackup.additionalPhones
assert.deepEqual(prospectSchema.parse(oldBackup).additionalPhones, [])
const numbers = { ...base, phone: '(11) 99999-1234', additionalPhones: ['+55 11 98888-4321', '11 97777-2222'] }
assert.equal(prospectDataSchema.parse({version: 1, leads: [numbers], settings: {target: 30, budget: 0}}).leads[0].additionalPhones.length, 2)
assert.equal(prospectPhones(numbers).length, 3)
assert.equal(whatsappUrl(numbers.phone), 'https://wa.me/5511999991234')
assert.equal(whatsappUrl('+1 202 555 0123'), 'https://wa.me/12025550123')
assert.equal(whatsappUrl('123'), '')
assert.equal(prospectSchema.safeParse({...numbers, additionalPhones: Array(10).fill('123')}).success, false)
assert.equal(contactCounted(base), false)
assert.equal(returnBucket(base, '2026-09-30'), 'unscheduled')
assert.equal(returnBucket({...base, followUp: '2026-09-29'}, '2026-09-30'), 'overdue')
assert.equal(returnBucket({...base, followUp: '2026-09-30'}, '2026-09-30'), 'today')
assert.equal(returnBucket({...base, followUp: '2026-10-01'}, '2026-09-30'), 'upcoming')
for (const stage of ['Fechado', 'Sem interesse', 'Não contatar']) assert.equal(returnBucket({...base, stage}, '2026-09-30'), '')
assert.equal(returnBucket({...base, archived: true}, '2026-09-30'), '')
const newer = {...base, id: 'new', company: 'Zebra', createdAt: '2026-09-29T12:00:00Z', rating: 4.9}
const lower = {...base, id: 'low', company: 'Beta', rating: 2}
assert.equal([base, newer].sort((a,b)=>compareProspects(a,b,'newest'))[0].id, 'new')
assert.equal([base, newer].sort((a,b)=>compareProspects(a,b,'oldest'))[0].id, base.id)
assert.equal([newer, base].sort((a,b)=>compareProspects(a,b,'name'))[0].company, 'Água')
assert.equal([base, newer].sort((a,b)=>compareProspects(a,b,'name-desc'))[0].company, 'Zebra')
for (const sort of ['rating', 'rating-asc']) assert.equal([base, newer, lower].sort((a,b)=>compareProspects(a,b,sort))[2].rating, null)
assert.equal([base, newer, lower].sort((a,b)=>compareProspects(a,b,'rating'))[0].rating, 4.9)
assert.equal([base, newer, lower].sort((a,b)=>compareProspects(a,b,'rating-asc'))[0].rating, 2)
const history = [{id:'1', date:'2026-09-05', stage:'Contatado', channel:'WhatsApp', note:'Contato'}, {id:'2', date:'2026-09-30', stage:'Respondeu', channel:'WhatsApp', note:'Resposta'}]
const period = prospectsInPeriod([{...base, history}, newer], '2026-09-29', '2026-09-30')
assert.equal(period.length, 2)
assert.equal(period[0].history.length, 1)
assert.equal(period[0].history[0].stage, 'Respondeu')
assert.equal(prospectsInPeriod([base], '2026-10-01', '2026-09-01').length, 0)
assert.equal(prospectsInPeriod([base], '', '').length, 1)
console.log('OK: cadastro sem contato, múltiplos telefones, backups antigos, WhatsApp, filas, ordenações e períodos.')
