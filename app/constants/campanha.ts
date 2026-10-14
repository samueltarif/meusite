// Constantes e tipos compartilhados da campanha GMK (landing + dashboard + API).

export const LEAD_STATUSES = ['novo', 'contato', 'orcamento', 'ganho', 'perdido'] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const LEAD_TIPOS = ['janela', 'porta-giro', 'porta-balcao', 'casa-inteira', 'nao-informado'] as const
export type LeadTipo = (typeof LEAD_TIPOS)[number]

export const LEAD_QUANTIDADES = ['1-2', '3-5', 'mais-5', 'visita', 'nao-informado'] as const
export type LeadQuantidade = (typeof LEAD_QUANTIDADES)[number]

export const TIPO_LABEL: Record<LeadTipo, string> = {
  'janela': 'Janela',
  'porta-giro': 'Porta de Correr',
  'porta-balcao': 'Telas para Portas',
  'casa-inteira': 'Casa Inteira',
  'nao-informado': 'Não informado'
}

export const QUANTIDADE_LABEL: Record<LeadQuantidade, string> = {
  '1-2': '1 a 2 unidades',
  '3-5': '3 a 5 unidades',
  'mais-5': 'Mais de 5 unidades',
  'visita': 'Quer visita para medição',
  'nao-informado': 'Não informado'
}

/** Visual de cada coluna/status (classes literais para o Tailwind enxergar). */
export const STATUS_META: Record<LeadStatus, {
  label: string
  short: string
  emoji: string
  accent: string
  badge: string
  column: string
  tabActive: string
}> = {
  novo: {
    label: 'Novos Leads', short: 'Novos', emoji: '🟡',
    accent: 'border-l-amber-400', badge: 'bg-amber-100 text-amber-800',
    column: 'border-amber-200 bg-amber-50/60', tabActive: 'border-amber-400 bg-amber-50 text-amber-900'
  },
  contato: {
    label: 'Em Contato', short: 'Contato', emoji: '🔵',
    accent: 'border-l-sky-500', badge: 'bg-sky-100 text-sky-800',
    column: 'border-sky-200 bg-sky-50/60', tabActive: 'border-sky-500 bg-sky-50 text-sky-900'
  },
  orcamento: {
    label: 'Orçamento Enviado', short: 'Orçamento', emoji: '🟣',
    accent: 'border-l-violet-500', badge: 'bg-violet-100 text-violet-800',
    column: 'border-violet-200 bg-violet-50/60', tabActive: 'border-violet-500 bg-violet-50 text-violet-900'
  },
  ganho: {
    label: 'Fechado / Ganho', short: 'Fechado', emoji: '🟢',
    accent: 'border-l-emerald-500', badge: 'bg-emerald-100 text-emerald-800',
    column: 'border-emerald-200 bg-emerald-50/60', tabActive: 'border-emerald-500 bg-emerald-50 text-emerald-900'
  },
  perdido: {
    label: 'Perdido', short: 'Perdido', emoji: '🔴',
    accent: 'border-l-red-500', badge: 'bg-red-100 text-red-800',
    column: 'border-red-200 bg-red-50/60', tabActive: 'border-red-500 bg-red-50 text-red-900'
  }
}

/** Próximo status no funil (botão "Avançar"). */
export const NEXT_STATUS: Partial<Record<LeadStatus, LeadStatus>> = {
  novo: 'contato',
  contato: 'orcamento',
  orcamento: 'ganho'
}

export const TIPO_ICON: Record<LeadTipo, string> = {
  'janela': 'window',
  'porta-giro': 'door_front',
  'porta-balcao': 'balcony',
  'casa-inteira': 'home',
  'nao-informado': 'chat'
}

export interface LeadTracking {
  gclid?: string
  gbraid?: string
  wbraid?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  landing?: string
}

export interface CampanhaLead {
  id: string
  createdAt: string
  updatedAt: string
  status: LeadStatus
  name: string
  /** Telefone só com dígitos, já com DDI 55 (pronto para wa.me). */
  phone: string
  tipo: LeadTipo
  quantidade: LeadQuantidade
  local: string
  origem: string
  tracking: LeadTracking
  notes: string
  /** Valor negociado em reais. */
  value: number | null
}
