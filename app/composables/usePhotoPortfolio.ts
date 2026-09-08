import { computed, ref } from 'vue'
import { portfolioPhotos, photoCategories } from '~/constants/photography'
export function usePhotoPortfolio() {
  const category = ref<typeof photoCategories[number]>('Todas')
  const favorites = ref<string[]>([])
  const onlyFavorites = ref<boolean>(false)
  const selectedId = ref<string>('01')
  const visible = computed(() => portfolioPhotos.filter(photo => (category.value === 'Todas' || photo.category === category.value) && (!onlyFavorites.value || favorites.value.includes(photo.id))))
  const selected = computed(() => portfolioPhotos.find(photo => photo.id === selectedId.value) ?? portfolioPhotos[0]!)
  function toggle(id: string): void {
    if (!portfolioPhotos.some(photo => photo.id === id)) return
    favorites.value = favorites.value.includes(id) ? favorites.value.filter(value => value !== id) : [...favorites.value, id]
  }
  function move(delta: number): void {
    if (!visible.value.length) return
    const index = visible.value.findIndex(photo => photo.id === selectedId.value)
    const nextIndex = ((index + delta) % visible.value.length + visible.value.length) % visible.value.length
    selectedId.value = visible.value[nextIndex]!.id
  }
  function reset(): void { category.value = 'Todas'; onlyFavorites.value = false }
  return { category, favorites, onlyFavorites, visible, selectedId, selected, toggle, move, reset }
}
