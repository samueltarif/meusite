<script setup lang="ts">
const contactLinks = [
  {
    icon: 'mail',
    label: 'assessoriatarif@gmail.com',
    href: 'mailto:assessoriatarif@gmail.com',
  },
  {
    icon: 'call',
    label: '(11) 95137-2631',
    href: 'https://wa.me/5511951372631',
  },
]

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer
    id="contact"
    class="bg-primary w-full"
  >
    <div class="max-w-container-max mx-auto flex flex-col items-center text-center px-margin-mobile lg:px-gutter pt-16 pb-6 gap-4">
      <!-- Logo -->
      <span class="font-heading text-headline-sm text-on-primary mb-4">
        Tarif Grownt Company
      </span>

      <!-- Contact Links -->
      <div class="flex flex-col md:flex-row gap-6 md:gap-12 mb-8">
        <a
          v-for="link in contactLinks"
          :key="link.href"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="text-on-primary/60 hover:text-on-primary hover:underline transition-all font-body text-body-md flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-[20px]">{{ link.icon }}</span>
          {{ link.label }}
        </a>
      </div>

      <!-- Divider + Copyright -->
      <p class="font-body text-body-md text-on-primary/60 text-sm pt-8 border-t border-on-primary/10 w-full">
        © {{ currentYear }} Tarif Grownt Company. CNPJ 66.818.617/0001-27
      </p>
    </div>
  </footer>
</template>
