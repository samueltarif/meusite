<script setup lang="ts">
import HomeHero from '~/components/campaign/HomeHero.vue'
import HomeExamples from '~/components/campaign/HomeExamples.vue'
import HomeSolutions from '~/components/campaign/HomeSolutions.vue'
import HomeClosing from '~/components/campaign/HomeClosing.vue'
definePageMeta({ layout: 'marketing' })
useSeoMeta({
  title: 'Avyro — Sites sob medida para o seu negócio',
  description: 'Sites profissionais para serviços e indústrias, com manutenção mensal opcional e painel sob medida. Converse com a Avyro sobre seu projeto.',
  ogTitle: 'Avyro Growth Company — Sites Profissionais e Landing Pages',
  ogDescription: 'Sites sob medida, manutenção opcional e painel para sua empresa. Conheça as possibilidades e converse com a Avyro.',
  twitterTitle: 'Avyro — Sites sob medida para o seu negócio',
  twitterDescription: 'Design, conteúdo e recursos pensados para sua empresa. Proposta personalizada pelo WhatsApp.',
  ogImage: 'https://avyro.com.br/favicon.png',
  twitterImage: 'https://avyro.com.br/favicon.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <HomeHero />
    <HomeExamples />
    <HomeSolutions />
    <HomeClosing />
  </div>
</template>
