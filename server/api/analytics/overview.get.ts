import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string
  const range = (query.range as string) || '7d' // 7d, 30d, 90d, all

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'userId é obrigatório.' })
  }

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  if (!supabaseServiceKey) {
    return { success: false, message: 'Supabase Service Key ausente' }
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  // Calculate date range
  let startDate: string | null = null
  const now = new Date()
  if (range === '7d') {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  } else if (range === '30d') {
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  } else if (range === '90d') {
    startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString()
  }

  // 1. Get profile
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id, username, display_name, avatar_url, subscription_status, views_count')
    .eq('id', userId)
    .single()

  const profileId = profile?.id || userId

  // 2. Get all links for this user
  const { data: links } = await supabaseAdmin
    .from('links')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true })

  const linkIds = (links || []).map((l: any) => l.id).filter(Boolean)
  const sumLinksCount = (links || []).reduce((sum: number, l: any) => sum + (l.clicks_count || 0), 0)

  // 3. Fetch detailed click analytics from link_clicks table
  let clicksByPlatform: Record<string, number> = {}
  let clicksByDay: { date: string; clicks: number }[] = []
  let clicksByLink: { linkId: string; title: string; icon: string; clicks: number }[] = []
  let topReferrers: { referrer: string; clicks: number }[] = []
  let clicksData: any[] = []
  let pageViewsData: any[] = []
  let hasLinkClicksTable = false

  try {
    let queryByProfile = supabaseAdmin.from('link_clicks').select('*').or(`profile_id.eq.${userId},profile_id.eq.${profileId}`)
    if (startDate) queryByProfile = queryByProfile.gte('created_at', startDate)
    
    const { data: pData, error: pErr } = await queryByProfile
    if (!pErr) hasLinkClicksTable = true
    if (pData) clicksData = [...pData]

    if (linkIds.length > 0) {
      let queryByLinks = supabaseAdmin.from('link_clicks').select('*').in('link_id', linkIds)
      if (startDate) queryByLinks = queryByLinks.gte('created_at', startDate)

      const { data: lData } = await queryByLinks
      if (lData && lData.length > 0) {
        const existingIds = new Set(clicksData.map(c => c.id))
        lData.forEach(c => {
          if (!existingIds.has(c.id)) {
            clicksData.push(c)
          }
        })
      }
    }
  } catch (err: any) {
    console.error('Error fetching link_clicks overview:', err)
  }

  // 4. Fetch page views logs from page_views table for traffic source breakdown
  try {
    let pvQuery = supabaseAdmin.from('page_views').select('*').or(`profile_id.eq.${userId},profile_id.eq.${profileId}`)
    if (startDate) pvQuery = pvQuery.gte('created_at', startDate)
    const { data: pvData } = await pvQuery
    if (pvData) pageViewsData = [...pvData]
  } catch (e) {}

  // Combine events for platform breakdown (preferring link_clicks, or page_views if link_clicks has few events)
  const platformEvents = clicksData.length > 0 ? clicksData : pageViewsData
  if (platformEvents.length > 0) {
    const platformMap: Record<string, number> = {}
    platformEvents.forEach((c: any) => {
      let p = c.platform || 'Direto'
      const ref = (c.referrer || '').toLowerCase()
      if (p === 'Outro Site' || p === 'Direto') {
        if (ref.includes('wl.co') || ref.includes('whatsapp') || ref.includes('wa.me') || ref.includes('com.whatsapp')) {
          p = 'WhatsApp'
        } else if (ref.includes('threads') || ref.includes('barcelona')) {
          p = 'Threads'
        } else if (ref.includes('instagram') || ref.includes('com.instagram')) {
          p = 'Instagram'
        } else if (ref.includes('tiktok') || ref.includes('musically') || ref.includes('zhiliaoapp')) {
          p = 'TikTok'
        } else if (ref.includes('facebook') || ref.includes('fb.com')) {
          p = 'Facebook'
        } else if (ref.includes('youtube') || ref.includes('youtu.be')) {
          p = 'YouTube'
        }
      }
      platformMap[p] = (platformMap[p] || 0) + 1
    })
    clicksByPlatform = platformMap
  }

  // Build daily clicks timeline (clicksByDay)
  if (clicksData.length > 0) {
    const dayMap: Record<string, number> = {}
    clicksData.forEach((c: any) => {
      if (!c.created_at) return
      try {
        const dateObj = new Date(c.created_at)
        const day = dateObj.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
        if (day && day !== 'Invalid Date') {
          dayMap[day] = (dayMap[day] || 0) + 1
        }
      } catch (e) {
        const day = c.created_at.split('T')[0]
        if (day) dayMap[day] = (dayMap[day] || 0) + 1
      }
    })

    clicksByDay = Object.entries(dayMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, clicks]) => ({ date, clicks }))

    // Group by link
    const linkMap: Record<string, number> = {}
    clicksData.forEach((c: any) => {
      const lid = c.link_id || 'unknown'
      linkMap[lid] = (linkMap[lid] || 0) + 1
    })

    clicksByLink = Object.entries(linkMap).map(([linkId, clicks]) => {
      const found = (links || []).find((l: any) => l.id === linkId)
      return {
        linkId,
        title: found?.title || 'Link Removido',
        icon: found?.icon || '',
        clicks
      }
    }).sort((a, b) => b.clicks - a.clicks)

    // Group by referrer
    const refMap: Record<string, number> = {}
    clicksData.forEach((c: any) => {
      const ref = c.referrer || 'Direto'
      if (ref && ref !== '') {
        refMap[ref] = (refMap[ref] || 0) + 1
      }
    })
    topReferrers = Object.entries(refMap)
      .map(([referrer, clicks]) => ({ referrer, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10)
  }

  // Calculate total clicks
  let totalClicks = clicksData.length
  if (!hasLinkClicksTable || (clicksData.length === 0 && sumLinksCount > 0)) {
    totalClicks = sumLinksCount
  }

  // Fetch real page views count
  let totalViews = pageViewsData.length
  try {
    let viewsQuery = supabaseAdmin.from('page_views').select('id', { count: 'exact', head: true }).or(`profile_id.eq.${userId},profile_id.eq.${profileId}`)
    if (startDate) viewsQuery = viewsQuery.gte('created_at', startDate)
    const { count: vCount } = await viewsQuery
    if (typeof vCount === 'number' && vCount > 0) {
      totalViews = vCount
    }
  } catch (e) {}

  if (totalViews === 0 && profile?.views_count) {
    totalViews = profile.views_count
  }
  if (totalViews < totalClicks) {
    totalViews = totalClicks
  }

  // Fallback to links data for clicksByLink if clicksByLink is empty but totalClicks > 0
  if (clicksByLink.length === 0 && links && totalClicks > 0) {
    clicksByLink = links
      .filter((l: any) => (l.clicks_count || 0) > 0)
      .map((l: any) => ({
        linkId: l.id,
        title: l.title,
        icon: l.icon || '',
        clicks: l.clicks_count || 0
      }))
      .sort((a: any, b: any) => b.clicks - a.clicks)
  }

  return {
    success: true,
    profile,
    totalClicks,
    totalViews,
    totalLinks: (links || []).length,
    clicksByPlatform,
    clicksByDay,
    clicksByLink,
    topReferrers,
    hasAnalyticsTable: true,
    range
  }
})
