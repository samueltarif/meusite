import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { Prospect, ProspectData, ProspectActivityDraft, ProspectSettings } from '~/types/prospecting'
import { loadProspecting, persistProspecting, downloadProspecting, downloadOriginalProspecting, readProspectingBackup } from '~/services/prospecting'
import { activitySchema, prospectSchema, settingsSchema } from '~/validation/prospecting'
import { localDay, heat, terminalStage, contactCounted, responseCounted, interestCounted, segmentResults, recordActivity } from '~/utils/prospecting'
import { prospectStorageKey } from '~/constants/prospecting'
export function useProspecting() {
  const data = ref<ProspectData>({ version: 1, leads: [], settings: { target: 30, budget: 0 } })
  const ready = ref(false); const blocked = ref(false); const error = ref(''); const notice = ref('')
  const query = ref(''); const city = ref(''); const segment = ref(''); const priority = ref(''); const stage = ref(''); const view = ref('Contatos')
  const today = ref(localDay()); let timer: ReturnType<typeof setInterval> | undefined
  function refresh() { today.value = localDay() }
  function external(event: StorageEvent) { if (event.key === prospectStorageKey) { try { data.value = loadProspecting(); notice.value = 'Dados atualizados por outra aba.' } catch { blocked.value = true; error.value = 'Não foi possível ler a alteração de outra aba. Os dados foram preservados; reabra o painel antes de editar.' } } }
  onMounted(() => {
    try { data.value = loadProspecting() } catch { blocked.value = true; error.value = 'Não foi possível ler os dados salvos. Eles foram preservados; exporte o arquivo original antes de tentar uma recuperação.' }
    ready.value = true; timer = setInterval(refresh, 60000); window.addEventListener('storage', external); window.addEventListener('focus', refresh)
  })
  onBeforeUnmount(() => { clearInterval(timer); window.removeEventListener('storage', external); window.removeEventListener('focus', refresh) })
  function commit(next: ProspectData): boolean {
    if (!ready.value || blocked.value) return false
    try { persistProspecting(next); data.value = next; error.value = ''; return true } catch { error.value = 'Não foi possível salvar. Verifique o espaço ou as permissões do navegador e exporte um backup dos dados atuais.'; return false }
  }
  function save(lead: Prospect): boolean {
    const parsed = prospectSchema.safeParse(lead)
    if (!parsed.success) { error.value = parsed.error.issues[0]?.message || 'Revise os campos.'; return false }
    const record = { ...parsed.data, updatedAt: new Date().toISOString() }
    const existing = data.value.leads.find(item => item.id === record.id)
    if (existing && existing.updatedAt !== lead.updatedAt) { error.value = 'Este contato mudou em outra aba. Feche e abra novamente antes de editar.'; return false }
    const leads = existing ? data.value.leads.map(item => item.id === record.id ? record : item) : [...data.value.leads, record]
    const ok = commit({ ...data.value, leads }); if (ok) notice.value = 'Contato salvo neste navegador.'; return ok
  }
  function log(id: string, activity: ProspectActivityDraft): boolean {
    const parsed = activitySchema.safeParse(activity); const lead = data.value.leads.find(item => item.id === id)
    if (!parsed.success || !lead) { error.value = parsed.error?.issues[0]?.message || 'Contato não encontrado.'; return false }
    if (lead.stage === 'Não contatar') { error.value = 'Este contato foi marcado como Não contatar. Reabra o acompanhamento antes de registrar uma nova abordagem.'; return false }
    if (activity.date > today.value) { error.value = 'Registre uma interação já realizada. Use o retorno para planejar uma data futura.'; return false }
    const record = recordActivity(lead, activity)
    return save(record)
  }
  function archive(id: string) { const lead = data.value.leads.find(item => item.id === id); if (lead) save({ ...lead, archived: !lead.archived }) }
  function reopen(id: string) { const lead = data.value.leads.find(item => item.id === id); if (lead) save({ ...lead, stage: 'Selecionado', followUp: '', nextAction: '' }) }
  function settings(value: ProspectSettings) { const parsed = settingsSchema.safeParse(value); if (!parsed.success) { error.value = 'Informe uma meta positiva e um investimento válido.'; return false } return commit({ ...data.value, settings: parsed.data }) }
  const active = computed(() => data.value.leads.filter(lead => !lead.archived))
  const due = computed(() => active.value.filter(lead => lead.followUp && lead.followUp <= today.value && !terminalStage(lead.stage)))
  const filtered = computed(() => {
    const normalized = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    const source = view.value === 'Arquivados' ? data.value.leads.filter(lead => lead.archived) : view.value === 'Retornos' ? due.value : active.value
    return source.filter(lead => (!query.value || normalized(`${lead.company} ${lead.person} ${lead.city} ${lead.segment}`).includes(normalized(query.value))) && (!city.value || lead.city === city.value) && (!segment.value || lead.segment === segment.value) && (!priority.value || heat(lead) === priority.value) && (!stage.value || lead.stage === stage.value)).sort((a, b) => (a.followUp || '9999').localeCompare(b.followUp || '9999') || b.updatedAt.localeCompare(a.updatedAt))
  })
  const stats = computed(() => ({ contacted: data.value.leads.filter(contactCounted).length, responses: data.value.leads.filter(responseCounted).length, interested: data.value.leads.filter(interestCounted).length, won: data.value.leads.filter(lead => lead.stage === 'Fechado').length, revenue: data.value.leads.filter(lead => lead.stage === 'Fechado').reduce((sum, lead) => sum + lead.proposalValue, 0), recurring: data.value.leads.filter(lead => lead.stage === 'Fechado').reduce((sum, lead) => sum + lead.monthlyValue, 0) }))
  const results = computed(() => segmentResults(data.value.leads))
  const pendingImport = ref<ProspectData | null>(null)
  async function prepareImport(file: File) { try { pendingImport.value = await readProspectingBackup(file); error.value = '' } catch { error.value = 'Backup inválido. Use um arquivo JSON exportado por este painel, de até 10 MB.' } }
  function importBackup() { if (!pendingImport.value) return; const fresh = pendingImport.value.leads.filter(lead => !data.value.leads.some(item => item.id === lead.id)); if (commit({ ...data.value, settings: data.value.leads.length ? data.value.settings : pendingImport.value.settings, leads: [...data.value.leads, ...fresh] })) { notice.value = `${fresh.length} contatos importados. Registros existentes foram preservados.`; pendingImport.value = null } }
  function exportBackup() { try { if (blocked.value) downloadOriginalProspecting(); else downloadProspecting(data.value); notice.value = 'Backup preparado para download.' } catch { error.value = 'Não foi possível exportar o backup.' } }
  function clearFilters() { query.value = ''; city.value = ''; segment.value = ''; priority.value = ''; stage.value = '' }
  return { data, ready, blocked, error, notice, query, city, segment, priority, stage, view, today, active, due, filtered, stats, results, save, log, archive, reopen, settings, pendingImport, prepareImport, importBackup, exportBackup, clearFilters }
}
