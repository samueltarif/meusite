import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'
import { randomUUID, timingSafeEqual } from 'node:crypto'
import { createError, getHeader, getRequestIP } from 'h3'
import type { H3Event } from 'h3'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import {
  LEAD_QUANTIDADES,
  LEAD_STATUSES,
  LEAD_TIPOS
} from '../../app/constants/campanha'
import type { CampanhaLead, LeadQuantidade, LeadStatus, LeadTipo, LeadTracking } from '../../app/constants/campanha'

// ---------- Supabase Client ----------
const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
export const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

// ---------- Fallback JSON local ----------
const DATA_FILE = join(process.cwd(), '.data', 'campanha', 'leads.json')
let cache: CampanhaLead[] | null = null
let queue: Promise<unknown> = Promise.resolve()

async function loadJson(): Promise<CampanhaLead[]> {
  if (cache) return cache
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    cache = Array.isArray(parsed) ? parsed : []
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code
    if (code !== 'ENOENT') {
      console.error('[campanha] leads.json ilegível, criando backup', err)
      try { await fs.rename(DATA_FILE, `${DATA_FILE}.corrompido-${Date.now()}`) } catch { /* ignore */ }
    }
    cache = []
  }
  return cache
}

async function persistJson(leads: CampanhaLead[]) {
  await fs.mkdir(dirname(DATA_FILE), { recursive: true })
  const tmp = `${DATA_FILE}.tmp`
  await fs.writeFile(tmp, JSON.stringify(leads, null, 2), 'utf8')
  await fs.rename(tmp, DATA_FILE)
}

function locked<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn)
  queue = run.catch(() => undefined)
  return run
}

function fromDbRow(row: Record<string, any>): CampanhaLead {
  return {
    id: row.id,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
    status: (row.status as LeadStatus) || 'novo',
    name: row.name,
    phone: row.phone,
    tipo: (row.tipo as LeadTipo) || 'janela',
    quantidade: (row.quantidade as LeadQuantidade) || '1-2',
    local: row.local,
    origem: row.origem || 'landing-quiz',
    tracking: (row.tracking as LeadTracking) || {},
    notes: row.notes || '',
    value: row.value !== null && row.value !== undefined ? Number(row.value) : null
  }
}

// ---------- validação ----------
const trackingKey = z.string().trim().max(300).optional()

export const createLeadSchema = z.object({
  name: z.string().trim().min(3).max(100),
  phone: z.string().max(30),
  tipo: z.enum(LEAD_TIPOS),
  quantidade: z.enum(LEAD_QUANTIDADES),
  local: z.string().trim().min(3).max(120),
  origem: z.string().trim().max(60).optional(),
  tracking: z.object({
    gclid: trackingKey,
    gbraid: trackingKey,
    wbraid: trackingKey,
    utm_source: trackingKey,
    utm_medium: trackingKey,
    utm_campaign: trackingKey,
    utm_term: trackingKey,
    utm_content: trackingKey,
    landing: trackingKey
  }).optional(),
  // honeypot: humanos não preenchem
  website: z.string().optional()
})

export const updateLeadSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  notes: z.string().max(4000).optional(),
  value: z.number().min(0).max(1_000_000_000).nullable().optional()
})

export type CreateLeadInput = z.infer<typeof createLeadSchema>
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>

export function normalizeBrPhone(input: string): string | null {
  let digits = input.replace(/\D/g, '')
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) digits = digits.slice(2)
  if (digits.length !== 10 && digits.length !== 11) return null
  if (Number(digits.slice(0, 2)) < 11) return null
  if (digits.length === 11 && digits[2] !== '9') return null
  return `55${digits}`
}

// ---------- controle de acesso e anti-spam ----------
export function assertDashboardAccess(event: H3Event) {
  const key = process.env.CAMPANHA_DASHBOARD_KEY
  if (!key) return
  const sent = Buffer.from(String(getHeader(event, 'x-campanha-key') || ''))
  const expected = Buffer.from(key)
  if (sent.length !== expected.length || !timingSafeEqual(sent, expected)) {
    throw createError({ statusCode: 401, statusMessage: 'Acesso não autorizado' })
  }
}

const hits = new Map<string, number[]>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_HITS = 10

export function assertLeadRateLimit(event: H3Event) {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const now = Date.now()
  for (const [k, list] of hits) {
    const fresh = list.filter(t => now - t < WINDOW_MS)
    if (fresh.length) hits.set(k, fresh); else hits.delete(k)
  }
  const list = hits.get(ip) || []
  if (list.length >= MAX_HITS) {
    throw createError({ statusCode: 429, statusMessage: 'Muitas solicitações. Tente novamente em alguns minutos.' })
  }
  list.push(now)
  hits.set(ip, list)
}

