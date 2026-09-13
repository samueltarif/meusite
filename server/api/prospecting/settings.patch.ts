import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser } from '../../utils/auth'

const bodySchema = z.object({
  target: z.number().int().min(1).max(100000),
  budget: z.number().min(0).max(10000000),
})

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

  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Informe uma meta positiva e um investimento vÃ¡lido.' })
  }

  const { data, error } = await admin
    .from('prospecting_settings')
    .update({ target: parsed.data.target, budget: parsed.data.budget })
    .eq('singleton', true)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: 'Erro ao salvar configuraÃ§Ãµes.' })

  return { settings: data }
})

