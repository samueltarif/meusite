<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
  tags?: string[]
  linkText?: string
  linkHref?: string
  featured?: boolean
}

defineProps<Props>()
</script>

<template>
  <div
    :class="[
      'rounded-xl p-8 card-hover transition-all duration-300 relative overflow-hidden',
      featured
        ? 'bg-primary-container border border-primary-container shadow-[0px_4px_20px_rgba(24,27,73,0.15)] flex flex-col justify-center'
        : 'bg-surface-light border border-border-subtle shadow-[0px_4px_20px_rgba(24,27,73,0.05)]'
    ]"
  >
    <!-- Background decoration for featured card -->
    <div
      v-if="featured"
      class="absolute right-0 bottom-0 opacity-10 pointer-events-none"
    >
      <span class="material-symbols-outlined text-[200px] text-white">monitoring</span>
    </div>

    <div :class="{ 'relative z-10': featured }">
      <!-- Icon (non-featured only) -->
      <div
        v-if="!featured"
        class="w-12 h-12 bg-secondary-fixed-dim rounded-lg flex items-center justify-center mb-6"
      >
        <span class="material-symbols-outlined text-primary-container">{{ icon }}</span>
      </div>

      <!-- Title -->
      <h3
        :class="[
          'font-heading text-headline-sm mb-3',
          featured ? 'text-on-primary' : 'text-primary-container'
        ]"
      >
        {{ title }}
      </h3>

      <!-- Description -->
      <p
        :class="[
          'mb-6',
          featured ? 'text-on-primary-container max-w-lg' : 'text-on-surface-variant'
        ]"
      >
        {{ description }}
      </p>

      <!-- Tags -->
      <div v-if="tags?.length" class="flex flex-wrap gap-2">
        <span
          v-for="tag in tags"
          :key="tag"
          class="bg-surface-container-low text-primary-container font-heading text-label-md px-3 py-1 rounded-full border border-border-subtle"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Link -->
      <span
        v-if="linkText"
        class="text-secondary font-heading text-label-md flex items-center gap-1 hover:underline cursor-pointer"
      >
        {{ linkText }}
        <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
      </span>

      <!-- Featured CTA -->
      <a
        v-if="featured && linkHref"
        :href="linkHref"
        class="inline-block bg-white text-primary-container font-heading text-label-md px-6 py-3 rounded-full hover:scale-105 transition-transform duration-200"
      >
        {{ linkText || 'Saiba mais' }}
      </a>
    </div>
  </div>
</template>
