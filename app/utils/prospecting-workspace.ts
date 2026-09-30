import type { Prospect } from '~/types/prospecting'
import { localDay, terminalStage } from './prospecting'

export function returnBucket(lead: Prospect, today: string) {
  if (lead.archived || terminalStage(lead.stage)) return ''
  if (!lead.followUp) return 'unscheduled'
  return lead.followUp < today ? 'overdue' : lead.followUp === today ? 'today' : 'upcoming'
}
export function compareProspects(a: Prospect, b: Prospect, sort: string) {
  const byName = () => a.company.localeCompare(b.company, 'pt-BR', { sensitivity: 'base', numeric: true }) || a.id.localeCompare(b.id)
  if (sort === 'name') return byName()
  if (sort === 'name-desc') return -byName()
  if (sort === 'rating' || sort === 'rating-asc') {
    if (a.rating === null && b.rating !== null) return 1
    if (b.rating === null && a.rating !== null) return -1
    return (sort === 'rating' ? (b.rating ?? 0) - (a.rating ?? 0) : (a.rating ?? 0) - (b.rating ?? 0)) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0) || byName()
  }
  if (sort === 'oldest') return a.createdAt.localeCompare(b.createdAt) || byName()
  if (sort === 'updated') return b.updatedAt.localeCompare(a.updatedAt) || byName()
  if (sort === 'followup') return (a.followUp || '9999').localeCompare(b.followUp || '9999') || byName()
  return b.createdAt.localeCompare(a.createdAt) || byName()
}
export function whatsappUrl(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  const number = phone.trim().startsWith('+') ? digits : [10, 11].includes(digits.length) ? `55${digits}` : digits
  return /^\d{10,15}$/.test(number) ? `https://wa.me/${number}` : ''
}
export function prospectPhones(lead: Prospect) {
  return [...new Set([lead.phone, ...(lead.additionalPhones || [])].map(value => value.trim()).filter(Boolean))]
}
export function prospectsInPeriod(leads: Prospect[], from: string, to: string): Prospect[] {
  const inside = (day: string) => (!from || day >= from) && (!to || day <= to)
  if (!from && !to) return leads
  if (from && to && from > to) return []
  return leads.map(lead => ({ ...lead, history: lead.history.filter(item => inside(item.date)) }))
    .filter(lead => inside(localDay(new Date(lead.createdAt))) || lead.history.length > 0)
}
