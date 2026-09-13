<script setup lang="ts">
import DemoNavigation from '~/components/campaign/DemoNavigation.vue'
import DemoContact from '~/components/campaign/DemoContact.vue'

definePageMeta({ layout: 'demonstracao' })

useDemoSeo(
  'Adega Tonel do Rudge — Tradição em Vinhos e Bebidas Finas',
  'Site institucional da Adega Tonel do Rudge em São Bernardo do Campo. Rótulos selecionados nacionais e importados, queijos artesanais e bebidas para eventos.'
)

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap'
    }
  ]
})

// Interactive catalog filter
type CategoryKey = 'todos' | 'brancos' | 'tintos' | 'espumantes' | 'queijos'

const activeCategory = ref<CategoryKey>('todos')

interface Product {
  id: string
  name: string
  category: CategoryKey
  categoryLabel: string
  country: string
  description: string
  image: string
  alt: string
}

const products: Product[] = [
  {
    id: 'santa-helena-chardonnay',
    name: 'Santa Helena Chardonnay',
    category: 'brancos',
    categoryLabel: 'Vinho Branco',
    country: 'Chile',
    description: 'Notas cítricas e de abacaxi maduro, acidez fresca e final equilibrado.',
    image: '/images/campaign/adega/santa-helena-chardonnay.jpg',
    alt: 'Garrafa de vinho Santa Helena Chardonnay'
  },
  {
    id: 'santa-helena-riesling',
    name: 'Santa Helena Riesling',
    category: 'brancos',
    categoryLabel: 'Vinho Branco',
    country: 'Chile',
    description: 'Aromas florais e toques minerais expressivos, corpo leve e agradável vivacidade.',
    image: '/images/campaign/adega/santa-helena-riesling.jpg',
    alt: 'Garrafa de vinho Santa Helena Riesling'
  },
  {
    id: 'los-vascos-pinot-grigio',
    name: 'Los Vascos Pinot Grigio',
    category: 'brancos',
    categoryLabel: 'Vinho Branco',
    country: 'Chile · Rothschild',
    description: 'Refinamento do grupo Domaines Barons de Rothschild. Elegância cítrica e frescor mineral.',
    image: '/images/campaign/adega/los-vascos-pinot-grigio.jpg',
    alt: 'Garrafa de vinho Los Vascos Pinot Grigio'
  },
  {
    id: 'santa-ana-sauvignon',
    name: 'Santa Ana Sauvignon Blanc',
    category: 'brancos',
    categoryLabel: 'Vinho Branco',
    country: 'Argentina',
    description: 'Frutas tropicais verdes, maracujá e lima com acidez crocante e muito refrescante.',
    image: '/images/campaign/adega/santa-ana-sauvignon.jpg',
    alt: 'Garrafa de vinho Santa Ana Sauvignon Blanc'
  },
  {
    id: 'casa-valduga-brut',
    name: 'Casa Valduga Brut Champenoise',
    category: 'espumantes',
    categoryLabel: 'Espumante Brut',
    country: 'Brasil · Vale dos Vinhedos',
    description: 'Elaborado pelo método tradicional com maturação prolongada em caves subterrâneas.',
    image: '/images/campaign/adega/casa-valduga-brut.jpg',
    alt: 'Garrafa de espumante Casa Valduga Brut Champenoise'
  },
  {
    id: 'chandon-reserve-brut',
    name: 'Chandon Réserve Brut',
    category: 'espumantes',
    categoryLabel: 'Espumante Brut',
    country: 'Brasil · Serra Gaúcha',
    description: 'Clássico ícone brasileiro. Sutis notas de frutas secas, pão tostado e cremosidade única.',
    image: '/images/campaign/adega/chandon-reserve-brut.jpg',
    alt: 'Garrafa de espumante Chandon Réserve Brut'
  },
  {
    id: 'gouda-holandes',
    name: 'Gouda Holandês Curado',
    category: 'queijos',
    categoryLabel: 'Queijo Nobre',
    country: 'Holanda',
    description: 'Massa semidura maturada, cristais crocantes de tirosina e sabor caramelizado complexo.',
    image: '/images/campaign/adega/gouda-holandes.jpg',
    alt: 'Cunha de queijo Gouda Holandês'
  },
  {
    id: 'tons-malbec',
    name: 'Tons de Duorum / Malbec',
    category: 'tintos',
    categoryLabel: 'Vinho Tinto',
    country: 'Argentina · Mendoza',
    description: 'Frutas vermelhas maduras, ameixa preta e taninos aveludados com passagem por carvalho.',
    image: '/images/campaign/adega/tons-malbec.jpg',
    alt: 'Garrafa de vinho Tons Malbec Mendoza'
  }
]

