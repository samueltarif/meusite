<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const DotLottieVue = defineAsyncComponent(() =>
  import('@lottiefiles/dotlottie-vue').then((m) => m.DotLottieVue)
)

const badges = [
  { icon: 'verified', label: 'Design Exclusivo', borderClass: 'border-cyan-400/50 shadow-[0_0_20px_rgba(0,240,255,0.25)]' },
  { icon: 'rocket_launch', label: 'Alta Performance', borderClass: 'border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.25)]' },
  { icon: 'trending_up', label: 'Foco em Conversão', borderClass: 'border-cyan-400/50 shadow-[0_0_20px_rgba(0,240,255,0.25)]' },
  { icon: 'cases', label: 'Consultoria Profissional', borderClass: 'border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.25)]' },
]
</script>

<template>
  <section
    id="home"
    class="relative pt-36 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center overflow-hidden min-h-screen justify-center bg-[#03010c]"
  >
    <!-- Central Cosmic Halo Aura & Particle Stars -->
    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none flex items-center justify-center">
      <!-- Deep space dark base -->
      <div class="absolute inset-0 bg-[#03010c]" />
      
      <!-- Central glowing cyan & purple gradient aura ring from Stitch design -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full bg-gradient-to-tr from-cyan-500/20 via-purple-600/30 to-pink-500/20 blur-[100px] animate-pulse pointer-events-none opacity-80" />
      
      <!-- Light rays radial backdrop -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15)_0%,rgba(0,240,255,0.08)_40%,transparent_75%)]" />

      <!-- Lottie background stars / space effect -->
      <ClientOnly>
        <template #fallback>
          <div class="absolute inset-0 bg-[#03010c]" />
        </template>
        <DotLottieVue
          class="w-full h-full opacity-40 mix-blend-screen"
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

    <!-- Main Container matching Stitch Hero Variant 2 -->
    <div class="max-w-5xl mx-auto flex flex-col items-center gap-8 relative z-20">
      
      <!-- Main Headline -->
      <h1 class="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white max-w-4xl tracking-tight leading-[1.1] drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
        Crie seu Site <br class="hidden sm:inline">
        Profissional e <br>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-400 drop-shadow-[0_0_25px_rgba(0,240,255,0.6)]">
          Venda Mais
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="font-body text-base sm:text-lg lg:text-xl text-white/85 max-w-2xl leading-relaxed font-medium">
        Transforme sua presença online com sites de alta performance, focados em conversão e design premium. Atraia os clientes certos.
      </p>

      <!-- Primary CTA Button with Glowing Neon Frame -->
      <div class="pt-2">
        <a
          href="#orcamento"
          class="relative inline-flex items-center justify-center px-10 py-4.5 text-base font-bold text-white rounded-full bg-[#0a0520]/80 border-2 border-cyan-400/80 hover:border-cyan-300 shadow-[0_0_35px_rgba(0,240,255,0.5)] hover:shadow-[0_0_55px_rgba(0,240,255,0.8)] backdrop-blur-xl transition-all duration-300 hover:scale-105 group"
        >
          <span class="relative z-10 font-heading tracking-wide">Quero um Orçamento</span>
          <div class="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>
      </div>

      <!-- 4 Bottom Glass Badges (Matching Stitch Screenshot) -->
      <div class="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl">
        <div
          v-for="badge in badges"
          :key="badge.label"
          :class="[
            'flex items-center justify-center gap-3 bg-[#0a051d]/60 backdrop-blur-xl px-5 py-3.5 rounded-2xl border transition-all duration-300 hover:scale-105 hover:bg-[#0a051d]/80',
            badge.borderClass
          ]"
        >
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-cyan-300 text-[20px]">{{ badge.icon }}</span>
          </div>
          <span class="text-white/90 font-heading text-xs sm:text-sm font-bold tracking-tight text-left">
            {{ badge.label }}
          </span>
        </div>
      </div>

    </div>
  </section>
</template>
