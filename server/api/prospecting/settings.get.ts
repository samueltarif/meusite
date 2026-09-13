import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)

  const supabaseUrl = process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const admin = createClient(supabaseUrl, supabaseKey)

  const { data: member } = await admin
    .from('prospecting_members')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!member) throw createError({ statusCode: 403, statusMessage: 'Acesso restrito ao CRM.' })

  const { data, error } = await admin
    .from('prospecting_settings')
    .select('*')
    .eq('singleton', true)
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: 'Erro ao carregar configuraÃ§Ãµes.' })

  return { settings: data }
})

