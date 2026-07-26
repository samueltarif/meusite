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
  accentColor: string
  heroStyle: string
  navStyle: string
  btnStyle: string
  btnText: string
  secondaryBtnText: string
  bodyBg: string
  cardStyle: string
  fontStyle: string
  sectionTitle: string
  sectionItems: { icon: string; title: string; desc: string }[]
}

const activeCategory = ref('all')
const selectedPreviewTemplate = ref<SiteTemplate | null>(null)
const previewDevice = ref<'desktop' | 'tablet' | 'mobile'>('desktop')

const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'advocacia', name: 'Advocacia' },
  { id: 'saude', name: 'Saúde' },
  { id: 'imobiliaria', name: 'Imobiliária' },
  { id: 'gastronomia', name: 'Gastronomia' },
  { id: 'arquitetura', name: 'Arquitetura' },
  { id: 'financas', name: 'Finanças' },
  { id: 'estetica', name: 'Estética' },
  { id: 'educacao', name: 'Educação' },
  { id: 'tecnologia', name: 'Tecnologia' },
  { id: 'automotivo', name: 'Automotivo' },
]

const templates: SiteTemplate[] = [
  {
    id: 'lex-juridic',
    title: 'LexJuridic Pro',
    category: 'Advocacia & Direito',
    categoryId: 'advocacia',
    description: 'Site institucional corporativo para escritórios de advocacia com foco em autoridade e agendamento de consultas.',
    previewImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    features: ['Agendamento Online', 'Áreas de Atuação', 'Calculadora Trabalhista', 'Blog Jurídico'],
    tags: ['Direito', 'Escritório'],
    accentColor: '#1e3a8a',
    heroStyle: 'background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%);',
    navStyle: 'background: rgba(15,23,42,0.95); border-bottom: 1px solid rgba(255,215,0,0.3);',
    btnStyle: 'background: linear-gradient(135deg, #ca8a04, #eab308); color: #0f172a; border: none; border-radius: 4px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;',
    btnText: 'Agende sua Consulta',
    secondaryBtnText: 'Áreas de Atuação',
    bodyBg: '#faf9f6',
    cardStyle: 'background: white; border: 1px solid #e5e7eb; border-radius: 4px; border-top: 3px solid #ca8a04;',
    fontStyle: 'font-family: Georgia, "Times New Roman", serif;',
    sectionTitle: 'Áreas de Excelência Jurídica',
    sectionItems: [
      { icon: 'gavel', title: 'Direito Empresarial', desc: 'Assessoria completa para empresas de todos os portes.' },
      { icon: 'family_restroom', title: 'Direito de Família', desc: 'Divórcios, inventários e disputas familiares.' },
      { icon: 'work', title: 'Direito Trabalhista', desc: 'Defesa em ações trabalhistas e cálculos rescisórios.' },
      { icon: 'account_balance', title: 'Direito Tributário', desc: 'Planejamento fiscal e recuperação de créditos.' },
    ],
  },
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
    heroStyle: 'background: linear-gradient(160deg, #ecfeff 0%, #cffafe 30%, #a5f3fc 60%, #22d3ee 100%);',
    navStyle: 'background: rgba(255,255,255,0.95); border-bottom: 1px solid #e0f2fe; box-shadow: 0 2px 12px rgba(0,0,0,0.05);',
    btnStyle: 'background: #0284c7; color: white; border: none; border-radius: 999px; font-weight: 700;',
    btnText: 'Agendar Consulta via WhatsApp',
    secondaryBtnText: 'Nossos Especialistas',
    bodyBg: '#f0f9ff',
    cardStyle: 'background: white; border: 1px solid #bae6fd; border-radius: 20px; box-shadow: 0 8px 30px rgba(2,132,199,0.08);',
    fontStyle: 'font-family: "Inter", system-ui, sans-serif;',
    sectionTitle: 'Especialidades Médicas',
    sectionItems: [
      { icon: 'cardiology', title: 'Cardiologia', desc: 'Exames e acompanhamento cardiovascular completo.' },
      { icon: 'dermatology', title: 'Dermatologia', desc: 'Cuidados com a pele, cabelo e unhas.' },
      { icon: 'psychology', title: 'Psiquiatria', desc: 'Saúde mental com abordagem humanizada.' },
      { icon: 'orthopedics', title: 'Ortopedia', desc: 'Tratamento de lesões e reabilitação.' },
    ],
  },
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
    heroStyle: 'background: linear-gradient(180deg, #042f2e 0%, #134e4a 100%);',
    navStyle: 'background: rgba(4,47,46,0.97); border-bottom: 1px solid rgba(20,184,166,0.3);',
    btnStyle: 'background: #14b8a6; color: #042f2e; border: none; border-radius: 12px; font-weight: 800;',
    btnText: 'Buscar Imóveis',
    secondaryBtnText: 'Simular Financiamento',
    bodyBg: '#f0fdfa',
    cardStyle: 'background: white; border: 1px solid #ccfbf1; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(15,118,110,0.08);',
    fontStyle: 'font-family: "Inter", system-ui, sans-serif;',
    sectionTitle: 'Encontre o Imóvel dos seus Sonhos',
    sectionItems: [
      { icon: 'apartment', title: 'Apartamentos', desc: 'Studios a coberturas em localizações premium.' },
      { icon: 'house', title: 'Casas', desc: 'Residências em condomínios fechados.' },
      { icon: 'storefront', title: 'Comercial', desc: 'Salas, lojas e galpões para negócios.' },
      { icon: 'landscape', title: 'Terrenos', desc: 'Lotes para construção em áreas nobres.' },
    ],
  },
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
    heroStyle: 'background: linear-gradient(180deg, #1c1917 0%, #292524 60%, #44403c 100%);',
    navStyle: 'background: transparent; border-bottom: 1px solid rgba(255,255,255,0.1);',
    btnStyle: 'background: transparent; color: #fbbf24; border: 2px solid #fbbf24; border-radius: 0; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;',
    btnText: 'Reservar Mesa',
    secondaryBtnText: 'Ver Cardápio',
    bodyBg: '#fefce8',
    cardStyle: 'background: #1c1917; color: #fef3c7; border: 1px solid #44403c; border-radius: 0;',
    fontStyle: 'font-family: "Playfair Display", Georgia, serif;',
    sectionTitle: 'Menu Degustação',
    sectionItems: [
      { icon: 'restaurant', title: 'Entradas', desc: 'Bruschetta trufada, Carpaccio de wagyu e mais.' },
      { icon: 'lunch_dining', title: 'Pratos Principais', desc: 'Filé ao molho Béarnaise e risottos artesanais.' },
      { icon: 'wine_bar', title: 'Carta de Vinhos', desc: 'Seleção premiada de rótulos importados.' },
      { icon: 'cake', title: 'Sobremesas', desc: 'Petit gâteau e crème brûlée do chef.' },
    ],
  },
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
    heroStyle: 'background: #ffffff;',
    navStyle: 'background: white; border-bottom: 1px solid #e5e7eb;',
    btnStyle: 'background: #111827; color: white; border: none; border-radius: 0; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;',
    btnText: 'Ver Projetos',
    secondaryBtnText: 'Solicitar Proposta',
    bodyBg: '#ffffff',
    cardStyle: 'background: #f9fafb; border: none; border-radius: 0; border-left: 4px solid #111827;',
    fontStyle: 'font-family: "Helvetica Neue", Arial, sans-serif;',
    sectionTitle: 'Projetos Selecionados',
    sectionItems: [
      { icon: 'villa', title: 'Residencial de Luxo', desc: 'Casa contemporânea com 450m² em terreno de 1200m².' },
      { icon: 'apartment', title: 'Loft Industrial', desc: 'Reforma completa de galpão para loft de 180m².' },
      { icon: 'store', title: 'Showroom Corporativo', desc: 'Espaço multifuncional com 300m² e iluminação natural.' },
      { icon: 'deck', title: 'Paisagismo Premium', desc: 'Jardim sensorial com espelho d\'água e pergolado.' },
    ],
  },
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
    heroStyle: 'background: linear-gradient(135deg, #022c22 0%, #064e3b 40%, #065f46 100%);',
    navStyle: 'background: rgba(2,44,34,0.97); border-bottom: 1px solid rgba(52,211,153,0.2);',
    btnStyle: 'background: linear-gradient(135deg, #34d399, #10b981); color: #022c22; border: none; border-radius: 8px; font-weight: 800;',
    btnText: 'Agendar Consultoria',
    secondaryBtnText: 'Simular Investimento',
    bodyBg: '#f0fdf4',
    cardStyle: 'background: white; border: 1px solid #dcfce7; border-radius: 12px; box-shadow: 0 2px 15px rgba(21,128,61,0.06);',
    fontStyle: 'font-family: "Inter", system-ui, sans-serif;',
    sectionTitle: 'Soluções de Investimento',
    sectionItems: [
      { icon: 'trending_up', title: 'Renda Variável', desc: 'Ações, FIIs e derivativos com análise fundamentalista.' },
      { icon: 'savings', title: 'Renda Fixa', desc: 'CDBs, LCIs, LCAs e Tesouro Direto selecionados.' },
      { icon: 'account_balance', title: 'Previdência', desc: 'PGBL e VGBL com gestão ativa e tributária.' },
      { icon: 'shield', title: 'Proteção Patrimonial', desc: 'Holdings e seguros para blindagem do patrimônio.' },
    ],
  },
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
    heroStyle: 'background: linear-gradient(160deg, #fdf2f8 0%, #fce7f3 40%, #fbcfe8 70%, #f9a8d4 100%);',
    navStyle: 'background: rgba(253,242,248,0.95); border-bottom: 1px solid #fce7f3; box-shadow: 0 2px 20px rgba(190,24,93,0.05);',
    btnStyle: 'background: linear-gradient(135deg, #ec4899, #be185d); color: white; border: none; border-radius: 999px; font-weight: 700;',
    btnText: 'Agendar Procedimento',
    secondaryBtnText: 'Ver Tratamentos',
    bodyBg: '#fdf2f8',
    cardStyle: 'background: white; border: 1px solid #fce7f3; border-radius: 24px; box-shadow: 0 8px 32px rgba(190,24,93,0.06);',
    fontStyle: 'font-family: "Inter", system-ui, sans-serif;',
    sectionTitle: 'Tratamentos Exclusivos',
    sectionItems: [
      { icon: 'face_retouching_natural', title: 'Harmonização Facial', desc: 'Botox, preenchimentos e bioestimuladores.' },
      { icon: 'spa', title: 'Corporal', desc: 'Criolipólise, drenagem e massagem modeladora.' },
      { icon: 'star', title: 'Skincare Premium', desc: 'Peelings, laser e protocolos anti-aging.' },
      { icon: 'auto_awesome', title: 'Capilar', desc: 'Intradermoterapia e transplante FUE.' },
    ],
  },
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
    heroStyle: 'background: linear-gradient(135deg, #4c1d95 0%, #6d28d9 40%, #7c3aed 70%, #8b5cf6 100%);',
    navStyle: 'background: rgba(76,29,149,0.97); border-bottom: 1px solid rgba(167,139,250,0.3);',
    btnStyle: 'background: #fbbf24; color: #4c1d95; border: none; border-radius: 14px; font-weight: 800;',
    btnText: 'Matricule-se Agora',
    secondaryBtnText: 'Aula Gratuita',
    bodyBg: '#faf5ff',
    cardStyle: 'background: white; border: 2px solid #ede9fe; border-radius: 20px; box-shadow: 0 6px 24px rgba(109,40,217,0.08);',
    fontStyle: 'font-family: "Inter", system-ui, sans-serif;',
    sectionTitle: 'Nossos Programas',
    sectionItems: [
      { icon: 'school', title: 'Mentoria Individual', desc: 'Acompanhamento semanal 1:1 com o mentor.' },
      { icon: 'groups', title: 'Turmas ao Vivo', desc: 'Aulas semanais interativas com certificação.' },
      { icon: 'play_circle', title: 'Cursos Gravados', desc: 'Acesso vitalício com mais de 200 aulas.' },
      { icon: 'workspace_premium', title: 'Programa VIP', desc: 'Masterclasses exclusivas e networking.' },
    ],
  },
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
    heroStyle: 'background: linear-gradient(180deg, #020617 0%, #0f172a 50%, #1e293b 100%);',
    navStyle: 'background: rgba(2,6,23,0.9); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(56,189,248,0.15);',
    btnStyle: 'background: linear-gradient(135deg, #06b6d4, #0ea5e9, #38bdf8); color: #020617; border: none; border-radius: 12px; font-weight: 800;',
    btnText: 'Testar Grátis 14 Dias',
    secondaryBtnText: 'Ver Documentação',
    bodyBg: '#020617',
    cardStyle: 'background: rgba(30,41,59,0.6); backdrop-filter: blur(12px); border: 1px solid rgba(56,189,248,0.15); border-radius: 16px;',
    fontStyle: 'font-family: "Inter", ui-monospace, monospace;',
    sectionTitle: 'Tudo que Você Precisa para Escalar',
    sectionItems: [
      { icon: 'speed', title: 'Performance', desc: '99.99% uptime com CDN global de 200+ PoPs.' },
      { icon: 'security', title: 'Segurança', desc: 'Criptografia AES-256 e autenticação 2FA.' },
      { icon: 'api', title: 'API RESTful', desc: 'Documentação completa com SDKs em 8 linguagens.' },
      { icon: 'analytics', title: 'Analytics', desc: 'Dashboard em tempo real com métricas avançadas.' },
    ],
  },
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
    heroStyle: 'background: linear-gradient(135deg, #0c0a09 0%, #1c1917 40%, #292524 100%);',
    navStyle: 'background: rgba(12,10,9,0.97); border-bottom: 2px solid #dc2626;',
    btnStyle: 'background: #dc2626; color: white; border: none; border-radius: 4px; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase;',
    btnText: 'Agendar Serviço',
    secondaryBtnText: 'Ver Pacotes',
    bodyBg: '#1c1917',
    cardStyle: 'background: #292524; border: 1px solid #44403c; border-radius: 8px;',
    fontStyle: 'font-family: "Inter", system-ui, sans-serif;',
    sectionTitle: 'Serviços Premium',
    sectionItems: [
      { icon: 'local_car_wash', title: 'Polimento Espelhado', desc: 'Correção de pintura com acabamento show car.' },
      { icon: 'shield', title: 'PPF & Ceramic Coating', desc: 'Proteção de pintura com garantia de 5 anos.' },
      { icon: 'build', title: 'Manutenção Preventiva', desc: 'Revisão completa com peças originais.' },
      { icon: 'directions_car', title: 'Customização', desc: 'Envelopamento, rebaixamento e rodas esportivas.' },
    ],
  },
]

