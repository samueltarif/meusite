import assert from 'node:assert/strict'
import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url, { alias: { '~': `${process.cwd()}/app` } })

const {
  newProspect,
  parseInteractionStatus,
  formatInteractionNote,
  getLeadContactStatus,
  getLeadContactTime,
  formatContactTimeDisplay,
  localDay,
  addDays,
} = await jiti.import('../app/utils/prospecting.ts')

const {
  prospectContactStatuses,
  prospectContactStatusClasses,
  prospectContactStatusDots,
} = await jiti.import('../app/constants/prospecting.ts')

const { prospectSchema } = await jiti.import('../app/validation/prospecting.ts')
const { dbRowToProspect } = await jiti.import('../app/services/prospecting-api.ts')

// 1. Verify constant options match user requirements exactly:
// "nenhum contato, e contato realizado, nao atendeu, nao responndeu"
assert.deepEqual(prospectContactStatuses, [
  'Nenhum contato',
  'Contato realizado',
  'Não atendeu',
  'Não respondeu',
])

for (const status of prospectContactStatuses) {
  assert.ok(prospectContactStatusClasses[status], `Missing CSS class for status: ${status}`)
  assert.ok(prospectContactStatusDots[status], `Missing dot CSS class for status: ${status}`)
}

// 2. Verify formatInteractionNote
const noteWithMsg = formatInteractionNote('Contato realizado', '14:35', 'Enviado catálogo no WhatsApp')
assert.equal(noteWithMsg, '[Status: Contato realizado | Horário: 14:35] Enviado catálogo no WhatsApp')

const noteWithoutMsg = formatInteractionNote('Não atendeu', '10:15')
assert.equal(noteWithoutMsg, '[Status: Não atendeu | Horário: 10:15]')

// 3. Verify parseInteractionStatus
const parsed1 = parseInteractionStatus('[Status: Contato realizado | Horário: 14:35] Enviado catálogo')
assert.equal(parsed1?.status, 'Contato realizado')
assert.equal(parsed1?.time, '14:35')

const parsed2 = parseInteractionStatus('[Status: Não respondeu | Horário: 17:00]')
assert.equal(parsed2?.status, 'Não respondeu')
assert.equal(parsed2?.time, '17:00')

const parsed3 = parseInteractionStatus('[Status: Não atendeu]')
assert.equal(parsed3?.status, 'Não atendeu')
assert.equal(parsed3?.time, undefined)

const parsedLegacy = parseInteractionStatus('Contato comum sem prefixo')
assert.equal(parsedLegacy, null)

// 4. Verify getLeadContactStatus & getLeadContactTime for a fresh lead
const freshLead = { ...newProspect(), company: 'Oficina Exemplo', city: 'São Paulo', segment: 'Funilaria' }
assert.equal(getLeadContactStatus(freshLead), 'Nenhum contato')
assert.equal(getLeadContactTime(freshLead), '')
assert.equal(formatContactTimeDisplay(freshLead), 'Sem contato registrado')

// 5. Verify lead with explicit contactStatus and contactTime
const leadWithDirectProps = {
  ...freshLead,
  contactStatus: 'Não atendeu',
  contactTime: '09:45',
}
assert.equal(getLeadContactStatus(leadWithDirectProps), 'Não atendeu')
assert.equal(getLeadContactTime(leadWithDirectProps), '09:45')

// 6. Verify lead with history containing formatted notes
const today = localDay()
const yesterday = addDays(today, -1)

const leadWithHistory = {
  ...freshLead,
  history: [
    {
      id: 'h1',
      date: yesterday,
      channel: 'Telefone',
      stage: 'Contatado',
      note: formatInteractionNote('Não atendeu', '11:20', 'Chamou até cair'),
    },
    {
      id: 'h2',
      date: today,
      channel: 'WhatsApp',
      stage: 'Contatado',
      note: formatInteractionNote('Contato realizado', '15:10', 'Mensagem enviada com apresentação'),
    },
  ],
}

assert.equal(getLeadContactStatus(leadWithHistory), 'Contato realizado')
assert.equal(getLeadContactTime(leadWithHistory), '15:10')
assert.equal(formatContactTimeDisplay(leadWithHistory, today), 'Hoje às 15:10')

