<script setup lang="ts">
import { brandIcons } from '~/utils/brandIcons'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer
    id="contact"
    class="bg-primary w-full"
  >
    <div class="max-w-container-max mx-auto flex flex-col items-center text-center px-margin-mobile lg:px-gutter pt-16 pb-6 gap-4">
      <!-- Logo -->
      <span class="font-heading text-headline-sm text-on-primary mb-2">
        Avyro Growth Company
      </span>

      <!-- Single Support Button with Registered WhatsApp Number -->
      <div class="my-4">
        <a
          href="https://wa.me/5511951372631?text=Olá!%20Vim%20pelo%20site%20e%20preciso%20de%20suporte."
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-extrabold text-white bg-gradient-to-r from-emerald-500 to-green-600 border border-emerald-400/30 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_45px_rgba(16,185,129,0.7)] hover:scale-105 transition-all duration-300"
        >
          <span class="w-5 h-5 fill-current shrink-0" v-html="brandIcons.whatsapp"></span>
          Suporte via WhatsApp (11) 95137-2631
        </a>
      </div>

      <!-- Divider + Copyright -->
      <p class="font-body text-body-md text-on-primary/60 text-sm pt-8 border-t border-on-primary/10 w-full">
        © {{ currentYear }} Avyro Growth Company. CNPJ 66.818.617/0001-27
      </p>
    </div>
  </footer>
</template>