const filteredTemplates = computed(() => {
  if (activeCategory.value === 'all') return templates
  return templates.filter((t) => t.categoryId === activeCategory.value)
})

function openPreview(tpl: SiteTemplate) {
  selectedPreviewTemplate.value = tpl
  previewDevice.value = 'desktop'
}

function closePreview() {
  selectedPreviewTemplate.value = null
}

function isDark(tpl: SiteTemplate) {
  return ['cloud-saas', 'auto-elite', 'gourmet-bistro'].includes(tpl.id)
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
          Modelos de Sites <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-600">Profissionais</span>
        </h1>
        <p class="font-body text-base sm:text-lg text-gray-600 leading-relaxed">
          Cada modelo tem identidade visual única, otimizado para o seu nicho de mercado. Escolha e personalizamos para você.
        </p>
      </div>

      <!-- Category Filter -->
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
      <TransitionGroup
        name="card"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <div
          v-for="tpl in filteredTemplates"
          :key="tpl.id"
          class="group bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2"
        >
          <!-- Image with unique accent bar -->
          <div class="relative h-56 overflow-hidden cursor-pointer" @click="openPreview(tpl)">
            <img
              :src="tpl.previewImage"
              :alt="tpl.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <!-- Accent bar at bottom of image -->
            <div class="absolute bottom-0 left-0 w-full h-1" :style="{ background: tpl.accentColor }" />

            <!-- Category pill on image -->
            <div
              class="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold text-white backdrop-blur-md"
              :style="{ background: tpl.accentColor + 'dd' }"
            >
              {{ tpl.category }}
            </div>

            <!-- Hover overlay -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span class="px-5 py-2.5 bg-white/95 text-gray-900 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px]">visibility</span>
                Ver Demonstração
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 flex-1 flex flex-col">
            <h3 class="font-heading text-xl font-bold text-gray-900 mb-2">{{ tpl.title }}</h3>
            <p class="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed flex-1">{{ tpl.description }}</p>

            <!-- Feature chips -->
            <div class="flex flex-wrap gap-1.5 mb-5">
              <span
                v-for="feat in tpl.features"
                :key="feat"
                class="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                :style="{ background: tpl.accentColor + '15', color: tpl.accentColor }"
              >
                {{ feat }}
              </span>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button
                @click="openPreview(tpl)"
                class="flex-1 py-3 rounded-xl text-xs font-bold bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <span class="material-symbols-outlined text-[16px]">open_in_new</span>
                Ver Modelo
              </button>
              <a
                href="/#contact"
                class="flex-1 py-3 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-lg hover:scale-[1.02]"
                :style="{ background: tpl.accentColor }"
              >
                <span class="material-symbols-outlined text-[16px]">check</span>
                Quero Este
              </a>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- PREVIEW MODAL - cada template renderiza um design visualmente ÚNICO -->
    <Transition name="modal">
      <div
        v-if="selectedPreviewTemplate"
        class="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex flex-col"
        @click.self="closePreview"
      >
        <!-- Toolbar -->
        <div class="bg-gray-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-gray-800 shrink-0">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-3 h-3 rounded-full shrink-0" :style="{ background: selectedPreviewTemplate.accentColor }" />
            <h2 class="font-heading font-bold text-sm sm:text-base text-white truncate">
              {{ selectedPreviewTemplate.title }}
            </h2>
          </div>

          <!-- Device Switcher -->
          <div class="hidden md:flex items-center bg-gray-800 p-1 rounded-xl gap-0.5">
            <button
              v-for="d in [{ key: 'desktop', icon: 'desktop_windows', label: 'Desktop' }, { key: 'tablet', icon: 'tablet', label: 'Tablet' }, { key: 'mobile', icon: 'smartphone', label: 'Mobile' }]"
              :key="d.key"
              @click="previewDevice = d.key as any"
              :class="['px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5', previewDevice === d.key ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-white']"
            >
              <span class="material-symbols-outlined text-[16px]">{{ d.icon }}</span>
              {{ d.label }}
            </button>
          </div>

          <div class="flex items-center gap-2">
            <a href="/#contact" class="hidden sm:inline-flex px-4 py-1.5 text-xs font-bold rounded-lg text-white" :style="{ background: selectedPreviewTemplate.accentColor }">
              Quero um Site Igual
            </a>
            <button @click="closePreview" class="p-2 text-gray-400 hover:text-white transition-colors">
              <span class="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </div>

        <!-- Preview Container -->
        <div class="flex-1 overflow-y-auto p-3 sm:p-6 flex items-start justify-center">
          <div
            :class="[
              'transition-all duration-500 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col',
              previewDevice === 'desktop' ? 'w-full max-w-5xl' : '',
              previewDevice === 'tablet' ? 'w-[768px]' : '',
              previewDevice === 'mobile' ? 'w-[390px]' : ''
            ]"
            :style="{ minHeight: '80vh' }"
          >
            <!-- Browser Chrome -->
            <div class="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-3 shrink-0">
              <div class="flex gap-1.5">
                <div class="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div class="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div class="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div class="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1 text-[11px] text-gray-500 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-emerald-600 text-[12px]">lock</span>
                https://{{ selectedPreviewTemplate.id }}.tarif.com.br
              </div>
            </div>

            <!-- ==================== UNIQUE SITE RENDER ==================== -->
            <div class="flex-1 overflow-y-auto" :style="{ background: selectedPreviewTemplate.bodyBg, ...Object.fromEntries([[' ', '']]) }">

              <!-- NAV BAR (unique per template) -->
              <nav class="px-6 py-3 flex items-center justify-between" :style="selectedPreviewTemplate.navStyle">
                <span class="text-sm font-bold" :style="{ color: isDark(selectedPreviewTemplate) ? 'white' : '#111', fontFamily: selectedPreviewTemplate.fontStyle.split(':')[1]?.replace(/[';]/g,'').trim() || 'inherit' }">
                  {{ selectedPreviewTemplate.title }}
                </span>
                <div class="hidden sm:flex items-center gap-5">
                  <span v-for="link in ['Sobre', 'Serviços', 'Contato']" :key="link" class="text-[11px] font-medium cursor-pointer transition-opacity hover:opacity-70" :style="{ color: isDark(selectedPreviewTemplate) ? 'rgba(255,255,255,0.7)' : '#6b7280' }">
                    {{ link }}
                  </span>
                  <button class="px-4 py-1.5 text-[11px]" :style="selectedPreviewTemplate.btnStyle">
                    {{ selectedPreviewTemplate.btnText.split(' ').slice(0, 2).join(' ') }}
                  </button>
                </div>
              </nav>

              <!-- HERO SECTION (each has completely different layout) -->
              <div class="relative overflow-hidden" :style="selectedPreviewTemplate.heroStyle">

                <!-- Hero Image Overlay -->
                <img :src="selectedPreviewTemplate.previewImage" class="absolute inset-0 w-full h-full object-cover" :class="[
                  selectedPreviewTemplate.id === 'arch-studio' ? 'opacity-10' : 'opacity-20',
                  selectedPreviewTemplate.id === 'glow-aesthetic' ? 'opacity-15 mix-blend-multiply' : '',
                  selectedPreviewTemplate.id === 'med-clinic' ? 'opacity-10 mix-blend-overlay' : '',
                ]" />

                <!-- Hero Content - Unique layouts per template -->
                <div class="relative z-10" :style="selectedPreviewTemplate.fontStyle">

                  <!-- ADVOCACIA: Split centered, serif, gold accents -->
                  <div v-if="selectedPreviewTemplate.id === 'lex-juridic'" class="py-20 sm:py-28 px-8 text-center">
                    <div class="w-16 h-[2px] bg-yellow-500 mx-auto mb-6" />
                    <p class="text-yellow-400 text-xs uppercase tracking-[0.3em] mb-4 font-semibold">Escritório de Advocacia</p>
                    <h1 class="text-3xl sm:text-5xl font-bold text-white mb-5 leading-tight" style="font-family: Georgia, serif;">{{ selectedPreviewTemplate.title }}</h1>
                    <p class="text-gray-300 text-sm max-w-xl mx-auto mb-8 leading-relaxed">{{ selectedPreviewTemplate.description }}</p>
                    <div class="flex justify-center gap-4">
                      <button class="px-7 py-3 text-xs" :style="selectedPreviewTemplate.btnStyle">{{ selectedPreviewTemplate.btnText }}</button>
                      <button class="px-7 py-3 text-xs text-yellow-400 border border-yellow-500/50 bg-transparent" style="border-radius: 4px;">{{ selectedPreviewTemplate.secondaryBtnText }}</button>
                    </div>
                    <div class="w-16 h-[2px] bg-yellow-500 mx-auto mt-10" />
                  </div>

                  <!-- SAÚDE: Soft gradient, rounded, warm -->
                  <div v-else-if="selectedPreviewTemplate.id === 'med-clinic'" class="py-16 sm:py-24 px-8 flex flex-col sm:flex-row items-center gap-10 max-w-5xl mx-auto">
                    <div class="flex-1 text-left">
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-[10px] font-bold mb-4">
                        <span class="material-symbols-outlined text-[14px]">verified</span>
                        Clínica Credenciada
                      </span>
                      <h1 class="text-3xl sm:text-4xl font-extrabold text-sky-900 mb-4 leading-tight">Sua saúde em <span class="text-sky-500">boas mãos</span></h1>
                      <p class="text-sky-700/70 text-sm mb-6 leading-relaxed max-w-md">{{ selectedPreviewTemplate.description }}</p>
                      <div class="flex gap-3">
                        <button class="px-6 py-3 text-xs flex items-center gap-2" :style="selectedPreviewTemplate.btnStyle">
                          <span class="material-symbols-outlined text-[16px]">call</span>
                          {{ selectedPreviewTemplate.btnText }}
                        </button>
                      </div>
                    </div>
                    <div class="w-48 h-48 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-sky-200 shrink-0">
                      <img :src="selectedPreviewTemplate.previewImage" class="w-full h-full object-cover" />
                    </div>
                  </div>

                  <!-- IMOBILIÁRIA: Full-width hero with search bar -->
                  <div v-else-if="selectedPreviewTemplate.id === 'imovel-prime'" class="py-20 sm:py-28 px-8 text-center">
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">Encontre o imóvel <span class="text-teal-300">perfeito</span></h1>
                    <p class="text-teal-100/70 text-sm mb-8 max-w-xl mx-auto">{{ selectedPreviewTemplate.description }}</p>
                    <div class="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-2 flex gap-2 border border-teal-400/20">
                      <div class="flex-1 bg-white/15 rounded-xl px-4 py-3 text-left">
                        <p class="text-[9px] text-teal-300 font-bold uppercase tracking-wider">Localização</p>
                        <p class="text-white text-xs">São Paulo, SP</p>
                      </div>
                      <div class="flex-1 bg-white/15 rounded-xl px-4 py-3 text-left hidden sm:block">
                        <p class="text-[9px] text-teal-300 font-bold uppercase tracking-wider">Tipo</p>
                        <p class="text-white text-xs">Apartamento</p>
                      </div>
                      <div class="flex-1 bg-white/15 rounded-xl px-4 py-3 text-left hidden sm:block">
                        <p class="text-[9px] text-teal-300 font-bold uppercase tracking-wider">Valor até</p>
                        <p class="text-white text-xs">R$ 800.000</p>
                      </div>
                      <button class="px-6 py-3 text-xs shrink-0 flex items-center gap-1.5" :style="selectedPreviewTemplate.btnStyle">
                        <span class="material-symbols-outlined text-[16px]">search</span>
                        Buscar
                      </button>
                    </div>
                  </div>

                  <!-- GASTRONOMIA: Editorial, warm tones, menu style -->
                  <div v-else-if="selectedPreviewTemplate.id === 'gourmet-bistro'" class="py-24 sm:py-32 px-8 text-center">
                    <p class="text-amber-400 text-[10px] uppercase tracking-[0.4em] mb-3">Experiência Gastronômica</p>
                    <h1 class="text-4xl sm:text-6xl font-bold text-white mb-4" style="font-family: 'Playfair Display', Georgia, serif;">GourmetBistro</h1>
                    <div class="w-20 h-[1px] bg-amber-400/50 mx-auto mb-4" />
                    <p class="text-stone-400 text-xs mb-8 max-w-md mx-auto italic leading-relaxed">{{ selectedPreviewTemplate.description }}</p>
                    <div class="flex justify-center gap-4">
                      <button class="px-8 py-3 text-[10px]" :style="selectedPreviewTemplate.btnStyle">{{ selectedPreviewTemplate.btnText }}</button>
                      <button class="px-8 py-3 text-[10px] text-amber-400 border border-amber-400/40 bg-transparent" style="letter-spacing: 0.15em; text-transform: uppercase;">{{ selectedPreviewTemplate.secondaryBtnText }}</button>
                    </div>
                  </div>

                  <!-- ARQUITETURA: Ultra-minimal, asymmetric, B&W -->
                  <div v-else-if="selectedPreviewTemplate.id === 'arch-studio'" class="py-20 sm:py-28 px-8 sm:px-16">
                    <div class="max-w-4xl">
                      <p class="text-gray-400 text-[10px] uppercase tracking-[0.25em] mb-6 font-medium">Estúdio de Arquitetura & Design</p>
                      <h1 class="text-4xl sm:text-6xl font-light text-gray-900 mb-6 leading-[1.1]" style="font-family: 'Helvetica Neue', Arial, sans-serif;">Design que <br><span class="font-bold">transforma espaços</span></h1>
                      <div class="w-20 h-[2px] bg-gray-900 mb-6" />
                      <p class="text-gray-500 text-sm mb-8 max-w-md leading-relaxed">{{ selectedPreviewTemplate.description }}</p>
                      <div class="flex gap-4">
                        <button class="px-8 py-3 text-[10px]" :style="selectedPreviewTemplate.btnStyle">{{ selectedPreviewTemplate.btnText }}</button>
                        <button class="px-8 py-3 text-[10px] text-gray-900 border border-gray-300 bg-transparent" style="letter-spacing: 0.1em; text-transform: uppercase;">{{ selectedPreviewTemplate.secondaryBtnText }}</button>
                      </div>
                    </div>
                  </div>

                  <!-- FINANÇAS: Corporate, green accents, data-feel -->
                  <div v-else-if="selectedPreviewTemplate.id === 'finance-wealth'" class="py-20 sm:py-28 px-8 text-center">
                    <span class="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-400/20 text-emerald-300 rounded-full text-[10px] font-bold mb-5 border border-emerald-400/30">
                      <span class="material-symbols-outlined text-[14px]">trending_up</span>
                      +127% de rentabilidade média
                    </span>
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">Seu patrimônio merece <span class="text-emerald-400">estratégia</span></h1>
                    <p class="text-emerald-100/60 text-sm mb-8 max-w-xl mx-auto">{{ selectedPreviewTemplate.description }}</p>
                    <div class="flex justify-center gap-4">
                      <button class="px-7 py-3 text-xs" :style="selectedPreviewTemplate.btnStyle">{{ selectedPreviewTemplate.btnText }}</button>
                      <button class="px-7 py-3 text-xs text-emerald-300 border border-emerald-400/40 rounded-lg bg-transparent">{{ selectedPreviewTemplate.secondaryBtnText }}</button>
                    </div>
                  </div>

                  <!-- ESTÉTICA: Elegant, soft pink, luxury feel -->
                  <div v-else-if="selectedPreviewTemplate.id === 'glow-aesthetic'" class="py-16 sm:py-24 px-8 flex flex-col sm:flex-row items-center gap-10 max-w-5xl mx-auto">
                    <div class="flex-1 text-left">
                      <p class="text-pink-400 text-[10px] uppercase tracking-[0.2em] mb-3 font-bold">Clínica de Estética Premium</p>
                      <h1 class="text-3xl sm:text-4xl font-extrabold text-pink-900 mb-4 leading-tight">Realce sua <span class="text-pink-500">beleza natural</span></h1>
                      <p class="text-pink-700/50 text-sm mb-6 max-w-md leading-relaxed">{{ selectedPreviewTemplate.description }}</p>
                      <button class="px-7 py-3 text-xs" :style="selectedPreviewTemplate.btnStyle">{{ selectedPreviewTemplate.btnText }}</button>
                    </div>
                    <div class="w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden shadow-2xl ring-4 ring-pink-200 shrink-0">
                      <img :src="selectedPreviewTemplate.previewImage" class="w-full h-full object-cover" />
                    </div>
                  </div>

                  <!-- EDUCAÇÃO: Vibrant purple, playful -->
                  <div v-else-if="selectedPreviewTemplate.id === 'edu-master'" class="py-20 sm:py-28 px-8 text-center">
                    <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400/20 text-amber-300 rounded-full text-[10px] font-bold mb-5 border border-amber-400/30">
                      🔥 Vagas Limitadas — Turma de Agosto
                    </div>
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">Aprenda com quem <span class="text-amber-400">faz acontecer</span></h1>
                    <p class="text-purple-200/60 text-sm mb-8 max-w-xl mx-auto">{{ selectedPreviewTemplate.description }}</p>
                    <div class="flex justify-center gap-4">
                      <button class="px-7 py-3 text-xs" :style="selectedPreviewTemplate.btnStyle">{{ selectedPreviewTemplate.btnText }}</button>
                      <button class="px-7 py-3 text-xs text-amber-300 border border-amber-400/40 rounded-xl bg-transparent">{{ selectedPreviewTemplate.secondaryBtnText }}</button>
                    </div>
                    <div class="flex justify-center gap-6 mt-10 text-white/50 text-[10px]">
                      <span class="flex items-center gap-1"><span class="material-symbols-outlined text-amber-400 text-[14px]">people</span> +2.500 Alunos</span>
                      <span class="flex items-center gap-1"><span class="material-symbols-outlined text-amber-400 text-[14px]">star</span> 4.9/5 Avaliação</span>
                      <span class="flex items-center gap-1"><span class="material-symbols-outlined text-amber-400 text-[14px]">verified</span> Certificado</span>
                    </div>
                  </div>

                  <!-- TECNOLOGIA: Dark neon, glassmorphism, tech -->
                  <div v-else-if="selectedPreviewTemplate.id === 'cloud-saas'" class="py-20 sm:py-28 px-8 text-center">
                    <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 text-cyan-400 rounded-full text-[10px] font-bold mb-5 border border-cyan-500/20">
                      <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      v3.2 — Lançamento Hoje
                    </div>
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">Infraestrutura que <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">escala</span></h1>
                    <p class="text-slate-400 text-sm mb-8 max-w-xl mx-auto font-mono">{{ selectedPreviewTemplate.description }}</p>
                    <div class="flex justify-center gap-4">
                      <button class="px-7 py-3 text-xs" :style="selectedPreviewTemplate.btnStyle">{{ selectedPreviewTemplate.btnText }}</button>
                      <button class="px-7 py-3 text-xs text-cyan-300 border border-cyan-500/30 rounded-xl bg-cyan-500/5 backdrop-blur-sm">{{ selectedPreviewTemplate.secondaryBtnText }}</button>
                    </div>
                    <div class="mt-10 mx-auto max-w-md bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-left font-mono">
                      <p class="text-slate-500 text-[10px]">$ npm install</p>
                      <p class="text-cyan-400 text-[10px]">$ cloudsaas init --project my-app</p>
                      <p class="text-emerald-400 text-[10px]">✓ Projeto criado com sucesso!</p>
                    </div>
                  </div>

                  <!-- AUTOMOTIVO: Bold, angular, racing -->
                  <div v-else-if="selectedPreviewTemplate.id === 'auto-elite'" class="py-20 sm:py-28 px-8">
                    <div class="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-8">
                      <div class="flex-1">
                        <div class="w-12 h-1 bg-red-600 mb-5" />
                        <h1 class="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight uppercase tracking-tight">Performance <span class="text-red-500">Premium</span></h1>
                        <p class="text-stone-400 text-sm mb-6 max-w-md leading-relaxed">{{ selectedPreviewTemplate.description }}</p>
                        <div class="flex gap-3">
                          <button class="px-7 py-3 text-[10px]" :style="selectedPreviewTemplate.btnStyle">{{ selectedPreviewTemplate.btnText }}</button>
                          <button class="px-7 py-3 text-[10px] text-red-400 border-2 border-red-600 bg-transparent uppercase tracking-wider font-bold" style="border-radius: 4px;">{{ selectedPreviewTemplate.secondaryBtnText }}</button>
                        </div>
                      </div>
                      <div class="w-48 h-48 sm:w-56 sm:h-56 rounded-xl overflow-hidden border-2 border-red-600/30 shrink-0 shadow-[0_0_40px_rgba(220,38,38,0.2)]">
                        <img :src="selectedPreviewTemplate.previewImage" class="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>

                  <!-- Fallback genérico -->
                  <div v-else class="py-20 px-8 text-center">
                    <h1 class="text-3xl sm:text-5xl font-extrabold text-white mb-5">{{ selectedPreviewTemplate.title }}</h1>
                    <p class="text-white/60 text-sm mb-8 max-w-xl mx-auto">{{ selectedPreviewTemplate.description }}</p>
                    <button class="px-7 py-3 text-xs" :style="selectedPreviewTemplate.btnStyle">{{ selectedPreviewTemplate.btnText }}</button>
                  </div>
                </div>
              </div>

              <!-- FEATURES SECTION (unique card styles per template) -->
              <div class="px-6 sm:px-12 py-12 sm:py-16" :style="{ background: selectedPreviewTemplate.bodyBg }">
                <div class="max-w-4xl mx-auto">
                  <h2
                    class="text-xl sm:text-2xl font-bold mb-8 text-center"
                    :style="{ color: isDark(selectedPreviewTemplate) ? 'white' : '#111', fontFamily: selectedPreviewTemplate.fontStyle.split(':')[1]?.replace(/[';]/g,'').trim() || 'inherit' }"
                  >
                    {{ selectedPreviewTemplate.sectionTitle }}
                  </h2>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      v-for="(item, i) in selectedPreviewTemplate.sectionItems"
                      :key="i"
                      class="p-5 flex items-start gap-4 transition-all duration-300 hover:-translate-y-1"
                      :style="selectedPreviewTemplate.cardStyle"
                    >
                      <div
                        class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        :style="{ background: selectedPreviewTemplate.accentColor + '20' }"
                      >
                        <span class="material-symbols-outlined text-lg" :style="{ color: selectedPreviewTemplate.accentColor }">{{ item.icon }}</span>
                      </div>
                      <div>
                        <h4 class="font-bold text-sm mb-1" :style="{ color: isDark(selectedPreviewTemplate) ? 'white' : '#111' }">{{ item.title }}</h4>
                        <p class="text-xs leading-relaxed" :style="{ color: isDark(selectedPreviewTemplate) ? 'rgba(255,255,255,0.5)' : '#6b7280' }">{{ item.desc }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- CTA FOOTER (unique per template) -->
              <div class="px-8 py-12 text-center" :style="selectedPreviewTemplate.heroStyle">
                <div class="relative z-10">
                  <h3 class="text-xl sm:text-2xl font-bold text-white mb-4" :style="selectedPreviewTemplate.fontStyle">
                    Pronto para transformar seu negócio?
                  </h3>
                  <p class="text-white/60 text-xs mb-6 max-w-md mx-auto">Entre em contato e receba uma proposta personalizada em até 24 horas.</p>
                  <button class="px-8 py-3 text-xs" :style="selectedPreviewTemplate.btnStyle">{{ selectedPreviewTemplate.btnText }}</button>
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
/* Card grid transition */
.card-enter-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.card-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.card-enter-from { opacity: 0; transform: translateY(20px) scale(0.95); }
.card-leave-to { opacity: 0; transform: scale(0.9); }
.card-move { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }

/* Modal transition */
.modal-enter-active { transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.modal-leave-active { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.modal-enter-from { opacity: 0; }
.modal-leave-to { opacity: 0; }
.modal-enter-from > div:last-child { transform: scale(0.95) translateY(10px); }
</style>
