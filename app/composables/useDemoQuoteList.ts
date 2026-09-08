import { computed, ref } from 'vue'
import { industrialProducts } from '~/constants/industrial'
export function useDemoQuoteList() {
  const productId = ref<string>('gdr')
  const quantities = ref<Record<string, number>>({})
  const items = computed(() => industrialProducts.filter(product => quantities.value[product.id]).map(product => ({ ...product, quantity: quantities.value[product.id]! })))
  function add(): void { if (industrialProducts.some(item => item.id === productId.value)) quantities.value[productId.value] = Math.min(999, (quantities.value[productId.value] ?? 0) + 1) }
  function change(id: string, delta: number): void { const value = (quantities.value[id] ?? 0) + delta; if (value <= 0) delete quantities.value[id]; else quantities.value[id] = Math.min(999, value) }
  function clear(): void { quantities.value = {} }
  return { productId, items, add, change, clear }
}
