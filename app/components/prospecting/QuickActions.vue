<script setup lang="ts">
import type { Prospect } from '~/types/prospecting'
import { prospectPhones, whatsappUrl } from '~/utils/prospecting-workspace'
import { terminalStage } from '~/utils/prospecting'
const props = defineProps<{ lead: Prospect }>()
defineEmits<{ log: [lead: Prospect]; schedule: [lead: Prospect] }>()
const phones = computed(() => prospectPhones(props.lead).filter(phone => whatsappUrl(phone)))
</script>
<template>
  <div v-if="!lead.archived && !terminalStage(lead.stage)" class="flex flex-wrap items-center gap-2 text-xs">
    <a v-if="phones.length === 1" :href="whatsappUrl(phones[0]!)" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-emerald-800" :aria-label="`Abrir WhatsApp de ${lead.company}`">WhatsApp ↗</a>
    <details v-else-if="phones.length > 1" class="rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-emerald-800"><summary class="flex min-h-11 cursor-pointer items-center">WhatsApp · {{ phones.length }} números</summary><a v-for="phone in phones" :key="phone" :href="whatsappUrl(phone)" target="_blank" rel="noopener noreferrer" class="block py-3 underline">{{ phone }} ↗</a></details>
    <button type="button" class="min-h-11 rounded-lg border px-3 text-blue-700" @click="$emit('log', lead)">Registrar contato</button>
    <button type="button" class="min-h-11 rounded-lg border px-3" @click="$emit('schedule', lead)">Agendar retorno</button>
  </div>
</template>
