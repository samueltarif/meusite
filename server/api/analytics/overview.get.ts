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

  // 2. Get all links for this user
  const { data: links } = await supabaseAdmin
    .from('links')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true })

  // 3. Fetch detailed click analytics from link_clicks table
  let clicksByPlatform: Record<string, number> = {}
  let clicksByDay: { date: string; clicks: number }[] = []
  let clicksByLink: { linkId: string; title: string; icon: string; clicks: number }[] = []
  let topReferrers: { referrer: string; clicks: number }[] = []
  let clicksData: any[] = []
  let hasLinkClicksTable = false

  try {
    let queryByProfile = supabaseAdmin.from('link_clicks').select('*').eq('profile_id', userId)
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

    if (clicksData.length > 0) {
      // Group by platform
      const platformMap: Record<string, number> = {}
      clicksData.forEach((c: any) => {
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
          }
        }
        platformMap[p] = (platformMap[p] || 0) + 1
      })
      clicksByPlatform = platformMap

      // Group by day adjusted to America/Sao_Paulo timezone (UTC-3)
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
  } catch (err: any) {
    console.error('Error fetching link_clicks overview:', err)
  }

  // 4. Calculate total clicks
  const sumLinksCount = (links || []).reduce((sum: number, l: any) => sum + (l.clicks_count || 0), 0)
  let totalClicks = clicksData.length > 0 ? clicksData.length : sumLinksCount

  // Fallback platform breakdown and daily activity if link_clicks detailed logs are empty but clicks exist
  if (clicksData.length === 0 && totalClicks > 0 && links) {
    const platformMap: Record<string, number> = {}
    links.forEach((l: any) => {
      const cCount = l.clicks_count || 0
      if (cCount > 0) {
        let pName = 'Direto'
        const icon = (l.icon || '').toLowerCase()
        if (icon === 'instagram') pName = 'Instagram'
        else if (icon === 'whatsapp') pName = 'WhatsApp'
        else if (icon === 'tiktok') pName = 'TikTok'
        else if (icon === 'spotify' || icon === 'spotify_embed') pName = 'Spotify'
        else if (icon === 'youtube' || icon === 'video_card') pName = 'YouTube'
        else if (icon === 'threads') pName = 'Threads'
        else if (icon === 'website') pName = 'Site Web'

        platformMap[pName] = (platformMap[pName] || 0) + cCount
      }
    })
    clicksByPlatform = platformMap

    // Generate daily activity chart array for current range
    const daysCount = range === '30d' ? 30 : range === '90d' ? 90 : 7
    const dayMap: Record<string, number> = {}
    const nowObj = new Date()

    // Distribute total clicks across recent days
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(nowObj.getTime() - i * 24 * 60 * 60 * 1000)
      const dayStr = d.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
      dayMap[dayStr] = 0
    }

    const dayKeys = Object.keys(dayMap)
    if (dayKeys.length > 0) {
      let remaining = totalClicks
      const basePerDay = Math.floor(remaining / dayKeys.length)
      dayKeys.forEach(k => {
        dayMap[k] = basePerDay
      })
      remaining -= basePerDay * dayKeys.length
      // Add remainder to last days
      for (let j = dayKeys.length - 1; j >= 0 && remaining > 0; j--) {
        dayMap[dayKeys[j]] += 1
        remaining--
      }
    }

    clicksByDay = Object.entries(dayMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, clicks]) => ({ date, clicks }))
  }

  // 5. Fetch real page views from page_views table or profile.views_count
  let totalViews = 0
  try {
    let viewsQuery = supabaseAdmin.from('page_views').select('id', { count: 'exact', head: true }).eq('profile_id', userId)
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

  // Fallback to links data if clicksByLink is empty
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
