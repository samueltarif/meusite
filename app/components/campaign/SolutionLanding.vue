<script setup lang="ts">
import { websiteSolutions } from '~/constants/websiteSolutions'
import { campaignWhatsapp } from '~/utils/campaign'
import type { WebsiteSolution } from '~/types/websiteSolutions'
defineProps<{ solution: WebsiteSolution }>()
</script>

<template>
  <article>
    <header class="mx-auto max-w-[1176px] px-5 py-14 md:px-8 md:py-20">
      <nav aria-label="Caminho da página" class="text-sm text-slate-500"><NuxtLink to="/">Avyro</NuxtLink> / {{ solution.label }}</nav>
      <p class="mt-10 text-xs font-semibold uppercase tracking-widest text-[#255bef]">Atendimento online em todo o Brasil</p>
      <h1 class="mt-5 max-w-4xl font-heading text-4xl font-semibold leading-tight tracking-tight md:text-6xl">{{ solution.title }}</h1>
      <p class="mt-7 max-w-3xl text-lg leading-8 text-slate-600">{{ solution.intro }}</p>
      <a id="solution-contact" :href="campaignWhatsapp(solution.label.toLowerCase())" target="_blank" rel="noopener noreferrer" class="mt-8 inline-flex min-h-12 items-center rounded-lg bg-[#255bef] px-6 py-4 font-semibold text-white">Conversar sobre meu projeto ↗</a>
    </header>
    <section class="bg-slate-50 px-5 py-14 md:px-8">
      <div class="mx-auto max-w-[1112px]"><h2 class="max-w-3xl font-heading text-3xl font-semibold">{{ solution.heading }}</h2>
        <div class="mt-10 grid gap-8 lg:grid-cols-3"><section v-for="item in solution.sections" :key="item.title" class="border-t border-slate-300 pt-6"><h3 class="text-xl font-semibold">{{ item.title }}</h3><p class="mt-4 leading-8 text-slate-600">{{ item.text }}</p></section></div>
      </div>
    </section>
    <div class="mx-auto grid max-w-[1176px] gap-12 px-5 py-16 md:grid-cols-2 md:px-8">
      <section><h2 class="text-2xl font-semibold">O que preparar para a primeira conversa</h2><ul class="mt-6 space-y-4"><li v-for="item in solution.checklist" :key="item" class="border-b border-slate-200 pb-3 text-slate-600">{{ item }}</li></ul><p class="mt-6 text-sm leading-7 text-slate-500">O briefing, a revisão e o acompanhamento podem acontecer online. Páginas, funcionalidades, responsabilidades e prazo são definidos em uma proposta personalizada.</p></section>
      <section><h2 class="text-2xl font-semibold">{{ solution.question }}</h2><p class="mt-6 leading-8 text-slate-600">{{ solution.answer }}</p><NuxtLink to="/criacao-de-sites" class="mt-7 inline-flex py-3 font-semibold text-[#255bef]">Conheça os sites por segmento ↗</NuxtLink><NuxtLink to="/modelos-site" class="block py-3 font-semibold text-[#255bef]">Explore os modelos demonstrativos ↗</NuxtLink></section>
    </div>
    <nav aria-label="Outras soluções" class="mx-auto flex max-w-[1176px] flex-wrap gap-x-8 gap-y-3 px-5 pb-14 md:px-8"><template v-for="item in websiteSolutions" :key="item.path"><NuxtLink v-if="item.path !== solution.path" :to="item.path" class="py-3 text-sm font-semibold text-[#255bef]">{{ item.label }} ↗</NuxtLink></template></nav>
  </article>
</template>
