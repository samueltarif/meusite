<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const DotLottieVue = defineAsyncComponent(() =>
  import('@lottiefiles/dotlottie-vue').then((m) => m.DotLottieVue)
)
</script>

<template>
  <section
    id="home"
    class="relative pt-36 pb-24 lg:pt-44 lg:pb-36 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center overflow-hidden min-h-screen justify-center space-hero-bg"
  >
    <!-- Background Cosmic Atmosphere matching Stitch Variant 2 Image 1 & 2 -->
    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      
      <!-- Cosmic Deep Space Layer -->
      <div class="absolute inset-0 bg-[#050317]" />

      <!-- Side Purple & Magenta Nebula Gas Clouds -->
      <div class="absolute -left-36 top-1/4 w-[750px] h-[750px] rounded-full bg-purple-700/35 blur-[160px]" />
      <div class="absolute -right-36 top-1/3 w-[750px] h-[750px] rounded-full bg-indigo-700/35 blur-[160px]" />

      <!-- Center Explosive Cyan/Purple Radial Light Rays -->
      <div class="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[950px] bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.22)_0%,rgba(168,85,247,0.15)_40%,transparent_75%)] pointer-events-none" />

      <!-- Vector Light Bursts & Star Particles -->
      <svg class="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] opacity-45" viewBox="0 0 850 850" fill="none">
        <circle cx="425" cy="425" r="320" stroke="url(#cyanPurpleGrad)" stroke-width="1.5" stroke-dasharray="4 8" />
        <circle cx="425" cy="425" r="400" stroke="url(#cyanPurpleGrad)" stroke-width="1" stroke-dasharray="2 12" />
        <line x1="425" y1="20" x2="425" y2="830" stroke="url(#cyanPurpleGrad)" stroke-width="0.5" opacity="0.6" />
        <line x1="20" y1="425" x2="830" y2="425" stroke="url(#cyanPurpleGrad)" stroke-width="0.5" opacity="0.6" />
        <line x1="140" y1="140" x2="710" y2="710" stroke="url(#cyanPurpleGrad)" stroke-width="0.5" opacity="0.4" />
        <line x1="710" y1="140" x2="140" y2="710" stroke="url(#cyanPurpleGrad)" stroke-width="0.5" opacity="0.4" />
        <defs>
          <linearGradient id="cyanPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00f0ff" />
            <stop offset="50%" stop-color="#a855f7" />
            <stop offset="100%" stop-color="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      <!-- Glowing Cyan/Purple Aura Ring behind "Venda Mais" matching Stitch -->
      <div class="absolute top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[460px] h-[360px] sm:h-[460px] rounded-full border-[3.5px] border-[#00f0ff] shadow-[0_0_90px_rgba(0,240,255,0.9),0_0_140px_rgba(168,85,247,0.6),inset_0_0_60px_rgba(0,240,255,0.45)] bg-[radial-gradient(circle,rgba(0,240,255,0.22)_0%,rgba(168,85,247,0.28)_50%,transparent_80%)] pointer-events-none" />

      <!-- Lottie space particles -->
      <ClientOnly>
        <template #fallback>
          <div class="absolute inset-0 bg-[#050317]" />
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
      
      <!-- Headline matching Stitch Image 1 & 2 -->
      <h1 class="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white max-w-4xl tracking-tight leading-[1.12] drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
        Crie seu Site <br class="hidden sm:inline">
        Profissional e <br>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#b87cf8] to-[#e879f9] filter drop-shadow-[0_0_35px_rgba(0,240,255,0.9)]">
          Venda Mais
        </span>
      </h1>

      <!-- Subtitle matching Stitch -->
      <p class="font-body text-sm sm:text-base lg:text-lg text-white/85 max-w-2xl leading-relaxed font-normal px-4">
        Transforme sua presença online com sites de alta performance, focados em conversão e design premium. Atraia os clientes certos.
      </p>

      <!-- Primary CTA Glass Button with Neon Gradient Ring Frame matching Stitch -->
      <div class="pt-4">
        <a
          href="#orcamento"
          class="cta-stitch-btn group relative inline-flex items-center justify-center p-[3px] rounded-full overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.8),0_0_90px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-105"
        >
          <!-- Outer Dual Neon Border Gradient -->
          <div class="absolute inset-0 bg-gradient-to-r from-[#00f0ff] via-[#a855f7] to-[#ec4899] rounded-full animate-gradient-x" />
          
          <!-- Inner Translucent Glass Fill -->
          <div class="relative z-10 px-12 py-4 rounded-full bg-gradient-to-b from-white/30 to-[#0e0a2d]/80 backdrop-blur-2xl flex items-center justify-center">
            <span class="font-heading text-base sm:text-xl font-extrabold text-white tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
              Quero um Orçamento
            </span>
          </div>
        </a>
      </div>

      <!-- 4 Bottom Badges with Glowing Contours matching Stitch -->
      <div class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full max-w-5xl px-2">
        
        <!-- Badge 1: Organic Wavy Deckle Outline (Design Exclusivo) -->
        <div class="badge-wavy relative flex items-center justify-center gap-3 bg-[#0e0a2d]/75 backdrop-blur-2xl px-6 py-4 border-2 border-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div class="w-7 h-7 rounded-full border border-cyan-400 flex items-center justify-center shrink-0 bg-cyan-400/20 shadow-[0_0_10px_rgba(0,240,255,0.5)]">
            <span class="material-symbols-outlined text-cyan-300 text-[18px] font-bold">check</span>
          </div>
          <span class="text-white font-heading text-xs sm:text-sm font-semibold tracking-tight">
            Design Exclusivo
          </span>
        </div>

        <!-- Badge 2: Alta Performance -->
        <div class="flex items-center justify-center gap-3 bg-[#0e0a2d]/75 backdrop-blur-2xl px-6 py-4 rounded-2xl border-2 border-[#a855f7] shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div class="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.5)]">
            <span class="text-lg">🚀</span>
          </div>
          <span class="text-white font-heading text-xs sm:text-sm font-semibold tracking-tight">
            Alta Performance
          </span>
        </div>

        <!-- Badge 3: Foco em Conversão -->
        <div class="flex items-center justify-center gap-3 bg-[#0e0a2d]/75 backdrop-blur-2xl px-6 py-4 rounded-2xl border-2 border-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div class="w-7 h-7 rounded-lg bg-cyan-400/20 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,240,255,0.5)]">
            <span class="material-symbols-outlined text-cyan-300 text-[18px] font-bold">trending_up</span>
          </div>
          <span class="text-white font-heading text-xs sm:text-sm font-semibold tracking-tight">
            Foco em Conversão
          </span>
        </div>

        <!-- Badge 4: Consultoria Profissional -->
        <div class="flex items-center justify-center gap-3 bg-[#0e0a2d]/75 backdrop-blur-2xl px-6 py-4 rounded-2xl border-2 border-[#a855f7] shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div class="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.5)]">
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
/* Space background with cosmic wallpaper blending */
.space-hero-bg {
  background-image: 
    radial-gradient(circle at 50% 45%, rgba(0, 240, 255, 0.2) 0%, rgba(168, 85, 247, 0.25) 35%, transparent 70%),
    linear-gradient(180deg, #050317 0%, #0c0828 50%, #050317 100%),
    url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=1920');
  background-blend-mode: screen, normal, color-dodge;
  background-size: cover;
  background-position: center;
}

/* Organic Wavy deckle border for Badge 1 matching Stitch Image 1 & 2 */
.badge-wavy {
  clip-path: polygon(
    0% 15%, 5% 0%, 12% 10%, 20% 2%, 30% 12%, 40% 0%, 50% 10%, 60% 0%, 70% 12%, 80% 2%, 90% 10%, 96% 0%, 100% 15%,
    100% 85%, 95% 100%, 88% 90%, 80% 98%, 70% 88%, 60% 100%, 50% 90%, 40% 100%, 30% 88%, 20% 98%, 12% 90%, 5% 100%, 0% 85%
  );
  border-radius: 24px;
}

@keyframes gradientX {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradientX 4s ease infinite;
}
</style>
