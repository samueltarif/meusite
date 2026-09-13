import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser } from '../../../utils/auth'

const bodySchema = z.object({
  company: z.string().trim().min(2).max(200).optional(),
  person: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2).max(200).optional(),
  segment: z.string().trim().min(2).max(200).optional(),
  source: z.string().trim().max(200).optional(),
  maps: z.string().trim().max(2000).optional(),
  instagram: z.string().trim().max(2000).optional(),
  website: z.string().trim().max(2000).optional(),
  phone: z.string().trim().max(50).optional(),
  email: z.string().trim().max(254).optional(),
  website_status: z.enum(['Não verificado', 'Sem site', 'Só Instagram', 'Site antigo ou ruim', 'Site adequado']).optional(),
  activity: z.enum(['Não verificada', 'Ativo', 'Aparentemente abandonado']).optional(),
  good_reviews: z.boolean().optional(),
  recent_photos: z.boolean().optional(),
  professional: z.boolean().optional(),
  rating: z.number().min(0).max(5).nullable().optional(),
  review_count: z.number().int().min(0).nullable().optional(),
  heat_override: z.enum(['', 'Quente', 'Morno', 'Revisar', 'Descartar']).optional(),
  opportunity: z.string().trim().max(4000).optional(),
  personalization: z.string().trim().max(2000).optional(),
  stage: z.enum(['Selecionado', 'Contatado', 'Respondeu', 'Interessado', 'Proposta enviada', 'Fechado', 'Sem interesse', 'Não contatar']).optional(),
  next_action: z.string().trim().max(500).optional(),
  follow_up: z.string().nullable().optional(),
  notes: z.string().trim().max(6000).optional(),
  proposal_value: z.number().min(0).max(100000000).optional(),
  monthly_value: z.number().min(0).max(100000000).optional(),
  archived: z.boolean().optional(),
  // Concurrency guard: client sends the updated_at it last saw
  expected_updated_at: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const id = getRouterParam(event, 'id')

  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID da empresa não informado.' })

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
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Dados inválidos.' })
  }

  const { expected_updated_at, ...fields } = parsed.data

  // Concurrency check: if client sent expected_updated_at, verify it matches current
  if (expected_updated_at) {
    const { data: current } = await admin
      .from('prospecting_leads')
      .select('updated_at')
      .eq('id', id)
      .single()

    if (!current) throw createError({ statusCode: 404, statusMessage: 'Contato não encontrado.' })

    const dbTime = new Date(current.updated_at).toISOString()
    const expectedTime = new Date(expected_updated_at).toISOString()

    if (dbTime !== expectedTime) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Este contato foi alterado por outra sessão. Recarregue antes de salvar.',
      })
    }
  }

  // Normalize empty date to null
  const updateData: Record<string, any> = { ...fields }
  if (updateData.follow_up === '') updateData.follow_up = null

  const { data, error } = await admin
    .from('prospecting_leads')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: 'Erro ao atualizar contato.' })

  return { lead: data }
})
