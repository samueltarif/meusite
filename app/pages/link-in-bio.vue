<script setup lang="ts">
import { ref, computed } from 'vue'

useSeoMeta({
  title: 'Templates LinkChameleon - Link in Bio | Avyro Growth',
  description: 'Escolha seu tema de link na bio e adicione suas plataformas com ícones oficiais. Playground interativo premium para customizar sua presença digital.',
})

export interface LinkItem {
  id: number
  title: string
  url: string
  icon?: string
}

export interface Theme {
  id: string
  name: string
  bio: string
  categories: string[]
  bgColor: string
  bgStyle: string
  bgImageUrl?: string
  textColor: string
  btnBgColor: string
  btnTextColor: string
  btnBorder: string
  roundness: string
  fontClass: string
  avatarUrl: string
  socials: string[]
  links?: LinkItem[]
}
import { brandIcons } from '~/utils/brandIcons'

// Top platforms icon selector definitions using official keys
const topPlatformsIcons = [
  { id: 'none', name: 'Nenhum', icon: '' },
  { id: 'instagram', name: 'Instagram', icon: 'instagram' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'whatsapp' },
  { id: 'tiktok', name: 'TikTok', icon: 'tiktok' },
  { id: 'threads', name: 'Threads', icon: 'threads' },
  { id: 'youtube', name: 'YouTube', icon: 'youtube' },
  { id: 'spotify', name: 'Spotify', icon: 'spotify' },
  { id: 'x', name: 'X / Twitter', icon: 'x' },
  { id: 'website', name: 'Website', icon: 'website' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin' },
  { id: 'email', name: 'E-mail', icon: 'email' },
  { id: 'store', name: 'Loja', icon: 'store' },
  { id: 'phone', name: 'Telefone', icon: 'phone' },
]

// Categories list
const categories = [
  { id: 'all', name: 'Todos os modelos' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'health-fitness', name: 'Health & Fitness' },
  { id: 'influencer-creator', name: 'Influencer & Creator' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'music', name: 'Music' },
  { id: 'small-business', name: 'Small Business' },
  { id: 'social-media', name: 'Social Media' },
  { id: 'sports', name: 'Sports' },
  { id: 'telegram', name: 'Telegram' },
  { id: 'whatsapp', name: 'WhatsApp' },
]

const activeCategory = ref('all')

// Preset background photos focused on diverse professional areas
const presetBackgrounds = [
  { name: 'Nenhuma (Sólida)', url: '', group: 'geral' },
  
  // Profissionais & Corporativo
  { name: '🩺 Saúde & Medicina', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600', group: 'pro' },
  { name: '⚖️ Advocacia & Direito', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600', group: 'pro' },
  { name: '💻 Tecnologia & Dev', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600', group: 'pro' },
  { name: '📐 Arquitetura & Design', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600', group: 'pro' },
  { name: '📈 Negócios & Consultoria', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600', group: 'pro' },
  { name: '🏡 Imobiliária & Corretores', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600', group: 'pro' },
  { name: '🎓 Educação & Cursos', url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=600', group: 'pro' },

  // Beleza, Arte & Criadores
  { name: '💄 Estética & Beleza', url: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=600', group: 'creators' },
  { name: '📷 Fotografia & Cinema', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600', group: 'creators' },
  { name: '🎨 Atelier & Ilustração', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600', group: 'creators' },
  { name: '🎙️ Podcast & Audio', url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600', group: 'creators' },
  { name: '☕ Gastronomia & Barista', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600', group: 'creators' },
  { name: '🍰 Confeitaria & Bakery', url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=600', group: 'creators' },

  // Esportes & Estilo de Vida
  { name: '🏋️‍♂️ Fitness & Personal', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600', group: 'lifestyle' },
  { name: '🏃‍♀️ Pista & Corrida', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=600', group: 'lifestyle' },
  { name: '🏄 Surfe & Praia', url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=600', group: 'lifestyle' },
  { name: '🛹 Skate & Street', url: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&q=80&w=600', group: 'lifestyle' },
  { name: '🏖️ Turismo & Viagem', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600', group: 'lifestyle' },
  { name: '🎉 Festas & Eventos', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600', group: 'lifestyle' },
]

const activeBgGroup = ref('all')

const filteredPresetBackgrounds = computed(() => {
  if (activeBgGroup.value === 'all') return presetBackgrounds
  return presetBackgrounds.filter((b) => b.group === 'geral' || b.group === activeBgGroup.value)
})

// Definition of pre-built themes with high-resolution background photos matching their category
const themes: Theme[] = [
  // 1. Monica Vera (Fashion & Creator)
  {
    id: 'monica-vera',
    name: 'Monica Vera',
    categories: ['fashion', 'influencer-creator'],
    bio: 'Daily Rituals',
    bgColor: '#4b3e34',
    bgImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.55)), url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#ffffff',
    btnBgColor: '#6b5d52',
    btnTextColor: '#ffffff',
    btnBorder: '',
    roundness: 'rounded-full',
    fontClass: 'font-serif',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    socials: ['tiktok', 'youtube', 'instagram'],
    links: [
      { id: 1, title: 'YouTube Channel', url: 'https://youtube.com', icon: 'youtube' },
      { id: 2, title: 'TikTok Daily Vlog', url: 'https://tiktok.com', icon: 'tiktok' },
      { id: 3, title: 'Spotify Podcast', url: 'https://spotify.com', icon: 'spotify' },
      { id: 4, title: 'Work Inquiries', url: 'https://monica.com', icon: 'email' }
    ]
  },
  // 2. Lexie Candis (Fashion & Art)
  {
    id: 'lexie-candis',
    name: 'Lexie Candis',
    categories: ['fashion', 'influencer-creator'],
    bio: 'Pastel artist from Melbourne',
    bgColor: '#8b5cf6',
    bgImageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(139,92,246,0.5), rgba(109,40,217,0.75)), url("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#ffffff',
    btnBgColor: '#ede9fe',
    btnTextColor: '#6d28d9',
    btnBorder: '',
    roundness: 'rounded-full',
    fontClass: 'font-serif',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    socials: ['tiktok', 'youtube', 'spotify'],
  },
  // 3. Memphis Pop (Marketing & Design)
  {
    id: 'memphis-pop',
    name: 'Memphis Pop',
    categories: ['marketing', 'social-media'],
    bio: 'Graphic Designer & Illustrator',
    bgColor: '#fbf5e6',
    bgImageUrl: 'https://images.unsplash.com/photo-1542744094-3a3172720177?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(251,245,230,0.85), rgba(251,245,230,0.92)), url("https://images.unsplash.com/photo-1542744094-3a3172720177?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#1a1a1a',
    btnBgColor: '#1a1a1a',
    btnTextColor: '#ffffff',
    btnBorder: '',
    roundness: 'rounded-none',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    socials: ['tiktok', 'instagram', 'youtube'],
  },
  // 4. Vaporwave Grid (Music & Cyberpunk)
  {
    id: 'vaporwave-grid',
    name: 'Vaporwave Grid',
    categories: ['music', 'telegram'],
    bio: 'Dreaming in Synthwave',
    bgColor: '#140533',
    bgImageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(20,5,51,0.65), rgba(2,0,13,0.85)), url("https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#00f0ff',
    btnBgColor: '#140533',
    btnTextColor: '#00f0ff',
    btnBorder: 'border border-[#ff007f]',
    roundness: 'btn-outline',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    socials: ['tiktok', 'youtube', 'spotify'],
  },
  // 5. Boho Circles (Fashion & Crafts)
  {
    id: 'boho-circles',
    name: 'Boho Circles',
    categories: ['fashion', 'small-business'],
    bio: 'Pottery & Earthy Crafts',
    bgColor: '#df7a5f',
    bgImageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(223,122,95,0.7), rgba(180,85,60,0.85)), url("https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#2d3748',
    btnBgColor: '#2d3748',
    btnTextColor: '#f7fafc',
    btnBorder: '',
    roundness: 'rounded-xl',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    socials: ['instagram', 'youtube', 'spotify'],
  },
  // 6. Lowell Maxwell (Music & DJ Studio)
  {
    id: 'lowell-maxwell',
    name: 'Lowell Maxwell',
    categories: ['music', 'influencer-creator'],
    bio: 'Soul beats and merch from Hackney',
    bgColor: '#442222',
    bgImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(68,34,34,0.75), rgba(36,20,20,0.9)), url("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#fdf6e2',
    btnBgColor: '#fdf6e2',
    btnTextColor: '#442222',
    btnBorder: '',
    roundness: 'rounded-md',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    socials: ['instagram', 'youtube', 'spotify'],
  },
  // 7. Terrazzo Flecks (Fashion & Interior Design)
  {
    id: 'terrazzo-flecks',
    name: 'Terrazzo Flecks',
    categories: ['fashion', 'marketing'],
    bio: 'Curated Interior Design',
    bgColor: '#f4eae1',
    bgImageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(244,234,225,0.75), rgba(244,234,225,0.9)), url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#2c3e50',
    btnBgColor: '#2c3e50',
    btnTextColor: '#ffffff',
    btnBorder: '',
    roundness: 'rounded-xl',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150',
    socials: ['instagram', 'spotify', 'website'],
  },
  // 9. Shaep Fitness (Kelsey Rose)
  {
    id: 'shaep-fitness',
    name: 'Shaep Fitness (Kelsey Rose)',
    categories: ['health-fitness', 'influencer-creator'],
    bio: 'Treinadora & fundadora da Shaep (442 mil seguidores)',
    bgColor: '#f4f1ea',
    bgImageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(244,241,234,0.85), rgba(235,231,223,0.92)), url("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#1c1917',
    btnBgColor: '#e7e3da',
    btnTextColor: '#1c1917',
    btnBorder: 'border border-[#d6d0c4]',
    roundness: 'rounded-full',
    fontClass: 'font-serif',
    avatarUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=150',
    socials: ['instagram', 'tiktok', 'youtube'],
    links: [
      { id: 1, title: '🏋️ Shift Workouts & Training', url: 'https://shaep.co', icon: 'store' },
      { id: 2, title: '🧘 Meditation & Breathwork', url: 'https://shaep.co', icon: 'website' },
      { id: 3, title: '💬 Shaep Community Chat', url: 'https://shaep.co', icon: 'whatsapp' }
    ]
  },
  // 10. Pistakio Organic (Nico & Fran)
  {
    id: 'pistakio-organic',
    name: 'Pistakio Organic (Nico & Fran)',
    categories: ['small-business', 'food'],
    bio: 'Fundadores da Pistakio (28,7 mil seguidores)',
    bgColor: '#8fa844',
    bgImageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(143,168,68,0.85), rgba(110,132,48,0.92)), url("https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#1a2e05',
    btnBgColor: '#f1f7d9',
    btnTextColor: '#2d4508',
    btnBorder: 'border border-[#a8c652]',
    roundness: 'rounded-2xl',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=150',
    socials: ['instagram', 'youtube', 'tiktok'],
    links: [
      { id: 1, title: '🥜 Creamy Pistachio Spread - $15', url: 'https://pistakio.com', icon: 'store' },
      { id: 2, title: '🫙 Crunchy Pistachio Spread - $15', url: 'https://pistakio.com', icon: 'store' },
      { id: 3, title: '🌱 Nossa História & Loja Oficial', url: 'https://pistakio.com', icon: 'website' }
    ]
  },
  // 11. Perfect Person (Miles Bon)
  {
    id: 'perfect-person-podcast',
    name: 'Perfect Person (Miles Bon)',
    categories: ['podcast', 'music'],
    bio: 'Podcaster & Criador (351 mil seguidores)',
    bgColor: '#d97706',
    bgImageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(217,119,6,0.85), rgba(180,83,9,0.92)), url("https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#451a03',
    btnBgColor: '#fef3c7',
    btnTextColor: '#78350f',
    btnBorder: 'border border-[#f59e0b]',
    roundness: 'rounded-xl',
    fontClass: 'font-serif',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    socials: ['instagram', 'spotify', 'youtube'],
    links: [
      { id: 1, title: '🎙️ Perfect Person Podcast Ep. 165', url: 'https://perfectperson.com', icon: 'spotify' },
      { id: 2, title: '⭐ Join My Patreon', url: 'https://patreon.com', icon: 'website' },
      { id: 3, title: '🎟️ Dialtone Tour Pt. 2 Tickets', url: 'https://perfectperson.com', icon: 'store' }
    ]
  },
  // 12. Zay Dante (Músico & Criador)
  {
    id: 'zay-dante-music',
    name: 'Zay Dante (Músico & Criador)',
    categories: ['music', 'influencer-creator'],
    bio: 'Músico e Criador (2.7 milhões de seguidores)',
    bgColor: '#ea580c',
    bgImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(234,88,12,0.85), rgba(154,52,18,0.92)), url("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#fff7ed',
    btnBgColor: '#84cc16',
    btnTextColor: '#1a2e05',
    btnBorder: '',
    roundness: 'rounded-2xl',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    socials: ['instagram', 'spotify', 'youtube'],
    links: [
      { id: 1, title: '🎵 New Single: Pop Song (Out Now)', url: 'https://spotify.com', icon: 'spotify' },
      { id: 2, title: '🎧 Official Spotify Playlist', url: 'https://spotify.com', icon: 'spotify' },
      { id: 3, title: '🎸 Tour Dates & Tickets 2026', url: 'https://zaydante.com', icon: 'website' }
    ]
  },
  // 13. Koy Sun (Artista & Pop Art)
  {
    id: 'koy-sun-art',
    name: 'Koy Sun (Artista & Pop Art)',
    categories: ['art', 'tiktok'],
    bio: 'Artista Visual & Criador (238 mil seguidores)',
    bgColor: '#1d4ed8',
    bgImageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(29,78,216,0.85), rgba(30,58,138,0.92)), url("https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#fffbeb',
    btnBgColor: '#fffbeb',
    btnTextColor: '#1e3a8a',
    btnBorder: 'border-2 border-[#1d4ed8]',
    roundness: 'btn-outline',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    socials: ['instagram', 'tiktok', 'youtube'],
    links: [
      { id: 1, title: '🎨 Check Out My Work & Portfolio', url: 'https://koysun.com', icon: 'website' },
      { id: 2, title: '🎬 TikTok Paint & Process Videos', url: 'https://tiktok.com', icon: 'tiktok' },
      { id: 3, title: '🖼️ Limited Edition Art Prints', url: 'https://koysun.com', icon: 'store' }
    ]
  },
  // 8. Line Art Leaves (Health & Wellness)
  {
    id: 'line-art-leaves',
    name: 'Line Art Leaves',
    categories: ['small-business', 'health-fitness'],
    bio: 'Organic Lifestyle & Tea',
    bgColor: '#f7f6f0',
    bgImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(247,246,240,0.85), rgba(247,246,240,0.95)), url("https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#3d5a4a',
    btnBgColor: '#e2ede4',
    btnTextColor: '#1e352f',
    btnBorder: '',
    roundness: 'rounded-full',
    fontClass: 'font-serif',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    socials: ['instagram', 'youtube', 'spotify'],
  },
  // 9. Ella Vibe (Music & Concert)
  {
    id: 'ella-vibe',
    name: 'Ella Vibe',
    categories: ['music', 'telegram', 'social-media'],
    bio: 'Hard times – Hard techno',
    bgColor: '#121214',
    bgImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(18,18,20,0.7), rgba(9,9,11,0.9)), url("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#ffffff',
    btnBgColor: '#18181b',
    btnTextColor: '#ffffff',
    btnBorder: 'border border-[#3f3f46]',
    roundness: 'rounded-full',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    socials: ['tiktok', 'spotify', 'youtube'],
  },
  // 10. Gibby Hill (Fashion & Jewelry)
  {
    id: 'gibby-hill',
    name: 'Gibby Hill',
    categories: ['fashion', 'small-business'],
    bio: 'Jewellery Lessons and Designs',
    bgColor: '#fbf3eb',
    bgImageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(251,243,235,0.8), rgba(245,230,216,0.92)), url("https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#1c1917',
    btnBgColor: '#f5e6d8',
    btnTextColor: '#292524',
    btnBorder: 'border border-[#e7d4c0]',
    roundness: 'rounded-2xl',
    fontClass: 'font-mono',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    socials: ['tiktok', 'youtube', 'instagram'],
  },
  // 11. Holly Clyde (Beauty & Lifestyle Creator)
  {
    id: 'holly-clyde',
    name: 'HOLLY CLYDE',
    categories: ['influencer-creator', 'fashion', 'social-media'],
    bio: 'Melbourne based beauty blogger',
    bgColor: '#1a1b35',
    bgImageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(26,27,53,0.65), rgba(21,24,48,0.85)), url("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#ffffff',
    btnBgColor: 'rgba(107, 49, 156, 0.35)',
    btnTextColor: '#ffffff',
    btnBorder: 'border border-purple-400/40',
    roundness: 'btn-glass',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150',
    socials: ['tiktok', 'instagram', 'youtube'],
  },
  // 12. Gabrielle Lacey (Influencer & Lifestyle)
  {
    id: 'gabrielle-lacey',
    name: 'Gabrielle Lacey',
    categories: ['influencer-creator', 'social-media', 'whatsapp'],
    bio: "Can't stop won't stop",
    bgColor: '#fce8ed',
    bgImageUrl: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(252,232,237,0.7), rgba(252,232,237,0.85)), url("https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#292524',
    btnBgColor: '#ffffff',
    btnTextColor: '#292524',
    btnBorder: 'shadow-sm border border-pink-100',
    roundness: 'rounded-full',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    socials: ['tiktok', 'whatsapp', 'spotify'],
  },
  // 13. Indi Montana (Health & Skincare)
  {
    id: 'indi-montana',
    name: 'Indi Montana',
    categories: ['health-fitness', 'influencer-creator'],
    bio: 'Skincare blogger. Owner of too many plants.',
    bgColor: '#bdccd0',
    bgImageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(189,204,208,0.65), rgba(189,204,208,0.85)), url("https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#1e293b',
    btnBgColor: '#dce6e8',
    btnTextColor: '#0f172a',
    btnBorder: '',
    roundness: 'rounded-xl',
    fontClass: 'font-serif',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=150',
    socials: ['tiktok', 'youtube', 'spotify'],
  },
  // 14. Kevin Sikandar (Marketing & Video Studio)
  {
    id: 'kevin-sikandar',
    name: 'Kevin Sikandar',
    categories: ['marketing', 'influencer-creator', 'telegram'],
    bio: 'Typography and Video Designer',
    bgColor: '#e7e5dc',
    bgImageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(231,229,220,0.75), rgba(231,229,220,0.9)), url("https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#000000',
    btnBgColor: '#ffffff',
    btnTextColor: '#000000',
    btnBorder: '',
    roundness: 'btn-brutal',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    socials: ['instagram', 'youtube', 'spotify'],
  },
  // 15. Natazia (Music & Vocalist)
  {
    id: 'natazia',
    name: 'Natazia',
    categories: ['music', 'influencer-creator'],
    bio: 'Indie pop and indoor plants',
    bgColor: '#e64a19',
    bgImageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(230,74,25,0.6), rgba(27,181,135,0.8)), url("https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#ffffff',
    btnBgColor: '#ffffff',
    btnTextColor: '#111827',
    btnBorder: '',
    roundness: 'rounded-xl',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    socials: ['tiktok', 'youtube', 'spotify'],
  },
  // 16. Hydra Juice (Health & Small Business)
  {
    id: 'hydra-juice',
    name: 'Hydra Juice',
    categories: ['health-fitness', 'small-business', 'whatsapp'],
    bio: 'Your daily dose of vitamin C',
    bgColor: '#5c634d',
    bgImageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(92,99,77,0.65), rgba(66,71,54,0.85)), url("https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#ffffff',
    btnBgColor: '#c3c7b5',
    btnTextColor: '#2d3025',
    btnBorder: '',
    roundness: 'rounded-full',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=150',
    socials: ['tiktok', 'youtube', 'instagram', 'website'],
    links: [
      { id: 1, title: 'Our drinks', url: 'https://hydrajuice.com/drinks', icon: 'store' },
      { id: 2, title: 'Find us', url: 'https://hydrajuice.com/stores', icon: 'website' },
      { id: 3, title: 'Wellbeings', url: 'https://hydrajuice.com/wellbeing', icon: 'instagram' },
      { id: 4, title: 'Our latest Podcast', url: 'https://spotify.com', icon: 'spotify' }
    ]
  },
  // 17. Katy Delma (Marketing & Travel)
  {
    id: 'katy-delma',
    name: 'Katy Delma',
    categories: ['marketing', 'influencer-creator', 'small-business'],
    bio: 'An innovative solar design practice that brings solar energy into daily life.',
    bgColor: '#000000',
    bgImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.45)), url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#ffffff',
    btnBgColor: '#ffffff',
    btnTextColor: '#111827',
    btnBorder: 'shadow-sm',
    roundness: 'rounded-full',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    socials: ['tiktok', 'youtube', 'instagram'],
    links: [
      { id: 1, title: 'Travel Blog', url: 'https://katydelma.com/blog', icon: 'website' },
      { id: 2, title: 'Travel Tips', url: 'https://katydelma.com/tips', icon: 'instagram' },
      { id: 3, title: 'Hiking Equipment', url: 'https://katydelma.com/hiking', icon: 'store' },
      { id: 4, title: 'Camera Equipment', url: 'https://katydelma.com/camera', icon: 'youtube' }
    ]
  },
  // 18. Matthew Hugh (Sports & Skate)
  {
    id: 'matthew-hugh',
    name: 'Matthew Hugh',
    categories: ['sports', 'influencer-creator'],
    bio: 'Aspiring skater with a taste for cooking.',
    bgColor: '#000000',
    bgImageUrl: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#ffffff',
    btnBgColor: '#e6ab85',
    btnTextColor: '#2b180d',
    btnBorder: '',
    roundness: 'btn-torn',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
    socials: ['tiktok', 'youtube', 'instagram'],
    links: [
      { id: 1, title: 'Youtube Channel', url: 'https://youtube.com', icon: 'youtube' },
      { id: 2, title: 'Tiktok Account', url: 'https://tiktok.com', icon: 'tiktok' },
      { id: 3, title: 'Instagram', url: 'https://instagram.com', icon: 'instagram' }
    ]
  },
  // 19. Dena Presley (Sports & Athletics)
  {
    id: 'dena-presley',
    name: 'Dena Presley',
    categories: ['health-fitness', 'sports'],
    bio: 'Long Distance Runner',
    bgColor: '#000000',
    bgImageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#ffffff',
    btnBgColor: '#ffffff',
    btnTextColor: '#0c3959',
    btnBorder: '',
    roundness: 'btn-wavy',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    socials: ['tiktok', 'youtube', 'instagram'],
    links: [
      { id: 1, title: 'Running Tracks', url: 'https://strava.com', icon: 'website' },
      { id: 2, title: 'Trail Routes', url: 'https://alltrails.com', icon: 'website' },
      { id: 3, title: 'Diet Routine', url: 'https://denapresley.com/diet', icon: 'store' }
    ]
  },
  // 20. Lowell Silvia (Sports & Action)
  {
    id: 'lowell-silvia',
    name: 'Lowell Silvia ✓',
    categories: ['influencer-creator', 'social-media', 'sports'],
    bio: 'Brand Ambassador for Helix, based in SoCal.',
    bgColor: '#000000',
    bgImageUrl: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.65)), url("https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#ffffff',
    btnBgColor: '#ffffff',
    btnTextColor: '#111111',
    btnBorder: '',
    roundness: 'rounded-xl',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    socials: ['tiktok', 'youtube', 'instagram'],
    links: [
      { id: 1, title: 'My favourite skate parks', url: 'https://skateparks.com', icon: 'website' },
      { id: 2, title: 'Book me', url: 'https://calendly.com', icon: 'email' },
      { id: 3, title: 'Affiliate Links', url: 'https://helix.com', icon: 'store' }
    ]
  },
  // 21. Bakte (Small Business & Bakery)
  {
    id: 'bakte',
    name: 'Bakte',
    categories: ['small-business', 'whatsapp'],
    bio: 'Plant-based bakery',
    bgColor: '#ffffff',
    bgImageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(255,255,255,0.45), rgba(255,255,255,0.7)), url("https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#111111',
    btnBgColor: 'rgba(255, 255, 255, 0.95)',
    btnTextColor: '#b91c1c',
    btnBorder: '',
    roundness: 'btn-wavy',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=150',
    socials: ['tiktok', 'youtube', 'instagram'],
    links: [
      { id: 1, title: 'Book our famous afternoon tea', url: 'https://bakte.com/tea', icon: 'store' },
      { id: 2, title: 'Menu', url: 'https://bakte.com/menu', icon: 'website' },
      { id: 3, title: 'Monthly special offers', url: 'https://bakte.com/offers', icon: 'instagram' },
      { id: 4, title: 'Gift cards', url: 'https://bakte.com/gifts', icon: 'store' },
      { id: 5, title: 'Contact us on WhatsApp', url: 'https://wa.me/55', icon: 'whatsapp' }
    ]
  },
  // 22. Arielle Emmanuelle (Fashion & Film Director Set)
  {
    id: 'arielle-emmanuelle',
    name: 'Arielle Emmanuelle',
    categories: ['fashion', 'marketing'],
    bio: 'Director with a passion for climate justice 🌿',
    bgColor: '#e4e3dc',
    bgImageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(228,227,220,0.65), rgba(228,227,220,0.85)), url("https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#1c241b',
    btnBgColor: '#ffffff',
    btnTextColor: '#1c241b',
    btnBorder: '',
    roundness: 'btn-torn',
    fontClass: 'font-serif',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    socials: ['tiktok', 'youtube', 'instagram'],
    links: [
      { id: 1, title: 'Portfolio Work', url: 'https://arielle.com/work', icon: 'website' },
      { id: 2, title: 'Souvenir Collective', url: 'https://souvenir.com', icon: 'store' },
      { id: 3, title: 'Inspiration Board', url: 'https://pinterest.com', icon: 'instagram' },
      { id: 4, title: 'Collaborate together', url: 'https://arielle.com/contact', icon: 'email' }
    ]
  },
  // 23. Marjan van Aubel (Small Business & Solar Design)
  {
    id: 'marjan-van-aubel',
    name: 'Marjan van Aubel',
    categories: ['small-business', 'marketing'],
    bio: 'An innovative solar design practice that brings solar energy into daily life.',
    bgColor: '#000000',
    bgImageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.45)), url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#ffffff',
    btnBgColor: '#ffffff',
    btnTextColor: '#111827',
    btnBorder: '',
    roundness: 'rounded-full',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150',
    socials: ['tiktok', 'youtube', 'instagram'],
    links: [
      { id: 1, title: 'My Store', url: 'https://marjan.com/store', icon: 'store' },
      { id: 2, title: 'Contact Me', url: 'https://marjan.com/contact', icon: 'email' },
      { id: 3, title: 'WhatsApp Direct', url: 'https://wa.me/55', icon: 'whatsapp' }
    ]
  },
  // 24. Leroy Cohen (Sports & Surfing)
  {
    id: 'leroy-cohen',
    name: 'Leroy Cohen',
    categories: ['sports', 'health-fitness', 'influencer-creator'],
    bio: '🏄‍♂️ Bali based surfer 🏄‍♂️',
    bgColor: '#000000',
    bgImageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#ffffff',
    btnBgColor: '#ffffff',
    btnTextColor: '#0a3547',
    btnBorder: '',
    roundness: 'rounded-full',
    fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    socials: ['tiktok', 'youtube', 'instagram'],
    links: [
      { id: 1, title: 'Surf School hours', url: 'https://leroy.com/hours', icon: 'website' },
      { id: 2, title: 'Lesson types', url: 'https://leroy.com/lessons', icon: 'youtube' },
      { id: 3, title: 'Beginner course', url: 'https://leroy.com/beginner', icon: 'store' },
      { id: 4, title: 'Book via WhatsApp', url: 'https://wa.me/55', icon: 'whatsapp' }
    ]
  },
]

const filteredThemes = computed(() => {
  if (activeCategory.value === 'all') return themes
  return themes.filter((t) => t.categories.includes(activeCategory.value))
})

const getCategoryCount = (catId: string) => {
  if (catId === 'all') return themes.length
  return themes.filter((t) => t.categories.includes(catId)).length
}

// State for customizer
const activeThemeId = ref('monica-vera')
const customBgColor = ref('#4b3e34')
const customBgImage = ref('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800')
const customBgStyle = ref('background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.55)), url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;')
const customTextColor = ref('#ffffff')
const customBtnBgColor = ref('#6b5d52')
const customBtnTextColor = ref('#ffffff')
const customBtnBorder = ref('')
const customRoundness = ref('rounded-full')
const customFontClass = ref('font-serif')
const customUsername = ref('monica.vera')
const customBio = ref('Daily Rituals')
const customAvatar = ref('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150')
const selectedSocials = ref<string[]>(['tiktok', 'youtube', 'instagram'])

// Dynamic updater for background style
const updateBgStyle = () => {
  if (customBgImage.value.trim()) {
    customBgStyle.value = `background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.55)), url("${customBgImage.value.trim()}"); background-size: cover; background-position: center;`
  } else {
    customBgStyle.value = `background-color: ${customBgColor.value};`
  }
}

const setPresetBgImage = (url: string) => {
  customBgImage.value = url
  updateBgStyle()
}

// Active customized links list with default official brand icons
const links = ref<LinkItem[]>([
  { id: 1, title: 'YouTube Channel', url: 'https://youtube.com', icon: 'youtube' },
  { id: 2, title: 'TikTok Daily Vlog', url: 'https://tiktok.com', icon: 'tiktok' },
  { id: 3, title: 'Spotify Podcast', url: 'https://spotify.com', icon: 'spotify' },
  { id: 4, title: 'Work Inquiries', url: 'https://monica.com', icon: 'email' },
])

// Input models for platforms quick-add
const platforms = [
  { id: 'instagram', name: 'Instagram', color: 'bg-[#E1306C]/10 hover:bg-[#E1306C]/20 border-[#E1306C]/20 text-[#E1306C]', icon: 'instagram' },
  { id: 'whatsapp', name: 'WhatsApp', color: 'bg-[#25D366]/10 hover:bg-[#25D366]/20 border-[#25D366]/20 text-[#25D366]', icon: 'whatsapp' },
  { id: 'tiktok', name: 'TikTok', color: 'bg-black/5 hover:bg-black/10 border-black/10 text-black', icon: 'tiktok' },
  { id: 'youtube', name: 'YouTube', color: 'bg-[#FF0000]/10 hover:bg-[#FF0000]/20 border-[#FF0000]/20 text-[#FF0000]', icon: 'youtube' },
  { id: 'website', name: 'Website', color: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 text-blue-600', icon: 'website' },
  { id: 'spotify', name: 'Spotify', color: 'bg-[#1DB954]/10 hover:bg-[#1DB954]/20 border-[#1DB954]/20 text-[#1DB954]', icon: 'spotify' },
]

const showAddPlatformId = ref<string | null>(null)
const platformInputUrl = ref('')
const platformInputTitle = ref('')

const openAddPlatform = (platId: string) => {
  showAddPlatformId.value = platId
  const plat = platforms.find((p) => p.id === platId)
  platformInputTitle.value = plat ? `Visite meu ${plat.name}` : 'Acesse o link'
  platformInputUrl.value = platId === 'whatsapp' ? 'https://wa.me/55' : 'https://'
}

const addPlatformLink = () => {
  if (platformInputTitle.value && platformInputUrl.value) {
    const plat = platforms.find((p) => p.id === showAddPlatformId.value)
    links.value.push({
      id: Date.now(),
      title: platformInputTitle.value,
      url: platformInputUrl.value,
      icon: plat ? plat.icon : undefined,
    })

    // Auto-select social icon if applicable
    if (showAddPlatformId.value && !selectedSocials.value.includes(showAddPlatformId.value)) {
      selectedSocials.value.push(showAddPlatformId.value)
    }

    showAddPlatformId.value = null
    platformInputUrl.value = ''
    platformInputTitle.value = ''
  }
}

// Add/remove custom links with icon selection
const newLinkIcon = ref('')
const newLinkTitle = ref('')
const newLinkUrl = ref('')

const addCustomLink = () => {
  if (newLinkTitle.value && newLinkUrl.value) {
    links.value.push({
      id: Date.now(),
      title: newLinkTitle.value,
      url: newLinkUrl.value,
      icon: newLinkIcon.value || undefined,
    })
    newLinkTitle.value = ''
    newLinkUrl.value = ''
    newLinkIcon.value = ''
  }
}

const removeLink = (id: number) => {
  links.value = links.value.filter((l) => l.id !== id)
}

const isThemePro = (theme: Theme) => {
  return theme.id !== 'monica-vera'
}

// Select preset theme
const applyTheme = (theme: Theme) => {
  activeThemeId.value = theme.id
  customBgColor.value = theme.bgColor
  customBgImage.value = theme.bgImageUrl || ''
  customBgStyle.value = theme.bgStyle
  customTextColor.value = theme.textColor
  customBtnBgColor.value = theme.btnBgColor
  customBtnTextColor.value = theme.btnTextColor
  customBtnBorder.value = theme.btnBorder
  customRoundness.value = theme.roundness
  customFontClass.value = theme.fontClass
  customUsername.value = theme.name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '')
  customBio.value = theme.bio
  customAvatar.value = theme.avatarUrl
  selectedSocials.value = [...theme.socials]

  if (theme.links && theme.links.length > 0) {
    links.value = theme.links.map((l) => ({ ...l }))
  } else {
    links.value = [
      { id: 1, title: 'YouTube Channel', url: 'https://youtube.com', icon: 'youtube' },
      { id: 2, title: 'TikTok Daily Vlog', url: 'https://tiktok.com', icon: 'tiktok' },
      { id: 3, title: 'Spotify Podcast', url: 'https://spotify.com', icon: 'spotify' },
      { id: 4, title: 'Work Inquiries', url: 'https://monica.com', icon: 'email' },
    ]
  }
}
</script>

<template>
  <div class="bg-[#FCFCFC] min-h-screen pt-24 lg:pt-28 pb-12 px-4 lg:px-8">
    <div class="max-w-7xl mx-auto">
      
      <!-- Back to Portfolio -->
      <NuxtLink to="/#portfolio" class="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-heading text-label-md mb-8 transition-colors">
        <span class="material-symbols-outlined text-[20px] font-bold">arrow_back</span>
        Voltar para a Página Inicial
      </NuxtLink>

      <!-- Section Title (Step 1 Theme Selection) -->
      <div class="text-center mb-8">
        <h1 class="font-heading text-[32px] md:text-[40px] font-extrabold text-[#111111] mb-3">
          Selecione um tema
        </h1>
        <p class="text-[#666666] font-body text-base max-w-2xl mx-auto mb-6">
          Escolha o estilo que combina com você — crie sua conta e personalize sua página pública com links ilimitados.
        </p>

        <!-- SaaS CTA Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-4">
          <NuxtLink to="/register" class="px-8 py-3.5 rounded-full font-heading font-extrabold text-sm text-white bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-105 transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px]">rocket_launch</span>
            Criar Meu Link-in-Bio
          </NuxtLink>

          <NuxtLink to="/login" class="px-7 py-3.5 rounded-full font-heading font-bold text-sm bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 shadow-sm transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px]">login</span>
            Já sou Cliente (Fazer Login)
          </NuxtLink>
        </div>
      </div>

      <!-- Categories Filter Tabs Bar -->
      <div class="flex items-center justify-center gap-2 flex-wrap mb-10">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          :class="[
            'px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2',
            activeCategory === cat.id
              ? 'bg-secondary text-white shadow-md scale-105'
              : 'bg-white text-[#555555] border border-[#EEEEEE] hover:border-secondary/40 hover:text-secondary'
          ]"
        >
          <span>{{ cat.name }}</span>
          <span 
            :class="[
              'px-2 py-0.5 rounded-full text-[10px] font-extrabold',
              activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-[#F0F0F0] text-[#777777]'
            ]"
          >
            {{ getCategoryCount(cat.id) }}
          </span>
        </button>
      </div>

      <!-- Theme Carousel Grid (Mini phone style cards) -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-16">
        <div 
          v-for="theme in filteredThemes" 
          :key="theme.id"
          @click="applyTheme(theme)"
          :class="[
            'cursor-pointer relative rounded-[32px] p-2 border-2 transition-all duration-300 overflow-hidden bg-white shadow-sm flex flex-col items-center group',
            activeThemeId === theme.id 
              ? 'border-secondary shadow-md scale-[1.02]' 
              : 'border-[#EEEEEE] hover:border-secondary/40 hover:scale-[1.01]'
          ]"
        >
          <!-- Active check badge -->
          <div v-if="activeThemeId === theme.id" class="absolute top-4 right-4 bg-secondary text-white w-6 h-6 rounded-full flex items-center justify-center z-20 shadow-sm">
            <span class="material-symbols-outlined text-sm font-bold">check</span>
          </div>

          <!-- PRO Badge -->
          <div v-if="isThemePro(theme)" class="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md z-20 flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">lock</span>
            PRO
          </div>

          <!-- Mini phone mockup container -->
          <div 
            class="w-full h-[280px] rounded-[24px] overflow-hidden pt-7 px-4 flex flex-col items-center relative"
            :style="theme.bgStyle"
          >
            <!-- Background pattern for lowell maxwell inside card preview -->
            <div v-if="theme.id === 'lowell-maxwell'" class="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none opacity-40 z-0"></div>

            <!-- Avatar -->
            <div class="w-12 h-12 rounded-full overflow-hidden border border-black/10 mb-2 relative z-10 shrink-0 shadow-sm">
              <img :src="theme.avatarUrl" :alt="theme.name" class="w-full h-full object-cover">
            </div>

            <!-- Title & Bio -->
            <h3 class="text-xs font-bold text-center truncate w-full mb-0.5 relative z-10" :style="{ color: theme.textColor }">
              {{ theme.name }}
            </h3>
            <p class="text-[9px] opacity-75 text-center truncate w-full mb-3 relative z-10" :style="{ color: theme.textColor }">
              {{ theme.bio }}
            </p>

            <!-- Mini links items preview with vector official brand logos -->
            <div class="space-y-1.5 w-full relative z-10">
              <div 
                v-for="(lk, idx) in (theme.links ? theme.links.slice(0, 3) : [{ title: 'Link 1' }, { title: 'Link 2' }, { title: 'Link 3' }])" 
                :key="idx"
                class="w-full h-6 flex items-center justify-center gap-1.5 text-[8px] font-bold border truncate px-2"
                :class="[theme.roundness, theme.btnBorder]"
                :style="{ backgroundColor: theme.btnBgColor, color: theme.btnTextColor }"
              >
                <div v-if="lk.icon && brandIcons[lk.icon]" class="w-2.5 h-2.5 shrink-0 flex items-center justify-center" v-html="brandIcons[lk.icon]"></div>
                <span class="truncate">{{ lk.title }}</span>
              </div>
            </div>
          </div>
          
          <div class="py-3 text-center w-full px-2">
            <span class="font-heading text-xs font-bold text-[#111111] group-hover:text-secondary transition-colors block truncate">
              {{ theme.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Step 2: Platform Selection -->
      <div class="bg-white rounded-3xl p-8 border border-[#EEEEEE] shadow-sm mb-16 max-w-4xl mx-auto">
        <div class="text-center mb-8">
          <h2 class="font-heading text-2xl font-extrabold text-[#111111] mb-2">
            Em quais plataformas você está?
          </h2>
          <p class="text-[#666666] font-body text-sm">
            Escolha até cinco para começar. Você pode mudar a qualquer momento.
          </p>
        </div>

        <!-- Platforms Grid with Official Vector Logos -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <button 
            v-for="plat in platforms"
            :key="plat.id"
            @click="openAddPlatform(plat.id)"
            :class="[
              'p-4 rounded-2xl border flex flex-col items-center justify-center gap-2.5 transition-all duration-300 h-28',
              showAddPlatformId === plat.id 
                ? 'border-secondary ring-2 ring-secondary/20 shadow-sm' 
                : 'border-[#EEEEEE] bg-white hover:shadow-sm hover:border-[#DDDDDD]'
            ]"
          >
            <!-- Circular Icon Wrap -->
            <div :class="['w-12 h-12 rounded-full flex items-center justify-center p-2.5', plat.color]">
              <div v-if="brandIcons[plat.icon]" class="w-6 h-6" v-html="brandIcons[plat.icon]"></div>
            </div>
            <span class="font-heading text-xs font-semibold text-[#111111]">{{ plat.name }}</span>
          </button>
        </div>

        <!-- Add Platform Inline Dialog -->
        <div v-if="showAddPlatformId" class="mt-8 p-5 bg-[#FAFAFA] rounded-2xl border border-[#EEEEEE] space-y-4 animate-fadeIn">
          <div class="flex items-center justify-between">
            <h3 class="font-heading text-sm font-bold text-[#111111] flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">add_circle</span>
              Configurar link do {{ platforms.find(p => p.id === showAddPlatformId)?.name }}
            </h3>
            <button @click="showAddPlatformId = null" class="text-xs text-[#999999] hover:underline">Fechar</button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div class="sm:col-span-4">
              <label class="block text-xs font-semibold text-[#111111] mb-1">Título do botão</label>
              <input 
                v-model="platformInputTitle"
                type="text" 
                class="w-full px-3 py-2 text-xs border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-secondary bg-white"
              >
            </div>
            <div class="sm:col-span-6">
              <label class="block text-xs font-semibold text-[#111111] mb-1">URL / Link completo</label>
              <input 
                v-model="platformInputUrl"
                type="text" 
                class="w-full px-3 py-2 text-xs border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-secondary bg-white font-mono"
              >
            </div>
            <div class="sm:col-span-2">
              <button 
                @click="addPlatformLink"
                class="w-full py-2 bg-secondary text-white font-heading text-xs font-bold rounded-xl hover:bg-secondary/90 transition-colors h-[34px]"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Playground Customizer -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Column: Customizer Controls (7 cols) -->
        <div class="lg:col-span-7 bg-white p-8 rounded-3xl border border-[#EEEEEE] shadow-sm space-y-8">
          <div>
            <h2 class="font-heading text-xl font-extrabold text-[#111111] mb-1 flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">tune</span>
              Personalize sua identidade
            </h2>
            <p class="text-xs text-[#666666]">
              Ajuste as cores, textos, imagens de fundo e perfil, fontes e formatos de botão do seu espaço virtual.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Info & Media inputs -->
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">Username</label>
                <div class="relative">
                  <span class="absolute left-3 top-2.5 text-[#999999] text-xs font-bold">@</span>
                  <input
                    v-model="customUsername"
                    type="text"
                    class="w-full pl-7 pr-3 py-2.5 text-sm border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-secondary font-medium"
                  >
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">Biografia</label>
                <textarea
                  v-model="customBio"
                  rows="3"
                  class="w-full px-3 py-2.5 text-sm border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-secondary resize-none leading-relaxed font-medium"
                ></textarea>
              </div>

              <div>
                <label class="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">URL da Foto de Perfil</label>
                <input
                  v-model="customAvatar"
                  type="text"
                  class="w-full px-3 py-2.5 text-xs border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-secondary font-mono"
                  placeholder="https://..."
                >
              </div>

              <!-- Background Image Input & Categorized Professional Presets -->
              <div>
                <label class="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">URL da Imagem de Fundo</label>
                <input
                  v-model="customBgImage"
                  @input="updateBgStyle"
                  type="text"
                  class="w-full px-3 py-2.5 text-xs border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-secondary font-mono mb-2"
                  placeholder="https://... (ou selecione uma área abaixo)"
                >
                
                <!-- Filter Tabs for Background Presets -->
                <div class="flex items-center justify-between mb-2">
                  <span class="text-[11px] text-[#111111] font-bold">Fotos de Fundo por Área:</span>
                  <div class="flex gap-1">
                    <button 
                      v-for="bgCat in [
                        { id: 'all', label: 'Todas' },
                        { id: 'pro', label: 'Profissões' },
                        { id: 'creators', label: 'Criadores' },
                        { id: 'lifestyle', label: 'Lifestyle' }
                      ]"
                      :key="bgCat.id"
                      @click="activeBgGroup = bgCat.id"
                      :class="[
                        'px-2 py-0.5 text-[9px] rounded-md font-bold transition-all',
                        activeBgGroup === bgCat.id ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      ]"
                    >
                      {{ bgCat.label }}
                    </button>
                  </div>
                </div>

                <!-- Presets Grid Wrap -->
                <div class="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 border border-[#EEEEEE] rounded-xl bg-[#FAFAFA]">
                  <button
                    v-for="bg in filteredPresetBackgrounds"
                    :key="bg.name"
                    @click="setPresetBgImage(bg.url)"
                    :class="[
                      'px-2.5 py-1 text-[10px] rounded-lg border transition-all flex items-center gap-1 font-medium',
                      customBgImage === bg.url
                        ? 'border-secondary bg-secondary text-white font-bold shadow-sm'
                        : 'border-[#EEEEEE] bg-white text-[#444] hover:border-secondary/40 hover:text-secondary'
                    ]"
                  >
                    <span>{{ bg.name }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Stylings inputs -->
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">Formato & Estilo do Botão</label>
                <div class="grid grid-cols-3 gap-2">
                  <button 
                    @click="customRoundness = 'rounded-none'"
                    :class="['py-2 px-2 text-[11px] border rounded-xl transition-all flex items-center justify-center gap-1', customRoundness === 'rounded-none' ? 'border-secondary bg-secondary/5 font-bold text-secondary' : 'border-[#EEEEEE] text-[#555]']"
                  >
                    Quadrado
                  </button>
                  <button 
                    @click="customRoundness = 'rounded-md'"
                    :class="['py-2 px-2 text-[11px] border rounded-xl transition-all flex items-center justify-center gap-1', customRoundness === 'rounded-md' ? 'border-secondary bg-secondary/5 font-bold text-secondary' : 'border-[#EEEEEE] text-[#555]']"
                  >
                    Suave
                  </button>
                  <button 
                    @click="customRoundness = 'rounded-xl'"
                    :class="['py-2 px-2 text-[11px] border rounded-xl transition-all flex items-center justify-center gap-1', customRoundness === 'rounded-xl' ? 'border-secondary bg-secondary/5 font-bold text-secondary' : 'border-[#EEEEEE] text-[#555]']"
                  >
                    Arredondado
                  </button>
                  <button 
                    @click="customRoundness = 'rounded-full'"
                    :class="['py-2 px-2 text-[11px] border rounded-xl transition-all flex items-center justify-center gap-1', customRoundness === 'rounded-full' ? 'border-secondary bg-secondary/5 font-bold text-secondary' : 'border-[#EEEEEE] text-[#555]']"
                  >
                    Pílula
                  </button>
                  <button 
                    @click="customRoundness = 'btn-wavy'"
                    :class="['py-2 px-2 text-[11px] border rounded-xl transition-all flex items-center justify-center gap-1', customRoundness === 'btn-wavy' ? 'border-secondary bg-secondary/5 font-bold text-secondary' : 'border-[#EEEEEE] text-[#555]']"
                    title="Borda ondulada (Estilo Dena Presley / Bakte)"
                  >
                    🌊 Ondulado
                  </button>
                  <button 
                    @click="customRoundness = 'btn-torn'"
                    :class="['py-2 px-2 text-[11px] border rounded-xl transition-all flex items-center justify-center gap-1', customRoundness === 'btn-torn' ? 'border-secondary bg-secondary/5 font-bold text-secondary' : 'border-[#EEEEEE] text-[#555]']"
                    title="Efeito papel rasgado (Estilo Arielle / Matthew)"
                  >
                    📄 Rasgado
                  </button>
                  <button 
                    @click="customRoundness = 'btn-brutal'"
                    :class="['py-2 px-2 text-[11px] border rounded-xl transition-all flex items-center justify-center gap-1', customRoundness === 'btn-brutal' ? 'border-secondary bg-secondary/5 font-bold text-secondary' : 'border-[#EEEEEE] text-[#555]']"
                    title="Neo-brutalismo com sombra offset (Estilo Kevin Sikandar)"
                  >
                    🔳 Brutalista
                  </button>
                  <button 
                    @click="customRoundness = 'btn-glass'"
                    :class="['py-2 px-2 text-[11px] border rounded-xl transition-all flex items-center justify-center gap-1', customRoundness === 'btn-glass' ? 'border-secondary bg-secondary/5 font-bold text-secondary' : 'border-[#EEEEEE] text-[#555]']"
                    title="Efeito vidro fosco translúcido (Estilo Holly Clyde)"
                  >
                    ✨ Vidro
                  </button>
                  <button 
                    @click="customRoundness = 'btn-outline'"
                    :class="['py-2 px-2 text-[11px] border rounded-xl transition-all flex items-center justify-center gap-1', customRoundness === 'btn-outline' ? 'border-secondary bg-secondary/5 font-bold text-secondary' : 'border-[#EEEEEE] text-[#555]']"
                    title="Apenas contorno neon (Estilo Vaporwave Grid)"
                  >
                    🔲 Contorno
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">Estilo da Fonte</label>
                <div class="grid grid-cols-2 gap-2">
                  <button 
                    @click="customFontClass = 'font-sans'"
                    :class="['py-2 px-3 text-xs border rounded-xl transition-all font-sans', customFontClass === 'font-sans' ? 'border-secondary bg-secondary/5 font-bold' : 'border-[#EEEEEE]']"
                  >
                    Inter (Sans)
                  </button>
                  <button 
                    @click="customFontClass = 'font-serif'"
                    :class="['py-2 px-3 text-xs border rounded-xl transition-all font-serif', customFontClass === 'font-serif' ? 'border-secondary bg-secondary/5 font-bold' : 'border-[#EEEEEE]']"
                  >
                    Georgia (Serif)
                  </button>
                </div>
              </div>

              <!-- Live Color Palette Picker -->
              <div class="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label class="block text-[10px] font-bold text-[#111111] uppercase tracking-wider mb-1">Cor do Fundo</label>
                  <div class="flex items-center gap-2">
                    <input type="color" v-model="customBgColor" @input="updateBgStyle" class="w-8 h-8 rounded-lg border border-black/10 cursor-pointer">
                    <span class="text-xs font-mono uppercase">{{ customBgColor }}</span>
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-[#111111] uppercase tracking-wider mb-1">Cor do Texto</label>
                  <div class="flex items-center gap-2">
                    <input type="color" v-model="customTextColor" class="w-8 h-8 rounded-lg border border-black/10 cursor-pointer">
                    <span class="text-xs font-mono uppercase">{{ customTextColor }}</span>
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-[#111111] uppercase tracking-wider mb-1">Cor do Botão</label>
                  <div class="flex items-center gap-2">
                    <input type="color" v-model="customBtnBgColor" class="w-8 h-8 rounded-lg border border-black/10 cursor-pointer">
                    <span class="text-xs font-mono uppercase">{{ customBtnBgColor }}</span>
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-[#111111] uppercase tracking-wider mb-1">Texto do Botão</label>
                  <div class="flex items-center gap-2">
                    <input type="color" v-model="customBtnTextColor" class="w-8 h-8 rounded-lg border border-black/10 cursor-pointer">
                    <span class="text-xs font-mono uppercase">{{ customBtnTextColor }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Links Editor -->
          <div class="border-t border-[#EEEEEE] pt-8">
            <h3 class="font-heading text-lg font-bold text-[#111111] mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">link</span>
              Links Personalizados
            </h3>
            
            <!-- List of links with vector brand icons -->
            <div class="space-y-3.5 mb-6">
              <div 
                v-for="link in links" 
                :key="link.id"
                class="flex items-center justify-between p-3.5 bg-[#FAFAFA] rounded-2xl border border-[#EEEEEE]"
              >
                <div class="flex items-center gap-3 min-w-0 flex-1 pr-3">
                  <div v-if="link.icon && brandIcons[link.icon]" class="w-8 h-8 rounded-xl bg-secondary/10 text-secondary p-2 flex items-center justify-center shrink-0">
                    <div class="w-4 h-4" v-html="brandIcons[link.icon]"></div>
                  </div>
                  <div v-else class="w-8 h-8 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-[18px]">link</span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-semibold text-[#111111] truncate">{{ link.title }}</p>
                    <p class="text-xs text-[#888888] truncate font-mono">{{ link.url }}</p>
                  </div>
                </div>
                <button 
                  @click="removeLink(link.id)" 
                  class="text-error hover:bg-error-container/20 p-2 rounded-full transition-colors flex items-center justify-center shrink-0"
                >
                  <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>

            <!-- Form to add customized link with official platform vector icons -->
            <div class="space-y-4 bg-[#FAFAFA] p-4 rounded-2xl border border-[#EEEEEE]">
              <div>
                <label class="block text-xs font-semibold text-[#111111] mb-1.5">Ícone Oficial da Plataforma</label>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="pIcon in topPlatformsIcons"
                    :key="pIcon.id"
                    @click="newLinkIcon = pIcon.icon"
                    :class="[
                      'px-2.5 py-1.5 text-[11px] rounded-xl border transition-all flex items-center gap-1.5 font-medium',
                      newLinkIcon === pIcon.icon
                        ? 'border-secondary bg-secondary text-white font-bold shadow-sm'
                        : 'border-[#EEEEEE] bg-white text-[#444] hover:border-secondary/40 hover:text-secondary'
                    ]"
                  >
                    <div v-if="pIcon.icon && brandIcons[pIcon.icon]" class="w-3.5 h-3.5 shrink-0" v-html="brandIcons[pIcon.icon]"></div>
                    <span>{{ pIcon.name }}</span>
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div class="sm:col-span-5">
                  <label class="block text-xs font-semibold text-[#111111] mb-1">Título do botão</label>
                  <input
                    v-model="newLinkTitle"
                    type="text"
                    class="w-full px-3 py-2 text-xs border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-secondary bg-white"
                    placeholder="Ex: Entre em contato no WhatsApp"
                  >
                </div>
                <div class="sm:col-span-5">
                  <label class="block text-xs font-semibold text-[#111111] mb-1">URL de destino</label>
                  <input
                    v-model="newLinkUrl"
                    type="text"
                    class="w-full px-3 py-2 text-xs border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-secondary bg-white font-mono"
                    placeholder="https://"
                  >
                </div>
                <div class="sm:col-span-2">
                  <button
                    @click="addCustomLink"
                    class="w-full py-2 bg-secondary text-white font-heading text-xs font-bold rounded-xl hover:bg-secondary/90 transition-colors h-[34px]"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Interactive Phone Preview (5 cols) -->
        <div class="lg:col-span-5 lg:sticky lg:top-8 flex justify-center">
          
          <div class="relative w-[340px] h-[680px] bg-slate-950 rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] p-[12px] border-4 border-slate-800">
            <!-- Speaker & Camera wrap -->
            <div class="absolute top-[22px] left-1/2 -translate-x-1/2 w-32 h-[20px] bg-slate-900 rounded-full flex items-center justify-center gap-2 z-30">
              <span class="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
              <span class="w-12 h-1 bg-slate-950 rounded-full"></span>
            </div>

            <!-- Phone Screen -->
            <div 
              class="w-full h-full rounded-[38px] overflow-y-auto overflow-x-hidden pt-14 pb-8 px-5 relative transition-all duration-500 hide-scrollbar"
              :style="customBgStyle"
            >
              <!-- Background patterns or overrides -->
              <div v-if="activeThemeId === 'lowell-maxwell'" class="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-40 z-0"></div>
              
              <div class="relative z-10 flex flex-col items-center h-full">
                <!-- Avatar -->
                <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-black/10 shadow-sm bg-slate-200 mb-4 flex items-center justify-center shrink-0">
                  <img 
                    :src="customAvatar" 
                    alt="Avatar" 
                    class="w-full h-full object-cover"
                  >
                </div>

                <!-- Username & Bio -->
                <div class="space-y-1.5 text-center mb-6">
                  <h3 
                    class="text-lg font-bold transition-all duration-300"
                    :class="customFontClass"
                    :style="{ color: customTextColor }"
                  >
                    @{{ customUsername }}
                  </h3>
                  <p 
                    class="text-xs leading-relaxed max-w-[240px] mx-auto opacity-85 transition-all duration-300 font-medium"
                    :class="customFontClass"
                    :style="{ color: customTextColor }"
                  >
                    {{ customBio }}
                  </p>
                </div>

                <!-- Interactive Official Social Brand Icons Bar -->
                <div class="flex gap-4 justify-center mb-6 opacity-90" :style="{ color: customTextColor }">
                  <div v-if="selectedSocials.includes('instagram')" class="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" v-html="brandIcons.instagram" title="Instagram"></div>
                  <div v-if="selectedSocials.includes('whatsapp')" class="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" v-html="brandIcons.whatsapp" title="WhatsApp"></div>
                  <div v-if="selectedSocials.includes('tiktok')" class="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" v-html="brandIcons.tiktok" title="TikTok"></div>
                  <div v-if="selectedSocials.includes('youtube')" class="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" v-html="brandIcons.youtube" title="YouTube"></div>
                  <div v-if="selectedSocials.includes('spotify')" class="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" v-html="brandIcons.spotify" title="Spotify"></div>
                  <div v-if="selectedSocials.includes('x')" class="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" v-html="brandIcons.x" title="X / Twitter"></div>
                </div>

                <!-- Links Buttons with vector official brand logos -->
                <div class="space-y-3.5 w-full">
                  <a
                    v-for="link in links"
                    :key="link.id"
                    :href="link.url"
                    target="_blank"
                    :class="[
                      'w-full py-3 px-4 text-center font-bold text-xs md:text-sm flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.02] shadow-sm',
                      customRoundness,
                      customBtnBorder,
                      customFontClass
                    ]"
                    :style="{ 
                      backgroundColor: customBtnBgColor, 
                      color: customBtnTextColor,
                    }"
                  >
                    <div v-if="link.icon && brandIcons[link.icon]" class="w-4 h-4 shrink-0 flex items-center justify-center" v-html="brandIcons[link.icon]"></div>
                    <span v-else-if="link.icon" class="material-symbols-outlined text-[16px] shrink-0">{{ link.icon }}</span>
                    <span>{{ link.title }}</span>
                  </a>
                </div>

                <!-- Branding Footer -->
                <div class="mt-auto pt-10 text-center">
                  <a 
                    href="#" 
                    class="inline-flex items-center gap-1 text-[10px] font-bold opacity-40 hover:opacity-75 transition-opacity"
                    :class="customFontClass"
                    :style="{ color: customTextColor }"
                  >
                    <span class="material-symbols-outlined text-[12px] font-bold">eco</span>
                    Powered by LinkChameleon
                  </a>
                </div>
              </div>
            </div>
            
            <!-- Home Indicator -->
            <div class="absolute bottom-[20px] left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-800 rounded-full z-20"></div>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

/* Authentic Button Styles from Screenshots */
.btn-wavy {
  clip-path: polygon(
    0% 12%, 5% 0%, 10% 12%, 15% 0%, 20% 12%, 25% 0%, 30% 12%, 35% 0%, 40% 12%, 45% 0%, 50% 12%, 55% 0%, 60% 12%, 65% 0%, 70% 12%, 75% 0%, 80% 12%, 85% 0%, 90% 12%, 95% 0%, 100% 12%,
    100% 88%, 95% 100%, 90% 88%, 85% 100%, 80% 88%, 75% 100%, 70% 88%, 65% 100%, 60% 88%, 55% 100%, 50% 88%, 45% 100%, 40% 88%, 35% 100%, 30% 88%, 25% 100%, 20% 88%, 15% 100%, 10% 88%, 5% 100%, 0% 88%
  );
  border: none !important;
}

.btn-torn {
  clip-path: polygon(
    0% 4px, 4% 0px, 9% 5px, 14% 1px, 20% 6px, 27% 2px, 34% 6px, 40% 1px, 48% 6px, 55% 2px, 62% 6px, 69% 1px, 76% 6px, 83% 2px, 90% 5px, 95% 1px, 100% 4px,
    100% calc(100% - 4px), 96% 100%, 91% calc(100% - 5px), 84% calc(100% - 1px), 77% calc(100% - 6px), 71% calc(100% - 2px), 63% calc(100% - 6px), 56% calc(100% - 1px), 49% calc(100% - 6px), 42% calc(100% - 2px), 35% calc(100% - 6px), 28% calc(100% - 1px), 21% calc(100% - 6px), 14% calc(100% - 2px), 7% calc(100% - 6px), 0% calc(100% - 3px)
  );
  border: none !important;
}

.btn-brutal {
  border: 2px solid #000000 !important;
  box-shadow: 4px 4px 0px 0px #000000 !important;
  border-radius: 9999px;
}

.btn-glass {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.btn-outline {
  background-color: transparent !important;
  border: 2px solid currentColor !important;
  border-radius: 12px;
}
</style>
