import { computed, ref } from 'vue'
import { floralProducts } from '~/constants/florist'

const normalize = (value: string): string => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
export function useFloralCatalog() {
  const query = ref('')
  const category = ref('Todas')
  const occasion = ref('Todas')
  const savedIds = ref<string[]>([])
  const onlySaved = ref(false)
  const note = ref('')
  const visible = computed(() => floralProducts.filter(product =>
    (category.value === 'Todas' || product.category === category.value) &&
    (occasion.value === 'Todas' || product.occasions.includes(occasion.value)) &&
    (!onlySaved.value || savedIds.value.includes(product.id)) &&
    normalize(`${product.name} ${product.alt} ${product.description} ${product.palette} ${product.category}`).includes(normalize(query.value)),
  ))
  const saved = computed(() => floralProducts.filter(product => savedIds.value.includes(product.id)))
  function toggle(id: string) {
    if (!floralProducts.some(product => product.id === id)) return
    savedIds.value = savedIds.value.includes(id) ? savedIds.value.filter(value => value !== id) : [...savedIds.value, id]
  }
  function reset() { query.value = ''; category.value = 'Todas'; occasion.value = 'Todas'; onlySaved.value = false }
  return { query, category, occasion, savedIds, onlySaved, note, visible, saved, toggle, reset }
}
