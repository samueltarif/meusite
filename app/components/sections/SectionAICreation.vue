<script setup lang="ts">
import { defineAsyncComponent, h } from 'vue'

const FallbackComponent = {
  render() {
    return h('div')
  }
}

const DotLottieVue = defineAsyncComponent({
  loader: async () => {
    try {
      if (typeof window !== 'undefined' && !window.WebAssembly) return FallbackComponent
      const m = await import('@lottiefiles/dotlottie-vue')
      return m.DotLottieVue
    } catch (err) {
      console.warn('Lottie AI creation load error:', err)
      return FallbackComponent
    }
  },
  onError(error, retry, fail) {
    console.warn('Lottie AI creation error:', error)
    fail()
  }
})

const features = [
  {
    icon: 'auto_awesome',
    title: 'Layouts Personalizados',
    description: 'Nossa inteligência artificial cria estruturas sob medida baseadas na identidade visual da sua marca.',
  },
  {
    icon: 'psychology',
    title: 'Copywriting Persuasivo',
    description: 'Textos focados em conversão e vendas gerados por modelos de linguagem avançados para o seu nicho.',
  },
  {
    icon: 'code_blocks',
    title: 'Código Limpo e Otimizado',
    description: 'Sites gerados com padrões modernos de desenvolvimento, garantindo velocidade máxima de carregamento.',
  },
]
</script>

<template>
  <section
    id="ai-creation"
    class="py-section-padding-mobile lg:py-section-padding-desktop bg-surface border-t border-border-subtle"
  >
    <div class="max-w-container-max mx-auto px-margin-mobile lg:px-gutter grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
      <!-- Left side: Animation -->
      <div class="lg:col-span-6 flex justify-center items-center order-2 lg:order-1">
        <div class="relative w-full max-w-[450px] aspect-[5/6] bg-surface-container-low rounded-2xl overflow-hidden border border-border-subtle shadow-lg flex items-center justify-center p-4">
          <!-- Decorative glow -->
          <div class="absolute -top-10 -left-10 w-40 h-40 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />
          <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-on-tertiary-container/10 rounded-full blur-2xl pointer-events-none" />

          <ClientOnly>
            <template #fallback>
              <div class="w-full h-full bg-surface-variant/20 animate-pulse rounded-xl flex items-center justify-center">
                <span class="material-symbols-outlined text-primary-container/20 text-6xl">insights</span>
              </div>
            </template>
            <DotLottieVue
              class="w-full h-full"
              autoplay
              loop
              src="/about-us.json"
              :renderConfig="{
                layout: {
                  fit: 'contain',
                  align: [0.5, 0.5]
                }
              }"
            />
          </ClientOnly>
        </div>
      </div>

      <!-- Right side: Text Content -->
      <div class="lg:col-span-6 flex flex-col items-start gap-6 order-1 lg:order-2">
        <!-- AI Badge -->
        <span class="inline-flex items-center gap-1.5 bg-secondary-container/20 text-on-secondary-fixed-variant font-heading text-label-md px-3.5 py-1.5 rounded-full border border-secondary-container/30">
          <span class="material-symbols-outlined text-[18px] animate-pulse">insights</span>
          IA Generativa
        </span>

        <!-- Title -->
        <h2 class="font-heading text-headline-lg-mobile lg:text-headline-md text-primary-container leading-tight">
          Criação Ultra Rápida com <span class="text-gradient font-bold bg-gradient-to-r from-secondary to-on-tertiary-container">Inteligência Artificial</span>
        </h2>

        <!-- Description -->
        <p class="font-body text-body-md text-on-surface-variant">
          Combinamos a criatividade humana com os modelos de IA Generativa mais avançados do mercado para desenvolver seu projeto em tempo recorde e com máxima performance.
        </p>

        <!-- Features list -->
        <div class="space-y-4 w-full mt-2">
          <div
            v-for="feat in features"
            :key="feat.title"
            class="flex gap-4 items-start bg-surface-container-low/50 hover:bg-surface-container-low transition-colors duration-200 p-4 rounded-xl border border-border-subtle/50"
          >
            <div class="w-10 h-10 bg-secondary-fixed-dim rounded-lg flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-primary-container">{{ feat.icon }}</span>
            </div>
            <div>
              <h4 class="font-heading text-body-lg text-primary-container font-semibold mb-1">
                {{ feat.title }}
              </h4>
              <p class="font-body text-sm text-on-surface-variant">
                {{ feat.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <a
          href="https://wa.me/5511951372631?text=Olá! Gostaria de falar com um especialista sobre criação de sites com inteligência artificial."
          target="_blank"
          rel="noopener noreferrer"
          class="action-gradient-bg text-on-primary font-heading text-label-md px-8 py-4 rounded-full hover:scale-[1.02] transition-transform duration-200 shadow-md w-full sm:w-auto text-center mt-4"
        >
          Contatar um Especialista
        </a>
      </div>
    </div>
  </section>
</template>
