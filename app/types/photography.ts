export type PhotoCategory = 'Retratos' | 'Encontros' | 'Paisagens'
export interface PortfolioPhoto {
  id: string
  title: string
  category: PhotoCategory
  image: string
  alt: string
  author: string
  source: string
  portrait: boolean
}
