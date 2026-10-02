import { supabase } from '~/composables/useSupabase'
import { prospectToDbRow } from '~/utils/prospecting-row'
export { prospectToDbRow } from '~/utils/prospecting-row'
import type { ProspectContactStatus, Prospect, ProspectData, ProspectSettings } from '~/types/prospecting'
import { getLeadContactStatus, getLeadContactTime } from '~/utils/prospecting'

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

function normalizeIso(value: any): string {
  if (!value) return new Date().toISOString()
  if (value instanceof Date) return value.toISOString()
  const s = String(value).trim()
  return s.includes(' ') && !s.includes('T') ? s.replace(' ', 'T') : s
}

/** Converts a snake_case lead row from the DB to the camelCase Prospect type. */
export function dbRowToProspect(row: any, interactions: any[] = []): Prospect {
  const lead: Prospect = {
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
    additionalPhones: row.additional_phones ?? [],
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
    createdAt: normalizeIso(row.created_at),
    updatedAt: normalizeIso(row.updated_at),
    contactStatus: (row.contact_status as ProspectContactStatus) || undefined,
    contactTime: row.contact_time || undefined,
    ...(row.imported_at ? { importedAt: normalizeIso(row.imported_at) } : {}),
    history: (interactions).map(i => ({
      id: i.id,
      date: i.date || i.interaction_date,
      channel: i.channel,
      stage: i.stage,
      note: i.note,
      createdAt: i.created_at,
      ...(i.contact_status ? { status: i.contact_status } : {}),
      ...(i.contact_time ? { time: i.contact_time } : {}),
    })),
  }
  lead.contactStatus = (row.contact_status as ProspectContactStatus) || getLeadContactStatus(lead)
  lead.contactTime = row.contact_time || getLeadContactTime(lead)
  return lead
}

/** Converts a camelCase Prospect to snake_case for the API. */

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
  contact_status?: ProspectContactStatus
  contact_time?: string
  idempotency_key?: string
}): Promise<{ lead: Prospect; interaction?: any }> {
  const token = await getToken()
  const { lead, interaction } = await $fetch<{ lead: any; interaction?: any }>('/api/prospecting/interactions', {
    method: 'POST',
    headers: authHeaders(token),
    body: params,
  })
  return { lead: dbRowToProspect(lead, interaction ? [interaction] : []), interaction }
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
  return $fetch('/api/prospecting/import', {
    method: 'POST',
    headers: authHeaders(token),
    body: { leads: data.leads },
  })
}

export async function apiDeleteLead(id: string, expectedUpdatedAt: string): Promise<void> {
  const token = await getToken()
  await $fetch('/api/prospecting/leads/' + id, {
    method: 'DELETE', headers: authHeaders(token),
    body: { expected_updated_at: expectedUpdatedAt },
  })
}
