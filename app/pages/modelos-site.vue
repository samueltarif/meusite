<script setup lang="ts">
import { ref, computed } from 'vue'

useSeoMeta({
  title: 'Modelos de Sites Profissionais Prontos | Tarif Grownt Company',
  description: 'Explore nossos 10 modelos de sites profissionais prontos e otimizados para alta conversão em diversos nichos de mercado.',
})

interface SiteTemplate {
  id: string
  title: string
  category: string
  categoryId: string
  description: string
  previewImage: string
  features: string[]
  tags: string[]
  liveDemoUrl?: string
  accentColor: string
}

const activeCategory = ref('all')
const selectedPreviewTemplate = ref<SiteTemplate | null>(null)
const previewDevice = ref<'desktop' | 'tablet' | 'mobile'>('desktop')

const categories = [
  { id: 'all', name: 'Todos os Modelos' },
  { id: 'advocacia', name: 'Advocacia & Direito' },
  { id: 'saude', name: 'Medicina & Saúde' },
  { id: 'imobiliaria', name: 'Imobiliária' },
  { id: 'gastronomia', name: 'Gastronomia' },
  { id: 'arquitetura', name: 'Arquitetura' },
  { id: 'financas', name: 'Consultoria & Finanças' },
  { id: 'estetica', name: 'Estética & Beleza' },
  { id: 'educacao', name: 'Educação & Cursos' },
  { id: 'tecnologia', name: 'Tecnologia & SaaS' },
  { id: 'automotivo', name: 'Automotivo' },
]

