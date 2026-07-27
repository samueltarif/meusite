<script setup lang="ts">
import { onErrorCaptured } from 'vue'

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
