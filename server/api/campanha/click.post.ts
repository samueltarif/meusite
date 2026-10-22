import { createError, defineEventHandler, readBody, setResponseStatus } from 'h3'
import { z } from 'zod'

/**
 * POST /api/campanha/click -> registra um clique no botão de WhatsApp da landing (sem nome/telefone).
 * O cliente segue para o WhatsApp com "Ref: CODIGO" na mensagem; o mesmo código fica salvo aqui,
 * então quando a mensagem chegar dá para localizar o clique (e o anúncio de origem) no painel.
 */
const clickSchema = z.object({
  ref: z.string().trim().regex(/^[23456789ABCDEFGHJKMNPQRSTVWXYZ]{8}$/),
  origem: z.string().trim().max(40).default('site'),
  tracking: z.record(z.string(), z.any()).optional()
})

export default defineEventHandler(async (event) => {
  assertLeadRateLimit(event)
  const body = await readBody(event).catch(() => null)
  const parsed = clickSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Dados inválidos.' })
  }

  // Só repassa as chaves de rastreamento conhecidas (o createLeadSchema descarta o resto)
  const t = parsed.data.tracking || {}
  const tracking = createLeadSchema.shape.tracking.parse({
    gclid: t.gclid, gbraid: t.gbraid, wbraid: t.wbraid,
    utm_source: t.utm_source, utm_medium: t.utm_medium, utm_campaign: t.utm_campaign,
    utm_term: t.utm_term, utm_content: t.utm_content, landing: t.landing,
    ref: parsed.data.ref
  })

  const lead = await createLead({
    name: 'Clique no WhatsApp',
    phone: '',
    tipo: 'nao-informado',
    quantidade: 'nao-informado',
    local: '',
    origem: `whatsapp-clique-${parsed.data.origem}`,
    tracking
  }, '')
  setResponseStatus(event, 201)
  return { ok: true, id: lead.id }
})