// 7. Verify display for yesterday
const leadYesterday = {
  ...freshLead,
  history: [
    {
      id: 'h1',
      date: yesterday,
      channel: 'Telefone',
      stage: 'Contatado',
      note: formatInteractionNote('Não atendeu', '11:20'),
    },
  ],
}
assert.equal(getLeadContactStatus(leadYesterday), 'Não atendeu')
assert.equal(getLeadContactTime(leadYesterday), '11:20')
assert.equal(formatContactTimeDisplay(leadYesterday, today), 'Ontem às 11:20')

// 8. Verify display for past date
const leadPast = {
  ...freshLead,
  history: [
    {
      id: 'h1',
      date: '2026-08-15',
      channel: 'Instagram',
      stage: 'Contatado',
      note: formatInteractionNote('Não respondeu', '16:00'),
    },
  ],
}
assert.equal(getLeadContactStatus(leadPast), 'Não respondeu')
assert.equal(getLeadContactTime(leadPast), '16:00')
assert.equal(formatContactTimeDisplay(leadPast, today), '15/08 às 16:00')

// 9. Verify fallback heuristic for legacy notes without prefix
const leadLegacyNotAnswered = {
  ...freshLead,
  history: [
    {
      id: 'h1',
      date: today,
      channel: 'Telefone',
      stage: 'Contatado',
      note: 'Liguei mas não atendeu',
      createdAt: '2026-09-30T14:22:00Z',
    },
  ],
}
assert.equal(getLeadContactStatus(leadLegacyNotAnswered), 'Não atendeu')

const leadLegacyNoReply = {
  ...freshLead,
  history: [
    {
      id: 'h1',
      date: today,
      channel: 'WhatsApp',
      stage: 'Contatado',
      note: 'Mandei msg mas não respondeu ainda',
    },
  ],
}
assert.equal(getLeadContactStatus(leadLegacyNoReply), 'Não respondeu')

// 10. Verify prospectSchema accepts contactStatus, contactTime, and timestamps
assert.equal(
  prospectSchema.safeParse({
    ...freshLead,
    contactStatus: 'Não atendeu',
    contactTime: '10:30',
  }).success,
  true
)

assert.equal(
  prospectSchema.safeParse({
    ...freshLead,
    contactStatus: 'Status Invalido',
  }).success,
  false
)

// 11. Verify dbRowToProspect conversion
const dbRow = {
  id: 'lead-123',
  company: 'Funilaria Auto Peças',
  person: 'João',
  city: 'São Paulo',
  segment: 'Funilaria',
  source: 'Google Maps',
  maps: 'https://maps.google.com',
  instagram: '@autofunilaria',
  website: '',
  phone: '11988887777',
  additional_phones: ['11977776666'],
  email: '',
  website_status: 'Sem site',
  activity: 'Ativo',
  good_reviews: true,
  recent_photos: true,
  professional: true,
  rating: 4.8,
  review_count: 32,
  heat_override: null,
  opportunity: 'Criar site',
  personalization: '',
  stage: 'Contatado',
  next_action: 'Cobrar resposta',
  follow_up: '2026-10-02',
  notes: '',
  proposal_value: 1200,
  monthly_value: 150,
  archived: false,
  created_at: '2026-09-30T10:00:00.000+00:00',
  updated_at: '2026-09-30T14:35:00.000+00:00',
}

const dbInteractions = [
  {
    id: 'int-1',
    lead_id: 'lead-123',
    interaction_date: '2026-09-30',
    channel: 'WhatsApp',
    stage: 'Contatado',
    note: '[Status: Contato realizado | Horário: 14:35] Mensagem inicial enviada com proposta',
    created_at: '2026-09-30T14:35:00.000+00:00',
  },
]

const prospect = dbRowToProspect(dbRow, dbInteractions)
assert.equal(prospect.company, 'Funilaria Auto Peças')
assert.equal(prospect.contactStatus, 'Contato realizado')
assert.equal(prospect.contactTime, '14:35')
assert.equal(getLeadContactStatus(prospect), 'Contato realizado')
assert.equal(getLeadContactTime(prospect), '14:35')
assert.equal(formatContactTimeDisplay(prospect, today), 'Hoje às 14:35')

console.log('OK: status de contato (Nenhum contato, Contato realizado, Não atendeu, Não respondeu), horário obrigatório, exibição externa e persistência verificados com sucesso!')
