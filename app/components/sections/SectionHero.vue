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
      console.warn('Lottie hero load error:', err)
      return FallbackComponent
    }
  },
  onError(error, retry, fail) {
    console.warn('Lottie hero error:', error)
    fail()
  }
})
</script>

<template>
  <section
    id="home"
    class="relative pt-44 pb-24 lg:pt-52 lg:pb-36 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center overflow-hidden min-h-screen justify-center space-nebula-bg"
  >
    <!-- Background Cosmic Atmosphere matching Stitch Screenshot 100% -->
    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      <!-- Dark Overlay Tint over Nebula -->
      <div class="absolute inset-0 bg-[#060318]/50" />

      <!-- Side Purple & Pink Gas Cloud Glows -->
      <div class="absolute -left-32 top-1/4 w-[700px] h-[700px] rounded-full bg-purple-600/30 blur-[150px]" />
      <div class="absolute -right-32 top-1/3 w-[700px] h-[700px] rounded-full bg-indigo-600/30 blur-[150px]" />

      <!-- Center Radial Cyan/Purple Burst -->
      <div class="absolute top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.35)_0%,rgba(168,85,247,0.25)_40%,transparent_75%)] pointer-events-none" />

      <!-- 360-Degree Radial Sparks & Light Rays matching Stitch Image -->
      <svg class="absolute top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-80 pointer-events-none" viewBox="0 0 900 900" fill="none">
        <g stroke="url(#sparkGrad)" stroke-width="1.8">
          <line x1="450" y1="20" x2="450" y2="180" />
          <line x1="450" y1="720" x2="450" y2="880" />
          <line x1="20" y1="450" x2="180" y2="450" />
          <line x1="720" y1="450" x2="880" y2="450" />
          <line x1="140" y1="140" x2="260" y2="260" />
          <line x1="640" y1="640" x2="760" y2="760" />
          <line x1="760" y1="140" x2="640" y2="260" />
          <line x1="260" y1="640" x2="140" y2="760" />
        </g>

        <!-- Twinkling Cyan & Magenta Particles -->
        <circle cx="210" cy="180" r="3.5" fill="#00f0ff" />
        <circle cx="680" cy="200" r="3" fill="#a855f7" />
        <circle cx="150" cy="540" r="2.5" fill="#00f0ff" />
        <circle cx="750" cy="500" r="3.5" fill="#ec4899" />
        <circle cx="340" cy="110" r="3" fill="#00f0ff" />
        <circle cx="580" cy="780" r="3.5" fill="#00f0ff" />
        <defs>
          <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00f0ff" />
            <stop offset="50%" stop-color="#a855f7" />
            <stop offset="100%" stop-color="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      <!-- Glowing Cyan/Purple Aura Ring surrounding "Venda Mais" matching Stitch -->
      <div class="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[390px] sm:w-[490px] h-[390px] sm:h-[490px] rounded-full border-[4px] border-[#00f0ff] shadow-[0_0_100px_#00f0ff,0_0_160px_rgba(168,85,247,0.85),inset_0_0_70px_#00f0ff] bg-[radial-gradient(circle,rgba(0,240,255,0.25)_0%,rgba(168,85,247,0.3)_50%,transparent_80%)] pointer-events-none" />

      <!-- Lottie star particles -->
      <ClientOnly>
        <template #fallback>
          <div class="absolute inset-0 bg-[#060318]" />
        </template>
        <DotLottieVue
          class="w-full h-full opacity-60 mix-blend-screen scale-110"
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

    <!-- Hero Content Container -->
    <div class="max-w-5xl mx-auto flex flex-col items-center gap-7 relative z-20">
      
      <!-- Main Headline matching Stitch Image -->
      <h1 class="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white max-w-4xl tracking-tight leading-[1.12] drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]">
        Crie seu Site <br class="hidden sm:inline">
        Profissional e <br>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#b87cf8] to-[#e879f9] filter drop-shadow-[0_0_40px_rgba(0,240,255,0.95)]">
          Venda Mais
        </span>
      </h1>

      <!-- Subtitle matching Stitch -->
      <p class="font-body text-sm sm:text-base lg:text-lg text-white/90 max-w-2xl leading-relaxed font-normal px-4 drop-shadow">
        Transforme sua presença online com sites de alta performance, focados em conversão e design premium. Atraia os clientes certos.
      </p>

      <!-- Primary CTA Glass Buttons -->
      <div class="pt-4 flex flex-wrap items-center justify-center gap-4">
        <a
          href="#orcamento"
          class="relative inline-flex items-center justify-center px-10 py-4 text-base sm:text-lg font-bold text-white rounded-full bg-white/15 hover:bg-white/25 border-2 border-[#00f0ff] shadow-[0_0_40px_#00f0ff,0_0_75px_rgba(168,85,247,0.7),inset_0_0_20px_rgba(0,240,255,0.4)] backdrop-blur-2xl transition-all duration-300 hover:scale-105"
        >
          <span class="relative z-10 font-heading tracking-wide">Quero um Orçamento</span>
        </a>

        <NuxtLink
          to="/modelos-site"
          class="relative inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-bold text-white rounded-full bg-purple-600/30 hover:bg-purple-600/50 border-2 border-purple-400/80 shadow-[0_0_30px_rgba(168,85,247,0.6)] backdrop-blur-2xl transition-all duration-300 hover:scale-105"
        >
          <span class="material-symbols-outlined text-[20px] mr-2">space_dashboard</span>
          <span class="font-heading tracking-wide">Veja Modelos</span>
        </NuxtLink>
      </div>

      <!-- 4 Bottom Glass Badges matching Stitch -->
      <div class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full max-w-5xl px-2">
        
        <!-- Badge 1: Design Exclusivo (Cyan Wavy Capsule) -->
        <div class="flex items-center justify-center gap-3 bg-[#0d072b]/80 backdrop-blur-2xl px-6 py-4 rounded-full border-2 border-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.7)] hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div class="w-7 h-7 rounded-full border border-[#00f0ff] flex items-center justify-center shrink-0 bg-cyan-400/20 shadow-[0_0_12px_rgba(0,240,255,0.7)]">
            <span class="material-symbols-outlined text-cyan-300 text-[18px] font-bold">check</span>
          </div>
          <span class="text-white font-heading text-xs sm:text-sm font-semibold tracking-tight">
            Design Exclusivo
          </span>
        </div>

        <!-- Badge 2: Alta Performance (Purple Capsule) -->
        <div class="flex items-center justify-center gap-3 bg-[#0d072b]/80 backdrop-blur-2xl px-6 py-4 rounded-2xl border-2 border-[#a855f7] shadow-[0_0_30px_rgba(168,85,247,0.7)] hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div class="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.7)]">
            <span class="text-lg">🚀</span>
          </div>
          <span class="text-white font-heading text-xs sm:text-sm font-semibold tracking-tight">
            Alta Performance
          </span>
        </div>

        <!-- Badge 3: Foco em Conversão (Cyan Capsule) -->
        <div class="flex items-center justify-center gap-3 bg-[#0d072b]/80 backdrop-blur-2xl px-6 py-4 rounded-2xl border-2 border-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.7)] hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div class="w-7 h-7 rounded-lg bg-cyan-400/20 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(0,240,255,0.7)]">
            <span class="material-symbols-outlined text-cyan-300 text-[18px] font-bold">trending_up</span>
          </div>
          <span class="text-white font-heading text-xs sm:text-sm font-semibold tracking-tight">
            Foco em Conversão
          </span>
        </div>

        <!-- Badge 4: Consultoria Profissional (Purple Capsule) -->
        <div class="flex items-center justify-center gap-3 bg-[#0d072b]/80 backdrop-blur-2xl px-6 py-4 rounded-2xl border-2 border-[#a855f7] shadow-[0_0_30px_rgba(168,85,247,0.7)] hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div class="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.7)]">
            <span class="material-symbols-outlined text-purple-300 text-[18px]">cases</span>
          </div>
          <span class="text-white font-heading text-xs sm:text-sm font-semibold tracking-tight">
            Consultoria Profissional
          </span>
        </div>

      </div>

    </div>
  </section>
</template>

<style scoped>
.space-nebula-bg {
  background-color: #060318;
  background-image: url('/images/cosmic-nebula.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
