export type ProductFamily = 'reguladores' | 'valvulas' | 'instrumentacao'
export interface IndustrialProduct {
  id: string
  model: string
  name: string
  manufacturer: string
  family: ProductFamily
  image: string
  pdf: string
  source: string
  specs: { label: string; value: string }[]
}
