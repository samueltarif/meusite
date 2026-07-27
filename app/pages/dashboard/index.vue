<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { supabase } from '~/composables/useSupabase'
import { brandIcons } from '~/utils/brandIcons'

useSeoMeta({
  title: 'Painel do Cliente | Avyro Link-in-Bio SaaS',
  description: 'Gerencie seus links, personalize seu tema e acompanhe métricas de cliques.',
})

export interface LinkItem {
  id: any
  title: string
  url: string
  icon?: string
  clicks_count?: number
  position?: number
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

// ─── Preset Themes (Same 24 Themes from /link-in-bio) ───
const themes: Theme[] = [
  {
    id: 'monica-vera', name: 'Monica Vera', categories: ['fashion', 'influencer-creator'], bio: 'Daily Rituals',
    bgColor: '#4b3e34', bgImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.55)), url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#ffffff', btnBgColor: '#6b5d52', btnTextColor: '#ffffff', btnBorder: '', roundness: 'rounded-full', fontClass: 'font-serif',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', socials: ['tiktok', 'youtube', 'instagram'],
    links: [{ id: 1, title: 'YouTube Channel', url: '#', icon: 'youtube' }, { id: 2, title: 'TikTok Vlog', url: '#', icon: 'tiktok' }, { id: 3, title: 'Spotify Podcast', url: '#', icon: 'spotify' }],
  },
  {
    id: 'lexie-candis', name: 'Lexie Candis', categories: ['fashion', 'influencer-creator'], bio: 'Pastel artist from Melbourne',
    bgColor: '#8b5cf6', bgImageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(139,92,246,0.5), rgba(109,40,217,0.75)), url("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#ffffff', btnBgColor: '#ede9fe', btnTextColor: '#6d28d9', btnBorder: '', roundness: 'rounded-full', fontClass: 'font-serif',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', socials: ['tiktok', 'youtube', 'spotify'],
    links: [{ id: 1, title: 'My Art Store', url: '#', icon: 'store' }, { id: 2, title: 'YouTube', url: '#', icon: 'youtube' }, { id: 3, title: 'TikTok', url: '#', icon: 'tiktok' }],
  },
  {
    id: 'memphis-pop', name: 'Memphis Pop', categories: ['marketing', 'social-media'], bio: 'Graphic Designer & Illustrator',
    bgColor: '#fbf5e6', bgImageUrl: 'https://images.unsplash.com/photo-1542744094-3a3172720177?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(251,245,230,0.85), rgba(251,245,230,0.92)), url("https://images.unsplash.com/photo-1542744094-3a3172720177?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#1a1a1a', btnBgColor: '#1a1a1a', btnTextColor: '#ffffff', btnBorder: '', roundness: 'rounded-none', fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150', socials: ['tiktok', 'instagram', 'youtube'],
    links: [{ id: 1, title: 'Portfolio', url: '#', icon: 'website' }, { id: 2, title: 'Instagram', url: '#', icon: 'instagram' }, { id: 3, title: 'Contact Me', url: '#', icon: 'email' }],
  },
  {
    id: 'vaporwave-grid', name: 'Vaporwave Grid', categories: ['music', 'telegram'], bio: 'Dreaming in Synthwave',
    bgColor: '#140533', bgImageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(20,5,51,0.65), rgba(2,0,13,0.85)), url("https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#00f0ff', btnBgColor: '#140533', btnTextColor: '#00f0ff', btnBorder: 'border border-[#ff007f]', roundness: 'btn-outline', fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', socials: ['tiktok', 'youtube', 'spotify'],
    links: [{ id: 1, title: 'My Beats', url: '#', icon: 'spotify' }, { id: 2, title: 'YouTube', url: '#', icon: 'youtube' }, { id: 3, title: 'Telegram', url: '#', icon: 'telegram' }],
  },
  {
    id: 'boho-circles', name: 'Boho Circles', categories: ['fashion', 'small-business'], bio: 'Pottery & Earthy Crafts',
    bgColor: '#df7a5f', bgImageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(223,122,95,0.7), rgba(180,85,60,0.85)), url("https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#2d3748', btnBgColor: '#2d3748', btnTextColor: '#f7fafc', btnBorder: '', roundness: 'rounded-xl', fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', socials: ['instagram', 'youtube', 'spotify'],
    links: [{ id: 1, title: 'Loja Online', url: '#', icon: 'store' }, { id: 2, title: 'YouTube', url: '#', icon: 'youtube' }, { id: 3, title: 'Instagram', url: '#', icon: 'instagram' }],
  },
  {
    id: 'lowell-maxwell', name: 'Lowell Maxwell', categories: ['music', 'influencer-creator'], bio: 'Soul beats from Hackney',
    bgColor: '#442222', bgImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(68,34,34,0.75), rgba(36,20,20,0.9)), url("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#fdf6e2', btnBgColor: '#fdf6e2', btnTextColor: '#442222', btnBorder: '', roundness: 'rounded-md', fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', socials: ['instagram', 'youtube', 'spotify'],
    links: [{ id: 1, title: 'Listen Now', url: '#', icon: 'spotify' }, { id: 2, title: 'YouTube', url: '#', icon: 'youtube' }, { id: 3, title: 'Merch Store', url: '#', icon: 'store' }],
  },
  {
    id: 'luxury-gold', name: 'Luxury Gold', categories: ['fashion', 'marketing'], bio: 'Premium & Sofisticado',
    bgColor: '#0a0a0a', bgImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(10,10,10,0.7), rgba(0,0,0,0.9)), url("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#f59e0b', btnBgColor: '#18181b', btnTextColor: '#f59e0b', btnBorder: '', roundness: 'btn-glass', fontClass: 'font-serif',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', socials: ['instagram', 'tiktok', 'youtube'],
    links: [{ id: 1, title: 'Instagram', url: '#', icon: 'instagram' }, { id: 2, title: 'VIP Store', url: '#', icon: 'store' }, { id: 3, title: 'WhatsApp', url: '#', icon: 'whatsapp' }],
  },
  {
    id: 'shaep-fitness', name: 'Shaep Fitness (Kelsey Rose)', categories: ['health-fitness', 'influencer-creator'], bio: 'Treinadora & fundadora da Shaep (442 mil seguidores)',
    bgColor: '#f4f1ea', bgImageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(244,241,234,0.85), rgba(235,231,223,0.92)), url("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#1c1917', btnBgColor: '#e7e3da', btnTextColor: '#1c1917', btnBorder: 'border border-[#d6d0c4]', roundness: 'rounded-full', fontClass: 'font-serif',
    avatarUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=150', socials: ['instagram', 'tiktok', 'youtube'],
    links: [{ id: 1, title: '🏋️ Shift Workouts & Training', url: '#', icon: 'store' }, { id: 2, title: '🧘 Meditation & Breathwork', url: '#', icon: 'website' }, { id: 3, title: '💬 Shaep Community Chat', url: '#', icon: 'whatsapp' }],
  },
  {
    id: 'pistakio-organic', name: 'Pistakio Organic (Nico & Fran)', categories: ['small-business', 'food'], bio: 'Fundadores da Pistakio (28,7 mil seguidores)',
    bgColor: '#8fa844', bgImageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(143,168,68,0.85), rgba(110,132,48,0.92)), url("https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#1a2e05', btnBgColor: '#f1f7d9', btnTextColor: '#2d4508', btnBorder: 'border border-[#a8c652]', roundness: 'rounded-2xl', fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=150', socials: ['instagram', 'youtube', 'tiktok'],
    links: [{ id: 1, title: '🥜 Creamy Pistachio Spread - $15', url: '#', icon: 'store' }, { id: 2, title: '🫙 Crunchy Pistachio Spread - $15', url: '#', icon: 'store' }, { id: 3, title: '🌱 Nossa História & Loja Oficial', url: '#', icon: 'website' }],
  },
  {
    id: 'perfect-person-podcast', name: 'Perfect Person (Miles Bon)', categories: ['podcast', 'music'], bio: 'Podcaster & Criador (351 mil seguidores)',
    bgColor: '#d97706', bgImageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(217,119,6,0.85), rgba(180,83,9,0.92)), url("https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#451a03', btnBgColor: '#fef3c7', btnTextColor: '#78350f', btnBorder: 'border border-[#f59e0b]', roundness: 'rounded-xl', fontClass: 'font-serif',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', socials: ['instagram', 'spotify', 'youtube'],
    links: [{ id: 1, title: '🎙️ Perfect Person Podcast Ep. 165', url: '#', icon: 'spotify' }, { id: 2, title: '⭐ Join My Patreon', url: '#', icon: 'website' }, { id: 3, title: '🎟️ Dialtone Tour Pt. 2 Tickets', url: '#', icon: 'store' }],
  },
  {
    id: 'zay-dante-music', name: 'Zay Dante (Músico & Criador)', categories: ['music', 'influencer-creator'], bio: 'Músico e Criador (2.7 milhões de seguidores)',
    bgColor: '#ea580c', bgImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(234,88,12,0.85), rgba(154,52,18,0.92)), url("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#fff7ed', btnBgColor: '#84cc16', btnTextColor: '#1a2e05', btnBorder: '', roundness: 'rounded-2xl', fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', socials: ['instagram', 'spotify', 'youtube'],
    links: [{ id: 1, title: '🎵 New Single: Pop Song (Out Now)', url: '#', icon: 'spotify' }, { id: 2, title: '🎧 Official Spotify Playlist', url: '#', icon: 'spotify' }, { id: 3, title: '🎸 Tour Dates & Tickets 2026', url: '#', icon: 'website' }],
  },
  {
    id: 'koy-sun-art', name: 'Koy Sun (Artista & Pop Art)', categories: ['art', 'tiktok'], bio: 'Artista Visual & Criador (238 mil seguidores)',
    bgColor: '#1d4ed8', bgImageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
    bgStyle: 'background: linear-gradient(rgba(29,78,216,0.85), rgba(30,58,138,0.92)), url("https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
    textColor: '#fffbeb', btnBgColor: '#fffbeb', btnTextColor: '#1e3a8a', btnBorder: 'border-2 border-[#1d4ed8]', roundness: 'btn-outline', fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', socials: ['instagram', 'tiktok', 'youtube'],
    links: [{ id: 1, title: '🎨 Check Out My Work & Portfolio', url: '#', icon: 'website' }, { id: 2, title: '🎬 TikTok Paint & Process Videos', url: '#', icon: 'tiktok' }, { id: 3, title: '🖼️ Limited Edition Art Prints', url: '#', icon: 'store' }],
  },
  {
    id: 'cosmic-neon', name: 'Cosmic Neon', categories: ['music', 'social-media'], bio: 'Digital Future',
    bgColor: '#060318', bgImageUrl: '',
    bgStyle: 'background-color: #060318;',
    textColor: '#ffffff', btnBgColor: '#0d0928', btnTextColor: '#00f0ff', btnBorder: 'border border-purple-500/30', roundness: 'rounded-full', fontClass: 'font-sans',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', socials: ['tiktok', 'youtube', 'instagram'],
    links: [{ id: 1, title: 'TikTok', url: '#', icon: 'tiktok' }, { id: 2, title: 'YouTube', url: '#', icon: 'youtube' }, { id: 3, title: 'Spotify', url: '#', icon: 'spotify' }],
  },
]

