<script setup lang="ts">
import {
  LEAD_STATUSES,
  NEXT_STATUS,
  QUANTIDADE_LABEL,
  STATUS_META,
  TIPO_ICON,
  TIPO_LABEL
} from '~/constants/campanha'
import type { CampanhaLead, LeadStatus } from '~/constants/campanha'

const props = defineProps<{ lead: CampanhaLead; draggable?: boolean }>()

const emit = defineEmits<{
  update: [id: string, patch: { status?: LeadStatus; notes?: string; value?: number | null }]
  remove: [id: string]
  contacted: [lead: CampanhaLead]
  'drag-start': [id: string]
  'drag-end': []
}>()

const root = ref<HTMLElement | null>(null)
const open = ref(false)
const confirmingDelete = ref(false)

const numberText = (v: number | null) => v == null ? '' : v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// Rascunhos locais (não são sobrescritos pelo auto-refresh enquanto você digita)
const notes = ref(props.lead.notes)
const valueText = ref(numberText(props.lead.value))
const notesFocused = ref(false)
const valueFocused = ref(false)
const saved = ref(false)

watch(() => props.lead.notes, (v) => { if (!notesFocused.value) notes.value = v })
watch(() => props.lead.value, (v) => { if (!valueFocused.value) valueText.value = numberText(v) })

const meta = computed(() => STATUS_META[props.lead.status])
const next = computed(() => NEXT_STATUS[props.lead.status])
const waUrl = computed(() => campanhaLeadWhatsAppUrl(props.lead))
const tipoLabel = computed(() => TIPO_LABEL[props.lead.tipo] ?? props.lead.tipo)
const QTD_SHORT: Record<string, string> = { '1-2': '1 a 2 un.', '3-5': '3 a 5 un.', 'mais-5': 'Mais de 5 un.', 'visita': 'Visita p/ medição' }
const quantidadeLabel = computed(() => QTD_SHORT[props.lead.quantidade] ?? QUANTIDADE_LABEL[props.lead.quantidade] ?? props.lead.quantidade)
const viaWhatsApp = computed(() => props.lead.tipo === 'nao-informado')
const hasPhone = computed(() => props.lead.phone.replace(/\D/g, '').length >= 10)
const refCode = computed(() => props.lead.tracking?.ref || '')
const clickOnly = computed(() => !hasPhone.value && !!refCode.value)
const fromAds = computed(() => !!(props.lead.tracking?.gclid || props.lead.tracking?.gbraid || props.lead.tracking?.wbraid))

let flashTimer: ReturnType<typeof setTimeout> | undefined
function flashSaved() {
  saved.value = true
  clearTimeout(flashTimer)
  flashTimer = setTimeout(() => { saved.value = false }, 1600)
}
onBeforeUnmount(() => clearTimeout(flashTimer))

function onStatusChange(event: Event) {
  emit('update', props.lead.id, { status: (event.target as HTMLSelectElement).value as LeadStatus })
}

function saveNotes() {
  notesFocused.value = false
  const clean = notes.value.trim()
  if (clean === props.lead.notes) return
  emit('update', props.lead.id, { notes: clean })
  flashSaved()
}

function saveValue() {
  valueFocused.value = false
  const parsed = campanhaParseBRL(valueText.value)
  valueText.value = numberText(parsed)
  if (parsed === props.lead.value) return
  emit('update', props.lead.id, { value: parsed })
  flashSaved()
}

function onDragStart(event: DragEvent) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', props.lead.id)
    event.dataTransfer.effectAllowed = 'move'
    if (root.value) event.dataTransfer.setDragImage(root.value, 24, 24)
  }
  emit('drag-start', props.lead.id)
}
</script>

