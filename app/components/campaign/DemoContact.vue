<script setup lang="ts">
import { campaignWhatsapp } from '~/utils/campaign'
defineProps<{ name: string; subject: string; title: string }>()
</script>
<template>
  <section id="contato" class="border-t border-current/15 px-6 py-16 md:px-12">
    <div class="mx-auto flex max-w-6xl flex-col justify-between gap-8 md:flex-row md:items-center">
      <div><p class="text-sm opacity-70">{{ name }} · Modelo demonstrativo</p><h2 class="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">{{ title }}</h2><p class="mt-4 max-w-xl text-base leading-7 opacity-70">Converse com a Avyro sobre um site sob medida, com manutenção mensal opcional.</p></div>
      <a :href="campaignWhatsapp(subject)" target="_blank" rel="noopener noreferrer" class="inline-flex shrink-0 items-center justify-center gap-6 rounded-full bg-[#101c35] px-7 py-4 text-sm font-semibold text-white hover:bg-[#255bef]">Quero um site assim <span aria-hidden="true">↗</span></a>
    </div>
  </section>
  <footer class="flex flex-wrap justify-between gap-4 border-t border-current/15 px-6 py-6 text-sm md:px-12"><span>{{ name }} · Empresa fictícia, imagens ilustrativas.</span><NuxtLink to="/modelos-site" class="underline underline-offset-4">Explorar modelos Avyro ↗</NuxtLink></footer>
</template>
