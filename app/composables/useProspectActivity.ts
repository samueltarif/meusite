import { ref, watch } from 'vue'
import type { Prospect, ProspectActivityDraft } from '~/types/prospecting'
import { activitySchema } from '~/validation/prospecting'
import { localDay, addDays, terminalStage } from '~/utils/prospecting'
export function useProspectActivity() {
  const draft = ref<ProspectActivityDraft>({ date: localDay(), channel: 'WhatsApp', stage: 'Contatado', note: '', followUp: '', nextAction: '' })
  const error = ref('')
  function start(lead: Prospect) { draft.value = { date: localDay(), channel: 'WhatsApp', stage: lead.stage === 'Selecionado' ? 'Contatado' : lead.stage, note: '', followUp: terminalStage(lead.stage) ? '' : addDays(localDay(), 2), nextAction: lead.nextAction || 'Retomar a conversa' }; error.value = '' }
  watch(() => draft.value.stage, value => { if (terminalStage(value)) { draft.value.followUp = ''; draft.value.nextAction = '' } })
  function validate(): ProspectActivityDraft | null { const parsed = activitySchema.safeParse(draft.value); error.value = parsed.success ? '' : parsed.error.issues[0]?.message || 'Revise o registro.'; return parsed.success ? parsed.data : null }
  return { draft, error, start, validate }
}