// ---------- operações (Supabase com Fallback JSON) ----------

export async function listLeads(): Promise<CampanhaLead[]> {
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('campanha_gmk_leads')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && Array.isArray(data)) {
        return data.map(fromDbRow)
      }
    } catch (err) {
      console.warn('[campanha] Fallback para arquivo JSON:', err)
    }
  }
  const leads = await loadJson()
  return [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getLead(id: string): Promise<CampanhaLead | null> {
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('campanha_gmk_leads')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (!error && data) {
        return fromDbRow(data)
      }
    } catch { /* fallback */ }
  }
  const leads = await loadJson()
  return leads.find(l => l.id === id) ?? null
}

export async function createLead(input: CreateLeadInput, phone: string): Promise<CampanhaLead> {
  const id = randomUUID()
  const now = new Date().toISOString()
  const cleanTracking = Object.fromEntries(
    Object.entries(input.tracking || {}).filter(([, v]) => typeof v === 'string' && v)
  )

  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('campanha_gmk_leads')
        .insert({
          id,
          name: input.name,
          phone,
          tipo: input.tipo,
          quantidade: input.quantidade,
          local: input.local,
          origem: input.origem || 'landing-quiz',
          tracking: cleanTracking,
          status: 'novo',
          notes: '',
          value: null,
          created_at: now,
          updated_at: now
        })
        .select('*')
        .single()

      if (!error && data) {
        // Grava também no backup local em segundo plano
        locked(async () => {
          const leads = await loadJson()
          leads.push(fromDbRow(data))
          await persistJson(leads)
        }).catch(() => undefined)
        return fromDbRow(data)
      } else {
        console.warn('[campanha] Erro no Supabase (usando fallback JSON):', error?.message)
      }
    } catch (err) {
      console.warn('[campanha] Exceção no Supabase (usando fallback JSON):', err)
    }
  }

  return locked(async () => {
    const leads = await loadJson()
    const lead: CampanhaLead = {
      id,
      createdAt: now,
      updatedAt: now,
      status: 'novo',
      name: input.name,
      phone,
      tipo: input.tipo,
      quantidade: input.quantidade,
      local: input.local,
      origem: input.origem || 'landing-quiz',
      tracking: cleanTracking,
      notes: '',
      value: null
    }
    leads.push(lead)
    await persistJson(leads)
    return lead
  })
}

export async function updateLead(id: string, patch: UpdateLeadInput): Promise<CampanhaLead | null> {
  const now = new Date().toISOString()
  if (supabaseAdmin) {
    try {
      const updateData: Record<string, unknown> = { updated_at: now }
      if (patch.status !== undefined) updateData.status = patch.status
      if (patch.notes !== undefined) updateData.notes = patch.notes
      if (patch.value !== undefined) updateData.value = patch.value

      const { data, error } = await supabaseAdmin
        .from('campanha_gmk_leads')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .maybeSingle()

      if (!error && data) {
        locked(async () => {
          const leads = await loadJson()
          const idx = leads.findIndex(l => l.id === id)
          if (idx !== -1) {
            leads[idx] = fromDbRow(data)
            await persistJson(leads)
          }
        }).catch(() => undefined)
        return fromDbRow(data)
      }
    } catch { /* fallback */ }
  }

  return locked(async () => {
    const leads = await loadJson()
    const lead = leads.find(l => l.id === id)
    if (!lead) return null
    if (patch.status !== undefined) lead.status = patch.status as LeadStatus
    if (patch.notes !== undefined) lead.notes = patch.notes
    if (patch.value !== undefined) lead.value = patch.value
    lead.updatedAt = now
    await persistJson(leads)
    return { ...lead }
  })
}

export async function deleteLead(id: string): Promise<boolean> {
  if (supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from('campanha_gmk_leads')
        .delete()
        .eq('id', id)
      if (!error) {
        locked(async () => {
          const leads = await loadJson()
          const idx = leads.findIndex(l => l.id === id)
          if (idx !== -1) {
            leads.splice(idx, 1)
            await persistJson(leads)
          }
        }).catch(() => undefined)
        return true
      }
    } catch { /* fallback */ }
  }

  return locked(async () => {
    const leads = await loadJson()
    const idx = leads.findIndex(l => l.id === id)
    if (idx === -1) return false
    leads.splice(idx, 1)
    await persistJson(leads)
    return true
  })
}
