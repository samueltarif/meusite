import type { Prospect } from '~/types/prospecting'
export function identityValue(kind: string, value: string) {
  let text = (value || '').trim().toLowerCase()
  if (kind === 'phone') {
    text = text.replace(/\D/g, '')
    if ((text.length === 12 || text.length === 13) && text.startsWith('55')) text = text.slice(2)
    return text
  }
  if (kind === 'company' || kind === 'person') return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')
  if (['website','instagram','maps'].includes(kind)) return text.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '')
  return text
}
const labels: Record<string, string> = { id: 'identificador', company: 'nome da empresa', person: 'nome do responsável', phone: 'telefone', email: 'e-mail', website: 'site', instagram: 'Instagram', maps: 'Google Maps' }
export function identityKeys(lead: Prospect) {
  const fields = ['id','company','person','email','website','instagram','maps'] as const
  return [...fields.map(key => ({ kind: key as string, value: identityValue(key, lead[key]) })), ...[lead.phone, ...(lead.additionalPhones || [])].map(value => ({ kind: 'phone', value: identityValue('phone', value) }))].filter(item => item.value)
}
export function assertNoImportDuplicates(incoming: Prospect[], existing: Prospect[]) {
  const seen = new Map<string, string>()
  const add = (lead: Prospect) => { for (const key of identityKeys(lead)) seen.set(`${key.kind}:${key.value}`, lead.company) }
  existing.forEach(add)
  for (const lead of incoming) {
    const keys = identityKeys(lead)
    for (const key of keys) {
      const match = seen.get(`${key.kind}:${key.value}`)
      if (match !== undefined) throw new Error(`Importação bloqueada: “${lead.company}” conflita com “${match}”: ${labels[key.kind]} em comum. Nenhum cadastro do arquivo foi importado.`)
    }
    add(lead)
  }
}
