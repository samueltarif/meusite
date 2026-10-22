<script setup lang="ts">
// Ícone Material Symbols (a fonte já é carregada globalmente no nuxt.config).
// O tamanho fixo (1em) impede "salto" de layout enquanto a fonte carrega.
withDefaults(defineProps<{ name: string; size?: number; fill?: boolean }>(), { size: 20, fill: false })

// Os ícones ficam invisíveis até a fonte carregar (evita aparecer o nome do ícone como texto).
onMounted(() => {
  const root = document.documentElement
  if (root.classList.contains('gmk-icons-ready')) return
  const check = () => {
    if (root.classList.contains('gmk-icons-ready')) return
    document.fonts?.load("20px 'Material Symbols Outlined'", 'home')
      .then((faces) => { if (faces.length) root.classList.add('gmk-icons-ready') })
      .catch(() => { /* sem fonte: ícones continuam ocultos, os textos dos botões permanecem */ })
  }
  check()
  window.addEventListener('load', check, { once: true })
  document.fonts?.ready?.then?.(() => { root.classList.add('gmk-icons-ready') })
  setTimeout(check, 1000)
  setTimeout(check, 2500)
})
</script>

<template>
  <span
    class="gmk-icon"
    aria-hidden="true"
    :style="{ fontSize: size + 'px', fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 500` }"
  >{{ name }}</span>
</template>

<style>
.gmk-icon {
  display: inline-block;
  flex-shrink: 0;
  width: 1em;
  height: 1em;
  overflow: hidden;
  line-height: 1;
  white-space: nowrap;
  vertical-align: middle;
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  letter-spacing: normal;
  text-transform: none;
  direction: ltr;
  user-select: none;
  -webkit-font-smoothing: antialiased;
  opacity: 0;
}
:root.gmk-icons-ready .gmk-icon { opacity: 1; }
</style>
