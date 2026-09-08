import type { PortfolioPhoto } from '~/types/photography'
export const photoCategories = ['Todas', 'Retratos', 'Encontros', 'Paisagens'] as const
export const portfolioPhotos: PortfolioPhoto[] = [
  { id: '01', title: 'Entre luz e silêncio', category: 'Retratos', image: '/images/campaign/photo-portrait.jpg', alt: 'Retrato em preto e branco com luz lateral e sombras', author: 'Eugenia Pan’kiv', source: 'https://unsplash.com/photos/l0uhKKvNaak', portrait: true },
  { id: '02', title: 'O instante de estar junto', category: 'Encontros', image: '/images/campaign/photo-wedding.jpg', alt: 'Casal em traje de casamento na praia ao pôr do sol', author: 'Fotógrafo Samuel Cruz', source: 'https://unsplash.com/photos/ejUtbAi71_s', portrait: false },
  { id: '03', title: 'Camadas do horizonte', category: 'Paisagens', image: '/images/campaign/photo-landscape.jpg', alt: 'Camadas de montanhas e neblina ao entardecer', author: 'Willian Justen de Vasconcellos', source: 'https://unsplash.com/photos/_MMP5j_fCqw', portrait: false },
  { id: '04', title: 'Presença', category: 'Retratos', image: '/images/campaign/photo-studio.jpg', alt: 'Retrato de estúdio em preto e branco', author: 'Ionela Mat', source: 'https://unsplash.com/photos/dKy82cGE0Rw', portrait: true },
  { id: '05', title: 'Perto, sem pressa', category: 'Encontros', image: '/images/campaign/photo-couple.jpg', alt: 'Casal frente a frente em campo durante a luz dourada', author: 'Anna Vi', source: 'https://unsplash.com/photos/rQSauuUzx0w', portrait: false },
  { id: '06', title: 'O que permanece', category: 'Paisagens', image: '/images/campaign/photo-mountain.jpg', alt: 'Montanhas com neve e neblina na Islândia', author: 'Simon Peel', source: 'https://unsplash.com/photos/ZN-XuAa9Ts8', portrait: false },
]
