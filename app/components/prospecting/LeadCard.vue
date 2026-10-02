<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import QuickActions from './QuickActions.vue'
import type { Prospect, ProspectContactStatus, ProspectChannel } from '~/types/prospecting'
import { downloadProspectAnalysis } from '~/services/prospecting-export'
import {
  prospectHeatClasses,
  prospectStageLabels,
  prospectContactStatuses,
  prospectContactStatusClasses,
  prospectContactStatusDots,
  prospectChannels,
} from '~/constants/prospecting'
import {
  heat,
  terminalStage,
  getLeadContactStatus,
  getLeadContactTime,
  formatContactTimeDisplay,
} from '~/utils/prospecting'

const props = defineProps<{
  lead: Prospect
  today: string
  onUpdateStatus?: (params: { leadId: string; status: ProspectContactStatus; time: string; channel?: ProspectChannel; note?: string }) => Promise<boolean>
}>()
const emit = defineEmits<{
  open: [lead: Prospect]
  log: [lead: Prospect]
  schedule: [lead: Prospect]
  updateStatus: [params: { leadId: string; status: ProspectContactStatus; time: string; channel?: ProspectChannel; note?: string }]
}>()

const currentStatus = computed(() => getLeadContactStatus(props.lead))
const contactTimeDisplay = computed(() => formatContactTimeDisplay(props.lead, props.today))
const statusBadgeClass = computed(() => prospectContactStatusClasses[currentStatus.value] || 'bg-slate-100 text-slate-700 border-slate-200')
const statusDotClass = computed(() => prospectContactStatusDots[currentStatus.value] || 'bg-slate-400')

const showSelector = ref(false)
const selectedStatus = ref<ProspectContactStatus>('Contato realizado')
const selectedTime = ref('')
const selectedChannel = ref<ProspectChannel>('WhatsApp')
const selectedNote = ref('')
const timeError = ref('')
const saving = ref(false)

function getNowTime(): string {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function openSelector(target?: ProspectContactStatus) {
  selectedStatus.value = target || (currentStatus.value !== 'Nenhum contato' ? currentStatus.value : 'Contato realizado')
  selectedTime.value = getNowTime()
  selectedChannel.value = selectedStatus.value === 'Não atendeu' ? 'Telefone' : 'WhatsApp'
  selectedNote.value = ''
  timeError.value = ''
  showSelector.value = true
}

function cancelSelector() {
  showSelector.value = false
  timeError.value = ''
}

function setNowTime() {
  selectedTime.value = getNowTime()
  timeError.value = ''
}

async function submitStatusChange() {
  const time = selectedTime.value.trim()
  if (!time) {
    timeError.value = 'O horário é obrigatório para registrar a alteração.'
    return
  }

  saving.value = true
  timeError.value = ''
  try {
    let ok = true
    if (props.onUpdateStatus) {
      ok = await props.onUpdateStatus({
        leadId: props.lead.id,
        status: selectedStatus.value,
        time,
        channel: selectedChannel.value,
        note: selectedNote.value.trim(),
      })
    } else {
      emit('updateStatus', {
        leadId: props.lead.id,
        status: selectedStatus.value,
        time,
        channel: selectedChannel.value,
        note: selectedNote.value.trim(),
      })
    }
    if (ok) {
      showSelector.value = false
    } else {
      timeError.value = 'Não foi possível salvar o status. Tente novamente.'
    }
  } catch (err: any) {
    timeError.value = err?.message || 'Erro ao salvar status.'
  } finally {
    saving.value = false
  }
}

const exporting = ref(false)
const showExportMenu = ref(false)
const exportNotice = ref('')
const exportError = ref('')
const exportMenuRef = ref<HTMLElement | null>(null)

function toggleExportMenu() {
  showExportMenu.value = !showExportMenu.value
  exportNotice.value = ''
  exportError.value = ''
}

function handleGlobalClick(e: MouseEvent) {
  if (showExportMenu.value && exportMenuRef.value && !exportMenuRef.value.contains(e.target as Node)) {
    showExportMenu.value = false
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleGlobalClick)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleGlobalClick)
  }
})

