<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const DotLottieVue = defineAsyncComponent(() =>
  import('@lottiefiles/dotlottie-vue').then((m) => m.DotLottieVue)
)
</script>

<template>
  <section
    id="home"
    class="relative pt-32 pb-24 lg:pt-44 lg:pb-36 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center overflow-hidden min-h-screen justify-center bg-[#07051a]"
  >
    <!-- Background Cosmic Atmosphere matching Stitch Variant 2 Image 1 -->
    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      
      <!-- Deep Cosmic Background Colors -->
      <div class="absolute inset-0 bg-[#07051a]" />
      
      <!-- Nebula Gas Clouds (Purple/Indigo on sides) -->
      <div class="absolute -left-32 top-1/4 w-[700px] h-[700px] rounded-full bg-purple-900/40 blur-[150px]" />
      <div class="absolute -right-32 top-1/3 w-[700px] h-[700px] rounded-full bg-indigo-900/40 blur-[150px]" />

      <!-- Center Radial Light Burst Rays -->
      <div class="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.18)_0%,rgba(168,85,247,0.12)_35%,transparent_70%)] pointer-events-none" />

      <!-- Light Rays / Lines vector behind title -->
      <svg class="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-35" viewBox="0 0 800 800" fill="none">
        <circle cx="400" cy="400" r="300" stroke="url(#cyanPurpleGrad)" stroke-width="1.5" stroke-dasharray="4 8" />
        <circle cx="400" cy="400" r="380" stroke="url(#cyanPurpleGrad)" stroke-width="1" stroke-dasharray="2 12" />
        <line x1="400" y1="50" x2="400" y2="750" stroke="url(#cyanPurpleGrad)" stroke-width="0.5" opacity="0.5" />
        <line x1="50" y1="400" x2="750" y2="400" stroke="url(#cyanPurpleGrad)" stroke-width="0.5" opacity="0.5" />
        <defs>
          <linearGradient id="cyanPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00f0ff" />
            <stop offset="50%" stop-color="#a855f7" />
            <stop offset="100%" stop-color="#ec4899" />
          </linearGradient>
        </defs>
      </svg>

      <!-- Glowing Cyan/Purple Aura Ring behind "Venda Mais" -->
      <div class="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[450px] h-[340px] sm:h-[450px] rounded-full border-[3px] border-cyan-400/80 shadow-[0_0_80px_rgba(0,240,255,0.85),0_0_120px_rgba(168,85,247,0.5),inset_0_0_60px_rgba(0,240,255,0.4)] bg-[radial-gradient(circle,rgba(0,240,255,0.2)_0%,rgba(168,85,247,0.25)_50%,transparent_80%)] pointer-events-none" />

      <!-- Lottie star particles effect -->
      <ClientOnly>
        <template #fallback>
          <div class="absolute inset-0 bg-[#07051a]" />
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
      
      <!-- Headline matching Image 1 exactly -->
      <h1 class="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white max-w-4xl tracking-tight leading-[1.12] drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
        Crie seu Site <br class="hidden sm:inline">
        Profissional e <br>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#b87cf8] to-[#e879f9] filter drop-shadow-[0_0_35px_rgba(0,240,255,0.9)]">
          Venda Mais
        </span>
      </h1>

      <!-- Subtitle matching Image 1 -->
      <p class="font-body text-sm sm:text-base lg:text-lg text-white/85 max-w-2xl leading-relaxed font-normal px-4">
        Transforme sua presença online com sites de alta performance, focados em conversão e design premium. Atraia os clientes certos.
      </p>

      <!-- Primary CTA Glass Button with Neon Aura matching Image 1 -->
      <div class="pt-4">
        <a
          href="#orcamento"
          class="relative inline-flex items-center justify-center px-12 py-4.5 text-base sm:text-lg font-bold text-white rounded-full bg-white/10 hover:bg-white/20 border-2 border-[#00f0ff] shadow-[0_0_40px_rgba(0,240,255,0.7),0_0_60px_rgba(168,85,247,0.4),inset_0_0_20px_rgba(0,240,255,0.5)] backdrop-blur-2xl transition-all duration-300 hover:scale-105"
        >
          <span class="relative z-10 font-heading tracking-wide">Quero um Orçamento</span>
        </a>
      </div>

      <!-- 4 Bottom Glass Badges with Glowing Contours matching Image 1 -->
      <div class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full max-w-5xl px-2">
        
        <!-- Badge 1: Organic Wavy Deckle Outline (Design Exclusivo) -->
        <div class="relative group cursor-pointer">
          <svg class="absolute inset-0 w-full h-full pointer-events-none filter drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]" viewBox="0 0 240 60" preserveAspectRatio="none">
            <path d="M 10,5 Q 30,1 60,7 T 120,4 T 180,7 T 230,5 Q 237,15 235,30 Q 238,45 230,55 Q 180,53 120,57 T 60,53 T 10,55 Q 2,45 5,30 Q 2,15 10,5 Z" fill="rgba(15, 10, 40, 0.65)" stroke="#00f0ff" stroke-width="2" />
          </svg>
          <div class="relative z-10 flex items-center justify-center gap-3 px-6 py-4">
            <div class="w-6 h-6 rounded-full border border-cyan-400 flex items-center justify-center shrink-0 bg-cyan-400/20">
              <span class="material-symbols-outlined text-cyan-300 text-[16px] font-bold">check</span>
            </div>
            <span class="text-white font-heading text-xs sm:text-sm font-semibold tracking-tight">
              Design Exclusivo
            </span>
          </div>
        </div>

        <!-- Badge 2: Alta Performance -->
        <div class="flex items-center justify-center gap-3 bg-[#0f0a28]/65 backdrop-blur-xl px-6 py-4 rounded-2xl border-2 border-[#a855f7] shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div class="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
            <span class="text-lg">🚀</span>
          </div>
          <span class="text-white font-heading text-xs sm:text-sm font-semibold tracking-tight">
            Alta Performance
          </span>
        </div>

        <!-- Badge 3: Foco em Conversão -->
        <div class="flex items-center justify-center gap-3 bg-[#0f0a28]/65 backdrop-blur-xl px-6 py-4 rounded-2xl border-2 border-[#00f0ff] shadow-[0_0_25px_rgba(0,240,255,0.5)] hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div class="w-7 h-7 rounded-lg bg-cyan-400/20 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-cyan-300 text-[18px] font-bold">trending_up</span>
          </div>
          <span class="text-white font-heading text-xs sm:text-sm font-semibold tracking-tight">
            Foco em Conversão
          </span>
        </div>

        <!-- Badge 4: Consultoria Profissional -->
        <div class="flex items-center justify-center gap-3 bg-[#0f0a28]/65 backdrop-blur-xl px-6 py-4 rounded-2xl border-2 border-[#a855f7] shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:scale-105 transition-transform duration-300 cursor-pointer">
          <div class="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
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
