<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Serviços', href: '#services' },
  { label: 'Portfólio', href: '#portfolio' },
  { label: 'Contato', href: '#contact' },
]

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="fixed top-5 left-0 w-full z-50 px-4 sm:px-8 pointer-events-none">
    <div class="max-w-5xl mx-auto pointer-events-auto bg-[#0a0720]/65 backdrop-blur-xl border border-purple-500/25 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] px-6 py-3 flex justify-between items-center transition-all duration-300">
      
      <!-- Logo matching Stitch Image 1 (T Tarif with glowing purple/cyan icon) -->
      <NuxtLink to="/" class="flex items-center gap-2.5 group">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.6)]">
          <span class="font-heading font-extrabold text-white text-base tracking-tighter">T</span>
        </div>
        <span class="font-heading text-xl font-extrabold text-white tracking-tight">Tarif</span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex gap-8 items-center">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="text-white/80 hover:text-white transition-colors duration-200 font-body text-sm font-semibold"
        >
          {{ link.label }}
        </a>
      </nav>

      <!-- Desktop CTA Button matching Stitch Image 1 (Contact glass pill button) -->
      <a
        href="#orcamento"
        class="hidden md:inline-flex items-center justify-center px-6 py-2 rounded-full text-sm font-bold text-white bg-[#141038]/80 border border-cyan-400/60 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] hover:scale-105 transition-all duration-300 backdrop-blur-md"
      >
        Contact
      </a>

      <!-- Mobile Menu Toggle -->
      <button
        class="md:hidden text-white p-1.5 focus:outline-none"
        aria-label="Abrir menu"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span class="material-symbols-outlined text-2xl">
          {{ isMenuOpen ? 'close' : 'menu' }}
        </span>
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition name="slide-down">
      <div
        v-if="isMenuOpen"
        class="md:hidden pointer-events-auto max-w-5xl mx-auto mt-2 bg-[#0a0720]/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-5 shadow-2xl space-y-3"
      >
        <nav class="flex flex-col gap-3">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="text-white/90 hover:text-cyan-300 py-1.5 font-body text-sm font-medium transition-colors"
            @click="closeMenu"
          >
            {{ link.label }}
          </a>
          <a
            href="#orcamento"
            class="w-full py-2.5 rounded-full text-xs font-bold text-center text-white bg-gradient-to-r from-cyan-500 to-purple-600 shadow-[0_0_20px_rgba(0,240,255,0.4)] mt-2"
            @click="closeMenu"
          >
            Quero um Orçamento
          </a>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}
</style>
