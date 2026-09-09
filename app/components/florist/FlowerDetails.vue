<script setup lang="ts">
import type { FloralProduct } from '~/types/florist'
defineProps<{ product: FloralProduct | null; saved: boolean }>()
defineEmits<{ toggle: [id: string] }>()
const dialog = ref<HTMLDialogElement | null>(null)
async function open() { await nextTick(); dialog.value?.showModal() }
defineExpose({ open })
</script>
<template>
  <dialog ref="dialog" aria-labelledby="flower-title" class="m-auto w-[min(800px,94vw)] rounded-2xl bg-[#fffdf8] p-5 text-[#343e31] sm:p-8">
    <div class="mb-5 flex justify-end"><button autofocus class="min-h-11 rounded-full border border-stone-300 px-4 text-sm" @click="dialog?.close()">Fechar ✕</button></div>
    <div v-if="product" class="grid gap-6 sm:grid-cols-2">
      <img :src="product.image" :alt="product.alt" width="700" height="850" class="aspect-[4/3] w-full rounded-lg object-cover sm:aspect-[4/5]">
      <div><p class="text-xs uppercase tracking-widest">{{ product.category }} · Referência floral</p><h2 id="flower-title" class="mt-4 font-['Playfair_Display'] text-3xl">{{ product.name }}</h2><p class="mt-4 leading-7">{{ product.description }}</p><dl class="mt-5 border-y border-stone-200 py-4 text-sm"><dt class="font-semibold">Paleta</dt><dd class="mt-1">{{ product.palette }}</dd><dt class="mt-4 font-semibold">Um cuidado simples</dt><dd class="mt-1 leading-6">{{ product.care }}</dd></dl><button :aria-pressed="saved" class="mt-5 min-h-12 w-full rounded-full bg-[#343e31] px-4 py-3 text-sm text-white" @click="$emit('toggle', product.id)">{{ saved ? 'Remover da seleção −' : 'Guardar na minha seleção +' }}</button><p class="mt-4 text-xs leading-5 text-stone-500">Catálogo demonstrativo. Fotos de referência; não há compra ou entrega de flores neste site.</p></div>
    </div>
  </dialog>
</template>
