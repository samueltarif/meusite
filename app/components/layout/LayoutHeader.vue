<script setup lang="ts">
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
  <header
    class="bg-primary fixed top-0 w-full z-50 shadow-md"
  >
    <div class="flex justify-between items-center px-margin-mobile lg:px-gutter h-16 max-w-container-max mx-auto">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2">
        <span class="material-symbols-outlined text-on-primary">design_services</span>
        <span class="font-heading text-headline-sm font-bold text-on-primary">Tarif</span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden lg:flex gap-8 items-center">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="text-on-primary/70 hover:text-on-primary transition-colors duration-200 font-body text-body-md"
        >
          {{ link.label }}
        </a>
      </nav>

      <!-- Desktop CTA -->
      <a
        href="#orcamento"
        class="hidden lg:inline-flex items-center justify-center bg-surface-light text-primary font-heading text-label-md px-6 py-2.5 rounded-full hover:scale-105 transition-transform duration-200 active:scale-95 shadow-sm"
      >
        Solicitar Orçamento
      </a>

      <!-- Mobile Menu Toggle -->
      <button
        class="lg:hidden text-on-primary p-2"
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
        class="lg:hidden bg-primary border-t border-on-primary/10 px-margin-mobile pb-6"
      >
        <nav class="flex flex-col gap-4 pt-4">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="text-on-primary/80 hover:text-on-primary py-2 font-body text-body-md transition-colors"
            @click="closeMenu"
          >
            {{ link.label }}
          </a>
          <a
            href="#orcamento"
            class="action-gradient-bg text-on-primary font-heading text-label-md px-6 py-3 rounded-full text-center mt-2"
            @click="closeMenu"
          >
            Solicitar Orçamento
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

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 400px;
  transform: translateY(0);
}
</style>