// ─── Platforms Quick-Add (Same as /link-in-bio) ───
const platforms = [
  { id: 'instagram', name: 'Instagram', color: 'bg-[#E1306C]/10 hover:bg-[#E1306C]/20 border-[#E1306C]/20 text-[#E1306C]', icon: 'instagram' },
  { id: 'whatsapp', name: 'WhatsApp', color: 'bg-[#25D366]/10 hover:bg-[#25D366]/20 border-[#25D366]/20 text-[#25D366]', icon: 'whatsapp' },
  { id: 'tiktok', name: 'TikTok', color: 'bg-black/5 hover:bg-black/10 border-black/10 text-black', icon: 'tiktok' },
  { id: 'youtube', name: 'YouTube', color: 'bg-[#FF0000]/10 hover:bg-[#FF0000]/20 border-[#FF0000]/20 text-[#FF0000]', icon: 'youtube' },
  { id: 'website', name: 'Website', color: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 text-blue-600', icon: 'website' },
  { id: 'spotify', name: 'Spotify', color: 'bg-[#1DB954]/10 hover:bg-[#1DB954]/20 border-[#1DB954]/20 text-[#1DB954]', icon: 'spotify' },
]

const topPlatformsIcons = [
  { id: 'none', name: 'Nenhum', icon: '' },
  { id: 'instagram', name: 'Instagram', icon: 'instagram' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'whatsapp' },
  { id: 'tiktok', name: 'TikTok', icon: 'tiktok' },
  { id: 'youtube', name: 'YouTube', icon: 'youtube' },
  { id: 'spotify', name: 'Spotify', icon: 'spotify' },
  { id: 'x', name: 'X / Twitter', icon: 'x' },
  { id: 'website', name: 'Website', icon: 'website' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin' },
  { id: 'email', name: 'E-mail', icon: 'email' },
  { id: 'store', name: 'Loja', icon: 'store' },
  { id: 'phone', name: 'Telefone', icon: 'phone' },
]

// ─── State ───
const router = useRouter()
const route = useRoute()
const loading = ref(true)
const currentUser = ref<any>(null)
const profileId = ref('')
const profileUsername = ref('')
const subscriptionStatus = ref('free')
const checkoutLoading = ref(false)
const saveSuccess = ref(false)
const savingProfile = ref(false)
const activatedSuccess = ref(false)
const errorMsg = ref('')

const uploadingTarget = ref<'avatar' | 'bg' | 'standalone' | null>(null)
const standaloneR2Url = ref('')
const copySuccess = ref(false)
const copyBioSuccess = ref(false)

const currentDomainHost = computed(() => {
  if (import.meta.client) {
    return window.location.host
  }
  return 'avyro.com.br'
})

function copyBioLink() {
  const domain = import.meta.client ? window.location.origin : 'https://www.avyro.com.br'
  const cleanName = profileUsername.value.replace(/^@/, '')
  const fullUrl = `${domain}/${cleanName}`
  navigator.clipboard.writeText(fullUrl)
  copyBioSuccess.value = true
  setTimeout(() => { copyBioSuccess.value = false }, 3000)
}

// Customizer State (Mirrors /link-in-bio playground exactly)
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
const customUsername = ref('')
const customBio = ref('')
const customAvatar = ref('')
const selectedSocials = ref<string[]>(['tiktok', 'youtube', 'instagram'])
const links = ref<LinkItem[]>([])

// Platform add dialog
const showAddPlatformId = ref<string | null>(null)
const platformInputUrl = ref('')
const platformInputTitle = ref('')

// Custom link add
const newLinkIcon = ref('')
const newLinkTitle = ref('')
const newLinkUrl = ref('')

// ─── Lifecycle ───
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) { router.push('/login'); return }

  currentUser.value = session.user
  await loadUserData(session.user.id)

  if (route.query.checkout === 'success') {
    await activateProPlan(session.user.id)
  }

  loading.value = false
})

