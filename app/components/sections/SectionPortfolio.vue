<script setup lang="ts">
const projects = [
  {
    lottieUrl: '/landing-page-animation.json',
    category: 'Gaming',
    title: 'Kamui Card Game',
    description: 'Landing page premium e imersiva para o lançamento de um jogo de cartas estratégico.',
  },
  {
    imageUrl: '/link-in-bio.png',
    imagePosition: 'object-top',
    category: 'Web Design',
    title: 'Link-in-Bio',
    description: 'Tenha uma plataforma original para links na bio.',
    link: '/link-in-bio',
  },
  {
    videoUrl: '/videos/Record_2026-07-12-18-25-38.mp4',
    category: 'Representação',
    title: 'Martins Representações',
    description: 'Website institucional moderno e catálogo digital para o representante comercial da Martins Representações.',
  },
]
</script>

<template>
  <section
    id="portfolio"
    class="bg-surface-container-low py-section-padding-mobile lg:py-section-padding-desktop"
  >
    <div class="max-w-container-max mx-auto px-margin-mobile lg:px-gutter">
      <!-- Section Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
        <div>
          <h2 class="font-heading text-headline-md text-primary-container mb-4">
            Projetos Recentes
          </h2>
          <p class="text-on-surface-variant max-w-xl font-body text-body-md">
            Nosso portfólio de casos de sucesso. Sites desenvolvidos com foco em usabilidade, design impecável e resultados reais.
          </p>
        </div>
        <button class="flex items-center gap-2 text-secondary font-heading text-label-md hover:underline shrink-0">
          Ver todos os projetos
          <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>

      <!-- Portfolio Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardsPortfolioCard
          v-for="project in projects"
          :key="project.title"
          :image-url="project.imageUrl"
          :image-alt="project.imageAlt"
          :lottie-url="project.lottieUrl"
          :video-url="project.videoUrl"
          :category="project.category"
          :title="project.title"
          :description="project.description"
          :image-position="project.imagePosition"
          :link="project.link"
        />
      </div>
    </div>
  </section>
</template>
