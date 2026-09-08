<script setup lang="ts">
import { portfolioPhotos } from '~/constants/photography'
const slides = [portfolioPhotos[2]!, portfolioPhotos[1]!, portfolioPhotos[0]!]
const { index, current, choose } = useDemoChoice(slides)
</script>
<template>
  <section class="relative isolate min-h-[88svh] bg-[#191915] text-[#f4f0e7]">
    <img :src="current.image" :alt="current.alt" width="1800" height="1200" fetchpriority="high" class="absolute inset-0 -z-20 h-full w-full object-cover" :class="current.portrait ? 'object-[center_30%]' : 'object-center'">
    <div class="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/30 to-black/45" />
    <header class="flex flex-wrap items-center justify-between gap-6 border-b border-white/20 px-6 py-7 md:px-12"><NuxtLink to="/exemplos/fotografia" class="text-3xl font-medium tracking-[0.3em]">LUME<span class="ml-3 text-xs tracking-[0.15em]">FOTOGRAFIA</span></NuxtLink><nav aria-label="Lume" class="flex flex-wrap gap-6 text-sm"><a href="#colecoes" class="hover:underline">Coleções</a><a href="#olhar" class="hover:underline">O olhar</a><a href="#experiencia" class="hover:underline">Experiência</a><a href="#contato" class="hover:underline">Vamos criar ↗</a></nav></header>
    <div class="mx-auto flex min-h-[70svh] max-w-[1600px] flex-col justify-end px-6 pb-8 pt-24 md:px-12"><p class="text-sm uppercase tracking-[0.22em] text-[#d3c8b7]">Retratos · Encontros · Lugares</p><h1 class="mt-6 max-w-5xl font-['Playfair_Display'] text-5xl leading-[1.05] tracking-[-0.025em] sm:text-7xl lg:text-[100px]">A vida acontece.<br><em>A imagem fica.</em></h1><div class="mt-10 flex flex-col justify-between gap-8 md:flex-row md:items-end"><a href="#colecoes" class="inline-flex items-center gap-12 self-start border-b border-white/70 pb-3 text-base">Entre nas histórias <span aria-hidden="true">↓</span></a><div class="flex items-center gap-6"><p class="max-w-44 text-sm leading-6 text-[#d3c8b7]" aria-live="polite">{{ current.title }}</p><div role="group" aria-label="Fotografias da abertura" class="flex gap-2"><button v-for="(slide, i) in slides" :key="slide.id" :aria-label="`Exibir ${slide.title}`" :aria-pressed="index === i" class="h-11 w-11 border text-sm" :class="index === i ? 'border-white bg-white text-black' : 'border-white/50 hover:bg-white/20'" @click="choose(i)">0{{ i + 1 }}</button></div></div></div><p class="mt-7 text-xs text-[#c1b9ad]">Imagem de referência · {{ current.author }}</p></div>
  </section>
</template>
