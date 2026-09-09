<script setup lang="ts">
import HomeExamples from '~/components/campaign/HomeExamples.vue'
import { campaignWhatsapp } from '~/utils/campaign'
definePageMeta({ layout: 'marketing' })
useMarketingSeo('Modelos de sites profissionais para empresas', 'Explore modelos para indústria, fotografia, floriculturas e serviços. Conheça as possibilidades de um site sob medida para sua empresa.', '/modelos-site')
const segments = [
  { name: 'Advocacia', text: 'Áreas de atuação, equipe e conteúdo institucional para apresentar o escritório.' },
  { name: 'Medicina & saúde', text: 'Especialidades, profissionais e orientações para quem procura atendimento.' },
  { name: 'Imobiliária', text: 'Imóveis, detalhes de cada oportunidade e contato com o corretor.' },
  { name: 'Gastronomia', text: 'Cardápio, ambiente, localização e informações para planejar uma visita.' },
  { name: 'Finanças', text: 'Serviços de consultoria, perfil profissional e apresentação da sua abordagem.' },
  { name: 'Estética & beleza', text: 'Procedimentos, cuidados e apresentação dos profissionais do espaço.' },
  { name: 'Educação', text: 'Cursos, programas e informações para quem está escolhendo onde aprender.' },
  { name: 'Tecnologia', text: 'O que seu produto resolve, como funciona e formas de falar com a equipe.' },
]
</script>
<template>
  <div>
    <section class="mx-auto max-w-[1240px] px-5 pb-2 pt-14 md:px-8 md:pt-20">
      <NuxtLink to="/" class="text-sm text-slate-500 hover:text-blue-600">← Voltar para a Avyro</NuxtLink>
      <p class="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-[#255bef]">Encontre inspiração para o seu negócio</p>
      <h1 class="mt-5 max-w-3xl font-heading text-4xl font-semibold leading-tight tracking-[-0.045em] md:text-6xl">Seu segmento tem uma história.<br>Seu site também pode ter.</h1>
      <p class="mt-6 max-w-2xl text-base leading-8 text-slate-500">Navegue pelos exemplos completos e imagine as possibilidades para a sua empresa. Conteúdo, identidade e funcionalidades são definidos em uma proposta sob medida.</p>
    </section>
    <HomeExamples hide-more />
    <section class="border-t border-slate-200 bg-slate-50 px-5 py-16 md:px-8">
      <div class="mx-auto max-w-[1176px]"><p class="text-xs font-semibold uppercase tracking-widest text-[#255bef]">Outras possibilidades</p><h2 class="mt-4 font-heading text-3xl font-semibold tracking-tight">Seu negócio não está nos exemplos?</h2><p class="mt-4 max-w-2xl text-base leading-7 text-slate-500">Também desenvolvemos projetos para estes segmentos. Cada proposta começa entendendo o que seus clientes precisam encontrar.</p>
        <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><article v-for="segment in segments" :key="segment.name" class="flex flex-col border border-slate-200 bg-white p-6"><p class="text-xs font-medium text-slate-400">Projeto sob medida</p><h3 class="mt-4 text-lg font-semibold">{{ segment.name }}</h3><p class="mb-7 mt-3 text-sm leading-7 text-slate-500">{{ segment.text }}</p><a :href="campaignWhatsapp(`um site para o segmento de ${segment.name}`)" target="_blank" rel="noopener noreferrer" class="mt-auto text-sm font-semibold text-[#255bef]">Conversar sobre meu projeto ↗</a></article></div>
      </div>
    </section>
    <section class="mx-auto max-w-[1240px] px-5 py-16 md:px-8"><h2 class="font-heading text-3xl font-semibold tracking-tight">Um site para agora. Apoio para depois.</h2><p class="mt-5 max-w-2xl text-base leading-8 text-slate-500">Depois da entrega, você pode contar com manutenção mensal opcional. Se precisar atualizar conteúdo por conta própria, um painel administrativo pode fazer parte do escopo do seu projeto.</p><a :href="campaignWhatsapp()" target="_blank" rel="noopener noreferrer" class="mt-7 inline-block rounded-lg bg-[#255bef] px-6 py-4 text-sm font-semibold text-white hover:bg-blue-700">Vamos conversar sobre seu site ↗</a></section>
  </div>
</template>
