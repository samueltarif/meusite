<script setup lang="ts">
import ModelPreview from './ModelPreview.vue'
const parts = [
  { name: 'Corpo', text: 'A região central contém os elementos de controle. Material e condições de serviço são definidos pela documentação do fabricante.' },
  { name: 'Conexões', text: 'Interfaces com a tubulação. Padrão, dimensões e classe de pressão devem ser conferidos na ficha do produto.' },
  { name: 'Haste', text: 'Transmite o movimento de acionamento. A construção e a vedação variam conforme o tipo de válvula.' },
  { name: 'Volante', text: 'Interface de acionamento manual. Este estudo mostra a localização do componente, sem simular o funcionamento interno.' },
]
const { current, index, choose } = useDemoChoice(parts)
const exploded = ref(false)
</script>
<template>
  <section id="explorador-3d" class="bg-[#102b3a] px-5 py-16 text-white md:px-10 md:py-24"><div class="mx-auto max-w-6xl"><p class="text-xs uppercase tracking-[0.2em] text-[#82d0cf]">Explorador técnico / 3D</p><h2 class="mt-4 text-3xl font-semibold md:text-5xl">Entenda o conjunto.<br>Explore cada parte.</h2><div class="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]"><ModelPreview kind="valve" :part="current.name" :exploded="exploded" /><div><div class="grid grid-cols-2 gap-3" role="group" aria-label="Partes da válvula"><button v-for="(part, i) in parts" :key="part.name" :aria-pressed="index === i" class="min-h-14 border p-4 text-left text-sm" :class="index === i ? 'border-[#82d0cf] bg-[#82d0cf] text-[#102b3a]' : 'border-white/30'" @click="choose(i)">0{{ i + 1 }} / {{ part.name }}</button></div><div class="mt-7 border-l-2 border-[#82d0cf] pl-5" aria-live="polite"><h3 class="text-2xl">{{ current.name }}</h3><p class="mt-4 text-sm leading-7 text-slate-300">{{ current.text }}</p></div><label class="mt-6 flex min-h-11 items-center gap-3 text-sm"><input v-model="exploded" type="checkbox" class="h-5 w-5">Vista com peças separadas</label><NuxtLink to="/exemplos/industrial/catalogo" class="mt-6 inline-flex min-h-12 items-center border-b border-[#82d0cf] text-sm">Consultar produtos e fichas reais ↗</NuxtLink></div></div><p class="mt-6 max-w-3xl text-xs leading-6 text-slate-400">Geometria didática genérica, sem vínculo com os modelos do catálogo. Não representa dimensões, montagem, operação ou especificação de um fabricante.</p></div></section>
</template>
