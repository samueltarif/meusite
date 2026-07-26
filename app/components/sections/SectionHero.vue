<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const DotLottieVue = defineAsyncComponent(() =>
  import('@lottiefiles/dotlottie-vue').then((m) => m.DotLottieVue)
)
</script>

<template>
  <section
    id="home"
    class="relative pt-36 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center overflow-hidden min-h-screen justify-center bg-[#050314]"
  >
    <!-- Background Nebula Clouds & Radial Cosmic Light Particles -->
    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      <!-- Dark deep cosmic background -->
      <div class="absolute inset-0 bg-[#050314]" />
      
      <!-- Side Nebula Purple/Pink Clouds -->
      <div class="absolute -left-20 top-1/4 w-[600px] h-[600px] rounded-full bg-purple-700/30 blur-[130px]" />
      <div class="absolute -right-20 top-1/3 w-[600px] h-[600px] rounded-full bg-indigo-700/30 blur-[130px]" />

      <!-- Glowing Cyan Halo Ring behind "Venda Mais" matching Image 1 -->
      <div class="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[440px] h-[340px] sm:h-[440px] rounded-full border-[3px] border-cyan-400/70 shadow-[0_0_80px_rgba(0,240,255,0.7),inset_0_0_50px_rgba(168,85,247,0.5)] bg-[radial-gradient(circle,rgba(0,240,255,0.18)_0%,rgba(168,85,247,0.25)_45%,transparent_75%)] pointer-events-none" />

      <!-- Starry particles & earth space effect -->
      <ClientOnly>
        <template #fallback>
          <div class="absolute inset-0 bg-[#050314]" />
        </template>
        <DotLottieVue
          class="w-full h-full opacity-50 mix-blend-screen scale-110"
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

    <!-- Main Content Container -->
    <div class="max-w-5xl mx-auto flex flex-col items-center gap-7 relative z-20">
      
      <!-- Headline matching Image 1 -->
      <h1 class="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white max-w-4xl tracking-tight leading-[1.12] drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
        Crie seu Site <br class="hidden sm:inline">
        Profissional e <br>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#c084fc] to-[#e879f9] filter drop-shadow-[0_0_30px_rgba(0,240,255,0.8)]">
          Venda Mais
        </span>
      </h1>

      <!-- Subtitle matching Image 1 -->
      <p class="font-body text-sm sm:text-base lg:text-lg text-white/85 max-w-2xl leading-relaxed font-normal px-4">
        Transforme sua presença online com sites de alta performance, focados em conversão e design premium. Atraia os clientes certos.
      </p>

      <!-- Primary CTA Glass Button matching Image 1 -->
      <div class="pt-3">
        <a
          href="#orcamento"
          class="relative inline-flex items-center justify-center px-10 py-4 text-base sm:text-lg font-bold text-white rounded-full bg-white/10 hover:bg-white/20 border-2 border-cyan-400/80 hover:border-cyan-300 shadow-[0_0_35px_rgba(0,240,255,0.6),inset_0_0_20px_rgba(168,85,247,0.4)] backdrop-blur-xl transition-all duration-300 hover:scale-105"
        >
          <span class="relative z-10 font-heading tracking-wide">Quero um Orçamento</span>
        </a>
      </div>

      <!-- 4 Bottom Badges matching Image 1 -->
      <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full max-w-5xl px-2">
        
        <!-- Badge 1: Wavy organic deckle border (Design Exclusivo) -->
        <div class="badge-wavy flex items-center justify-center gap-3 bg-[#0d0928]/70 backdrop-blur-xl px-5 py-3.5 border-2 border-cyan-400/80 shadow-[0_0_25px_rgba(0,240,255,0.45)] hover:scale-105 transition-transform duration-300">
          <div class="w-7 h-7 rounded-full border border-cyan-400/60 flex items-center justify-center shrink-0 bg-cyan-400/10">
            <span class="material-symbols-outlined text-cyan-300 text-[18px] font-bold">check</span>
          </div>
          <span class="text-white font-heading text-xs sm:text-sm font-semibold tracking-tight">
            Design Exclusivo
          </span>
        </div>

        <!-- Badge 2: Alta Performance -->
        <div class="flex items-center justify-center gap-3 bg-[#0d0928]/70 backdrop-blur-xl px-5 py-3.5 rounded-2xl border-2 border-purple-500/80 shadow-[0_0_25px_rgba(168,85,247,0.45)] hover:scale-105 transition-transform duration-300">
          <div class="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
            <span class="text-base">🚀</span>
          </div>
          <span class="text-white font-heading text-xs sm:text-sm font-semibold tracking-tight">
            Alta Performance
          </span>
        </div>

        <!-- Badge 3: Foco em Conversão -->
        <div class="flex items-center justify-center gap-3 bg-[#0d0928]/70 backdrop-blur-xl px-5 py-3.5 rounded-2xl border-2 border-cyan-400/80 shadow-[0_0_25px_rgba(0,240,255,0.45)] hover:scale-105 transition-transform duration-300">
          <div class="w-7 h-7 rounded-lg bg-cyan-400/10 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-cyan-300 text-[18px] font-bold">trending_up</span>
          </div>
          <span class="text-white font-heading text-xs sm:text-sm font-semibold tracking-tight">
            Foco em Conversão
          </span>
        </div>

        <!-- Badge 4: Consultoria Profissional -->
        <div class="flex items-center justify-center gap-3 bg-[#0d0928]/70 backdrop-blur-xl px-5 py-3.5 rounded-2xl border-2 border-purple-500/80 shadow-[0_0_25px_rgba(168,85,247,0.45)] hover:scale-105 transition-transform duration-300">
          <div class="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
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
/* Organic Wavy deckle border for Badge 1 matching Image 1 */
.badge-wavy {
  border-radius: 20px 8px 22px 10px / 10px 22px 8px 20px;
}
</style>
