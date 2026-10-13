import { createError, defineEventHandler, getRouterParam, readBody, setResponseHeader } from 'h3'

/**
 * GET    /api/campanha/leads/:id -> um lead
 * PATCH  /api/campanha/leads/:id -> atualiza status, anotações e/ou valor negociado
 * DELETE /api/campanha/leads/:id -> remove o lead
 */
export default defineEventHandler(async (event) => {
  assertDashboardAccess(event)
  setResponseHeader(event, 'Cache-Control', 'no-store')

  const id = getRouterParam(event, 'id') || ''
  if (!/^[A-Za-z0-9-]{8,64}$/.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID inválido' })
  }

  if (event.method === 'GET') {
    const lead = await getLead(id)
    if (!lead) throw createError({ statusCode: 404, statusMessage: 'Lead não encontrado' })
    return { lead }
  }

  if (event.method === 'PATCH') {
    const body = await readBody(event).catch(() => null)
    const parsed = updateLeadSchema.safeParse(body)
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: 'Dados inválidos' })
    }
    const lead = await updateLead(id, parsed.data)
    if (!lead) throw createError({ statusCode: 404, statusMessage: 'Lead não encontrado' })
    return { lead }
  }

  if (event.method === 'DELETE') {
    const removed = await deleteLead(id)
    if (!removed) throw createError({ statusCode: 404, statusMessage: 'Lead não encontrado' })
    return { ok: true }
  }

  throw createError({ statusCode: 405, statusMessage: 'Método não permitido' })
})