<template>
  <article
    ref="root"
    class="rounded-xl border border-l-4 border-[#d7dce4] bg-white shadow-sm"
    :class="meta.accent"
  >
    <!-- Cabeçalho (sempre visível) -->
    <div class="p-3">
      <div class="flex items-start gap-2">
        <span
          v-if="draggable"
          class="-ml-1 mt-0.5 hidden cursor-grab text-slate-400 hover:text-slate-600 active:cursor-grabbing lg:inline-flex"
          draggable="true"
          title="Arraste para mudar de coluna"
          @dragstart="onDragStart"
          @dragend="emit('drag-end')"
        >
          <CampanhaIcon name="drag_indicator" :size="20" />
        </span>

        <button
          type="button"
          class="min-w-0 flex-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"
          :aria-expanded="open"
          @click="open = !open"
        >
          <span class="block break-words text-[15px] font-extrabold leading-tight text-primary">{{ lead.name }}</span>
          <span class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
            <span v-if="hasPhone" class="inline-flex items-center gap-1"><CampanhaIcon name="call" :size="14" /> {{ campanhaDisplayPhone(lead.phone) }}</span>
            <span v-else-if="refCode" class="inline-flex items-center gap-1 font-mono font-bold text-slate-700"><CampanhaIcon name="tag" :size="14" /> Ref: {{ refCode }}</span>
            <span class="inline-flex items-center gap-1" :title="campanhaFormatDate(lead.createdAt)">
              <CampanhaIcon name="schedule" :size="14" /> {{ campanhaFormatDate(lead.createdAt) }} · {{ campanhaTimeAgo(lead.createdAt) }}
            </span>
          </span>
        </button>

        <button
          type="button"
          class="-mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
          :aria-label="open ? 'Recolher detalhes' : 'Ver detalhes'"
          @click="open = !open"
        >
          <CampanhaIcon name="expand_more" :size="22" class="transition-transform" :class="open ? 'rotate-180' : ''" />
        </button>
      </div>

      <!-- Itens solicitados -->
      <div class="mt-2.5 flex flex-wrap gap-1.5 text-xs font-semibold">
        <span v-if="viaWhatsApp" class="inline-flex items-center gap-1 rounded-full bg-[#e7f9ee] px-2.5 py-1 text-emerald-800">
          <CampanhaIcon name="chat" :size="15" /> {{ clickOnly ? 'Clicou no WhatsApp (procure o Ref na conversa)' : 'Chamou pelo botão do WhatsApp' }}
        </span>
        <template v-else>
          <span class="inline-flex items-center gap-1 rounded-full bg-[#e6f2ff] px-2.5 py-1 text-secondary">
            <CampanhaIcon :name="TIPO_ICON[lead.tipo] || 'window'" :size="15" /> {{ tipoLabel }}
          </span>
          <span class="inline-flex items-center gap-1 rounded-full bg-[#e6f2ff] px-2.5 py-1 text-secondary">
            <CampanhaIcon name="tag" :size="15" /> Qtd.: {{ quantidadeLabel }}
          </span>
        </template>
        <span v-if="lead.local" class="inline-flex max-w-full items-center gap-1 rounded-full bg-[#f4f3fb] px-2.5 py-1 text-slate-700">
          <CampanhaIcon name="location_on" :size="15" /> <span class="truncate">Local: {{ lead.local }}</span>
        </span>
        <span v-if="fromAds" class="inline-flex items-center gap-1 rounded-full bg-[#fff4e0] px-2.5 py-1 text-amber-800">
          <CampanhaIcon name="ads_click" :size="15" /> Google Ads
        </span>
        <span v-if="lead.value" class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-800">
          <CampanhaIcon name="payments" :size="15" /> {{ campanhaFormatBRL(lead.value) }}
        </span>
      </div>

      <!-- WhatsApp -->
      <a
        v-if="hasPhone"
        :href="waUrl"
        target="_blank"
        rel="noopener"
        class="mt-3 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-extrabold text-white shadow-sm transition hover:bg-[#1fb957] active:scale-[0.99]"
        @click="emit('contacted', lead)"
      >
        <CampanhaWhatsappIcon :size="20" /> Chamar no WhatsApp
      </a>
    </div>

    <!-- Detalhes (expansível) -->
    <div v-if="open" class="space-y-3 border-t border-[#e9eef5] bg-[#faf8ff] p-3">
      <div>
        <label :for="`st-${lead.id}`" class="mb-1 block text-xs font-bold text-slate-600">Status</label>
        <div class="grid gap-2">
          <select
            :id="`st-${lead.id}`"
            :value="lead.status"
            class="h-11 w-full rounded-lg border border-[#c7c5d0] bg-white px-2 text-sm font-semibold"
            @change="onStatusChange"
          >
            <option v-for="s in LEAD_STATUSES" :key="s" :value="s">{{ STATUS_META[s].emoji }} {{ STATUS_META[s].label }}</option>
          </select>
          <button
            v-if="next"
            type="button"
            class="inline-flex h-11 items-center justify-center gap-1 rounded-lg bg-primary px-3 text-sm font-bold text-white hover:bg-primary-container"
            :title="`Mover para ${STATUS_META[next].label}`"
            @click="emit('update', lead.id, { status: next })"
          >
            Mover para {{ STATUS_META[next].label }} <CampanhaIcon name="arrow_forward" :size="16" />
          </button>
        </div>
      </div>

      <div>
        <label :for="`vl-${lead.id}`" class="mb-1 block text-xs font-bold text-slate-600">Valor negociado</label>
        <div class="flex h-11 items-center rounded-lg border border-[#c7c5d0] bg-white px-3 focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary-container/40">
          <span class="mr-2 text-sm font-bold text-slate-500">R$</span>
          <input
            :id="`vl-${lead.id}`"
            v-model="valueText"
            type="text"
            inputmode="decimal"
            placeholder="0,00"
            class="h-full min-w-0 flex-1 bg-transparent text-base outline-none"
            @focus="valueFocused = true"
            @blur="saveValue"
            @keydown.enter.prevent="($event.target as HTMLInputElement).blur()"
          >
        </div>
      </div>

      <div>
        <label :for="`nt-${lead.id}`" class="mb-1 flex items-center justify-between text-xs font-bold text-slate-600">
          <span>Anotações</span>
          <span v-if="saved" class="inline-flex items-center gap-1 font-semibold text-emerald-600"><CampanhaIcon name="check" :size="14" /> Salvo</span>
        </label>
        <textarea
          :id="`nt-${lead.id}`"
          v-model="notes"
          rows="3"
          maxlength="4000"
          placeholder="Medidas, combinado com o cliente, próximo passo..."
          class="w-full resize-y rounded-lg border border-[#c7c5d0] bg-white px-3 py-2 text-base outline-none focus:border-secondary focus:ring-2 focus:ring-secondary-container/40"
          @focus="notesFocused = true"
          @blur="saveNotes"
        />
      </div>

      <p v-if="refCode" class="rounded-lg bg-white p-2.5 text-xs text-slate-600 ring-1 ring-[#e9eef5]"><strong>Ref (código na mensagem do WhatsApp):</strong> <span class="font-mono font-bold">{{ refCode }}</span></p>

      <div v-if="lead.tracking && (lead.tracking.utm_campaign || lead.tracking.utm_term || fromAds)" class="rounded-lg bg-white p-2.5 text-xs text-slate-600 ring-1 ring-[#e9eef5]">
        <p v-if="lead.tracking.utm_campaign"><strong>Campanha:</strong> {{ lead.tracking.utm_campaign }}</p>
        <p v-if="lead.tracking.utm_term"><strong>Palavra-chave:</strong> {{ lead.tracking.utm_term }}</p>
        <p v-if="lead.tracking.utm_source || lead.tracking.utm_medium"><strong>Origem:</strong> {{ [lead.tracking.utm_source, lead.tracking.utm_medium].filter(Boolean).join(' / ') }}</p>
        <p v-if="fromAds" class="truncate"><strong>GCLID:</strong> {{ lead.tracking.gclid || lead.tracking.gbraid || lead.tracking.wbraid }}</p>
      </div>

      <div class="flex items-center justify-between pt-1">
        <a v-if="hasPhone" :href="`tel:+${lead.phone}`" class="inline-flex items-center gap-1 text-xs font-bold text-secondary"><CampanhaIcon name="call" :size="16" /> Ligar</a>
        <div v-if="!confirmingDelete" :class="hasPhone ? '' : 'ml-auto'">
          <button type="button" class="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600" @click="confirmingDelete = true">
            <CampanhaIcon name="delete" :size="16" /> Excluir lead
          </button>
        </div>
        <div v-else class="flex items-center gap-2 text-xs">
          <span class="font-semibold text-red-700">Excluir de vez?</span>
          <button type="button" class="rounded-md bg-red-600 px-2.5 py-1.5 font-bold text-white" @click="emit('remove', lead.id)">Sim</button>
          <button type="button" class="rounded-md bg-slate-200 px-2.5 py-1.5 font-bold text-slate-700" @click="confirmingDelete = false">Não</button>
        </div>
      </div>
    </div>
  </article>
</template>
