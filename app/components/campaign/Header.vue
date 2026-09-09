<script setup lang="ts">
import { campaignWhatsapp } from '~/utils/campaign'

const isOpen = ref<boolean>(false)
const route = useRoute()
const links = [
  { label: 'Exemplos', to: '/#portfolio' },
  { label: 'Soluções', to: '/#services' },
  { label: 'Como funciona', to: '/#processo' },
]
watch(() => route.fullPath, () => { isOpen.value = false })
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-lg">
    <div class="mx-auto flex h-16 md:h-20 max-w-[1240px] items-center justify-between gap-6 px-5 md:px-8">
      <NuxtLink to="/" aria-label="Avyro — página inicial" class="flex items-center gap-2 text-[#101c35]">
        <span class="font-heading text-[29px] font-extrabold tracking-[-0.07em]">avyro<span class="text-[#255bef]">.</span></span>
        <span class="ml-3 hidden border-l border-slate-200 pl-4 text-[11px] font-semibold uppercase leading-relaxed tracking-[0.17em] text-slate-500 lg:block">Sites feitos<br>para o seu negócio</span>
      </NuxtLink>
      <nav aria-label="Navegação principal" class="hidden items-center gap-8 lg:flex">
        <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="text-sm font-medium text-slate-600 transition-colors hover:text-[#255bef]">{{ link.label }}</NuxtLink>
      </nav>
      <a :href="campaignWhatsapp()" target="_blank" rel="noopener noreferrer" class="hidden items-center gap-3 rounded-lg bg-[#255bef] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1949d1] lg:inline-flex">Vamos conversar <span aria-hidden="true">↗</span></a>
      <button class="rounded-lg border border-slate-200 px-4 py-2 text-sm lg:hidden" :aria-expanded="isOpen" aria-controls="campaign-menu" @click="isOpen = !isOpen">{{ isOpen ? 'Fechar' : 'Menu' }}</button>
    </div>
    <nav v-if="isOpen" id="campaign-menu" aria-label="Navegação no celular" class="space-y-1 border-t border-slate-100 px-5 py-4 lg:hidden" @keydown.esc="isOpen = false">
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="block rounded-lg px-3 py-3 text-slate-700" @click="isOpen = false">{{ link.label }}</NuxtLink>
      <a :href="campaignWhatsapp()" target="_blank" rel="noopener noreferrer" class="block rounded-lg bg-[#255bef] px-3 py-3 font-semibold text-white">Conversar sobre meu site ↗</a>
    </nav>
  </header>
</template>
