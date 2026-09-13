import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser } from '../../../utils/auth'

const bodySchema = z.object({
  id: z.string().uuid().optional(),
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
  website_status: z.enum(['Não verificado', 'Sem site', 'Só Instagram', 'Site antigo ou ruim', 'Site adequado']).default('Não verificado'),
  activity: z.enum(['Não verificada', 'Ativo', 'Aparentemente abandonado']).default('Não verificada'),
  good_reviews: z.boolean().default(false),
  recent_photos: z.boolean().default(false),
  professional: z.boolean().default(false),
  rating: z.number().min(0).max(5).nullable().default(null),
  review_count: z.number().int().min(0).nullable().default(null),
  heat_override: z.enum(['', 'Quente', 'Morno', 'Revisar', 'Descartar']).default(''),
  opportunity: z.string().trim().max(4000).default(''),
  personalization: z.string().trim().max(2000).default(''),
  stage: z.enum(['Selecionado', 'Contatado', 'Respondeu', 'Interessado', 'Proposta enviada', 'Fechado', 'Sem interesse', 'Não contatar']).default('Selecionado'),
  next_action: z.string().trim().max(500).default(''),
  follow_up: z.string().nullable().default(null),
  notes: z.string().trim().max(6000).default(''),
  proposal_value: z.number().min(0).max(100000000).default(0),
  monthly_value: z.number().min(0).max(100000000).default(0),
  archived: z.boolean().default(false),
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

  if (!member) {
    throw createError({ statusCode: 403, statusMessage: 'Acesso restrito ao CRM.' })
  }

  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0]?.message || 'Dados inválidos.',
    })
  }

  const row: Record<string, any> = { ...parsed.data }
  if (!row.id) delete row.id
  // Normalize empty date to null
  if (row.follow_up === '') row.follow_up = null

  const { data, error } = await admin
    .from('prospecting_leads')
    .insert(row)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Erro ao salvar contato.' })
  }

  return { lead: data }
})


