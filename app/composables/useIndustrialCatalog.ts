import { industrialProducts, productFamilies } from '~/constants/industrial'
import { filterIndustrialProducts } from '~/utils/catalog'
import type { IndustrialProduct } from '~/types/industrial'

export function useIndustrialCatalog() {
  const route = useRoute()
  const query = ref<string>('')
  const family = ref<string>('todos')
  const selected = ref<IndustrialProduct | null>(null)
  watch(() => route.query.familia, value => {
    family.value = typeof value === 'string' && productFamilies.some(item => item.id === value) ? value : 'todos'
  }, { immediate: true })
  const filtered = computed<IndustrialProduct[]>(() => filterIndustrialProducts(industrialProducts, query.value, family.value))
  const clear = (): void => { query.value = ''; family.value = 'todos' }
  return { query, family, selected, filtered, clear }
}
