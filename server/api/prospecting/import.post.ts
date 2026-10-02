import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser } from '../../utils/auth'
import { prospectSchema } from '../../../app/validation/prospecting'
import { prospectToDbRow } from '../../../app/utils/prospecting-row'

const leadSchema = prospectSchema.extend({ id: z.string().uuid() })
const bodySchema = z.object({ leads: z.array(leadSchema).min(1).max(5000) })
export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const admin = createClient(process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || '')
  const { data: member, error: memberError } = await admin.from('prospecting_members').select('user_id').eq('user_id', user.id).maybeSingle()
  if (memberError) throw createError({ statusCode: 500, statusMessage: 'Não foi possível verificar seu acesso.' })
  if (!member) throw createError({ statusCode: 403, statusMessage: 'Acesso restrito ao CRM.' })
  const raw = await readBody(event)
  if (JSON.stringify(raw).length > 10_000_000) throw createError({ statusCode: 413, statusMessage: 'Importação acima de 10 MB.' })
  const parsed = bodySchema.safeParse(raw)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: `Dados inválidos: ${parsed.error.issues[0]?.path.join('.')}: ${parsed.error.issues[0]?.message}` })
  const ids = new Set<string>(), interactionIds = new Set<string>()
  for (const lead of parsed.data.leads) {
    if (ids.has(lead.id)) throw createError({ statusCode: 400, statusMessage: 'Identificador de empresa duplicado no arquivo.' })
    ids.add(lead.id)
    for (const item of lead.history) {
      if (!z.string().uuid().safeParse(item.id).success || interactionIds.has(item.id)) throw createError({ statusCode: 400, statusMessage: 'Identificador de histórico inválido ou duplicado.' })
      interactionIds.add(item.id)
    }
  }
  const rows = parsed.data.leads.map(lead => ({
    ...prospectToDbRow(lead), created_at: lead.createdAt, updated_at: lead.updatedAt,
    interactions: lead.history.map(item => ({ id: item.id, lead_id: lead.id, date: item.date, channel: item.channel, stage: item.stage, note: item.note,
      created_at: item.createdAt || lead.createdAt, contact_time: item.time || null, contact_status: item.status || null })),
  }))
  const { data, error } = await admin.rpc('prospecting_import_leads', { p_leads: rows })
  if (error) {
    if (error.code === '23505') throw createError({ statusCode: 409, statusMessage: error.message?.startsWith('Importação bloqueada:') ? error.message : 'Importação bloqueada: identificador já cadastrado. Nenhum cadastro do arquivo foi importado.' })
    if (['PGRST202', '42883', '42703'].includes(error.code)) throw createError({ statusCode: 503, statusMessage: 'Execute o script prospecting-import.sql no Supabase antes de importar.' })
    throw createError({ statusCode: 500, statusMessage: 'Não foi possível importar. Nenhum cadastro foi alterado. Verifique os IDs e os dados do arquivo.' })
  }
  return data
})
