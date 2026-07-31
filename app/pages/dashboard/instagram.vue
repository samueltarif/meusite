<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '~/composables/useSupabase'

useSeoMeta({
  title: 'Instagram Auto Reply & Integração | Avyro Dashboard',
  description: 'Conecte sua conta do Instagram, gerencie automações de auto-resposta e acompanhe leads recebidos em tempo real.',
})

interface InstagramAccount {
  id?: string
  instagram_account_id: string
  instagram_username?: string
  connection_status: 'pending' | 'connected' | 'expired' | 'error' | 'disconnected'
  is_active: boolean
  token_expires_at?: string
  created_at?: string
  last_error?: string
}

interface AutoReplyRule {
  id?: string
  trigger_type: 'message' | 'comment'
  keyword: string
  match_type: 'exact' | 'contains'
  response_message: string
  is_active: boolean
  created_at?: string
}

interface WebhookEvent {
  id: string
  instagram_account_id: string
  sender_id: string
  event_type: 'message' | 'comment' | 'unknown'
  message_text: string
  comment_id?: string
  media_id?: string
  processed: boolean
  auto_reply_sent: boolean
  matched_rule_id?: string
  matched_rule?: {
    id: string
    keyword: string
    response_message: string
    trigger_type: string
    match_type: string
  } | null
  human_reply_text?: string
  human_reply_sent?: boolean
  human_reply_status?: 'simulated' | 'sent' | 'error' | string
  human_reply_at?: string
  error_message?: string
  created_at: string
}

const route = useRoute()
const config = useRuntimeConfig()
const oauthEnabled = computed(() => {
  const val = config.public?.instagramOauthEnabled
  return val === true || String(val).toLowerCase() === 'true'
})

const activeTab = ref<'rules' | 'events'>('rules')
const loading = ref(true)
const account = ref<InstagramAccount | null>(null)
const rules = ref<AutoReplyRule[]>([])
const events = ref<WebhookEvent[]>([])
const sessionToken = ref<string>('')

// Modals
const isOAuthInfoModalOpen = ref(false)
const isModalOpen = ref(false)
const isEditing = ref(false)
const editingRuleId = ref<string | null>(null)

// Atendimento Human Agent Modal
const isAtendimentoModalOpen = ref(false)
const selectedLead = ref<WebhookEvent | null>(null)
const humanReplyMessage = ref('')
const submittingHumanReply = ref(false)
const creatingTestLead = ref(false)
const humanReplyNotice = ref<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null)

// Banners & Notifications
const queryAlert = ref<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null)

const form = ref<AutoReplyRule>({
  trigger_type: 'message',
  keyword: '',
  match_type: 'contains',
  response_message: '',
  is_active: true
})

const submitting = ref(false)
const actionError = ref('')
const actionSuccess = ref('')

async function fetchSession() {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    sessionToken.value = session.access_token
  }
}

async function loadAccount() {
  if (!sessionToken.value) await fetchSession()
  try {
    const res = await $fetch<{ success: boolean; account: InstagramAccount }>('/api/instagram/account', {
      headers: { Authorization: `Bearer ${sessionToken.value}` }
    })
    if (res.success) {
      account.value = res.account
    }
  } catch (err: any) {
    console.error('Erro ao carregar conta do Instagram:', err)
  }
}

async function loadRules() {
  if (!sessionToken.value) await fetchSession()
  try {
    const res = await $fetch<{ success: boolean; rules: AutoReplyRule[] }>('/api/instagram/auto-replies', {
      headers: { Authorization: `Bearer ${sessionToken.value}` }
    })
    if (res.success) {
      rules.value = res.rules
    }
  } catch (err: any) {
    console.error('Erro ao carregar regras:', err)
  }
}

async function loadEvents() {
  if (!sessionToken.value) await fetchSession()
  try {
    const res = await $fetch<{ success: boolean; events: WebhookEvent[] }>('/api/instagram/events', {
      headers: { Authorization: `Bearer ${sessionToken.value}` }
    })
    if (res.success) {
      events.value = res.events
    }
  } catch (err: any) {
    console.error('Erro ao carregar eventos:', err)
  }
}

