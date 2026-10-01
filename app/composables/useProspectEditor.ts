import { ref } from 'vue'
import type { Prospect } from '~/types/prospecting'
import { newProspect } from '~/utils/prospecting'
import { prospectSchema } from '~/validation/prospecting'
export function useProspectEditor() {
  const draft = ref<Prospect | null>(null)
  const errors = ref<Record<string, string>>({})
  function start(lead?: Prospect) { draft.value = lead ? JSON.parse(JSON.stringify(lead)) as Prospect : newProspect(); if (draft.value) draft.value.additionalPhones ??= []; errors.value = {} }
  function validate(): Prospect | null {
    const now = new Date().toISOString()
    const value = {
      ...draft.value,
      createdAt: draft.value?.createdAt || now,
      updatedAt: draft.value?.updatedAt || now,
      additionalPhones: (draft.value?.additionalPhones || []).map(phone => phone.trim()).filter(Boolean),
      rating: draft.value?.rating === null || String(draft.value?.rating) === '' ? null : Number(draft.value?.rating),
      reviewCount: draft.value?.reviewCount === null || String(draft.value?.reviewCount) === '' ? null : Number(draft.value?.reviewCount),
    }
    const parsed = prospectSchema.safeParse(value)
    errors.value = {}
    if (!parsed.success) { for (const issue of parsed.error.issues) errors.value[String(issue.path[0])] = issue.message; return null }
    return parsed.data
  }
  return { draft, errors, start, validate }
}
