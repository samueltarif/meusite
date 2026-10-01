<script setup lang="ts">
import { ref, computed } from 'vue'
import QuickActions from './QuickActions.vue'
import type { Prospect, ProspectContactStatus, ProspectChannel } from '~/types/prospecting'
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
      <button type="button" class="mt-2 min-h-11 text-sm font-semibold text-blue-700" @click="$emit('open', lead)">
        Abrir ficha ↗
      </button>
    </div>

    <QuickActions :lead="lead" @log="$emit('log', $event)" @schedule="$emit('schedule', $event)" />
  </article>
</template>
