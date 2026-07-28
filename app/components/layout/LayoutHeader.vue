<script setup lang="ts">
import { ref } from 'vue'
import { brandIcons } from '~/utils/brandIcons'

const isMenuOpen = ref(false)

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'Modelos', href: '/modelos-site' },
  { label: 'Serviços', href: '/#services' },
  { label: 'Portfólio', href: '/#portfolio' },
  { label: 'Contato', href: '/#contact' },
]

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="fixed top-3 sm:top-5 left-0 w-full z-50 px-3 sm:px-8 pointer-events-none">
    <div class="max-w-5xl mx-auto pointer-events-auto bg-[#0d0928]/70 backdrop-blur-2xl border border-purple-500/20 rounded-[20px] shadow-[0_10px_35px_rgba(0,0,0,0.6)] px-5 sm:px-6 py-3 flex justify-between items-center transition-all duration-300">
      
      <!-- Logo: Avyro -->
      <NuxtLink to="/" class="flex items-center gap-2.5 group">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f0ff] via-[#8b5cf6] to-[#ec4899] flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.8)] p-[1.5px]">
          <div class="w-full h-full bg-[#0d0928] rounded-full flex items-center justify-center">
            <span class="font-heading font-black text-[#00f0ff] text-sm tracking-tighter">A</span>
          </div>
        </div>
        <span class="font-heading text-xl font-extrabold text-white tracking-tight">Avyro</span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex gap-7 items-center">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.href"
          :to="link.href"
          class="text-[#9497c0] hover:text-white transition-colors duration-200 font-body text-sm font-semibold tracking-wide"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <!-- Single Support Button: WhatsApp registered number -->
      <a
        href="https://wa.me/5511951372631?text=Olá!%20Vim%20pelo%20site%20e%20preciso%20de%20suporte."
        target="_blank"
        rel="noopener noreferrer"
        class="hidden md:inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full text-xs font-extrabold text-white bg-gradient-to-r from-emerald-500 to-green-600 border border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.8)] hover:scale-105 transition-all duration-300 backdrop-blur-2xl"
      >
        <span class="w-4 h-4 fill-current shrink-0" v-html="brandIcons.whatsapp"></span>
        Suporte WhatsApp
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
        class="md:hidden pointer-events-auto max-w-5xl mx-auto mt-2 bg-[#0d0928]/95 backdrop-blur-2xl border border-purple-500/40 rounded-2xl p-5 shadow-2xl space-y-3"
      >
        <nav class="flex flex-col gap-3">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.href"
            :to="link.href"
            class="text-white/90 hover:text-cyan-300 py-1.5 font-body text-sm font-medium transition-colors"
            @click="closeMenu"
          >
            {{ link.label }}
          </NuxtLink>
          <a
            href="https://wa.me/5511951372631?text=Olá!%20Vim%20pelo%20site%20e%20preciso%20de%20suporte."
            target="_blank"
            rel="noopener noreferrer"
            class="w-full py-3 rounded-full text-xs font-extrabold text-center text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-[0_0_20px_rgba(16,185,129,0.5)] mt-2 flex items-center justify-center gap-2"
            @click="closeMenu"
          >
            <span class="w-4 h-4 fill-current shrink-0" v-html="brandIcons.whatsapp"></span>
            Suporte WhatsApp (11) 95137-2631
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
  transform: translateY(-10px);
}
</style>
