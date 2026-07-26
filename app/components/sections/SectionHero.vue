<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const DotLottieVue = defineAsyncComponent(() =>
  import('@lottiefiles/dotlottie-vue').then((m) => m.DotLottieVue)
)

const badges = [
  { icon: 'check_circle', label: 'Design Exclusivo' },
  { icon: 'speed', label: 'Alta Performance' },
  { icon: 'trending_up', label: 'Foco em Conversão' },
]
</script>

<template>
  <section
    id="home"
    class="relative pt-32 pb-section-padding-mobile lg:py-section-padding-desktop px-margin-mobile lg:px-0 flex flex-col items-center text-center overflow-hidden min-h-[90vh] lg:min-h-screen justify-center"
  >
    <!-- Background Lottie Animation -->
    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      <!-- Dark overlay gradient to ensure text readability and smooth transition to next section -->
      <div class="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/60 to-primary z-10" />
      
      <ClientOnly>
        <template #fallback>
          <div class="absolute inset-0 bg-primary" />
        </template>
        <DotLottieVue
          class="w-full h-full"
          autoplay
          loop
          src="/earth-animation.json"
          :renderConfig="{
            layout: {
              fit: 'cover',
              align: [0.5, 0.5]
            }
          }"
        />
      </ClientOnly>
    </div>

    <div class="max-w-container-max mx-auto flex flex-col items-center gap-6 relative z-20 px-margin-mobile lg:px-gutter">
      <!-- Headline -->
      <h1 class="font-heading text-headline-lg-mobile lg:text-display-lg text-on-primary max-w-4xl tracking-tight leading-tight drop-shadow-md">
        Crie seu Site Profissional e
        <span class="text-gradient">Venda Mais</span>
      </h1>

      <!-- Subtitle -->
      <p class="font-body text-body-md lg:text-body-lg text-on-primary/90 max-w-2xl mb-4 drop-shadow">
        Transforme sua presença online com sites de alta performance, focados em conversão e design premium. Atraia os clientes certos.
      </p>

      <!-- CTA -->
      <a
        href="#orcamento"
        class="action-gradient-bg text-on-primary font-heading text-label-md px-8 py-4 rounded-full hover:scale-[1.02] transition-transform duration-200 shadow-[0px_4px_20px_rgba(35,147,230,0.4)] w-full lg:w-auto text-center"
      >
        Quero um Orçamento
      </a>

      <!-- Trust Badges -->
      <div class="mt-12 flex gap-6 lg:gap-8 items-center justify-center opacity-90 flex-wrap">
        <div
          v-for="badge in badges"
          :key="badge.label"
          class="flex items-center gap-2 bg-primary/45 backdrop-blur-md px-4 py-2 rounded-full border border-white/5"
        >
          <span class="material-symbols-outlined text-secondary-fixed">{{ badge.icon }}</span>
          <span class="text-on-primary font-body text-body-md">{{ badge.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
