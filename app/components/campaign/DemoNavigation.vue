<script setup lang="ts">
defineProps<{ dark?: boolean }>()
const menu = ref<HTMLDetailsElement | null>(null)
function close(event: Event) {
  if (event.target instanceof Element && event.target.closest('a') && menu.value) menu.value.open = false
}
function escape() {
  if (!menu.value) return
  menu.value.open = false
  menu.value.querySelector('summary')?.focus()
}
</script>

<template>
  <div class="relative shrink-0">
    <div class="hidden lg:block"><slot /></div>
    <details ref="menu" class="group lg:hidden" @keydown.esc="escape">
      <summary class="flex min-h-11 cursor-pointer list-none items-center gap-3 rounded border border-current/30 px-4 text-sm [&::-webkit-details-marker]:hidden">Menu <span aria-hidden="true" class="group-open:rotate-45">+</span></summary>
      <div class="demo-mobile-menu absolute right-0 top-full z-40 mt-3 w-[min(280px,calc(100vw-40px))] rounded-lg border border-current/20 p-4 shadow-xl" :class="dark ? 'bg-[#202522] text-white' : 'bg-white text-[#202522]'" @click="close"><slot /></div>
    </details>
  </div>
</template>

<style scoped>
.demo-mobile-menu :deep(nav) { display: flex; flex-direction: column; align-items: stretch; gap: 4px; }
.demo-mobile-menu :deep(a) { display: flex; align-items: center; min-height: 44px; padding: 8px 12px; }
</style>
