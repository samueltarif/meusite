<script setup lang="ts">
import { supabase } from '~/composables/useSupabase'

useSeoMeta({
  title: 'E-mail Confirmado | Tarif Link-in-Bio',
  description: 'Seu e-mail foi confirmado com sucesso. Faça login para acessar seu painel.',
})

const status = ref<'loading' | 'success' | 'error'>('loading')
const errorDetail = ref('')
const router = useRouter()
const countdown = ref(5)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  try {
    // Supabase automatically handles the token exchange from the URL hash
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    if (data.session) {
      // User is authenticated after email confirmation
      status.value = 'success'
      startCountdown()
    } else {
      // No session yet — check if we have hash params to exchange
      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        // Wait a moment for Supabase to process the token
        await new Promise(resolve => setTimeout(resolve, 1000))
        const { data: retryData, error: retryError } = await supabase.auth.getSession()
        if (retryError) throw retryError
        if (retryData.session) {
          status.value = 'success'
          startCountdown()
        } else {
          status.value = 'success'
          startCountdown()
        }
      } else {
        // No token in URL, just show success and redirect to login
        status.value = 'success'
        startCountdown()
      }
    }
  } catch (err: any) {
    status.value = 'error'
    errorDetail.value = err.message || 'Erro ao confirmar e-mail.'
  }
})

function startCountdown() {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      if (timer) clearInterval(timer)
      router.push('/login')
    }
  }, 1000)
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="min-h-screen bg-[#060318] text-white flex items-center justify-center px-4 py-20 relative overflow-hidden">
    <!-- Cosmic background elements -->
    <div class="absolute inset-0 -z-10 pointer-events-none">
      <div class="absolute -left-32 top-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
      <div class="absolute -right-32 top-1/3 w-[500px] h-[500px] rounded-full bg-cyan-600/20 blur-[120px]" />
      <div class="absolute left-1/2 -translate-x-1/2 top-0 w-[600px] h-[600px] rounded-full bg-emerald-600/10 blur-[150px]" />
    </div>

    <div class="w-full max-w-md bg-[#0d0928]/90 border border-purple-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl">
      <div class="text-center">
        <NuxtLink to="/" class="inline-flex items-center gap-2 mb-6">
          <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00f0ff] via-[#8b5cf6] to-[#ec4899] flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.8)] p-[1.5px]">
            <div class="w-full h-full bg-[#0d0928] rounded-full flex items-center justify-center">
              <span class="font-heading font-black text-[#00f0ff] text-base">T</span>
            </div>
          </div>
          <span class="font-heading text-2xl font-extrabold text-white">Tarif</span>
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="status === 'loading'" class="text-center space-y-5 py-6">
        <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.3)]">
          <span class="material-symbols-outlined text-3xl text-white animate-spin">progress_activity</span>
        </div>
        <h2 class="font-heading text-xl font-bold text-white">Confirmando seu e-mail...</h2>
        <p class="text-sm text-gray-400">Aguarde um momento enquanto verificamos sua conta.</p>
      </div>

      <!-- Success State -->
      <div v-else-if="status === 'success'" class="text-center space-y-5 py-6">
        <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.5)] animate-bounce-slow">
          <span class="material-symbols-outlined text-4xl text-white" style="font-variation-settings: 'FILL' 1;">check_circle</span>
        </div>
        <h2 class="font-heading text-2xl font-bold text-white">E-mail confirmado!</h2>
        <p class="text-sm text-gray-300 leading-relaxed">
          Sua conta foi verificada com sucesso.<br>
          Agora você pode acessar seu painel e personalizar sua página.
        </p>
        <div class="pt-2">
          <NuxtLink
            to="/login"
            class="inline-flex items-center gap-2 px-8 py-4 rounded-full font-heading font-bold text-white bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-300"
          >
            <span class="material-symbols-outlined text-[20px]">login</span>
            Acessar o Painel
          </NuxtLink>
        </div>
        <p class="text-xs text-gray-500">
          Redirecionando automaticamente em <span class="text-cyan-400 font-bold">{{ countdown }}s</span>
        </p>
      </div>

      <!-- Error State -->
      <div v-else class="text-center space-y-5 py-6">
        <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-red-400 to-pink-500 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)]">
          <span class="material-symbols-outlined text-3xl text-white">error</span>
        </div>
        <h2 class="font-heading text-xl font-bold text-white">Erro na confirmação</h2>
        <p class="text-sm text-gray-300 leading-relaxed">
          Não foi possível confirmar seu e-mail. O link pode ter expirado ou já foi utilizado.
        </p>
        <div v-if="errorDetail" class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
          {{ errorDetail }}
        </div>
        <div class="flex flex-col gap-3 pt-2">
          <NuxtLink
            to="/login"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-heading font-bold text-white bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-300 text-sm"
          >
            <span class="material-symbols-outlined text-[18px]">login</span>
            Ir para o Login
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="inline-flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-cyan-400 transition-colors"
          >
            Criar uma nova conta
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
