<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const isDashboard = computed(() => route.path.startsWith('/dashboard'))
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#FCFCFC]">
    <LayoutHeader v-if="!isDashboard" />

    <main class="flex-grow w-full">
      <slot />
    </main>

    <LayoutFooter v-if="!isDashboard" />
    <LayoutBottomNav v-if="!isDashboard" />
  </div>
</template>
