import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { getAuthenticatedUser } from '../../../utils/auth'

const bodySchema = z.object({ expected_updated_at: z.string().datetime({ offset: true }) })

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const id = z.string().uuid().safeParse(getRouterParam(event, 'id'))
  const body = bodySchema.safeParse(await readBody(event))
  if (!id.success || !body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Dados de exclusão inválidos. Reabra a ficha.' })
  }
  const admin = createClient(
    process.env.SUPABASE_URL || 'https://mwrtluebbiyrmjrqwhut.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  )
  const { data: member, error: memberError } = await admin.from('prospecting_members')
    .select('user_id').eq('user_id', user.id).maybeSingle()
  if (memberError) throw createError({ statusCode: 500, statusMessage: 'Não foi possível verificar seu acesso.' })
  if (!member) throw createError({ statusCode: 403, statusMessage: 'Acesso restrito ao CRM.' })

  // One database transaction: history and company are removed together or preserved together.
  const { data: deleted, error } = await admin.rpc('prospecting_delete_lead', {
    p_lead_id: id.data,
    p_expected_updated_at: body.data.expected_updated_at,
  })
  if (error) {
    if (error.code === '40001') throw createError({ statusCode: 409, statusMessage: 'Esta empresa foi alterada em outra sessão. Recarregue o painel antes de excluir.' })
    if (error.code === 'PGRST202' || error.code === '42883') throw createError({ statusCode: 503, statusMessage: 'A exclusão ainda não foi habilitada no banco. Execute o script prospecting-delete-company.sql no Supabase.' })
    throw createError({ statusCode: 500, statusMessage: 'Não foi possível excluir a empresa. Os dados foram preservados.' })
  }
  return { deleted: deleted === true, id: id.data }
})