async function activateProPlan(userId: string) {
  await supabase.from('profiles').update({ subscription_status: 'active', plan_type: 'pro', updated_at: new Date().toISOString() }).eq('id', userId)
  subscriptionStatus.value = 'active'
  activatedSuccess.value = true
  setTimeout(() => { activatedSuccess.value = false }, 5000)
}

async function loadUserData(userId: string) {
  const { data: p } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (p) {
    profileId.value = p.id
    profileUsername.value = p.username || ''
    customUsername.value = p.display_name || p.username || ''
    customBio.value = p.bio_description || ''
    customAvatar.value = p.avatar_url || ''
    subscriptionStatus.value = p.subscription_status || 'free'
    activeThemeId.value = p.theme_id || 'monica-vera'
    customBgColor.value = p.bg_color || '#4b3e34'
    customBgImage.value = p.bg_image_url || ''
    customTextColor.value = p.text_color || '#ffffff'
    customBtnBgColor.value = p.btn_bg_color || '#6b5d52'
    customBtnTextColor.value = p.btn_text_color || '#ffffff'
    customBtnBorder.value = p.btn_border || ''
    customRoundness.value = p.roundness || 'rounded-full'
    customFontClass.value = p.font_class || 'font-serif'
    selectedSocials.value = p.socials || ['tiktok', 'youtube', 'instagram']
    customBgStyle.value = p.bg_style || (customBgImage.value ? `background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.55)), url("${customBgImage.value}"); background-size: cover; background-position: center;` : `background-color: ${customBgColor.value};`)
  }

  const { data: linksData } = await supabase.from('links').select('*').eq('user_id', userId).order('position', { ascending: true })
  if (linksData) { links.value = linksData }
}

