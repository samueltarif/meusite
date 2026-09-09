import type { ProspectStage, ProspectChannel } from '~/types/prospecting'
export const prospectStages: ProspectStage[] = ['Selecionado', 'Contatado', 'Respondeu', 'Interessado', 'Proposta enviada', 'Fechado', 'Sem interesse', 'Não contatar']
export const prospectChannels: ProspectChannel[] = ['WhatsApp', 'Instagram', 'E-mail', 'Telefone', 'Presencial']
export const prospectSegments = ['Floricultura', 'Marcenaria', 'Marmoraria', 'Serralheria', 'Esquadrias', 'Climatização', 'Clínica', 'Odontologia', 'Oficina', 'Auto elétrica', 'Contabilidade', 'Transportadora', 'Dedetizadora', 'Buffet', 'Indústria', 'Arquitetura', 'Fotografia', 'Beleza', 'Outro']
export const prospectHeatClasses = { Quente: 'bg-orange-50 text-orange-800 border-orange-200', Morno: 'bg-amber-50 text-amber-800 border-amber-200', Revisar: 'bg-slate-100 text-slate-600 border-slate-200', Descartar: 'bg-stone-100 text-stone-600 border-stone-300' }
export const prospectStorageKey = 'avyro-prospecting-v1'
