import { computed, ref } from 'vue'
import { z } from 'zod'

const entrySchema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), km: z.coerce.number().int().min(0).max(2000000), service: z.string().trim().min(3).max(80) })
export function useDemoWorkshop() {
  const date = ref<string>('')
  const km = ref<string>('')
  const service = ref<string>('')
  const error = ref<string>('')
  const entries = ref<Array<{ id: number; date: string; km: number; service: string }>>([])
  let nextId = 0
  const ordered = computed(() => [...entries.value].sort((a, b) => b.date.localeCompare(a.date)))
  function add(): void {
    const result = entrySchema.safeParse({ date: date.value, km: km.value, service: service.value })
    if (!result.success || km.value.trim() === '') { error.value = 'Informe a data, a quilometragem e um serviço com pelo menos 3 caracteres.'; return }
    entries.value.push({ id: ++nextId, ...result.data }); error.value = ''; service.value = ''
  }
  function remove(id: number): void { entries.value = entries.value.filter(item => item.id !== id) }
  return { date, km, service, error, ordered, add, remove }
}
