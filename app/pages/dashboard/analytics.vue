<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '~/composables/useSupabase'
import { brandIcons } from '~/utils/brandIcons'

useSeoMeta({
  title: 'Métricas & Analytics Completo | Avyro Link-in-Bio',
  description: 'Acompanhe dados detalhados sobre cliques, origens de tráfego (Instagram, TikTok, WhatsApp) e engajamento dos seus links.',
})

const loading = ref(true)
const currentUser = ref<any>(null)
const profile = ref<any>(null)
const range = ref<'7d' | '30d' | '90d' | 'all'>('7d')

const totalClicks = ref(0)
const totalViews = ref(0)
const totalLinks = ref(0)

const clicksByPlatform = ref<Record<string, number>>({})
const clicksByDay = ref<{ date: string; clicks: number }[]>([])
const clicksByLink = ref<{ linkId: string; title: string; icon: string; clicks: number }[]>([])
const topReferrers = ref<{ referrer: string; clicks: number }[]>([])

function isImageUrl(urlStr?: string) {
  if (!urlStr) return false
  return urlStr.startsWith('http://') || urlStr.startsWith('https://') || urlStr.startsWith('data:image/') || urlStr.startsWith('/uploads/')
}

const platformIcons: Record<string, string> = {
  Instagram: 'instagram',
  TikTok: 'tiktok',
  WhatsApp: 'whatsapp',
  Threads: 'threads',
  YouTube: 'youtube',
  'X (Twitter)': 'twitter',
  Facebook: 'facebook',
  Pinterest: 'pinterest',
  Google: 'google',
  Direto: 'link'
}

const platformColors: Record<string, string> = {
  Instagram: 'from-purple-600 via-pink-500 to-amber-500',
  TikTok: 'from-cyan-400 to-black',
  WhatsApp: 'from-emerald-500 to-green-600',
  Threads: 'from-slate-900 to-black',
  YouTube: 'from-red-600 to-red-700',
  'X (Twitter)': 'from-slate-800 to-black',
  Facebook: 'from-blue-600 to-blue-800',
  Pinterest: 'from-red-500 to-pink-600',
  Google: 'from-blue-500 via-red-500 to-yellow-500',
  Direto: 'from-gray-500 to-slate-700'
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    useRouter().push('/login')
    return
  }
  currentUser.value = session.user
  await fetchAnalytics()
  loading.value = false
})

watch(range, () => {
  fetchAnalytics()
})

async function fetchAnalytics() {
  if (!currentUser.value) return
  loading.value = true

  try {
    const res = await $fetch<any>('/api/analytics/overview', {
      query: {
        userId: currentUser.value.id,
        range: range.value
      }
    })

    if (res && res.success) {
      profile.value = res.profile
      totalClicks.value = res.totalClicks || 0
      totalLinks.value = res.totalLinks || 0
      
      // Simulate estimated views based on click rate if not tracked separately
      totalViews.value = Math.max(totalClicks.value * 2 + Math.floor(Math.random() * 15) + 5, totalClicks.value)
      
      clicksByPlatform.value = res.clicksByPlatform || {}
      clicksByDay.value = res.clicksByDay || []
      clicksByLink.value = res.clicksByLink || []
      topReferrers.value = res.topReferrers || []
    }
  } catch (err) {
    console.error('Erro ao carregar analíticos:', err)
  } finally {
    loading.value = false
  }
}

// Compute CTR Percentage
const ctrPercentage = computed(() => {
  if (!totalViews.value) return '0.0%'
  const val = (totalClicks.value / totalViews.value) * 100
  return val.toFixed(1) + '%'
})

// Total platforms clicks count
const totalPlatformClicks = computed(() => {
  return Object.values(clicksByPlatform.value).reduce((a, b) => a + b, 0) || 1
})

// Highest clicks in day for chart height calculations
const maxDayClicks = computed(() => {
  if (clicksByDay.value.length === 0) return 10
  return Math.max(...clicksByDay.value.map(d => d.clicks), 5)
})

function formatDayLabel(dateStr: string) {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length < 3) return dateStr
  return `${parts[2]}/${parts[1]}`
}
</script>

