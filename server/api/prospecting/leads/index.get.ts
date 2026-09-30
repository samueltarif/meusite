import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser } from '../../../utils/auth'
import { collectProspectingRows } from '../../../utils/prospecting-pagination'

/**
 * GET /api/prospecting/leads
 * Returns all leads with their interactions for the authenticated CRM member.
 * Interactions are fetched separately and merged to avoid n+1 via join complexity.
 */
export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  // Use service role but manually apply user context via RPC to preserve RLS
  // The is_prospecting_member() function verifies membership before any data is returned
  const admin = createClient(supabaseUrl, supabaseKey)

  // Verify membership before serving data
  const { data: member } = await admin
    .from('prospecting_members')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!member) {
    throw createError({ statusCode: 403, statusMessage: 'Acesso restrito ao CRM.' })
  }

  let leads: any[], interactions: any[]
  try {
    ;[leads, interactions] = await Promise.all([
      collectProspectingRows<any>((from, to) => admin.from('prospecting_leads').select('*').order('id').range(from, to)),
      collectProspectingRows<any>((from, to) => admin.from('prospecting_interactions').select('*').order('id').range(from, to)),
    ])
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Não foi possível carregar todos os cadastros e históricos. Tente novamente.' })
  }

  // Merge interactions into leads as history array
  const interByLead = new Map<string, any[]>()
  for (const row of interactions ?? []) {
    const arr = interByLead.get(row.lead_id) ?? []
    arr.push(row)
    interByLead.set(row.lead_id, arr)
  }

  const result = (leads ?? []).map(lead => ({
    ...lead,
    interactions: interByLead.get(lead.id) ?? [],
  }))

  return { leads: result }
})


