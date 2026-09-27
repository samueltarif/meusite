<script setup lang="ts">
import type { Prospect } from '~/types/prospecting'
import { prospectHeatClasses, prospectStageLabels } from '~/constants/prospecting'
import { heat, terminalStage, contactSummary, contactCounted } from '~/utils/prospecting'
defineProps<{ lead: Prospect; today: string }>()
defineEmits<{ open: [lead: Prospect] }>()
</script>
<template>
  <button type="button" class="group flex w-full min-w-0 flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 motion-reduce:transform-none motion-reduce:transition-none" :aria-label="`Abrir ficha de ${lead.company}`" @click="$emit('open', lead)">
    <div class="flex flex-wrap items-center justify-between gap-2"><span class="rounded-full px-3 py-1.5 text-xs font-semibold" :class="lead.stage === 'Selecionado' ? 'bg-slate-100 text-slate-700' : lead.stage === 'Aprovado' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'">{{ prospectStageLabels[lead.stage] }}</span><span class="rounded-full border px-3 py-1 text-xs" :class="prospectHeatClasses[heat(lead)]">{{ heat(lead) }}</span></div>
    <div class="min-w-0"><h3 class="break-words text-xl font-semibold leading-snug">{{ lead.company }}</h3><p class="mt-2 text-sm text-slate-500">{{ lead.segment }} · {{ lead.city }}</p></div>
    <div class="rounded-xl bg-slate-50 p-3"><p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Dono / responsável</p><p class="mt-1 break-words text-sm">{{ lead.person || 'Dono ainda não identificado' }}</p><p class="mt-2 text-xs font-medium" :class="contactCounted(lead) ? 'text-blue-700' : 'text-slate-600'">{{ contactSummary(lead) }}</p></div>
    <div class="mt-auto border-t border-slate-100 pt-4"><p class="text-xs text-slate-500">{{ lead.websiteStatus }}</p><p class="mt-2 text-sm font-medium" :class="lead.followUp && lead.followUp < today && !terminalStage(lead.stage) ? 'text-amber-700' : 'text-slate-700'">{{ lead.followUp && !terminalStage(lead.stage) ? `Próxima ação: ${lead.followUp.split('-').reverse().join('/')}` : 'Sem próxima ação agendada' }}</p><p class="mt-1 break-words text-sm text-slate-500">{{ lead.nextAction || (lead.stage === 'Selecionado' ? 'Pesquisar e avaliar a empresa' : lead.stage === 'Aprovado' ? 'Preparar o primeiro contato' : 'Definir próximo passo') }}</p><span class="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-blue-700">Abrir ficha <span class="ml-2" aria-hidden="true">↗</span></span></div>
  </button>
</template>
