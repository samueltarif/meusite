<script setup lang="ts">
import { campaignWhatsapp } from '~/utils/campaign'
</script>

<template>
  <section id="home" class="mx-auto max-w-[1240px] px-5 pb-10 pt-12 md:px-8 md:pb-16 md:pt-20">
    <div class="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
      <div>
        <p class="mb-6 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"><span class="h-1.5 w-1.5 rounded-full bg-[#255bef]" />Seu próximo passo começa aqui</p>
        <h1 class="max-w-[720px] font-heading text-[clamp(2rem,9vw,42px)] font-bold leading-[1.08] tracking-[-0.055em] sm:text-[58px] lg:text-[68px]">Seu negócio merece<br class="hidden sm:block"> um site <span class="text-[#255bef]">à altura.</span></h1>
        <p class="mt-7 max-w-[490px] text-base leading-[1.8] text-slate-500 md:text-lg">Sites sob medida para apresentar sua empresa e gerar novas oportunidades. Com manutenção mensal opcional e possibilidade de painel sob medida.</p>
        <div class="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a id="hero-whatsapp" :href="campaignWhatsapp()" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-5 rounded-lg bg-[#255bef] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#1949d1]">Conversar sobre meu site <span aria-hidden="true">↗</span></a>
          <a href="#portfolio" class="inline-flex items-center justify-center gap-3 px-3 py-3 text-sm font-semibold text-[#101c35] hover:text-[#255bef]">Explorar os exemplos <span aria-hidden="true">↓</span></a>
        </div>
        <p class="mt-5 text-xs text-slate-400">Uma conversa para entender seu negócio. Uma proposta feita para ele.</p>
      </div>
      <div class="min-w-0">
        <div class="overflow-hidden rounded-[20px] bg-slate-100">
          <div class="flex items-center justify-between border-b border-slate-200 bg-[#f8fafc] px-5 py-3 text-[11px] text-slate-400"><span class="flex gap-1.5" aria-hidden="true"><i class="h-2 w-2 rounded-full bg-slate-300" /><i class="h-2 w-2 rounded-full bg-slate-300" /><i class="h-2 w-2 rounded-full bg-slate-300" /></span><span>Um novo endereço para sua marca</span><span aria-hidden="true">↗</span></div>
          <img src="/images/campaign/architecture-1.jpg" alt="Arquitetura contemporânea em uma apresentação visual de projeto" width="1200" height="960" fetchpriority="high" class="aspect-[5/4] w-full object-cover">
          <div class="flex items-center justify-between bg-[#f4f6f9] gap-3 px-4 py-5 sm:px-6"><div><p class="text-[10px] uppercase tracking-[0.2em] text-slate-500">Design que valoriza seu trabalho</p><p class="mt-1 font-heading text-lg font-semibold">Pensado para o seu universo.</p></div><span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 text-xl" aria-hidden="true">↗</span></div>
        </div>
        <div class="ml-auto mt-4 flex w-fit max-w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#255bef]" aria-hidden="true">✓</span><div class="min-w-0 text-xs leading-relaxed"><p class="font-semibold">Do primeiro clique ao contato.</p><p class="mt-1 text-slate-500">Cada detalhe tem um propósito.</p></div></div>
      </div>
    </div>
    <div class="mt-16 grid grid-cols-1 gap-5 min-[380px]:grid-cols-2 border-y border-slate-200 py-6 text-[13px] font-medium text-slate-500 md:mt-20 md:grid-cols-4">
      <span>01 <span class="ml-2 text-[#101c35]">Design sob medida</span></span><span>02 <span class="ml-2 text-[#101c35]">Feito para o celular</span></span><span>03 <span class="ml-2 text-[#101c35]">Manutenção opcional</span></span><span>04 <span class="ml-2 text-[#101c35]">Contato direto</span></span>
    </div>
  </section>
</template>
