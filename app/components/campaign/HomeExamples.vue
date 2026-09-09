<script setup lang="ts">
defineProps<{ hideMore?: boolean }>()
import { demoProjects } from '~/constants/campaign'
</script>
<template>
  <section id="portfolio" class="mx-auto max-w-[1240px] px-5 py-14 md:px-8 md:py-20">
    <div class="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p class="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#255bef]">Possibilidades, na prática</p><h2 class="font-heading text-3xl font-semibold leading-tight tracking-[-0.04em] md:text-[42px]">Negócios diferentes.<br>Sites com personalidade.</h2></div><p class="max-w-sm text-base leading-7 text-slate-500">Explore projetos demonstrativos de diferentes segmentos. Cada um foi pensado para a forma como aquele negócio apresenta, atende e vende.</p></div>
    <div class="grid gap-x-8 gap-y-12 md:grid-cols-2">
      <NuxtLink v-for="project in (hideMore ? demoProjects : demoProjects.slice(0, 4))" :key="project.slug" :to="`/exemplos/${project.slug}`" class="group block">
        <div class="relative overflow-hidden rounded-xl bg-slate-100"><img :src="project.image" :alt="project.imageAlt" loading="lazy" width="1000" height="650" class="aspect-[1.55] w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"><span class="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-700">Projeto demonstrativo</span><span class="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-slate-900 transition-colors group-hover:bg-[#255bef] group-hover:text-white" aria-hidden="true">↗</span></div>
        <div class="mt-5 flex items-start justify-between gap-4"><div><p class="text-[10px] font-semibold tracking-[0.15em] text-slate-400">{{ project.segment }}</p><h3 class="mt-2 font-heading text-2xl font-semibold tracking-tight">{{ project.name }}</h3><p class="mt-2 max-w-md text-base leading-6 text-slate-500">{{ project.summary }}</p></div><span class="pt-1 text-xs text-slate-400">{{ project.number }}</span></div>
      </NuxtLink>
    </div>
    <div class="mt-8"><NuxtLink to="/criacao-de-sites" class="inline-flex min-h-11 items-center text-sm font-semibold text-[#255bef]">Conheça a criação de sites para o seu segmento →</NuxtLink></div>
    <div v-if="!hideMore" class="mt-12 border-t border-slate-200 pt-6"><NuxtLink to="/modelos-site" class="text-sm font-semibold text-[#255bef]">Explore todos os modelos e segmentos <span aria-hidden="true">→</span></NuxtLink></div>
  </section>
</template>