// ─── Theme Application ───
function applyTheme(theme: Theme) {
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
  selectedSocials.value = [...theme.socials]
}

// ─── Background Style Updater ───
function updateBgStyle() {
  if (customBgImage.value.trim()) {
    customBgStyle.value = `background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.55)), url("${customBgImage.value.trim()}"); background-size: cover; background-position: center;`
  } else {
    customBgStyle.value = `background-color: ${customBgColor.value};`
  }
}

// ─── Platform Add ───
function openAddPlatform(platId: string) {
  showAddPlatformId.value = platId
  const plat = platforms.find(p => p.id === platId)
  platformInputTitle.value = plat ? `Visite meu ${plat.name}` : 'Acesse o link'
  platformInputUrl.value = platId === 'whatsapp' ? 'https://wa.me/55' : 'https://'
}

async function addPlatformLink() {
  if (!platformInputTitle.value || !platformInputUrl.value || !currentUser.value) return
  const plat = platforms.find(p => p.id === showAddPlatformId.value)

  const { data, error } = await supabase.from('links').insert({
    user_id: currentUser.value.id,
    title: platformInputTitle.value,
    url: platformInputUrl.value,
    icon: plat ? plat.icon : 'website',
    position: links.value.length,
  }).select().single()

  if (error) {
    console.error('Erro ao adicionar link da plataforma:', error)
    errorMsg.value = `Erro ao adicionar link: ${error.message}`
    setTimeout(() => { errorMsg.value = '' }, 5000)
    return
  }

  if (data) links.value.push(data)
  if (showAddPlatformId.value && !selectedSocials.value.includes(showAddPlatformId.value)) {
    selectedSocials.value.push(showAddPlatformId.value)
  }
  showAddPlatformId.value = null
  platformInputUrl.value = ''
  platformInputTitle.value = ''
}

// ─── Custom Link Add ───
async function addCustomLink() {
  if (!newLinkTitle.value || !newLinkUrl.value || !currentUser.value) return
  let url = newLinkUrl.value
  if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url

  const { data, error } = await supabase.from('links').insert({
    user_id: currentUser.value.id,
    title: newLinkTitle.value,
    url,
    icon: newLinkIcon.value || 'website',
    position: links.value.length,
  }).select().single()

  if (error) {
    console.error('Erro ao adicionar link customizado:', error)
    errorMsg.value = `Erro ao adicionar link: ${error.message}`
    setTimeout(() => { errorMsg.value = '' }, 5000)
    return
  }

  if (data) links.value.push(data)
  newLinkTitle.value = ''
  newLinkUrl.value = ''
  newLinkIcon.value = ''
}

async function removeLink(id: any) {
  const { error } = await supabase.from('links').delete().eq('id', id)
  if (error) { console.error('Erro ao remover link:', error); return }
  links.value = links.value.filter(l => l.id !== id)
}

