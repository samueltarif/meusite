<script setup lang="ts">
import { ref, computed } from 'vue'

useSeoMeta({
  title: 'Modelos de Sites Profissionais Prontos | Tarif Growth Company',
  description: 'Explore nossos modelos de sites profissionais prontos e otimizados para alta conversão em diversos nichos de mercado.',
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
  accentColor: string
}

const activeCategory = ref('all')

const categories = [
  { id: 'all', name: 'Todos os Modelos' },
  { id: 'unhas-sobrancelhas', name: 'Unhas & Sobrancelhas' },
  { id: 'estetica', name: 'Estética & Beleza' },
  { id: 'advocacia', name: 'Advocacia' },
  { id: 'saude', name: 'Medicina & Saúde' },
  { id: 'imobiliaria', name: 'Imobiliária' },
  { id: 'gastronomia', name: 'Gastronomia' },
  { id: 'arquitetura', name: 'Arquitetura' },
  { id: 'financas', name: 'Finanças' },
  { id: 'educacao', name: 'Educação' },
  { id: 'tecnologia', name: 'Tecnologia' },
  { id: 'automotivo', name: 'Automotivo' },
]

const templates: SiteTemplate[] = [
  // 1. Unhas, Manicure & Sobrancelhas
  {
    id: 'bella-nails',
    title: 'BellaNails & Brow Studio',
    category: 'Unhas & Sobrancelhas',
    categoryId: 'unhas-sobrancelhas',
    description: 'Site exclusivo para Nail Designers, Manicures, Lash Designers e Especialistas em Design de Sobrancelhas & Micropigmentação com agendamento online fácil.',
    previewImage: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=1200',
    features: ['Agendamento WhatsApp', 'Tabela de Preços', 'Galeria Nail Art', 'Brows & Lash Care'],
    tags: ['Manicure', 'Sobrancelhas', 'Nail Art', 'Esmalteria'],
    accentColor: '#db2777',
  },
  // 2. Advocacia
  {
    id: 'lex-juridic',
    title: 'LexJuridic Pro',
    category: 'Advocacia & Direito',
    categoryId: 'advocacia',
    description: 'Site institucional corporativo para escritórios de advocacia com foco em autoridade, agendamento de consultas e áreas de atuação.',
    previewImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    features: ['Agendamento Online', 'Áreas de Atuação', 'Calculadora Trabalhista', 'Blog Jurídico'],
    tags: ['Direito', 'Escritório'],
    accentColor: '#1e3a8a',
  },
  // 3. Medicina & Saúde
  {
    id: 'med-clinic',
    title: 'MedClinic Premium',
    category: 'Medicina & Saúde',
    categoryId: 'saude',
    description: 'Modelo moderno e acolhedor para clínicas médicas e consultórios com agendamento WhatsApp integrado.',
    previewImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200',
    features: ['Integração WhatsApp', 'Corpo Clínico', 'Convênios Aceitos', 'Preparatório de Exames'],
    tags: ['Médicos', 'Clínica'],
    accentColor: '#0284c7',
  },
  // 4. Imobiliária
  {
    id: 'imovel-prime',
    title: 'ImóvelPrime Real Estate',
    category: 'Imobiliária',
    categoryId: 'imobiliaria',
    description: 'Catálogo imobiliário de alta conversão para corretores e imobiliárias com filtros de busca avançados.',
    previewImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
    features: ['Filtro de Busca', 'Galeria de Imóveis', 'Tour Virtual 360', 'Simulador de Financiamento'],
    tags: ['Imóveis', 'Corretores'],
    accentColor: '#0f766e',
  },
  // 5. Gastronomia
  {
    id: 'gourmet-bistro',
    title: 'GourmetBistro & Bar',
    category: 'Gastronomia',
    categoryId: 'gastronomia',
    description: 'Website elegante para restaurantes e bares com cardápio digital interativo e reserva de mesas.',
    previewImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
    features: ['Menu QR Code', 'Reserva de Mesas', 'Integração iFood', 'Eventos da Semana'],
    tags: ['Restaurante', 'Bar'],
    accentColor: '#b91c1c',
  },
  // 6. Arquitetura
  {
    id: 'arch-studio',
    title: 'ArchStudio Concept',
    category: 'Arquitetura',
    categoryId: 'arquitetura',
    description: 'Portfolio minimalista e sofisticado para escritórios de arquitetura e designers de interiores.',
    previewImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    features: ['Portfolio HD', 'Antes & Depois', 'Orçamento por m²', 'Catálogo de Acabamentos'],
    tags: ['Arquitetura', 'Design'],
    accentColor: '#374151',
  },
  // 7. Finanças
  {
    id: 'finance-wealth',
    title: 'FinanceWealth Group',
    category: 'Consultoria & Finanças',
    categoryId: 'financas',
    description: 'Layout corporativo para consultores de investimentos e escritórios de análise financeira.',
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    features: ['Simulador de Investimentos', 'Portal do Cliente', 'Relatórios Mensais', 'Atendimento VIP'],
    tags: ['Finanças', 'Investimentos'],
    accentColor: '#15803d',
  },
  // 8. Estética & Beleza
  {
    id: 'glow-aesthetic',
    title: 'GlowAesthetic Spa',
    category: 'Estética & Beleza',
    categoryId: 'estetica',
    description: 'Visual suave e luxuoso voltado a clínicas de estética, harmonização facial e salões de beleza.',
    previewImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200',
    features: ['Catálogo de Procedimentos', 'Agendamento Direto', 'Depoimentos em Vídeo', 'Clube de Vantagens'],
    tags: ['Estética', 'Spa'],
    accentColor: '#be185d',
  },
  // 9. Educação
  {
    id: 'edu-master',
    title: 'EduMaster Cursos',
    category: 'Educação & Cursos',
    categoryId: 'educacao',
    description: 'Plataforma para professores e escolas venderem treinamentos online, workshops e mentorias.',
    previewImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200',
    features: ['Grade Curricular', 'Hotmart / Eduzz', 'Aulas Demonstrativas', 'Certificado Digital'],
    tags: ['Cursos', 'Mentoria'],
    accentColor: '#6d28d9',
  },
  // 10. Tecnologia
  {
    id: 'cloud-saas',
    title: 'CloudSaaS Tech',
    category: 'Tecnologia & SaaS',
    categoryId: 'tecnologia',
    description: 'Landing page dark mode neon para startups de tecnologia, aplicativos e softwares SaaS.',
    previewImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    features: ['Tabela de Preços', 'Integração API', 'Changelog de Updates', 'Teste Grátis 14 Dias'],
    tags: ['SaaS', 'Startup'],
    accentColor: '#0369a1',
  },
  // 11. Automotivo
  {
    id: 'auto-elite',
    title: 'AutoElite Center',
    category: 'Automotivo',
    categoryId: 'automotivo',
    description: 'Modelo robusto para centros automotivos, estética automotiva e oficinas especializadas.',
    previewImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200',
    features: ['Orçamento Rápido', 'Serviços de Detalhamento', 'Agendamento de Revisão', 'Galeria de Carros'],
    tags: ['Oficina', 'Detailing'],
    accentColor: '#c2410c',
  },
]

const filteredTemplates = computed(() => {
  if (activeCategory.value === 'all') return templates
  return templates.filter((t) => t.categoryId === activeCategory.value)
})
</script>

<template>
  <div class="bg-[#0b081e] text-white min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">

      <!-- Back Link -->
      <div class="mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-heading text-sm font-bold transition-colors">
          <span class="material-symbols-outlined text-[20px]">arrow_back</span>
          Voltar para a Página Inicial
        </NuxtLink>
      </div>

      <!-- Header Section -->
      <div class="text-center max-w-3xl mx-auto mb-12">
        <div class="inline-flex items-center gap-2 bg-purple-950/80 border border-purple-500/30 text-purple-300 px-4 py-1.5 rounded-full text-xs font-bold mb-4 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
          <span class="material-symbols-outlined text-[16px]">space_dashboard</span>
          Modelos de Sites Prontos para Uso
        </div>
        <h1 class="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Catálogo de <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">Modelos Prontos</span>
        </h1>
        <p class="font-body text-base sm:text-lg text-gray-300 leading-relaxed">
          Escolha o modelo ideal para seu negócio. Todos são 100% otimizados para celular, prontos para receber seus dados e vender mais.
        </p>
      </div>

      <!-- Category Filter Buttons -->
      <div class="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12 hide-scrollbar flex-wrap">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          :class="[
            'px-5 py-2.5 rounded-full text-xs sm:text-sm font-heading font-bold transition-all duration-300 shrink-0',
            activeCategory === cat.id
              ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_25px_rgba(0,240,255,0.4)] scale-105'
              : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
          ]"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Templates List (Clean Card Grid - Exactly as requested in user photo) -->
      <div class="space-y-8">
        <div
          v-for="tpl in filteredTemplates"
          :key="tpl.id"
          class="bg-[#130f37]/90 border border-purple-500/20 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_35px_rgba(168,85,247,0.2)]"
        >
          <!-- Card Content (Identical to user screenshot) -->
          <div class="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <!-- Thumbnail Image -->
            <div class="lg:col-span-5 relative h-64 sm:h-72 rounded-2xl overflow-hidden group shadow-lg">
              <img
                :src="tpl.previewImage"
                :alt="tpl.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <!-- Category Badge -->
              <span
                class="absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-md backdrop-blur-md"
                :style="{ background: tpl.accentColor }"
              >
                {{ tpl.category }}
              </span>
            </div>

            <!-- Card Info -->
            <div class="lg:col-span-7 flex flex-col justify-between h-full">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-3 h-3 rounded-full" :style="{ background: tpl.accentColor }" />
                  <span class="text-xs uppercase font-mono tracking-wider text-gray-400">Modelo Prontos • {{ tpl.tags.join(' • ') }}</span>
                </div>

                <h2 class="font-heading text-2xl sm:text-3xl font-extrabold text-white mb-3">
                  {{ tpl.title }}
                </h2>

                <p class="font-body text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                  {{ tpl.description }}
                </p>

                <!-- Features list -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                  <div
                    v-for="feat in tpl.features"
                    :key="feat"
                    class="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2.5 rounded-xl text-xs text-gray-200"
                  >
                    <span class="material-symbols-outlined text-[18px]" :style="{ color: tpl.accentColor }">check_circle</span>
                    <span class="font-medium truncate">{{ feat }}</span>
                  </div>
                </div>
              </div>

              <!-- Primary Action CTA -->
              <div class="pt-3 border-t border-white/10">
                <a
                  href="/#contact"
                  class="w-full sm:w-auto inline-flex items-center justify-center px-9 py-4 rounded-full text-sm font-extrabold text-white transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-105 gap-2.5"
                  :style="{ background: tpl.accentColor }"
                >
                  <span class="font-heading tracking-wide uppercase">Quero Este Modelo</span>
                  <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Scrollbar styling for filters */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
