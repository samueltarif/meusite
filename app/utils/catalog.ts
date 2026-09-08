import type { IndustrialProduct } from '~/types/industrial'
export function filterIndustrialProducts(products: IndustrialProduct[], query: string, family: string): IndustrialProduct[] {
  const normalize = (value: string): string => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean)
  return products.filter(product => {
    if (family !== 'todos' && product.family !== family) return false
    const text = normalize(`${product.name} ${product.model} ${product.manufacturer} ${product.family}`)
    return terms.every(term => text.includes(term))
  })
}