async function loadData() {
  loading.value = true
  await fetchSession()
  await Promise.all([loadAccount(), loadRules(), loadEvents()])
  loading.value = false
}

function handleQueryParams() {
  if (route.query.instagram_connected === 'true') {
    queryAlert.value = { type: 'success', message: 'Conta do Instagram conectada com sucesso via OAuth!' }
  } else if (route.query.instagram_connected === 'pending') {
    queryAlert.value = { type: 'warning', message: 'Código recebido. Sua conta está em modo de teste aguardando aprovação da Meta.' }
  } else if (route.query.instagram_connected === 'error') {
    const reason = (route.query.reason as string) || 'Não foi possível concluir a autorização'
    queryAlert.value = { type: 'error', message: `Erro ao conectar Instagram: ${reason}` }
  } else if (route.query.oauth_disabled === 'true') {
    isOAuthInfoModalOpen.value = true
  }
}

onMounted(() => {
  if (process.dev || process.env.NODE_ENV !== 'production') {
    console.log('[Instagram Dashboard Dev Diagnostics]:', {
      rawOauthConfig: config.public?.instagramOauthEnabled,
      oauthEnabled: oauthEnabled.value
    })
  }
  handleQueryParams()
  loadData()
})

function handleConnectInstagram() {
  if (!oauthEnabled.value) {
    isOAuthInfoModalOpen.value = true
  } else {
    const tokenParam = sessionToken.value ? `?token=${encodeURIComponent(sessionToken.value)}` : ''
    window.location.href = `/api/instagram/connect${tokenParam}`
  }
}

async function handleDisconnectInstagram() {
  if (!confirm('Deseja realmente desconectar sua conta do Instagram? O histórico de eventos será mantido.')) return

  try {
    await $fetch('/api/instagram/disconnect', {
      method: 'POST',
      headers: { Authorization: `Bearer ${sessionToken.value}` }
    })
    await loadAccount()
    queryAlert.value = { type: 'warning', message: 'Conta do Instagram desconectada com sucesso.' }
  } catch (err) {
    alert('Erro ao desconectar conta.')
  }
}

async function handleCreateTestLead() {
  creatingTestLead.value = true
  try {
    const res = await $fetch<{ success: boolean; event: WebhookEvent }>('/api/instagram/test-lead', {
      method: 'POST',
      headers: { Authorization: `Bearer ${sessionToken.value}` }
    })

    if (res.success) {
      queryAlert.value = {
        type: 'success',
        message: 'Lead de teste criado com sucesso! (Gatilho: "preço" | Sender ID: "cliente_teste_instagram")'
      }
      await loadEvents()
      await loadAccount()
    }
  } catch (err: any) {
    queryAlert.value = {
      type: 'error',
      message: err?.data?.statusMessage || err?.message || 'Erro ao gerar lead de teste.'
    }
  } finally {
    creatingTestLead.value = false
  }
}

function openAtendimentoModal(lead: WebhookEvent) {
  selectedLead.value = lead
  humanReplyMessage.value = lead.human_reply_text || 'Olá! Obrigado pelo contato. Temos planos a partir de R$ XX. Posso te enviar mais detalhes e ajudar a escolher a melhor opção.'
  humanReplyNotice.value = null
  isAtendimentoModalOpen.value = true
}

function closeAtendimentoModal() {
  isAtendimentoModalOpen.value = false
  selectedLead.value = null
  humanReplyMessage.value = ''
  humanReplyNotice.value = null
}

