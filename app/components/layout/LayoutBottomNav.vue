<script setup lang="ts">
const navItems = [
  { icon: 'home', label: 'Home', href: '#home', active: true },
  { icon: 'grid_view', label: 'Serviços', href: '#services', active: false },
  { icon: 'work', label: 'Portfólio', href: '#portfolio', active: false },
  { icon: 'mail', label: 'Contato', href: '#contact', active: false },
]
</script>

<template>
  <nav class="lg:hidden fixed bottom-0 left-0 w-full h-20 flex justify-around items-center px-4 pb-2 bg-surface-container-lowest border-t border-border-subtle rounded-t-xl z-50 shadow-lg">
    <a
      v-for="item in navItems"
      :key="item.href"
      :href="item.href"
      :class="[
        'flex flex-col items-center justify-center font-heading text-label-md transition-all active:scale-90',
        item.active
          ? 'bg-secondary-container text-on-secondary-container rounded-full px-4 py-1'
          : 'text-on-surface-variant hover:bg-surface-container-high p-2 rounded-xl'
      ]"
    >
      <span class="material-symbols-outlined">{{ item.icon }}</span>
      <span class="text-xs mt-1">{{ item.label }}</span>
    </a>
  </nav>
</template>
