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
  ]
})
</script>

<template>
  <div>
    <WorkshopPage />
  </div>
</template>
