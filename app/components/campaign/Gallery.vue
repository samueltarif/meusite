<script setup lang="ts">
import type { GalleryImage } from '~/types/campaign'
defineProps<{ images: GalleryImage[]; dark?: boolean }>()
const selected = ref<GalleryImage | null>(null)
const modal = ref<HTMLDialogElement | null>(null)
const open = async (item: GalleryImage): Promise<void> => { selected.value = item; await nextTick(); modal.value?.showModal() }
const close = (): void => { modal.value?.close() }
</script>
<template>
  <div class="grid grid-cols-1 gap-5 sm:grid-cols-3"><button v-for="item in images" :key="item.src" type="button" class="group text-left" :aria-label="`Ampliar: ${item.caption}`" @click="open(item)"><div class="overflow-hidden"><img :src="item.src" :alt="item.alt" loading="lazy" width="800" height="1000" class="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"></div><span class="mt-3 flex justify-between gap-4 text-sm" :class="dark ? 'text-stone-300' : 'text-stone-600'">{{ item.caption }} <span aria-hidden="true">↗</span></span></button></div>
  <dialog ref="modal" aria-label="Imagem ampliada" class="max-h-[90vh] w-[min(960px,92vw)] bg-white p-0 text-stone-900" @click="($event.target === modal) && close()"><div v-if="selected"><div class="flex items-center justify-between gap-4 p-4"><p class="text-base">{{ selected.caption }}</p><button type="button" class="rounded border px-4 py-2 text-sm" autofocus @click="close">Fechar ✕</button></div><img :src="selected.src" :alt="selected.alt" class="max-h-[73vh] w-full object-contain"></div></dialog>
</template>
