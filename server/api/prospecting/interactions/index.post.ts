import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser } from '../../../utils/auth'

const bodySchema = z.object({
  lead_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Informe a data do contato.'),
  channel: z.enum(['WhatsApp', 'Instagram', 'E-mail', 'Telefone', 'Presencial']),
  stage: z.enum(['Selecionado', 'Contatado', 'Respondeu', 'Interessado', 'Proposta enviada', 'Fechado', 'Sem interesse', 'Não contatar']),
  note: z.string().trim().min(1, 'Descreva o contato.').max(4000),
  // Fields to update on the lead (only if not retroactive)
  follow_up: z.string().nullable().optional(),
  next_action: z.string().trim().max(500).optional(),
  // Idempotency key: client-generated UUID for this interaction
  idempotency_key: z.string().uuid().optional(),
})

const TERMINAL_STAGES = ['Fechado', 'Sem interesse', 'Não contatar']
const STAGE_ORDER = ['Selecionado', 'Contatado', 'Respondeu', 'Interessado', 'Proposta enviada', 'Fechado', 'Sem interesse', 'Não contatar']

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
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Dados inválidos.' })
  }

  const { lead_id, date, channel, stage, note, follow_up, next_action, idempotency_key } = parsed.data

  // Idempotency: check if this exact interaction was already recorded
  if (idempotency_key) {
    const { data: existing } = await admin
      .from('prospecting_interactions')
      .select('id')
      .eq('id', idempotency_key)
      .maybeSingle()

    if (existing) {
      // Already recorded — return success without duplicating
      const { data: lead } = await admin.from('prospecting_leads').select('*').eq('id', lead_id).single()
      return { interaction: existing, lead }
    }
  }

  // Load current lead state
  const { data: lead, error: leadErr } = await admin
    .from('prospecting_leads')
    .select('*')
    .eq('id', lead_id)
    .single()

  if (leadErr || !lead) throw createError({ statusCode: 404, statusMessage: 'Contato não encontrado.' })
  if (lead.stage === 'Não contatar') {
    throw createError({ statusCode: 422, statusMessage: 'Este contato está marcado como Não contatar. Reabra o acompanhamento antes de registrar uma nova abordagem.' })
  }

  // Determine most recent interaction date to check if this is retroactive
  const { data: latestInteractions } = await admin
    .from('prospecting_interactions')
    .select('date')
    .eq('lead_id', lead_id)
    .order('date', { ascending: false })
    .limit(1)

  const latestDate = latestInteractions?.[0]?.date ?? ''
  const isRetroactive = date < latestDate

  // Build lead update: retroactive interactions don't regress stage or follow_up
  const leadUpdate: Record<string, any> = {}
  if (!isRetroactive) {
    const currentStageIdx = STAGE_ORDER.indexOf(lead.stage)
    const newStageIdx = STAGE_ORDER.indexOf(stage)
    // Only advance stage (never regress), unless it's a terminal stage like "Não contatar"
    if (newStageIdx >= currentStageIdx) {
      leadUpdate.stage = stage
    }
    if (TERMINAL_STAGES.includes(stage)) {
      leadUpdate.follow_up = null
      leadUpdate.next_action = ''
    } else {
      if (follow_up !== undefined) leadUpdate.follow_up = follow_up || null
      if (next_action !== undefined) leadUpdate.next_action = next_action
    }
  }

  // Insert interaction + update lead in sequence (atomic as possible within Postgres)
  const interactionId = idempotency_key ?? crypto.randomUUID()

  const { data: interaction, error: intErr } = await admin
    .from('prospecting_interactions')
    .insert({ id: interactionId, lead_id, date, channel, stage, note })
    .select()
    .single()

  if (intErr) throw createError({ statusCode: 500, statusMessage: 'Erro ao registrar interação.' })

  let updatedLead = lead
  if (Object.keys(leadUpdate).length > 0) {
    const { data: newLead, error: updateErr } = await admin
      .from('prospecting_leads')
      .update(leadUpdate)
      .eq('id', lead_id)
      .select()
      .single()

    if (updateErr) throw createError({ statusCode: 500, statusMessage: 'Erro ao atualizar etapa do contato.' })
    updatedLead = newLead
  }

  return { interaction, lead: updatedLead }
})


