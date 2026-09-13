import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser } from '../../utils/auth'

const interactionSchema = z.object({
  id: z.string().uuid(),
  lead_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  channel: z.enum(['WhatsApp', 'Instagram', 'E-mail', 'Telefone', 'Presencial']),
  stage: z.enum(['Selecionado', 'Contatado', 'Respondeu', 'Interessado', 'Proposta enviada', 'Fechado', 'Sem interesse', 'NÃ£o contatar']),
  note: z.string().min(1).max(4000),
})

const leadSchema = z.object({
  id: z.string().uuid(),
  company: z.string().trim().min(2).max(200),
  person: z.string().trim().max(200).default(''),
  city: z.string().trim().min(2).max(200),
  segment: z.string().trim().min(2).max(200),
  source: z.string().trim().max(200).default('Google Maps'),
  maps: z.string().trim().max(2000).default(''),
  instagram: z.string().trim().max(2000).default(''),
  website: z.string().trim().max(2000).default(''),
  phone: z.string().trim().max(50).default(''),
  email: z.string().trim().max(254).default(''),
  website_status: z.enum(['NÃ£o verificado', 'Sem site', 'SÃ³ Instagram', 'Site antigo ou ruim', 'Site adequado']).default('NÃ£o verificado'),
  activity: z.enum(['NÃ£o verificada', 'Ativo', 'Aparentemente abandonado']).default('NÃ£o verificada'),
  good_reviews: z.boolean().default(false),
  recent_photos: z.boolean().default(false),
  professional: z.boolean().default(false),
  rating: z.number().min(0).max(5).nullable().default(null),
  review_count: z.number().int().min(0).nullable().default(null),
  heat_override: z.enum(['', 'Quente', 'Morno', 'Revisar', 'Descartar']).default(''),
  opportunity: z.string().trim().max(4000).default(''),
  personalization: z.string().trim().max(2000).default(''),
  stage: z.enum(['Selecionado', 'Contatado', 'Respondeu', 'Interessado', 'Proposta enviada', 'Fechado', 'Sem interesse', 'NÃ£o contatar']).default('Selecionado'),
  next_action: z.string().trim().max(500).default(''),
  follow_up: z.string().nullable().default(null),
  notes: z.string().trim().max(6000).default(''),
  proposal_value: z.number().min(0).max(100000000).default(0),
  monthly_value: z.number().min(0).max(100000000).default(0),
  archived: z.boolean().default(false),
  interactions: z.array(interactionSchema).default([]),
})

const bodySchema = z.object({
  leads: z.array(leadSchema).max(5000),
})

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const admin = createClient(supabaseUrl, supabaseKey)

  const { data: member } = await admin
    .from('prospecting_members')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!member) throw createError({ statusCode: 403, statusMessage: 'Acesso restrito ao CRM.' })

  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Dados de importaÃ§Ã£o invÃ¡lidos.' })
  }

  const { leads } = parsed.data

  // Idempotent upsert: ON CONFLICT DO NOTHING preserves existing records
  const leadRows = leads.map(({ interactions: _interactions, ...lead }) => ({
    ...lead,
    follow_up: lead.follow_up || null,
  }))

  let importedLeads = 0
  let importedInteractions = 0

  if (leadRows.length > 0) {
    const { error: leadErr, count } = await admin
      .from('prospecting_leads')
      .upsert(leadRows, { onConflict: 'id', ignoreDuplicates: true })
      .select()

    if (leadErr) throw createError({ statusCode: 500, statusMessage: 'Erro ao importar contatos.' })
    importedLeads = count ?? 0
  }

  // Flatten all interactions
  const allInteractions = leads.flatMap(lead =>
    (lead.interactions || []).map(i => ({
      id: i.id,
      lead_id: lead.id,
      date: i.date,
      channel: i.channel,
      stage: i.stage,
      note: i.note,
    }))
  )

  if (allInteractions.length > 0) {
    const { error: intErr, count } = await admin
      .from('prospecting_interactions')
      .upsert(allInteractions, { onConflict: 'id', ignoreDuplicates: true })
      .select()

    if (intErr) throw createError({ statusCode: 500, statusMessage: 'Erro ao importar histÃ³rico.' })
    importedInteractions = count ?? 0
  }

  return {
    imported_leads: importedLeads,
    imported_interactions: importedInteractions,
    total_leads: leads.length,
    total_interactions: allInteractions.length,
  }
})

