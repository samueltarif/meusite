<template>
  <div class="demo-shell min-h-screen font-body">
    <div class="relative z-50 flex min-h-10 flex-wrap items-center justify-center gap-x-5 gap-y-1 bg-[#101c35] px-4 py-2 text-center text-[11px] text-slate-300"><NuxtLink to="/#portfolio" class="font-medium text-white hover:underline">← Voltar à Avyro</NuxtLink><span>Projeto demonstrativo · empresa e atendimento ilustrativos</span><a :href="contact" target="_blank" rel="noopener noreferrer" class="font-semibold text-white underline underline-offset-4">Quero um site assim ↗</a></div>
    <main><slot /></main>
  </div>
</template>
<script setup lang="ts">
import { campaignWhatsapp } from '~/utils/campaign'
const route = useRoute()
const contact = computed<string>(() => campaignWhatsapp(`um site como o exemplo de ${route.path.split('/')[2] || 'empresa'}`))
</script>
<style>
.demo-shell :is(a, button, input, select, summary):focus-visible { outline: 3px solid #2563eb; outline-offset: 4px; }
.demo-shell [id] { scroll-margin-top: 30px; }
.demo-shell dialog::backdrop { background: rgb(0 0 0 / 75%); backdrop-filter: blur(4px); }
@media (prefers-reduced-motion: reduce) { .demo-shell * { transition: none !important; animation: none !important; } }
</style>
