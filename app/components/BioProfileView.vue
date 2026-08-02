<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '~/composables/useSupabase'
import { brandIcons } from '~/utils/brandIcons'

const route = useRoute()
const rawParam = (route.params.username as string) || ''
const cleanUsername = rawParam.replace(/[@\s]/g, '').replace(/\/$/, '').trim().toLowerCase()

interface Profile {
  id: string
  username: string
  secondary_username?: string
  display_name: string
  bio_description: string
  avatar_url: string
  bg_color: string
  bg_image_url: string
  bg_style: string
  bg_blur?: boolean | number
  bg_blur_amount?: number
  text_color: string
  btn_bg_color: string
  btn_text_color: string
  btn_border: string
  roundness: string
  font_class: string
  socials: string[]
}

interface LinkItem {
  id: string
  title: string
  url: string
  icon: string
  clicks_count: number
}

// Fetch profile & links on SSR + Client
const { data: pageData, pending: loading } = await useAsyncData(`bio-${cleanUsername}`, async () => {
  if (!cleanUsername) return null

  // 1. Fetch profile (match by primary username or secondary username)
  let profileData: any = null
  let profErr: any = null

  try {
    const res = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.${cleanUsername},secondary_username.ilike.${cleanUsername}`)
      .maybeSingle()
    profileData = res.data
    profErr = res.error
  } catch (e) {
    // Fallback if secondary_username column is missing in DB schema
    const res = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', cleanUsername)
      .maybeSingle()
    profileData = res.data
    profErr = res.error
  }

  if (profErr || !profileData) {
    // Retry direct fallback by username
    const { data: fallbackData } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', cleanUsername)
      .maybeSingle()

    if (!fallbackData) return null
    profileData = fallbackData
  }

  // 2. Fetch active links
  const { data: linksData } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profileData.id)
    .eq('is_active', true)
    .order('position', { ascending: true })

  return {
    profile: profileData as Profile,
    links: (linksData || []) as LinkItem[],
  }
})

const profile = computed(() => pageData.value?.profile || null)
const links = computed(() => pageData.value?.links || [])
const notFound = computed(() => !loading.value && !profile.value)

const blurAmount = computed(() => {
  if (!profile.value) return 0
  const p = profile.value
  if (typeof p.bg_blur_amount === 'number') return p.bg_blur_amount
  if (typeof p.bg_blur === 'number') return p.bg_blur
  if (p.bg_blur === true || (p.bg_blur as any) === 'true') return 16
  return 0
})

if (profile.value) {
  useSeoMeta({
    title: `${profile.value.display_name || profile.value.username} | Link-in-Bio`,
    description: profile.value.bio_description || `Confira todos os links oficiais de ${profile.value.display_name}`,
  })
}

function detectClickPlatform(): string {
  if (import.meta.server) return 'Direto'
  
  const savedSource = sessionStorage.getItem('avyro_traffic_source')
  if (savedSource && savedSource !== 'Direto' && savedSource !== 'Site Web') return savedSource

  const referrer = (document.referrer || '').toLowerCase()
  const userAgent = (navigator.userAgent || '').toLowerCase()
  const searchStr = (window.location.search || '').toLowerCase()

  // 1. WhatsApp
  if (
    searchStr.includes('whatsapp') ||
    searchStr.includes('utm_source=wa') ||
    searchStr.includes('wa.me') ||
    referrer.includes('whatsapp') ||
    referrer.includes('wa.me') ||
    referrer.includes('wl.co') ||
    referrer.includes('com.whatsapp') ||
    userAgent.includes('whatsapp')
  ) {
    return 'WhatsApp'
  }

  // 2. Instagram
  if (
    searchStr.includes('utm_source=instagram') ||
    searchStr.includes('utm_source=insta') ||
    searchStr.includes('igshid') ||
    referrer.includes('instagram') ||
    referrer.includes('com.instagram') ||
    userAgent.includes('instagram')
  ) {
    return 'Instagram'
  }

  // 3. Threads
  if (
    searchStr.includes('threads') ||
    referrer.includes('threads') ||
    referrer.includes('barcelona') ||
    userAgent.includes('threads') ||
    userAgent.includes('barcelona')
  ) {
    return 'Threads'
  }

  // 4. TikTok
  if (
    searchStr.includes('ttclid') ||
    searchStr.includes('tiktok') ||
    referrer.includes('tiktok') ||
    referrer.includes('musically') ||
    referrer.includes('zhiliaoapp') ||
    referrer.includes('trill') ||
    userAgent.includes('tiktok') ||
    userAgent.includes('musical_ly') ||
    userAgent.includes('bytedance')
  ) {
    return 'TikTok'
  }

  // 5. Facebook
  if (
    searchStr.includes('fbclid') ||
    searchStr.includes('facebook') ||
    referrer.includes('facebook') ||
    referrer.includes('fb.com') ||
    referrer.includes('com.facebook') ||
    userAgent.includes('fban') ||
    userAgent.includes('fbav')
  ) {
    return 'Facebook'
  }

  // 6. YouTube
  if (searchStr.includes('youtube') || searchStr.includes('youtu.be') || referrer.includes('youtube.com') || referrer.includes('youtu.be')) return 'YouTube'

  // 7. X (Twitter)
  if (searchStr.includes('twitter') || searchStr.includes('x.com') || referrer.includes('t.co') || referrer.includes('twitter.com') || referrer.includes('x.com') || referrer.includes('com.twitter')) return 'X (Twitter)'

  // 8. Google
  if (referrer.includes('google.com') || referrer.includes('google.com.br')) return 'Google'

  if (referrer && !referrer.includes(window.location.hostname)) return 'Outro Site'
  return 'Direto'
}

const hasTrackedView = ref(false)

function sendTrackView(profileId: string) {
  if (hasTrackedView.value || !profileId || import.meta.server) return
  hasTrackedView.value = true

  const source = detectClickPlatform()
  if (source && source !== 'Direto') {
    sessionStorage.setItem('avyro_traffic_source', source)
  }

  const viewPayload = {
    profileId,
    platform: source || 'Direto',
    referrer: document.referrer || ''
  }

  try {
    const blob = new Blob([JSON.stringify(viewPayload)], { type: 'application/json' })
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/track-view', blob)
    } else {
      fetch('/api/analytics/track-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(viewPayload),
        keepalive: true
      }).catch(() => {})
    }
  } catch (e) {
    $fetch('/api/analytics/track-view', {
      method: 'POST',
      body: viewPayload
    }).catch(() => {})
  }
}

watch(profile, (newVal) => {
  if (newVal?.id) {
    sendTrackView(newVal.id)
  }
}, { immediate: true })

onMounted(() => {
  if (import.meta.client && profile.value?.id) {
    sendTrackView(profile.value.id)
  }
})

function trackClickAnalytics(link: LinkItem) {
  if (import.meta.server) return
  const platform = detectClickPlatform()
  const payload = {
    linkId: link.id,
    profileId: profile.value?.id || null,
    platform,
    referrer: document.referrer || ''
  }

  try {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/track-click', blob)
    } else {
      fetch('/api/analytics/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {})
    }
  } catch (e) {
    $fetch('/api/analytics/track-click', {
      method: 'POST',
      body: payload
    }).catch(() => {})
  }

  // Backup direct RPC call for main clicks count
  try {
    supabase.rpc('increment_link_click', { link_id: link.id }).catch(() => {})
  } catch (err) {}
}

async function handleClick(link: LinkItem) {
  trackClickAnalytics(link)
}

// ─── Custom Font & Custom Button Decoding ───
const computedFontFamily = computed(() => {
  if (profile.value?.font_class?.startsWith('custom:')) {
    return profile.value.font_class.slice(7)
  }
  return ''
})

function loadGoogleFont(family: string) {
  if (import.meta.server) return
  const id = `gfont-${family.replace(/\s+/g, '-').toLowerCase()}`
  if (document.getElementById(id)) return

  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;700&display=swap`
  document.head.appendChild(link)
}

watch(computedFontFamily, (newFamily) => {
  if (newFamily) {
    loadGoogleFont(newFamily)
  }
}, { immediate: true })

const isCustomBtn = computed(() => {
  return profile.value?.roundness?.startsWith('custom:')
})

const customBtnConfig = computed(() => {
  if (!isCustomBtn.value) return null
  try {
    return JSON.parse(profile.value.roundness.slice(7))
  } catch (e) {
    return null
  }
})

const computedButtonClasses = computed(() => {
  if (isCustomBtn.value) {
    return customBtnConfig.value?.hoverEffect || ''
  }
  return [
    profile.value?.roundness || 'rounded-full',
    profile.value?.btn_border || ''
  ]
})

const computedButtonStyles = computed(() => {
  const c = customBtnConfig.value
  const isTransparent = isCustomBtn.value && c?.isTransparentBg
  const base = {
    backgroundColor: isTransparent ? 'transparent' : (profile.value?.btn_bg_color || '#ffffff'),
    color: profile.value?.btn_text_color || '#111111',
    fontFamily: computedFontFamily.value || undefined
  }
  if (!isCustomBtn.value || !c) return base

  let shadowStr = undefined
  if (c.shadowType === 'drop') {
    shadowStr = `${c.shadowOffsetX}px ${c.shadowOffsetY}px ${c.shadowBlur}px ${c.shadowColor}`
  } else if (c.shadowType === 'brutal') {
    shadowStr = `${c.shadowOffsetX}px ${c.shadowOffsetY}px 0px ${c.shadowColor}`
  } else if (c.shadowType === 'neon') {
    shadowStr = `0 0 ${c.shadowBlur}px ${c.shadowColor}`
  }

  return {
    ...base,
    borderRadius: `${c.borderRadius}px`,
    borderWidth: `${c.borderWidth}px`,
    borderStyle: c.borderStyle,
    borderColor: c.borderColor,
    boxShadow: shadowStr
  }
})

const playingVideoId = ref<string | null>(null)

function parseVideoPayload(urlStr: string) {
  try {
    if (urlStr && urlStr.startsWith('{')) {
      return JSON.parse(urlStr)
    }
  } catch (e) {}
  return { videoUrl: urlStr || '', thumbnailUrl: '', aspectRatio: '16/9' }
}

function parseSocialPayload(urlStr: string) {
  try {
    if (urlStr && urlStr.startsWith('{')) {
      return JSON.parse(urlStr)
    }
  } catch (e) {}
  return { platform: 'tiktok', handle: '@username', followersText: '0 seguidores', followUrl: '#', images: [] }
}

const activeTab = ref<'links' | 'shop'>('links')
const activeProductModalData = ref<{ title: string; price: string; imageUrl: string; targetUrl: string; originalLink: any } | null>(null)

function openProductModal(link: any) {
  const payload = parseProductPayload(link.url)
  activeProductModalData.value = {
    title: link.title,
    price: payload.price,
    imageUrl: payload.imageUrl,
    targetUrl: payload.targetUrl,
    originalLink: link
  }
}

const activeShareModalLink = ref<any>(null)
const copySuccess = ref(false)
const reportSuccess = ref(false)
const showMoreDescription = ref(false)
const linkPreviewData = ref<{ title?: string; description?: string; image?: string | null; favicon?: string | null; siteName?: string | null } | null>(null)
const loadingPreview = ref(false)

async function fetchLinkPreview(url: string) {
  if (!url || import.meta.server) return
  loadingPreview.value = true
  linkPreviewData.value = null
  try {
    const data = await $fetch<any>('/api/link-preview', { query: { url } })
    if (data?.success) {
      linkPreviewData.value = data
    }
  } catch (e) {
    linkPreviewData.value = null
  } finally {
    loadingPreview.value = false
  }
}

const SOCIAL_PLATFORM_ICONS = ['youtube', 'instagram', 'tiktok', 'spotify', 'whatsapp', 'x', 'linkedin', 'facebook', 'threads', 'telegram', 'twitter']

function isSocialPlatformLink(link: any): boolean {
  return SOCIAL_PLATFORM_ICONS.includes(link?.icon)
}

const PLATFORM_CARD_COLORS: Record<string, { bg: string; accent: string }> = {
  youtube:   { bg: '#0F0F0F', accent: '#FF0000' },
  instagram: { bg: '#1a0a1e', accent: '#E1306C' },
  tiktok:    { bg: '#010101', accent: '#00f2ea' },
  spotify:   { bg: '#0d1117', accent: '#1DB954' },
  whatsapp:  { bg: '#0a1e13', accent: '#25D366' },
  x:         { bg: '#000000', accent: '#ffffff' },
  twitter:   { bg: '#000000', accent: '#ffffff' },
  linkedin:  { bg: '#00030a', accent: '#0A66C2' },
  facebook:  { bg: '#0a0e1a', accent: '#1877F2' },
  threads:   { bg: '#0d0d0d', accent: '#ffffff' },
  telegram:  { bg: '#0a1929', accent: '#2AABEE' },
}

function getPlatformCardColors(icon: string) {
  return PLATFORM_CARD_COLORS[icon] || { bg: '#0d0d0d', accent: '#ffffff' }
}

function getPlatformDescription(link: any): string {
  const platform = link?.icon || ''
  const name = link?.title || 'este perfil'
  const descriptions: Record<string, string> = {
    youtube:   `Assista aos vídeos de ${name} no YouTube. Inscreva-se para não perder nenhum conteúdo novo.`,
    instagram: `Siga ${name} no Instagram e acompanhe stories, reels e as últimas publicações.`,
    tiktok:    `Siga ${name} no TikTok e confira os vídeos mais criativos e virais.`,
    spotify:   `Ouça ${name} no Spotify — podcasts, playlists e muito mais.`,
    whatsapp:  `Entre em contato direto com ${name} pelo WhatsApp de forma rápida e prática.`,
    x:         `Siga ${name} no X (Twitter) para acompanhar tweets e discussões em tempo real.`,
    twitter:   `Siga ${name} no X (Twitter) para acompanhar tweets e discussões em tempo real.`,
    linkedin:  `Conecte-se com ${name} no LinkedIn e expanda sua rede profissional.`,
    facebook:  `Curta a página de ${name} no Facebook e fique por dentro das novidades.`,
    threads:   `Siga ${name} no Threads para conversas, textos e discussões.`,
    telegram:  `Entre no canal ou grupo ${name} no Telegram.`,
  }
  return descriptions[platform] || `Acesse o conteúdo exclusivo de ${name}.`
}

function openShareModal(link: any) {
  activeShareModalLink.value = link
  copySuccess.value = false
  reportSuccess.value = false
  showMoreDescription.value = false
  linkPreviewData.value = null
  fetchLinkPreview(link.url)
}

async function copyLinkUrl() {
  if (!activeShareModalLink.value) return
  try {
    await navigator.clipboard.writeText(activeShareModalLink.value.url)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}

function getUrlDomain(url: string): string {
  try {
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`
    const parsed = new URL(cleanUrl)
    return parsed.hostname.replace('www.', '')
  } catch (e) {
    return url
  }
}

function parseProductPayload(urlStr: string) {
  try {
    if (urlStr && urlStr.startsWith('{')) {
      return JSON.parse(urlStr)
    }
  } catch (e) {}
  return { price: 'Grátis', targetUrl: urlStr || '#', imageUrl: '' }
}

function isImageUrl(urlStr?: string) {
  if (!urlStr) return false
  return urlStr.startsWith('http://') || urlStr.startsWith('https://') || urlStr.startsWith('data:image/') || urlStr.startsWith('/uploads/')
}

// Background style engine matching playground
const pageCssStyle = computed(() => {
  if (!profile.value) return ''
  const p = profile.value
  if (blurAmount.value > 0 && p.bg_image_url) {
    return `background-color: ${p.bg_color || '#060318'};`
  }
  if (p.bg_style) return p.bg_style
  if (p.bg_image_url) {
    return `background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.65)), url("${p.bg_image_url}"); background-size: cover; background-position: center; background-attachment: fixed;`
  }
  return `background-color: ${p.bg_color || '#060318'};`
})
</script>

<template>
  <div
    class="min-h-screen w-full flex flex-col items-center justify-between px-4 py-12 transition-all duration-500 relative"
    :style="[pageCssStyle, computedFontFamily ? { fontFamily: computedFontFamily } : {}]"
    :class="profile?.font_class?.startsWith('custom:') ? '' : (profile?.font_class || 'font-sans')"
  >
    <!-- Background Blur Photo Layer (Fixed position so scroll down stays 100% blurred) -->
    <div
      v-if="blurAmount > 0 && profile?.bg_image_url"
      class="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      <div
        class="w-full h-full bg-cover bg-center scale-110 transition-all duration-300"
        :style="{
          backgroundImage: `url('${profile.bg_image_url}')`,
          filter: `blur(${blurAmount}px)`
        }"
      ></div>
      <div class="fixed inset-0 bg-black/40"></div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center flex-1 my-auto">
      <span class="material-symbols-outlined animate-spin text-4xl text-[#00f0ff] mb-4">progress_activity</span>
      <p class="text-sm opacity-60 font-mono">Carregando bio...</p>
    </div>

    <!-- Not Found State -->
    <div v-else-if="notFound" class="flex flex-col items-center justify-center flex-1 text-center max-w-md my-auto">
      <span class="material-symbols-outlined text-6xl text-gray-500 mb-4">person_off</span>
      <h1 class="font-heading text-2xl font-bold mb-2">Perfil não encontrado</h1>
      <p class="text-sm opacity-70 mb-6">O endereço @{{ cleanUsername }} não existe ou ainda não foi registrado.</p>
      <NuxtLink to="/register" class="px-8 py-3.5 rounded-full font-bold text-sm bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-xl">
        Criar esta página agora
      </NuxtLink>
    </div>

    <!-- Main Public Bio Content (Matching exact design preview 100%) -->
    <div v-else class="w-full max-w-md mx-auto flex flex-col items-center text-center my-auto pt-4 pb-8">

      <!-- Avatar Photo -->
      <div v-if="profile?.avatar_url?.startsWith('animated:')" class="w-24 h-24 sm:w-28 sm:h-28 mb-4 flex items-center justify-center shrink-0">
        <img
          :src="profile.avatar_url.replace('animated:', '')"
          :alt="profile?.display_name"
          class="w-full h-full object-contain"
        />
      </div>
      <div v-else class="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-black/10 shadow-lg bg-slate-200 mb-4 flex items-center justify-center shrink-0">
        <img
          :src="profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'"
          :alt="profile?.display_name"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Display Name & Username -->
      <div class="space-y-1 text-center mb-6">
        <h1 class="text-xl sm:text-2xl font-bold tracking-tight" :style="{ color: profile?.text_color }">
          @{{ profile?.username }}
        </h1>
        <p class="text-xs sm:text-sm leading-relaxed max-w-[280px] mx-auto opacity-85 font-medium" :style="{ color: profile?.text_color }">
          {{ profile?.bio_description }}
        </p>
      </div>

      <!-- Official Social Media Vector SVG Icons Bar -->
      <div v-if="profile?.socials && profile.socials.length > 0" class="flex items-center justify-center gap-4 mb-6 opacity-90 flex-wrap" :style="{ color: profile?.text_color }">
        <div
          v-for="s in profile.socials"
          :key="s"
          class="w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
          v-html="brandIcons[s] || ''"
          :title="s"
        />
      </div>

      <!-- Tabs Selector (Links vs Shop) - If there is at least one product -->
      <div v-if="links.some(l => l.icon === 'shop_product')" class="flex gap-3 justify-center mb-6 w-full max-w-[240px] mx-auto p-1 bg-black/10 rounded-full shrink-0">
        <button
          @click="activeTab = 'links'"
          :class="['flex-1 py-2 text-xs font-bold rounded-full transition-all duration-300', activeTab === 'links' ? 'shadow-sm' : 'hover:opacity-80']"
          :style="activeTab === 'links' 
            ? { backgroundColor: profile?.btn_bg_color || '#ffffff', color: profile?.btn_text_color || '#111111' } 
            : { color: profile?.text_color || '#ffffff', opacity: 0.65 }"
        >
          Links
        </button>
        <button
          @click="activeTab = 'shop'"
          :class="['flex-1 py-2 text-xs font-bold rounded-full transition-all duration-300', activeTab === 'shop' ? 'shadow-sm' : 'hover:opacity-80']"
          :style="activeTab === 'shop' 
            ? { backgroundColor: profile?.btn_bg_color || '#ffffff', color: profile?.btn_text_color || '#111111' } 
            : { color: profile?.text_color || '#ffffff', opacity: 0.65 }"
        >
          Shop
        </button>
      </div>

      <!-- Links Buttons List (EXACT styling engine match from preview) -->
      <div v-if="activeTab === 'links'" class="w-full space-y-3.5 mb-10">
        <template v-for="link in links" :key="link.id">
          <template v-if="link.icon !== 'shop_product'">
            <!-- Case 1: Spotify Embed Player -->
            <div v-if="link.icon === 'spotify_embed'" class="w-full rounded-2xl overflow-hidden shadow-sm">
              <iframe style="border-radius:12px" :src="link.url" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>

            <!-- Case 2: Custom Video Player Block -->
            <div v-else-if="link.icon === 'video_card'" 
              :class="[
                'w-full rounded-2xl overflow-hidden shadow-md bg-black relative border border-white/10 mx-auto',
                parseVideoPayload(link.url).aspectRatio === '9/16' ? 'aspect-[9/16] max-w-[240px]' : 
                parseVideoPayload(link.url).aspectRatio === '1/1' ? 'aspect-square' : 'aspect-video'
              ]">
              <!-- If playing inline -->
              <video v-if="playingVideoId === link.id" :src="parseVideoPayload(link.url).videoUrl" controls autoplay class="w-full h-full object-contain" @play="handleClick(link)"></video>
              
              <!-- Cover / Play Button trigger -->
              <div v-else @click="playingVideoId = link.id" class="w-full h-full relative group cursor-pointer">
                <!-- Poster/Thumbnail -->
                <img v-if="parseVideoPayload(link.url).thumbnailUrl" :src="parseVideoPayload(link.url).thumbnailUrl" class="w-full h-full object-cover">
                <div v-else class="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-gray-500">
                  <span class="material-symbols-outlined text-4xl mb-1 text-gray-400">movie</span>
                  <span class="text-[10px] font-mono text-gray-400">Player de Vídeo</span>
                </div>
                
                <!-- Video title/caption overlay -->
                <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col justify-end text-left z-10">
                  <p class="text-white text-xs font-bold font-heading truncate">{{ link.title }}</p>
                </div>

                <!-- Play Overlay button -->
                <div class="absolute inset-0 flex items-center justify-center z-10 bg-black/10">
                  <div class="w-12 h-12 rounded-full bg-white/95 text-black shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                    <span class="material-symbols-outlined text-2xl font-bold ml-0.5" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Case 4: Social Feed Premium Card -->
            <div v-else-if="link.icon === 'social_feed'" class="w-full bg-[#fffbeb] text-slate-800 rounded-2xl p-4 border border-slate-200/50 shadow-xs flex flex-col gap-3 font-sans">
              <!-- Card Header -->
              <div class="flex items-center justify-between text-xs font-bold text-slate-800/80">
                <div class="flex items-center gap-1.5 capitalize">
                  <!-- Brand Icon depending on platform -->
                  <div class="w-4 h-4 shrink-0 fill-current text-slate-700" v-html="brandIcons[parseSocialPayload(link.url).platform] || ''"></div>
                  <span class="text-[11px] text-slate-700 font-bold uppercase tracking-wider">{{ parseSocialPayload(link.url).platform }}</span>
                </div>
              </div>

              <!-- 3D Overlapping Feed Images -->
              <div class="flex items-center justify-center -space-x-3 py-1">
                <!-- Left image -->
                <div v-if="parseSocialPayload(link.url).images?.[0]" class="w-[65px] h-[95px] sm:w-[75px] sm:h-[110px] rounded-lg overflow-hidden shadow-xs border border-white/20 -rotate-6 scale-90 z-0 bg-slate-200 shrink-0">
                  <img :src="parseSocialPayload(link.url).images[0]" class="w-full h-full object-cover">
                </div>
                <div v-else class="w-[65px] h-[95px] sm:w-[75px] sm:h-[110px] rounded-lg bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center -rotate-6 scale-90 z-0 shrink-0">
                  <span class="material-symbols-outlined text-[14px] text-slate-400">photo</span>
                </div>

                <!-- Center image -->
                <div v-if="parseSocialPayload(link.url).images?.[1]" class="w-[80px] h-[115px] sm:w-[95px] sm:h-[130px] rounded-lg overflow-hidden shadow-sm border border-white/30 z-10 scale-100 bg-slate-200 shrink-0">
                  <img :src="parseSocialPayload(link.url).images[1]" class="w-full h-full object-cover">
                </div>
                <div v-else class="w-[80px] h-[115px] sm:w-[95px] sm:h-[130px] rounded-lg bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center z-10 scale-100 shrink-0">
                  <span class="material-symbols-outlined text-[16px] text-slate-400">photo</span>
                </div>

                <!-- Right image -->
                <div v-if="parseSocialPayload(link.url).images?.[2]" class="w-[65px] h-[95px] sm:w-[75px] sm:h-[110px] rounded-lg overflow-hidden shadow-xs border border-white/20 rotate-6 scale-90 z-0 bg-slate-200 shrink-0">
                  <img :src="parseSocialPayload(link.url).images[2]" class="w-full h-full object-cover">
                </div>
                <div v-else class="w-[65px] h-[95px] sm:w-[75px] sm:h-[110px] rounded-lg bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center rotate-6 scale-90 z-0 shrink-0">
                  <span class="material-symbols-outlined text-[14px] text-slate-400">photo</span>
                </div>
              </div>

              <!-- Card Footer (Handle, Followers & Follow Button) -->
              <div class="flex items-center justify-between mt-1 pt-1.5 border-t border-slate-200/40">
                <div class="flex items-center gap-2 text-left min-w-0">
                  <div class="w-8 h-8 rounded-full overflow-hidden border border-black/10 shrink-0 bg-slate-200 flex items-center justify-center">
                    <img v-if="profile?.avatar_url" :src="profile.avatar_url.replace('animated:', '')" class="w-full h-full object-cover">
                    <span v-else class="material-symbols-outlined text-base text-gray-400">person</span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-[11px] font-bold text-slate-800 truncate leading-tight">{{ parseSocialPayload(link.url).handle }}</p>
                    <p class="text-[10px] text-slate-500 font-medium leading-none">{{ parseSocialPayload(link.url).followersText }}</p>
                  </div>
                </div>
                <a
                  :href="parseSocialPayload(link.url).followUrl"
                  target="_blank"
                  @click="handleClick(link)"
                  class="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] rounded-full transition-all shrink-0 uppercase tracking-wider"
                >
                  Seguir
                </a>
              </div>
            </div>

            <!-- Case 3: Standard Link Button -->
            <div
              v-else
              :class="[
                'w-full flex items-center justify-between transition-all duration-300 shadow-sm relative group overflow-hidden',
                computedButtonClasses,
                profile?.font_class?.startsWith('custom:') ? '' : (profile?.font_class || 'font-sans')
              ]"
              :style="computedButtonStyles"
            >
              <!-- Navigation Area -->
              <a
                :href="link.url"
                target="_blank"
                @click="handleClick(link)"
                class="flex-1 py-3.5 pl-4 pr-1 flex items-center justify-between min-w-0"
              >
                <!-- Left Thumbnail / Icon -->
                <div class="w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-black/5 border border-white/20 shadow-2xs">
                  <img v-if="isImageUrl(link.icon)" :src="link.icon" :alt="link.title" class="w-full h-full object-cover">
                  <div v-else-if="link.icon && brandIcons[link.icon]" class="w-4 h-4 shrink-0 flex items-center justify-center" v-html="brandIcons[link.icon]"></div>
                  <span v-else class="material-symbols-outlined text-[18px] shrink-0">{{ link.icon || 'link' }}</span>
                </div>

                <!-- Button Title -->
                <span class="flex-1 text-center font-bold truncate px-2">{{ link.title }}</span>

                <!-- Spacer for center alignment -->
                <div class="w-8 h-8 shrink-0"></div>
              </a>

              <!-- Share Button -->
              <button
                @click.stop.prevent="openShareModal(link)"
                class="w-10 h-10 flex items-center justify-center text-current hover:bg-black/10 active:bg-black/15 transition-all shrink-0 mr-2 rounded-full cursor-pointer z-10"
                title="Compartilhar"
              >
                <span class="material-symbols-outlined text-xl" style="font-variation-settings:'wght' 500;">more_vert</span>
              </button>
            </div>
          </template>
        </template>
      </div>

      <!-- Shop Product Grid -->
      <div v-else-if="activeTab === 'shop'" class="grid grid-cols-2 gap-4 w-full mb-10">
        <div
          v-for="link in links.filter(l => l.icon === 'shop_product')"
          :key="link.id"
          class="rounded-[20px] p-3.5 flex flex-col justify-between text-left relative transition-all duration-300 shadow-sm group hover:scale-[1.02] overflow-hidden border border-black/5 dark:border-white/5"
          :class="[
            profile?.font_class?.startsWith('custom:') ? '' : (profile?.font_class || 'font-sans')
          ]"
          :style="{
            ...computedButtonStyles,
            borderRadius: '20px'
          }"
        >
          <div>
            <!-- Image with Zoom Icon Overlay -->
            <div 
              v-if="parseProductPayload(link.url).imageUrl"
              @click="openProductModal(link)" 
              class="w-full aspect-square rounded-[18px] overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/40 mb-3 relative cursor-zoom-in group/img"
            >
              <img
                :src="parseProductPayload(link.url).imageUrl"
                :alt="link.title"
                class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
              />
              <!-- Hover Zoom Indicator Overlay -->
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white gap-1 text-[11px] font-bold">
                <span class="material-symbols-outlined text-[16px] font-bold">fullscreen</span>
                <span>Ampliar</span>
              </div>
            </div>
            <div v-else class="w-full aspect-square rounded-[18px] overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/40 mb-3 flex items-center justify-center text-slate-400">
              <span class="material-symbols-outlined text-3xl">shopping_bag</span>
            </div>

            <!-- Product title with link redirection -->
            <a :href="parseProductPayload(link.url).targetUrl" target="_blank" @click="handleClick(link)" class="block group/title">
              <p class="text-xs sm:text-sm font-extrabold leading-snug line-clamp-2 transition-colors" :style="{ color: computedButtonStyles.color || profile?.btn_text_color }">{{ link.title }}</p>
            </a>
          </div>

          <!-- Price & CTA bar -->
          <div class="flex items-center justify-between mt-3 pt-2 border-t" :style="{ borderTopColor: (computedButtonStyles.color || profile?.btn_text_color) ? (computedButtonStyles.color || profile?.btn_text_color) + '22' : 'rgba(0,0,0,0.1)' }">
            <span class="text-xs font-black" :style="{ color: computedButtonStyles.color || profile?.btn_text_color || '#111111' }">{{ parseProductPayload(link.url).price }}</span>
            <a 
              :href="parseProductPayload(link.url).targetUrl" 
              target="_blank" 
              @click="handleClick(link)" 
              class="px-3 py-1 bg-secondary text-white font-extrabold text-[10px] rounded-lg hover:bg-secondary/90 shadow-2xs hover:shadow-xs transition-all"
            >
              Comprar
            </a>
          </div>
        </div>
      </div>

      <!-- Footer Watermark / Linktree-style badge for Free accounts -->
      <div class="mt-auto pt-8 pb-2 flex justify-center">
        <!-- If free user (subscription_status !== 'active') -->
        <NuxtLink 
          v-if="profile?.subscription_status !== 'active'"
          to="/register" 
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-white/5 hover:bg-white/15 dark:hover:bg-black/40 hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-md text-[10px] font-extrabold text-white tracking-wide"
        >
          <!-- Stylized Mini Logo 'A' -->
          <div class="w-4 h-4 rounded-full bg-gradient-to-tr from-[#00f0ff] via-[#8b5cf6] to-[#ec4899] flex items-center justify-center p-[1px] shrink-0">
            <div class="w-full h-full bg-[#0d0928] rounded-full flex items-center justify-center">
              <span class="font-heading font-black text-[#00f0ff] text-[8px] tracking-tighter">A</span>
            </div>
          </div>
          <span>Criar meu Link em Bio Grátis</span>
        </NuxtLink>
        <!-- If PRO user (subscription_status === 'active'), show optional/minimal watermark -->
        <span 
          v-else 
          class="inline-flex items-center gap-1 text-[9px] font-bold opacity-20 tracking-wider" 
          :style="{ color: profile?.text_color || '#ffffff' }"
        >
          Powered by Avyro
        </span>
      </div>

      <!-- Fullscreen Product Zoom Modal -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="activeProductModalData" class="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-md">
          <!-- Close button -->
          <button @click="activeProductModalData = null" class="absolute top-4 right-4 text-white hover:opacity-85 transition-opacity bg-black/40 hover:bg-black/60 p-2.5 rounded-full flex items-center justify-center z-50">
            <span class="material-symbols-outlined text-2xl font-bold">close</span>
          </button>
          
          <!-- Image container -->
          <div class="relative max-w-full max-h-[68vh] overflow-hidden rounded-2xl shadow-2xl bg-black/20 flex items-center justify-center">
            <img :src="activeProductModalData.imageUrl" :alt="activeProductModalData.title" class="max-w-full max-h-[68vh] object-contain rounded-2xl">
          </div>

          <!-- Product Details and CTA -->
          <div class="mt-5 text-center max-w-md w-full px-4 flex flex-col items-center">
            <h3 class="text-white text-base sm:text-lg font-black leading-snug font-sans">{{ activeProductModalData.title }}</h3>
            <p class="text-secondary text-sm font-black mt-1 font-sans">{{ activeProductModalData.price }}</p>
            
            <div class="flex items-center gap-3 mt-4 w-full">
              <button @click="activeProductModalData = null" class="flex-1 py-3 border border-white/20 hover:border-white/40 text-white font-bold text-xs rounded-full transition-all">
                Fechar
              </button>
              <a :href="activeProductModalData.targetUrl" target="_blank" @click="handleClick(activeProductModalData.originalLink); activeProductModalData = null" class="flex-1 py-3 bg-secondary hover:bg-secondary/90 text-white font-bold text-xs rounded-full transition-all flex items-center justify-center gap-1.5 shadow-md">
                <span class="material-symbols-outlined text-[16px] font-bold">shopping_cart</span>
                Comprar Agora
              </a>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Share Link Modal -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="activeShareModalLink" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" @click="activeShareModalLink = null">
          <!-- Modal content box -->
          <div 
            class="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-[28px] sm:rounded-[28px] p-6 shadow-2xl transition-all duration-300 transform translate-y-0 scale-100 flex flex-col items-center"
            @click.stop
          >
            <!-- Drag handle on mobile (purely visual) -->
            <div class="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mb-5 sm:hidden shrink-0"></div>

            <!-- Header -->
            <div class="flex items-center justify-between w-full mb-4">
              <h3 class="text-base font-extrabold text-slate-900 dark:text-white">Compartilhar link</h3>
              <button @click="activeShareModalLink = null" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer">
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <!-- ── Loading skeleton ──────────────────────────────────── -->
            <div v-if="loadingPreview" class="w-full rounded-2xl mb-5 overflow-hidden border border-slate-100 dark:border-slate-800 animate-pulse">
              <div class="w-full h-36 bg-slate-200 dark:bg-slate-700"></div>
              <div class="p-4 bg-slate-50 dark:bg-slate-900 space-y-2.5">
                <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-1/4"></div>
                <div class="h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4"></div>
                <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-full"></div>
                <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-2/3"></div>
              </div>
            </div>

            <!-- ── OG Preview com imagem (estilo WhatsApp) ───────────── -->
            <div
              v-else-if="linkPreviewData?.image"
              class="w-full rounded-2xl mb-5 overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm"
            >
              <!-- Banner OG -->
              <div class="w-full aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  :src="linkPreviewData.image"
                  class="w-full h-full object-cover"
                  @error="(e: any) => { (e.target as HTMLImageElement).closest('.aspect-video')!.style.display = 'none' }"
                >
              </div>
              <!-- Texto -->
              <div class="p-4 bg-slate-50 dark:bg-slate-950">
                <div class="flex items-center gap-1.5 mb-1.5">
                  <img
                    v-if="linkPreviewData.favicon"
                    :src="linkPreviewData.favicon"
                    class="w-3.5 h-3.5 rounded-sm object-contain"
                    @error="(e: any) => (e.target as HTMLImageElement).style.display = 'none'"
                  >
                  <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                    {{ linkPreviewData.siteName || getUrlDomain(activeShareModalLink.url) }}
                  </span>
                </div>
                <p class="font-extrabold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {{ linkPreviewData.title || activeShareModalLink.title }}
                </p>
                <p v-if="linkPreviewData.description" class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {{ linkPreviewData.description }}
                </p>
              </div>
            </div>

            <!-- ── OG Preview sem imagem (só texto) ─────────────────── -->
            <div
              v-else-if="linkPreviewData"
              class="w-full bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 mb-5 border border-slate-100 dark:border-slate-800/80 flex flex-col items-start text-left"
            >
              <div class="flex items-center gap-2 mb-2">
                <img
                  v-if="linkPreviewData.favicon"
                  :src="linkPreviewData.favicon"
                  class="w-4 h-4 rounded-sm object-contain"
                  @error="(e: any) => (e.target as HTMLImageElement).style.display = 'none'"
                >
                <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                  {{ linkPreviewData.siteName || getUrlDomain(activeShareModalLink.url) }}
                </span>
              </div>
              <p class="font-extrabold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2 w-full">
                {{ linkPreviewData.title || activeShareModalLink.title }}
              </p>
              <p v-if="linkPreviewData.description" class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                {{ linkPreviewData.description }}
              </p>
            </div>

            <!-- ── Fallback: card dark branded (rede social sem OG) ─── -->
            <div
              v-else-if="isSocialPlatformLink(activeShareModalLink)"
              class="w-full rounded-2xl mb-5 overflow-hidden"
              :style="{ backgroundColor: getPlatformCardColors(activeShareModalLink.icon).bg }"
            >
              <div class="flex flex-col items-center text-center p-6 pb-5 gap-3">
                <div
                  class="w-[72px] h-[72px] rounded-[20px] flex items-center justify-center shrink-0 shadow-lg"
                  :style="{ backgroundColor: getPlatformCardColors(activeShareModalLink.icon).accent + '22', border: `1.5px solid ${getPlatformCardColors(activeShareModalLink.icon).accent}50` }"
                >
                  <div
                    class="w-9 h-9 shrink-0"
                    :style="{ fill: getPlatformCardColors(activeShareModalLink.icon).accent, color: getPlatformCardColors(activeShareModalLink.icon).accent }"
                    v-html="brandIcons[activeShareModalLink.icon]"
                  ></div>
                </div>
                <p class="font-extrabold text-base text-white leading-snug">{{ activeShareModalLink.title }}</p>
                <p class="text-[11px] text-slate-400 -mt-1.5 truncate w-full px-2 font-mono">{{ activeShareModalLink.url }}</p>
                <p
                  class="text-xs text-slate-400 leading-relaxed px-2"
                  :class="showMoreDescription ? '' : 'line-clamp-3'"
                >
                  {{ getPlatformDescription(activeShareModalLink) }}
                </p>
                <button
                  @click="showMoreDescription = !showMoreDescription"
                  class="px-6 py-1.5 border border-slate-600 hover:border-slate-400 text-white text-[11px] font-bold rounded-full transition-all cursor-pointer"
                >
                  {{ showMoreDescription ? 'Menos' : 'Mais' }}
                </button>
              </div>
            </div>

            <!-- ── Fallback: card genérico (link sem OG) ─────────────── -->
            <div
              v-else
              class="w-full bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 mb-5 border border-slate-100 dark:border-slate-800/80 flex flex-col items-center text-center"
            >
              <div class="w-12 h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-black/5 border border-slate-200 dark:border-slate-800 shadow-3xs">
                <img v-if="isImageUrl(activeShareModalLink.icon)" :src="activeShareModalLink.icon" :alt="activeShareModalLink.title" class="w-full h-full object-cover">
                <div v-else-if="activeShareModalLink.icon && brandIcons[activeShareModalLink.icon]" class="w-6 h-6 shrink-0 flex items-center justify-center text-slate-800 dark:text-white" v-html="brandIcons[activeShareModalLink.icon]"></div>
                <span v-else class="material-symbols-outlined text-[24px] shrink-0 text-slate-500 dark:text-slate-400">{{ activeShareModalLink.icon || 'link' }}</span>
              </div>
              <p class="font-extrabold text-sm text-slate-900 dark:text-white mt-3 truncate w-full px-2">{{ activeShareModalLink.title }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 select-all break-all w-full px-2">{{ getUrlDomain(activeShareModalLink.url) }}</p>
            </div>

            <!-- Sharing Options -->
            <div class="w-full text-left">
              <p class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Compartilhar via</p>
              
              <div class="flex items-center gap-3.5 overflow-x-auto pb-2 w-full no-scrollbar">
                <!-- Copy Link -->
                <button 
                  @click="copyLinkUrl" 
                  class="flex flex-col items-center gap-2 shrink-0 group/share cursor-pointer"
                >
                  <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center group-hover/share:bg-slate-200 dark:group-hover/share:bg-slate-700 transition-colors shadow-2xs">
                    <span class="material-symbols-outlined text-lg">{{ copySuccess ? 'check' : 'link' }}</span>
                  </div>
                  <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover/share:text-slate-700 dark:group-hover/share:text-slate-300 truncate w-14 text-center">
                    {{ copySuccess ? 'Copiado!' : 'Copiar' }}
                  </span>
                </button>

                <!-- WhatsApp -->
                <a 
                  :href="`https://api.whatsapp.com/send?text=${encodeURIComponent(activeShareModalLink.title + ' - ' + activeShareModalLink.url)}`" 
                  target="_blank"
                  class="flex flex-col items-center gap-2 shrink-0 group/share"
                >
                  <div class="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-2xs">
                    <div class="w-5 h-5 fill-current" v-html="brandIcons.whatsapp"></div>
                  </div>
                  <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover/share:text-slate-700 dark:group-hover/share:text-slate-300 truncate w-14 text-center">WhatsApp</span>
                </a>

                <!-- X (Twitter) -->
                <a 
                  :href="`https://x.com/intent/tweet?url=${encodeURIComponent(activeShareModalLink.url)}&text=${encodeURIComponent(activeShareModalLink.title)}`" 
                  target="_blank"
                  class="flex flex-col items-center gap-2 shrink-0 group/share"
                >
                  <div class="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 transition-opacity shadow-2xs">
                    <div class="w-4 h-4 fill-current" v-html="brandIcons.x"></div>
                  </div>
                  <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover/share:text-slate-700 dark:group-hover/share:text-slate-300 truncate w-14 text-center">X / Twitter</span>
                </a>

                <!-- Facebook -->
                <a 
                  :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(activeShareModalLink.url)}`" 
                  target="_blank"
                  class="flex flex-col items-center gap-2 shrink-0 group/share"
                >
                  <div class="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-2xs">
                    <svg viewBox="0 0 24 24" class="w-5 h-5 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover/share:text-slate-700 dark:group-hover/share:text-slate-300 truncate w-14 text-center">Facebook</span>
                </a>

                <!-- LinkedIn -->
                <a 
                  :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(activeShareModalLink.url)}`" 
                  target="_blank"
                  class="flex flex-col items-center gap-2 shrink-0 group/share"
                >
                  <div class="w-12 h-12 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-2xs">
                    <div class="w-4 h-4 fill-current" v-html="brandIcons.linkedin"></div>
                  </div>
                  <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover/share:text-slate-700 dark:group-hover/share:text-slate-300 truncate w-14 text-center">LinkedIn</span>
                </a>
              </div>
            </div>

            <!-- Avyro CTA Banner -->
            <div class="w-full border-t border-slate-100 dark:border-slate-800/80 pt-5 mt-5 text-left">
              <h4 class="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">Junte-se a {{ profile?.display_name || profile?.username }} no Avyro</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Crie seu perfil profissional e comece a compartilhar seus links com um visual incrível.</p>
              
              <div class="flex flex-col gap-2 mt-4 w-full">
                <a href="/register" class="w-full py-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs rounded-full transition-all block text-center shadow-md hover:scale-[1.01] active:scale-[0.99]">
                  Cadastre-se gratuitamente
                </a>
                <a href="/" class="w-full py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-full transition-all block text-center hover:scale-[1.01] active:scale-[0.99]">
                  Saiba mais
                </a>
              </div>
            </div>

            <!-- Report Link Option -->
            <div class="w-full flex justify-center mt-5 pt-3.5 border-t border-slate-50 dark:border-slate-800/50 shrink-0">
              <button 
                v-if="!reportSuccess"
                @click="reportSuccess = true" 
                class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors uppercase tracking-wider cursor-pointer"
              >
                <span class="material-symbols-outlined text-sm">flag</span>
                Reportar link
              </button>
              <span v-else class="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">check_circle</span>
                Link reportado
              </span>
            </div>
          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>

<style scoped>
/* ─── Estilos Únicos e Distintos ─────────────────────────────────────── */
.btn-wavy {
  clip-path: polygon(
    0% 12%, 5% 0%, 10% 12%, 15% 0%, 20% 12%, 25% 0%, 30% 12%, 35% 0%, 40% 12%, 45% 0%, 50% 12%, 55% 0%, 60% 12%, 65% 0%, 70% 12%, 75% 0%, 80% 12%, 85% 0%, 90% 12%, 95% 0%, 100% 12%,
    100% 88%, 95% 100%, 90% 88%, 85% 100%, 80% 88%, 75% 100%, 70% 88%, 65% 100%, 60% 88%, 55% 100%, 50% 88%, 45% 100%, 40% 88%, 35% 100%, 30% 88%, 25% 100%, 20% 88%, 15% 100%, 10% 88%, 5% 100%, 0% 88%
  );
  border: none !important;
}

.btn-torn {
  clip-path: polygon(
    0% 4px, 4% 0px, 9% 5px, 14% 1px, 20% 6px, 27% 2px, 34% 6px, 40% 1px, 48% 6px, 55% 2px, 62% 6px, 69% 1px, 76% 6px, 83% 2px, 90% 5px, 95% 1px, 100% 4px,
    100% calc(100% - 4px), 96% 100%, 91% calc(100% - 5px), 84% calc(100% - 1px), 77% calc(100% - 6px), 71% calc(100% - 2px), 63% calc(100% - 6px), 56% calc(100% - 1px), 49% calc(100% - 6px), 42% calc(100% - 2px), 35% calc(100% - 6px), 28% calc(100% - 1px), 21% calc(100% - 6px), 14% calc(100% - 2px), 7% calc(100% - 6px), 0% calc(100% - 3px)
  );
  border: none !important;
}

.btn-brutal {
  border: 3px solid #000000 !important;
  box-shadow: 5px 5px 0px 0px #000000 !important;
  border-radius: 6px;
}

.btn-glass {
  background-color: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 8px 32px rgba(0, 0, 0, 0.15);
  border-radius: 14px;
}

.btn-outline {
  background-color: transparent !important;
  border: 2px solid currentColor !important;
  border-radius: 12px;
}

.btn-3d-press {
  border-radius: 12px;
  border: none !important;
  box-shadow: 0 6px 0 rgba(0,0,0,0.35);
  transform: translateY(-3px);
}

.btn-left-accent {
  border-radius: 0 12px 12px 0 !important;
  border-left: 6px solid currentColor !important;
  border-top: none !important;
  border-right: none !important;
  border-bottom: none !important;
}

.btn-angled {
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  border-radius: 0 !important;
  border: none !important;
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 6px 0 currentColor, 0 0 14px 0 currentColor; }
  50%       { box-shadow: 0 0 18px 4px currentColor, 0 0 35px 8px currentColor; }
}
.btn-neon-glow {
  border-radius: 9999px;
  border: 1.5px solid currentColor !important;
  animation: glow-pulse 2.5s ease-in-out infinite;
}

.btn-dashed {
  border-radius: 12px;
  border: 2.5px dashed currentColor !important;
  background-color: transparent !important;
}

.btn-retro {
  border-radius: 0px;
  border: 3px solid #000 !important;
  box-shadow: 4px 4px 0 #000;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 800 !important;
}

@keyframes aurora-shift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.btn-aurora {
  border-radius: 9999px;
  border: none !important;
  background: linear-gradient(270deg, #ff0080, #7928ca, #00aaff, #00ffaa, #7928ca, #ff0080) !important;
  background-size: 500% 500% !important;
  animation: aurora-shift 5s ease infinite;
  color: #fff !important;
}

.btn-corner-marks {
  border-radius: 2px;
  border: none !important;
  background: transparent !important;
  position: relative;
}
.btn-corner-marks::before,
.btn-corner-marks::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  border-color: currentColor;
  border-style: solid;
}
.btn-corner-marks::before {
  top: 0px;
  left: 0px;
  border-width: 2.5px 0 0 2.5px;
}
.btn-corner-marks::after {
  bottom: 0px;
  right: 0px;
  border-width: 0 2.5px 2.5px 0;
}

.btn-stripe {
  border-radius: 10px;
  border: none !important;
  position: relative;
  overflow: hidden;
}
.btn-stripe::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 6px,
    rgba(255,255,255,0.15) 6px,
    rgba(255,255,255,0.15) 12px
  );
  pointer-events: none;
}

