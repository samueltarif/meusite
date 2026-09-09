<script setup lang="ts">
import { isCampaignPath, validAdsConfig } from '~/utils/ads'
const config = useRuntimeConfig().public
const route = useRoute()
const enabled = computed(() => validAdsConfig(String(config.googleAdsId), String(config.googleAdsConversionLabel)) && isCampaignPath(route.path))
const { choice, editing, select } = useAdsConsent()
</script>
<template>
  <ClientOnly><div v-if="enabled" class="font-body text-[#101c35]"><section v-if="choice === null || editing" aria-label="Preferências de medição" class="fixed bottom-3 left-3 right-3 z-[100] mx-auto max-w-xl rounded-xl border border-slate-300 bg-white p-5 shadow-xl"><p class="text-base font-semibold">Medição de anúncios</p><p class="mt-2 text-sm leading-6 text-slate-600">Você permite cookies do Google para medir quais anúncios levam a cliques no WhatsApp? O site funciona normalmente se você recusar. <NuxtLink to="/politica-de-privacidade" class="underline">Privacidade</NuxtLink></p><div class="mt-4 grid grid-cols-2 gap-3"><button class="min-h-11 rounded border border-slate-400 px-4 py-3 text-sm" @click="select('denied')">Recusar</button><button class="min-h-11 rounded border border-slate-400 px-4 py-3 text-sm" @click="select('accepted')">Permitir medição</button></div></section><button v-else class="fixed bottom-2 left-2 z-40 min-h-11 rounded border border-slate-200 bg-white px-3 text-xs shadow-sm" @click="editing = true">Preferências de cookies</button></div></ClientOnly>
</template>
