<script setup lang="ts">
import { industrialProducts } from '~/constants/industrial'
const { firstId, secondId, first, second, rows } = useIndustrialComparison()
</script>
<template>
  <details id="comparar" class="mt-10 border border-slate-200 bg-white p-5 md:p-8">
    <summary class="cursor-pointer font-heading text-xl font-semibold">Comparar características de dois modelos</summary>
    <p class="mt-5 text-base leading-7 text-slate-500">Consulte as diferenças lado a lado. A comparação não determina equivalência ou substituição entre equipamentos.</p>
    <div class="my-6 grid gap-5 sm:grid-cols-2"><div><label for="compare-first" class="mb-2 block text-sm font-semibold">Primeiro modelo</label><select id="compare-first" v-model="firstId" class="w-full border border-slate-300 bg-white p-3 text-sm"><option v-for="product in industrialProducts" :key="product.id" :value="product.id">{{ product.manufacturer }} · {{ product.model }}</option></select></div><div><label for="compare-second" class="mb-2 block text-sm font-semibold">Segundo modelo</label><select id="compare-second" v-model="secondId" class="w-full border border-slate-300 bg-white p-3 text-sm"><option v-for="product in industrialProducts" :key="product.id" :value="product.id">{{ product.manufacturer }} · {{ product.model }}</option></select></div></div>
    <p v-if="firstId === secondId" role="status" class="border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Você selecionou o mesmo modelo. Escolha outro para consultar as diferenças.</p>
    <div v-else class="overflow-x-auto"><table class="w-full min-w-[480px] text-left text-sm"><caption class="sr-only">Comparação entre {{ first.model }} e {{ second.model }}</caption><thead><tr class="bg-[#edf3f4]"><th scope="col" class="p-4">Característica</th><th scope="col" class="p-4">{{ first.model }}</th><th scope="col" class="p-4">{{ second.model }}</th></tr></thead><tbody><tr v-for="row in rows" :key="row.label" class="border-b border-slate-200"><th scope="row" class="p-4 font-normal text-slate-500">{{ row.label }}</th><td class="p-4">{{ row.first }}</td><td class="p-4">{{ row.second }}</td></tr></tbody></table></div>
  </details>
</template>
