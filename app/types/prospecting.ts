export type ProspectStage = 'Selecionado' | 'Aprovado' | 'Contatado' | 'Respondeu' | 'Interessado' | 'Proposta enviada' | 'Fechado' | 'Sem interesse' | 'Não contatar'
export type ProspectHeat = 'Quente' | 'Morno' | 'Revisar' | 'Descartar'
export type ProspectChannel = 'WhatsApp' | 'Instagram' | 'E-mail' | 'Telefone' | 'Presencial'
export type ProspectContactStatus = 'Nenhum contato' | 'Contato realizado' | 'Não atendeu' | 'Não respondeu'
export interface ProspectInteraction { id: string; date: string; channel: ProspectChannel; stage: ProspectStage; note: string; time?: string; status?: ProspectContactStatus; createdAt?: string }
export interface Prospect {
  id: string; company: string; person: string; city: string; segment: string; source: string
  maps: string; instagram: string; website: string; phone: string; additionalPhones: string[]; email: string
  websiteStatus: 'Não verificado' | 'Sem site' | 'Só Instagram' | 'Site antigo ou ruim' | 'Site adequado'
  activity: 'Não verificada' | 'Ativo' | 'Aparentemente abandonado'
  goodReviews: boolean; recentPhotos: boolean; professional: boolean; rating: number | null; reviewCount: number | null
  heatOverride: '' | ProspectHeat; opportunity: string; personalization: string; stage: ProspectStage
  nextAction: string; followUp: string; notes: string; proposalValue: number; monthlyValue: number
  archived: boolean; createdAt: string; updatedAt: string; history: ProspectInteraction[]
  contactStatus?: ProspectContactStatus
  contactTime?: string
}
export interface ProspectSettings { target: number; budget: number }
export interface ProspectData { version: 1; leads: Prospect[]; settings: ProspectSettings }
export interface ProspectActivityDraft { date: string; channel: ProspectChannel; stage: ProspectStage; note: string; followUp: string; nextAction: string }
