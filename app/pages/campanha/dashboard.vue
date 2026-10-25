<script setup lang="ts">
import { LEAD_STATUSES, STATUS_META } from '~/constants/campanha'
import type { CampanhaLead, LeadStatus } from '~/constants/campanha'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Leads GMK | Dashboard Comercial',
  robots: 'noindex, nofollow',
  themeColor: '#010133'
})

const LOGO = encodeURI('/imagens campanha gmk/otimizadas/logo-gmk.webp')
const REFRESH_MS = 20_000

const isDesktop = useMediaQuery('(min-width: 1024px)')

const leads = ref<CampanhaLead[]>([])
const loading = ref(true)
const refreshing = ref(false)
const loadError = ref('')
const lastUpdated = ref<Date | null>(null)
const activeTab = ref<LeadStatus>('novo')
const search = ref('')
const toast = ref('')
const draggingId = ref<string | null>(null)
const overStatus = ref<LeadStatus | null>(null)

let inFlight = 0
let toastTimer: ReturnType<typeof setTimeout> | undefined
let pollTimer: ReturnType<typeof setInterval> | undefined

function showToast(message: string) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3500)
}

async function load(silent = false) {
  if (silent && inFlight > 0) return
  if (!silent) refreshing.value = true
  try {
    const res = await $fetch<{ leads: CampanhaLead[] }>('/api/campanha/leads')
    leads.value = res.leads
    loadError.value = ''
    lastUpdated.value = new Date()
  } catch {
    if (!silent) loadError.value = 'Não foi possível carregar os leads. Verifique a conexão e tente de novo.'
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

function onVisibility() {
  if (!document.hidden) load(true)
}

onMounted(async () => {
  await load()
  pollTimer = setInterval(() => { if (!document.hidden) load(true) }, REFRESH_MS)
  document.addEventListener('visibilitychange', onVisibility)
})

onBeforeUnmount(() => {
  clearInterval(pollTimer)
  clearTimeout(toastTimer)
  document.removeEventListener('visibilitychange', onVisibility)
})

/* ----------------------------- ações ----------------------------- */

async function patchLead(id: string, patch: { status?: LeadStatus; notes?: string; value?: number | null }) {
  const index = leads.value.findIndex(l => l.id === id)
  if (index < 0) return
  const before = leads.value[index]!
  leads.value[index] = { ...before, ...patch, updatedAt: new Date().toISOString() }
  inFlight++
  try {
    const res = await $fetch<{ lead: CampanhaLead }>(`/api/campanha/leads/${id}`, {
      method: 'PATCH',
      body: patch
    })
    const i = leads.value.findIndex(l => l.id === id)
    if (i >= 0) leads.value[i] = res.lead
    if (patch.status) showToast(`Movido para ${STATUS_META[patch.status].label}`)
  } catch {
    const i = leads.value.findIndex(l => l.id === id)
    if (i >= 0) leads.value[i] = before
    showToast('Não foi possível salvar. Tente de novo.')
  } finally {
    inFlight--
  }
}

async function removeLead(id: string) {
  const before = leads.value
  leads.value = before.filter(l => l.id !== id)
  inFlight++
  try {
    await $fetch(`/api/campanha/leads/${id}`, { method: 'DELETE' })
    showToast('Lead excluído')
  } catch {
    leads.value = before
    showToast('Não foi possível excluir.')
  } finally {
    inFlight--
  }
}

/** Ao abrir o WhatsApp de um lead novo, ele passa automaticamente para "Em Contato". */
function onContacted(lead: CampanhaLead) {
  if (lead.status === 'novo') patchLead(lead.id, { status: 'contato' })
}

function onDragStart(id: string) { draggingId.value = id }
function onDragEnd() { draggingId.value = null; overStatus.value = null }
function onDrop(status: LeadStatus) {
  const id = draggingId.value
  onDragEnd()
  if (!id) return
  const lead = leads.value.find(l => l.id === id)
  if (lead && lead.status !== status) patchLead(id, { status })
}

/* --------------------------- derivados ---------------------------- */

const filtered = computed(() => {
  const q = campanhaNormalizeText(search.value.trim())
  const digits = search.value.replace(/\D/g, '')
  if (!q) return leads.value
  return leads.value.filter(l =>
    campanhaNormalizeText(`${l.name} ${l.local}`).includes(q)
    || (digits.length >= 3 && l.phone.includes(digits))
    || (q.length >= 4 && (l.tracking?.ref || '').toLowerCase().includes(search.value.trim().toLowerCase()))
  )
})

const byStatus = computed(() => {
  const map = Object.fromEntries(LEAD_STATUSES.map(s => [s, [] as CampanhaLead[]])) as Record<LeadStatus, CampanhaLead[]>
  for (const lead of filtered.value) (map[lead.status] ?? map.novo).push(lead)
  return map
})

const sum = (list: CampanhaLead[]) => list.reduce((acc, l) => acc + (l.value ?? 0), 0)

const kpis = computed(() => {
  const all = leads.value
  const ganhos = all.filter(l => l.status === 'ganho')
  return [
    { label: 'Total de leads', value: String(all.length), icon: 'groups' },
    { label: 'Novos', value: String(all.filter(l => l.status === 'novo').length), icon: 'notifications_active' },
    { label: 'Fechados', value: String(ganhos.length), icon: 'task_alt' },
    { label: 'Valor fechado', value: campanhaFormatBRL(sum(ganhos)), icon: 'payments' }
  ]
})

const updatedLabel = computed(() => lastUpdated.value
  ? lastUpdated.value.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })
  : '')
