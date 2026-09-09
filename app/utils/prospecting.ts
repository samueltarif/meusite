import type { Prospect, ProspectHeat, ProspectStage, ProspectActivityDraft } from '~/types/prospecting'
export function localDay(date = new Date()): string { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` }
export function addDays(day: string, count: number): string { const date = new Date(`${day}T12:00:00`); date.setDate(date.getDate() + count); return localDay(date) }
export function heat(lead: Prospect): ProspectHeat {
  if (lead.heatOverride) return lead.heatOverride
  if (lead.activity === 'Aparentemente abandonado') return 'Descartar'
  if (lead.activity === 'Ativo' && lead.professional && ['Sem site', 'Só Instagram'].includes(lead.websiteStatus)) return 'Quente'
  if (lead.websiteStatus === 'Site antigo ou ruim' && lead.activity === 'Ativo') return 'Morno'
  return 'Revisar'
}
export function heatReason(lead: Prospect): string {
  if (lead.heatOverride) return 'Prioridade definida por você.'
  return { Quente: 'Negócio ativo, apresentação profissional e sem site próprio.', Morno: 'Negócio ativo com site antigo ou que precisa melhorar.', Revisar: 'Confira a presença digital e os sinais de atividade antes de priorizar.', Descartar: 'Sinais de abandono: revise antes de investir em uma abordagem.' }[heat(lead)]
}
export const terminalStage = (stage: ProspectStage): boolean => ['Fechado', 'Sem interesse', 'Não contatar'].includes(stage)
export const contactCounted = (lead: Prospect): boolean => lead.history.some(item => item.stage !== 'Selecionado')
export const responseCounted = (lead: Prospect): boolean => lead.history.some(item => ['Respondeu', 'Interessado', 'Proposta enviada', 'Fechado', 'Sem interesse', 'Não contatar'].includes(item.stage))
export const interestCounted = (lead: Prospect): boolean => lead.history.some(item => ['Interessado', 'Proposta enviada', 'Fechado'].includes(item.stage))
export function recordActivity(lead: Prospect, activity: ProspectActivityDraft): Prospect {
  const latestDate = lead.history.reduce((latest, item) => item.date > latest ? item.date : latest, '')
  const history = [...lead.history, { id: crypto.randomUUID(), date: activity.date, channel: activity.channel, stage: activity.stage, note: activity.note }]
  if (activity.date < latestDate) return { ...lead, history }
  return { ...lead, history, stage: activity.stage, followUp: terminalStage(activity.stage) ? '' : activity.followUp, nextAction: terminalStage(activity.stage) ? '' : activity.nextAction }
}
export function newProspect(): Prospect {
  const now = new Date().toISOString()
  return { id: crypto.randomUUID(), company: '', person: '', city: '', segment: '', source: 'Google Maps', maps: '', instagram: '', website: '', phone: '', email: '', websiteStatus: 'Não verificado', activity: 'Não verificada', goodReviews: false, recentPhotos: false, professional: false, rating: null, reviewCount: null, heatOverride: '', opportunity: '', personalization: '', stage: 'Selecionado', nextAction: '', followUp: '', notes: '', proposalValue: 0, monthlyValue: 0, archived: false, createdAt: now, updatedAt: now, history: [] }
}
export function segmentResults(leads: Prospect[]) {
  return [...new Set(leads.map(lead => lead.segment))].map(segment => {
    const items = leads.filter(lead => lead.segment === segment)
    const contacted = items.filter(contactCounted).length
    const responses = items.filter(responseCounted).length
    return { segment, total: items.length, contacted, responses, interested: items.filter(interestCounted).length, won: items.filter(lead => lead.stage === 'Fechado').length, rate: contacted ? Math.round(responses / contacted * 100) : 0 }
  }).sort((a, b) => b.interested - a.interested || b.responses - a.responses)
}
export function draftApproach(lead: Prospect): string {
  const observation = lead.personalization || `Encontrei a ${lead.company} pesquisando empresas de ${lead.city}.`
  const opportunity = lead.opportunity || (['Sem site', 'Só Instagram'].includes(lead.websiteStatus) ? 'Notei uma oportunidade de apresentar seus serviços em um site próprio.' : 'Queria entender se faz sentido conversar sobre a apresentação da empresa na internet.')
  return `Olá${lead.person ? `, ${lead.person}` : ''}! Tudo bem? Meu nome é Samuel, da Avyro. ${observation}\n\n${opportunity}\n\nTrabalho com criação de sites para empresas, com serviços e produtos organizados, localização e contato. Se fizer sentido para vocês, posso mostrar uma ideia de como poderia ficar. Posso te enviar uma referência?`
}
