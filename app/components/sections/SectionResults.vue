<script setup lang="ts">
const stats = [
  { value: '+100', label: 'Projetos Entregues' },
  { value: '98%', label: 'Clientes Satisfeitos' },
  { value: '5x', label: 'Mais Conversões' },
  { value: '24h', label: 'Suporte Rápido' },
]

const testimonial = {
  quote: 'A equipe da Tarif Grownt Company transformou nossa presença digital. Nosso novo site não apenas ficou incrível esteticamente, mas também dobrou nosso volume de orçamentos no primeiro mês. Profissionalismo e técnica impecáveis.',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlvZo4rj8Ll87fuJMncndNjAlK5nhiUzc_oW-sAKHDevFUqR7M4jNXfOLxg7dpJJMwoK9GO6Dd_Xpg7KDpmGsECmiDJWKnMu71cFO6kxzectLPBlvjalrhydAsG_0aZ4lMqpeBGgWxL_AgV8qxvK-75Hsh14QEPm4neG6ki8I0EDdRnDlz_PB-76s6I_kQzFTLcbinh3Yzw1qA8PZdgOWQoLeIdvhMKb_-B11eAboBaa2TX3QIf7Zc0xSkK5Aoo3MeZXXGWV5XVGM',
  avatarAlt: 'Foto de Carlos Eduardo, CEO da TechSolutions',
  name: 'Carlos Eduardo',
  role: 'CEO, TechSolutions',
}
</script>

<template>
  <section class="py-section-padding-mobile lg:py-section-padding-desktop bg-surface px-margin-mobile lg:px-gutter border-t border-border-subtle">
    <div class="max-w-container-max mx-auto text-center">
      <!-- Title -->
      <h2 class="font-heading text-headline-md text-primary-container mb-12">
        Resultados que Falam por Nós
      </h2>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="flex flex-col items-center"
        >
          <span class="font-heading text-display-lg text-secondary mb-2">
            {{ stat.value }}
          </span>
          <span class="font-heading text-label-md text-on-surface-variant uppercase">
            {{ stat.label }}
          </span>
        </div>
      </div>

      <!-- Testimonial -->
      <div class="bg-surface-light border border-border-subtle rounded-xl p-8 lg:p-12 max-w-3xl mx-auto relative shadow-[0px_4px_20px_rgba(24,27,73,0.05)]">
        <!-- Quote Icon -->
        <span class="material-symbols-outlined absolute top-6 left-6 text-border-subtle text-6xl opacity-50">
          format_quote
        </span>

        <!-- Quote Text -->
        <p class="font-body text-body-lg lg:text-xl text-primary-container relative z-10 mb-8 italic">
          "{{ testimonial.quote }}"
        </p>

        <!-- Author -->
        <div class="flex items-center justify-center gap-4">
          <div class="w-12 h-12 bg-surface-variant rounded-full flex items-center justify-center overflow-hidden">
            <img
              :src="testimonial.avatarUrl"
              :alt="testimonial.avatarAlt"
              class="w-full h-full object-cover"
              loading="lazy"
            >
          </div>
          <div class="text-left">
            <h5 class="font-heading text-label-md text-primary-container">
              {{ testimonial.name }}
            </h5>
            <span class="text-sm text-on-surface-variant">
              {{ testimonial.role }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
