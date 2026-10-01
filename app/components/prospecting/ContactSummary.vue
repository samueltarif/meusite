<script setup lang="ts">
import type { Prospect } from '~/types/prospecting'
import { outreachSummary } from '~/utils/prospecting-summary'
import { prospectStageLabels } from '~/constants/prospecting'
const props = defineProps<{ leads: Prospect[]; target: number; due: number }>()
defineEmits<{ configure: [] }>()
const summary = computed(() => outreachSummary(props.leads, props.target))
</script>
<template>
  <section class="my-7 space-y-4" aria-label="Controle dos contatos e da meta">
    <div class="rounded-2xl border p-5 sm:p-6" :class="summary.reached ? 'border-emerald-300 bg-emerald-50' : 'border-blue-200 bg-blue-50'">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div><h2 class="text-lg font-semibold">Meta de contatos respondidos</h2><p class="mt-3 text-3xl font-semibold sm:text-4xl">{{ summary.responses }} <span class="text-xl font-normal text-slate-500">/ {{ target }} respostas</span></p></div>
        <button type="button" class="min-h-11 rounded-lg border bg-white px-4 text-sm text-blue-700" @click="$emit('configure')">Alterar meta</button>
      </div>
      <div role="progressbar" aria-label="Progresso da meta de respostas" :aria-valuenow="Math.min(summary.responses, target)" :aria-valuemax="target" :aria-valuemin="0" :aria-valuetext="`${summary.responses} respostas de uma meta de ${target}`" class="mt-5 h-3 overflow-hidden rounded-full bg-white"><div class="h-full rounded-full transition-all" :class="summary.reached ? 'bg-emerald-600' : 'bg-blue-600'" :style="{ width: `${summary.progress}%` }" /></div>
      <p role="status" class="mt-3 text-base font-semibold" :class="summary.reached ? 'text-emerald-800' : 'text-blue-900'">{{ summary.reached ? 'Meta atingida! Pode encerrar a rodada de contatos.' : `Faltam ${summary.remaining} respostas para atingir a meta.` }}</p>
      <p class="mt-2 text-xs leading-6 text-slate-600">Baseado no status atual dos cards das empresas ativas, sem os filtros da lista. Cada empresa conta uma vez. Apenas “Contato realizado” conta para a meta; mudar para “Nenhum contato” retira a empresa da contagem.</p>
    </div>
    <div class="grid grid-cols-2 gap-3 xl:grid-cols-5">
      <div v-for="item in [{ label: 'Contato realizado', value: summary.responses, description: 'Mesmo status do card · conta para a meta' }, { label: 'Não atendeu', value: summary.noAnswer, description: 'Mesmo status do card · fora da meta' }, { label: 'Não respondeu', value: summary.noReply, description: 'Mesmo status do card · fora da meta' }, { label: 'Nenhum contato', value: summary.notContacted, description: 'Mesmo status do card · fora da meta' }, { label: 'Retornos até hoje', value: due, description: 'Pendentes, incluindo atrasados' }]" :key="item.label" class="rounded-xl border border-slate-200 bg-white p-4"><p class="text-sm text-slate-600">{{ item.label }}</p><p class="mt-3 text-3xl font-semibold">{{ item.value }}</p><p class="mt-2 text-xs leading-5 text-slate-500">{{ item.description }}</p></div>
    </div>
    <div class="rounded-xl border border-slate-200 bg-white p-4"><h3 class="text-sm font-semibold">Situação atual das empresas ativas</h3><div class="mt-3 flex flex-wrap gap-2"><span v-for="item in summary.stages" :key="item.stage" class="rounded-lg bg-slate-100 px-3 py-2 text-sm">{{ prospectStageLabels[item.stage] }} <strong class="ml-2">{{ item.count }}</strong></span></div><p class="mt-3 text-xs leading-6 text-slate-500">As etapas acima representam o andamento comercial. Os contadores de contato e a meta seguem o campo “Status do contato” do card, atualizado em “Mudar status”.</p></div>
  </section>
</template>
