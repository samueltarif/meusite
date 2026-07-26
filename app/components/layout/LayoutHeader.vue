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
  <header class="fixed top-4 left-0 w-full z-50 px-4 sm:px-8 pointer-events-none">
    <div class="max-w-5xl mx-auto pointer-events-auto bg-[#0a061e]/70 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] px-5 py-3 flex justify-between items-center transition-all duration-300">
      
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2.5 group">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
          <span class="material-symbols-outlined text-white text-[18px]">auto_awesome</span>
        </div>
        <span class="font-heading text-lg font-bold text-white tracking-tight">Tarif</span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex gap-8 items-center">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="text-white/80 hover:text-cyan-300 transition-colors duration-200 font-body text-sm font-medium"
        >
          {{ link.label }}
        </a>
      </nav>

      <!-- Desktop CTA Button -->
      <a
        href="#orcamento"
        class="hidden md:inline-flex items-center justify-center px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600/60 to-cyan-600/60 border border-purple-400/40 hover:border-cyan-400/80 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] hover:scale-105 transition-all duration-300 backdrop-blur-md"
      >
        Contato
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
        class="md:hidden pointer-events-auto max-w-5xl mx-auto mt-2 bg-[#0a061e]/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-5 shadow-2xl space-y-3"
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
            class="w-full py-2.5 rounded-xl text-xs font-bold text-center text-white bg-gradient-to-r from-cyan-500 to-purple-600 shadow-[0_0_20px_rgba(0,240,255,0.4)] mt-2"
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
