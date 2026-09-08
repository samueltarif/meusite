import { computed, ref } from 'vue'
import { industrialProducts } from '~/constants/industrial'
export function useIndustrialComparison() {
  const firstId = ref<string>('gdr')
  const secondId = ref<string>('591')
  const first = computed(() => industrialProducts.find(item => item.id === firstId.value)!)
  const second = computed(() => industrialProducts.find(item => item.id === secondId.value)!)
  const labels = computed<string[]>(() => [...new Set([...first.value.specs, ...second.value.specs].map(spec => spec.label))])
  const rows = computed(() => labels.value.map(label => ({ label, first: first.value.specs.find(spec => spec.label === label)?.value ?? 'Consultar ficha', second: second.value.specs.find(spec => spec.label === label)?.value ?? 'Consultar ficha' })))
  return { firstId, secondId, first, second, rows }
}
