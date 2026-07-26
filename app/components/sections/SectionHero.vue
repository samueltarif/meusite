<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const DotLottieVue = defineAsyncComponent(() =>
  import('@lottiefiles/dotlottie-vue').then((m) => m.DotLottieVue)
)
</script>

<template>
  <section
    id="home"
    class="relative pt-36 pb-24 lg:pt-44 lg:pb-36 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center overflow-hidden min-h-screen justify-center stitch-cosmic-bg"
  >
    <!-- Background Cosmic Atmosphere matching Stitch Variant 2 Image -->
    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      
      <!-- Cosmic Deep Space Base Layer -->
      <div class="absolute inset-0 bg-[#050212]" />

      <!-- Side Purple & Pink Nebula Gas Clouds -->
      <div class="absolute -left-40 top-1/4 w-[850px] h-[850px] rounded-full bg-[#6b21a8]/35 blur-[180px]" />
      <div class="absolute -right-40 top-1/3 w-[850px] h-[850px] rounded-full bg-[#4c1d95]/35 blur-[180px]" />

      <!-- Center Radial Cyan/Purple Burst -->
      <div class="absolute top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.3)_0%,rgba(168,85,247,0.2)_38%,transparent_75%)] pointer-events-none" />

      <!-- 360-Degree Radial Sparks & Star Rays matching Stitch -->
      <svg class="absolute top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-70 pointer-events-none" viewBox="0 0 900 900" fill="none">
        <g stroke="url(#sparkGrad)" stroke-width="1.5">
          <line x1="450" y1="30" x2="450" y2="180" />
          <line x1="450" y1="720" x2="450" y2="870" />
          <line x1="30" y1="450" x2="180" y2="450" />
          <line x1="720" y1="450" x2="870" y2="450" />
          <line x1="150" y1="150" x2="260" y2="260" />
          <line x1="640" y1="640" x2="750" y2="750" />
          <line x1="750" y1="150" x2="640" y2="260" />
          <line x1="260" y1="640" x2="150" y2="750" />
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
      <div class="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[480px] h-[380px] sm:h-[480px] rounded-full border-[4px] border-[#00f0ff] shadow-[0_0_100px_#00f0ff,0_0_160px_rgba(168,85,247,0.85),inset_0_0_70px_#00f0ff] bg-[radial-gradient(circle,rgba(0,240,255,0.25)_0%,rgba(168,85,247,0.3)_50%,transparent_80%)] pointer-events-none" />

      <!-- Lottie space particles -->
      <ClientOnly>
        <template #fallback>
          <div class="absolute inset-0 bg-[#050212]" />
        </template>
        <DotLottieVue
          class="w-full h-full opacity-65 mix-blend-screen scale-110"
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
      <p class="font-body text-sm sm:text-base lg:text-lg text-[#b5b8d0] max-w-2xl leading-relaxed font-normal px-4">
        Transforme sua presença online com sites de alta performance, focados em conversão e design premium. Atraia os clientes certos.
      </p>

      <!-- Primary CTA Glass Button with Dual Neon Gradient Ring Frame matching Stitch -->
      <div class="pt-4">
        <a
          href="#orcamento"
          class="group relative inline-flex items-center justify-center p-[3px] rounded-full overflow-hidden shadow-[0_0_45px_#00f0ff,0_0_80px_rgba(168,85,247,0.7)] transition-all duration-300 hover:scale-105"
        >
          <!-- Outer Dual Neon Border Gradient -->
          <div class="absolute inset-0 bg-gradient-to-r from-[#00f0ff] via-[#a855f7] to-[#ec4899] rounded-full animate-gradient-x" />
          
          <!-- Inner Translucent Glass Fill matching Stitch -->
          <div class="relative z-10 px-12 py-4.5 rounded-full bg-gradient-to-b from-white/40 via-cyan-500/20 to-[#0e0a2d]/80 backdrop-blur-2xl flex items-center justify-center">
            <span class="font-heading text-base sm:text-xl font-extrabold text-white tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
              Quero um Orçamento
            </span>
          </div>
        </a>
      </div>

      <!-- 4 Bottom Glass Badges matching Stitch -->
      <div class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full max-w-5xl px-2">
        
        <!-- Badge 1: Organic Wavy Deckle Outline (Design Exclusivo) -->
        <div class="badge-wavy relative flex items-center justify-center gap-3 bg-[#0d072b]/80 backdrop-blur-2xl px-6 py-4 border-2 border-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.7)] hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div class="w-7 h-7 rounded-full border border-[#00f0ff] flex items-center justify-center shrink-0 bg-cyan-400/20 shadow-[0_0_12px_rgba(0,240,255,0.7)]">
            <span class="material-symbols-outlined text-cyan-300 text-[18px] font-bold">check</span>
          </div>
          <span class="text-white font-heading text-xs sm:text-sm font-semibold tracking-tight">
            Design Exclusivo
          </span>
        </div>

        <!-- Badge 2: Alta Performance -->
        <div class="flex items-center justify-center gap-3 bg-[#0d072b]/80 backdrop-blur-2xl px-6 py-4 rounded-2xl border-2 border-[#a855f7] shadow-[0_0_30px_rgba(168,85,247,0.7)] hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div class="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.7)]">
            <span class="text-lg">🚀</span>
          </div>
          <span class="text-white font-heading text-xs sm:text-sm font-semibold tracking-tight">
            Alta Performance
          </span>
        </div>

        <!-- Badge 3: Foco em Conversão -->
        <div class="flex items-center justify-center gap-3 bg-[#0d072b]/80 backdrop-blur-2xl px-6 py-4 rounded-2xl border-2 border-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.7)] hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div class="w-7 h-7 rounded-lg bg-cyan-400/20 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(0,240,255,0.7)]">
            <span class="material-symbols-outlined text-cyan-300 text-[18px] font-bold">trending_up</span>
          </div>
          <span class="text-white font-heading text-xs sm:text-sm font-semibold tracking-tight">
            Foco em Conversão
          </span>
        </div>

        <!-- Badge 4: Consultoria Profissional -->
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
/* Space background blending matching Stitch */
.stitch-cosmic-bg {
  background-image: 
    radial-gradient(circle at 50% 42%, rgba(0, 240, 255, 0.28) 0%, rgba(168, 85, 247, 0.3) 35%, transparent 70%),
    linear-gradient(180deg, #050212 0%, #0c0828 50%, #050212 100%),
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
