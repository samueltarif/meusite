<script setup lang="ts">
import { QUANTIDADE_LABEL, TIPO_LABEL } from '~/constants/campanha'
import type { LeadQuantidade, LeadTipo, LeadTracking } from '~/constants/campanha'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Telas Mosquiteiras em Alumínio Sob Medida | GMK',
  description: 'Peça seu orçamento de tela mosquiteira em alumínio sob medida para janelas, portas e sacadas. Responda 4 perguntas e receba pelo WhatsApp.',
  ogTitle: 'Telas Mosquiteiras em Alumínio Sob Medida | GMK',
  ogDescription: 'Orçamento rápido pelo WhatsApp. Telas mosquiteiras em alumínio feitas sob medida.',
  themeColor: '#010133'
})

/* ==========================================================================
 * CONFIGURAÇÃO DA CAMPANHA  →  EDITE AQUI antes de publicar
 * ========================================================================== */
const CONFIG = {
  /** WhatsApp da GMK: DDI + DDD + número, só dígitos. Ex.: 5511999998888 */
  whatsappNumber: '5511945697592',
  /** Mensagem padrão dos botões de WhatsApp (header e flutuante). */
  whatsappMessage: 'Olá! Vim pelo site da GMK e gostaria de um orçamento de telas mosquiteiras.',
  /** ID da conta Google Ads. Ex.: AW-123456789 */
  googleAdsId: 'AW-18161119290',
  /** Rótulo da conversão "Clique no WhatsApp" (Google Ads > Metas > Conversões). */
  conversionLabelWhatsapp: '3ARcCJOM6JwdELrg8tND',
  /** Rótulo da conversão "Lead enviado" (quiz concluído). */
  conversionLabelLead: '0PVGCPKo5pwdELrg8tND'
}

const adsConfigured = /^AW-\d+$/.test(CONFIG.googleAdsId)

/* ==========================================================================
 * RASTREAMENTO GOOGLE ADS
 * ========================================================================== */
function fireConversion(label: string, params: Record<string, unknown> = {}) {
  if (import.meta.server) return
  const payload = { send_to: `${CONFIG.googleAdsId}/${label}`, transport_type: 'beacon', ...params }
  if (!adsConfigured) {
    // Modo teste: enquanto o ID não for configurado, apenas registra no console.
    console.info('[GMK tracking] conversão (Google Ads ainda não configurado):', payload)
    return
  }
  try { window.gtag?.('event', 'conversion', payload) } catch { /* nunca quebrar a página por causa de tracking */ }
}

/** Dispare em todo clique que leva ao WhatsApp. `origem`: header | flutuante | obrigado | rodape ... */
function trackWhatsAppClick(origem: string) {
  fireConversion(CONFIG.conversionLabelWhatsapp, { event_label: origem })
}

/** Dispare quando o lead for salvo com sucesso (fim do quiz). */
function trackFormSubmit(lead: { id?: string; tipo: string; quantidade: string; local: string }) {
  fireConversion(CONFIG.conversionLabelLead, {
    event_label: `${lead.tipo}|${lead.quantidade}`,
    transaction_id: lead.id
  })
}

