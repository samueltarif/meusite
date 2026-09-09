import type { FloralProduct } from '~/types/florist'

export const floralProducts: FloralProduct[] = [
  { id: 'abraco', name: 'Abraço em flor', category: 'Buquês', occasions: ['Aniversário', 'Amor'], image: '/images/campaign/flowers-bouquet.jpg', alt: 'Buquê de flores em tons de rosa, branco e laranja', description: 'Um encontro de cores delicadas e folhagens, para transformar uma lembrança em presença.', palette: 'Rosa, pêssego e verde', care: 'Troque a água regularmente e mantenha longe do sol direto.' },
  { id: 'sol', name: 'Um pouco de sol', category: 'Buquês', occasions: ['Aniversário', 'Agradecimento'], image: '/images/campaign/flowers-sun.jpg', alt: 'Buquê de girassóis amarelos', description: 'Girassóis e toda a energia de uma mensagem alegre. Para celebrar os pequenos e grandes começos.', palette: 'Amarelo e verde', care: 'Use um recipiente limpo e retire as folhas que ficarem submersas.' },
  { id: 'calma', name: 'Toda a calma', category: 'Vasos', occasions: ['Agradecimento', 'Só porque sim'], image: '/images/campaign/flowers-tulips.jpg', alt: 'Tulipas brancas em um vaso azul', description: 'Linhas leves, flores claras e um toque de azul. Um gesto que encontra lugar nos dias mais tranquilos.', palette: 'Branco e azul', care: 'Prefira um ambiente fresco, afastado de fontes de calor.' },
  { id: 'encontro', name: 'Nosso encontro', category: 'Buquês', occasions: ['Amor', 'Aniversário'], image: '/images/campaign/flowers-white.jpg', alt: 'Buquê de flores brancas sobre uma superfície de madeira', description: 'Uma composição clara e delicada para acompanhar histórias que merecem ser lembradas.', palette: 'Branco e verde', care: 'Renove a água e faça um pequeno corte na base das hastes.' },
  { id: 'jardim', name: 'Pequeno jardim', category: 'Arranjos', occasions: ['Só porque sim', 'Agradecimento'], image: '/images/campaign/flowers-window.jpg', alt: 'Arranjo floral em um vaso junto à janela', description: 'Texturas naturais e presença suave para dar outra atmosfera ao seu cantinho favorito.', palette: 'Verde e tons suaves', care: 'Mantenha em local ventilado, sem exposição direta ao sol.' },
  { id: 'festa', name: 'Dia de festa', category: 'Arranjos', occasions: ['Aniversário', 'Só porque sim'], image: '/images/campaign/flowers-color.jpg', alt: 'Flores coloridas reunidas em um vaso', description: 'Uma mistura espontânea de cores. Porque há dias que pedem um pouco mais de alegria.', palette: 'Cores variadas', care: 'Remova flores que murcharem e mantenha o recipiente limpo.' },
]
export const floralOccasions = ['Todas', 'Aniversário', 'Amor', 'Agradecimento', 'Só porque sim']
export const floralCategories = ['Todas', 'Buquês', 'Vasos', 'Arranjos']
export const floralRhythms = [
  { name: 'Toda semana', description: 'Um novo gesto para acompanhar a rotina.', visits: '4 composições em um ciclo ilustrativo de 4 semanas' },
  { name: 'A cada 15 dias', description: 'Uma pausa para renovar o olhar.', visits: '2 composições em um ciclo ilustrativo de 4 semanas' },
  { name: 'Uma vez por mês', description: 'Um encontro marcado com a natureza.', visits: '1 composição por ciclo mensal ilustrativo' },
]
