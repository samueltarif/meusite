<script setup lang="ts">
import WorkshopPage from '~/components/oficina/WorkshopPage.vue'

definePageMeta({ layout: 'demonstracao' })

useHead({
  title: 'Mecânica São Paulo — Oficina Mecânica Especializada em São Caetano do Sul',
  meta: [
    {
      name: 'description',
      content: 'Manutenção preventiva e corretiva com transparência, precisão técnica e garantia em São Caetano do Sul. Motor, injeção eletrônica, câmbio automático, freios e suspensão.'
    }
  ],
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
    }
  ]
})
</script>

<template>
  <div>
    <WorkshopPage />
  </div>
</template>