async function handleSendHumanReply() {
  if (!selectedLead.value || !humanReplyMessage.value.trim()) return

  submittingHumanReply.value = true
  humanReplyNotice.value = null

  try {
    const res = await $fetch<{
      success: boolean
      status: string
      sent: boolean
      notice: string
      event: WebhookEvent
    }>('/api/instagram/human-reply', {
      method: 'POST',
      headers: { Authorization: `Bearer ${sessionToken.value}` },
      body: {
        event_id: selectedLead.value.id,
        reply_text: humanReplyMessage.value.trim()
      }
    })

    if (res.success) {
      selectedLead.value = {
        ...selectedLead.value,
        ...res.event
      }

      humanReplyNotice.value = {
        type: res.status === 'sent' ? 'success' : 'warning',
        message: res.notice
      }

      await loadEvents()
    }
  } catch (err: any) {
    humanReplyNotice.value = {
      type: 'error',
      message: err?.data?.statusMessage || err?.message || 'Erro ao enviar resposta manual.'
    }
  } finally {
    submittingHumanReply.value = false
  }
}

function openNewModal() {
  isEditing.value = false
  editingRuleId.value = null
  form.value = {
    trigger_type: 'message',
    keyword: '',
    match_type: 'contains',
    response_message: '',
    is_active: true
  }
  actionError.value = ''
  actionSuccess.value = ''
  isModalOpen.value = true
}

function openEditModal(rule: AutoReplyRule) {
  isEditing.value = true
  editingRuleId.value = rule.id || null
  form.value = { ...rule }
  actionError.value = ''
  actionSuccess.value = ''
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

async function handleSaveRule() {
  if (!form.value.keyword.trim() || !form.value.response_message.trim()) {
    actionError.value = 'Preencha a palavra-chave e a mensagem de resposta.'
    return
  }

  submitting.value = true
  actionError.value = ''
  actionSuccess.value = ''

  try {
    if (isEditing.value && editingRuleId.value) {
      await $fetch('/api/instagram/auto-replies', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${sessionToken.value}` },
        body: {
          id: editingRuleId.value,
          ...form.value
        }
      })
      actionSuccess.value = 'Regra atualizada com sucesso!'
    } else {
      await $fetch('/api/instagram/auto-replies', {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionToken.value}` },
        body: form.value
      })
      actionSuccess.value = 'Nova regra criada com sucesso!'
    }

    await loadRules()
    setTimeout(() => {
      closeModal()
    }, 600)
  } catch (err: any) {
    actionError.value = err?.data?.statusMessage || err?.message || 'Erro ao salvar regra.'
  } finally {
    submitting.value = false
  }
}

