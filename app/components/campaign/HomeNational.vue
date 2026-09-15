<script setup lang="ts">
import { websiteSolutions } from '~/constants/websiteSolutions'
</script>
<template>
  <section class="mx-auto grid max-w-[1240px] gap-10 px-5 py-16 md:px-8 lg:grid-cols-2">
    <div><p class="text-xs font-semibold uppercase tracking-widest text-[#255bef]">Da sua empresa para novos clientes</p><h2 class="mt-5 font-heading text-3xl font-semibold tracking-tight md:text-4xl">Criação de sites com atendimento em todo o Brasil.</h2><p class="mt-6 leading-8 text-slate-600">O projeto pode acontecer inteiramente online: conversamos sobre o seu negócio, organizamos os materiais e revisamos as páginas antes da publicação. Sua empresa participa das decisões de conteúdo e design, onde estiver.</p><p class="mt-4 leading-8 text-slate-600">Para começar, conte quais serviços quer divulgar, quem deseja alcançar e o que precisa atualizar no dia a dia. Essas informações ajudam a escolher entre site institucional, landing page ou catálogo com painel.</p></div>
    <div><h3 class="text-xl font-semibold">Qual solução combina com seu momento?</h3><div class="mt-6 divide-y divide-slate-200"><NuxtLink v-for="solution in websiteSolutions" :key="solution.path" :to="solution.path" class="block py-5 transition-colors hover:text-[#255bef]"><span class="font-semibold">{{ solution.label }} ↗</span><p class="mt-2 text-sm leading-7 text-slate-500">{{ solution.description }}</p></NuxtLink></div></div>
  </section>
</template>
