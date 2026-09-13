import { supabase } from '~/composables/useSupabase'
import type { Prospect, ProspectData, ProspectSettings } from '~/types/prospecting'

/**
 * Retrieves the access token from the current Supabase session.
 * Throws if no active session.
 */
async function getToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) throw new Error('Sessão expirada. Faça login novamente.')
  return session.access_token
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` }
}

/** Converts a snake_case lead row from the DB to the camelCase Prospect type. */
export function dbRowToProspect(row: any, interactions: any[] = []): Prospect {
  return {
    id: row.id,
    company: row.company,
    person: row.person ?? '',
    city: row.city,
    segment: row.segment,
    source: row.source ?? 'Google Maps',
    maps: row.maps ?? '',
    instagram: row.instagram ?? '',
    website: row.website ?? '',
    phone: row.phone ?? '',
    email: row.email ?? '',
    websiteStatus: row.website_status,
    activity: row.activity,
    goodReviews: row.good_reviews ?? false,
    recentPhotos: row.recent_photos ?? false,
    professional: row.professional ?? false,
    rating: row.rating ?? null,
    reviewCount: row.review_count ?? null,
    heatOverride: row.heat_override ?? '',
    opportunity: row.opportunity ?? '',
    personalization: row.personalization ?? '',
    stage: row.stage,
    nextAction: row.next_action ?? '',
    followUp: row.follow_up ?? '',
    notes: row.notes ?? '',
    proposalValue: Number(row.proposal_value ?? 0),
    monthlyValue: Number(row.monthly_value ?? 0),
    archived: row.archived ?? false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    history: (interactions).map(i => ({
      id: i.id,
      date: i.date,
      channel: i.channel,
      stage: i.stage,
      note: i.note,
    })),
  }
}

/** Converts a camelCase Prospect to snake_case for the API. */
export function prospectToDbRow(lead: Prospect): Record<string, any> {
  return {
    id: lead.id,
    company: lead.company,
    person: lead.person,
    city: lead.city,
    segment: lead.segment,
    source: lead.source,
    maps: lead.maps,
    instagram: lead.instagram,
    website: lead.website,
    phone: lead.phone,
    email: lead.email,
    website_status: lead.websiteStatus,
    activity: lead.activity,
    good_reviews: lead.goodReviews,
    recent_photos: lead.recentPhotos,
    professional: lead.professional,
    rating: lead.rating,
    review_count: lead.reviewCount,
    heat_override: lead.heatOverride,
    opportunity: lead.opportunity,
    personalization: lead.personalization,
    stage: lead.stage,
    next_action: lead.nextAction,
    follow_up: lead.followUp || null,
    notes: lead.notes,
    proposal_value: lead.proposalValue,
    monthly_value: lead.monthlyValue,
    archived: lead.archived,
  }
}

export async function apiCheckMember(): Promise<boolean> {
  const token = await getToken()
  const { member } = await $fetch<{ member: boolean }>('/api/prospecting/auth', {
    headers: authHeaders(token),
  })
  return member
}

export async function apiLoadLeads(): Promise<Prospect[]> {
  const token = await getToken()
  const { leads } = await $fetch<{ leads: any[] }>('/api/prospecting/leads', {
    headers: authHeaders(token),
  })
  return leads.map(row => dbRowToProspect(row, row.interactions ?? []))
}

export async function apiCreateLead(lead: Prospect): Promise<Prospect> {
  const token = await getToken()
  const { lead: row } = await $fetch<{ lead: any }>('/api/prospecting/leads', {
    method: 'POST',
    headers: authHeaders(token),
    body: prospectToDbRow(lead),
  })
  return dbRowToProspect(row)
}

export async function apiUpdateLead(lead: Prospect, expectedUpdatedAt?: string): Promise<Prospect> {
  const token = await getToken()
  const { lead: row } = await $fetch<{ lead: any }>(`/api/prospecting/leads/${lead.id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: { ...prospectToDbRow(lead), expected_updated_at: expectedUpdatedAt },
  })
  return dbRowToProspect(row)
}

export async function apiLogInteraction(params: {
  lead_id: string
  date: string
  channel: string
  stage: string
  note: string
  follow_up?: string | null
  next_action?: string
  idempotency_key?: string
}): Promise<{ lead: Prospect }> {
  const token = await getToken()
  const { lead } = await $fetch<{ lead: any }>('/api/prospecting/interactions', {
    method: 'POST',
    headers: authHeaders(token),
    body: params,
  })
  return { lead: dbRowToProspect(lead) }
}

export async function apiLoadSettings(): Promise<ProspectSettings> {
  const token = await getToken()
  const { settings } = await $fetch<{ settings: any }>('/api/prospecting/settings', {
    headers: authHeaders(token),
  })
  return { target: settings.target, budget: Number(settings.budget) }
}

export async function apiSaveSettings(settings: ProspectSettings): Promise<ProspectSettings> {
  const token = await getToken()
  const { settings: saved } = await $fetch<{ settings: any }>('/api/prospecting/settings', {
    method: 'PATCH',
    headers: authHeaders(token),
    body: settings,
  })
  return { target: saved.target, budget: Number(saved.budget) }
}

export async function apiImport(data: ProspectData): Promise<{ imported_leads: number; imported_interactions: number }> {
  const token = await getToken()
  const leadsPayload = data.leads.map(lead => ({
    ...prospectToDbRow(lead),
    interactions: lead.history.map(h => ({
      id: h.id,
      lead_id: lead.id,
      date: h.date,
      channel: h.channel,
      stage: h.stage,
      note: h.note,
    })),
  }))
  return $fetch('/api/prospecting/import', {
    method: 'POST',
    headers: authHeaders(token),
    body: { leads: leadsPayload },
  })
}
