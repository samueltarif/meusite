import { z } from 'zod'
const text = (max = 200) => z.string().trim().max(max)
export const calendarDate = z.string().refine(value => value === '' || (/^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00Z`)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value), 'Informe uma data válida.')
const url = z.string().trim().max(2000).refine(value => { if (!value) return true; try { return ['http:', 'https:'].includes(new URL(value).protocol) } catch { return false } }, 'Use um link completo, começando com https://.')
const stage = z.enum(['Selecionado', 'Contatado', 'Respondeu', 'Interessado', 'Proposta enviada', 'Fechado', 'Sem interesse', 'Não contatar'])
const channel = z.enum(['WhatsApp', 'Instagram', 'E-mail', 'Telefone', 'Presencial'])
const history = z.object({ id: text(100).min(1), date: calendarDate.refine(Boolean, 'Informe a data do contato.'), channel, stage, note: text(4000).min(1, 'Registre o que aconteceu.') })
export const prospectSchema = z.object({
  id: text(100).min(1), company: text().min(2, 'Informe o nome da empresa.'), person: text(), city: text().min(2, 'Informe a cidade.'), segment: text().min(2, 'Informe o segmento.'), source: text(),
  maps: url, instagram: url, website: url, phone: text(50), email: text(254).refine(value => !value || z.string().email().safeParse(value).success, 'Informe um e-mail válido.'),
  websiteStatus: z.enum(['Não verificado', 'Sem site', 'Só Instagram', 'Site antigo ou ruim', 'Site adequado']), activity: z.enum(['Não verificada', 'Ativo', 'Aparentemente abandonado']),
  goodReviews: z.boolean(), recentPhotos: z.boolean(), professional: z.boolean(), rating: z.number().min(0).max(5).nullable(), reviewCount: z.number().int().min(0).nullable(),
  heatOverride: z.enum(['', 'Quente', 'Morno', 'Revisar', 'Descartar']), opportunity: text(4000), personalization: text(2000), stage,
  nextAction: text(500), followUp: calendarDate, notes: text(6000), proposalValue: z.number().min(0).max(100000000), monthlyValue: z.number().min(0).max(100000000),
  archived: z.boolean(), createdAt: z.string().datetime(), updatedAt: z.string().datetime(), history: z.array(history).max(500),
})
export const settingsSchema = z.object({ target: z.number().int().min(1).max(100000), budget: z.number().min(0).max(10000000) })
export const prospectDataSchema = z.object({ version: z.literal(1), leads: z.array(prospectSchema).max(5000), settings: settingsSchema }).refine(data => new Set(data.leads.map(lead => lead.id)).size === data.leads.length, 'O arquivo contém identificadores duplicados.')
export const activitySchema = z.object({ date: calendarDate.refine(Boolean, 'Informe a data.'), channel, stage, note: text(4000).min(1, 'Descreva o contato.'), followUp: calendarDate, nextAction: text(500) }).refine(data => !data.followUp || data.followUp >= data.date, 'O retorno não pode ser anterior ao contato.')
