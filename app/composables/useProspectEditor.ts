import { ref } from 'vue'
import type { Prospect } from '~/types/prospecting'
import { newProspect } from '~/utils/prospecting'
import { prospectSchema } from '~/validation/prospecting'
export function useProspectEditor() {
  const draft = ref<Prospect | null>(null)
  const errors = ref<Record<string, string>>({})
  function start(lead?: Prospect) { draft.value = lead ? JSON.parse(JSON.stringify(lead)) as Prospect : newProspect(); errors.value = {} }
  function validate(): Prospect | null {
    const value = { ...draft.value, rating: draft.value?.rating === null || String(draft.value?.rating) === '' ? null : Number(draft.value?.rating), reviewCount: draft.value?.reviewCount === null || String(draft.value?.reviewCount) === '' ? null : Number(draft.value?.reviewCount) }
    const parsed = prospectSchema.safeParse(value)
    errors.value = {}
    if (!parsed.success) { for (const issue of parsed.error.issues) errors.value[String(issue.path[0])] = issue.message; return null }
    return parsed.data
  }
  return { draft, errors, start, validate }
}