const filteredProducts = computed(() => {
  if (activeCategory.value === 'todos') return products
  return products.filter(p => p.category === activeCategory.value)
})

function productWhatsapp(productName: string) {
  const text = encodeURIComponent(`Olá! Gostaria de consultar a disponibilidade do ${productName} na Adega Tonel do Rudge.`)
  return `https://wa.me/551143652020?text=${text}`
}
</script>

<template>
  <div class="adega-root bg-[#F8FAF6] text-[#191C1A] selection:bg-[#B18A52]/20 selection:text-[#031020]">
    <!-- Top Header -->
    <header class="sticky top-0 z-40 w-full border-b border-[#B18A52]/20 bg-[#FFFDF8]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(24,37,54,0.06)]">
      <div class="mx-auto flex h-20 max-w-[1320px] items-center justify-between px-5 md:px-12">
        <a href="#inicio" class="group flex flex-col">
          <span class="font-['Playfair_Display'] text-xl font-bold tracking-tight text-[#031020] transition-colors group-hover:text-[#934655] md:text-2xl">
            ADEGA TONEL
          </span>
          <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-[0.2em] text-[#B18A52]">
            DO RUDGE · DESDE 1977
          </span>
        </a>

        <!-- Desktop Navigation -->
        <DemoNavigation dark>
          <nav aria-label="Navegação da Adega" class="flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#44474C]">
            <a href="#inicio" class="py-1 transition-colors hover:text-[#031020]">Início</a>
            <a href="#a-adega" class="py-1 transition-colors hover:text-[#031020]">A Adega</a>
            <a href="#categorias" class="py-1 transition-colors hover:text-[#031020]">Categorias</a>
            <a href="#catalogo" class="py-1 transition-colors hover:text-[#031020]">Catálogo</a>
            <a href="#eventos" class="py-1 transition-colors hover:text-[#031020]">Eventos</a>
            <a href="#localizacao" class="py-1 transition-colors hover:text-[#031020]">Localização</a>
          </nav>
        </DemoNavigation>

        <!-- Header CTA -->
        <div class="flex items-center gap-3">
          <a
            href="https://wa.me/551143652020?text=Ol%C3%A1,%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20r%C3%B3tulos%20da%20Adega%20Tonel."
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-lg border border-[#B18A52]/40 bg-[#031020] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FFFDF8] shadow-sm transition-all hover:bg-[#182536] hover:border-[#B18A52]"
          >
            <span class="material-symbols-outlined text-sm text-[#B18A52]">chat</span>
            <span class="hidden sm:inline">(11) 4365-2020</span>
            <span class="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </div>
    </header>

    <!-- SECTION 1: HERO -->
    <section id="inicio" class="relative isolate overflow-hidden bg-[#031020] text-white">
      <div
        class="absolute inset-0 -z-20 bg-cover bg-center opacity-35 transition-transform duration-1000 scale-105"
        style="background-image: url('/images/campaign/adega/hero-bg.jpg');"
      />
      <div class="absolute inset-0 -z-10 bg-gradient-to-t from-[#031020] via-[#031020]/75 to-transparent" />
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-[#031020]/90 via-[#031020]/40 to-transparent" />

      <div class="mx-auto flex min-h-[640px] max-w-[1320px] flex-col justify-center px-5 py-24 md:px-12 lg:py-32">
        <div class="max-w-3xl">
          <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-[#B18A52]/40 bg-[#FFFDF8]/10 px-4 py-1.5 backdrop-blur-sm">
            <span class="h-2 w-2 rounded-full bg-[#B18A52] animate-pulse" />
            <span class="text-xs font-bold uppercase tracking-[0.25em] text-[#B18A52]">Desde 1977 · Rudge Ramos, SBC</span>
          </div>

          <h1 class="font-['Playfair_Display'] text-4xl font-bold leading-[1.1] tracking-tight text-[#FFFDF8] sm:text-6xl md:text-7xl">
            Tradição que se aprecia <span class="italic text-[#d6e3fa]">em cada taça.</span>
          </h1>

          <p class="mt-6 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
            Uma curadoria exclusiva de vinhos nacionais e importados, queijos nobres e bebidas especiais para transformar qualquer momento em celebração. Atendimento personalizado para amantes do bom vinho e eventos inesquecíveis.
          </p>

          <div class="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#catalogo"
              class="inline-flex items-center gap-2 rounded-lg bg-[#B18A52] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-[#9d7742]"
            >
              <span class="material-symbols-outlined text-base">wine_bar</span>
              <span>Explorar Rótulos</span>
            </a>
            <a
              href="https://wa.me/551143652020?text=Ol%C3%A1!%20Gostaria%20de%20uma%20recomenda%C3%A7%C3%A3o%20especial%20de%20vinho%20na%20Adega%20Tonel."
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              <span class="material-symbols-outlined text-base text-[#B18A52]">chat</span>
              <span>Falar com o Sommelier</span>
            </a>
          </div>

          <!-- Quick badges -->
          <div class="mt-14 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
            <div>
              <p class="font-['Playfair_Display'] text-2xl font-bold text-[#B18A52] md:text-3xl">+800</p>
              <p class="mt-1 text-xs text-gray-400">Rótulos e safras catalogadas</p>
            </div>
            <div>
              <p class="font-['Playfair_Display'] text-2xl font-bold text-[#B18A52] md:text-3xl">47 Anos</p>
              <p class="mt-1 text-xs text-gray-400">De história e tradição no ABC</p>
            </div>
            <div class="col-span-2 sm:col-span-1">
              <p class="font-['Playfair_Display'] text-2xl font-bold text-[#B18A52] md:text-3xl">Eventos</p>
              <p class="mt-1 text-xs text-gray-400">Consignação e cálculo sob medida</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: A ADEGA -->
    <section id="a-adega" class="w-full bg-[#F8FAF6] py-20 md:py-28">
      <div class="mx-auto max-w-[1320px] px-5 md:px-12">
        <div class="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div class="relative lg:col-span-6">
            <div class="relative overflow-hidden rounded-2xl bg-[#E1E3DF] shadow-xl">
              <img
                src="/images/campaign/adega/vinhedos.jpg"
                alt="Vinhedos e tradição da Adega Tonel do Rudge"
                loading="lazy"
                class="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div class="absolute -bottom-6 -right-4 rounded-xl border border-[#B18A52]/30 bg-[#031020] p-5 text-[#FFFDF8] shadow-2xl sm:-right-6 sm:bottom-8 sm:p-6">
              <p class="font-['Playfair_Display'] text-3xl font-bold text-[#B18A52] sm:text-4xl">1977</p>
              <p class="mt-1 text-xs font-medium uppercase tracking-wider text-gray-300">Ano de Fundação</p>
              <p class="mt-0.5 text-[11px] text-gray-400">Rudge Ramos · São Bernardo</p>
            </div>
          </div>

          <div class="lg:col-span-6">
            <div class="mb-3 inline-flex items-center gap-2 text-[#B18A52]">
              <span class="material-symbols-outlined text-lg">history_edu</span>
              <span class="text-xs font-bold uppercase tracking-[0.25em]">Tradição e Família</span>
            </div>

            <h2 class="font-['Playfair_Display'] text-3xl font-bold leading-tight tracking-tight text-[#031020] sm:text-4xl md:text-5xl">
              Uma história construída ao longo de gerações.
            </h2>

            <p class="mt-6 text-base leading-relaxed text-[#44474C]">
              Fundada há mais de quatro décadas no coração do Rudge Ramos, a <strong>Adega Tonel</strong> nasceu do amor genuíno pela enologia e pelo acolhimento caloroso aos apreciadores de boas bebidas.
            </p>

            <p class="mt-4 text-base leading-relaxed text-[#44474C]">
              Mantemos o compromisso de oferecer não apenas produtos, mas uma consultoria dedicada: cada cliente encontra a sugestão perfeita para o jantar em família, a celebração com amigos ou o presente inesquecível.
            </p>

            <div class="mt-8 space-y-4 border-t border-[#B18A52]/20 pt-6">
              <div class="flex items-start gap-4">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#B18A52]/10 text-[#B18A52]">
                  <span class="material-symbols-outlined text-xl">award_star</span>
                </div>
                <div>
                  <h4 class="font-semibold text-[#031020]">Curadoria Especializada</h4>
                  <p class="text-sm text-[#44474C]">Rótulos garimpados nas melhores vinícolas da América do Sul e da Europa.</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#B18A52]/10 text-[#B18A52]">
                  <span class="material-symbols-outlined text-xl">thermostat</span>
                </div>
                <div>
                  <h4 class="font-semibold text-[#031020]">Armazenamento Cuidadoso</h4>
                  <p class="text-sm text-[#44474C]">Ambiente controlado para manter a integridade, o bouquet e o potencial de guarda dos vinhos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3: CATEGORIAS -->
    <section id="categorias" class="w-full bg-[#F2F4F0] py-20 md:py-28">
      <div class="mx-auto max-w-[1320px] px-5 md:px-12">
        <div class="mx-auto max-w-2xl text-center">
          <div class="mb-3 inline-flex items-center gap-2 text-[#B18A52]">
            <span class="material-symbols-outlined text-lg">liquor</span>
            <span class="text-xs font-bold uppercase tracking-[0.25em]">Nossas Especialidades</span>
          </div>
          <h2 class="font-['Playfair_Display'] text-3xl font-bold tracking-tight text-[#031020] sm:text-4xl md:text-5xl">
            Descubra sabores para cada ocasião.
          </h2>
          <p class="mt-4 text-base text-[#44474C]">
            Explore nossa seleção completa: dos clássicos do Velho Mundo às novidades artesanais brasileiras e antepastos nobres.
          </p>
        </div>

        <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Card 1: Vinhos Nacionais -->
          <div class="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="aspect-[16/10] overflow-hidden bg-gray-100">
              <img
                src="/images/campaign/adega/vinhedos.jpg"
                alt="Vinhos Nacionais"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div class="p-6">
              <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B18A52]">Brasil & Terroir</span>
              <h3 class="mt-1 font-['Playfair_Display'] text-2xl font-bold text-[#031020]">Vinhos Nacionais</h3>
              <p class="mt-3 text-sm leading-relaxed text-[#44474C]">
                Serra Gaúcha, Vale dos Vinhedos, Campanha Gaúcha e vinhos de altitude de São Joaquim.
              </p>
            </div>
          </div>

          <!-- Card 2: Vinhos Importados -->
          <div class="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="aspect-[16/10] overflow-hidden bg-gray-100">
              <img
                src="/images/campaign/adega/bordeaux.jpg"
                alt="Vinhos Importados"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div class="p-6">
              <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B18A52]">Mundo & Tradição</span>
              <h3 class="mt-1 font-['Playfair_Display'] text-2xl font-bold text-[#031020]">Vinhos Importados</h3>
              <p class="mt-3 text-sm leading-relaxed text-[#44474C]">
                Argentina, Chile, Portugal, Itália, França e Espanha. Dos vinhos do dia a dia a safras premiadas.
              </p>
            </div>
          </div>

          <!-- Card 3: Espumantes & Frisantes -->
          <div class="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="aspect-[16/10] overflow-hidden bg-gray-100">
              <img
                src="/images/campaign/adega/espumantes.jpg"
                alt="Espumantes e Frisantes"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div class="p-6">
              <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B18A52]">Celebração & Brinde</span>
              <h3 class="mt-1 font-['Playfair_Display'] text-2xl font-bold text-[#031020]">Espumantes & Frisantes</h3>
              <p class="mt-3 text-sm leading-relaxed text-[#44474C]">
                Champenoise, Charmat, Brut, Moscatel, Prosecco e Champagne genuíno para grandes comemorações.
              </p>
            </div>
          </div>

          <!-- Card 4: Queijos & Antepastos -->
          <div class="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="aspect-[16/10] overflow-hidden bg-gray-100">
              <img
                src="/images/campaign/adega/queijos.jpg"
                alt="Queijos e Antepastos"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div class="p-6">
              <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B18A52]">Harmonização & Frios</span>
              <h3 class="mt-1 font-['Playfair_Display'] text-2xl font-bold text-[#031020]">Queijos & Antepastos</h3>
              <p class="mt-3 text-sm leading-relaxed text-[#44474C]">
                Gouda curado, Brie, Prosciutto, azeitonas artesanais, castanhas e azeites nobres para sua tábua.
              </p>
            </div>
          </div>

          <!-- Card 5: Bebidas em Geral -->
          <div class="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="aspect-[16/10] overflow-hidden bg-gray-100">
              <img
                src="/images/campaign/adega/destilados.jpg"
                alt="Destilados e Cervejas Especiais"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div class="p-6">
              <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B18A52]">Destilados & Cervejas</span>
              <h3 class="mt-1 font-['Playfair_Display'] text-2xl font-bold text-[#031020]">Bebidas em Geral</h3>
              <p class="mt-3 text-sm leading-relaxed text-[#44474C]">
                Whiskies Single Malt, gins botânicos, licores finos, cachaças envelhecidas e cervejas artesanais.
              </p>
            </div>
          </div>

          <!-- Card 6: Acessórios para Vinho -->
          <div class="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="aspect-[16/10] overflow-hidden bg-gray-100">
              <img
                src="/images/campaign/adega/acessorios.jpg"
                alt="Acessórios e Presentes"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div class="p-6">
              <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B18A52]">Presentes & Utensílios</span>
              <h3 class="mt-1 font-['Playfair_Display'] text-2xl font-bold text-[#031020]">Acessórios para Vinho</h3>
              <p class="mt-3 text-sm leading-relaxed text-[#44474C]">
                Decanters de cristal, saca-rolhas sommelier, bombas de vácuo, taças especiais e caixas para presente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 4: CATALOGO -->
    <section id="catalogo" class="w-full bg-[#F6F1E8] py-20 md:py-28">
      <div class="mx-auto max-w-[1320px] px-5 md:px-12">
        <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div class="mb-2 inline-flex items-center gap-2 text-[#B18A52]">
              <span class="material-symbols-outlined text-lg">auto_awesome</span>
              <span class="text-xs font-bold uppercase tracking-[0.25em]">Acervo da Adega</span>
            </div>
            <h2 class="font-['Playfair_Display'] text-3xl font-bold tracking-tight text-[#031020] sm:text-4xl md:text-5xl">
              Rótulos selecionados para você.
            </h2>
            <p class="mt-3 max-w-xl text-base text-[#44474C]">
              Conheça algumas das opções consagradas que fazem parte constante da nossa curadoria em loja física.
            </p>
          </div>

          <div>
            <a
              href="https://wa.me/551143652020?text=Ol%C3%A1,%20gostaria%20de%20solicitar%20o%20cat%C3%A1logo%20completo%20de%20r%C3%B3tulos%20da%20Adega%20Tonel."
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-lg bg-[#031020] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#FFFDF8] shadow-sm transition-all hover:bg-[#182536]"
            >
              <span class="material-symbols-outlined text-base text-[#B18A52]">menu_book</span>
              <span>Solicitar Catálogo Completo</span>
            </a>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="mt-10 flex flex-wrap gap-2 border-b border-[#B18A52]/20 pb-4">
          <button
            type="button"
            class="rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all"
            :class="activeCategory === 'todos' ? 'bg-[#031020] text-white shadow' : 'bg-white/80 text-[#44474C] hover:bg-white'"
            @click="activeCategory = 'todos'"
          >
            Todos ({{ products.length }})
          </button>
          <button
            type="button"
            class="rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all"
            :class="activeCategory === 'brancos' ? 'bg-[#031020] text-white shadow' : 'bg-white/80 text-[#44474C] hover:bg-white'"
            @click="activeCategory = 'brancos'"
          >
            Vinhos Brancos
          </button>
          <button
            type="button"
            class="rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all"
            :class="activeCategory === 'tintos' ? 'bg-[#031020] text-white shadow' : 'bg-white/80 text-[#44474C] hover:bg-white'"
            @click="activeCategory = 'tintos'"
          >
            Vinhos Tintos
          </button>
          <button
            type="button"
            class="rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all"
            :class="activeCategory === 'espumantes' ? 'bg-[#031020] text-white shadow' : 'bg-white/80 text-[#44474C] hover:bg-white'"
            @click="activeCategory = 'espumantes'"
          >
            Espumantes
          </button>
          <button
            type="button"
            class="rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all"
            :class="activeCategory === 'queijos' ? 'bg-[#031020] text-white shadow' : 'bg-white/80 text-[#44474C] hover:bg-white'"
            @click="activeCategory = 'queijos'"
          >
            Queijos & Frios
          </button>
        </div>

        <!-- Products Grid -->
        <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="group flex flex-col overflow-hidden rounded-xl bg-[#FFFDF8] shadow-sm transition-all duration-300 hover:shadow-lg"
          >
            <div class="relative flex min-h-[260px] items-center justify-center bg-[#edeeea]/50 p-6 pb-2">
              <img
                :src="product.image"
                :alt="product.alt"
                loading="lazy"
                class="h-56 object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <span class="absolute left-3 top-3 rounded bg-[#B18A52]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#7E5E2E]">
                {{ product.country }}
              </span>
            </div>

            <div class="flex flex-1 flex-col justify-between p-5">
              <div>
                <span class="block text-[10px] font-semibold uppercase tracking-wider text-[#934655]">
                  {{ product.categoryLabel }}
                </span>
                <h3 class="mt-1 font-['Playfair_Display'] text-xl font-bold leading-snug text-[#031020]">
                  {{ product.name }}
                </h3>
                <p class="mt-2 text-xs leading-relaxed text-[#44474C]">
                  {{ product.description }}
                </p>
              </div>

              <a
                :href="productWhatsapp(product.name)"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-5 block w-full rounded-lg bg-[#edeeea] py-2.5 text-center text-xs font-bold uppercase tracking-wider text-[#031020] transition-colors duration-300 hover:bg-[#031020] hover:text-white"
              >
                Consultar no WhatsApp ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 5: EVENTOS -->
    <section id="eventos" class="w-full bg-[#F8FAF6] py-20 md:py-28">
      <div class="mx-auto max-w-[1320px] px-5 md:px-12">
        <div class="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div class="order-2 lg:order-1 lg:col-span-6">
            <div class="mb-3 inline-flex items-center gap-2 text-[#B18A52]">
              <span class="material-symbols-outlined text-lg">celebration</span>
              <span class="text-xs font-bold uppercase tracking-[0.25em]">Casamentos, Festas & Empresas</span>
            </div>

            <h2 class="font-['Playfair_Display'] text-3xl font-bold leading-tight tracking-tight text-[#031020] sm:text-4xl md:text-5xl">
              Bebidas na medida certa para celebrar.
            </h2>

            <p class="mt-6 text-base leading-relaxed text-[#44474C]">
              Planejando um casamento, aniversário, jantar íntimo ou confraternização corporativa? Ajudamos a calcular as quantidades ideais conforme o cardápio e o perfil dos seus convidados.
            </p>

            <div class="mt-8 space-y-5 border-t border-[#B18A52]/20 pt-6">
              <div class="flex items-start gap-4">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#B18A52]/10 text-[#B18A52]">
                  <span class="material-symbols-outlined text-xl">calculate</span>
                </div>
                <div>
                  <h4 class="font-semibold text-[#031020]">Cálculo Especializado de Consumo</h4>
                  <p class="text-sm text-[#44474C]">Evite desperdícios ou surpresas. Orientação precisa sobre espumantes, vinhos e destilados.</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#B18A52]/10 text-[#B18A52]">
                  <span class="material-symbols-outlined text-xl">sync_alt</span>
                </div>
                <div>
                  <h4 class="font-semibold text-[#031020]">Consignação para Grandes Eventos</h4>
                  <p class="text-sm text-[#44474C]">Trabalhamos com modelo de consignação sob consulta: pague apenas pelo que for consumido.</p>
                </div>
              </div>
            </div>

            <div class="mt-10">
              <a
                href="https://wa.me/551143652020?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20de%20bebidas%20para%20o%20meu%20evento."
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-lg bg-[#031020] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDF8] shadow-md transition-all hover:bg-[#182536]"
              >
                <span class="material-symbols-outlined text-base text-[#B18A52]">inventory_2</span>
                <span>Solicitar Orçamento para Evento</span>
              </a>
            </div>
          </div>

          <div class="order-1 lg:order-2 lg:col-span-6">
            <div class="relative overflow-hidden rounded-2xl bg-[#E1E3DF] shadow-xl">
              <img
                src="/images/campaign/adega/eventos-casamento.jpg"
                alt="Mesa de banquete e celebração com espumantes"
                loading="lazy"
                class="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 6: DIFERENCIAIS -->
    <section class="w-full bg-[#182536] py-20 text-white">
      <div class="mx-auto max-w-[1320px] px-5 md:px-12">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-xl bg-[#031020]/60 p-6 shadow-sm border border-white/5">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-[#B18A52]">
              <span class="material-symbols-outlined text-2xl">verified</span>
            </div>
            <h3 class="font-['Playfair_Display'] text-xl font-bold">Desde 1977</h3>
            <p class="mt-2 text-xs leading-relaxed text-gray-300">
              Mais de 4 décadas de reputação impecável, confiança e pontualidade no ABC Paulista.
            </p>
          </div>

          <div class="rounded-xl bg-[#031020]/60 p-6 shadow-sm border border-white/5">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-[#B18A52]">
              <span class="material-symbols-outlined text-2xl">wine_bar</span>
            </div>
            <h3 class="font-['Playfair_Display'] text-xl font-bold">Seleção Especializada</h3>
            <p class="mt-2 text-xs leading-relaxed text-gray-300">
              Curadoria refinada com marcas tradicionais, pequenos produtores e importações seletas.
            </p>
          </div>

          <div class="rounded-xl bg-[#031020]/60 p-6 shadow-sm border border-white/5">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-[#B18A52]">
              <span class="material-symbols-outlined text-2xl">support_agent</span>
            </div>
            <h3 class="font-['Playfair_Display'] text-xl font-bold">Atendimento Próximo</h3>
            <p class="mt-2 text-xs leading-relaxed text-gray-300">
              Orientação personalizada de quem entende e aprecia o universo dos vinhos e harmonizações.
            </p>
          </div>

          <div class="rounded-xl bg-[#031020]/60 p-6 shadow-sm border border-white/5">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-[#B18A52]">
              <span class="material-symbols-outlined text-2xl">celebration</span>
            </div>
            <h3 class="font-['Playfair_Display'] text-xl font-bold">Experiência em Eventos</h3>
            <p class="mt-2 text-xs leading-relaxed text-gray-300">
              Suporte do planejamento à entrega para casamentos, bodas e encontros empresariais.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 7: CTA BANNER -->
    <section class="relative w-full overflow-hidden bg-[#031020] py-24 text-[#FFFDF8]">
      <div class="absolute inset-0 bg-gradient-to-r from-[#031020] via-transparent to-[#342000]/30 opacity-60" />
      <div class="relative z-10 mx-auto max-w-[900px] px-5 text-center md:px-12">
        <div class="mb-4 inline-flex items-center gap-2 text-[#B18A52]">
          <span class="material-symbols-outlined text-lg">wine_bar</span>
          <span class="text-xs font-bold uppercase tracking-[0.25em]">Consultoria Enológica</span>
        </div>

        <h2 class="font-['Playfair_Display'] text-3xl font-bold tracking-tight text-[#FFFDF8] sm:text-4xl md:text-5xl">
          Quer encontrar o vinho ideal para o seu momento?
        </h2>

        <p class="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-300">
          Envie uma mensagem pelo WhatsApp. Nossa equipe indica o rótulo ideal para o seu paladar, menu ou orçamento.
        </p>

        <div class="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="https://wa.me/551143652020?text=Ol%C3%A1!%20Gostaria%20de%20uma%20sugest%C3%A3o%20de%20vinho%20para%20uma%20ocasi%C3%A3o%20especial."
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-lg bg-[#B18A52] px-8 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-xl transition-all hover:bg-[#9d7742]"
          >
            <span class="material-symbols-outlined text-lg">chat</span>
            <span>Chamar no WhatsApp (11) 4365-2020</span>
          </a>
        </div>
      </div>
    </section>

    <!-- SECTION 8: LOCALIZAÇÃO & HORÁRIOS -->
    <section id="localizacao" class="w-full bg-[#F8FAF6] py-20 md:py-28">
      <div class="mx-auto max-w-[1320px] px-5 md:px-12">
        <div class="grid items-stretch gap-12 lg:grid-cols-12">
          <!-- Left Col: Details -->
          <div class="flex flex-col justify-between lg:col-span-6">
            <div>
              <div class="mb-3 inline-flex items-center gap-2 text-[#B18A52]">
                <span class="material-symbols-outlined text-lg">store</span>
                <span class="text-xs font-bold uppercase tracking-[0.25em]">Nossa Casa</span>
              </div>

              <h2 class="font-['Playfair_Display'] text-3xl font-bold tracking-tight text-[#031020] sm:text-4xl md:text-5xl">
                Visite a Adega Tonel
              </h2>

              <p class="mt-4 text-base leading-relaxed text-[#44474C]">
                Será um imenso prazer recebê-lo para apreciar nosso ambiente aconchegante, conferir as novidades da semana e degustar uma conversa agradável.
              </p>

              <div class="mt-8 space-y-4">
                <!-- Endereço -->
                <div class="flex items-start gap-4 rounded-xl bg-[#F2F4F0] p-4 shadow-sm">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#B18A52]/10 text-[#B18A52]">
                    <span class="material-symbols-outlined text-xl">location_on</span>
                  </div>
                  <div>
                    <h4 class="font-bold text-[#031020]">Endereço</h4>
                    <p class="mt-1 text-xs text-[#44474C]">
                      Rua Afonsina, 316 - Rudge Ramos<br />
                      São Bernardo do Campo – SP, CEP 09633-000
                    </p>
                  </div>
                </div>

                <!-- Telefones -->
                <div class="flex items-start gap-4 rounded-xl bg-[#F2F4F0] p-4 shadow-sm">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#B18A52]/10 text-[#B18A52]">
                    <span class="material-symbols-outlined text-xl">call</span>
                  </div>
                  <div>
                    <h4 class="font-bold text-[#031020]">Telefones Diretos</h4>
                    <div class="mt-1 flex flex-wrap gap-4 text-xs font-semibold text-[#031020]">
                      <a href="tel:1143652020" class="hover:text-[#934655] transition-colors">(11) 4365-2020</a>
                      <a href="tel:1143654444" class="hover:text-[#934655] transition-colors">(11) 4365-4444</a>
                    </div>
                  </div>
                </div>

                <!-- Horários -->
                <div class="flex items-start gap-4 rounded-xl bg-[#F2F4F0] p-4 shadow-sm">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#B18A52]/10 text-[#B18A52]">
                    <span class="material-symbols-outlined text-xl">schedule</span>
                  </div>
                  <div class="w-full">
                    <h4 class="font-bold text-[#031020]">Horário de Funcionamento</h4>
                    <div class="mt-2 space-y-1 text-xs text-[#44474C]">
                      <div class="flex justify-between max-w-xs">
                        <span>Terça a sexta:</span>
                        <strong class="text-[#031020]">08h45 às 18h30</strong>
                      </div>
                      <div class="flex justify-between max-w-xs">
                        <span>Sábado:</span>
                        <strong class="text-[#031020]">08h00 às 18h00</strong>
                      </div>
                      <div class="flex justify-between max-w-xs text-gray-500">
                        <span>Domingo e segunda:</span>
                        <span>Fechado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Col: Map Card -->
          <div class="flex flex-col lg:col-span-6">
            <div class="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
              <div class="relative h-[320px] w-full overflow-hidden">
                <img
                  src="/images/campaign/adega/mapa.jpg"
                  alt="Mapa de localização da Adega Tonel do Rudge Ramos"
                  loading="lazy"
                  class="h-full w-full object-cover"
                />
                <div class="absolute inset-0 bg-[#031020]/20 pointer-events-none" />

                <!-- Pin -->
                <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div class="flex items-center gap-2 rounded-full border border-[#B18A52] bg-[#031020] px-3.5 py-1.5 text-white shadow-2xl">
                    <span class="h-2 w-2 rounded-full bg-[#B18A52] animate-ping" />
                    <span class="text-xs font-bold uppercase tracking-wider">Adega Tonel</span>
                  </div>
                  <div class="-mt-1 h-2.5 w-2.5 rotate-45 border-b border-r border-[#B18A52] bg-[#031020]" />
                </div>
              </div>

              <div class="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
                <div>
                  <span class="block text-[10px] font-bold uppercase tracking-widest text-[#B18A52]">Fácil Acesso</span>
                  <span class="block font-semibold text-[#031020]">Próximo à Av. Senador Vergueiro</span>
                </div>
                <div class="flex w-full items-center gap-3 sm:w-auto">
                  <a
                    href="https://maps.google.com/?q=Rua+Afonsina,+316+-+Rudge+Ramos,+São+Bernardo+do+Campo+-+SP"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#031020] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#182536] sm:flex-initial"
                  >
                    <span class="material-symbols-outlined text-sm text-[#B18A52]">directions</span>
                    <span>Como chegar</span>
                  </a>
                  <a
                    href="https://wa.me/551143652020"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#934655] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#7a3744] sm:flex-initial"
                  >
                    <span class="material-symbols-outlined text-sm">chat</span>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Institutional Footer Adega -->
    <footer class="w-full border-t border-[#B18A52]/20 bg-[#182536] py-14 text-[#FFFDF8]">
      <div class="mx-auto max-w-[1320px] px-5 md:px-12">
        <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 mb-10">
          <div class="lg:col-span-5">
            <p class="font-['Playfair_Display'] text-2xl font-bold tracking-tight">Adega Tonel do Rudge</p>
            <p class="mt-2 text-xs font-bold uppercase tracking-widest text-[#B18A52]">Tradição, qualidade e bons momentos desde 1977</p>
            <p class="mt-3 max-w-md text-xs leading-relaxed text-gray-300">
              Há mais de quatro décadas selecionando os melhores rótulos nacionais e importados, queijos artesanais e iguarias para celebrações memoráveis no ABC Paulista.
            </p>
          </div>

          <div class="lg:col-span-3">
            <p class="text-xs font-bold uppercase tracking-widest text-[#B18A52]">Endereço & Contato</p>
            <p class="mt-3 text-xs leading-relaxed text-gray-300">
              Rua Afonsina, 316 - Rudge Ramos<br />
              São Bernardo do Campo - SP · CEP 09633-000
            </p>
            <p class="mt-3 text-xs text-gray-300">
              (11) 4365-2020 · (11) 4365-4444
            </p>
          </div>

          <div class="lg:col-span-4">
            <p class="text-xs font-bold uppercase tracking-widest text-[#B18A52]">Confraria & Social</p>
            <p class="mt-3 text-xs text-gray-300">Acompanhe novidades de safras exclusivas e encontros enológicos:</p>
            <a
              href="https://instagram.com/adegatonel"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-2 inline-flex items-center gap-2 text-xs text-[#B18A52] hover:underline"
            >
              <span class="material-symbols-outlined text-sm">photo_camera</span>
              <span>@adegatonel</span>
            </a>
          </div>
        </div>

        <div class="flex flex-col items-center justify-between border-t border-[#B18A52]/20 pt-6 text-[11px] text-gray-400 md:flex-row">
          <p>© 1977-2026 Adega Tonel do Rudge Ramos Ltda. Todos os direitos reservados.</p>
          <p class="mt-2 md:mt-0">Aprecie com moderação. Venda proibida para menores de 18 anos.</p>
        </div>
      </div>
    </footer>

    <!-- Demo Contact Avyro Footer -->
    <DemoContact
      name="Adega Tonel do Rudge"
      subject="um site para adega e empório de vinhos como o Adega Tonel do Rudge"
      title="Seu empório merece ser visto com tradição e sofisticação."
    />
  </div>
</template>

<style scoped>
.adega-root {
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
}
</style>
