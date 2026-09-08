<script setup lang="ts">
const year: number = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-slate-200 bg-white px-5 py-8 md:px-8">
    <div class="mx-auto flex max-w-[1176px] flex-col justify-between gap-5 text-sm text-slate-500 md:flex-row md:items-center">
      <div><NuxtLink to="/" class="font-heading text-2xl font-extrabold tracking-[-0.06em] text-[#101c35]">avyro.</NuxtLink><p class="mt-2 text-xs">© {{ year }} Avyro Growth Company · CNPJ 66.818.617/0001-27</p></div>
      <NuxtLink to="/politica-de-privacidade" class="underline decoration-slate-300 underline-offset-4 hover:text-[#255bef]">Política de privacidade</NuxtLink>
    </div>
  </footer>
</template>
