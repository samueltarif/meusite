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
      'rounded-2xl p-8 card-hover transition-all duration-300 relative overflow-hidden flex flex-col justify-between',
      featured
        ? 'bg-primary-container border border-primary-container shadow-[0px_4px_20px_rgba(24,27,73,0.15)] text-white'
        : 'bg-surface-light border border-border-subtle shadow-[0px_4px_20px_rgba(24,27,73,0.05)]'
    ]"
  >
    <!-- Background decoration for featured card -->
    <div
      v-if="featured"
      class="absolute -right-4 -bottom-4 opacity-10 pointer-events-none select-none"
    >
      <span class="material-symbols-outlined text-[180px] text-white">monitoring</span>
    </div>

    <div :class="{ 'relative z-10': featured }">
      <!-- Icon (non-featured only) -->
      <div
        v-if="!featured"
        class="w-12 h-12 bg-secondary-fixed-dim rounded-xl flex items-center justify-center mb-6"
      >
        <span class="material-symbols-outlined text-primary-container text-2xl">{{ icon }}</span>
      </div>

      <!-- Title -->
      <h3
        :class="[
          'font-heading text-headline-sm mb-3 font-bold',
          featured ? 'text-white' : 'text-primary-container'
        ]"
      >
        {{ title }}
      </h3>

      <!-- Description -->
      <p
        :class="[
          'mb-6 leading-relaxed',
          featured ? 'text-white/90 max-w-lg' : 'text-on-surface-variant'
        ]"
      >
        {{ description }}
      </p>

      <!-- Tags -->
      <div v-if="tags?.length" class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in tags"
          :key="tag"
          class="bg-surface-container-low text-primary-container font-heading text-label-md px-3 py-1 rounded-full border border-border-subtle"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Non-featured Link -->
      <span
        v-if="linkText && !featured"
        class="text-secondary font-heading text-label-md inline-flex items-center gap-1 hover:underline cursor-pointer mt-2 font-bold"
      >
        {{ linkText }}
        <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
      </span>

      <!-- Featured CTA Button -->
      <div v-if="featured && linkHref" class="mt-4">
        <a
          :href="linkHref"
          class="inline-flex items-center justify-center bg-white text-primary-container font-heading text-label-md px-6 py-3 rounded-full hover:scale-105 transition-all duration-200 shadow-md font-bold"
        >
          {{ linkText || 'Falar com Consultor' }}
          <span class="material-symbols-outlined text-[18px] ml-1.5">arrow_forward</span>
        </a>
      </div>
    </div>
  </div>
</template>
