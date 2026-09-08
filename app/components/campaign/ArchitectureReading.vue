<script setup lang="ts">
const points = [
  { name: 'Transição', x: 29, y: 76, text: 'O caminho entre jardim e casa pode ser tão importante quanto os ambientes internos.' },
  { name: 'Aberturas', x: 58, y: 45, text: 'A relação entre aberturas, vistas e privacidade faz parte da leitura de um espaço.' },
  { name: 'Paisagem', x: 84, y: 70, text: 'Vegetação e áreas externas entram na composição do lugar de habitar.' },
]
const active = ref<number>(0)
</script>
<template>
  <section id="leitura-do-espaco" class="bg-[#e6e5df] px-6 py-20 md:px-12"><div class="mx-auto max-w-7xl"><div class="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"><h2 class="text-4xl font-normal tracking-tight md:text-5xl">Um espaço.<br>Muitas relações.</h2><p class="max-w-sm text-base leading-7 text-stone-500">Explore os pontos na fotografia para acompanhar uma leitura de arquitetura.</p></div><div class="relative"><img src="/images/campaign/architecture-1.jpg" alt="Residência e jardim usados para leitura ilustrativa de arquitetura" width="1800" height="1000" loading="lazy" class="aspect-[1.35] w-full object-cover md:aspect-[2]"><button v-for="(point, i) in points" :key="point.name" :aria-label="`Ponto ${i + 1}: ${point.name}`" :aria-pressed="active === i" class="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white shadow-lg" :class="active === i ? 'bg-[#252724] text-white' : 'bg-white text-[#252724]'" :style="{ left: `${point.x}%`, top: `${point.y}%` }" @click="active = i">0{{ i + 1 }}</button></div><div class="mt-6 grid gap-5 border-t border-stone-300 pt-6 md:grid-cols-[1fr_2fr]" aria-live="polite"><h3 class="text-2xl">0{{ active + 1 }} / {{ points[active]?.name }}</h3><p class="max-w-2xl text-lg leading-8 text-stone-500">{{ points[active]?.text }}</p></div><p class="mt-5 text-sm text-stone-500">Leitura conceitual de uma fotografia de referência; não descreve autoria ou desempenho técnico da obra.</p></div></section>
</template>
