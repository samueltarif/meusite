<script setup lang="ts">
import { campaignWhatsapp } from '~/utils/campaign'
const solutions = [
  { number: '01', title: 'Um site que faz sentido para você.', text: 'Da página de serviços ao catálogo industrial. Estrutura, conteúdo e design pensados para apresentar o que sua empresa faz.', tags: ['Institucional', 'Landing page', 'Catálogo'], subject: 'a criação de um site sob medida' },
  { number: '02', title: 'Seu site continua bem cuidado.', text: 'Acompanhamento mensal opcional para atualizações de conteúdo, suporte e melhorias. O escopo acompanha a necessidade do seu negócio.', tags: ['Atualizações', 'Suporte', 'Melhorias'], subject: 'manutenção mensal para meu site' },
  { number: '03', title: 'Autonomia para o dia a dia.', text: 'Seu projeto pode incluir um painel para atualizar fotos, serviços, projetos ou produtos. Os recursos são definidos na proposta.', tags: ['Conteúdo', 'Produtos', 'Projetos'], subject: 'um site com painel administrativo sob medida' },
]
</script>
<template>
  <section id="services" class="bg-[#f5f7fb] px-5 py-16 md:px-8 md:py-24"><div class="mx-auto max-w-[1176px]"><p class="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#255bef]">Do lançamento aos próximos passos</p><h2 class="max-w-2xl font-heading text-3xl font-semibold leading-tight tracking-[-0.04em] md:text-[42px]">O projeto começa no site.<br>A parceria pode continuar.</h2><div class="mt-12 grid gap-7 md:grid-cols-3"><article v-for="item in solutions" :key="item.number" class="flex flex-col border-t border-slate-300 pt-6"><span class="mb-9 text-sm text-slate-400">/ {{ item.number }}</span><h3 class="max-w-xs font-heading text-2xl font-semibold leading-snug tracking-tight">{{ item.title }}</h3><p class="mt-4 flex-1 text-base leading-7 text-slate-500">{{ item.text }}</p><div class="my-6 flex flex-wrap gap-2"><span v-for="tag in item.tags" :key="tag" class="rounded bg-white px-2.5 py-1 text-xs text-slate-500">{{ tag }}</span></div><a :href="campaignWhatsapp(item.subject)" target="_blank" rel="noopener noreferrer" class="self-start text-sm font-semibold hover:text-[#255bef]">Conversar sobre essa solução ↗</a></article></div></div></section>
</template>
