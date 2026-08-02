import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  let body: any = {}
  try {
    body = await readBody(event)
    if (typeof body === 'string') {
      body = JSON.parse(body)
    }
  } catch (e) {
    try {
      const raw = await readRawBody(event, 'utf-8')
      if (raw) body = JSON.parse(raw)
    } catch (err2) {}
  }

  const { linkId, profileId, platform, referrer } = body || {}

  if (!linkId) {
    throw createError({ statusCode: 400, statusMessage: 'ID do link é obrigatório.' })
  }

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  if (!supabaseServiceKey) {
    return { success: false, message: 'Supabase Service Key ausente' }
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  // Resolve target user/profile ID if missing
  let resolvedProfileId = profileId
  if (!resolvedProfileId) {
    try {
      const { data: linkInfo } = await supabaseAdmin.from('links').select('user_id').eq('id', linkId).single()
      if (linkInfo) {
        resolvedProfileId = linkInfo.user_id
      }
    } catch (e) {}
  }

  // 1. Incrementar a contagem total de cliques do link
  try {
    await supabaseAdmin.rpc('increment_link_click', { link_id: linkId })
  } catch (e) {
    try {
      const { data: currentLink } = await supabaseAdmin.from('links').select('clicks_count').eq('id', linkId).single()
      if (currentLink) {
        await supabaseAdmin.from('links').update({ clicks_count: (currentLink.clicks_count || 0) + 1 }).eq('id', linkId)
      }
    } catch (err2) {}
  }

  // 2. Registrar o clique na tabela link_clicks com a plataforma de origem (Instagram, TikTok, WhatsApp, etc.)
  try {
    const insertData: any = {
      link_id: linkId,
      platform: platform || 'Direto',
      referrer: referrer || null,
      created_at: new Date().toISOString()
    }
    if (resolvedProfileId && !resolvedProfileId.includes('_p2')) {
      insertData.profile_id = resolvedProfileId
    }

    const { error: insErr } = await supabaseAdmin.from('link_clicks').insert(insertData)
    if (insErr) {
      delete insertData.profile_id
      await supabaseAdmin.from('link_clicks').insert(insertData)
    }
  } catch (err: any) {
    console.error('Exception inserting link_clicks:', err)
  }

  return { success: true, platform, profileId: resolvedProfileId }
})
