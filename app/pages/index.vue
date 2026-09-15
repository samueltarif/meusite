<script setup lang="ts">
import HomeHero from '~/components/campaign/HomeHero.vue'
import HomeExamples from '~/components/campaign/HomeExamples.vue'
import HomeSolutions from '~/components/campaign/HomeSolutions.vue'
import HomeClosing from '~/components/campaign/HomeClosing.vue'
import HomeNational from '~/components/campaign/HomeNational.vue'
definePageMeta({ layout: 'marketing' })
useMarketingSeo('Criação de sites profissionais para empresas', 'Sites e landing pages sob medida para empresas de todo o Brasil. Atendimento online, manutenção mensal opcional e painel administrativo. Conheça a Avyro.', '/')
const origin = String(useRuntimeConfig().public.siteUrl).replace(/\/$/, '')
useHead({ script: [{ key: 'marketing-identity', type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@graph': [{ '@type': 'Organization', '@id': `${origin}/#organization`, name: 'Avyro', url: `${origin}/`, logo: `${origin}/favicon.png`, telephone: '+55-11-95137-2631', areaServed: { '@type': 'Country', name: 'Brasil' } }, { '@type': 'WebSite', '@id': `${origin}/#website`, name: 'Avyro', url: `${origin}/`, inLanguage: 'pt-BR', publisher: { '@id': `${origin}/#organization` } }] }) }] })
</script>

<template>
  <div>
    <HomeHero />
    <HomeExamples />
    <HomeSolutions />
    <HomeNational />
    <HomeClosing />
  </div>
</template>