.btn-underline {
  border-radius: 0 !important;
  border: none !important;
  border-bottom: 3px solid currentColor !important;
  background: transparent !important;
}

/* ─── Novos Formatos Geométricos & Estilos ────────────────────────────────── */
.btn-ticket {
  border-radius: 6px;
  border: 1.5px dashed currentColor !important;
  clip-path: polygon(
    0% 0%, 100% 0%, 
    100% calc(50% - 7px), calc(100% - 7px) 50%, 100% calc(50% + 7px), 
    100% 100%, 0% 100%, 
    0% calc(50% + 7px), 7px 50%, 0% calc(50% - 7px)
  );
}

.btn-hexagon {
  border-radius: 0 !important;
  border: none !important;
  clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0 50%);
}

.btn-hangtag {
  border-radius: 0 10px 10px 0 !important;
  border: none !important;
  clip-path: polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px);
  position: relative;
}

.btn-speech {
  border-radius: 14px 14px 14px 2px !important;
  border: 2px solid currentColor !important;
  box-shadow: 3px 3px 0 rgba(0,0,0,0.15);
}

.btn-notch {
  border-radius: 0 !important;
  border: none !important;
  clip-path: polygon(
    10px 0, calc(100% - 10px) 0, 100% 10px, 
    100% calc(100% - 10px), calc(100% - 10px) 100%, 
    10px 100%, 0 calc(100% - 10px), 0 10px
  );
}

.btn-zigzag {
  border-radius: 0 !important;
  border: none !important;
  clip-path: polygon(
    0% 0%, 100% 0%, 
    97% 20%, 100% 40%, 97% 60%, 100% 80%, 97% 100%, 
    0% 100%, 
    3% 80%, 0% 60%, 3% 40%, 0% 20%
  );
}

.btn-pill-skew {
  border-radius: 9999px 4px 4px 9999px !important;
  border: none !important;
}

@keyframes holo-shine {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.btn-holographic {
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.6) !important;
  background: linear-gradient(135deg, #e66465 0%, #9198e5 25%, #43e97b 50%, #38f9d7 75%, #fa709a 100%) !important;
  background-size: 300% 300% !important;
  animation: holo-shine 6s ease infinite;
  color: #000 !important;
  font-weight: 800 !important;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.btn-cassette {
  border-radius: 8px;
  border: 3px solid currentColor !important;
  box-shadow: inset 0 0 0 3px rgba(0,0,0,0.1);
  position: relative;
}

.btn-neon-border {
  border-radius: 14px;
  border: 2px solid currentColor !important;
  outline: 2px dashed currentColor;
  outline-offset: 4px;
}

:deep(svg) {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
