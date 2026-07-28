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
  display_name: string
  bio_description: string
  avatar_url: string
  bg_color: string
  bg_image_url: string
  bg_style: string
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

  // 1. Fetch profile (case-insensitive match)
  const { data: profileData, error: profErr } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', cleanUsername)
    .maybeSingle()

  if (profErr || !profileData) {
    return null
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

if (profile.value) {
  useSeoMeta({
    title: `${profile.value.display_name || profile.value.username} | Link-in-Bio`,
    description: profile.value.bio_description || `Confira todos os links oficiais de ${profile.value.display_name}`,
  })
}

function detectClickPlatform(): string {
  if (import.meta.server) return 'Direto'
  
  const savedSource = sessionStorage.getItem('avyro_traffic_source')
  if (savedSource && savedSource !== 'Direto') return savedSource

  const referrer = (document.referrer || '').toLowerCase()
  const userAgent = (navigator.userAgent || '').toLowerCase()
  const searchStr = (window.location.search || '').toLowerCase()

  // 1. WhatsApp (Detects l.wl.co, wl.co, android-app://com.whatsapp, wa.me, web.whatsapp, and in-app User-Agent)
  if (
    searchStr.includes('whatsapp') ||
    searchStr.includes('wa.me') ||
    referrer.includes('whatsapp') ||
    referrer.includes('wa.me') ||
    referrer.includes('wl.co') ||
    referrer.includes('com.whatsapp') ||
    userAgent.includes('whatsapp')
  ) {
    return 'WhatsApp'
  }

  // 2. Threads (Detects l.threads.com, threads.net, threads.com, com.instagram.barcelona, and User-Agent)
  if (
    searchStr.includes('threads') ||
    referrer.includes('threads') ||
    referrer.includes('barcelona') ||
    userAgent.includes('threads') ||
    userAgent.includes('barcelona')
  ) {
    return 'Threads'
  }

  // 3. TikTok (Detects android-app://com.zhiliaoapp.musically, ttclid, tiktok.com, and User-Agent)
  if (
    searchStr.includes('ttclid=') ||
    searchStr.includes('tiktok') ||
    referrer.includes('tiktok') ||
    referrer.includes('musically') ||
    referrer.includes('zhiliaoapp') ||
    referrer.includes('trill') ||
    userAgent.includes('tiktok') ||
    userAgent.includes('musical_ly')
  ) {
    return 'TikTok'
  }

  // 4. Instagram (Detects android-app://com.instagram.android, instagram.com, l.instagram.com, and User-Agent)
  if (
    searchStr.includes('utm_source=instagram') ||
    searchStr.includes('utm_source=insta') ||
    searchStr.includes('ig') ||
    referrer.includes('instagram') ||
    referrer.includes('com.instagram') ||
    userAgent.includes('instagram')
  ) {
    return 'Instagram'
  }

  // Meta's fbclid parameter is automatically added to bio links clicked on Instagram/Facebook/Threads
  if (searchStr.includes('fbclid=')) {
    if (referrer.includes('threads')) return 'Threads'
    if (referrer.includes('instagram') || userAgent.includes('instagram')) return 'Instagram'
    if (referrer.includes('facebook') || userAgent.includes('facebook')) return 'Facebook'
    return 'Instagram'
  }

  // 5. Other Networks
  if (searchStr.includes('youtube') || referrer.includes('youtube.com') || referrer.includes('youtu.be')) return 'YouTube'
  if (searchStr.includes('twitter') || searchStr.includes('x.com') || referrer.includes('t.co') || referrer.includes('twitter.com') || referrer.includes('x.com') || referrer.includes('com.twitter')) return 'X (Twitter)'
  if (referrer.includes('facebook') || referrer.includes('fb.com') || referrer.includes('com.facebook')) return 'Facebook'
  if (referrer.includes('google.com')) return 'Google'

  if (referrer) return 'Outro Site'
  return 'Direto'
}

onMounted(() => {
  if (import.meta.client) {
    const source = detectClickPlatform()
    if (source && source !== 'Direto') {
      sessionStorage.setItem('avyro_traffic_source', source)
    }
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
  return { videoUrl: urlStr || '', thumbnailUrl: '' }
}

function isImageUrl(urlStr?: string) {
  if (!urlStr) return false
  return urlStr.startsWith('http://') || urlStr.startsWith('https://') || urlStr.startsWith('data:image/') || urlStr.startsWith('/uploads/')
}

// Background style engine matching playground
const pageCssStyle = computed(() => {
  if (!profile.value) return ''
  const p = profile.value
  if (p.bg_style) return p.bg_style
  if (p.bg_image_url) {
    return `background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.65)), url("${p.bg_image_url}"); background-size: cover; background-position: center;`
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
      <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-black/10 shadow-lg bg-slate-200 mb-4 flex items-center justify-center shrink-0">
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

      <!-- Links Buttons List (EXACT styling engine match from preview) -->
      <div class="w-full space-y-3.5 mb-10">
        <template v-for="link in links" :key="link.id">
          <!-- Case 1: Spotify Embed Player -->
          <div v-if="link.icon === 'spotify_embed'" class="w-full rounded-2xl overflow-hidden shadow-sm">
            <iframe style="border-radius:12px" :src="link.url" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          </div>

          <!-- Case 2: Custom Video Player Block -->
          <div v-else-if="link.icon === 'video_card'" class="w-full rounded-2xl overflow-hidden shadow-md bg-black relative aspect-video border border-white/10">
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

          <!-- Case 3: Standard Link Button -->
          <a
            v-else
            :href="link.url"
            target="_blank"
            @click="handleClick(link)"
            :class="[
              'w-full py-3.5 px-4 font-bold text-xs sm:text-sm flex items-center justify-between transition-all duration-300 shadow-sm relative group overflow-hidden',
              computedButtonClasses,
              profile?.font_class?.startsWith('custom:') ? '' : (profile?.font_class || 'font-sans')
            ]"
            :style="computedButtonStyles"
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
        </template>
      </div>

      <!-- Footer Watermark -->
      <div class="mt-auto pt-6 text-center">
        <span class="inline-flex items-center gap-1 text-[10px] font-bold opacity-40" :style="{ color: profile?.text_color }">
          <span class="material-symbols-outlined text-[12px] font-bold">eco</span>
          Powered by Avyro Link-in-Bio
        </span>
      </div>

    </div>
  </div>
</template>

<style scoped>
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
  border: 2px solid #000000 !important;
  box-shadow: 4px 4px 0px 0px #000000 !important;
  border-radius: 9999px;
}

.btn-glass {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.btn-outline {
  background-color: transparent !important;
  border: 2px solid currentColor !important;
  border-radius: 12px;
}

:deep(svg) {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}
</style>
