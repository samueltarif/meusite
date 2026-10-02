<script setup lang="ts">
import { assertNoImportDuplicates } from '~/utils/prospecting-duplicates'
import type { Prospect, ProspectData } from '~/types/prospecting'
const props = defineProps<{ pending: ProspectData | null; existing: Prospect[]; busy: boolean; disabled: boolean; error?: string }>()
defineEmits<{ file: [event: Event]; confirm: []; cancel: [] }>()
const conflict = computed(() => { if (!props.pending) return ''; try { assertNoImportDuplicates(props.pending.leads, props.existing); return '' } catch (error: any) { return error.message } })
const existingIds = computed(() => new Set(props.existing.map(lead => lead.id)))
const duplicateCount = computed(() => props.pending?.leads.filter(lead => existingIds.value.has(lead.id)).length || 0)
</script>
<template>
  <section class="mb-6 rounded-xl border border-slate-200 bg-white p-5" aria-label="Importar cadastros">
    <h2 class="text-lg font-semibold">Importar cadastros · JSON ou Excel</h2>
    <p class="mt-2 text-sm leading-6 text-slate-600">Importe uma empresa ou várias de uma vez, com telefones, status, observações, valores e histórico. Use JSON do painel, uma ficha JSON, uma lista de fichas ou Excel .xlsx com a aba Empresas. Os arquivos exportados pelo painel servem como modelo. Até 10 MB e 5.000 empresas.</p>
    <label class="mt-4 block text-sm font-medium">Escolher arquivo<input type="file" accept=".json,.xlsx,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :disabled="disabled || busy" class="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border file:bg-slate-50 file:px-4 file:py-3 disabled:opacity-50" @change="$emit('file', $event)"></label>
    <p v-if="error" role="alert" class="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{{ error }}</p>
    <p v-if="busy" role="status" class="mt-3 text-sm">Processando importação…</p>
    <div v-if="pending" class="mt-5 rounded-xl bg-slate-50 p-4">
      <h3 class="font-semibold">Confira antes de importar</h3>
      <p class="mt-2 text-sm">{{ pending.leads.length }} empresas encontradas.</p>
      <p class="mt-2 text-sm">{{ pending.leads.reduce((total, lead) => total + lead.history.length, 0) }} interações no arquivo. Se houver nome, responsável, telefone, e-mail, site, Instagram, Google Maps ou ID em comum com outra empresa, o arquivo inteiro será bloqueado, inclusive duplicidades internas. Meta e investimento atuais serão mantidos.</p>
      <ul class="my-3 max-h-48 overflow-auto text-sm"><li v-for="lead in pending.leads.slice(0, 20)" :key="lead.id" class="border-b py-2">{{ lead.company }} · {{ lead.city }} · {{ lead.segment }} · {{ existingIds.has(lead.id) ? 'Conflito — importação bloqueada' : 'Novo cadastro' }}</li></ul><p v-if="pending.leads.length > 20" class="mb-3 text-xs">Exibindo os primeiros 20 de {{ pending.leads.length }} cadastros.</p>
      <p class="mb-3 text-xs text-slate-500">Sem ID, será gerado um novo cadastro. Nomes e telefones são comparados sem diferenças de formatação. Arquivados também são verificados. Cidade, segmento e status iguais não são duplicidade.</p>
      <p v-if="conflict" role="alert" class="mb-3 text-sm text-rose-700">{{ conflict }}</p><div class="flex flex-wrap gap-3"><button type="button" :disabled="busy || disabled || !!conflict" class="min-h-11 rounded-lg bg-blue-600 px-4 text-sm text-white disabled:opacity-50" @click="$emit('confirm')">Confirmar importação</button><button type="button" :disabled="busy" class="min-h-11 px-4 text-sm" @click="$emit('cancel')">Cancelar</button></div>
    </div>
  </section>
</template>