const templates: SiteTemplate[] = [
  // 1. Advocacia
  {
    id: 'lex-juridic',
    title: 'LexJuridic Pro',
    category: 'Advocacia & Direito',
    categoryId: 'advocacia',
    description: 'Site institucional corporativo para escritórios de advocacia com foco em autoridade, agendamento de consultas e áreas de atuação.',
    previewImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    features: ['Agendamento Online', 'Áreas de Atuação', 'Calculadora Trabalhista', 'Blog Jurídico'],
    tags: ['Direito', 'Escritório', 'Advogados'],
    accentColor: '#1e3a8a',
  },
  // 2. Saúde
  {
    id: 'med-clinic',
    title: 'MedClinic Premium',
    category: 'Medicina & Saúde',
    categoryId: 'saude',
    description: 'Modelo moderno e acolhedor para clínicas médicas, consultórios e especialistas com agendamento WhatsApp integrado.',
    previewImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200',
    features: ['Integração WhatsApp', 'Corpo Clínico', 'Convênios Aceitos', 'Preparatório de Exames'],
    tags: ['Médicos', 'Clínica', 'Saúde'],
    accentColor: '#0284c7',
  },
  // 3. Imobiliária
  {
    id: 'imovel-prime',
    title: 'ImóvelPrime Real Estate',
    category: 'Imobiliária',
    categoryId: 'imobiliaria',
    description: 'Catálogo imobiliário de alta conversão para corretores e imobiliárias com filtros de busca avançados por bairro e valor.',
    previewImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
    features: ['Filtro de Busca', 'Galeria de Imóveis', 'Tour Virtual 360', 'Simulador de Financiamento'],
    tags: ['Imóveis', 'Corretores', 'Vendas'],
    accentColor: '#0f766e',
  },
  // 4. Gastronomia
  {
    id: 'gourmet-bistro',
    title: 'GourmetBistro & Bar',
    category: 'Gastronomia',
    categoryId: 'gastronomia',
    description: 'Website elegante para restaurantes, bistrôs e bares com cardápio digital interativo e reserva de mesas em tempo real.',
    previewImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
    features: ['Menu QR Code', 'Reserva de Mesas', 'Integração iFood', 'Eventos da Semana'],
    tags: ['Restaurante', 'Bar', 'Gastronomia'],
    accentColor: '#b91c1c',
  },
  // 5. Arquitetura
  {
    id: 'arch-studio',
    title: 'ArchStudio Concept',
    category: 'Arquitetura',
    categoryId: 'arquitetura',
    description: 'Portfolio minimalista e sofisticado para escritórios de arquitetura e designers de interiores destacarem seus projetos executados.',
    previewImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    features: ['Portfolio HD', 'Antes & Depois', 'Orçamento por m²', 'Catálogo de Acabamentos'],
    tags: ['Arquitetura', 'Interiores', 'Design'],
    accentColor: '#374151',
  },
  // 6. Finanças
  {
    id: 'finance-wealth',
    title: 'FinanceWealth Group',
    category: 'Consultoria & Finanças',
    categoryId: 'financas',
    description: 'Layout corporativo para consultores de investimentos, contabilidades e escritórios de análise financeira.',
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    features: ['Simulador de Investimentos', 'Portal do Cliente', 'Relatórios Mensais', 'Atendimento VIP'],
    tags: ['Finanças', 'Contabilidade', 'Investimentos'],
    accentColor: '#15803d',
  },
  // 7. Estética
  {
    id: 'glow-aesthetic',
    title: 'GlowAesthetic Spa',
    category: 'Estética & Beleza',
    categoryId: 'estetica',
    description: 'Visual suave e luxuoso voltado a clínicas de estética, spas, harmonização facial e salões de beleza premium.',
    previewImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200',
    features: ['Catálogo de Procedimentos', 'Agendamento Direto', 'Depoimentos em Vídeo', 'Clube de Vantagens'],
    tags: ['Estética', 'Spa', 'Beleza'],
    accentColor: '#be185d',
  },
  // 8. Educação
  {
    id: 'edu-master',
    title: 'EduMaster Cursos',
    category: 'Educação & Cursos',
    categoryId: 'educacao',
    description: 'Plataforma para professores, mentores e escolas venderem treinamentos online, workshops e mentorias.',
    previewImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200',
    features: ['Grade Curricular', 'Hotmart / Eduzz Direct', 'Aulas Demonstrativas', 'Certificado Digital'],
    tags: ['Cursos', 'Mentoria', 'Educação'],
    accentColor: '#6d28d9',
  },
  // 9. Tecnologia
  {
    id: 'cloud-saas',
    title: 'CloudSaaS Tech',
    category: 'Tecnologia & SaaS',
    categoryId: 'tecnologia',
    description: 'Landing page moderna em estilo dark mode neon para startups de tecnologia, aplicativos e softwares SaaS.',
    previewImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    features: ['Tabela de Preços', 'Integração via API', 'Changelog de Updates', 'Teste Grátis 14 Dias'],
    tags: ['SaaS', 'Startup', 'Software'],
    accentColor: '#0369a1',
  },
  // 10. Automotivo
  {
    id: 'auto-elite',
    title: 'AutoElite Center',
    category: 'Automotivo',
    categoryId: 'automotivo',
    description: 'Modelo robusto para centros automotivos, estética automotiva (Detailing) e oficinas especializadas.',
    previewImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200',
    features: ['Orçamento Rápido', 'Serviços de Detalhamento', 'Agendamento de Revisão', 'Galeria de Carros'],
    tags: ['Oficina', 'Detailing', 'Carros'],
    accentColor: '#c2410c',
  },
]

const filteredTemplates = computed(() => {
  if (activeCategory.value === 'all') return templates
  return templates.filter((t) => t.categoryId === activeCategory.value)
})

function openPreview(template: SiteTemplate) {
  selectedPreviewTemplate.value = template
  previewDevice.value = 'desktop'
}

function closePreview() {
  selectedPreviewTemplate.value = null
}
</script>

