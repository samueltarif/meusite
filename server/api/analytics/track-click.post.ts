import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { linkId, profileId, platform, referrer } = body

  if (!linkId) {
    throw createError({ statusCode: 400, statusMessage: 'ID do link é obrigatório.' })
  }

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  if (!supabaseServiceKey) {
    return { success: false, message: 'Supabase Service Key ausente' }
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

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

  // 2. Registrar o clique no banco de dados com a plataforma de origem (Instagram, TikTok, WhatsApp, etc.)
  try {
    await supabaseAdmin.from('link_clicks').insert({
      link_id: linkId,
      profile_id: profileId || null,
      platform: platform || 'Direto',
      referrer: referrer || null,
      created_at: new Date().toISOString()
    })
  } catch (err: any) {
    // Se a tabela analítica link_clicks ainda não foi criada no Supabase, a contagem principal continua funcionando 100%
  }

  return { success: true, platform }
})