function loadGtag() {
  if (!adsConfigured || ['localhost', '127.0.0.1'].includes(location.hostname)) return
  window.dataLayer ||= []
  window.gtag ||= function () { window.dataLayer!.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', CONFIG.googleAdsId)
  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.googleAdsId}`
    document.head.appendChild(script)
  }
}

/* ==========================================================================
 * UTMs / GCLID  (guardados com o lead para medir o que vem do Google Ads)
 * ========================================================================== */
const route = useRoute()
const tracking = ref<LeadTracking>({})
const TRACK_KEYS = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

onMounted(() => {
  let stored: LeadTracking = {}
  try { stored = JSON.parse(sessionStorage.getItem('gmk-tracking') || '{}') } catch { /* ignore */ }
  const fromUrl: LeadTracking = {}
  for (const key of TRACK_KEYS) {
    const raw = route.query[key]
    const value = Array.isArray(raw) ? raw[0] : raw
    if (value) fromUrl[key] = String(value).slice(0, 300)
  }
  tracking.value = { ...stored, ...fromUrl, landing: location.pathname }
  try { sessionStorage.setItem('gmk-tracking', JSON.stringify(tracking.value)) } catch { /* ignore */ }
  loadGtag()
})

/* ==========================================================================
 * WHATSAPP
 * ========================================================================== */
const whatsappUrl = (text: string) => `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`
const defaultWhatsappUrl = whatsappUrl(CONFIG.whatsappMessage)

/* ==========================================================================
 * QUIZ
 * ========================================================================== */
const IMG = '/imagens campanha gmk/otimizadas/'
const LOGO = encodeURI(`${IMG}logo-gmk.webp`)
const IMG2 = '/images/campanha-gmk/'

const carouselIndex = ref(0)
let cardsTimer: ReturnType<typeof setInterval> | null = null

const TIPOS: { value: LeadTipo; label: string; hint: string; src: string; images: string[] }[] = [
  {
    value: 'janela',
    label: 'Janela',
    hint: 'Correr, basculante e outras',
    src: `${IMG2}tipo-janela.webp`,
    images: [
      `${IMG2}tipo-janela.webp`,
      `${IMG2}tela_janela.png`,
      `${IMG2}tela_para_janela.png`,
      `${IMG2}janela-depois.webp`,
      `${IMG2}tela_em_portas_e_janelas.png`
    ]
  },
  {
    value: 'porta-giro',
    label: 'Porta de Correr',
    hint: 'Porta de correr sob medida',
    src: `${IMG2}tipo-porta-balcao.webp`,
    images: [
      `${IMG2}tipo-porta-balcao.webp`,
      `${IMG2}tela_porta_correr.png`,
      `${IMG2}tela-mosquiteira-de-correr-depois.2.jpeg`,
      `${IMG2}correr-depois.webp`,
      `${IMG2}tela_porta_balcao.png`
    ]
  },
  {
    value: 'porta-balcao',
    label: 'Telas para Portas',
    hint: 'Giro, abrir e outros modelos',
    src: `${IMG2}tipo-porta-giro.webp`,
    images: [
      `${IMG2}tipo-porta-giro.webp`,
      `${IMG2}tela_para_porta.png`,
      `${IMG2}porta-depois.webp`,
      `${IMG2}Tela-mosquiteira-para-porta-depois.2.jpeg`,
      `${IMG2}tela-mosquiteira-depois.2.jpeg`,
      `${IMG2}tela_pota.png`
    ]
  },
  {
    value: 'casa-inteira',
    label: 'Casa Inteira',
    hint: 'Todas as aberturas',
    src: `${IMG2}tipo-casa-inteira.webp`,
    images: [
      `${IMG2}tipo-casa-inteira.webp`,
      `${IMG2}telas_casa_toda.png`,
      `${IMG2}tela_em_portas_e_janelas.png`,
      `${IMG2}correr-depois.webp`,
      `${IMG2}janela-depois.webp`
    ]
  }
]

const QUANTIDADES: { value: LeadQuantidade; label: string; hint?: string; icon: string }[] = [
  { value: '1-2', label: '1 a 2 unidades', icon: 'looks_two' },
  { value: '3-5', label: '3 a 5 unidades', icon: 'looks_4' },
  { value: 'mais-5', label: 'Mais de 5 unidades', icon: 'filter_9_plus' },
  { value: 'visita', label: 'Quero visita para medição', hint: 'Vamos até você tirar as medidas', icon: 'straighten' }
]

const step = ref(1)
const done = ref(false)
const submitting = ref(false)
const submitError = ref('')
const attempted = ref(false)
const localTouched = ref(false)

const answers = reactive({
  tipo: '' as LeadTipo | '',
  quantidade: '' as LeadQuantidade | '',
  local: '',
  name: '',
  phone: '',
  website: '' // honeypot
})

const localInput = ref<HTMLInputElement | null>(null)
const nameInput = ref<HTMLInputElement | null>(null)

const localValid = computed(() => answers.local.trim().length >= 3)
const nameValid = computed(() => answers.name.trim().length >= 3)
const phoneValid = computed(() => campanhaPhoneIsValid(answers.phone))
const firstName = computed(() => answers.name.trim().split(/\s+/)[0] || '')

function pickTipo(value: LeadTipo) {
  answers.tipo = value
  setTimeout(() => { step.value = 2 }, 220)
}

function pickQuantidade(value: LeadQuantidade) {
  answers.quantidade = value
  setTimeout(() => { step.value = 3 }, 220)
}

function nextFromLocal() {
  localTouched.value = true
  if (!localValid.value) return
  step.value = 4
}

function back() {
  if (step.value > 1) step.value -= 1
}

function onPhoneInput(event: Event) {
  const input = event.target as HTMLInputElement
  answers.phone = campanhaMaskPhone(input.value)
  input.value = answers.phone
}

function onStepEntered() {
  if (step.value === 3) localInput.value?.focus()
  if (step.value === 4) nameInput.value?.focus()
}

async function submit() {
  attempted.value = true
  if (submitting.value || !nameValid.value || !phoneValid.value || !answers.tipo || !answers.quantidade || !localValid.value) return
  submitting.value = true
  submitError.value = ''
  try {
    const res = await $fetch<{ ok: boolean; id?: string }>('/api/campanha/leads', {
      method: 'POST',
      body: {
        name: answers.name.trim(),
        phone: answers.phone,
        tipo: answers.tipo,
        quantidade: answers.quantidade,
        local: answers.local.trim(),
        origem: 'landing-quiz',
        tracking: tracking.value,
        website: answers.website
      }
    })
    trackFormSubmit({ id: res.id, tipo: answers.tipo, quantidade: answers.quantidade, local: answers.local.trim() })
    markCaptured()
    done.value = true
  } catch {
    submitError.value = 'Não conseguimos enviar agora. Tente de novo ou chame direto no WhatsApp.'
  } finally {
    submitting.value = false
  }
}

const summaryText = computed(() => {
  const tipo = answers.tipo ? TIPO_LABEL[answers.tipo] : ''
  const qtd = answers.quantidade ? QUANTIDADE_LABEL[answers.quantidade] : ''
  return { tipo, qtd }
})

const thankYouUrl = computed(() => whatsappUrl(
  `Olá! Sou ${answers.name.trim()}. Acabei de pedir um orçamento no site da GMK:\n`
  + `• Tipo: ${summaryText.value.tipo}\n`
  + `• Quantidade: ${summaryText.value.qtd}\n`
  + `• Local: ${answers.local.trim()}\n`
  + 'Pode me atender?'
))

/* ==========================================================================
 * MODAL "ATENDIMENTO WHATSAPP": pede nome + WhatsApp, grava o lead e abre a conversa
 * ========================================================================== */
const leadCaptured = ref(false)
const wa = reactive({ open: false, origem: '', name: '', phone: '', hp: '', attempted: false, submitting: false })
const waNameInput = ref<HTMLInputElement | null>(null)
const waNameValid = computed(() => wa.name.trim().length >= 3)
const waPhoneValid = computed(() => campanhaPhoneIsValid(wa.phone))

onMounted(() => {
  try { leadCaptured.value = sessionStorage.getItem('gmk-lead-sent') === '1' } catch { /* ignore */ }
})

function markCaptured() {
  leadCaptured.value = true
  try { sessionStorage.setItem('gmk-lead-sent', '1') } catch { /* ignore */ }
}

/** Todo botão de WhatsApp da página chama esta função. */
function openWhatsApp(origem: string) {
  // Sempre abre o pop-up (nome + WhatsApp) para registrar o lead no painel antes de ir ao WhatsApp.
  wa.origem = origem
  wa.attempted = false
  wa.open = true
  nextTick(() => waNameInput.value?.focus())
}

function closeWa() {
  if (!wa.submitting) wa.open = false
}

function onWaPhoneInput(event: Event) {
  const input = event.target as HTMLInputElement
  wa.phone = campanhaMaskPhone(input.value)
  input.value = wa.phone
}

async function submitWa() {
  wa.attempted = true
  if (wa.submitting || !waNameValid.value || !waPhoneValid.value) return
  wa.submitting = true
  // Abre a aba agora (dentro do toque do usuário) para o navegador não bloquear o pop-up.
  const popup = window.open('', '_blank')
  const url = whatsappUrl(`Olá! Sou ${wa.name.trim()}. Vim pelo site da GMK e gostaria de um orçamento de telas mosquiteiras.`)
  try {
    const res = await $fetch<{ ok: boolean; id?: string }>('/api/campanha/leads', {
      method: 'POST',
      body: {
        name: wa.name.trim(),
        phone: wa.phone,
        origem: `whatsapp-${wa.origem}`,
        tracking: tracking.value,
        website: wa.hp
      }
    })
    trackFormSubmit({ id: res.id, tipo: 'whatsapp', quantidade: wa.origem, local: '' })
    markCaptured()
  } catch {
    // Mesmo se o envio falhar, nunca impede o cliente de chegar ao WhatsApp.
  }
  trackWhatsAppClick(wa.origem)
  if (popup) popup.location.href = url
  else window.location.href = url
  wa.submitting = false
  wa.open = false
}

watch(() => wa.open, (open) => {
  if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
})
onBeforeUnmount(() => { if (import.meta.client) document.body.style.overflow = '' })

function scrollToQuiz() {
  document.getElementById('orcamento')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function scrollToVideos() {
  document.getElementById('videos-instalacao')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const VIDEOS = [
  {
    id: 'porta-correr-1',
    title: 'Tela para Porta de Correr',
    src: '/videos/videos%20gmk/tela-para-porta-de-correr.mp4',
    badge: 'Porta de Correr'
  },
  {
    id: 'porta-correr-2',
    title: 'Tela para Porta de Correr',
    src: '/videos/videos%20gmk/tela-para-porta.mp4',
    badge: 'Porta de Correr'
  }
]

const activeVideoIndex = ref(0)
const videoCarouselRef = ref<HTMLElement | null>(null)

function scrollVideoCarousel(direction: 'prev' | 'next') {
  if (!videoCarouselRef.value) return
  const targetIndex = direction === 'next'
    ? Math.min(activeVideoIndex.value + 1, VIDEOS.length - 1)
    : Math.max(activeVideoIndex.value - 1, 0)
  goToVideo(targetIndex)
}

function goToVideo(index: number) {
  if (!videoCarouselRef.value) return
  activeVideoIndex.value = index
  const children = videoCarouselRef.value.children
  if (children[index]) {
    (children[index] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }
}

function onVideoCarouselScroll() {
  if (!videoCarouselRef.value) return
  const container = videoCarouselRef.value
  const scrollLeft = container.scrollLeft
  const cardWidth = container.clientWidth
  if (cardWidth <= 0) return
  const newIndex = Math.round(scrollLeft / cardWidth)
  if (newIndex >= 0 && newIndex < VIDEOS.length) {
    activeVideoIndex.value = newIndex
  }
}

function pauseOtherVideos(currentVideoEl: HTMLVideoElement) {
  if (!import.meta.client) return
  const allVideos = document.querySelectorAll<HTMLVideoElement>('#videos-instalacao video')
  allVideos.forEach((v) => {
    if (v !== currentVideoEl && !v.paused) {
      v.pause()
    }
  })
}

const TRUST = [
  { icon: 'event_available', label: 'Visita técnica grátis' },
  { icon: 'verified_user', label: '2 anos de garantia' }
]

const BENEFITS = [
  { icon: 'verified_user', title: '2 anos de garantia', text: 'Tranquilidade depois da instalação.' },
  { icon: 'event_available', title: 'Visita técnica gratuita', text: 'Medimos no local, sem compromisso.' },
  { icon: 'straighten', title: 'Sob medida em alumínio', text: 'Feita para o vão da sua janela ou porta.' },
  { icon: 'build', title: 'Instalação profissional', text: 'Equipe pontual e atenciosa.' }
]

const HOW = [
  { n: '1', title: 'Responda o quiz', text: 'São só 4 perguntas rápidas sobre o que você precisa.' },
  { n: '2', title: 'Receba o orçamento', text: 'Nossa equipe te chama no WhatsApp em até 15 min e agenda a visita técnica gratuita.' },
  { n: '3', title: 'Instalação com garantia', text: 'Instalamos no dia combinado, com 2 anos de garantia.' }
]

/* Avaliações reais de clientes (fotos publicadas com autorização).
 * TODO: troque "Cliente GMK" pelo primeiro nome de cada cliente. */
const TESTIMONIALS = [
  {
    nome: 'Cliente GMK',
    foto: `${IMG2}depoimento-1.webp`,
    texto: `Excelente atendimento, conseguiram atender todas as minhas necessidades e com preço adequado, serviço de qualidade com todas as instalações muito bem montadas, pontualidade e muito profissionalismo, recomendo!`
  },
  {
    nome: 'Cliente GMK',
    foto: `${IMG2}depoimento-2.webp`,
    texto: `Excelente atendimento, o Márcio conversava comigo em qualquer dia da semana, sempre disposta a ajudar, me passando informações completas, revisando orçamento com muita agilidade a cada modificação que eu fazia. Os rapazes da instalação são extremamente rápidos e atenciosos, montaram as redes do jeitinho que eu pedi, explicando com bastante detalhe todo o manuseio. A agilidade na entrega superou minhas expectativas. Adorei o resultado, estou muito satisfeita e certamente recomendo!`
  },
  {
    nome: 'Cliente GMK',
    foto: `${IMG2}depoimento-3.webp`,
    texto: `Excelente serviço. Muito bem feito. Recomendo!!`
  },
  {
    nome: 'Cliente GMK',
    foto: `${IMG2}depoimento-4.webp`,
    texto: `A instalação ficou perfeita, atendimento também. Recomendo o serviço, foram super pontuais e profissionais.`
  }
]

const BEFORE_AFTER = [
  { key: 'janela', label: 'Janela', antes: `${IMG2}janela-antes.webp`, depois: `${IMG2}janela-depois.webp` },
  { key: 'correr', label: 'Tela de correr', antes: `${IMG2}correr-antes.webp`, depois: `${IMG2}correr-depois.webp` },
  { key: 'porta', label: 'Porta', antes: `${IMG2}porta-antes.webp`, depois: `${IMG2}porta-depois.webp` }
]

const FAQ = [
  { q: 'A visita técnica tem custo?', a: 'Não. O orçamento com visita técnica é gratuito e sem compromisso.' },
  { q: 'Qual é a garantia?', a: 'O nosso serviço tem 2 anos de garantia.' },
  { q: 'Como recebo meu orçamento?', a: 'Depois de responder as 4 perguntas do quiz, nossa equipe te chama no WhatsApp em até 15 min.' },
  { q: 'As telas são feitas sob medida?', a: 'Sim. Cada tela é de alumínio e feita para o vão da sua janela, porta ou sacada.' },
  { q: 'Vocês fazem a instalação?', a: 'Sim. Nossa equipe instala e explica como usar a tela.' },
  { q: 'Quais aberturas vocês atendem?', a: 'Janelas, portas de giro, portas-balcão e sacadas, ou a casa inteira.' }
]

/* ---------- Depoimentos: carrossel com snap (sem biblioteca) ---------- */
const carousel = ref<HTMLElement | null>(null)
const activeIdx = ref(0)
const expanded = ref<number[]>([])
let carouselRaf = 0

const isLong = (t: { texto: string }) => t.texto.length > 230
function toggleExpanded(i: number) {
  expanded.value = expanded.value.includes(i) ? expanded.value.filter(n => n !== i) : [...expanded.value, i]
}
function onCarouselScroll() {
  if (carouselRaf) return
  carouselRaf = requestAnimationFrame(() => {
    carouselRaf = 0
    const el = carousel.value
    if (!el) return
    const center = el.scrollLeft + el.clientWidth / 2
    let best = 0
    let bestDist = Infinity
    ;(Array.from(el.children) as HTMLElement[]).forEach((c, i) => {
      const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center)
      if (dist < bestDist) { bestDist = dist; best = i }
    })
    activeIdx.value = best
  })
}
function goTo(i: number) {
  const el = carousel.value
  const card = el?.children[i] as HTMLElement | undefined
  if (!el || !card) return
  el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: 'smooth' })
}

/* ---------- Antes e depois: slider por toque/mouse + teclado ---------- */
const baIdx = ref(0)
const baPos = ref(50)
const curBa = computed(() => BEFORE_AFTER[baIdx.value]!)
let baDragging = false

function selectBa(i: number) {
  baIdx.value = i
  baPos.value = 50
}
function baSetFromEvent(e: PointerEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  baPos.value = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100))
}
function baDown(e: PointerEvent) {
  baDragging = true
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  // No toque, só move depois de arrastar (não atrapalha a rolagem vertical da página).
  if (e.pointerType === 'mouse') baSetFromEvent(e)
}
function baMove(e: PointerEvent) {
  if (baDragging) baSetFromEvent(e)
}
function baUp() {
  baDragging = false
}

/* ---------- Barra fixa de WhatsApp (só no celular) ---------- */
const quizOut = ref(false)
const kbOpen = ref(false)
const barVisible = computed(() => quizOut.value && !kbOpen.value && !wa.open)

let quizObserver: IntersectionObserver | null = null
const onFocusIn = (e: FocusEvent) => {
  const el = e.target as HTMLInputElement | null
  kbOpen.value = !!el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) && el.type !== 'range'
}
const onFocusOut = () => { kbOpen.value = false }

onMounted(() => {
  const quiz = document.getElementById('orcamento')
  if (quiz && 'IntersectionObserver' in window) {
    quizObserver = new IntersectionObserver(([entry]) => { quizOut.value = !entry!.isIntersecting }, { threshold: 0 })
    quizObserver.observe(quiz)
  }
  document.addEventListener('focusin', onFocusIn)
  document.addEventListener('focusout', onFocusOut)

  cardsTimer = setInterval(() => {
    carouselIndex.value++
  }, 2000)
})
onBeforeUnmount(() => {
  quizObserver?.disconnect()
  if (cardsTimer) clearInterval(cardsTimer)
  if (import.meta.client) {
    document.removeEventListener('focusin', onFocusIn)
    document.removeEventListener('focusout', onFocusOut)
    cancelAnimationFrame(carouselRaf)
  }
})
</script>

<template>
  <div class="gmk-page min-h-screen bg-[#faf8ff] pb-24 font-body text-primary antialiased">
    <!-- HEADER -->
    <header class="sticky top-0 z-40 border-b border-[#d7dce4] bg-white/95 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <div class="flex min-w-0 items-center gap-2.5">
          <img :src="LOGO" alt="GMK" width="320" height="267" class="h-12 w-auto shrink-0" fetchpriority="high">
          <p class="max-w-[130px] text-[11px] font-bold leading-tight text-secondary sm:max-w-none sm:text-sm">
            Telas Mosquiteiras em Alumínio Sob Medida
          </p>
        </div>
        <a
          :href="defaultWhatsappUrl"
          target="_blank"
          rel="noopener"
          :class="barVisible ? 'hidden' : 'inline-flex'"
          class="h-10 shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-4 lg:inline-flex text-sm font-bold text-white shadow-sm transition hover:bg-[#1fb957] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
          @click.prevent="openWhatsApp('header')"
        >
          <CampanhaWhatsappIcon :size="18" />
          <span>WhatsApp</span>
        </a>
      </div>
    </header>

    <main>
      <!-- HERO + QUIZ -->
      <section class="gmk-hero relative overflow-hidden text-white">
        <div class="relative z-10 mx-auto grid max-w-6xl gap-6 px-2 sm:px-4 pb-10 pt-6 lg:grid-cols-[1fr_minmax(0,34rem)] lg:items-center lg:gap-14 lg:py-16">
          <div>
            <h1 class="font-heading text-[26px] font-extrabold leading-[1.15] sm:text-4xl lg:text-5xl">
              Proteja sua casa de <span class="text-secondary-container">mosquitos e insetos</span> sem perder a ventilação
            </h1>
            <p class="mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              Responda 4 perguntas e receba seu orçamento pelo WhatsApp em até 15 min.
            </p>
            <ul class="mt-3 flex flex-wrap gap-1.5" aria-label="Diferenciais">
              <li v-for="c in TRUST" :key="c.label" class="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-[#c5e7ff]">
                <CampanhaIcon :name="c.icon" :size="14" fill /> {{ c.label }}
              </li>
            </ul>
            <ul class="mt-6 hidden space-y-3 lg:block">
              <li v-for="b in BENEFITS.slice(0, 3)" :key="b.title" class="flex items-center gap-3 text-white/90">
                <span class="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-secondary-container"><CampanhaIcon :name="b.icon" :size="20" /></span>
                <span class="font-semibold">{{ b.title }}</span>
              </li>
            </ul>
          </div>

          <!-- QUIZ -->
          <div id="orcamento" class="scroll-mt-20 rounded-2xl sm:rounded-3xl bg-white p-2.5 sm:p-6 text-primary shadow-2xl shadow-black/30" role="group" aria-label="Pedido de orçamento">
            <div v-if="!done" class="mb-5">
              <div class="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                <button v-if="step > 1" type="button" class="inline-flex items-center gap-1 rounded text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary" @click="back">
                  <CampanhaIcon name="arrow_back" :size="16" /> Voltar
                </button>
                <span v-else>Orçamento sem compromisso</span>
                <span>Passo {{ step }} de 4</span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-[#e3e1e9]" role="progressbar" aria-label="Progresso do orçamento" aria-valuemin="1" aria-valuemax="4" :aria-valuenow="step">
                <div class="h-full rounded-full bg-gradient-to-r from-secondary to-secondary-container transition-all duration-500 ease-out" :style="{ width: step * 25 + '%' }" />
              </div>
            </div>

            <Transition name="gmk-step" mode="out-in" @after-enter="onStepEntered">
              <!-- OBRIGADO -->
              <div v-if="done" key="done" class="py-2 text-center" aria-live="polite">
                <div class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e7f9ee] text-[#16a34a]">
                  <CampanhaIcon name="check_circle" :size="40" fill />
                </div>
                <h2 class="mt-4 font-heading text-2xl font-extrabold">Pedido recebido, {{ firstName }}!</h2>
                <p class="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
                  Nossa equipe vai te chamar no WhatsApp. Para adiantar o atendimento, toque no botão abaixo e fale com a gente agora.
                </p>
                <a
                  :href="thankYouUrl"
                  target="_blank"
                  rel="noopener"
                  class="mt-5 flex min-h-[56px] items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-5 text-base font-extrabold text-white shadow-lg shadow-[#25D366]/30 transition hover:bg-[#1fb957] active:scale-[0.99]"
                  @click="trackWhatsAppClick('obrigado')"
                >
                  <CampanhaWhatsappIcon :size="24" /> Adiantar meu atendimento no WhatsApp
                </a>
                <dl class="mt-5 grid gap-2 rounded-2xl bg-[#f4f3fb] p-4 text-left text-sm">
                  <div class="flex justify-between gap-4"><dt class="text-slate-500">Tela</dt><dd class="text-right font-semibold">{{ summaryText.tipo }}</dd></div>
                  <div class="flex justify-between gap-4"><dt class="text-slate-500">Quantidade</dt><dd class="text-right font-semibold">{{ summaryText.qtd }}</dd></div>
                  <div class="flex justify-between gap-4"><dt class="text-slate-500">Local</dt><dd class="text-right font-semibold">{{ answers.local }}</dd></div>
                </dl>
              </div>

              <!-- PASSO 1 -->
              <div v-else-if="step === 1" key="s1">
                <h2 class="font-heading text-xl font-extrabold leading-snug sm:text-2xl">Qual tipo de tela mosquiteira você precisa?</h2>
                <p class="mt-1 text-sm text-slate-500">Toque na opção que mais combina com você.</p>
                <div class="mt-3.5 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    v-for="t in TIPOS"
                    :key="t.value"
                    type="button"
                    :aria-pressed="answers.tipo === t.value"
                    class="group overflow-hidden rounded-2xl border-2 bg-white text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                    :class="answers.tipo === t.value ? 'border-secondary ring-4 ring-secondary-container/40' : 'border-[#d7dce4]'"
                    @click="pickTipo(t.value)"
                  >
                    <span class="relative block aspect-square sm:aspect-[4/3] lg:aspect-[16/10] overflow-hidden bg-[#eeedf5]">
                      <!-- Carrossel automático de fotos a cada 2s em todos os 4 cards -->
                      <div class="relative h-full w-full">
                        <img
                          v-for="(imgSrc, imgIdx) in t.images"
                          :key="imgSrc"
                          :src="imgSrc"
                          :alt="t.label"
                          width="400"
                          height="400"
                          class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out group-hover:scale-105"
                          :class="(carouselIndex % t.images.length) === imgIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'"
                          :loading="imgIdx === 0 ? 'eager' : 'lazy'"
                        />
                        <!-- Indicador discreto das fotos -->
                        <div class="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20 flex gap-1">
                          <span
                            v-for="(_, dotIdx) in t.images"
                            :key="dotIdx"
                            class="h-1 rounded-full transition-all duration-300"
                            :class="(carouselIndex % t.images.length) === dotIdx ? 'w-3 bg-white shadow' : 'w-1 bg-white/60'"
                          />
                        </div>
                      </div>

                      <span v-if="answers.tipo === t.value" class="absolute right-2 top-2 z-20 grid h-6 w-6 place-items-center rounded-full bg-secondary text-white shadow">
                        <CampanhaIcon name="check" :size="16" />
                      </span>
                    </span>
                    <span class="block px-2 py-2 sm:px-2.5 sm:py-2.5">
                      <span class="block text-xs sm:text-sm font-extrabold leading-tight">{{ t.label }}</span>
                      <span class="mt-0.5 block text-[10px] sm:text-[11px] leading-tight text-slate-500">{{ t.hint }}</span>
                    </span>
                  </button>
                </div>
              </div>

              <!-- PASSO 2 -->
              <div v-else-if="step === 2" key="s2">
                <h2 class="font-heading text-xl font-extrabold leading-snug sm:text-2xl">Quantas unidades aproximadamente?</h2>
                <p class="mt-1 text-sm text-slate-500">Pode ser uma estimativa, a gente confirma depois.</p>
                <div class="mt-4 grid gap-3">
                  <button
                    v-for="q in QUANTIDADES"
                    :key="q.value"
                    type="button"
                    :aria-pressed="answers.quantidade === q.value"
                    class="flex min-h-[64px] items-center gap-3 rounded-2xl border-2 bg-white px-4 py-3 text-left transition hover:border-secondary-container hover:bg-[#f4f9ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                    :class="answers.quantidade === q.value ? 'border-secondary bg-[#f4f9ff] ring-4 ring-secondary-container/30' : 'border-[#d7dce4]'"
                    @click="pickQuantidade(q.value)"
                  >
                    <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e6f2ff] text-secondary"><CampanhaIcon :name="q.icon" :size="24" /></span>
                    <span class="min-w-0 flex-1">
                      <span class="block text-[15px] font-bold leading-tight">{{ q.label }}</span>
                      <span v-if="q.hint" class="mt-0.5 block text-xs text-slate-500">{{ q.hint }}</span>
                    </span>
                    <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2" :class="answers.quantidade === q.value ? 'border-secondary bg-secondary text-white' : 'border-[#c7c5d0]'">
                      <CampanhaIcon v-if="answers.quantidade === q.value" name="check" :size="14" />
                    </span>
                  </button>
                </div>
              </div>

              <!-- PASSO 3 -->
              <form v-else-if="step === 3" key="s3" novalidate @submit.prevent="nextFromLocal">
                <h2 class="font-heading text-xl font-extrabold leading-snug sm:text-2xl">Qual seu Bairro e Cidade?</h2>
                <p class="mt-1 text-sm text-slate-500">Assim confirmamos o atendimento na sua região.</p>
                <label for="gmk-local" class="sr-only">Bairro e cidade</label>
                <div class="relative mt-4">
                  <CampanhaIcon name="location_on" :size="22" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    id="gmk-local"
                    ref="localInput"
                    v-model="answers.local"
                    type="text"
                    name="local"
                    maxlength="120"
                    autocomplete="address-level2"
                    enterkeyhint="next"
                    placeholder="Ex.: Jardim das Flores, Campinas"
                    class="h-14 w-full rounded-2xl border-2 bg-white pl-12 pr-4 text-base outline-none transition placeholder:text-slate-400 focus:border-secondary focus:ring-4 focus:ring-secondary-container/30"
                    :class="localTouched && !localValid ? 'border-red-400' : 'border-[#d7dce4]'"
                  >
                </div>
                <p v-if="localTouched && !localValid" class="mt-2 text-sm font-medium text-red-600" role="alert">Informe seu bairro e cidade.</p>
                <button type="submit" class="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-secondary text-base font-extrabold text-white shadow-lg shadow-secondary/25 transition hover:bg-[#004f80] active:scale-[0.99]">
                  Continuar <CampanhaIcon name="arrow_forward" :size="20" />
                </button>
              </form>

              <!-- PASSO 4 -->
              <form v-else key="s4" novalidate @submit.prevent="submit">
                <h2 class="font-heading text-xl font-extrabold leading-snug sm:text-2xl">Onde você deseja receber o orçamento em até 15 min?</h2>
                <p class="mt-1 text-sm text-slate-500">Enviamos pelo WhatsApp. Sem spam.</p>

                <div class="mt-3 flex flex-wrap gap-1.5 text-xs font-semibold text-secondary">
                  <span class="rounded-full bg-[#e6f2ff] px-2.5 py-1">{{ summaryText.tipo }}</span>
                  <span class="rounded-full bg-[#e6f2ff] px-2.5 py-1">{{ summaryText.qtd }}</span>
                  <span class="max-w-full truncate rounded-full bg-[#e6f2ff] px-2.5 py-1">{{ answers.local }}</span>
                </div>

                <div class="mt-4 space-y-3">
                  <div>
                    <label for="gmk-name" class="mb-1 block text-sm font-bold">Nome completo</label>
                    <input
                      id="gmk-name"
                      ref="nameInput"
                      v-model="answers.name"
                      type="text"
                      name="name"
                      maxlength="100"
                      autocomplete="name"
                      autocapitalize="words"
                      enterkeyhint="next"
                      placeholder="Seu nome"
                      class="h-14 w-full rounded-2xl border-2 bg-white px-4 text-base outline-none transition placeholder:text-slate-400 focus:border-secondary focus:ring-4 focus:ring-secondary-container/30"
                      :class="attempted && !nameValid ? 'border-red-400' : 'border-[#d7dce4]'"
                    >
                    <p v-if="attempted && !nameValid" class="mt-1 text-sm font-medium text-red-600" role="alert">Informe seu nome.</p>
                  </div>
                  <div>
                    <label for="gmk-phone" class="mb-1 block text-sm font-bold">WhatsApp</label>
                    <input
                      id="gmk-phone"
                      :value="answers.phone"
                      type="tel"
                      name="phone"
                      inputmode="tel"
                      maxlength="15"
                      autocomplete="tel"
                      enterkeyhint="send"
                      placeholder="(11) 99999-9999"
                      class="h-14 w-full rounded-2xl border-2 bg-white px-4 text-base outline-none transition placeholder:text-slate-400 focus:border-secondary focus:ring-4 focus:ring-secondary-container/30"
                      :class="attempted && !phoneValid ? 'border-red-400' : 'border-[#d7dce4]'"
                      @input="onPhoneInput"
                    >
                    <p v-if="attempted && !phoneValid" class="mt-1 text-sm font-medium text-red-600" role="alert">Informe DDD + número do WhatsApp.</p>
                  </div>
                  <!-- honeypot anti-robô -->
                  <input v-model="answers.website" type="text" name="company-site" tabindex="-1" autocomplete="off" aria-hidden="true" class="absolute -left-[9999px] h-0 w-0 opacity-0">
                </div>

                <div v-if="submitError" class="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">
                  {{ submitError }}
                  <a :href="defaultWhatsappUrl" target="_blank" rel="noopener" class="font-bold underline" @click.prevent="openWhatsApp('erro-envio')">Chamar no WhatsApp</a>
                </div>

                <button
                  type="submit"
                  :disabled="submitting"
                  class="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-base font-extrabold text-white shadow-lg shadow-[#25D366]/30 transition hover:bg-[#1fb957] active:scale-[0.99] disabled:opacity-70"
                >
                  <template v-if="submitting">
                    <span class="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Enviando...
                  </template>
                  <template v-else>
                    <CampanhaWhatsappIcon :size="22" /> Receber meu orçamento
                  </template>
                </button>
                <p class="mt-3 flex items-start gap-1.5 text-[11px] leading-snug text-slate-500">
                  <CampanhaIcon name="lock" :size="14" class="mt-px" />
                  Seus dados são usados apenas para enviar o seu orçamento pelo WhatsApp.
                </p>
              </form>
            </Transition>
          </div>
        </div>
      </section>

      <!-- DEPOIMENTOS -->
      <section class="bg-white" aria-labelledby="gmk-dep-title">
        <div class="mx-auto max-w-6xl px-4 py-10 lg:py-14">
          <div class="text-center">
            <div class="flex justify-center gap-0.5 text-amber-400" aria-hidden="true">
              <CampanhaIcon v-for="n in 5" :key="n" name="star" :size="20" fill />
            </div>
            <h2 id="gmk-dep-title" class="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">O que nossos clientes dizem</h2>
            <p class="mx-auto mt-1 max-w-md text-sm text-slate-500">Avaliações de clientes atendidos pela GMK. Fotos publicadas com autorização.</p>
          </div>

          <div
            ref="carousel"
            class="gmk-snap relative -mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2"
            role="region"
            aria-label="Avaliações de clientes"
            tabindex="0"
            @scroll.passive="onCarouselScroll"
          >
            <article
              v-for="(t, i) in TESTIMONIALS"
              :key="i"
              class="flex w-[85%] shrink-0 snap-center flex-col rounded-2xl border border-[#d7dce4] bg-[#faf8ff] p-4 sm:w-[22rem]"
            >
              <header class="flex items-center gap-3">
                <img :src="t.foto" :alt="`Foto de ${t.nome}`" width="128" height="128" loading="lazy" decoding="async" class="h-12 w-12 shrink-0 rounded-full object-cover">
                <div class="min-w-0">
                  <p class="truncate text-sm font-extrabold">{{ t.nome }}</p>
                  <div class="flex text-amber-400" role="img" aria-label="5 de 5 estrelas">
                    <CampanhaIcon v-for="n in 5" :key="n" name="star" :size="16" fill />
                  </div>
                </div>
              </header>
              <blockquote class="mt-3 text-sm leading-relaxed text-slate-700">
                <p :class="isLong(t) && !expanded.includes(i) ? 'line-clamp-5' : ''">“{{ t.texto }}”</p>
              </blockquote>
              <button
                v-if="isLong(t)"
                type="button"
                class="mt-2 min-h-[44px] self-start text-sm font-bold text-secondary underline-offset-2 hover:underline"
                :aria-expanded="expanded.includes(i)"
                @click="toggleExpanded(i)"
              >
                {{ expanded.includes(i) ? 'Ler menos' : 'Ler mais' }}
              </button>
            </article>
          </div>

          <div class="mt-2 flex items-center justify-center gap-1">
            <button
              v-for="(t, i) in TESTIMONIALS"
              :key="i"
              type="button"
              class="grid h-8 w-6 place-items-center"
              :aria-label="`Ver avaliação ${i + 1}`"
              :aria-current="activeIdx === i"
              @click="goTo(i)"
            >
              <span class="h-2 rounded-full transition-all" :class="activeIdx === i ? 'w-5 bg-secondary' : 'w-2 bg-[#c7c5d0]'" />
            </button>
          </div>
        </div>
      </section>

      <!-- ANTES E DEPOIS -->
      <section class="mx-auto max-w-6xl px-4 py-10 lg:py-14" aria-labelledby="gmk-ba-title">
        <div class="text-center">
          <h2 id="gmk-ba-title" class="font-heading text-2xl font-extrabold sm:text-3xl">Veja o antes e depois</h2>
          <p class="mt-1 text-sm text-slate-500">Instalações reais da GMK. Arraste para comparar.</p>
        </div>

        <div class="mt-5 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Tipo de instalação">
          <button
            v-for="(p, i) in BEFORE_AFTER"
            :key="p.key"
            type="button"
            role="tab"
            :aria-selected="baIdx === i"
            class="min-h-[44px] rounded-full border-2 px-4 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            :class="baIdx === i ? 'border-secondary bg-secondary text-white' : 'border-[#d7dce4] bg-white text-primary'"
            @click="selectBa(i)"
          >
            {{ p.label }}
          </button>
        </div>

        <div
          class="relative mx-auto mt-4 aspect-[3/4] w-full max-w-sm touch-pan-y select-none overflow-hidden rounded-2xl bg-slate-200 shadow-lg"
          @pointerdown="baDown"
          @pointermove="baMove"
          @pointerup="baUp"
          @pointercancel="baUp"
        >
          <img :src="curBa.depois" :alt="`${curBa.label}: depois da instalação da tela mosquiteira`" width="720" height="960" loading="lazy" decoding="async" draggable="false" class="absolute inset-0 h-full w-full object-cover">
          <img
            :src="curBa.antes"
            :alt="`${curBa.label}: antes da instalação`"
            width="720"
            height="960"
            loading="lazy"
            decoding="async"
            draggable="false"
            class="absolute inset-0 h-full w-full object-cover"
            :style="{ clipPath: `inset(0 ${100 - baPos}% 0 0)` }"
          >
          <span class="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-extrabold tracking-wide text-white">ANTES</span>
          <span class="pointer-events-none absolute right-3 top-3 rounded-full bg-secondary px-2.5 py-1 text-xs font-extrabold tracking-wide text-white">DEPOIS</span>
          <div class="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow" :style="{ left: baPos + '%' }">
            <span class="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-primary shadow-lg">
              <CampanhaIcon name="swap_horiz" :size="24" />
            </span>
          </div>
          <input v-model.number="baPos" type="range" min="0" max="100" step="1" class="sr-only" aria-label="Comparar antes e depois">
        </div>

        <div class="mt-6 flex flex-col items-center justify-center gap-3">
          <a href="#orcamento" class="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-secondary px-8 text-base font-extrabold text-white shadow-lg shadow-secondary/25 transition hover:bg-[#004f80]" @click.prevent="scrollToQuiz">
            Quero o meu também <CampanhaIcon name="arrow_upward" :size="20" />
          </a>
          <a href="#videos-instalacao" class="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-primary/15 bg-white/90 px-6 text-sm font-extrabold text-primary shadow-sm backdrop-blur transition hover:border-secondary hover:bg-white hover:text-secondary hover:shadow" @click.prevent="scrollToVideos">
            <CampanhaIcon name="play_circle" :size="20" class="text-secondary" />
            Ver vídeos de instalação
          </a>
        </div>
      </section>

      <!-- COMO FUNCIONA -->
      <section class="bg-white" aria-labelledby="gmk-how-title">
        <div class="mx-auto max-w-6xl px-4 py-10 lg:py-14">
          <h2 id="gmk-how-title" class="text-center font-heading text-2xl font-extrabold sm:text-3xl">Como funciona</h2>
          <ol class="mx-auto mt-6 max-w-md sm:grid sm:max-w-none sm:grid-cols-3 sm:gap-6">
            <li v-for="(h, i) in HOW" :key="h.n" class="relative flex gap-4 pb-6 last:pb-0 sm:flex-col sm:gap-3 sm:pb-0">
              <span v-if="i < HOW.length - 1" class="absolute bottom-1 left-5 top-11 w-px -translate-x-1/2 bg-[#c7c5d0] sm:hidden" aria-hidden="true" />
              <span class="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary font-heading text-lg font-extrabold text-white">{{ h.n }}</span>
              <div>
                <h3 class="font-heading text-base font-bold sm:text-lg">{{ h.title }}</h3>
                <p class="mt-0.5 text-sm leading-relaxed text-slate-600">{{ h.text }}</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <!-- VÍDEOS DE INSTALAÇÃO -->
      <section id="videos-instalacao" class="bg-[#faf8ff] border-y border-[#e3e1e9]/60 py-12 lg:py-16 scroll-mt-6" aria-labelledby="gmk-videos-title">
        <div class="mx-auto max-w-4xl px-4">
          <div class="text-center">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3.5 py-1 text-xs font-extrabold tracking-wide uppercase text-secondary">
              <CampanhaIcon name="videocam" :size="16" />
              Instalações Reais GMK
            </span>
            <h2 id="gmk-videos-title" class="mt-2.5 font-heading text-2xl font-extrabold sm:text-3xl text-primary">
              Veja nossas telas instaladas em clientes
            </h2>
            <p class="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Deslize para o lado para ver o acabamento sob medida, suavidade de abertura e qualidade de vedação.
            </p>
          </div>

          <!-- CARROSSEL DE VÍDEOS -->
          <div class="relative mt-8">
            <!-- BOTÕES DE NAVEGAÇÃO DESKTOP / TABLET (LATERAIS) -->
            <button
              type="button"
              class="hidden sm:grid absolute -left-5 top-1/2 -translate-y-1/2 z-10 h-12 w-12 place-items-center rounded-full bg-white text-primary shadow-xl border border-slate-200 transition active:scale-95 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
              :disabled="activeVideoIndex === 0"
              aria-label="Vídeo anterior"
              @click="scrollVideoCarousel('prev')"
            >
              <CampanhaIcon name="chevron_left" :size="28" />
            </button>
            <button
              type="button"
              class="hidden sm:grid absolute -right-5 top-1/2 -translate-y-1/2 z-10 h-12 w-12 place-items-center rounded-full bg-white text-primary shadow-xl border border-slate-200 transition active:scale-95 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
              :disabled="activeVideoIndex === VIDEOS.length - 1"
              aria-label="Próximo vídeo"
              @click="scrollVideoCarousel('next')"
            >
              <CampanhaIcon name="chevron_right" :size="28" />
            </button>

            <!-- TRACK DE VÍDEOS -->
            <div
              ref="videoCarouselRef"
              class="gmk-snap flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2 px-1"
              @scroll.passive="onVideoCarouselScroll"
            >
              <div
                v-for="(vid, idx) in VIDEOS"
                :key="vid.id"
                class="w-full shrink-0 snap-center rounded-3xl border border-[#d7dce4] bg-white p-3.5 sm:p-5 shadow-xl shadow-slate-200/60"
              >
                <!-- CABEÇALHO DO CARD -->
                <div class="mb-3 flex items-center justify-between gap-2 px-1">
                  <span class="inline-flex items-center gap-1.5 rounded-lg bg-primary/5 px-2.5 py-1 text-xs font-bold text-primary">
                    <CampanhaIcon name="verified" :size="14" class="text-secondary" />
                    {{ vid.badge }}
                  </span>
                  <span class="text-xs font-semibold text-slate-500">
                    {{ idx + 1 }} de {{ VIDEOS.length }}
                  </span>
                </div>

                <!-- PLAYER DE VÍDEO -->
                <div class="relative overflow-hidden rounded-2xl bg-black flex items-center justify-center">
                  <video
                    :src="vid.src"
                    controls
                    playsinline
                    preload="metadata"
                    class="max-h-[520px] w-full rounded-2xl object-contain bg-black shadow-inner"
                    @play="pauseOtherVideos($event.target as HTMLVideoElement)"
                  />
                </div>

                <!-- RODAPÉ DO CARD -->
                <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1">
                  <div>
                    <h3 class="font-heading text-lg font-bold text-primary sm:text-xl">
                      {{ vid.title }}
                    </h3>
                  </div>
                  <a
                    href="#orcamento"
                    class="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-secondary px-5 py-3 text-sm font-extrabold text-white shadow-md shadow-secondary/20 transition hover:bg-[#004f80]"
                    @click.prevent="scrollToQuiz"
                  >
                    Quero orçamento <CampanhaIcon name="arrow_upward" :size="16" />
                  </a>
                </div>
              </div>
            </div>

            <!-- CONTROLES MOBILE / INDICADORES -->
            <div class="mt-4 flex items-center justify-between sm:justify-center sm:gap-6 px-2">
              <button
                type="button"
                class="grid sm:hidden h-10 w-10 place-items-center rounded-full bg-white text-primary shadow-md border border-slate-200 transition active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                :disabled="activeVideoIndex === 0"
                aria-label="Vídeo anterior"
                @click="scrollVideoCarousel('prev')"
              >
                <CampanhaIcon name="chevron_left" :size="24" />
              </button>

              <!-- DOTS -->
              <div class="flex items-center gap-2">
                <button
                  v-for="(_, idx) in VIDEOS"
                  :key="idx"
                  type="button"
                  class="h-2.5 rounded-full transition-all duration-300"
                  :class="activeVideoIndex === idx ? 'w-8 bg-secondary' : 'w-2.5 bg-slate-300 hover:bg-slate-400'"
                  :aria-label="`Ir para o vídeo ${idx + 1}`"
                  @click="goToVideo(idx)"
                />
              </div>

              <button
                type="button"
                class="grid sm:hidden h-10 w-10 place-items-center rounded-full bg-white text-primary shadow-md border border-slate-200 transition active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                :disabled="activeVideoIndex === VIDEOS.length - 1"
                aria-label="Próximo vídeo"
                @click="scrollVideoCarousel('next')"
              >
                <CampanhaIcon name="chevron_right" :size="24" />
              </button>
            </div>

            <p class="mt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1">
              <CampanhaIcon name="swap_horiz" :size="16" class="text-secondary" />
              Passe para o lado para ver mais instalações
            </p>
          </div>
        </div>
      </section>

      <!-- POR QUE A GMK -->
      <section class="mx-auto max-w-6xl px-4 py-10 lg:py-14" aria-labelledby="gmk-why-title">
        <h2 id="gmk-why-title" class="text-center font-heading text-2xl font-extrabold sm:text-3xl">Por que escolher a GMK</h2>
        <div class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <div v-for="b in BENEFITS" :key="b.title" class="rounded-2xl border border-[#d7dce4] bg-white p-3.5 lg:p-5">
            <span class="grid h-10 w-10 place-items-center rounded-xl bg-primary text-secondary-container"><CampanhaIcon :name="b.icon" :size="22" /></span>
            <h3 class="mt-2.5 font-heading text-[15px] font-bold leading-tight lg:text-lg">{{ b.title }}</h3>
            <p class="mt-1 text-[13px] leading-snug text-slate-600 lg:text-sm">{{ b.text }}</p>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="bg-white" aria-labelledby="gmk-faq-title">
        <div class="mx-auto max-w-2xl px-4 py-10 lg:py-14">
          <h2 id="gmk-faq-title" class="text-center font-heading text-2xl font-extrabold sm:text-3xl">Perguntas frequentes</h2>
          <div class="mt-6 space-y-2.5">
            <details v-for="f in FAQ" :key="f.q" name="gmk-faq" class="group rounded-2xl border border-[#d7dce4] bg-[#faf8ff] open:bg-white open:shadow-sm">
              <summary class="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-left text-[15px] font-bold [&::-webkit-details-marker]:hidden">
                {{ f.q }}
                <CampanhaIcon name="expand_more" :size="24" class="transition-transform group-open:rotate-180" />
              </summary>
              <p class="px-4 pb-4 text-sm leading-relaxed text-slate-600">{{ f.a }}</p>
            </details>
          </div>
        </div>
      </section>

      <!-- CTA FINAL -->
      <section class="gmk-hero relative overflow-hidden text-white">
        <div class="relative z-10 mx-auto max-w-2xl px-4 py-12 text-center">
          <h2 class="font-heading text-2xl font-extrabold sm:text-3xl">Pronto para proteger sua casa?</h2>
          <p class="mx-auto mt-2 max-w-md text-sm text-white/80 sm:text-base">Peça seu orçamento com visita técnica gratuita e 2 anos de garantia.</p>
          <a href="#orcamento" class="mt-6 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-8 text-base font-extrabold text-primary shadow-lg transition hover:bg-[#f4f9ff]" @click.prevent="scrollToQuiz">
            Quero meu orçamento <CampanhaIcon name="arrow_upward" :size="20" />
          </a>
        </div>
      </section>
    </main>

    <footer class="bg-primary px-4 py-8 text-center text-sm text-white/70">
      <img :src="LOGO" alt="GMK" width="320" height="267" loading="lazy" class="mx-auto h-14 w-auto">
      <p class="mt-3 font-semibold text-white">GMK · Telas Mosquiteiras em Alumínio Sob Medida</p>
      <p class="mt-1">© {{ new Date().getFullYear() }} GMK. Todos os direitos reservados.</p>
      <div class="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/60">
        <NuxtLink to="/campanha/telas-mosquiteiras/politica-de-privacidade" class="underline underline-offset-4 hover:text-white transition-colors">
          Política de Privacidade
        </NuxtLink>
        <span aria-hidden="true">•</span>
        <NuxtLink to="/campanha/telas-mosquiteiras/termos-de-servico" class="underline underline-offset-4 hover:text-white transition-colors">
          Termos de Serviço
        </NuxtLink>
      </div>
    </footer>

    <!-- WHATSAPP FLUTUANTE -->
    <a
      :href="defaultWhatsappUrl"
      target="_blank"
      rel="noopener"
      aria-label="Falar com a GMK no WhatsApp"
      class="gmk-wa-float fixed right-4 z-50 hidden h-14 w-14 place-items-center rounded-full lg:grid bg-[#25D366] text-white shadow-xl shadow-black/25 transition hover:bg-[#1fb957] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
      @click.prevent="openWhatsApp('flutuante')"
    >
      <CampanhaWhatsappIcon :size="30" />
    </a>

    <!-- BARRA FIXA DE WHATSAPP (celular) -->
    <Transition name="gmk-bar">
      <div
        v-if="barVisible"
        class="gmk-bar fixed inset-x-0 bottom-0 z-50 border-t border-[#d7dce4] bg-white/95 px-4 pt-2 backdrop-blur lg:hidden"
      >
        <a
          :href="defaultWhatsappUrl"
          target="_blank"
          rel="noopener"
          class="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-[15px] font-extrabold text-white shadow-md shadow-[#25D366]/30 transition active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
          @click.prevent="openWhatsApp('barra-fixa')"
        >
          <CampanhaWhatsappIcon :size="22" /> Falar no WhatsApp · Visita grátis
        </a>
      </div>
    </Transition>

    <!-- MODAL: ATENDIMENTO WHATSAPP -->
    <Transition name="gmk-modal">
      <div
        v-if="wa.open"
        class="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
        @click.self="closeWa"
        @keydown.esc="closeWa"
      >
        <div role="dialog" aria-modal="true" aria-labelledby="gmk-wa-title" class="gmk-modal-card w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div class="flex items-center gap-3 bg-[#22346b] px-5 py-5 text-white">
            <span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#25D366]/20 text-[#25D366]"><CampanhaWhatsappIcon :size="28" /></span>
            <div class="min-w-0 flex-1">
              <h2 id="gmk-wa-title" class="font-heading text-lg font-extrabold leading-tight">Atendimento WhatsApp</h2>
              <p class="text-sm leading-tight text-white/75">Inicie sua conversa com nossa equipe técnica</p>
            </div>
            <button type="button" class="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-white/10" aria-label="Fechar" @click="closeWa">
              <CampanhaIcon name="close" :size="24" />
            </button>
          </div>

          <form class="space-y-4 p-5" novalidate @submit.prevent="submitWa">
            <div>
              <label for="gmk-wa-name" class="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-slate-700">Seu nome <span class="text-red-500">*</span></label>
              <input
                id="gmk-wa-name"
                ref="waNameInput"
                v-model="wa.name"
                type="text"
                maxlength="100"
                autocomplete="name"
                autocapitalize="words"
                enterkeyhint="next"
                placeholder="Como podemos te chamar?"
                class="h-14 w-full rounded-2xl border-2 bg-white px-4 text-base outline-none transition placeholder:text-slate-400 focus:border-[#22346b] focus:ring-4 focus:ring-[#22346b]/15"
                :class="wa.attempted && !waNameValid ? 'border-red-400' : 'border-[#d7dce4]'"
              >
              <p v-if="wa.attempted && !waNameValid" class="mt-1 text-sm font-medium text-red-600" role="alert">Informe seu nome.</p>
            </div>
            <div>
              <label for="gmk-wa-phone" class="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-slate-700">Seu WhatsApp <span class="text-red-500">*</span></label>
              <input
                id="gmk-wa-phone"
                :value="wa.phone"
                type="tel"
                inputmode="tel"
                maxlength="15"
                autocomplete="tel"
                enterkeyhint="send"
                placeholder="(11) 99999-9999"
                class="h-14 w-full rounded-2xl border-2 bg-white px-4 text-base outline-none transition placeholder:text-slate-400 focus:border-[#22346b] focus:ring-4 focus:ring-[#22346b]/15"
                :class="wa.attempted && !waPhoneValid ? 'border-red-400' : 'border-[#d7dce4]'"
                @input="onWaPhoneInput"
              >
              <p v-if="wa.attempted && !waPhoneValid" class="mt-1 text-sm font-medium text-red-600" role="alert">Informe DDD + número do WhatsApp.</p>
            </div>
            <input v-model="wa.hp" type="text" name="company-site-wa" tabindex="-1" autocomplete="off" aria-hidden="true" class="absolute -left-[9999px] h-0 w-0 opacity-0">

            <button
              type="submit"
              :disabled="wa.submitting"
              class="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-base font-extrabold text-white shadow-lg shadow-[#25D366]/30 transition hover:bg-[#1fb957] active:scale-[0.99] disabled:opacity-70"
            >
              <template v-if="wa.submitting">
                <span class="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Abrindo WhatsApp...
              </template>
              <template v-else>
                Continuar no WhatsApp <CampanhaIcon name="arrow_forward" :size="22" />
              </template>
            </button>
            <p class="text-center text-xs leading-snug text-slate-500">Seus dados serão utilizados apenas para atendimento do seu orçamento.</p>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.gmk-hero {
  background-color: #010133;
  background-image:
    radial-gradient(900px 420px at 90% -10%, rgba(69, 169, 253, 0.32), transparent 62%),
    linear-gradient(180deg, #010133 0%, #0b0e45 100%);
}
/* trama de tela mosquiteira (losangos metálicos) */
.gmk-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.09;
  background-image:
    linear-gradient(45deg, #c9ced6 1px, transparent 1px),
    linear-gradient(-45deg, #c9ced6 1px, transparent 1px);
  background-size: 16px 16px;
  -webkit-mask-image: linear-gradient(180deg, #000 0%, transparent 85%);
  mask-image: linear-gradient(180deg, #000 0%, transparent 85%);
}

.gmk-step-enter-active,
.gmk-step-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.gmk-step-enter-from { opacity: 0; transform: translateX(18px); }
.gmk-step-leave-to { opacity: 0; transform: translateX(-18px); }

.gmk-modal-enter-active,
.gmk-modal-leave-active { transition: opacity 0.2s ease; }
.gmk-modal-enter-active .gmk-modal-card,
.gmk-modal-leave-active .gmk-modal-card { transition: transform 0.2s ease; }
.gmk-modal-enter-from,
.gmk-modal-leave-to { opacity: 0; }
.gmk-modal-enter-from .gmk-modal-card { transform: translateY(16px) scale(0.98); }

.gmk-wa-float {
  bottom: max(1rem, env(safe-area-inset-bottom));
}
.gmk-wa-float::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: 9999px;
  background: #25d366;
  animation: gmk-pulse 2.6s ease-out infinite;
}
@keyframes gmk-pulse {
  0% { transform: scale(1); opacity: 0.45; }
  70%, 100% { transform: scale(1.6); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .gmk-wa-float::before { animation: none; opacity: 0; }
  .gmk-step-enter-active, .gmk-step-leave-active { transition: none; }
}
.gmk-snap { scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.gmk-snap::-webkit-scrollbar { display: none; }

.gmk-bar { padding-bottom: max(0.5rem, env(safe-area-inset-bottom)); }
.gmk-bar-enter-active,
.gmk-bar-leave-active { transition: transform 0.22s ease, opacity 0.22s ease; }
.gmk-bar-enter-from,
.gmk-bar-leave-to { transform: translateY(100%); opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .gmk-bar-enter-active, .gmk-bar-leave-active { transition: none; }
}
</style>