async function handleExport(format: 'json' | 'xlsx') {
  if (exporting.value) return
  exporting.value = true
  showExportMenu.value = false
  exportError.value = ''
  exportNotice.value = ''

  try {
    const input = {
      leads: [props.lead],
      scope: 'company' as const,
    }
    await downloadProspectAnalysis(input, format)
    exportNotice.value = `Exportado (${format === 'json' ? 'JSON' : 'Excel'}) com sucesso!`
    setTimeout(() => {
      exportNotice.value = ''
    }, 4000)
  } catch (err: any) {
    exportError.value = err?.data?.statusMessage || err?.message || 'Erro ao exportar dados.'
  } finally {
    exporting.value = false
  }
}
</script>
<template>
  <article class="group flex w-full min-w-0 flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 motion-reduce:transform-none motion-reduce:transition-none">
    <!-- Top Tags -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <span class="rounded-full px-3 py-1.5 text-xs font-semibold" :class="lead.stage === 'Selecionado' ? 'bg-slate-100 text-slate-700' : lead.stage === 'Aprovado' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'">
        {{ prospectStageLabels[lead.stage] }}
      </span>
      <span class="rounded-full border px-3 py-1 text-xs" :class="prospectHeatClasses[heat(lead)]">
        {{ heat(lead) }}
      </span>
    </div>

    <span v-if="lead.importedAt" class="inline-flex rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-800" :title="'Importado em ' + new Date(lead.importedAt).toLocaleString('pt-BR')">Importado</span>
    <!-- Company name and City -->
    <div class="min-w-0">
      <h3 class="break-words text-xl font-semibold leading-snug">
        <button type="button" class="text-left hover:text-blue-700" @click="$emit('open', lead)">
          {{ lead.company }}
        </button>
      </h3>
      <p class="mt-2 text-sm text-slate-500">{{ lead.segment }} · {{ lead.city }}</p>
    </div>

    <!-- Dono / responsável -->
    <div class="rounded-xl bg-slate-50 p-3">
      <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Dono / responsável</p>
      <p class="mt-1 break-words text-sm">{{ lead.person || 'Dono ainda não identificado' }}</p>
    </div>

    <!-- Status do contato & Horário (no próprio card, visível do lado de fora) -->
    <div class="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 transition-colors hover:border-slate-300">
      <div class="flex items-center justify-between gap-2">
        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Status do contato</p>
        <span class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold" :class="statusBadgeClass">
          <span class="h-2 w-2 rounded-full" :class="statusDotClass" />
          {{ currentStatus }}
        </span>
      </div>

      <!-- Horário do contato - visível do lado de fora -->
      <div class="mt-2.5 flex items-center justify-between gap-2 text-xs">
        <span class="inline-flex items-center gap-1.5 font-medium text-slate-700">
          <svg class="h-4 w-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span :class="currentStatus === 'Nenhum contato' ? 'text-slate-500 italic' : 'text-slate-800 font-semibold'">
            {{ contactTimeDisplay }}
          </span>
        </span>

        <button
          type="button"
          class="min-h-9 px-2 text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline"
          @click="showSelector ? cancelSelector() : openSelector()"
        >
          {{ showSelector ? 'Fechar ✕' : 'Mudar status' }}
        </button>
      </div>

      <!-- Formulário inline no próprio card com horário obrigatório a cada mudança -->
      <div v-if="showSelector" class="mt-3 border-t border-slate-200/80 pt-3 text-xs">
        <div class="grid gap-2.5">
          <label class="block font-medium text-slate-700">
            Novo status:
            <select v-model="selectedStatus" class="mt-1 min-h-10 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-medium text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none">
              <option v-for="st in prospectContactStatuses" :key="st" :value="st">
                {{ st === 'Nenhum contato' ? '⚪' : st === 'Contato realizado' ? '🟢' : st === 'Não atendeu' ? '🟡' : '🔴' }} {{ st }}
              </option>
            </select>
          </label>

          <!-- Horário obrigatório -->
          <label class="block font-medium text-slate-700">
            Horário do contato / mensagem * <span class="text-rose-600 font-semibold">(obrigatório)</span>:
            <div class="mt-1 flex items-center gap-2">
              <input
                v-model="selectedTime"
                type="time"
                required
                class="min-h-10 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none"
                :class="{ 'border-rose-400 ring-1 ring-rose-400': timeError }"
              >
              <button
                type="button"
                class="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
                title="Usar horário atual"
                @click="setNowTime"
              >
                Agora
              </button>
            </div>
          </label>
          <p v-if="timeError" class="text-[11px] font-medium text-rose-600">{{ timeError }}</p>

          <!-- Canal do contato -->
          <label v-if="selectedStatus !== 'Nenhum contato'" class="block font-medium text-slate-700">
            Canal utilizado:
            <select v-model="selectedChannel" class="mt-1 min-h-10 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none">
              <option v-for="ch in prospectChannels" :key="ch" :value="ch">{{ ch }}</option>
            </select>
          </label>

          <label v-if="selectedStatus !== 'Nenhum contato'" class="block font-medium text-slate-700">
            Observação rápida (opcional):
            <input
              v-model="selectedNote"
              maxlength="200"
              placeholder="Ex.: mandou proposta, não atendeu, etc."
              class="mt-1 min-h-10 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none"
            >
          </label>

          <div class="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              class="min-h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 hover:bg-slate-100"
              @click="cancelSelector"
            >
              Cancelar
            </button>
            <button
              type="button"
              :disabled="saving"
              class="min-h-9 rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              @click="submitStatusChange"
            >
              {{ saving ? 'Salvando…' : 'Salvar status' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Website, Next Action, Rating & Open Sheet -->
    <div class="mt-auto border-t border-slate-100 pt-4">
      <p class="text-xs text-slate-500">{{ lead.websiteStatus }}</p>
      <p class="mt-2 text-sm font-medium" :class="lead.followUp && lead.followUp < today && !terminalStage(lead.stage) ? 'text-amber-700' : 'text-slate-700'">
        {{ lead.followUp && !terminalStage(lead.stage) ? `Próxima ação: ${lead.followUp.split('-').reverse().join('/')}` : 'Sem próxima ação agendada' }}
      </p>
      <p class="mt-1 break-words text-sm text-slate-500">
        {{ lead.nextAction || (lead.stage === 'Selecionado' ? 'Pesquisar e avaliar a empresa' : lead.stage === 'Aprovado' ? 'Preparar o primeiro contato' : 'Definir próximo passo') }}
      </p>
      <p class="mt-2 text-xs text-slate-500">Avaliação: {{ lead.rating ?? '—' }} / 5 · {{ lead.reviewCount ?? 0 }} avaliações</p>

      <div class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <button type="button" class="min-h-10 text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline" @click="$emit('open', lead)">
          Abrir ficha ↗
        </button>

        <!-- Botão de exportar dados na frente do card -->
        <div ref="exportMenuRef" class="relative">
          <button
            type="button"
            :disabled="exporting"
            class="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
            :title="`Exportar dados de ${lead.company}`"
            :aria-expanded="showExportMenu"
            aria-haspopup="menu"
            @click.stop="toggleExportMenu"
          >
            <svg class="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{{ exporting ? 'Exportando…' : 'Exportar dados' }}</span>
            <svg class="h-3 w-3 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': showExportMenu }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Menu suspenso para cima -->
          <div
            v-if="showExportMenu"
            class="absolute bottom-full right-0 mb-1.5 z-30 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5"
            role="menu"
          >
            <div class="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Exportar lead
            </div>
            <button
              type="button"
              role="menuitem"
              class="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
              @click.stop="handleExport('xlsx')"
            >
              <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-emerald-100 text-[10px] font-bold text-emerald-700">XLS</span>
              <span>Baixar Excel (.xlsx)</span>
            </button>
            <button
              type="button"
              role="menuitem"
              class="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 transition hover:bg-amber-50 hover:text-amber-800"
              @click.stop="handleExport('json')"
            >
              <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-amber-100 text-[10px] font-bold text-amber-700">{ }</span>
              <span>Baixar JSON completo</span>
            </button>
          </div>
        </div>
      </div>

      <p v-if="exportNotice" class="mt-1 text-right text-[11px] font-medium text-emerald-700">
        {{ exportNotice }}
      </p>
      <p v-if="exportError" class="mt-1 text-right text-[11px] font-medium text-rose-600">
        {{ exportError }}
      </p>
    </div>

    <QuickActions :lead="lead" @log="$emit('log', $event)" @schedule="$emit('schedule', $event)" />
  </article>
</template>
