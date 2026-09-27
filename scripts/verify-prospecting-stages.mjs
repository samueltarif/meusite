import assert from 'node:assert/strict'
import { createJiti } from 'jiti'
const jiti = createJiti(import.meta.url, { alias: { '~': `${process.cwd()}/app` } })
const { newProspect, contactCounted, contactSummary, recordActivity, segmentResults } = await jiti.import('../app/utils/prospecting.ts')
const { prospectSchema, prospectDataSchema } = await jiti.import('../app/validation/prospecting.ts')
const pending = { ...newProspect(), company: 'Empresa pesquisada', city: 'Osasco', segment: 'Indústria' }
assert.equal(pending.person, '')
assert.equal(pending.stage, 'Selecionado')
assert.equal(contactSummary(pending), 'Ainda não contatado')
assert.equal(prospectSchema.safeParse(pending).success, true)
const approved = { ...pending, stage: 'Aprovado' }
assert.equal(prospectSchema.safeParse(approved).success, true)
assert.equal(contactCounted(approved), false)
assert.equal(contactSummary(approved), 'Ainda não contatado')
assert.equal(segmentResults([pending, approved])[0].contacted, 0)
assert.equal(prospectDataSchema.safeParse({ version: 1, leads: [approved], settings: { target: 30, budget: 0 } }).success, true)
const contacted = recordActivity(approved, { date: '2026-09-27', channel: 'WhatsApp', stage: 'Contatado', note: 'Primeira mensagem enviada', followUp: '2026-09-29', nextAction: 'Retomar conversa' })
assert.equal(contactCounted(contacted), true)
assert.equal(contactSummary(contacted), 'Contato registrado')
assert.equal(contacted.stage, 'Contatado')
assert.equal(segmentResults([approved, contacted])[0].contacted, 1)
assert.equal(contactSummary({ ...pending, stage: 'Contatado' }), 'Sem contato registrado no histórico')
assert.equal(prospectSchema.safeParse({ ...pending, stage: 'Inventado' }).success, false)
console.log('Pesquisa sem dono, aprovação sem contato, primeiro contato, backup e métricas: OK.')
