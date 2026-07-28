<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '~/composables/useSupabase'

definePageMeta({
  layout: false
})

useSeoMeta({
  title: 'Entrar na sua Conta | Avyro Link-in-Bio',
  description: 'Faça login para gerenciar sua página de links e visualizar estatísticas de acessos.',
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMessage.value = 'Preencha todos os campos.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) throw error

    router.push('/dashboard')
  } catch (err: any) {
    const msg = err.message || ''
    if (msg.includes('Email not confirmed')) {
      errorMessage.value = 'Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada (ou Spam) e clique no link de confirmação que enviamos.'
    } else if (msg.includes('Invalid login credentials')) {
      errorMessage.value = 'E-mail ou senha incorretos. Verifique seus dados e tente novamente.'
    } else {
      errorMessage.value = msg || 'Erro ao fazer login. Verifique seus dados.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#060318] text-white flex items-center justify-center px-4 py-20 relative overflow-hidden">
    <!-- Cosmic background elements -->
    <div class="absolute inset-0 -z-10 pointer-events-none">
      <div class="absolute -left-32 top-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px]" style="transform: translate3d(0,0,0); backface-visibility: hidden; -webkit-backface-visibility: hidden;" />
      <div class="absolute -right-32 top-1/3 w-[500px] h-[500px] rounded-full bg-cyan-600/20 blur-[120px]" style="transform: translate3d(0,0,0); backface-visibility: hidden; -webkit-backface-visibility: hidden;" />
    </div>

    <div class="w-full max-w-md bg-[#0d0928]/90 border border-purple-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-flex items-center gap-2 mb-4">
          <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00f0ff] via-[#8b5cf6] to-[#ec4899] flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.8)] p-[1.5px]">
            <div class="w-full h-full bg-[#0d0928] rounded-full flex items-center justify-center">
              <span class="font-heading font-black text-[#00f0ff] text-base">A</span>
            </div>
          </div>
          <span class="font-heading text-2xl font-extrabold text-white">Avyro</span>
        </NuxtLink>
        <h1 class="font-heading text-2xl font-bold text-white mb-2">Bem-vindo de volta!</h1>
        <p class="text-sm text-gray-400">Acesse seu painel do Link-in-Bio</p>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px]">error</span>
        <span>{{ errorMessage }}</span>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">E-mail</label>
          <input
            v-model="email"
            type="email"
            placeholder="seuemail@exemplo.com"
            required
            class="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00f0ff] transition-colors"
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider">Senha</label>
            <NuxtLink to="/auth/forgot-password" class="text-xs text-[#00f0ff] hover:underline font-semibold transition-colors">
              Esqueceu a senha?
            </NuxtLink>
          </div>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            class="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00f0ff] transition-colors"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-4 rounded-full font-heading font-bold text-white bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
          <span v-else>Entrar no Painel</span>
        </button>
      </form>

      <div class="mt-8 text-center text-xs text-gray-400">
        Ainda não tem uma conta?
        <NuxtLink to="/register" class="text-cyan-400 font-bold hover:underline ml-1">
          Criar conta grátis
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
