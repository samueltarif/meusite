<script setup lang="ts">
import type { Prospect } from '~/types/prospecting'
import { downloadProspectAnalysis, type ProspectExportInput } from '~/services/prospecting-export'
const props = defineProps<{ leads?: Prospect[]; draft?: boolean; load?: () => Promise<ProspectExportInput>; disabled?: boolean }>()
const exporting = ref(false)
const error = ref('')
const notice = ref('')
async function download(format: 'json' | 'xlsx') {
  if (exporting.value || props.disabled) return
  exporting.value = true
  error.value = ''; notice.value = ''
  try {
    const input = props.load ? await props.load() : { leads: props.leads || [], scope: props.draft ? 'draft' as const : 'company' as const }
    await downloadProspectAnalysis(input, format)
    notice.value = `Arquivo ${format === 'json' ? 'JSON' : 'Excel'} preparado com ${input.leads.length} empresa(s).`
  } catch (err: any) { error.value = err?.data?.statusMessage || err?.message || 'Não foi possível gerar o arquivo. Tente novamente.' }
  finally { exporting.value = false }
}
</script>
<template>
  <section class="rounded-xl border border-blue-100 bg-blue-50/60 p-4" aria-label="Exportar dados para análise">
    <h3 class="text-sm font-semibold">{{ load ? 'Baixar toda a base para análise' : 'Baixar todos os dados desta empresa' }}</h3>
    <p class="mt-2 text-xs leading-6 text-slate-600">{{ load ? 'Inclui todas as empresas, arquivadas, telefones, campos preenchidos, histórico e configurações. Os filtros da tela não limitam a exportação.' : draft ? 'Inclui os valores atuais de todos os campos e o histórico, mesmo antes de salvar. O arquivo será identificado como rascunho.' : 'Inclui todos os campos, telefones, observações, valores e histórico desta ficha.' }} JSON preserva a estrutura completa; Excel organiza os dados em abas para comparar no ChatGPT.</p>
    <div class="mt-3 flex flex-wrap gap-2"><button type="button" :disabled="disabled || exporting" class="min-h-11 rounded-lg border border-blue-200 bg-white px-4 text-sm text-blue-800 disabled:opacity-50" @click="download('json')">Baixar JSON completo</button><button type="button" :disabled="disabled || exporting" class="min-h-11 rounded-lg border border-blue-200 bg-white px-4 text-sm text-blue-800 disabled:opacity-50" @click="download('xlsx')">Baixar Excel (.xlsx)</button></div>
    <p v-if="exporting" role="status" class="mt-2 text-xs">Preparando todos os dados…</p><p v-if="notice" role="status" class="mt-2 text-xs text-emerald-800">{{ notice }}</p><p v-if="error" role="alert" class="mt-2 text-sm text-rose-700">{{ error }}</p>
  </section>
</template>
