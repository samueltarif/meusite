<script setup lang="ts">
const services = [
  {
    icon: 'web',
    title: 'Criação de Sites',
    description: 'Sites institucionais completos, modernos e responsivos, desenvolvidos sob medida para transmitir a autoridade da sua marca e otimizados para todos os dispositivos.',
    tags: ['Responsivo', 'WordPress'],
    span: 'lg:col-span-2',
  },
  {
    icon: 'rocket_launch',
    title: 'Landing Pages',
    description: 'Páginas de alta conversão estruturadas com gatilhos mentais perfeitas para campanhas de anúncios, captação de leads e lançamento de produtos.',
    linkText: 'Saiba mais',
  },
  {
    icon: 'search',
    title: 'Otimização SEO',
    description: 'Melhore seu posicionamento orgânico no Google. Otimizamos estrutura, conteúdo e velocidade para você ser encontrado por quem procura.',
  },
  {
    icon: 'monitoring',
    title: 'Manutenção e Suporte',
    description: 'Não deixe seu site abandonado. Oferecemos planos de suporte técnico, atualizações de segurança e melhorias contínuas de performance.',
    featured: true,
    linkText: 'Falar com Consultor',
    linkHref: '#contact',
    span: 'lg:col-span-2',
  },
]
</script>

<template>
  <section
    id="services"
    class="py-section-padding-mobile lg:py-section-padding-desktop px-margin-mobile lg:px-gutter max-w-container-max mx-auto"
  >
    <!-- Section Header -->
    <div class="text-center mb-12">
      <h2 class="font-heading text-headline-md text-primary-container mb-4">
        Soluções Completas para o seu Negócio
      </h2>
      <p class="text-on-surface-variant max-w-2xl mx-auto font-body text-body-md">
        Tudo que você precisa para se destacar no ambiente digital e transformar visitantes em clientes reais.
      </p>
    </div>

    <!-- Bento Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div
        v-for="service in services"
        :key="service.title"
        :class="service.span"
      >
        <CardsServiceCard
          :icon="service.icon"
          :title="service.title"
          :description="service.description"
          :tags="service.tags"
          :link-text="service.linkText"
          :link-href="service.linkHref"
          :featured="service.featured"
        />
      </div>
    </div>
  </section>
</template>
