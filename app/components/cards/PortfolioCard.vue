<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const DotLottieVue = defineAsyncComponent(() =>
  import('@lottiefiles/dotlottie-vue').then((m) => m.DotLottieVue)
)

interface Props {
  imageUrl?: string
  imageAlt?: string
  lottieUrl?: string
  videoUrl?: string
  category: string
  title: string
  description: string
  imagePosition?: string
  link?: string
}

defineProps<Props>()
</script>

<template>
  <!-- Link Card (NuxtLink) -->
  <NuxtLink
    v-if="link"
    :to="link"
    class="group rounded-xl overflow-hidden bg-surface-light border border-border-subtle shadow-[0px_4px_20px_rgba(24,27,73,0.05)] block cursor-pointer hover:border-primary-container/30 transition-all duration-300"
  >
    <!-- Media Container (Lottie, Video or Image) -->
    <div class="h-48 md:h-64 overflow-hidden relative bg-surface-container-low flex items-center justify-center">
      <!-- Render Video if videoUrl is provided -->
      <template v-if="videoUrl">
        <video
          :src="videoUrl"
          autoplay
          loop
          muted
          playsinline
          class="w-full h-full object-cover"
        />
      </template>

      <!-- Render Lottie if lottieUrl is provided -->
      <template v-else-if="lottieUrl">
        <ClientOnly>
          <template #fallback>
            <div class="w-full h-full bg-surface-variant/20 animate-pulse" />
          </template>
          <DotLottieVue
            class="w-full h-full"
            autoplay
            loop
            :src="lottieUrl"
            :renderConfig="{
              layout: {
                fit: 'cover',
                align: [0.5, 0.5]
              }
            }"
          />
        </ClientOnly>
      </template>

      <!-- Standard Image otherwise -->
      <template v-else-if="imageUrl">
        <img
          :src="imageUrl"
          :alt="imageAlt || title"
          :class="[
            'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500',
            imagePosition || 'object-center'
          ]"
          loading="lazy"
        >
      </template>
    </div>

    <!-- Content -->
    <div class="p-6">
      <span class="bg-surface-container-low text-on-surface-variant font-heading text-label-md px-2 py-1 rounded text-xs mb-3 inline-block">
        {{ category }}
      </span>
      <h4 class="font-heading text-headline-sm text-primary-container mb-2">
        {{ title }}
      </h4>
      <p class="text-on-surface-variant text-sm">
        {{ description }}
      </p>
    </div>
  </NuxtLink>

  <!-- Static Card (div) -->
  <div
    v-else
    class="group rounded-xl overflow-hidden bg-surface-light border border-border-subtle shadow-[0px_4px_20px_rgba(24,27,73,0.05)] block"
  >
    <!-- Media Container (Lottie, Video or Image) -->
    <div class="h-48 md:h-64 overflow-hidden relative bg-surface-container-low flex items-center justify-center">
      <!-- Render Video if videoUrl is provided -->
      <template v-if="videoUrl">
        <video
          :src="videoUrl"
          autoplay
          loop
          muted
          playsinline
          class="w-full h-full object-cover"
        />
      </template>

      <!-- Render Lottie if lottieUrl is provided -->
      <template v-else-if="lottieUrl">
        <ClientOnly>
          <template #fallback>
            <div class="w-full h-full bg-surface-variant/20 animate-pulse" />
          </template>
          <DotLottieVue
            class="w-full h-full"
            autoplay
            loop
            :src="lottieUrl"
            :renderConfig="{
              layout: {
                fit: 'cover',
                align: [0.5, 0.5]
              }
            }"
          />
        </ClientOnly>
      </template>

      <!-- Standard Image otherwise -->
      <template v-else-if="imageUrl">
        <img
          :src="imageUrl"
          :alt="imageAlt || title"
          :class="[
            'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500',
            imagePosition || 'object-center'
          ]"
          loading="lazy"
        >
      </template>
    </div>

    <!-- Content -->
    <div class="p-6">
      <span class="bg-surface-container-low text-on-surface-variant font-heading text-label-md px-2 py-1 rounded text-xs mb-3 inline-block">
        {{ category }}
      </span>
      <h4 class="font-heading text-headline-sm text-primary-container mb-2">
        {{ title }}
      </h4>
      <p class="text-on-surface-variant text-sm">
        {{ description }}
      </p>
    </div>
  </div>
</template>
