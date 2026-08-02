import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { action, userId, profileData } = body

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'userId é obrigatório.' })
  }

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  if (!supabaseServiceKey) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase Service Key ausente.' })
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  // 1. Obter o perfil principal do usuário
  const { data: primaryProfile, error: pErr } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (pErr || !primaryProfile) {
    throw createError({ statusCode: 404, statusMessage: 'Perfil principal não encontrado.' })
  }

  // Identificador do perfil secundário (Perfil 2)
  const secondaryId = primaryProfile.secondary_profile_id || `${userId}_p2`

  if (action === 'get') {
    // Tentar buscar perfil 2 por ID ou secondary_profile_id
    const { data: secProfile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', secondaryId)
      .maybeSingle()

    if (secProfile) {
      return { success: true, profile: secProfile }
    }

    // Tentar buscar perfil 2 por username alternativo
    const defaultSecUsername = `${primaryProfile.username || 'usuario'}-2`
    const { data: secByUsername } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .ilike('username', defaultSecUsername)
      .maybeSingle()

    if (secByUsername) {
      // Atualizar o perfil principal com o ID encontrado
      await supabaseAdmin.from('profiles').update({ secondary_profile_id: secByUsername.id }).eq('id', userId)
      return { success: true, profile: secByUsername }
    }

    return { success: true, profile: null }
  }

  if (action === 'create_or_update') {
    if (!profileData) {
      throw createError({ statusCode: 400, statusMessage: 'profileData é obrigatório.' })
    }

    // Verificar se já existe perfil 2
    let existingProfileId = primaryProfile.secondary_profile_id

    if (!existingProfileId) {
      const { data: checkSec } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('id', secondaryId)
        .maybeSingle()

      if (checkSec) {
        existingProfileId = checkSec.id
      }
    }

    const payload = {
      display_name: profileData.display_name,
      username: profileData.username,
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

    if (existingProfileId) {
      // Atualizar perfil 2 existente
      const { data: updated, error: uErr } = await supabaseAdmin
        .from('profiles')
        .update(payload)
        .eq('id', existingProfileId)
        .select()
        .single()

      if (uErr) {
        throw createError({ statusCode: 500, statusMessage: `Erro ao atualizar Perfil 2: ${uErr.message}` })
      }

      return { success: true, profile: updated }
    } else {
      // Criar novo perfil 2
      const newSecId = secondaryId
      const newPayload = {
        ...payload,
        id: newSecId,
        created_at: new Date().toISOString()
      }

      const { data: inserted, error: iErr } = await supabaseAdmin
        .from('profiles')
        .insert(newPayload)
        .select()
        .single()

      if (iErr) {
        // Tentar sem forçar ID se falhar por constraint
        const fallbackInsert = {
          ...payload,
          created_at: new Date().toISOString()
        }
        const { data: insertedFallback, error: fbErr } = await supabaseAdmin
          .from('profiles')
          .insert(fallbackInsert)
          .select()
          .single()

        if (fbErr) {
          throw createError({ statusCode: 500, statusMessage: `Erro ao criar Perfil 2: ${fbErr.message}` })
        }

        // Vincular ao perfil 1
        await supabaseAdmin.from('profiles').update({ secondary_profile_id: insertedFallback.id }).eq('id', userId)
        return { success: true, profile: insertedFallback }
      }

      // Vincular ao perfil 1
      await supabaseAdmin.from('profiles').update({ secondary_profile_id: newSecId }).eq('id', userId)
      return { success: true, profile: inserted }
    }
  }

  throw createError({ statusCode: 400, statusMessage: 'Ação inválida.' })
})