<template>
  <div class="bg-[#FCFCFC] min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      
      <!-- Back Link -->
      <div class="mb-8">
        <NuxtLink to="/#portfolio" class="inline-flex items-center gap-2 text-primary-container hover:text-cyan-600 font-heading text-sm font-bold transition-colors">
          <span class="material-symbols-outlined text-[20px]">arrow_back</span>
          Voltar para a Página Inicial
        </NuxtLink>
      </div>

      <!-- Header Section -->
      <div class="text-center max-w-3xl mx-auto mb-12">
        <div class="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-200 text-cyan-700 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
          <span class="material-symbols-outlined text-[16px]">web</span>
          Galeria Exclusiva de Modelos
        </div>
        <h1 class="font-heading text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight mb-4">
          Modelos de Sites Profissionais Prontos
        </h1>
        <p class="font-body text-base sm:text-lg text-gray-600 leading-relaxed">
          Escolha um dos nossos 10 modelos desenvolvidos com design de alta performance para o seu nicho. Criamos a sua versão personalizada em poucos dias.
        </p>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12 hide-scrollbar flex-wrap">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          :class="[
            'px-5 py-2.5 rounded-full text-xs sm:text-sm font-heading font-bold transition-all duration-200 shrink-0',
            activeCategory === cat.id
              ? 'bg-primary-container text-white shadow-md scale-105'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          ]"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Templates Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="template in filteredTemplates"
          :key="template.id"
          class="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
        >
          <div>
            <!-- Template Image Preview Container -->
            <div class="relative h-64 overflow-hidden bg-gray-100 cursor-pointer" @click="openPreview(template)">
              <img
                :src="template.previewImage"
                :alt="template.title"
                class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                <span class="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md text-gray-900 px-4 py-2 rounded-xl text-xs font-bold shadow-md">
                  <span class="material-symbols-outlined text-[16px]">visibility</span>
                  Ver Demonstração ao Vivo
                </span>
              </div>

              <!-- Category Badge -->
              <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {{ template.category }}
              </div>
            </div>

            <!-- Content Area -->
            <div class="p-6">
              <h3 class="font-heading text-xl font-bold text-gray-900 mb-2">
                {{ template.title }}
              </h3>
              <p class="font-body text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                {{ template.description }}
              </p>

              <!-- Feature Bullets -->
              <div class="space-y-1.5 mb-6">
                <div
                  v-for="feat in template.features"
                  :key="feat"
                  class="flex items-center gap-2 text-xs font-medium text-gray-700"
                >
                  <span class="material-symbols-outlined text-emerald-500 text-[16px]">check_circle</span>
                  {{ feat }}
                </div>
              </div>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="px-6 pb-6 pt-2 border-t border-gray-100 flex items-center gap-3">
            <button
              @click="openPreview(template)"
              class="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span class="material-symbols-outlined text-[16px]">open_in_new</span>
              Ver Modelo
            </button>
            
            <a
              href="/#contact"
              class="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-white bg-primary-container hover:bg-primary-container/90 transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md"
            >
              <span class="material-symbols-outlined text-[16px]">check</span>
              Quero Este
            </a>
          </div>
        </div>
      </div>

    </div>

    <!-- Live Preview Modal -->
    <Transition name="fade">
      <div
        v-if="selectedPreviewTemplate"
        class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col"
      >
        <!-- Modal Toolbar -->
        <div class="bg-gray-900 text-white px-6 py-3 flex items-center justify-between border-b border-gray-800">
          <div class="flex items-center gap-3">
            <h2 class="font-heading font-bold text-base sm:text-lg text-white">
              {{ selectedPreviewTemplate.title }}
            </h2>
            <span class="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full hidden sm:inline-block">
              {{ selectedPreviewTemplate.category }}
            </span>
          </div>

          <!-- Device Switcher -->
          <div class="hidden md:flex items-center bg-gray-800 p-1 rounded-xl gap-1">
            <button
              @click="previewDevice = 'desktop'"
              :class="['p-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5', previewDevice === 'desktop' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white']"
            >
              <span class="material-symbols-outlined text-[18px]">desktop_windows</span>
              Desktop
            </button>
            <button
              @click="previewDevice = 'tablet'"
              :class="['p-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5', previewDevice === 'tablet' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white']"
            >
              <span class="material-symbols-outlined text-[18px]">tablet</span>
              Tablet
            </button>
            <button
              @click="previewDevice = 'mobile'"
              :class="['p-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5', previewDevice === 'mobile' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white']"
            >
              <span class="material-symbols-outlined text-[18px]">smartphone</span>
              Mobile
            </button>
          </div>

          <div class="flex items-center gap-3">
            <a
              href="/#contact"
              class="px-5 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-bold rounded-xl shadow-md hover:scale-105 transition-transform"
            >
              Quero um Site Igual
            </a>
            <button
              @click="closePreview"
              class="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <span class="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </div>

        <!-- Interactive Site Mockup Viewer -->
        <div class="flex-1 bg-gray-950 overflow-y-auto p-4 sm:p-8 flex items-center justify-center">
          <div
            :class="[
              'transition-all duration-500 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col',
              previewDevice === 'desktop' ? 'w-full max-w-5xl h-[85vh]' : '',
              previewDevice === 'tablet' ? 'w-[768px] h-[80vh]' : '',
              previewDevice === 'mobile' ? 'w-[375px] h-[75vh]' : ''
            ]"
          >
            <!-- Browser Address Bar Mockup -->
            <div class="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
              <div class="flex items-center gap-1.5">
                <div class="w-3 h-3 rounded-full bg-red-400" />
                <div class="w-3 h-3 rounded-full bg-amber-400" />
                <div class="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div class="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-600 flex items-center gap-2">
                <span class="material-symbols-outlined text-emerald-600 text-[14px]">lock</span>
                https://demo.tarif.com.br/{{ selectedPreviewTemplate.id }}
              </div>
            </div>

            <!-- Rendered Mockup Site View -->
            <div class="flex-1 overflow-y-auto bg-white">
              <!-- Mockup Site Hero -->
              <div class="relative py-20 px-8 text-center text-white bg-slate-900 overflow-hidden">
                <img
                  :src="selectedPreviewTemplate.previewImage"
                  class="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
                />
                <div class="relative z-10 max-w-2xl mx-auto space-y-4">
                  <span class="inline-block px-4 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
                    {{ selectedPreviewTemplate.category }}
                  </span>
                  <h1 class="text-3xl sm:text-5xl font-extrabold font-heading">
                    {{ selectedPreviewTemplate.title }}
                  </h1>
                  <p class="text-sm sm:text-base text-gray-200 leading-relaxed">
                    {{ selectedPreviewTemplate.description }}
                  </p>
                  <div class="pt-4 flex justify-center gap-3">
                    <button class="px-6 py-3 rounded-xl font-bold text-xs text-gray-900 bg-white shadow-lg">
                      Agendar Atendimento
                    </button>
                    <button class="px-6 py-3 rounded-xl font-bold text-xs text-white bg-white/20 backdrop-blur-md border border-white/40">
                      Conhecer Serviços
                    </button>
                  </div>
                </div>
              </div>

              <!-- Mockup Features Section -->
              <div class="py-12 px-8 max-w-4xl mx-auto space-y-8">
                <div class="text-center">
                  <h2 class="text-2xl font-bold text-gray-900 font-heading">Nossos Recursos Exclusivos</h2>
                  <p class="text-xs text-gray-600">Desenvolvido sob medida com foco na conversão dos seus clientes.</p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    v-for="feat in selectedPreviewTemplate.features"
                    :key="feat"
                    class="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3"
                  >
                    <span class="material-symbols-outlined text-emerald-600 text-2xl">check_circle</span>
                    <div>
                      <h4 class="font-bold text-sm text-gray-900">{{ feat }}</h4>
                      <p class="text-xs text-gray-500">Recurso totalmente configurável para seu negócio.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
