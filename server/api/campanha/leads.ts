import { createError, defineEventHandler, readBody, setResponseHeader, setResponseStatus } from 'h3'

/**
 * GET  /api/campanha/leads  -> lista os leads (dashboard)
 * POST /api/campanha/leads  -> grava um novo lead (landing page / quiz)
 */
export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    assertDashboardAccess(event)
    setResponseHeader(event, 'Cache-Control', 'no-store')
    return { leads: await listLeads() }
  }

  if (event.method === 'POST') {
    assertLeadRateLimit(event)
    const body = await readBody(event).catch(() => null)
    const parsed = createLeadSchema.safeParse(body)
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: 'Dados inválidos. Confira os campos e tente novamente.' })
    }
    // Honeypot preenchido = robô. Responde "ok" sem gravar.
    if (parsed.data.website) return { ok: true }

    const phone = normalizeBrPhone(parsed.data.phone)
    if (!phone) {
      throw createError({ statusCode: 400, statusMessage: 'WhatsApp inválido. Informe DDD + número.' })
    }

    const lead = await createLead(parsed.data, phone)
    setResponseStatus(event, 201)
    return { ok: true, id: lead.id }
  }

  throw createError({ statusCode: 405, statusMessage: 'Método não permitido' })
})
