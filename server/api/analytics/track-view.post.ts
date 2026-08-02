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

  const { profileId, platform, referrer } = body || {}

  if (!profileId) {
    throw createError({ statusCode: 400, statusMessage: 'profileId é obrigatório.' })
  }

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  if (!supabaseServiceKey) {
    return { success: false, message: 'Supabase Service Key ausente' }
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  // 1. Increment views_count on profiles table
  try {
    await supabaseAdmin.rpc('increment_profile_view', { target_profile_id: profileId })
  } catch (e) {
    try {
      const { data: currentP } = await supabaseAdmin.from('profiles').select('views_count').eq('id', profileId).single()
      if (currentP) {
        await supabaseAdmin.from('profiles').update({ views_count: (currentP.views_count || 0) + 1 }).eq('id', profileId)
      }
    } catch (err2) {}
  }

  // 2. Insert detailed view event in page_views table
  try {
    const { error: insErr } = await supabaseAdmin.from('page_views').insert({
      profile_id: profileId,
      platform: platform || 'Direto',
      referrer: referrer || null,
      created_at: new Date().toISOString()
    })
    if (insErr) {
      console.warn('Insert page_views warning:', insErr.message)
    }
  } catch (err: any) {
    console.warn('Exception inserting page_views:', err)
  }

  return { success: true, profileId, platform }
})
