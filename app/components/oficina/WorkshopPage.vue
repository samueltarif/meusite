<script setup lang="ts">
import { ref, computed } from 'vue'

const isModalOpen = ref(false)
const selectedService = ref('Revisão Preventiva & Óleo')

// Modal Form State
const quoteForm = ref({
  name: '',
  phone: '',
  carModel: '',
  service: 'Revisão Preventiva & Óleo',
  message: ''
})

const openQuoteModal = (serviceName?: string) => {
  if (serviceName) {
    quoteForm.value.service = serviceName
  }
  isModalOpen.value = true
}

const closeQuoteModal = () => {
  isModalOpen.value = false
}

const sendWhatsAppQuote = () => {
  const phone = '551142272079'
  const text = `Olá, Mecânica São Paulo!\n\nGostaria de solicitar um orçamento:\n• Nome: ${quoteForm.value.name || 'Não informado'}\n• Veículo: ${quoteForm.value.carModel || 'Não especificado'}\n• Serviço: ${quoteForm.value.service}\n• Mensagem: ${quoteForm.value.message || 'Sem observações adicionais.'}`
  const encoded = encodeURIComponent(text)
  window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank')
  isModalOpen.value = false
}

// Active mobile tab
const activeTab = ref('inicio')
const setTab = (tab: string, anchorId: string) => {
  activeTab.value = tab
  const el = document.getElementById(anchorId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

// Interactive maintenance diary items
interface MaintenanceItem {
  id: number
  date: string
  km: number
  service: string
}

const diaryDate = ref(new Date().toISOString().split('T')[0])
const diaryKm = ref<number | ''>('')
const diaryService = ref('')
const diaryError = ref('')

const diaryList = ref<MaintenanceItem[]>([
  { id: 1, date: '2026-08-10', km: 58400, service: 'Troca de óleo 5W30 sintético e filtro de óleo' },
  { id: 2, date: '2026-05-18', km: 52100, service: 'Substituição de pastilhas de freio dianteiras e sangria' }
])

const addDiaryEntry = () => {
  if (!diaryDate.value || !diaryKm.value || !diaryService.value.trim()) {
    diaryError.value = 'Preencha todos os campos do serviço.'
    return
  }
  diaryList.value.unshift({
    id: Date.now(),
    date: diaryDate.value,
    km: Number(diaryKm.value),
    service: diaryService.value.trim()
  })
  diaryService.value = ''
  diaryKm.value = ''
  diaryError.value = ''
}

const removeDiaryEntry = (id: number) => {
  diaryList.value = diaryList.value.filter(item => item.id !== id)
}
</script>

<template>
  <div class="workshop-root min-h-screen bg-[#faf9f5] font-['Plus_Jakarta_Sans',sans-serif] text-[#1b1c1a] antialiased selection:bg-[#ff884e] selection:text-[#351000]">
    <!-- Top Announcement Bar (DESKTOP) -->
    <div class="hidden md:block w-full bg-[#20252b] text-white border-b border-[#45474b]/30">
      <div class="max-w-[1280px] mx-auto px-6 h-10 flex items-center justify-between text-xs font-semibold">
        <div class="flex items-center gap-6">
          <a href="tel:1142272079" class="flex items-center gap-2 text-[#f2f1ed] hover:text-[#ffdbcc] transition-colors">
            <span class="material-symbols-outlined text-[16px] text-[#ff884e]">call</span>
            (11) 4227-2079
          </a>
          <span class="flex items-center gap-2 text-[#f2f1ed]">
            <span class="material-symbols-outlined text-[16px] text-[#ff884e]">location_on</span>
            Rua São Paulo, 1178 • São Caetano do Sul, SP
          </span>
        </div>
        <div class="flex items-center gap-4 text-[#878c93]">
          <span class="flex items-center gap-1.5 text-xs">
            <span class="material-symbols-outlined text-[15px]">schedule</span>
            Seg - Sex: 08:00 às 18:00
          </span>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar (DESKTOP) -->
    <header class="hidden md:block sticky top-0 z-40 w-full bg-[#faf9f5]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#c5c6cb]/30">
      <div class="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#inicio" class="flex items-center gap-3 group text-left transition-transform duration-300 hover:scale-[1.01]">
          <div class="w-10 h-10 rounded-lg bg-[#20252b] flex items-center justify-center text-white group-hover:bg-[#a04108] transition-colors duration-300 shadow-sm">
            <span class="material-symbols-outlined text-[24px] group-hover:rotate-45 transition-transform duration-500 ease-out">build_circle</span>
          </div>
          <div>
            <span class="block text-lg font-bold tracking-tight text-[#0b1015] leading-tight group-hover:text-[#a04108] transition-colors">MECÂNICA SÃO PAULO</span>
            <span class="block text-[11px] font-semibold tracking-wider uppercase text-[#45474b]">Tradição e Confiança desde 2002</span>
          </div>
        </a>

        <nav class="flex items-center gap-6 text-sm font-semibold">
          <a href="#inicio" class="py-1 text-[#0b1015] nav-link-hover">Início</a>
          <a href="#servicos" class="py-1 text-[#45474b] hover:text-[#0b1015] nav-link-hover transition-colors">Serviços</a>
          <a href="#avaliacoes" class="py-1 text-[#45474b] hover:text-[#0b1015] nav-link-hover transition-colors">Avaliações</a>
          <a href="#processo" class="py-1 text-[#45474b] hover:text-[#0b1015] nav-link-hover transition-colors">Como Funciona</a>
          <a href="#sobre" class="py-1 text-[#45474b] hover:text-[#0b1015] nav-link-hover transition-colors">Sobre</a>
          <a href="#diario" class="py-1 text-[#45474b] hover:text-[#0b1015] nav-link-hover transition-colors">Diário do Carro</a>
          <a href="#contato" class="py-1 text-[#45474b] hover:text-[#0b1015] nav-link-hover transition-colors">Contato</a>
        </nav>

        <div class="flex items-center gap-4">
          <button
            type="button"
            class="btn-interactive inline-flex items-center justify-center bg-[#a04108] hover:bg-[#863606] text-white text-sm font-bold px-5 py-3 rounded-lg shadow-sm hover:shadow-md hover:shadow-[#a04108]/20"
            @click="openQuoteModal()"
          >
            Solicitar orçamento
          </button>
          <a
            href="tel:1142272079"
            title="Ligue diretamente para a oficina"
            class="w-9 h-9 rounded-full bg-[#0b1015] hover:bg-[#a04108] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm"
          >
            <span class="material-symbols-outlined text-[18px]">call</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Header (MOBILE - STITCH SCREEN 114ff658406944fc988d2440557718a9) -->
    <header class="md:hidden fixed top-0 inset-x-0 z-50 bg-[#faf9f5]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div class="h-16 px-4 flex items-center justify-between gap-2">
        <div class="flex flex-col justify-center select-none">
          <span class="text-base text-[#0b1015] tracking-tight font-bold leading-none">Mecânica São Paulo</span>
          <span class="text-[11px] text-[#45474b] font-semibold mt-0.5 tracking-wider uppercase">São Caetano do Sul</span>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="h-10 px-3.5 rounded-lg bg-[#a04108] text-white text-xs font-bold flex items-center justify-center transition-transform active:scale-95 shadow-[0_2px_8px_rgba(160,65,8,0.25)]"
            @click="openQuoteModal()"
          >
            Orçamento
          </button>
          <a
            href="tel:1142272079"
            class="w-8 h-8 rounded-full bg-[#0b1015] flex items-center justify-center shrink-0 text-white"
          >
            <span class="material-symbols-outlined text-[18px]">call</span>
          </a>
        </div>
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <main class="w-full pt-16 md:pt-0 pb-24 md:pb-0">
      <!-- ==========================================
           1. HERO SECTION (DESKTOP & MOBILE INTEGRATED)
           ========================================== -->
      <section id="inicio" class="relative w-full overflow-hidden bg-white border-b border-[#efeeea]">
        <!-- MOBILE HERO (Stitch Mobile) -->
        <div class="md:hidden px-4 pt-4 pb-6 flex flex-col gap-4">
          <!-- Visual Showcase Card -->
          <div class="relative w-full rounded-xl overflow-hidden bg-[#20252b] shadow-md">
            <div class="relative h-60 w-full overflow-hidden">
              <img
                alt="Mustang clássico vermelho sob cuidados na oficina Mecânica São Paulo"
                class="w-full h-full object-cover"
                src="/images/campaign/oficina/hero-mobile.jpg"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-[#0b1015]/95 via-[#0b1015]/40 to-transparent"></div>
              <div class="absolute top-3 left-3 bg-[#a04108]/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span class="w-2 h-2 rounded-full bg-[#ffdbcc] animate-pulse"></span>
                <span class="text-[11px] text-white uppercase font-bold tracking-wider">Atendimento Especializado</span>
              </div>
              <div class="absolute bottom-3 left-3 right-3 text-white">
                <span class="text-[11px] text-[#ffdbcc] uppercase tracking-wider font-semibold block">Oficina Tradicional</span>
                <p class="text-base font-bold leading-snug">Cuidado minucioso do clássico ao moderno</p>
              </div>
            </div>
          </div>

          <!-- Hero Content -->
          <div class="flex flex-col gap-2">
            <h1 class="text-2xl text-[#1b1c1a] font-extrabold tracking-tight leading-tight">
              Seu carro em boas mãos, com atendimento em que você pode confiar
            </h1>
            <p class="text-sm text-[#45474b] leading-relaxed">
              Manutenção automotiva transparente e técnica em São Caetano do Sul. Diagnóstico claro e respeito ao seu veículo.
            </p>
          </div>

          <!-- Hero CTAs -->
          <div class="flex flex-col gap-2.5 pt-1">
            <a
              class="h-12 w-full rounded-lg bg-[#a04108] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform"
              href="tel:1142272079"
            >
              <span class="material-symbols-outlined text-[20px]">phone_in_talk</span>
              <span>Falar com a oficina</span>
            </a>
            <a
              class="h-12 w-full rounded-lg bg-[#efeeea] text-[#1b1c1a] text-sm font-bold flex items-center justify-center gap-2 active:bg-[#e9e8e4] transition-colors"
              href="#servicos"
            >
              <span class="material-symbols-outlined text-[20px]">build_circle</span>
              <span>Ver serviços</span>
            </a>
          </div>
        </div>

        <!-- DESKTOP HERO (Stitch Desktop) -->
        <div class="hidden md:block max-w-[1280px] mx-auto px-6 py-16 lg:py-20">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <!-- Left Column: Copy & CTAs -->
            <div class="lg:col-span-6 flex flex-col items-start gap-5 animate-fade-in-up">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#efeeea] text-[#45474b] text-xs font-bold border border-[#c5c6cb]/40 hover:border-[#a04108]/40 transition-colors">
                <span class="w-2 h-2 rounded-full bg-[#a04108] animate-pulse"></span>
                <span>OFICINA ESPECIALIZADA • SÃO CAETANO DO SUL</span>
              </div>
              <h1 class="text-4xl lg:text-5xl font-extrabold text-[#0b1015] tracking-tight leading-[1.14]">
                Seu carro em boas mãos, com atendimento em que você pode confiar
              </h1>
              <p class="text-lg text-[#45474b] leading-relaxed max-w-xl">
                Manutenção automotiva de precisão em São Caetano do Sul. Foco na transparência, serviço bem explicado e cuidado rigoroso com cada veículo.
              </p>

              <div class="flex flex-wrap items-center gap-4 pt-2">
                <a
                  class="btn-interactive inline-flex items-center gap-2 bg-[#a04108] hover:bg-[#863606] text-white text-sm font-bold px-6 py-3.5 rounded-lg shadow-sm hover:shadow-lg hover:shadow-[#a04108]/25"
                  href="tel:1142272079"
                >
                  <span class="material-symbols-outlined text-[20px]">call</span>
                  Falar com a oficina
                </a>
                <a
                  class="btn-interactive inline-flex items-center gap-2 bg-[#efeeea] hover:bg-[#e9e8e4] text-[#0b1015] text-sm font-bold px-6 py-3.5 rounded-lg border border-[#c5c6cb]/50 hover:border-[#75777b]/50 hover:shadow-md transition-all"
                  href="#servicos"
                >
                  <span class="material-symbols-outlined text-[20px]">build</span>
                  Ver serviços
                </a>
              </div>

              <!-- Micro reassurance badges -->
              <div class="pt-4 grid grid-cols-3 gap-3 w-full">
                <div class="p-3 bg-[#f5f4f0] rounded-lg flex items-center gap-2 border border-transparent hover:border-[#c5c6cb]/40 transition-all">
                  <span class="material-symbols-outlined text-[#a04108] text-[20px]">verified</span>
                  <span class="text-xs font-semibold text-[#1b1c1a]">Peças Genuínas</span>
                </div>
                <div class="p-3 bg-[#f5f4f0] rounded-lg flex items-center gap-2 border border-transparent hover:border-[#c5c6cb]/40 transition-all">
                  <span class="material-symbols-outlined text-[#a04108] text-[20px]">fact_check</span>
                  <span class="text-xs font-semibold text-[#1b1c1a]">Sem Surpresas</span>
                </div>
                <div class="p-3 bg-[#f5f4f0] rounded-lg flex items-center gap-2 border border-transparent hover:border-[#c5c6cb]/40 transition-all">
                  <span class="material-symbols-outlined text-[#a04108] text-[20px]">history</span>
                  <span class="text-xs font-semibold text-[#1b1c1a]">Desde 2002</span>
                </div>
              </div>
            </div>

            <!-- Right Column: Technical Imagery Showcase with Real Project Photo -->
            <div class="lg:col-span-6 relative flex flex-col gap-4 animate-fade-in delay-200">
              <!-- Main Hero Image Frame: Red Mustang in Workshop -->
              <div class="relative rounded-xl overflow-hidden shadow-xl bg-[#20252b] aspect-[16/10] group transition-all duration-500 hover:shadow-2xl">
                <img
                  alt="Clássico Ford Mustang em manutenção na oficina Mecânica São Paulo"
                  class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  src="/images/campaign/oficina/hero-desktop.jpg"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-[#0b1015]/85 via-[#0b1015]/20 to-transparent transition-opacity duration-300 group-hover:opacity-90"></div>
                <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-[#ff884e] text-[22px]">engineering</span>
                    <div>
                      <span class="block text-sm font-bold tracking-tight">Rigor Mecânico &amp; Restauração</span>
                      <span class="block text-xs text-[#f2f1ed]/80">Ford Mustang V8 Clássico na bancada</span>
                    </div>
                  </div>
                  <span class="px-3 py-1 rounded-full bg-[#0b1015]/80 backdrop-blur-sm text-[#ff884e] text-xs font-semibold border border-[#ff884e]/30">Inspeção Concluída</span>
                </div>
              </div>

              <!-- Overlapping Precision Motor Detail Badge with smooth float animation -->
              <div class="relative lg:-mt-10 lg:-ml-6 self-end lg:self-start w-11/12 sm:w-80 bg-white p-3 rounded-xl shadow-xl flex items-center gap-4 border border-[#c5c6cb]/40 hover:border-[#a04108]/50 transition-all duration-300 hover:shadow-2xl animate-float">
                <div class="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#efeeea]">
                  <img
                    alt="Detalhe de bloco V8 cromado com filtro de ar e cabos de ignição"
                    class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    src="/images/campaign/oficina/motor-v8-detail.jpg"
                  >
                </div>
                <div class="flex flex-col">
                  <span class="text-[11px] text-[#a04108] uppercase font-bold tracking-wider">Ajuste de Alto Nível</span>
                  <span class="text-base text-[#0b1015] font-bold">Motor &amp; Injeção V8</span>
                  <span class="text-xs text-[#45474b]">Regulagem milimétrica</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==========================================
           2. FAIXA DE CONFIANÇA / PILARES
           ========================================== -->
      <section class="w-full bg-[#f5f4f0] py-10 md:py-16 border-b border-[#efeeea]">
        <div class="max-w-[1280px] mx-auto px-4 md:px-6">
          <div class="text-center max-w-2xl mx-auto mb-8 md:mb-12">
            <span class="text-xs uppercase tracking-widest text-[#a04108] font-bold">Nossos Pilares</span>
            <h2 class="text-2xl md:text-3xl font-extrabold text-[#0b1015] tracking-tight mt-1.5">
              Qualidades reconhecidas e comentadas por quem confia seu carro à nossa equipe
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            <!-- Pilar 1 -->
            <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-transparent hover:border-[#c5c6cb]/50 flex flex-col items-start gap-3 group">
              <div class="w-12 h-12 rounded-lg bg-[#efeeea] flex items-center justify-center text-[#a04108] group-hover:bg-[#a04108] group-hover:text-white transition-all duration-300 shadow-sm">
                <span class="material-symbols-outlined text-[28px] transition-transform duration-300 group-hover:scale-110">handshake</span>
              </div>
              <h3 class="text-lg text-[#0b1015] font-bold group-hover:text-[#a04108] transition-colors">Atendimento Transparente</h3>
              <p class="text-sm text-[#45474b] leading-relaxed">
                Comunicação clara e respeito ao cliente em cada etapa. Você acompanha fotos, peças substituídas e o real estado do seu automóvel.
              </p>
              <div class="mt-auto pt-2 flex items-center gap-1.5 text-xs text-[#a04108] font-semibold group-hover:translate-x-1 transition-transform">
                <span class="material-symbols-outlined text-[16px]">check</span> Sem cobranças ocultas
              </div>
            </div>

            <!-- Pilar 2 -->
            <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-transparent hover:border-[#c5c6cb]/50 flex flex-col items-start gap-3 group">
              <div class="w-12 h-12 rounded-lg bg-[#efeeea] flex items-center justify-center text-[#a04108] group-hover:bg-[#a04108] group-hover:text-white transition-all duration-300 shadow-sm">
                <span class="material-symbols-outlined text-[28px] transition-transform duration-300 group-hover:scale-110">record_voice_over</span>
              </div>
              <h3 class="text-lg text-[#0b1015] font-bold group-hover:text-[#a04108] transition-colors">Serviço Bem Explicado</h3>
              <p class="text-sm text-[#45474b] leading-relaxed">
                Orientação técnica compreensível, sem termos desnecessários. Mostramos por que a peça precisa ser trocada e o que você pode esperar.
              </p>
              <div class="mt-auto pt-2 flex items-center gap-1.5 text-xs text-[#a04108] font-semibold group-hover:translate-x-1 transition-transform">
                <span class="material-symbols-outlined text-[16px]">check</span> Diagnóstico demonstrativo
              </div>
            </div>

            <!-- Pilar 3 -->
            <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-transparent hover:border-[#c5c6cb]/50 flex flex-col items-start gap-3 group">
              <div class="w-12 h-12 rounded-lg bg-[#efeeea] flex items-center justify-center text-[#a04108] group-hover:bg-[#a04108] group-hover:text-white transition-all duration-300 shadow-sm">
                <span class="material-symbols-outlined text-[28px] transition-transform duration-300 group-hover:scale-110">price_check</span>
              </div>
              <h3 class="text-lg text-[#0b1015] font-bold group-hover:text-[#a04108] transition-colors">Preço Justo</h3>
              <p class="text-sm text-[#45474b] leading-relaxed">
                Relação honesta e orçamento previamente aprovado antes de qualquer intervenção física no motor, freios ou suspensão do veículo.
              </p>
              <div class="mt-auto pt-2 flex items-center gap-1.5 text-xs text-[#a04108] font-semibold group-hover:translate-x-1 transition-transform">
                <span class="material-symbols-outlined text-[16px]">check</span> Aprovação prévia obrigatória
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==========================================
           3. SEÇÃO SERVIÇOS ESPECIALIZADOS
           ========================================== -->
      <section id="servicos" class="w-full bg-[#faf9f5] py-12 md:py-20 border-b border-[#efeeea]">
        <div class="max-w-[1280px] mx-auto px-4 md:px-6">
          <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
            <div>
              <span class="text-xs uppercase tracking-widest text-[#a04108] font-bold">Competência Técnica</span>
              <h2 class="text-2xl md:text-3xl font-extrabold text-[#0b1015] tracking-tight mt-1">Serviços Especializados</h2>
              <p class="text-sm md:text-base text-[#45474b] max-w-xl mt-1 leading-relaxed">
                Da manutenção preventiva aos diagnósticos eletrônicos e mecânica pesada de motores clássicos e modernos.
              </p>
            </div>
            <button
              type="button"
              class="inline-flex items-center gap-2 text-[#a04108] hover:text-[#863606] text-sm font-bold group transition-colors self-start md:self-auto"
              @click="openQuoteModal()"
            >
              <span>Consultar serviço para meu carro</span>
              <span class="material-symbols-outlined text-[18px] group-hover:translate-x-1.5 transition-transform">arrow_forward</span>
            </button>
          </div>

          <!-- Services Grid (Responsive 4 cards) -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Servico 1: Revisão -->
            <div
              class="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-transparent hover:border-[#c5c6cb]/60 flex flex-col group cursor-pointer"
              @click="openQuoteModal('Revisão & Manutenção Periódica')"
            >
              <div class="w-12 h-12 rounded-lg bg-[#efeeea] flex items-center justify-center text-[#0b1015] group-hover:bg-[#a04108] group-hover:text-white transition-all duration-300 mb-4 shadow-sm">
                <span class="material-symbols-outlined text-[28px] transition-transform duration-300 group-hover:rotate-12">oil_barrel</span>
              </div>
              <span class="text-[11px] text-[#a04108] uppercase font-bold tracking-wider mb-1">Rotina &amp; Proteção</span>
              <h3 class="text-lg font-bold text-[#0b1015] mb-2 group-hover:text-[#a04108] transition-colors">Revisão &amp; Manutenção Periódica</h3>
              <p class="text-xs text-[#45474b] leading-relaxed mb-4 flex-1">
                Troca de óleo nos padrões de viscosidade exigidos pela montadora, filtros (ar, óleo, combustível e cabine), velas de ignição e fluidos gerais.
              </p>
              <div class="p-2.5 bg-[#f5f4f0] rounded-lg flex items-center justify-between text-xs text-[#45474b] group-hover:bg-[#efeeea] transition-colors">
                <span>Checagem de 32 itens</span>
                <span class="font-bold text-[#0b1015]">Preventiva</span>
              </div>
            </div>

            <!-- Servico 2: Motor e Injeção (Featured Card) -->
            <div
              class="bg-[#20252b] text-white p-6 rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative overflow-hidden group border border-[#45474b]/30 hover:border-[#ff884e]/50 cursor-pointer"
              @click="openQuoteModal('Motor & Injeção Eletrônica')"
            >
              <div class="absolute inset-0 bg-gradient-to-tr from-[#a04108]/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div class="w-full h-32 rounded-lg overflow-hidden mb-4 bg-[#efeeea] relative">
                <img
                  alt="Motor clássico com injeção e arrefecimento impecáveis"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  src="/images/campaign/oficina/servico-motor-desktop.jpg"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-[#20252b]/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity"></div>
              </div>
              <span class="text-[11px] text-[#ff884e] uppercase font-bold tracking-wider mb-1">Diagnóstico &amp; Força</span>
              <h3 class="text-lg font-bold text-white mb-2 group-hover:text-[#ffdbcc] transition-colors">Motor e Injeção Eletrônica</h3>
              <p class="text-xs text-[#878c93] leading-relaxed mb-4 flex-1">
                Scanner avançado para injeção direta e multiponto, retífica de cabeçote, bicos injetores, correia dentada e calibração fina de motores nacionais e importados.
              </p>
              <div class="p-2.5 bg-[#1b262e] rounded-lg flex items-center justify-between text-xs text-[#f2f1ed] border border-[#45474b]/40 group-hover:border-[#ff884e]/40 transition-colors">
                <span>Varredura Eletrônica</span>
                <span class="font-bold text-[#ff884e]">Alta Precisão</span>
              </div>
            </div>

            <!-- Servico 3: Câmbio Automático -->
            <div
              class="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-transparent hover:border-[#c5c6cb]/60 flex flex-col group cursor-pointer"
              @click="openQuoteModal('Câmbio Automático e Transmissão')"
            >
              <div class="w-12 h-12 rounded-lg bg-[#efeeea] flex items-center justify-center text-[#0b1015] group-hover:bg-[#a04108] group-hover:text-white transition-all duration-300 mb-4 shadow-sm">
                <span class="material-symbols-outlined text-[28px] transition-transform duration-300 group-hover:rotate-45">tune</span>
              </div>
              <span class="text-[11px] text-[#a04108] uppercase font-bold tracking-wider mb-1">Transmissão</span>
              <h3 class="text-lg font-bold text-[#0b1015] mb-2 group-hover:text-[#a04108] transition-colors">Câmbio Automático</h3>
              <p class="text-xs text-[#45474b] leading-relaxed mb-4 flex-1">
                Troca do fluido por diálise com máquina homologada, limpeza de corpo de válvulas, filtros internos e reprogramação de parâmetros de engate.
              </p>
              <div class="p-2.5 bg-[#f5f4f0] rounded-lg flex items-center justify-between text-xs text-[#45474b] group-hover:bg-[#efeeea] transition-colors">
                <span>Máquina de Diálise</span>
                <span class="font-bold text-[#0b1015]">Fluido Homologado</span>
              </div>
            </div>

            <!-- Servico 4: Freios e Suspensão -->
            <div
              class="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-transparent hover:border-[#c5c6cb]/60 flex flex-col group cursor-pointer"
              @click="openQuoteModal('Freios, Suspensão & Direção')"
            >
              <div class="w-12 h-12 rounded-lg bg-[#efeeea] flex items-center justify-center text-[#0b1015] group-hover:bg-[#a04108] group-hover:text-white transition-all duration-300 mb-4 shadow-sm">
                <span class="material-symbols-outlined text-[28px] transition-transform duration-300 group-hover:scale-110">adjust</span>
              </div>
              <span class="text-[11px] text-[#a04108] uppercase font-bold tracking-wider mb-1">Estabilidade &amp; Parada</span>
              <h3 class="text-lg font-bold text-[#0b1015] mb-2 group-hover:text-[#a04108] transition-colors">Freios, Suspensão &amp; Direção</h3>
              <p class="text-xs text-[#45474b] leading-relaxed mb-4 flex-1">
                Discos, pastilhas, fluido de freio DOT 4/5.1, amortecedores, bandejas, buchas de suspensão e alinhamento de direção hidráulica ou elétrica.
              </p>
              <div class="p-2.5 bg-[#f5f4f0] rounded-lg flex items-center justify-between text-xs text-[#45474b] group-hover:bg-[#efeeea] transition-colors">
                <span>Segurança Total</span>
                <span class="font-bold text-[#0b1015]">Garantia Técnica</span>
              </div>
            </div>
          </div>

          <!-- Scope note -->
          <div class="mt-8 p-4 bg-[#efeeea] rounded-xl flex items-center justify-between flex-wrap gap-3 text-xs md:text-sm text-[#45474b] border border-[#c5c6cb]/40">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[#a04108] text-[20px]">info</span>
              <span>Consulte a oficina para confirmar o escopo e disponibilidade técnica para seu modelo específico.</span>
            </div>
            <a class="font-bold text-[#a04108] hover:underline" href="tel:1142272079">Consultar modelo via (11) 4227-2079 ↗</a>
          </div>
        </div>
      </section>

      <!-- ==========================================
           4. SEÇÃO AVALIAÇÕES GOOGLE
           ========================================== -->
      <section id="avaliacoes" class="w-full bg-[#f5f4f0] py-12 md:py-20 border-b border-[#efeeea]">
        <div class="max-w-[1280px] mx-auto px-4 md:px-6">
          <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
            <div>
              <div class="flex items-center gap-1.5 text-[#a04108] text-xs font-bold mb-1">
                <span class="material-symbols-outlined text-[18px]">star</span>
                <span>RECONHECIMENTO EM SÃO CAETANO</span>
              </div>
              <h2 class="text-2xl md:text-3xl font-extrabold text-[#0b1015] tracking-tight">
                Uma oficina recomendada por quem já trouxe o carro
              </h2>
            </div>
            <div class="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-[#c5c6cb]/40 self-start md:self-auto">
              <div class="text-right">
                <div class="flex items-center gap-0.5 text-[#ff884e]">
                  <span v-for="s in 5" :key="s" class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
                </div>
                <span class="text-xs text-[#45474b] font-semibold">Classificação 4.9 estrelas</span>
              </div>
              <div class="w-9 h-9 rounded-full bg-[#efeeea] flex items-center justify-center font-bold text-[#0b1015] shadow-inner">
                G
              </div>
            </div>
          </div>

          <!-- Testimonial Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <!-- Depoimento 1 -->
            <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-[#c5c6cb]/40 flex flex-col justify-between group">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex text-[#ff884e]">
                    <span v-for="s in 5" :key="s" class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">star</span>
                  </div>
                  <span class="text-xs text-[#45474b]">Avaliação Google</span>
                </div>
                <p class="text-sm text-[#1b1c1a] italic leading-relaxed">
                  "Levo meus carros na Mecânica São Paulo há anos. A clareza no orçamento é o grande diferencial: eles te chamam, mostram a folga na peça e só trocam o que realmente precisa. Honestidade rara."
                </p>
              </div>
              <div class="pt-4 flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#efeeea] group-hover:bg-[#a04108] group-hover:text-white flex items-center justify-center font-bold text-[#0b1015] transition-colors shadow-sm">
                  RC
                </div>
                <div>
                  <span class="block text-sm font-bold text-[#0b1015]">Rodrigo Camargo</span>
                  <span class="block text-xs text-[#45474b]">Cliente há 6 anos • Honda Civic</span>
                </div>
              </div>
            </div>

            <!-- Depoimento 2 -->
            <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-[#c5c6cb]/40 flex flex-col justify-between group">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex text-[#ff884e]">
                    <span v-for="s in 5" :key="s" class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">star</span>
                  </div>
                  <span class="text-xs text-[#45474b]">Avaliação Google</span>
                </div>
                <p class="text-sm text-[#1b1c1a] italic leading-relaxed">
                  "Fiz a revisão do câmbio automático e suspensão. Trabalho impecável, carro devolvido no prazo prometido e extremamente limpo. Não troco por nenhuma autorizada da região."
                </p>
              </div>
              <div class="pt-4 flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#efeeea] group-hover:bg-[#a04108] group-hover:text-white flex items-center justify-center font-bold text-[#0b1015] transition-colors shadow-sm">
                  ML
                </div>
                <div>
                  <span class="block text-sm font-bold text-[#0b1015]">Marcos Lacerda</span>
                  <span class="block text-xs text-[#45474b]">Morador de São Caetano • Jeep Compass</span>
                </div>
              </div>
            </div>

            <!-- Depoimento 3 -->
            <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-[#c5c6cb]/40 flex flex-col justify-between group">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex text-[#ff884e]">
                    <span v-for="s in 5" :key="s" class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">star</span>
                  </div>
                  <span class="text-xs text-[#45474b]">Avaliação Google</span>
                </div>
                <p class="text-sm text-[#1b1c1a] italic leading-relaxed">
                  "Resolveram uma falha intermitente na injeção que outras duas oficinas não conseguiram achar. A equipe explicou detalhadamente o diagnóstico. Confiança total na Mecânica São Paulo."
                </p>
              </div>
              <div class="pt-4 flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#efeeea] group-hover:bg-[#a04108] group-hover:text-white flex items-center justify-center font-bold text-[#0b1015] transition-colors shadow-sm">
                  FS
                </div>
                <div>
                  <span class="block text-sm font-bold text-[#0b1015]">Fernanda Silveira</span>
                  <span class="block text-xs text-[#45474b]">Bairro Cerâmica • VW T-Cross</span>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center">
            <a
              class="btn-interactive inline-flex items-center gap-2 bg-white hover:bg-[#efeeea] text-[#0b1015] text-xs md:text-sm font-bold px-6 py-3 rounded-lg shadow-sm border border-[#c5c6cb]/50"
              href="https://www.google.com/maps"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span class="material-symbols-outlined text-[20px] text-[#a04108]">reviews</span>
              Acesse as avaliações no Google da Mecânica São Paulo ↗
            </a>
          </div>
        </div>
      </section>

      <!-- ==========================================
           5. COMO FUNCIONA NOSSO ATENDIMENTO
           ========================================== -->
      <section id="processo" class="w-full bg-white py-12 md:py-20 border-b border-[#efeeea]">
        <div class="max-w-[1280px] mx-auto px-4 md:px-6">
          <div class="text-center max-w-2xl mx-auto mb-10">
            <span class="text-xs uppercase tracking-widest text-[#a04108] font-bold">Processo Sem Mistério</span>
            <h2 class="text-2xl md:text-3xl font-extrabold text-[#0b1015] tracking-tight mt-1">
              Como Funciona Nosso Atendimento
            </h2>
            <p class="text-sm md:text-base text-[#45474b] mt-2">
              Quatro passos simples, organizados e transparentes do momento em que você entra em contato até a entrega das chaves.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Step 1 -->
            <div class="bg-[#f5f4f0] p-6 rounded-xl flex flex-col group hover:bg-[#efeeea] hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 border border-transparent hover:border-[#c5c6cb]/40">
              <div class="w-10 h-10 rounded-full bg-[#0b1015] text-white group-hover:bg-[#a04108] flex items-center justify-center font-bold text-base mb-4 shadow-sm transition-all duration-300 group-hover:scale-110">
                1
              </div>
              <h3 class="text-base font-bold text-[#0b1015] mb-2 group-hover:text-[#a04108] transition-colors">Contato inicial &amp; relato</h3>
              <p class="text-xs text-[#45474b] leading-relaxed">
                Você nos liga pelo telefone ou vem até a oficina para relatar o sintoma, barulho ou agendar a revisão preventiva recomendada.
              </p>
              <div class="mt-4 pt-2 flex items-center gap-1.5 text-xs text-[#a04108] font-semibold group-hover:translate-x-1 transition-transform">
                <span class="material-symbols-outlined text-[16px]">call</span> Triagem imediata
              </div>
            </div>

            <!-- Step 2 -->
            <div class="bg-[#f5f4f0] p-6 rounded-xl flex flex-col group hover:bg-[#efeeea] hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 border border-transparent hover:border-[#c5c6cb]/40">
              <div class="w-10 h-10 rounded-full bg-[#0b1015] text-white group-hover:bg-[#a04108] flex items-center justify-center font-bold text-base mb-4 shadow-sm transition-all duration-300 group-hover:scale-110">
                2
              </div>
              <h3 class="text-base font-bold text-[#0b1015] mb-2 group-hover:text-[#a04108] transition-colors">Inspeção detalhada</h3>
              <p class="text-xs text-[#45474b] leading-relaxed">
                O carro vai para o elevador para análise minuciosa: scanner eletrônico, testes de folga, checagem visual e medição de componentes.
              </p>
              <div class="mt-4 pt-2 flex items-center gap-1.5 text-xs text-[#a04108] font-semibold group-hover:translate-x-1 transition-transform">
                <span class="material-symbols-outlined text-[16px]">search</span> Testes no elevador
              </div>
            </div>

            <!-- Step 3 -->
            <div class="bg-[#f5f4f0] p-6 rounded-xl flex flex-col group hover:bg-[#efeeea] hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 border border-transparent hover:border-[#a04108]/30">
              <div class="w-10 h-10 rounded-full bg-[#a04108] text-white flex items-center justify-center font-bold text-base mb-4 shadow-sm transition-all duration-300 group-hover:scale-110">
                3
              </div>
              <h3 class="text-base font-bold text-[#0b1015] mb-2 group-hover:text-[#a04108] transition-colors">Explicação &amp; orçamento</h3>
              <p class="text-xs text-[#45474b] leading-relaxed">
                Apresentamos exatamente o que precisa ser feito, quais peças serão aplicadas e os custos. Nenhuma porca é solta sem seu aval prévio.
              </p>
              <div class="mt-4 pt-2 flex items-center gap-1.5 text-xs text-[#a04108] font-semibold group-hover:translate-x-1 transition-transform">
                <span class="material-symbols-outlined text-[16px]">check_circle</span> Aprovação do cliente
              </div>
            </div>

            <!-- Step 4 -->
            <div class="bg-[#f5f4f0] p-6 rounded-xl flex flex-col group hover:bg-[#efeeea] hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 border border-transparent hover:border-[#c5c6cb]/40">
              <div class="w-10 h-10 rounded-full bg-[#0b1015] text-white group-hover:bg-[#a04108] flex items-center justify-center font-bold text-base mb-4 shadow-sm transition-all duration-300 group-hover:scale-110">
                4
              </div>
              <h3 class="text-base font-bold text-[#0b1015] mb-2 group-hover:text-[#a04108] transition-colors">Execução &amp; entrega</h3>
              <p class="text-xs text-[#45474b] leading-relaxed">
                Serviço técnico executado com ferramentas calibradas, teste de rodagem final, apresentação das peças substituídas e garantia formal.
              </p>
              <div class="mt-4 pt-2 flex items-center gap-1.5 text-xs text-[#a04108] font-semibold group-hover:translate-x-1 transition-transform">
                <span class="material-symbols-outlined text-[16px]">key</span> Entrega com garantia
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==========================================
           6. SOBRE A MECÂNICA SÃO PAULO
           ========================================== -->
      <section id="sobre" class="w-full bg-[#faf9f5] py-12 md:py-20 border-b border-[#efeeea]">
        <div class="max-w-[1280px] mx-auto px-4 md:px-6">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <!-- Left Column: Story and Values -->
            <div class="lg:col-span-6 flex flex-col items-start gap-4">
              <span class="text-xs uppercase tracking-widest text-[#a04108] font-bold">Nossa Trajetória</span>
              <h2 class="text-2xl md:text-3xl font-extrabold text-[#0b1015] tracking-tight">
                Mais de duas décadas cuidando dos motoristas do Grande ABC
              </h2>
              <p class="text-sm md:text-base text-[#45474b] leading-relaxed">
                Fundada com a proposta de resgatar a figura da oficina de confiança familiar, a <strong>Mecânica São Paulo</strong> une o conhecimento prático da engenharia mecânica tradicional com os equipamentos de ponta necessários para a frota moderna.
              </p>
              <p class="text-sm md:text-base text-[#45474b] leading-relaxed">
                Nossa bancada atende com a mesma reverência desde um clássico muscle car nacional ou importado até os veículos utilitários de trabalho diário e o carro da família. Aqui, cada motor é tratado com zelo cirúrgico e transparência irrestrita.
              </p>

              <!-- Core metrics strip -->
              <div class="grid grid-cols-3 gap-3 w-full py-2">
                <div class="p-4 bg-white rounded-xl text-left border border-[#c5c6cb]/30 shadow-sm hover:border-[#a04108]/40 transition-all">
                  <span class="block text-2xl md:text-3xl font-extrabold text-[#0b1015]">+20</span>
                  <span class="text-xs text-[#45474b] font-medium">Anos no mercado</span>
                </div>
                <div class="p-4 bg-white rounded-xl text-left border border-[#c5c6cb]/30 shadow-sm hover:border-[#a04108]/40 transition-all">
                  <span class="block text-2xl md:text-3xl font-extrabold text-[#0b1015]">100%</span>
                  <span class="text-xs text-[#45474b] font-medium">Garantia técnica</span>
                </div>
                <div class="p-4 bg-white rounded-xl text-left border border-[#c5c6cb]/30 shadow-sm hover:border-[#a04108]/40 transition-all">
                  <span class="block text-2xl md:text-3xl font-extrabold text-[#0b1015]">4.9</span>
                  <span class="text-xs text-[#45474b] font-medium">Média de satisfação</span>
                </div>
              </div>
            </div>

            <!-- Right Column: Visual Composition with 2 Workshop Photos -->
            <div class="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Photo 1: Hood open -->
              <div class="rounded-xl overflow-hidden shadow-md bg-[#20252b] aspect-[4/5] relative group transition-all duration-500 hover:shadow-2xl">
                <img
                  alt="Vista frontal do Ford Mustang clássico vermelho com capô aberto na oficina Mecânica São Paulo"
                  class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  src="/images/campaign/oficina/sobre-desktop-1.jpg"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-[#0b1015]/80 via-transparent to-transparent opacity-90 group-hover:opacity-75 transition-opacity"></div>
                <div class="absolute bottom-3 left-3 right-3 text-white text-xs">
                  <span class="block font-bold">Precisão no Ajuste</span>
                  <span class="text-[#f2f1ed]/80">Sistemas de arrefecimento e carburação</span>
                </div>
              </div>

              <!-- Photo 2: Side profile in bay -->
              <div class="rounded-xl overflow-hidden shadow-md bg-[#20252b] aspect-[4/5] relative group sm:translate-y-6 transition-all duration-500 hover:shadow-2xl">
                <img
                  alt="Perfil lateral do carro clássico na baia de manutenção com ordem técnica"
                  class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  src="/images/campaign/oficina/sobre-desktop-2.jpg"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-[#0b1015]/80 via-transparent to-transparent opacity-90 group-hover:opacity-75 transition-opacity"></div>
                <div class="absolute bottom-3 left-3 right-3 text-white text-xs">
                  <span class="block font-bold">Oficina Organizada</span>
                  <span class="text-[#f2f1ed]/80">Espaço dedicado e cuidado com a lataria</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==========================================
           7. DIÁRIO DO CARRO / HISTÓRICO DE MANUTENÇÃO (INTERATIVO)
           ========================================== -->
      <section id="diario" class="w-full bg-[#20252b] text-white py-12 md:py-20 border-b border-[#45474b]/30">
        <div class="max-w-[1280px] mx-auto px-4 md:px-6">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div class="lg:col-span-5">
              <span class="text-xs uppercase tracking-widest text-[#ff884e] font-bold">Ferramenta Interativa</span>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight mt-1.5">
                Diário de Manutenção do seu Carro
              </h2>
              <p class="mt-3 text-sm text-[#878c93] leading-relaxed">
                Mantenha um registro organizado das revisões, trocas de óleo e serviços. Ter as datas e quilometragens anotadas facilita a conversa técnica e valoriza seu veículo.
              </p>

              <!-- Form to add maintenance -->
              <form class="mt-6 space-y-3.5 bg-[#0b1015] p-5 rounded-xl border border-[#45474b]/40" @submit.prevent="addDiaryEntry">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-[#878c93] mb-1">Data do serviço</label>
                    <input
                      v-model="diaryDate"
                      type="date"
                      required
                      class="w-full rounded-lg bg-[#20252b] border border-[#45474b] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff884e]"
                    >
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-[#878c93] mb-1">Quilometragem (km)</label>
                    <input
                      v-model="diaryKm"
                      type="number"
                      placeholder="Ex: 62000"
                      min="0"
                      required
                      class="w-full rounded-lg bg-[#20252b] border border-[#45474b] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff884e]"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-[#878c93] mb-1">Serviço executado</label>
                  <input
                    v-model="diaryService"
                    type="text"
                    placeholder="Ex: Troca de óleo 5W30 + pastilhas"
                    required
                    class="w-full rounded-lg bg-[#20252b] border border-[#45474b] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff884e]"
                  >
                </div>

                <p v-if="diaryError" class="text-xs text-[#ff884e]">{{ diaryError }}</p>

                <button
                  type="submit"
                  class="w-full rounded-lg bg-[#a04108] hover:bg-[#863606] text-white text-xs font-bold py-2.5 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span class="material-symbols-outlined text-[16px]">add_circle</span>
                  Adicionar ao registro
                </button>
              </form>
            </div>

            <!-- Diary list -->
            <div class="lg:col-span-7 bg-[#0b1015] rounded-xl p-5 md:p-6 border border-[#45474b]/40">
              <div class="flex items-center justify-between border-b border-[#45474b]/40 pb-3">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[#ff884e]">history_edu</span>
                  <h3 class="text-base font-bold">Histórico de Serviços Salvos</h3>
                </div>
                <span class="text-xs text-[#878c93]">{{ diaryList.length }} registros</span>
              </div>

              <div class="mt-4 space-y-3">
                <div
                  v-for="item in diaryList"
                  :key="item.id"
                  class="p-3.5 bg-[#20252b] rounded-lg border border-[#45474b]/30 flex items-start justify-between gap-3 hover:border-[#ff884e]/40 transition-colors"
                >
                  <div>
                    <div class="flex items-center gap-2 text-xs text-[#ff884e] font-semibold">
                      <span>{{ item.date.split('-').reverse().join('/') }}</span>
                      <span>•</span>
                      <span>{{ item.km.toLocaleString('pt-BR') }} km</span>
                    </div>
                    <p class="text-sm text-white mt-1 font-medium">{{ item.service }}</p>
                  </div>
                  <button
                    type="button"
                    title="Excluir serviço"
                    class="text-[#878c93] hover:text-[#ff884e] text-xs p-1 transition-colors"
                    @click="removeDiaryEntry(item.id)"
                  >
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>

                <div v-if="diaryList.length === 0" class="text-center py-8 text-xs text-[#878c93]">
                  Nenhum serviço registrado. Adicione um serviço para começar seu diário de bordo!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==========================================
           8. LOCALIZAÇÃO E CONTATO (DESKTOP & MOBILE INTEGRATED)
           ========================================== -->
      <section id="contato" class="w-full bg-[#f5f4f0] py-12 md:py-20">
        <div class="max-w-[1280px] mx-auto px-4 md:px-6">
          <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-500 overflow-hidden border border-[#c5c6cb]/40">
            <div class="grid grid-cols-1 lg:grid-cols-12">
              <!-- Contact Info and Hours Column -->
              <div class="lg:col-span-5 p-6 md:p-10 flex flex-col justify-between">
                <div class="space-y-6">
                  <div>
                    <span class="text-xs uppercase tracking-widest text-[#a04108] font-bold">Visite Nossa Oficina</span>
                    <h2 class="text-2xl md:text-3xl font-extrabold text-[#0b1015] tracking-tight mt-1">Localização &amp; Contato</h2>
                    <p class="text-xs md:text-sm text-[#45474b] mt-1">
                      Venha tomar um café conosco enquanto avaliamos seu veículo pessoalmente no box.
                    </p>
                  </div>

                  <!-- Address Info Block -->
                  <div class="space-y-4 text-sm text-[#1b1c1a]">
                    <div class="flex items-start gap-3">
                      <div class="w-10 h-10 rounded-lg bg-[#efeeea] flex items-center justify-center text-[#a04108] shrink-0 mt-0.5">
                        <span class="material-symbols-outlined text-[20px]">location_on</span>
                      </div>
                      <div>
                        <span class="block font-bold text-[#0b1015]">Endereço</span>
                        <span class="text-[#45474b]">Rua São Paulo, 1178</span>
                        <span class="block text-[#45474b]">Bairro Cerâmica, São Caetano do Sul - SP, 09530-211</span>
                      </div>
                    </div>

                    <div class="flex items-start gap-3">
                      <div class="w-10 h-10 rounded-lg bg-[#efeeea] flex items-center justify-center text-[#a04108] shrink-0 mt-0.5">
                        <span class="material-symbols-outlined text-[20px]">call</span>
                      </div>
                      <div>
                        <span class="block font-bold text-[#0b1015]">Telefone Direto</span>
                        <a class="text-[#a04108] font-bold text-base hover:underline transition-all" href="tel:1142272079">(11) 4227-2079</a>
                      </div>
                    </div>

                    <div class="flex items-start gap-3">
                      <div class="w-10 h-10 rounded-lg bg-[#efeeea] flex items-center justify-center text-[#a04108] shrink-0 mt-0.5">
                        <span class="material-symbols-outlined text-[20px]">schedule</span>
                      </div>
                      <div>
                        <span class="block font-bold text-[#0b1015]">Horário de Atendimento</span>
                        <span class="block text-[#45474b]">Segunda a Sexta: <strong>08:00 às 18:00</strong></span>
                        <span class="block text-xs text-[#75777b]">Sábados, Domingos e Feriados: Fechado</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Action buttons -->
                <div class="pt-6 flex flex-col sm:flex-row gap-3">
                  <a
                    class="btn-interactive inline-flex items-center justify-center gap-2 bg-[#a04108] hover:bg-[#863606] text-white text-xs md:text-sm font-bold px-5 py-3 rounded-lg shadow-sm hover:shadow-lg hover:shadow-[#a04108]/25 transition-all"
                    href="https://maps.google.com/?q=Rua+São+Paulo+1178+São+Caetano+do+Sul"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span class="material-symbols-outlined text-[18px]">directions</span>
                    Traçar Rota no Maps
                  </a>
                  <a
                    class="btn-interactive inline-flex items-center justify-center gap-2 bg-[#efeeea] hover:bg-[#e9e8e4] text-[#0b1015] text-xs md:text-sm font-bold px-5 py-3 rounded-lg transition-colors border border-[#c5c6cb]/40"
                    href="tel:1142272079"
                  >
                    <span class="material-symbols-outlined text-[18px]">phone</span>
                    Ligar Agora
                  </a>
                </div>
              </div>

              <!-- Stylized Map Container -->
              <div class="lg:col-span-7 min-h-[320px] lg:min-h-[440px] relative overflow-hidden group">
                <div
                  class="w-full h-full min-h-[320px] bg-cover bg-center relative transition-transform duration-700 ease-out group-hover:scale-105"
                  style="background-image: url('/images/campaign/oficina/mapa.jpg');"
                >
                  <!-- Map Pin Overlay Badge -->
                  <div class="absolute inset-0 bg-[#0b1015]/10 flex items-center justify-center p-4">
                    <div class="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl flex items-center gap-3 max-w-xs border border-[#c5c6cb]/40 hover:scale-105 transition-all duration-300">
                      <div class="w-10 h-10 rounded-full bg-[#a04108] text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                        <span class="material-symbols-outlined text-[20px]">build</span>
                      </div>
                      <div>
                        <span class="block text-sm font-bold text-[#0b1015]">Mecânica São Paulo</span>
                        <span class="block text-xs text-[#45474b]">Rua São Paulo, 1178 • Cerâmica</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- FOOTER (DESKTOP) -->
    <footer class="hidden md:block w-full bg-[#20252b] text-[#f2f1ed] border-t border-[#45474b]/30">
      <div class="max-w-[1280px] mx-auto px-6 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-[#efeeea] flex items-center justify-center text-[#0b1015]">
                <span class="material-symbols-outlined text-[20px]">precision_manufacturing</span>
              </div>
              <span class="text-base font-bold text-white">MECÂNICA SÃO PAULO</span>
            </div>
            <p class="text-xs text-[#878c93] leading-relaxed">
              Mais de 20 anos oferecendo manutenção automotiva preventiva e corretiva com transparência, precisão técnica e garantia em São Caetano do Sul.
            </p>
          </div>

          <div class="space-y-3">
            <h3 class="text-sm font-bold text-white tracking-tight mb-2">Navegação Rápida</h3>
            <ul class="space-y-1.5 text-xs text-[#878c93]">
              <li><a href="#inicio" class="hover:text-white transition-colors">Início</a></li>
              <li><a href="#servicos" class="hover:text-white transition-colors">Nossos Serviços</a></li>
              <li><a href="#avaliacoes" class="hover:text-white transition-colors">Avaliações de Clientes</a></li>
              <li><a href="#sobre" class="hover:text-white transition-colors">Sobre a Oficina</a></li>
              <li><a href="#diario" class="hover:text-white transition-colors">Diário de Manutenção</a></li>
              <li><a href="#contato" class="hover:text-[#ffdbcc] text-[#ff884e] font-semibold transition-colors">Localização &amp; Contato</a></li>
            </ul>
          </div>

          <div class="space-y-3">
            <h3 class="text-sm font-bold text-white tracking-tight mb-2">Serviços Principais</h3>
            <ul class="space-y-1.5 text-xs text-[#878c93]">
              <li class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[15px] text-[#ff884e]">check_circle</span>Revisão Preventiva &amp; Óleo</li>
              <li class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[15px] text-[#ff884e]">check_circle</span>Freios &amp; Suspensão</li>
              <li class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[15px] text-[#ff884e]">check_circle</span>Diagnóstico Computadorizado</li>
              <li class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[15px] text-[#ff884e]">check_circle</span>Injeção Eletrônica &amp; Motor</li>
              <li class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[15px] text-[#ff884e]">check_circle</span>Câmbio Automático &amp; Diálise</li>
            </ul>
          </div>

          <div class="space-y-3">
            <h3 class="text-sm font-bold text-white tracking-tight mb-2">Atendimento &amp; Endereço</h3>
            <div class="space-y-2 text-xs text-[#878c93]">
              <div class="flex items-start gap-2">
                <span class="material-symbols-outlined text-[18px] text-[#ff884e] shrink-0 mt-0.5">location_on</span>
                <span>Rua São Paulo, 1178<br>Bairro Cerâmica • São Caetano do Sul - SP</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-[#ff884e] shrink-0">call</span>
                <a href="tel:1142272079" class="text-white font-semibold hover:text-[#ffdbcc] transition-colors">(11) 4227-2079</a>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-10 pt-6 border-t border-[#45474b]/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#878c93]">
          <p>© 2026 Mecânica São Paulo. Todos os direitos reservados.</p>
          <div class="flex items-center gap-4">
            <NuxtLink to="/#portfolio" class="hover:text-white transition-colors">Site desenvolvido pela Avyro ↗</NuxtLink>
            <NuxtLink to="/modelos-site" class="hover:text-white transition-colors">Outros Modelos</NuxtLink>
          </div>
        </div>
      </div>
    </footer>

    <!-- MOBILE STICKY BOTTOM NAVIGATION BAR (Stitch Mobile) -->
    <nav class="md:hidden fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#faf9f5]/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.06)] border-t border-[#efeeea]">
      <div class="flex justify-around items-center h-16 px-1">
        <button
          type="button"
          class="flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors"
          :class="activeTab === 'inicio' ? 'text-[#a04108] font-bold' : 'text-[#45474b]'"
          @click="setTab('inicio', 'inicio')"
        >
          <span class="material-symbols-outlined text-[22px]">home</span>
          <span class="text-[11px] mt-0.5">Início</span>
        </button>

        <button
          type="button"
          class="flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors"
          :class="activeTab === 'servicos' ? 'text-[#a04108] font-bold' : 'text-[#45474b]'"
          @click="setTab('servicos', 'servicos')"
        >
          <span class="material-symbols-outlined text-[22px]">build</span>
          <span class="text-[11px] mt-0.5">Serviços</span>
        </button>

        <button
          type="button"
          class="flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors"
          :class="activeTab === 'avaliacoes' ? 'text-[#a04108] font-bold' : 'text-[#45474b]'"
          @click="setTab('avaliacoes', 'avaliacoes')"
        >
          <span class="material-symbols-outlined text-[22px]">star_rate</span>
          <span class="text-[11px] mt-0.5">Avaliações</span>
        </button>

        <button
          type="button"
          class="flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors"
          :class="activeTab === 'sobre' ? 'text-[#a04108] font-bold' : 'text-[#45474b]'"
          @click="setTab('sobre', 'sobre')"
        >
          <span class="material-symbols-outlined text-[22px]">store</span>
          <span class="text-[11px] mt-0.5">Sobre</span>
        </button>

        <button
          type="button"
          class="flex flex-col items-center justify-center min-w-[56px] h-12 transition-colors"
          :class="activeTab === 'contato' ? 'text-[#a04108] font-bold' : 'text-[#45474b]'"
          @click="setTab('contato', 'contato')"
        >
          <span class="material-symbols-outlined text-[22px]">contact_phone</span>
          <span class="text-[11px] mt-0.5">Contato</span>
        </button>
      </div>
    </nav>

    <!-- INTERACTIVE MODAL: SOLICITAR ORÇAMENTO -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      @click.self="closeQuoteModal"
    >
      <div class="relative w-full max-w-lg rounded-2xl bg-white p-6 md:p-8 shadow-2xl animate-fade-in-up border border-[#efeeea]">
        <button
          type="button"
          class="absolute top-4 right-4 text-[#75777b] hover:text-[#0b1015] p-1"
          @click="closeQuoteModal"
        >
          <span class="material-symbols-outlined text-[24px]">close</span>
        </button>

        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-[#efeeea] flex items-center justify-center text-[#a04108]">
            <span class="material-symbols-outlined text-[24px]">request_quote</span>
          </div>
          <div>
            <h3 class="text-xl font-bold text-[#0b1015]">Solicitar Orçamento</h3>
            <p class="text-xs text-[#45474b]">Mecânica São Paulo • Resposta rápida via WhatsApp</p>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="sendWhatsAppQuote">
          <div>
            <label class="block text-xs font-semibold text-[#1b1c1a] mb-1">Seu Nome</label>
            <input
              v-model="quoteForm.name"
              type="text"
              required
              placeholder="Ex: Carlos Eduardo"
              class="w-full rounded-lg border border-[#c5c6cb] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#a04108]"
            >
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-[#1b1c1a] mb-1">Telefone / WhatsApp</label>
              <input
                v-model="quoteForm.phone"
                type="tel"
                placeholder="(11) 99999-9999"
                class="w-full rounded-lg border border-[#c5c6cb] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#a04108]"
              >
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#1b1c1a] mb-1">Modelo &amp; Ano do Carro</label>
              <input
                v-model="quoteForm.carModel"
                type="text"
                placeholder="Ex: Civic 2021"
                class="w-full rounded-lg border border-[#c5c6cb] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#a04108]"
              >
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#1b1c1a] mb-1">Serviço Desejado</label>
            <select
              v-model="quoteForm.service"
              class="w-full rounded-lg border border-[#c5c6cb] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#a04108] bg-white"
            >
              <option value="Revisão Preventiva & Óleo">Revisão Preventiva &amp; Óleo</option>
              <option value="Motor & Injeção Eletrônica">Motor &amp; Injeção Eletrônica</option>
              <option value="Câmbio Automático e Transmissão">Câmbio Automático e Transmissão</option>
              <option value="Freios, Suspensão & Direção">Freios, Suspensão &amp; Direção</option>
              <option value="Diagnóstico de Ruído ou Falha">Diagnóstico de Ruído ou Falha</option>
              <option value="Outro Serviço">Outro Serviço</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#1b1c1a] mb-1">Observações ou Sintomas</label>
            <textarea
              v-model="quoteForm.message"
              rows="3"
              placeholder="Descreva algum barulho, luz no painel ou detalhe..."
              class="w-full rounded-lg border border-[#c5c6cb] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#a04108]"
            ></textarea>
          </div>

          <div class="pt-2 flex gap-3">
            <button
              type="submit"
              class="flex-1 rounded-lg bg-[#a04108] hover:bg-[#863606] text-white text-sm font-bold py-3 flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              <span class="material-symbols-outlined text-[20px]">chat</span>
              Enviar pelo WhatsApp ↗
            </button>
            <button
              type="button"
              class="px-4 py-3 rounded-lg border border-[#c5c6cb] text-xs font-bold text-[#45474b] hover:bg-[#efeeea]"
              @click="closeQuoteModal"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes subtleFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-float {
  animation: subtleFloat 4s ease-in-out infinite;
}

.delay-200 {
  animation-delay: 200ms;
}

.btn-interactive {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.btn-interactive:hover {
  transform: translateY(-2px);
}

.btn-interactive:active {
  transform: scale(0.97) translateY(0);
}

.btn-interactive::after {
  content: '';
  position: absolute;
  top: 0;
  left: -120%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: skewX(-20deg);
  transition: left 0.6s ease;
  pointer-events: none;
}

.btn-interactive:hover::after {
  left: 140%;
}

.nav-link-hover {
  position: relative;
  transition: color 0.2s ease;
}

.nav-link-hover::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #a04108;
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-link-hover:hover::after {
  width: 100%;
  left: 0;
}

@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
</style>