</script>

<template>
  <div class="min-h-screen bg-[#faf8ff] font-body text-primary antialiased">
    <!-- Topo -->
    <header class="sticky top-0 z-30 bg-primary text-white shadow-md">
      <div class="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-3 sm:px-5">
        <div class="flex min-w-0 items-center gap-2.5">
          <img :src="LOGO" alt="GMK" width="320" height="267" class="h-11 w-auto shrink-0">
          <div class="min-w-0">
            <h1 class="truncate font-heading text-base font-extrabold leading-tight sm:text-lg">Leads · Telas Mosquiteiras</h1>
            <p class="text-[11px] leading-tight text-white/60">
              <template v-if="updatedLabel">Atualizado às {{ updatedLabel }} · atualiza sozinho</template>
              <template v-else>Carregando...</template>
            </p>
          </div>
        </div>
        <button
          type="button"
          class="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-3 text-sm font-bold hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          :disabled="refreshing"
          @click="load()"
        >
          <CampanhaIcon name="refresh" :size="20" :class="refreshing ? 'animate-spin' : ''" />
          <span class="hidden sm:inline">Atualizar</span>
        </button>
      </div>
    </header>

    <main class="mx-auto max-w-[1600px] px-3 py-4 sm:px-5">

        <!-- KPIs -->
        <section class="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4" aria-label="Resumo">
          <div v-for="k in kpis" :key="k.label" class="flex items-center gap-3 rounded-xl border border-[#d7dce4] bg-white p-3">
            <span class="hidden h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#e6f2ff] text-secondary sm:grid"><CampanhaIcon :name="k.icon" :size="22" /></span>
            <div class="min-w-0">
              <p class="truncate text-[11px] font-semibold uppercase tracking-wide text-slate-500">{{ k.label }}</p>
              <p class="font-heading text-lg font-extrabold leading-tight sm:text-xl">{{ k.value }}</p>
            </div>
          </div>
        </section>

        <!-- Busca -->
        <div class="relative mt-3">
          <CampanhaIcon name="search" :size="20" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="search"
            type="search"
            placeholder="Buscar por nome, telefone ou bairro"
            class="h-11 w-full rounded-xl border border-[#d7dce4] bg-white pl-10 pr-3 text-base outline-none focus:border-secondary focus:ring-2 focus:ring-secondary-container/40"
          >
        </div>

        <p v-if="loadError" class="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">
          {{ loadError }} <button type="button" class="font-bold underline" @click="load()">Tentar de novo</button>
        </p>

        <!-- Carregando -->
        <div v-if="loading" class="mt-4 grid gap-3 lg:grid-cols-5">
          <div v-for="n in 3" :key="n" class="h-36 animate-pulse rounded-xl bg-white" />
        </div>

        <!-- DESKTOP: Kanban -->
        <div v-else-if="isDesktop" class="mt-4 flex items-start gap-3 overflow-x-auto pb-6">
          <section
            v-for="s in LEAD_STATUSES"
            :key="s"
            class="flex min-w-[270px] flex-1 flex-col rounded-2xl border p-2 transition"
            :class="[STATUS_META[s].column, overStatus === s && draggingId ? 'ring-4 ring-secondary-container/50' : '']"
            @dragover.prevent="overStatus = s"
            @dragleave="overStatus === s && (overStatus = null)"
            @drop.prevent="onDrop(s)"
          >
            <header class="flex items-center justify-between px-1.5 pb-2 pt-1">
              <h2 class="flex items-center gap-1.5 text-sm font-extrabold">
                <span aria-hidden="true">{{ STATUS_META[s].emoji }}</span> {{ STATUS_META[s].label }}
              </h2>
              <span class="rounded-full px-2 py-0.5 text-xs font-bold" :class="STATUS_META[s].badge">{{ byStatus[s].length }}</span>
            </header>
            <p v-if="sum(byStatus[s]) > 0" class="px-1.5 pb-2 text-xs font-semibold text-slate-600">{{ campanhaFormatBRL(sum(byStatus[s])) }}</p>
            <div class="max-h-[calc(100vh-17rem)] min-h-[120px] space-y-2 overflow-y-auto pr-0.5">
              <CampanhaLeadCard
                v-for="lead in byStatus[s]"
                :key="lead.id"
                :lead="lead"
                draggable
                @update="patchLead"
                @remove="removeLead"
                @contacted="onContacted"
                @drag-start="onDragStart"
                @drag-end="onDragEnd"
              />
              <p v-if="!byStatus[s].length" class="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500">Nenhum lead aqui</p>
            </div>
          </section>
        </div>

        <!-- MOBILE / TABLET: abas -->
        <div v-else class="mt-4">
          <div class="-mx-3 overflow-x-auto px-3 pb-1 sm:-mx-5 sm:px-5" role="tablist" aria-label="Status dos leads">
            <div class="flex w-max gap-2">
              <button
                v-for="s in LEAD_STATUSES"
                :id="`tab-${s}`"
                :key="s"
                type="button"
                role="tab"
                :aria-selected="activeTab === s"
                class="inline-flex h-11 items-center gap-1.5 rounded-xl border-2 px-3 text-sm font-bold transition"
                :class="activeTab === s ? STATUS_META[s].tabActive : 'border-[#d7dce4] bg-white text-slate-600'"
                @click="activeTab = s"
              >
                <span aria-hidden="true">{{ STATUS_META[s].emoji }}</span> {{ STATUS_META[s].short }}
                <span class="rounded-full px-1.5 py-0.5 text-xs" :class="STATUS_META[s].badge">{{ byStatus[s].length }}</span>
              </button>
            </div>
          </div>

          <section class="mt-3 space-y-3" role="tabpanel" :aria-labelledby="`tab-${activeTab}`">
            <h2 class="flex items-center justify-between px-1 text-sm font-extrabold">
              <span>{{ STATUS_META[activeTab].emoji }} {{ STATUS_META[activeTab].label }}</span>
              <span v-if="sum(byStatus[activeTab]) > 0" class="text-xs font-semibold text-slate-600">{{ campanhaFormatBRL(sum(byStatus[activeTab])) }}</span>
            </h2>
            <CampanhaLeadCard
              v-for="lead in byStatus[activeTab]"
              :key="lead.id"
              :lead="lead"
              @update="patchLead"
              @remove="removeLead"
              @contacted="onContacted"
            />
            <p v-if="!byStatus[activeTab].length" class="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
              {{ search ? 'Nenhum lead encontrado nesta aba.' : 'Nenhum lead nesta etapa por enquanto.' }}
            </p>
          </section>
        </div>
    </main>

    <!-- Aviso -->
    <Transition name="gmk-toast">
      <div v-if="toast" class="fixed inset-x-0 bottom-4 z-50 mx-auto w-fit max-w-[90vw] rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-xl" role="status">
        {{ toast }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.gmk-toast-enter-active,
.gmk-toast-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.gmk-toast-enter-from,
.gmk-toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>
