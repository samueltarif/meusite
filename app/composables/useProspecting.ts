import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { Prospect, ProspectData, ProspectActivityDraft, ProspectSettings } from '~/types/prospecting'
import { downloadProspecting, downloadOriginalProspecting, readProspectingBackup } from '~/services/prospecting'
import { activitySchema, prospectSchema, settingsSchema } from '~/validation/prospecting'
import { localDay, heat, terminalStage, contactCounted, responseCounted, interestCounted, segmentResults, recordActivity } from '~/utils/prospecting'
import { prospectStages } from '~/constants/prospecting'
import {
  apiLoadLeads, apiCreateLead, apiUpdateLead,
  apiLogInteraction, apiLoadSettings, apiSaveSettings,
} from '~/services/prospecting-api'

export function useProspecting() {
  const data = ref<ProspectData>({ version: 1, leads: [], settings: { target: 30, budget: 0 } })
  const ready = ref(false)
  const blocked = ref(false)
  const error = ref('')
  const notice = ref('')
  const query = ref('')
  const city = ref('')
  const segment = ref('')
  const priority = ref('')
  const stage = ref('')
  const view = ref('Contatos')
  const today = ref(localDay())
  let timer: ReturnType<typeof setInterval> | undefined

  function refresh() { today.value = localDay() }

  onMounted(async () => {
    timer = setInterval(refresh, 60000)
    window.addEventListener('focus', refresh)
    try {
      const [leads, settings] = await Promise.all([apiLoadLeads(), apiLoadSettings()])
      data.value = { version: 1, leads, settings }
    } catch (err: any) {
      blocked.value = true
      error.value = err?.data?.statusMessage || err?.message || 'Não foi possível carregar os dados do servidor.'
    } finally {
      ready.value = true
    }
  })

  onBeforeUnmount(() => {
    clearInterval(timer)
    window.removeEventListener('focus', refresh)
  })

  async function save(lead: Prospect): Promise<boolean> {
    const parsed = prospectSchema.safeParse(lead)
    if (!parsed.success) {
      error.value = parsed.error.issues[0]?.message || 'Revise os campos.'
      return false
    }

    try {
      const existing = data.value.leads.find(item => item.id === parsed.data.id)
      let saved: Prospect

      if (existing) {
        saved = await apiUpdateLead(parsed.data, existing.updatedAt)
        data.value.leads = data.value.leads.map(item => item.id === saved.id ? { ...saved, history: existing.history } : item)
      } else {
        saved = await apiCreateLead(parsed.data)
        data.value.leads = [...data.value.leads, { ...saved, history: [] }]
      }

      error.value = ''
      notice.value = 'Contato salvo e sincronizado.'
      return true
    } catch (err: any) {
      if (err?.status === 409) {
        error.value = 'Este contato foi alterado em outra sessão. Recarregue o painel antes de salvar.'
      } else {
        error.value = err?.data?.statusMessage || err?.message || 'Erro ao salvar. Tente novamente.'
      }
      return false
    }
  }

  async function log(id: string, activity: ProspectActivityDraft): Promise<boolean> {
    const parsed = activitySchema.safeParse(activity)
    const lead = data.value.leads.find(item => item.id === id)

    if (!parsed.success || !lead) {
      error.value = parsed.error?.issues[0]?.message || 'Contato não encontrado.'
      return false
    }
    if (lead.stage === 'Não contatar') {
      error.value = 'Este contato está marcado como Não contatar. Reabra o acompanhamento antes de registrar uma nova abordagem.'
      return false
    }
    if (activity.date > today.value) {
      error.value = 'Registre uma interação já realizada. Use o retorno para planejar uma data futura.'
      return false
    }

    const idempotency_key = crypto.randomUUID()

    try {
      const { lead: updatedLead } = await apiLogInteraction({
        lead_id: id,
        date: parsed.data.date,
        channel: parsed.data.channel,
        stage: parsed.data.stage,
        note: parsed.data.note,
        follow_up: terminalStage(parsed.data.stage) ? null : (parsed.data.followUp || null),
        next_action: terminalStage(parsed.data.stage) ? '' : parsed.data.nextAction,
        idempotency_key,
      })

      // Append interaction to local history using local logic
      const localRecord = recordActivity(lead, activity)
      data.value.leads = data.value.leads.map(item =>
        item.id === id
          ? { ...updatedLead, history: localRecord.history }
          : item
      )

      error.value = ''
      notice.value = 'Interação registrada e sincronizada.'
      return true
    } catch (err: any) {
      error.value = err?.data?.statusMessage || err?.message || 'Erro ao registrar interação.'
      return false
    }
  }

  async function archive(id: string) {
    const lead = data.value.leads.find(item => item.id === id)
    if (lead) await save({ ...lead, archived: !lead.archived })
  }

  async function reopen(id: string) {
    const lead = data.value.leads.find(item => item.id === id)
    if (lead) await save({ ...lead, stage: 'Selecionado', followUp: '', nextAction: '' })
  }

  async function settings(value: ProspectSettings): Promise<boolean> {
    const parsed = settingsSchema.safeParse(value)
    if (!parsed.success) {
      error.value = 'Informe uma meta positiva e um investimento válido.'
      return false
    }
    try {
      const saved = await apiSaveSettings(parsed.data)
      data.value = { ...data.value, settings: saved }
      error.value = ''
      notice.value = 'Meta e investimento atualizados.'
      return true
    } catch (err: any) {
      error.value = err?.data?.statusMessage || err?.message || 'Erro ao salvar configurações.'
      return false
    }
  }

  const active = computed(() => data.value.leads.filter(lead => !lead.archived))
  const due = computed(() => active.value.filter(lead => lead.followUp && lead.followUp <= today.value && !terminalStage(lead.stage)))

  const filtered = computed(() => {
    const normalized = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    const source = view.value === 'Arquivados'
      ? data.value.leads.filter(lead => lead.archived)
      : view.value === 'Retornos'
        ? due.value
        : active.value
    return source.filter(lead =>
      (!query.value || normalized(`${lead.company} ${lead.person} ${lead.city} ${lead.segment}`).includes(normalized(query.value))) &&
      (!city.value || lead.city === city.value) &&
      (!segment.value || lead.segment === segment.value) &&
      (!priority.value || heat(lead) === priority.value) &&
      (!stage.value || lead.stage === stage.value)
    ).sort((a, b) => (a.followUp || '9999').localeCompare(b.followUp || '9999') || b.updatedAt.localeCompare(a.updatedAt))
  })

  const stats = computed(() => ({
    contacted: data.value.leads.filter(contactCounted).length,
    responses: data.value.leads.filter(responseCounted).length,
    interested: data.value.leads.filter(interestCounted).length,
    won: data.value.leads.filter(lead => lead.stage === 'Fechado').length,
    revenue: data.value.leads.filter(lead => lead.stage === 'Fechado').reduce((sum, lead) => sum + lead.proposalValue, 0),
    recurring: data.value.leads.filter(lead => lead.stage === 'Fechado').reduce((sum, lead) => sum + lead.monthlyValue, 0),
  }))

  const results = computed(() => segmentResults(data.value.leads))

  const pendingImport = ref<ProspectData | null>(null)

  async function prepareImport(file: File) {
    try {
      pendingImport.value = await readProspectingBackup(file)
      error.value = ''
    } catch {
      error.value = 'Backup inválido. Use um arquivo JSON exportado por este painel, de até 10 MB.'
    }
  }

  async function importBackup(): Promise<boolean> {
    if (!pendingImport.value) return false
    try {
      const result = await (await import('~/services/prospecting-api')).apiImport(pendingImport.value)
      notice.value = `${result.imported_leads} contatos e ${result.imported_interactions} interações importados para o banco. Registros existentes foram preservados.`
      pendingImport.value = null
      // Reload fresh from server
      const [leads, serverSettings] = await Promise.all([apiLoadLeads(), apiLoadSettings()])
      data.value = { version: 1, leads, settings: serverSettings }
      return true
    } catch (err: any) {
      error.value = err?.data?.statusMessage || err?.message || 'Erro ao importar. Seus dados locais foram preservados.'
      return false
    }
  }

  function exportBackup() {
    try {
      downloadProspecting(data.value)
      notice.value = 'Backup preparado para download.'
    } catch {
      try {
        downloadOriginalProspecting()
      } catch {
        error.value = 'Não foi possível exportar o backup.'
      }
    }
  }

  function clearFilters() {
    query.value = ''
    city.value = ''
    segment.value = ''
    priority.value = ''
    stage.value = ''
  }

  return {
    data, ready, blocked, error, notice,
    query, city, segment, priority, stage, view,
    today, active, due, filtered, stats, results,
    save, log, archive, reopen, settings,
    pendingImport, prepareImport, importBackup, exportBackup,
    clearFilters,
  }
}
