<script setup lang="ts">
import { supabase } from '~/composables/useSupabase'

definePageMeta({ layout: false })
useSeoMeta({
  title: 'Acesso restrito — Prospecção Avyro',
  robots: 'noindex, nofollow',
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMessage.value = 'Preencha o e-mail e a senha.'
    return
  }
  loading.value = true
  errorMessage.value = ''

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (error) throw error

    // Verify CRM membership before granting access
    const { data: { session } } = await supabase.auth.getSession()
    const { member } = await $fetch<{ member: boolean }>('/api/prospecting/auth', {
      headers: { Authorization: `Bearer ${session?.access_token}` },
    })

    if (!member) {
      await supabase.auth.signOut()
      errorMessage.value = 'Seu acesso ao painel de prospecção não está habilitado. Entre em contato com o administrador.'
      return
    }

    router.replace('/prospeccao')
  } catch (err: any) {
    const msg = err?.message || ''
    if (msg.includes('Invalid login credentials')) {
      errorMessage.value = 'E-mail ou senha incorretos.'
    } else if (msg.includes('Email not confirmed')) {
      errorMessage.value = 'Confirme seu e-mail antes de continuar.'
    } else {
      errorMessage.value = msg || 'Erro ao fazer login. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}

async function sendPasswordReset() {
  if (!email.value) {
    errorMessage.value = 'Informe seu e-mail para recuperar o acesso.'
    return
  }
  loading.value = true
  const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  loading.value = false
  if (error) {
    errorMessage.value = 'Não foi possível enviar o e-mail. Tente novamente.'
  } else {
    errorMessage.value = ''
    alert('Link de recuperação enviado para ' + email.value + '. Verifique sua caixa de entrada.')
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-[#f3f6fb] px-4 py-12 font-body text-[#17253e]">
    <div class="w-full max-w-sm">
      <div class="mb-8 text-center">
        <NuxtLink to="/" class="inline-block text-3xl font-bold tracking-tight text-[#14243e]">
          avyro<span class="text-blue-500">.</span>
        </NuxtLink>
        <p class="mt-3 text-sm text-slate-500">Painel de prospecção</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 class="text-xl font-semibold">Entrar no painel</h1>
        <p class="mt-1 text-xs text-slate-500">Acesso restrito. Não há cadastro público.</p>

        <div v-if="errorMessage" role="alert" class="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          {{ errorMessage }}
        </div>

        <form class="mt-6 space-y-4" @submit.prevent="handleLogin">
          <label class="block">
            <span class="text-xs font-semibold text-slate-600">E-mail</span>
            <input
              v-model="email"
              id="prospecting-email"
              type="email"
              autocomplete="email"
              required
              placeholder="seuemail@exemplo.com"
              class="mt-1.5 min-h-12 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </label>

          <label class="block">
            <span class="text-xs font-semibold text-slate-600">Senha</span>
            <input
              v-model="password"
              id="prospecting-password"
              type="password"
              autocomplete="current-password"
              required
              placeholder="••••••••"
              class="mt-1.5 min-h-12 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            :disabled="loading"
            id="prospecting-login-btn"
            class="mt-2 min-h-12 w-full rounded-lg bg-[#2458df] text-sm font-semibold text-white disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            <span v-if="loading">Entrando…</span>
            <span v-else>Entrar no painel</span>
          </button>
        </form>

        <div class="mt-5 text-center">
          <button
            type="button"
            class="text-xs text-slate-500 hover:text-blue-600 hover:underline transition-colors"
            @click="sendPasswordReset"
          >
            Esqueceu a senha? Enviar link de recuperação
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
