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
    .select('id, username, display_name, avatar_url, subscription_status')
    .eq('id', userId)
    .single()

  // 2. Get all links for this user
  const { data: links } = await supabaseAdmin
    .from('links')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true })

  const totalClicks = (links || []).reduce((sum: number, l: any) => sum + (l.clicks_count || 0), 0)
  const linkIds = (links || []).map((l: any) => l.id)

  // 3. Get detailed click analytics from link_clicks table
  let clicksByPlatform: Record<string, number> = {}
  let clicksByDay: { date: string; clicks: number }[] = []
  let clicksByLink: { linkId: string; title: string; icon: string; clicks: number }[] = []
  let topReferrers: { referrer: string; clicks: number }[] = []
  let hasAnalyticsTable = false

  try {
    let clicksQuery = supabaseAdmin
      .from('link_clicks')
      .select('*')

    if (linkIds.length > 0) {
      clicksQuery = clicksQuery.or(`profile_id.eq.${userId},link_id.in.(${linkIds.join(',')})`)
    } else {
      clicksQuery = clicksQuery.eq('profile_id', userId)
    }

    if (startDate) {
      clicksQuery = clicksQuery.gte('created_at', startDate)
    }

    const { data: clicksData, error: clicksError } = await clicksQuery.order('created_at', { ascending: false })

    if (!clicksError && clicksData) {
      hasAnalyticsTable = true

      // Group by platform
      const platformMap: Record<string, number> = {}
      clicksData.forEach((c: any) => {
        const p = c.platform || 'Direto'
        platformMap[p] = (platformMap[p] || 0) + 1
      })
      clicksByPlatform = platformMap

      // Group by day
      const dayMap: Record<string, number> = {}
      clicksData.forEach((c: any) => {
        const day = (c.created_at || '').split('T')[0]
        if (day) dayMap[day] = (dayMap[day] || 0) + 1
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
    console.error('Error fetching analytics overview:', err)
  }

  // Fallback to links data if clicksByLink is empty
  if (clicksByLink.length === 0 && links) {
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
    totalLinks: (links || []).length,
    clicksByPlatform,
    clicksByDay,
    clicksByLink,
    topReferrers,
    hasAnalyticsTable,
    range
  }
})
