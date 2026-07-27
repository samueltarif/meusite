<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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

async function handleClick(link: LinkItem) {
  try {
    await supabase.rpc('increment_link_click', { link_id: link.id })
  } catch (err) {
    console.error('Click track error:', err)
  }
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
    :style="pageCssStyle"
    :class="profile?.font_class || 'font-sans'"
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
        <a
          v-for="link in links"
          :key="link.id"
          :href="link.url"
          target="_blank"
          @click="handleClick(link)"
          :class="[
            'w-full py-3.5 px-5 text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.02] shadow-sm',
            profile?.roundness || 'rounded-full',
            profile?.btn_border || '',
            profile?.font_class || 'font-sans'
          ]"
          :style="{
            backgroundColor: profile?.btn_bg_color || '#ffffff',
            color: profile?.btn_text_color || '#111111'
          }"
        >
          <div v-if="link.icon && brandIcons[link.icon]" class="w-5 h-5 shrink-0 flex items-center justify-center" v-html="brandIcons[link.icon]"></div>
          <span v-else-if="link.icon" class="material-symbols-outlined text-[18px] shrink-0">{{ link.icon }}</span>
          <span>{{ link.title }}</span>
        </a>
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
