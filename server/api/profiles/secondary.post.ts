import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { action, userId, profileData } = body

    if (!userId) {
      return { success: false, error: 'userId é obrigatório.' }
    }

    const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

    if (!supabaseServiceKey) {
      return { success: false, error: 'Supabase Service Key ausente.' }
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Obter o perfil principal do usuário
    const { data: primaryProfile, error: pErr } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (pErr || !primaryProfile) {
      return { success: false, error: 'Perfil principal não encontrado.' }
    }

    const secUserEmail = `sec_${userId.replace(/[^a-zA-Z0-9]/g, '')}@avyro.internal`
    const defaultSecUsername = `${primaryProfile.username || 'usuario'}-2`

    // Helper: Encontrar ou auto-criar o usuário/perfil secundário no Supabase Auth + Database
    async function getOrCreateSecondaryProfile() {
      // Tentar buscar por username direto (ex: samuel.tarif-2)
      const { data: secByUsername } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .ilike('username', defaultSecUsername)
        .maybeSingle()

      if (secByUsername) return secByUsername

      // Se não encontrou por username, criar um novo usuário interno via Auth Admin
      const { data: newUserObj } = await supabaseAdmin.auth.admin.createUser({
        email: secUserEmail,
        email_confirm: true,
        user_metadata: { is_secondary_for: userId }
      })

      if (newUserObj?.user) {
        const secId = newUserObj.user.id
        const initialPayload = {
          username: defaultSecUsername,
          display_name: primaryProfile.display_name ? `${primaryProfile.display_name} #2` : 'Meu Perfil 2',
          bio_description: 'Seu segundo perfil de links na bio',
          avatar_url: primaryProfile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          theme_id: 'lexie-candis',
          bg_color: '#8b5cf6',
          bg_image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
          bg_style: 'background: linear-gradient(rgba(139,92,246,0.5), rgba(109,40,217,0.75)), url("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"); background-size: cover; background-position: center;',
          text_color: '#ffffff',
          btn_bg_color: '#ede9fe',
          btn_text_color: '#6d28d9',
          btn_border: '',
          roundness: 'rounded-full',
          font_class: 'font-serif',
          socials: ['tiktok', 'instagram', 'youtube'],
          subscription_status: primaryProfile.subscription_status || 'free',
          updated_at: new Date().toISOString(),
        }

        const { data: updatedSec } = await supabaseAdmin
          .from('profiles')
          .update(initialPayload)
          .eq('id', secId)
          .select()
          .single()

        if (updatedSec) return updatedSec
      }

      return null
    }

    if (action === 'get') {
      const secProfile = await getOrCreateSecondaryProfile()
      return { success: true, profile: secProfile }
    }

    if (action === 'create_or_update') {
      if (!profileData) {
        return { success: false, error: 'profileData é obrigatório.' }
      }

      let secProfile = await getOrCreateSecondaryProfile()

      const payload = {
        display_name: profileData.display_name,
        username: profileData.username,
        category: profileData.category || 'beauty',
        bio_description: profileData.bio_description,
        avatar_url: profileData.avatar_url,
        theme_id: profileData.theme_id,
        bg_color: profileData.bg_color,
        bg_image_url: profileData.bg_image_url,
        bg_style: profileData.bg_style,
        bg_blur: profileData.bg_blur,
        text_color: profileData.text_color,
        btn_bg_color: profileData.btn_bg_color,
        btn_text_color: profileData.btn_text_color,
        btn_border: profileData.btn_border,
        roundness: profileData.roundness,
        font_class: profileData.font_class,
        socials: profileData.socials,
        subscription_status: primaryProfile.subscription_status || 'free',
        updated_at: new Date().toISOString(),
      }

      if (secProfile) {
        const { data: updated } = await supabaseAdmin
          .from('profiles')
          .update(payload)
          .eq('id', secProfile.id)
          .select()
          .single()

        if (updated) {
          return { success: true, profile: updated }
        }
      }

      return { success: false, error: 'Não foi possível salvar o Perfil 2.' }
    }

    return { success: false, error: 'Ação inválida.' }
  } catch (err: any) {
    console.error('Erro na API de Perfil Secundário:', err)
    return { success: false, error: err?.message || 'Erro interno no servidor.' }
  }
})
