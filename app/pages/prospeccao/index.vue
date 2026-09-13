<script setup lang="ts">
import Workspace from '~/components/prospecting/Workspace.vue'

definePageMeta({
  layout: false,
  middleware: ['prospecting-auth'],
})

useSeoMeta({
  title: 'Prospecção ativa | Avyro',
  description: 'Organize suas empresas, abordagens e retornos no painel de prospecção da Avyro.',
  robots: 'noindex, nofollow',
  ogTitle: 'Painel de prospecção Avyro',
  ogDescription: 'Área de trabalho para acompanhamento comercial.',
  twitterCard: 'summary',
})
</script>

<template>
  <Workspace />
</template>