async function toggleRuleActive(rule: AutoReplyRule) {
  const newStatus = !rule.is_active
  rule.is_active = newStatus

  try {
    await $fetch('/api/instagram/auto-replies', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${sessionToken.value}` },
      body: {
        id: rule.id,
        is_active: newStatus
      }
    })
  } catch (err) {
    rule.is_active = !newStatus
    alert('Erro ao alterar status da regra.')
  }
}

async function deleteRule(id?: string) {
  if (!id) return
  if (!confirm('Deseja realmente excluir esta regra de resposta automática?')) return

  try {
    await $fetch('/api/instagram/auto-replies', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${sessionToken.value}` },
      body: { id }
    })
    await loadRules()
  } catch (err) {
    alert('Erro ao excluir regra.')
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] text-slate-800">
    <!-- Top Header -->
    <header class="bg-[#0d0928] text-white border-b border-purple-900/30 px-6 py-4">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/dashboard" class="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white flex items-center justify-center">
            <span class="material-symbols-outlined text-xl">arrow_back</span>
          </NuxtLink>
          <div>
            <h1 class="font-heading font-extrabold text-xl flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-500 flex items-center justify-center text-xs">
                📷
              </span>
              Instagram Auto Reply & Conexão
            </h1>
            <p class="text-xs text-purple-200/70">Conexão oficial via OAuth, automação de respostas e captura de leads.</p>
          </div>
        </div>

        <button
          @click="loadData"
          class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-all"
        >
          <span class="material-symbols-outlined text-sm">refresh</span>
          Atualizar Dados
        </button>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

      <!-- Dynamic Query Alert Banner -->
      <div
        v-if="queryAlert"
        class="p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-bold"
        :class="{
          'bg-emerald-50 border-emerald-200 text-emerald-800': queryAlert.type === 'success',
          'bg-amber-50 border-amber-200 text-amber-900': queryAlert.type === 'warning',
          'bg-red-50 border-red-200 text-red-800': queryAlert.type === 'error'
        }"
      >
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-lg">
            {{ queryAlert.type === 'success' ? 'check_circle' : (queryAlert.type === 'warning' ? 'info' : 'error') }}
          </span>
          <span>{{ queryAlert.message }}</span>
        </div>
        <button @click="queryAlert = null" class="text-slate-400 hover:text-slate-600">
          <span class="material-symbols-outlined text-base">close</span>
        </button>
      </div>

      <!-- ─── 1. CARD DE STATUS DA CONEXÃO INSTAGRAM ─── -->
      <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-500 p-0.5 shadow-md shadow-purple-500/20 shrink-0">
              <div class="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <span class="text-2xl">📸</span>
              </div>
            </div>

            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <h2 class="font-heading font-extrabold text-lg text-slate-900">
                  {{ account && account.connection_status !== 'disconnected' ? (account.instagram_username ? `@${account.instagram_username}` : 'Conta Conectada') : 'Conecte seu Instagram Profissional' }}
                </h2>

                <!-- Status Badge -->
                <span
                  v-if="account?.connection_status === 'connected'"
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Conectado
                </span>
                <span
                  v-else-if="account?.connection_status === 'pending' || (!account && !oauthEnabled)"
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 flex items-center gap-1"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Aguardando Aprovação da Meta
                </span>
                <span
                  v-else-if="account?.connection_status === 'expired'"
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-800 flex items-center gap-1"
                >
                  Token Expirado
                </span>
                <span
                  v-else
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600 flex items-center gap-1"
                >
                  Não Conectado
                </span>
              </div>

              <p v-if="account && account.instagram_account_id" class="text-xs text-slate-500">
                ID da Conta Meta: <code class="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{{ account.instagram_account_id }}</code>
              </p>
              <p v-else class="text-xs text-slate-500">
                Conecte sua conta Business ou Criador de Conteúdo para responder mensagens e comentários.
              </p>
            </div>
          </div>

          <!-- Connection Action Buttons -->
          <div class="flex items-center gap-2">
            <button
              v-if="!account || account.connection_status === 'disconnected'"
              @click="handleConnectInstagram"
              class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-base">link</span>
              Conectar Instagram
            </button>

            <template v-else>
              <button
                @click="handleConnectInstagram"
                class="px-4 py-2 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <span class="material-symbols-outlined text-base">sync</span>
                Reautenticar
              </button>

              <button
                @click="handleDisconnectInstagram"
                class="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <span class="material-symbols-outlined text-base">link_off</span>
                Desconectar
              </button>
            </template>
          </div>
        </div>

        <!-- Connection Details Info Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase">Modo de Operação</span>
            <p class="font-bold text-slate-800 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full" :class="oauthEnabled ? 'bg-emerald-500' : 'bg-amber-500'"></span>
              {{ oauthEnabled ? 'OAuth 2.0 Oficial Ativo' : 'Modo Teste / Sandbox Meta' }}
            </p>
          </div>

          <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase">Data de Vinculação</span>
            <p class="font-bold text-slate-800 font-mono">
              {{ formatDate(account?.created_at) }}
            </p>
          </div>

          <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase">Validade do Token</span>
            <p class="font-bold text-slate-800 font-mono">
              {{ account?.token_expires_at ? formatDate(account.token_expires_at) : 'Modo Permanente / Long-lived' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-b border-slate-200 gap-2">
        <button
          @click="activeTab = 'rules'"
          class="px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2"
          :class="activeTab === 'rules' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <span class="material-symbols-outlined text-lg">smart_toy</span>
          Regras de Auto Reply ({{ rules.length }})
        </button>
        <button
          @click="activeTab = 'events'"
          class="px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2"
          :class="activeTab === 'events' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <span class="material-symbols-outlined text-lg">forum</span>
          Leads & Eventos Recebidos ({{ events.length }})
        </button>
      </div>

      <!-- TAB 1: RULES MANAGER -->
      <div v-if="activeTab === 'rules'" class="space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="font-heading font-extrabold text-lg text-slate-900">Palavras-Chave Cadastradas</h2>
            <p class="text-xs text-slate-500">Configure respostas automáticas quando seguidores enviarem DMs ou comentarem.</p>
          </div>

          <button
            @click="openNewModal"
            class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5"
          >
            <span class="material-symbols-outlined text-base">add</span>
            Nova Regra
          </button>
        </div>

        <!-- Rules List -->
        <div v-if="loading" class="py-12 text-center text-slate-400 text-xs">
          Carregando regras...
        </div>

        <div v-else-if="rules.length === 0" class="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
          <span class="material-symbols-outlined text-4xl text-slate-300">robot_2</span>
          <h3 class="font-bold text-sm text-slate-700">Nenhuma regra cadastrada ainda</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">Crie sua primeira regra de palavra-chave para responder mensagens automaticamente no Instagram.</p>
          <button
            @click="openNewModal"
            class="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all"
          >
            + Criar Primeira Regra
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="rule in rules"
            :key="rule.id"
            class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-purple-300 transition-all"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span
                    class="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase"
                    :class="rule.trigger_type === 'comment' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'"
                  >
                    {{ rule.trigger_type === 'comment' ? '💬 Comentário' : '📩 Mensagem Direta' }}
                  </span>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 text-slate-600">
                    {{ rule.match_type === 'exact' ? 'Igual' : 'Contém' }}
                  </span>
                </div>
                <h3 class="font-bold text-base text-slate-900 font-mono">
                  "{{ rule.keyword }}"
                </h3>
              </div>

              <!-- Active Toggle -->
              <button
                @click="toggleRuleActive(rule)"
                class="w-12 h-6 rounded-full transition-all relative p-1 shrink-0"
                :class="rule.is_active ? 'bg-emerald-500' : 'bg-slate-300'"
              >
                <div
                  class="w-4 h-4 bg-white rounded-full transition-all shadow-xs"
                  :class="rule.is_active ? 'translate-x-6' : 'translate-x-0'"
                ></div>
              </button>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100 space-y-1">
              <span class="text-[10px] font-bold text-slate-400 block uppercase">Resposta Automática:</span>
              <p class="whitespace-pre-line font-medium">{{ rule.response_message }}</p>
            </div>

            <div class="flex justify-end gap-2 pt-1 border-t border-slate-100">
              <button
                @click="openEditModal(rule)"
                class="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-purple-600 transition-colors flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-sm">edit</span> Editar
              </button>
              <button
                @click="deleteRule(rule.id)"
                class="px-2.5 py-1 text-xs font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-sm">delete</span> Excluir
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: EVENTS / LEADS LISTING -->
      <div v-if="activeTab === 'events'" class="space-y-4">
        <!-- Review Mode Warning Callout (Req 9) -->
        <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 flex items-start gap-3 text-xs shadow-xs">
          <span class="material-symbols-outlined text-lg text-purple-600 shrink-0 mt-0.5">info</span>
          <div class="space-y-1">
            <h4 class="font-extrabold text-purple-900">Modo de Revisão da Meta (App Review & Human Agent)</h4>
            <p class="text-purple-800 font-medium">
              Eventos de teste demonstram o fluxo completo de atendimento enquanto a entrega de DMs reais depende da aprovação/publicação do aplicativo pela Meta.
            </p>
          </div>
        </div>

        <!-- Section Header with Test Lead Generator Button (Req 1) -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="font-heading font-extrabold text-lg text-slate-900">Leads & Eventos Recebidos</h2>
            <p class="text-xs text-slate-500">Acompanhe mensagens recebidas via Webhook e faça atendimentos manuais (Human Agent).</p>
          </div>

          <!-- Create Test Lead Button (Req 1 & 2) -->
          <button
            @click="handleCreateTestLead"
            :disabled="creatingTestLead"
            class="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            <span class="material-symbols-outlined text-base">science</span>
            {{ creatingTestLead ? 'Gerando Lead...' : 'Criar Lead de Teste' }}
          </button>
        </div>

        <div v-if="events.length === 0" class="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
          <span class="material-symbols-outlined text-4xl text-slate-300">inbox</span>
          <h3 class="font-bold text-sm text-slate-700">Nenhum evento registrado ainda</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">Clique no botão "Criar lead de teste" acima para gerar uma interação simulada de revisão.</p>
        </div>

        <div v-else class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-700">
              <thead class="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th class="py-3 px-4">Data / Hora</th>
                  <th class="py-3 px-4">Tipo</th>
                  <th class="py-3 px-4">Remetente (Sender ID)</th>
                  <th class="py-3 px-4">Texto Recebido</th>
                  <th class="py-3 px-4">Auto Reply</th>
                  <th class="py-3 px-4">Atendimento Humano</th>
                  <th class="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="ev in events" :key="ev.id" class="hover:bg-slate-50/80 transition-colors">
                  <td class="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {{ formatDate(ev.created_at) }}
                  </td>

                  <td class="py-3 px-4">
                    <span
                      class="px-2 py-0.5 rounded text-[10px] font-bold"
                      :class="ev.event_type === 'comment' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'"
                    >
                      {{ ev.event_type === 'comment' ? 'Comentário' : 'Mensagem' }}
                    </span>
                  </td>

                  <td class="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                    {{ ev.sender_id }}
                  </td>

                  <td class="py-3 px-4 font-medium text-slate-900 max-w-xs truncate">
                    {{ ev.message_text }}
                  </td>

                  <!-- Column 1: Auto Reply status (Req 7 & 8) -->
                  <td class="py-3 px-4">
                    <span v-if="ev.auto_reply_sent" class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                      ✓ Enviado
                    </span>
                    <span v-else-if="ev.matched_rule_id" class="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]" title="Regra acionada em modo seguro">
                      ⚡ Regra Acionada
                    </span>
                    <span v-else class="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px]">
                      Sem regra
                    </span>
                  </td>

                  <!-- Column 2: Human Agent status -->
                  <td class="py-3 px-4">
                    <span
                      v-if="ev.human_reply_status === 'sent' || ev.human_reply_status === 'simulated' || ev.human_reply_text"
                      class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px] flex items-center gap-1 w-fit"
                      :title="ev.human_reply_status === 'simulated' ? 'Resposta simulada para revisão' : 'Enviado via API oficial'"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Respondido
                    </span>
                    <span
                      v-else-if="ev.human_reply_status === 'error'"
                      class="px-2 py-0.5 bg-red-100 text-red-800 rounded font-bold text-[10px] flex items-center gap-1 w-fit"
                    >
                      Erro Envio
                    </span>
                    <span v-else class="px-2 py-0.5 bg-slate-100 text-slate-400 rounded text-[10px]">
                      Pendente
                    </span>
                  </td>

                  <!-- Action: Open Atendimento Modal (Req 4) -->
                  <td class="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      @click="openAtendimentoModal(ev)"
                      class="px-3 py-1.5 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 font-bold text-xs transition-all flex items-center gap-1 ml-auto"
                    >
                      <span class="material-symbols-outlined text-sm">support_agent</span>
                      Abrir atendimento
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </main>

    <!-- ─── MODAL DE ATENDIMENTO HUMAN AGENT (Req 4, 5 & 6) ─── -->
    <div v-if="isAtendimentoModalOpen && selectedLead" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
              🎧
            </span>
            <div>
              <h3 class="font-heading font-extrabold text-lg text-slate-900">
                Atendimento Human Agent
              </h3>
              <p class="text-xs text-slate-400">Atendimento manual e histórico do lead</p>
            </div>
          </div>
          <button @click="closeAtendimentoModal" class="text-slate-400 hover:text-slate-600 p-1">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <!-- Feedback notice inside modal -->
        <div
          v-if="humanReplyNotice"
          class="p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2"
          :class="{
            'bg-emerald-50 border-emerald-200 text-emerald-800': humanReplyNotice.type === 'success',
            'bg-amber-50 border-amber-200 text-amber-900': humanReplyNotice.type === 'warning',
            'bg-red-50 border-red-200 text-red-800': humanReplyNotice.type === 'error'
          }"
        >
          <span class="material-symbols-outlined text-base">
            {{ humanReplyNotice.type === 'success' ? 'check_circle' : (humanReplyNotice.type === 'warning' ? 'info' : 'error') }}
          </span>
          <span>{{ humanReplyNotice.message }}</span>
        </div>

        <!-- Lead details card (Req 5) -->
        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200/60">
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase">Sender ID (Remetente):</span>
              <p class="font-mono font-bold text-slate-800">{{ selectedLead.sender_id }}</p>
            </div>
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase">Data / Hora:</span>
              <p class="font-mono text-slate-700">{{ formatDate(selectedLead.created_at) }}</p>
            </div>
          </div>

          <!-- Received message text without quotes -->
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Mensagem Recebida do Cliente:</span>
            <div class="p-3 bg-white rounded-xl border border-slate-200 text-slate-900 font-medium whitespace-pre-line">
              {{ selectedLead.message_text }}
            </div>
          </div>

          <!-- Triggered Auto Reply rule if exists (Req 5 & 7) -->
          <div v-if="selectedLead.matched_rule" class="p-3 bg-purple-50/70 border border-purple-200/80 rounded-xl space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 bg-purple-200 text-purple-800 rounded font-bold text-[10px] uppercase">
                🤖 Resposta Automática (Auto Reply)
              </span>
              <span class="text-[11px] font-bold text-purple-900 font-mono">
                Gatilho: "{{ selectedLead.matched_rule.keyword }}"
              </span>
            </div>
            <p class="text-[11px] text-purple-900 whitespace-pre-line font-medium pt-1">
              {{ selectedLead.matched_rule.response_message }}
            </p>
          </div>
        </div>

        <!-- Previous Human Reply record if exists -->
        <div v-if="selectedLead.human_reply_text" class="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-extrabold text-emerald-800 uppercase flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Resposta Manual Anterior (Human Agent)
            </span>
            <span class="text-[10px] font-mono text-emerald-700">
              {{ formatDate(selectedLead.human_reply_at) }}
            </span>
          </div>
          <p class="font-medium text-emerald-950 whitespace-pre-line bg-white p-3 rounded-xl border border-emerald-200/60">
            {{ selectedLead.human_reply_text }}
          </p>
          <div class="flex items-center gap-1 text-[11px] font-bold text-emerald-800 pt-1">
            <span class="material-symbols-outlined text-sm">
              {{ selectedLead.human_reply_status === 'sent' ? 'check_circle' : 'science' }}
            </span>
            <span>
              {{ selectedLead.human_reply_status === 'sent' ? 'Enviado via API oficial do Instagram' : 'Resposta simulada para revisão' }}
            </span>
          </div>
        </div>

        <!-- Human Agent manual reply input box (Req 5 & 6) -->
        <div class="space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <label class="font-bold text-slate-800 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-purple-600 text-base">edit_note</span>
              Enviar Resposta Manual (Human Agent):
            </label>
            <span class="text-[10px] text-slate-400">Atendimento por pessoa real</span>
          </div>

          <textarea
            v-model="humanReplyMessage"
            rows="3"
            placeholder="Digite a resposta manual a ser enviada ao cliente..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-500 font-medium"
          ></textarea>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            @click="closeAtendimentoModal"
            type="button"
            class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all"
          >
            Fechar
          </button>
          <button
            @click="handleSendHumanReply"
            :disabled="submittingHumanReply || !humanReplyMessage.trim()"
            type="button"
            class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            <span class="material-symbols-outlined text-base">send</span>
            {{ submittingHumanReply ? 'Enviando...' : 'Enviar Resposta Manual' }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL DE INFORMAÇÃO OAUTH SAFE / PENDING -->
    <div v-if="isOAuthInfoModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="font-heading font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <span>🛡️</span> Conexão Instagram Login (OAuth 2.0)
          </h3>
          <button @click="isOAuthInfoModalOpen = false" class="text-slate-400 hover:text-slate-600 p-1">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div class="space-y-3 text-xs text-slate-700">
          <p class="font-bold text-slate-900">
            A infraestrutura oficial de conexão via Instagram OAuth 2.0 está 100% implementada no backend.
          </p>
          <p>
            No momento, a flag <code class="bg-slate-100 px-1 py-0.5 rounded font-mono text-purple-700">INSTAGRAM_OAUTH_ENABLED=false</code> está ativa pois o aplicativo na <strong>Meta Developers</strong> (App ID <code class="font-mono bg-slate-100 px-1">4609504682619928</code>) aguarda a conclusão da App Review para as permissões de produção:
          </p>
          <ul class="list-disc list-inside bg-slate-50 p-3 rounded-xl space-y-1 font-mono text-[11px] text-slate-600 border border-slate-100">
            <li>instagram_business_basic</li>
            <li>instagram_business_manage_messages</li>
            <li>instagram_business_manage_comments</li>
          </ul>
          <p class="text-slate-500">
            Enquanto a aprovação final é processada pela equipe da Meta, as regras de auto-resposta e captura de eventos continuam operando normalmente via Webhook.
          </p>
        </div>

        <div class="flex justify-end pt-2 border-t border-slate-100">
          <button
            @click="isOAuthInfoModalOpen = false"
            class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL DE CRIAR / EDITAR REGRA -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="font-heading font-extrabold text-lg text-slate-900">
            {{ isEditing ? 'Editar Regra de Auto Reply' : 'Criar Nova Regra de Auto Reply' }}
          </h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 p-1">
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div v-if="actionError" class="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
          {{ actionError }}
        </div>
        <div v-if="actionSuccess" class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          {{ actionSuccess }}
        </div>

        <div class="space-y-4 text-xs">
          <!-- Tipo de Gatilho -->
          <div class="space-y-1.5">
            <label class="font-bold text-slate-700 block">Tipo de Evento Gatilho:</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                @click="form.trigger_type = 'message'"
                class="py-2.5 px-3 rounded-xl font-bold border transition-all text-center"
                :class="form.trigger_type === 'message' ? 'bg-purple-50 border-purple-600 text-purple-700' : 'border-slate-200 text-slate-600'"
              >
                📩 Mensagem Direta (DM)
              </button>
              <button
                type="button"
                @click="form.trigger_type = 'comment'"
                class="py-2.5 px-3 rounded-xl font-bold border transition-all text-center"
                :class="form.trigger_type === 'comment' ? 'bg-purple-50 border-purple-600 text-purple-700' : 'border-slate-200 text-slate-600'"
              >
                💬 Comentário no Post
              </button>
            </div>
          </div>

          <!-- Palavra-Chave -->
          <div class="space-y-1.5">
            <label class="font-bold text-slate-700 block">Palavra-Chave (Gatilho):</label>
            <input
              v-model="form.keyword"
              type="text"
              placeholder="Ex: preço, valor, link, comprar, orcamento"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:border-purple-500"
            />
            <p class="text-[10px] text-slate-400">Comparado sem diferenciar maiúsculas e minúsculas.</p>
          </div>

          <!-- Tipo de Comparação -->
          <div class="space-y-1.5">
            <label class="font-bold text-slate-700 block">Modo de Comparação:</label>
            <select
              v-model="form.match_type"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="contains">Contém a palavra-chave (Ex: "qual é o preço?")</option>
              <option value="exact">Igual a palavra-chave (Ex: mensagem exatamente igual a "preço")</option>
            </select>
          </div>

          <!-- Mensagem de Resposta -->
          <div class="space-y-1.5">
            <label class="font-bold text-slate-700 block">Mensagem de Resposta Automática:</label>
            <textarea
              v-model="form.response_message"
              rows="4"
              placeholder="Ex: Olá! Acesse nosso site oficial para conferir valores e promoções: https://avyro.com.br"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-500"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end pt-3 border-t border-slate-100">
          <button
            @click="closeModal"
            type="button"
            class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
          <button
            @click="handleSaveRule"
            :disabled="submitting"
            type="button"
            class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            {{ submitting ? 'Salvando...' : (isEditing ? 'Atualizar Regra' : 'Salvar Regra') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