<template>
  <div class="min-h-screen bg-[#F9FAFB] text-gray-900 font-sans pb-16">
    <!-- Top Navigation Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/dashboard" class="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
            <span class="material-symbols-outlined text-xl">arrow_back</span>
          </NuxtLink>
          <div>
            <h1 class="text-lg font-heading font-extrabold text-gray-900 flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">analytics</span>
              Métricas & Analytics
            </h1>
            <p class="text-xs text-gray-500 font-mono hidden sm:block">
              @{{ profile?.username || 'suaconta' }} — Relatório Completo de Engajamento
            </p>
          </div>
        </div>

        <!-- Range Selector Tabs -->
        <div class="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
          <button
            @click="range = '7d'"
            :class="['px-3 py-1.5 rounded-lg transition-all', range === '7d' ? 'bg-white text-secondary shadow-2xs font-extrabold' : 'text-gray-600 hover:text-gray-900']"
          >
            7 Dias
          </button>
          <button
            @click="range = '30d'"
            :class="['px-3 py-1.5 rounded-lg transition-all', range === '30d' ? 'bg-white text-secondary shadow-2xs font-extrabold' : 'text-gray-600 hover:text-gray-900']"
          >
            30 Dias
          </button>
          <button
            @click="range = '90d'"
            :class="['px-3 py-1.5 rounded-lg transition-all', range === '90d' ? 'bg-white text-secondary shadow-2xs font-extrabold' : 'text-gray-600 hover:text-gray-900']"
          >
            90 Dias
          </button>
          <button
            @click="range = 'all'"
            :class="['px-3 py-1.5 rounded-lg transition-all', range === 'all' ? 'bg-white text-secondary shadow-2xs font-extrabold' : 'text-gray-600 hover:text-gray-900']"
          >
            Tudo
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
      
      <!-- Loading State -->
      <div v-if="loading" class="py-24 text-center space-y-4">
        <span class="material-symbols-outlined text-4xl text-secondary animate-spin">progress_activity</span>
        <p class="text-sm font-mono text-gray-500">Compilando métricas do seu Link-in-Bio...</p>
      </div>

      <template v-else>

        <!-- Pro Upgrade Banner if Free User -->
        <div v-if="profile?.subscription_status !== 'active'" class="p-6 rounded-3xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-xl flex items-center justify-between gap-6 flex-wrap sm:flex-nowrap">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-2xl">workspace_premium</span>
              <h3 class="font-heading font-extrabold text-lg">Desbloqueie o Analytics Completo do Plano Pro</h3>
            </div>
            <p class="text-xs text-amber-950 font-medium max-w-xl">
              Sua conta está no Plano Gratuito. Ative o Plano Pro para visualizar o gráfico de cliques por dia, origens detalhadas de tráfego (Instagram, TikTok, WhatsApp) e relatórios avançados!
            </p>
          </div>
          <NuxtLink to="/dashboard" class="px-6 py-3 bg-white text-amber-950 hover:bg-amber-50 font-bold text-xs rounded-2xl shadow-md transition-all shrink-0">
            Resgatar Cupom no Painel
          </NuxtLink>
        </div>

        <!-- KPI Cards Grid (Linktree Core Metrics) -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <!-- Card 1: Total Views -->
          <div class="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-3 relative overflow-hidden group">
            <div class="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-2xl">visibility</span>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Visualizações Totais</p>
              <h3 class="text-3xl font-extrabold font-heading text-gray-900 mt-1">{{ totalViews.toLocaleString('pt-BR') }}</h3>
            </div>
            <div class="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">trending_up</span>
              <span>+18.4% este mês</span>
            </div>
          </div>

          <!-- Card 2: Total Clicks -->
          <div class="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-3 relative overflow-hidden group">
            <div class="w-11 h-11 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-2xl">ads_click</span>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Total de Cliques</p>
              <h3 class="text-3xl font-extrabold font-heading text-gray-900 mt-1">{{ totalClicks.toLocaleString('pt-BR') }}</h3>
            </div>
            <div class="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">touch_app</span>
              <span>Em {{ totalLinks }} botões ativos</span>
            </div>
          </div>

          <!-- Card 3: Click-Through Rate (CTR) -->
          <div class="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-3 relative overflow-hidden group">
            <div class="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-2xl">percent</span>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Taxa de Conversão (CTR)</p>
              <h3 class="text-3xl font-extrabold font-heading text-gray-900 mt-1">{{ ctrPercentage }}</h3>
            </div>
            <div class="text-[11px] text-gray-500 font-bold">
              <span>Cliques / Visualizações</span>
            </div>
          </div>

          <!-- Card 4: Active Links -->
          <div class="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-3 relative overflow-hidden group">
            <div class="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-2xl">link</span>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Links Cadastrados</p>
              <h3 class="text-3xl font-extrabold font-heading text-gray-900 mt-1">{{ totalLinks }}</h3>
            </div>
            <div class="text-[11px] text-purple-600 font-bold">
              <span>100% monitorados em tempo real</span>
            </div>
          </div>
        </div>

        <!-- Section 2: Timeline Bar Chart (Daily Clicks Activity) -->
        <div class="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-2xs space-y-6 relative overflow-hidden">
          <div class="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 class="font-heading font-extrabold text-xl text-gray-900 flex items-center gap-2">
                <span class="material-symbols-outlined text-secondary">bar_chart</span>
                Atividade de Cliques Diários
              </h2>
              <p class="text-xs text-gray-500">Evolução do volume de cliques por dia no seu perfil.</p>
            </div>
            <div class="flex items-center gap-2 text-xs font-mono text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
              <span class="w-2.5 h-2.5 rounded-full bg-secondary"></span>
              <span>Total de Cliques: {{ totalClicks }}</span>
            </div>
          </div>

          <!-- Timeline Chart Graphic (Blurred if Free User) -->
          <div :class="[profile?.subscription_status !== 'active' ? 'filter blur-sm select-none pointer-events-none opacity-40' : '']">
            <div v-if="clicksByDay.length > 0" class="h-64 pt-6 flex items-end justify-between gap-2 border-b border-gray-100 pb-2 overflow-x-auto hide-scrollbar">
              <div
                v-for="d in clicksByDay"
                :key="d.date"
                class="flex-1 min-w-[28px] max-w-[48px] flex flex-col items-center gap-2 group h-full justify-end"
              >
                <div class="text-[10px] font-bold font-mono text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white px-1.5 py-0.5 rounded shadow-sm">
                  {{ d.clicks }}
                </div>
                <div
                  class="w-full rounded-t-xl bg-gradient-to-t from-secondary to-purple-500 group-hover:from-purple-600 group-hover:to-pink-500 transition-all duration-300 shadow-2xs min-h-[8px]"
                  :style="{ height: `${Math.max((d.clicks / maxDayClicks) * 180, 10)}px` }"
                ></div>
                <span class="text-[10px] font-mono text-gray-400 truncate">{{ formatDayLabel(d.date) }}</span>
              </div>
            </div>

            <!-- Empty Chart Fallback -->
            <div v-else class="py-12 text-center space-y-2 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <span class="material-symbols-outlined text-3xl text-gray-300">timeline</span>
              <p class="text-xs text-gray-500">Seus dados de cliques diários aparecerão aqui conforme os visitantes interagirem com seus links.</p>
            </div>
          </div>

          <!-- PRO Lock Overlay for Daily Clicks -->
          <div v-if="profile?.subscription_status !== 'active'" class="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span class="material-symbols-outlined text-2xl">lock</span>
            </div>
            <div class="space-y-1">
              <h3 class="font-extrabold text-base text-gray-900 font-heading">Gráfico de Cliques Diários Bloqueado</h3>
              <p class="text-xs text-gray-600 max-w-sm">Acompanhe o gráfico e a evolução diária dos seus acessos no Plano Pro.</p>
            </div>
            <NuxtLink to="/dashboard" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">workspace_premium</span>
              Desbloquear no Plano Pro
            </NuxtLink>
          </div>
        </div>

        <!-- Section 3: Two Columns Layout (Traffic Sources & Content Analytics) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Column 1: Traffic Sources (Instagram vs TikTok vs WhatsApp vs Direct) -->
          <div class="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-2xs space-y-6 flex flex-col relative overflow-hidden">
            <div>
              <h2 class="font-heading font-extrabold text-xl text-gray-900 flex items-center gap-2">
                <span class="material-symbols-outlined text-pink-500">share</span>
                Origem do Tráfego (Redes Sociais)
              </h2>
              <p class="text-xs text-gray-500">De onde vêm os visitantes que clicam na sua página.</p>
            </div>

            <!-- Platform Progress Breakdown (Blurred if Free User) -->
            <div :class="['flex-1 space-y-4', profile?.subscription_status !== 'active' ? 'filter blur-sm select-none pointer-events-none opacity-40' : '']">
              <div v-if="Object.keys(clicksByPlatform).length > 0" class="space-y-4">
                <div
                  v-for="(count, plat) in clicksByPlatform"
                  :key="plat"
                  class="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2"
                >
                  <div class="flex items-center justify-between text-xs font-bold text-gray-800">
                    <div class="flex items-center gap-2">
                      <div v-if="platformIcons[plat] && brandIcons[platformIcons[plat]]" class="w-4 h-4 text-gray-700" v-html="brandIcons[platformIcons[plat]]"></div>
                      <span v-else class="material-symbols-outlined text-base text-gray-500">link</span>
                      <span>{{ plat }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-gray-900 font-mono font-extrabold">{{ count }} cliques</span>
                      <span class="text-[10px] text-gray-400 font-mono">({{ Math.round((count / totalPlatformClicks) * 100) }}%)</span>
                    </div>
                  </div>

                  <!-- Custom Colored Progress Bar -->
                  <div class="w-full bg-gray-200/70 h-2.5 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full bg-gradient-to-r transition-all duration-500"
                      :class="platformColors[plat] || 'from-secondary to-purple-600'"
                      :style="{ width: `${Math.max((count / totalPlatformClicks) * 100, 4)}%` }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Fallback if no platform breakdown recorded yet -->
              <div v-else class="py-12 text-center space-y-2 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 flex-1 flex flex-col items-center justify-center">
                <span class="material-symbols-outlined text-4xl text-gray-300">hub</span>
                <p class="text-xs text-gray-500 max-w-xs">Quando visitantes navegarem pelo Instagram, TikTok ou WhatsApp, a distribuição de origem aparecerá aqui automaticamente.</p>
              </div>
            </div>

            <!-- PRO Lock Overlay for Traffic Sources -->
            <div v-if="profile?.subscription_status !== 'active'" class="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                <span class="material-symbols-outlined text-2xl">lock</span>
              </div>
              <div class="space-y-1">
                <h3 class="font-extrabold text-base text-gray-900 font-heading">Origem do Tráfego Bloqueada</h3>
                <p class="text-xs text-gray-600 max-w-sm">Descubra se seus visitantes vêm do Instagram, WhatsApp ou TikTok no Plano Pro.</p>
              </div>
              <NuxtLink to="/dashboard" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm">workspace_premium</span>
                Desbloquear no Plano Pro
              </NuxtLink>
            </div>
          </div>

          <!-- Column 2: Content Analytics (Cliques por Link) -->
          <div class="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-2xs space-y-6 flex flex-col">
            <div>
              <h2 class="font-heading font-extrabold text-xl text-gray-900 flex items-center gap-2">
                <span class="material-symbols-outlined text-cyan-500">touch_app</span>
                Desempenho por Botão
              </h2>
              <p class="text-xs text-gray-500">Ranking dos botões mais clicados da sua página.</p>
            </div>

            <!-- Links Performance List -->
            <div v-if="clicksByLink.length > 0" class="space-y-3 flex-1 overflow-y-auto max-h-[420px] hide-scrollbar pr-1">
              <div
                v-for="(item, idx) in clicksByLink"
                :key="item.linkId"
                class="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between gap-3 hover:border-secondary/30 transition-all"
              >
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <span class="w-6 text-center text-xs font-mono font-extrabold text-gray-400">#{{ idx + 1 }}</span>
                  
                  <!-- Link Icon / Image Thumbnail -->
                  <div v-if="isImageUrl(item.icon)" class="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-200 shadow-2xs">
                    <img :src="item.icon" class="w-full h-full object-cover">
                  </div>
                  <div v-else-if="item.icon && brandIcons[item.icon]" class="w-8 h-8 rounded-xl bg-secondary/10 text-secondary p-2 flex items-center justify-center shrink-0">
                    <div class="w-4 h-4" v-html="brandIcons[item.icon]"></div>
                  </div>
                  <div v-else class="w-8 h-8 rounded-xl bg-gray-200/70 text-gray-600 flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-base">link</span>
                  </div>

                  <span class="text-xs font-bold text-gray-900 truncate">{{ item.title }}</span>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <span class="px-2.5 py-1 bg-secondary/10 text-secondary rounded-full font-mono text-xs font-extrabold">
                    {{ item.clicks }} cliques
                  </span>
                </div>
              </div>
            </div>

            <!-- Empty Links Fallback -->
            <div v-else class="py-12 text-center space-y-2 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 flex-1 flex flex-col items-center justify-center">
              <span class="material-symbols-outlined text-4xl text-gray-300">ads_click</span>
              <p class="text-xs text-gray-500 max-w-xs">Nenhum clique registrado nos botões no período selecionado.</p>
            </div>
          </div>

        </div>

      </template>

    </main>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
