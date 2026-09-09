<script setup lang="ts">
import '~/assets/css/campaign-mobile.css'
import CampaignHeader from '~/components/campaign/Header.vue'
import CampaignFooter from '~/components/campaign/Footer.vue'
</script>

<template>
  <div class="campaign-shell min-h-screen bg-white font-body text-[#101c35]">
    <a href="#main-content" class="sr-only z-[100] rounded bg-white p-4 text-[#255bef] focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Pular para o conteúdo</a>
    <CampaignHeader />
    <main id="main-content"><slot /></main>
    <CampaignFooter />
  </div>
</template>

<style>
.campaign-shell :is(a, button, input, select, summary):focus-visible { outline: 3px solid #255bef; outline-offset: 5px; }
.campaign-shell [id] { scroll-margin-top: 110px; }
@media (prefers-reduced-motion: reduce) {
  .campaign-shell *, .demo-shell * { scroll-behavior: auto !important; transition-duration: 0.01ms !important; animation: none !important; }
}
</style>