// ─── Cloudflare R2 Upload Function ───
async function handleFileUpload(event: Event, target: 'avatar' | 'bg' | 'standalone') {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const file = input.files[0]
  uploadingTarget.value = target

  try {
    const formData = new FormData()
    formData.append('file', file)

    const res = await $fetch<{ success: boolean; url: string; filename: string }>('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (res && res.url) {
      if (target === 'avatar') {
        customAvatar.value = res.url
      } else if (target === 'bg') {
        customBgImage.value = res.url
        updateBgStyle()
      } else if (target === 'standalone') {
        standaloneR2Url.value = res.url
      }
    }
  } catch (err: any) {
    console.error('Erro no upload Cloudflare R2:', err)
    errorMsg.value = `Erro ao subir imagem para o R2: ${err.statusMessage || err.message}`
    setTimeout(() => { errorMsg.value = '' }, 5000)
  } finally {
    uploadingTarget.value = null
    input.value = ''
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  copySuccess.value = true
  setTimeout(() => { copySuccess.value = false }, 3000)
}

// ─── Save Profile to DB ───
async function saveProfile() {
  if (!currentUser.value) return
  savingProfile.value = true
  saveSuccess.value = false

  await supabase.from('profiles').update({
    display_name: customUsername.value,
    bio_description: customBio.value,
    avatar_url: customAvatar.value,
    theme_id: activeThemeId.value,
    bg_color: customBgColor.value,
    bg_image_url: customBgImage.value,
    bg_style: customBgStyle.value,
    text_color: customTextColor.value,
    btn_bg_color: customBtnBgColor.value,
    btn_text_color: customBtnTextColor.value,
    btn_border: customBtnBorder.value,
    roundness: customRoundness.value,
    font_class: customFontClass.value,
    socials: selectedSocials.value,
    updated_at: new Date().toISOString(),
  }).eq('id', currentUser.value.id)

  savingProfile.value = false
  saveSuccess.value = true
  setTimeout(() => { saveSuccess.value = false }, 3000)
}

// ─── Checkout ───
async function handleCheckout() {
  if (!currentUser.value) return
  checkoutLoading.value = true
  try {
    const res = await $fetch<{ url: string }>('/api/stripe/checkout', { method: 'POST', body: { userId: currentUser.value.id, userEmail: currentUser.value.email } })
    if (res.url) window.location.href = res.url
  } catch (err: any) { alert('Erro: ' + err.message) }
  finally { checkoutLoading.value = false }
}

async function logout() {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

<template>
  <div class="bg-[#FCFCFC] min-h-screen pt-24 lg:pt-28 pb-12 px-4 lg:px-8">
    <div v-if="loading" class="flex flex-col items-center justify-center min-h-[60vh]">
      <span class="material-symbols-outlined animate-spin text-4xl text-secondary mb-4">progress_activity</span>
      <p class="text-sm text-[#666666] font-mono">Carregando seu painel...</p>
    </div>

    <div v-else class="max-w-7xl mx-auto">

      <!-- Success Checkout Toast -->
      <div v-if="activatedSuccess" class="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm flex items-center gap-3 shadow-sm">
        <span class="material-symbols-outlined text-2xl text-emerald-600">verified</span>
        <div>
          <h4 class="font-bold">Parabéns! Plano Pro 30 Dias Grátis Ativado!</h4>
          <p class="text-xs text-emerald-600">Sua conta está 100% liberada com todos os recursos premium.</p>
        </div>
      </div>

      <!-- Top Status Bar -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <span :class="[
              'px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider',
              subscriptionStatus === 'active'
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                : 'bg-amber-100 text-amber-700 border border-amber-300'
            ]">
              {{ subscriptionStatus === 'active' ? '✨ Plano Pro Ativo' : '🔒 Plano Gratuito' }}
            </span>
            <span class="text-xs text-[#999] font-mono">@{{ profileUsername }}</span>
          </div>
          <p class="text-xs text-[#666]">
            Seu link ultracurto para a bio do Insta/TikTok:
            <a :href="`/${profileUsername.replace(/^@/, '')}`" target="_blank" class="text-secondary font-bold hover:underline font-mono ml-1">
              {{ currentDomainHost }}/{{ profileUsername.replace(/^@/, '') }}
            </a>
          </p>
        </div>
        <div class="flex items-center gap-3 flex-wrap">
          <button @click="copyBioLink" class="px-5 py-2.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:scale-105 transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">{{ copyBioSuccess ? 'check' : 'content_copy' }}</span>
            {{ copyBioSuccess ? 'Link Copiado!' : 'Copiar Link da Bio' }}
          </button>
          <a :href="`/${profileUsername.replace(/^@/, '')}`" target="_blank" class="px-5 py-2.5 rounded-full text-xs font-bold bg-white text-[#333] border border-[#DDD] hover:border-secondary/40 transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">open_in_new</span>
            Ver Minha Página
          </a>
          <button @click="logout" class="px-4 py-2.5 rounded-full text-xs font-bold text-[#999] hover:text-red-500 hover:bg-red-50 transition-all flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">logout</span> Sair
          </button>
        </div>
      </div>

      <!-- Error Toast -->
      <div v-if="errorMsg" class="mb-6 p-4 rounded-2xl bg-red-50 border border-red-300 text-red-700 text-sm flex items-center gap-3 shadow-sm">
        <span class="material-symbols-outlined text-xl text-red-500">error</span>
        <span>{{ errorMsg }}</span>
      </div>

      <!-- Step 1: Theme Selection Grid (Mini phone cards - IDENTICAL to /link-in-bio) -->
      <div class="text-center mb-8">
        <h2 class="font-heading text-[28px] md:text-[32px] font-extrabold text-[#111111] mb-2">
          Selecione um tema
        </h2>
        <p class="text-[#666666] font-body text-sm max-w-2xl mx-auto">
          Escolha o estilo que combina com você — sua página pública será atualizada ao salvar.
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-16">
        <div
          v-for="theme in themes"
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

          <!-- Mini phone mockup -->
          <div class="w-full h-[280px] rounded-[24px] overflow-hidden pt-7 px-4 flex flex-col items-center relative" :style="theme.bgStyle">
            <div class="w-12 h-12 rounded-full overflow-hidden border border-black/10 mb-2 relative z-10 shrink-0 shadow-sm">
              <img :src="theme.avatarUrl" :alt="theme.name" class="w-full h-full object-cover">
            </div>
            <h3 class="text-xs font-bold text-center truncate w-full mb-0.5 relative z-10" :style="{ color: theme.textColor }">{{ theme.name }}</h3>
            <p class="text-[9px] opacity-75 text-center truncate w-full mb-3 relative z-10" :style="{ color: theme.textColor }">{{ theme.bio }}</p>
            <div class="space-y-1.5 w-full relative z-10">
              <div
                v-for="(lk, idx) in (theme.links || []).slice(0, 3)"
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
            <span class="font-heading text-xs font-bold text-[#111111] group-hover:text-secondary transition-colors block truncate">{{ theme.name }}</span>
          </div>
        </div>
      </div>

      <!-- Step 2: Platform Selection -->
      <div class="bg-white rounded-3xl p-8 border border-[#EEEEEE] shadow-sm mb-16 max-w-4xl mx-auto">
        <div class="text-center mb-8">
          <h2 class="font-heading text-2xl font-extrabold text-[#111111] mb-2">Em quais plataformas você está?</h2>
          <p class="text-[#666666] font-body text-sm">Escolha para adicionar rapidamente os links das suas redes sociais.</p>
        </div>
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
              <input v-model="platformInputTitle" type="text" class="w-full px-3 py-2 text-xs border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-secondary bg-white">
            </div>
            <div class="sm:col-span-6">
              <label class="block text-xs font-semibold text-[#111111] mb-1">URL / Link completo</label>
              <input v-model="platformInputUrl" type="text" class="w-full px-3 py-2 text-xs border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-secondary bg-white font-mono">
            </div>
            <div class="sm:col-span-2">
              <button @click="addPlatformLink" class="w-full py-2 bg-secondary text-white font-heading text-xs font-bold rounded-xl hover:bg-secondary/90 transition-colors h-[34px]">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Playground Customizer + Preview (IDENTICAL layout to /link-in-bio) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <!-- Left Column: Customizer Controls (7 cols) -->
        <div class="lg:col-span-7 bg-white p-8 rounded-3xl border border-[#EEEEEE] shadow-sm space-y-8">
          <div>
            <h2 class="font-heading text-xl font-extrabold text-[#111111] mb-1 flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">tune</span>
              Personalize sua identidade
            </h2>
            <p class="text-xs text-[#666666]">Ajuste as cores, textos, imagens de fundo e perfil, fontes e formatos de botão.</p>
          </div>

          <!-- Save Success -->
          <div v-if="saveSuccess" class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">check_circle</span>
            Alterações salvas com sucesso! Sua página pública foi atualizada.
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Info & Media inputs -->
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">Nome de Exibição</label>
                <input v-model="customUsername" type="text" class="w-full px-3 py-2.5 text-sm border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-secondary font-medium">
              </div>
              <div>
                <label class="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">Biografia</label>
                <textarea v-model="customBio" rows="3" class="w-full px-3 py-2.5 text-sm border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-secondary resize-none leading-relaxed font-medium"></textarea>
              </div>
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="block text-xs font-bold text-[#111111] uppercase tracking-wider">Foto de Perfil</label>
                  <label class="cursor-pointer px-2.5 py-1 bg-secondary/10 hover:bg-secondary/20 text-secondary text-[11px] font-bold rounded-lg transition-all flex items-center gap-1">
                    <span v-if="uploadingTarget === 'avatar'" class="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>
                    <span v-else class="material-symbols-outlined text-[14px]">cloud_upload</span>
                    {{ uploadingTarget === 'avatar' ? 'Enviando...' : 'Upload R2 (HD)' }}
                    <input type="file" accept="image/*" @change="e => handleFileUpload(e, 'avatar')" class="hidden">
                  </label>
                </div>
                <input v-model="customAvatar" type="text" class="w-full px-3 py-2.5 text-xs border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-secondary font-mono" placeholder="https://... (ou faça upload acima)">
              </div>
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="block text-xs font-bold text-[#111111] uppercase tracking-wider">Imagem de Fundo</label>
                  <label class="cursor-pointer px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1">
                    <span v-if="uploadingTarget === 'bg'" class="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>
                    <span v-else class="material-symbols-outlined text-[14px]">cloud_upload</span>
                    {{ uploadingTarget === 'bg' ? 'Enviando...' : 'Upload R2 (HD)' }}
                    <input type="file" accept="image/*" @change="e => handleFileUpload(e, 'bg')" class="hidden">
                  </label>
                </div>
                <input v-model="customBgImage" @input="updateBgStyle" type="text" class="w-full px-3 py-2.5 text-xs border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-secondary font-mono" placeholder="https://... (ou faça upload acima)">
              </div>
            </div>

            <!-- Stylings inputs -->
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">Formato & Estilo do Botão</label>
                <div class="grid grid-cols-3 gap-2">
                  <button v-for="btn in [
                    { val: 'rounded-none', label: 'Quadrado' },
                    { val: 'rounded-md', label: 'Suave' },
                    { val: 'rounded-xl', label: 'Arredondado' },
                    { val: 'rounded-full', label: 'Pílula' },
                    { val: 'btn-wavy', label: '🌊 Ondulado' },
                    { val: 'btn-torn', label: '📄 Rasgado' },
                    { val: 'btn-brutal', label: '🔳 Brutalista' },
                    { val: 'btn-glass', label: '✨ Vidro' },
                    { val: 'btn-outline', label: '🔲 Contorno' },
                  ]" :key="btn.val" @click="customRoundness = btn.val"
                    :class="['py-2 px-2 text-[11px] border rounded-xl transition-all flex items-center justify-center gap-1', customRoundness === btn.val ? 'border-secondary bg-secondary/5 font-bold text-secondary' : 'border-[#EEEEEE] text-[#555]']">
                    {{ btn.label }}
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">Estilo da Fonte</label>
                <div class="grid grid-cols-2 gap-2">
                  <button @click="customFontClass = 'font-sans'" :class="['py-2 px-3 text-xs border rounded-xl transition-all font-sans', customFontClass === 'font-sans' ? 'border-secondary bg-secondary/5 font-bold' : 'border-[#EEEEEE]']">Inter (Sans)</button>
                  <button @click="customFontClass = 'font-serif'" :class="['py-2 px-3 text-xs border rounded-xl transition-all font-serif', customFontClass === 'font-serif' ? 'border-secondary bg-secondary/5 font-bold' : 'border-[#EEEEEE]']">Georgia (Serif)</button>
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

            <!-- List of links -->
            <div class="space-y-3.5 mb-6">
              <div v-for="link in links" :key="link.id" class="flex items-center justify-between p-3.5 bg-[#FAFAFA] rounded-2xl border border-[#EEEEEE]">
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
                <div class="flex items-center gap-2 shrink-0">
                  <span class="text-[10px] font-mono text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">{{ link.clicks_count || 0 }} cliques</span>
                  <button @click="removeLink(link.id)" class="text-red-400 hover:bg-red-50 p-2 rounded-full transition-colors">
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Form to add customized link with official platform vector icons -->
            <div class="space-y-4 bg-[#FAFAFA] p-4 rounded-2xl border border-[#EEEEEE]">
              <div>
                <label class="block text-xs font-semibold text-[#111111] mb-1.5">Ícone Oficial da Plataforma</label>
                <div class="flex flex-wrap gap-1.5">
                  <button v-for="pIcon in topPlatformsIcons" :key="pIcon.id" @click="newLinkIcon = pIcon.icon"
                    :class="['px-2.5 py-1.5 text-[11px] rounded-xl border transition-all flex items-center gap-1.5 font-medium',
                      newLinkIcon === pIcon.icon ? 'border-secondary bg-secondary text-white font-bold shadow-sm' : 'border-[#EEEEEE] bg-white text-[#444] hover:border-secondary/40 hover:text-secondary'
                    ]">
                    <div v-if="pIcon.icon && brandIcons[pIcon.icon]" class="w-3.5 h-3.5 shrink-0" v-html="brandIcons[pIcon.icon]"></div>
                    <span>{{ pIcon.name }}</span>
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div class="sm:col-span-5">
                  <label class="block text-xs font-semibold text-[#111111] mb-1">Título do botão</label>
                  <input v-model="newLinkTitle" type="text" class="w-full px-3 py-2 text-xs border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-secondary bg-white" placeholder="Ex: Entre em contato no WhatsApp">
                </div>
                <div class="sm:col-span-5">
                  <label class="block text-xs font-semibold text-[#111111] mb-1">URL de destino</label>
                  <input v-model="newLinkUrl" type="text" class="w-full px-3 py-2 text-xs border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-secondary bg-white font-mono" placeholder="https://">
                </div>
                <div class="sm:col-span-2">
                  <button @click="addCustomLink" class="w-full py-2 bg-secondary text-white font-heading text-xs font-bold rounded-xl hover:bg-secondary/90 transition-colors h-[34px]">
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Cloudflare R2 Standalone Upload Box -->
          <div class="border-t border-[#EEEEEE] pt-8">
            <div class="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-lg space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-amber-400 text-2xl">cloud_upload</span>
                  <div>
                    <h4 class="font-heading text-sm font-extrabold">Upload Cloudflare R2 (Resolução Máxima)</h4>
                    <p class="text-[11px] text-slate-300">Gere URLs públicas permanentes para qualquer foto sem perda de qualidade.</p>
                  </div>
                </div>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">unajoya</span>
              </div>

              <div class="flex items-center gap-3">
                <label class="cursor-pointer px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2 shrink-0">
                  <span v-if="uploadingTarget === 'standalone'" class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  <span v-else class="material-symbols-outlined text-[16px]">upload_file</span>
                  {{ uploadingTarget === 'standalone' ? 'Enviando...' : 'Selecionar Imagem HD' }}
                  <input type="file" accept="image/*" @change="e => handleFileUpload(e, 'standalone')" class="hidden">
                </label>
                <p class="text-[11px] text-slate-400 italic">Suporta JPG, PNG, WEBP, GIF em qualidade e resolução máxima</p>
              </div>

              <!-- Output URL with 1-click Copy -->
              <div v-if="standaloneR2Url" class="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between gap-2">
                <div class="min-w-0 flex-1">
                  <p class="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-0.5">URL Pública Cloudflare R2:</p>
                  <p class="text-xs font-mono text-slate-200 truncate select-all">{{ standaloneR2Url }}</p>
                </div>
                <button @click="copyToClipboard(standaloneR2Url)" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0 text-white">
                  <span class="material-symbols-outlined text-[14px]">{{ copySuccess ? 'check' : 'content_copy' }}</span>
                  {{ copySuccess ? 'Copiado!' : 'Copiar' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <button @click="saveProfile" :disabled="savingProfile"
            class="w-full py-4 rounded-full font-heading font-bold text-sm text-white bg-gradient-to-r from-secondary to-purple-600 hover:scale-[1.02] shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            <span v-if="savingProfile" class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
            <span v-else class="material-symbols-outlined text-[18px]">save</span>
            {{ savingProfile ? 'Salvando...' : 'Salvar e Publicar Minha Página' }}
          </button>
        </div>

        <!-- Right Column: Interactive Phone Preview (5 cols) -->
        <div class="lg:col-span-5 lg:sticky lg:top-8 flex justify-center">
          <div class="relative w-[340px] h-[680px] bg-slate-950 rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] p-[12px] border-4 border-slate-800">
            <!-- Speaker & Camera -->
            <div class="absolute top-[22px] left-1/2 -translate-x-1/2 w-32 h-[20px] bg-slate-900 rounded-full flex items-center justify-center gap-2 z-30">
              <span class="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
              <span class="w-12 h-1 bg-slate-950 rounded-full"></span>
            </div>

            <!-- Phone Screen -->
            <div class="w-full h-full rounded-[38px] overflow-y-auto overflow-x-hidden pt-14 pb-8 px-5 relative transition-all duration-500 hide-scrollbar" :style="customBgStyle">
              <div class="relative z-10 flex flex-col items-center h-full">
                <!-- Avatar -->
                <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-black/10 shadow-sm bg-slate-200 mb-4 flex items-center justify-center shrink-0">
                  <img :src="customAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'" alt="Avatar" class="w-full h-full object-cover">
                </div>

                <!-- Username & Bio -->
                <div class="space-y-1.5 text-center mb-6">
                  <h3 class="text-lg font-bold transition-all duration-300" :class="customFontClass" :style="{ color: customTextColor }">
                    @{{ profileUsername }}
                  </h3>
                  <p class="text-xs leading-relaxed max-w-[240px] mx-auto opacity-85 transition-all duration-300 font-medium" :class="customFontClass" :style="{ color: customTextColor }">
                    {{ customBio || 'Sua bio aqui...' }}
                  </p>
                </div>

                <!-- Social Icons Bar -->
                <div class="flex gap-4 justify-center mb-6 opacity-90" :style="{ color: customTextColor }">
                  <div v-for="s in selectedSocials" :key="s" class="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" v-html="brandIcons[s] || ''" :title="s"></div>
                </div>

                <!-- Links Buttons -->
                <div class="space-y-3.5 w-full">
                  <a v-for="link in links" :key="link.id" href="#"
                    :class="['w-full py-3 px-4 text-center font-bold text-xs md:text-sm flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.02] shadow-sm', customRoundness, customBtnBorder, customFontClass]"
                    :style="{ backgroundColor: customBtnBgColor, color: customBtnTextColor }">
                    <div v-if="link.icon && brandIcons[link.icon]" class="w-4 h-4 shrink-0 flex items-center justify-center" v-html="brandIcons[link.icon]"></div>
                    <span>{{ link.title }}</span>
                  </a>
                </div>

                <!-- Branding Footer -->
                <div class="mt-auto pt-10 text-center">
                  <span class="inline-flex items-center gap-1 text-[10px] font-bold opacity-40" :class="customFontClass" :style="{ color: customTextColor }">
                    <span class="material-symbols-outlined text-[12px] font-bold">eco</span>
                    Powered by Avyro Link-in-Bio
                  </span>
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
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }

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
