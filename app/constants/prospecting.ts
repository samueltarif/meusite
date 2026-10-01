import type { ProspectStage, ProspectChannel, ProspectContactStatus } from '~/types/prospecting'
export const prospectStages: ProspectStage[] = ['Selecionado', 'Aprovado', 'Contatado', 'Respondeu', 'Interessado', 'Proposta enviada', 'Fechado', 'Sem interesse', 'Não contatar']
export const prospectStageLabels: Record<ProspectStage, string> = { Selecionado: 'Cadastrada', Aprovado: 'Aprovado para contato', Contatado: 'Em contato', Respondeu: 'Respondeu', Interessado: 'Interessado', 'Proposta enviada': 'Proposta enviada', Fechado: 'Fechado', 'Sem interesse': 'Sem interesse', 'Não contatar': 'Não contatar' }
export const prospectChannels: ProspectChannel[] = ['WhatsApp', 'Instagram', 'E-mail', 'Telefone', 'Presencial']
export const prospectContactStatuses: ProspectContactStatus[] = ['Nenhum contato', 'Contato realizado', 'Não atendeu', 'Não respondeu']
export const prospectContactStatusClasses: Record<ProspectContactStatus, string> = {
  'Nenhum contato': 'bg-slate-100 text-slate-700 border-slate-200',
  'Contato realizado': 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'Não atendeu': 'bg-amber-50 text-amber-800 border-amber-200',
  'Não respondeu': 'bg-rose-50 text-rose-800 border-rose-200',
}
export const prospectContactStatusDots: Record<ProspectContactStatus, string> = {
  'Nenhum contato': 'bg-slate-400',
  'Contato realizado': 'bg-emerald-500',
  'Não atendeu': 'bg-amber-500',
  'Não respondeu': 'bg-rose-500',
}
export const prospectSegments = ['Floricultura', 'Marcenaria', 'Marmoraria', 'Serralheria', 'Esquadrias', 'Climatização', 'Clínica', 'Odontologia', 'Oficina', 'Auto elétrica', 'Contabilidade', 'Transportadora', 'Dedetizadora', 'Buffet', 'Indústria', 'Arquitetura', 'Fotografia', 'Beleza', 'Outro']
export const prospectHeatClasses = { Quente: 'bg-orange-50 text-orange-800 border-orange-200', Morno: 'bg-amber-50 text-amber-800 border-amber-200', Revisar: 'bg-slate-100 text-slate-600 border-slate-200', Descartar: 'bg-stone-100 text-stone-600 border-stone-300' }
export const prospectStorageKey = 'avyro-prospecting-v1'
