<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '~/composables/useSupabase'

definePageMeta({
  layout: false
})

useSeoMeta({
  title: 'Criar Conta Grátis | Avyro Link-in-Bio',
  description: 'Crie seu perfil profissional e comece a compartilhar seus links com visual incrível.',
})

const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const registrationComplete = ref(false)
const registeredEmail = ref('')
const router = useRouter()

async function handleRegister() {
  if (!username.value || !email.value || !password.value) {
    errorMessage.value = 'Preencha todos os campos.'
    return
  }

  // Format username (remove @ and spaces)
  const formattedUsername = username.value.replace(/[@\s]/g, '').toLowerCase()

  if (formattedUsername.length < 3) {
    errorMessage.value = 'O nome de usuário deve ter pelo menos 3 caracteres.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  registrationComplete.value = false

  try {
    // 1. Check if username exists in profiles
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', formattedUsername)
      .maybeSingle()

    if (existingUser) {
      errorMessage.value = `O nome de usuário @${formattedUsername} já está em uso. Escolha outro.`
      loading.value = false
      return
    }

    // 2. Sign up in Supabase Auth with username metadata for trigger
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        data: {
          username: formattedUsername,
        },
      },
    })

    if (authError) throw authError

    if (authData.session) {
      // User is logged in immediately (email confirmation disabled)
      router.push('/dashboard')
    } else {
      // User created, needs email confirmation
      registeredEmail.value = email.value
      registrationComplete.value = true
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'Erro ao criar conta.'
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
        <h1 class="font-heading text-2xl font-bold text-white mb-2">Crie sua Conta SaaS</h1>
        <p class="text-sm text-gray-400">Escolha seu link personalizado para o Instagram</p>
      </div>

      <!-- Registration Complete - Email Confirmation Card -->
      <div v-if="registrationComplete" class="text-center space-y-5">
        <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
          <span class="material-symbols-outlined text-3xl text-white">mark_email_read</span>
        </div>
        <h2 class="font-heading text-xl font-bold text-white">Verifique seu e-mail</h2>
        <p class="text-sm text-gray-300 leading-relaxed">
          Enviamos um link de confirmação para<br>
          <span class="text-cyan-400 font-bold">{{ registeredEmail }}</span>
        </p>
        <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
          <span class="material-symbols-outlined text-[16px] align-middle mr-1">warning</span>
          <strong>Não encontrou?</strong> Verifique a sua caixa de <strong>Spam</strong> ou <strong>Lixo Eletrônico</strong>. O e-mail pode demorar até 2 minutos para chegar.
        </div>
        <NuxtLink
          to="/login"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full font-heading font-bold text-white bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-300 text-sm"
        >
          <span class="material-symbols-outlined text-[18px]">login</span>
          Ir para o Login
        </NuxtLink>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px]">error</span>
        <span>{{ errorMessage }}</span>
      </div>

      <form v-if="!registrationComplete" @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Seu Nome de Usuário (URL)</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 font-bold text-sm">avyro.com.br/@</span>
            <input
              v-model="username"
              type="text"
              placeholder="seu_nome"
              required
              class="w-full pl-44 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00f0ff] transition-colors"
            />
          </div>
        </div>

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
          <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Senha</label>
          <input
            v-model="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            required
            minlength="6"
            class="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00f0ff] transition-colors"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-4 rounded-full font-heading font-bold text-white bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
          <span v-else>Criar Minha Conta</span>
        </button>
      </form>

      <div v-if="!registrationComplete" class="mt-8 text-center text-xs text-gray-400">
        Já possui uma conta?
        <NuxtLink to="/login" class="text-cyan-400 font-bold hover:underline ml-1">
          Fazer Login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
