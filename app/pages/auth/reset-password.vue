<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '~/composables/useSupabase'

definePageMeta({
  layout: false
})

useSeoMeta({
  title: 'Criar Nova Senha | Avyro Link-in-Bio',
  description: 'Defina a nova senha da sua conta Avyro com segurança.',
})

const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const router = useRouter()

onMounted(async () => {
  // Check if session token was received from Supabase reset link
  const { data: { session } } = await supabase.auth.getSession()
  if (!session && !window.location.hash.includes('access_token')) {
    errorMessage.value = 'Link de redefinição inválido ou expirado. Por favor, solicite um novo link.'
  }
})

async function handleUpdatePassword() {
  if (!newPassword.value || !confirmPassword.value) {
    errorMessage.value = 'Preencha a nova senha e a confirmação.'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'As senhas informadas não coincidem.'
    return
  }

  if (newPassword.value.length < 6) {
    errorMessage.value = 'A nova senha deve ter no mínimo 6 caracteres.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword.value
    })

    if (error) throw error

    successMessage.value = 'Sua senha foi redefinida com sucesso! Redirecionando para o login...'
    
    setTimeout(() => {
      router.push('/login')
    }, 2500)
  } catch (err: any) {
    console.error('Erro ao atualizar senha:', err)
    errorMessage.value = err.message || 'Erro ao redefinir senha. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#060318] text-white flex items-center justify-center px-4 py-20 relative overflow-hidden">
    <!-- Cosmic background elements -->
    <div class="absolute inset-0 -z-10 pointer-events-none">
      <div class="absolute -left-32 top-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
      <div class="absolute -right-32 top-1/3 w-[500px] h-[500px] rounded-full bg-cyan-600/20 blur-[120px]" />
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
        <h1 class="font-heading text-2xl font-bold text-white mb-2">Criar Nova Senha</h1>
        <p class="text-xs text-gray-400">Digite sua nova senha abaixo para salvar no sistema.</p>
      </div>

      <!-- Success Alert -->
      <div v-if="successMessage" class="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
        <span class="material-symbols-outlined text-xl text-emerald-400">check_circle</span>
        <span>{{ successMessage }}</span>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px]">error</span>
        <span>{{ errorMessage }}</span>
      </div>

      <form @submit.prevent="handleUpdatePassword" class="space-y-5">
        <div>
          <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Nova Senha</label>
          <input
            v-model="newPassword"
            type="password"
            placeholder="••••••••"
            required
            class="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00f0ff] transition-colors"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Confirmar Nova Senha</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            class="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00f0ff] transition-colors"
          />
        </div>

        <button
          type="submit"
          :disabled="loading || !newPassword || !confirmPassword"
          class="w-full py-4 rounded-xl font-heading font-bold text-sm bg-gradient-to-r from-[#00f0ff] via-[#8b5cf6] to-[#ec4899] text-white shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span v-if="loading" class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
          <span v-else class="material-symbols-outlined text-lg">published_with_changes</span>
          <span>{{ loading ? 'Salvando...' : 'Salvar Nova Senha' }}</span>
        </button>
      </form>

      <div class="mt-8 pt-6 border-t border-white/10 text-center">
        <NuxtLink to="/login" class="text-xs text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">arrow_back</span>
          Voltar para o Login
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
