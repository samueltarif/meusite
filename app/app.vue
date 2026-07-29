<script setup lang="ts">
import { onErrorCaptured } from 'vue'

useHead({
  meta: [
    { name: 'facebook-domain-verification', content: 'rbfzh3fs2akz2hhu5x9w6nhojwae09' }
  ]
})

onErrorCaptured((err) => {
  console.warn('App-level captured error (prevented app crash):', err)
  return false
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
