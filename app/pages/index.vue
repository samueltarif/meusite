<script setup lang="ts">
import HomeHero from '~/components/campaign/HomeHero.vue'
import HomeExamples from '~/components/campaign/HomeExamples.vue'
import HomeSolutions from '~/components/campaign/HomeSolutions.vue'
import HomeClosing from '~/components/campaign/HomeClosing.vue'
definePageMeta({ layout: 'marketing' })
useMarketingSeo('Criação de sites profissionais e landing pages', 'Criação de sites para empresas, com design sob medida, manutenção mensal opcional e possibilidade de painel administrativo. Conheça a Avyro.', '/')
const origin = String(useRuntimeConfig().public.siteUrl).replace(/\/$/, '')
useHead({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Avyro', url: origin, logo: `${origin}/favicon.png`, telephone: '+55-11-95137-2631' }) }] })
</script>

<template>
  <div>
    <HomeHero />
    <HomeExamples />
    <HomeSolutions />
    <HomeClosing />
  </div>
</template>
