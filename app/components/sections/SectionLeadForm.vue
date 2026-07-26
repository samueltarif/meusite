<script setup lang="ts">
const benefits = [
  'Orçamento sem compromisso',
  'Análise grátis do seu site atual',
  'Estratégia focada em resultados',
]

const serviceOptions = [
  'Criação de Site Institucional',
  'Landing Page para Anúncios',
  'E-commerce / Loja Virtual',
  'Otimização SEO / Redesign',
]

const form = reactive({
  name: '',
  email: '',
  phone: '',
  service: serviceOptions[0],
})

function handleSubmit() {
  const whatsappMessage = encodeURIComponent(
    `Olá! Gostaria de solicitar um orçamento.\n\nNome: ${form.name}\nEmail: ${form.email}\nWhatsApp: ${form.phone}\nServiço: ${form.service}`
  )
  window.open(`https://wa.me/5511951372631?text=${whatsappMessage}`, '_blank')
}
</script>

<template>
  <section
    id="orcamento"
    class="py-section-padding-mobile lg:py-section-padding-desktop bg-primary-container px-margin-mobile lg:px-gutter relative overflow-hidden"
  >
    <!-- Background Gradient -->
    <div class="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/40 via-transparent to-transparent" />

    <div class="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10 items-center">
      <!-- Left Content -->
      <div>
        <h2 class="font-heading text-headline-lg-mobile lg:text-headline-lg text-on-primary mb-6">
          Pronto para Elevar o Nível do seu Negócio?
        </h2>
        <p class="font-body text-body-lg text-on-primary/80 mb-8">
          Preencha o formulário e um de nossos especialistas entrará em contato em até 2 horas para entender suas necessidades e montar uma proposta personalizada.
        </p>

        <!-- Benefits (desktop only) -->
        <ul class="space-y-4 mb-8 hidden lg:block">
          <li
            v-for="benefit in benefits"
            :key="benefit"
            class="flex items-center gap-3 text-on-primary font-body text-body-md"
          >
            <span class="material-symbols-outlined text-secondary-fixed">check</span>
            {{ benefit }}
          </li>
        </ul>
      </div>

      <!-- Form Card -->
      <div class="bg-surface-light rounded-xl p-8 shadow-xl">
        <h3 class="font-heading text-headline-sm text-primary-container mb-6 text-center">
          Solicite um Orçamento
        </h3>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <!-- Name -->
          <div>
            <label
              class="block text-sm font-medium text-on-surface-variant mb-1"
              for="lead-name"
            >
              Nome Completo
            </label>
            <input
              id="lead-name"
              v-model="form.name"
              type="text"
              placeholder="Seu nome"
              required
              class="w-full bg-[#F8FAFC] border border-border-subtle rounded-lg px-4 py-3 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-shadow text-on-surface"
            >
          </div>

          <!-- Email -->
          <div>
            <label
              class="block text-sm font-medium text-on-surface-variant mb-1"
              for="lead-email"
            >
              E-mail Profissional
            </label>
            <input
              id="lead-email"
              v-model="form.email"
              type="email"
              placeholder="seu@email.com.br"
              required
              class="w-full bg-[#F8FAFC] border border-border-subtle rounded-lg px-4 py-3 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-shadow text-on-surface"
            >
          </div>

          <!-- Phone -->
          <div>
            <label
              class="block text-sm font-medium text-on-surface-variant mb-1"
              for="lead-phone"
            >
              WhatsApp
            </label>
            <input
              id="lead-phone"
              v-model="form.phone"
              type="tel"
              placeholder="(00) 00000-0000"
              required
              class="w-full bg-[#F8FAFC] border border-border-subtle rounded-lg px-4 py-3 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-shadow text-on-surface"
            >
          </div>

          <!-- Service -->
          <div>
            <label
              class="block text-sm font-medium text-on-surface-variant mb-1"
              for="lead-service"
            >
              Qual serviço você precisa?
            </label>
            <select
              id="lead-service"
              v-model="form.service"
              class="w-full bg-[#F8FAFC] border border-border-subtle rounded-lg px-4 py-3 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-shadow text-on-surface"
            >
              <option
                v-for="option in serviceOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="action-gradient-bg text-on-primary font-heading text-label-md px-6 py-4 rounded-lg w-full mt-4 hover:scale-[1.02] transition-transform duration-200 shadow-md"
          >
            Enviar Solicitação
          </button>

          <!-- Security Note -->
          <p class="text-xs text-center text-on-surface-variant mt-4 flex items-center justify-center gap-1">
            <span class="material-symbols-outlined text-[14px]">lock</span>
            Seus dados estão seguros conosco.
          </p>
        </form>
      </div>
    </div>
  </section>
</template>
