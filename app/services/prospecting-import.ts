import { z } from 'zod'
import type { Prospect, ProspectData } from '~/types/prospecting'
import { newProspect } from '~/utils/prospecting'
import { prospectSchema } from '~/validation/prospecting'
import { prospectFieldLabels } from './prospecting-export'

export function normalizeImport(raw: unknown): ProspectData {
  const value = raw as any
  const items = Array.isArray(value) ? value : Array.isArray(value?.leads) ? value.leads : value?.company ? [value] : null
  if (!items?.length || items.length > 5000) throw new Error('Informe entre 1 e 5.000 empresas: uma ficha JSON, uma lista ou um arquivo exportado pelo painel.')
  const ids = new Set<string>(), historyIds = new Set<string>()
  const leads = items.map((item: any, index: number) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error(`Cadastro ${index + 1}: formato inválido.`)
    const known = new Set(Object.keys(prospectSchema.shape))
    const unknown = Object.keys(item).filter(key => !known.has(key))
    if (unknown.length) throw new Error(`Cadastro ${index + 1}: campos desconhecidos: ${unknown.join(', ')}.`)
    const base = newProspect()
    const merged = { ...base, ...item, id: item.id || base.id, createdAt: item.createdAt || base.createdAt, updatedAt: item.updatedAt || base.updatedAt }
    merged.history = (item.history || []).map((entry: any) => ({ ...entry, id: entry.id || crypto.randomUUID() }))
    const parsed = prospectSchema.safeParse(merged)
    if (!parsed.success) throw new Error(`Cadastro ${index + 1} (${item.company || 'sem nome'}): ${parsed.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('; ')}`)
    const lead = parsed.data
    if (!z.string().uuid().safeParse(lead.id).success || ids.has(lead.id)) throw new Error(`Cadastro ${index + 1}: identificador inválido ou duplicado.`)
    ids.add(lead.id)
    for (const entry of lead.history) {
      if (!z.string().uuid().safeParse(entry.id).success || historyIds.has(entry.id)) throw new Error(`Cadastro ${index + 1}: identificador de histórico inválido ou duplicado.`)
      historyIds.add(entry.id)
    }
    return lead
  })
  return { version: 1, leads, settings: { target: 30, budget: 0 } }
}

export async function readProspectImport(file: File): Promise<ProspectData> {
  if (file.size > 10_000_000) throw new Error('O arquivo deve ter até 10 MB.')
  if (/\.json$/i.test(file.name)) return normalizeImport(JSON.parse((await file.text()).replace(/^\uFEFF/, '')))
  if (!/\.xlsx$/i.test(file.name)) throw new Error('Escolha JSON ou Excel .xlsx. O formato .xls não é suportado.')
  const { default: ExcelJS } = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(await file.arrayBuffer())
  const page = workbook.getWorksheet('Empresas')
  if (!page) throw new Error('O Excel precisa da aba Empresas. Use um arquivo exportado pelo painel como modelo.')
  const cellValue = (cell: any) => {
    const value = cell.value
    if (value instanceof Date) return value.toISOString()
    if (value && typeof value === 'object') {
      if (value.formula || value.sharedFormula) throw new Error(`Fórmula na célula ${cell.address}. Cole apenas os valores antes de importar.`)
      if (value.richText) return value.richText.map((part: any) => part.text).join('')
      if (value.hyperlink) return value.text
      throw new Error(`Conteúdo inválido na célula ${cell.address}.`)
    }
    return value
  }
  function rows(sheet: any, aliases: Record<string, string>) {
    if (!sheet) return []
    if (sheet.rowCount > 100001) throw new Error('A planilha excede o limite de linhas por aba.')
    const headers = new Map<number, string>()
    sheet.getRow(1).eachCell((cell: any, column: number) => {
      const label = String(cellValue(cell) || '').trim()
      const key = label.match(/\[([^\]]+)\]$/)?.[1] || aliases[label] || label
      if ([...headers.values()].includes(key)) throw new Error(`Coluna duplicada: ${label}.`)
      headers.set(column, key)
    })
    const records: Record<string, any>[] = []
    sheet.eachRow((row: any, number: number) => {
      if (number === 1) return
      const record: Record<string, any> = {}
      for (const [column, key] of headers) record[key] = cellValue(row.getCell(column))
      if (Object.values(record).some(value => value !== null && value !== '')) records.push(record)
    })
    return records
  }
  const aliases = Object.fromEntries(Object.entries(prospectFieldLabels).map(([key, label]) => [label, key]))
  const records = rows(page, aliases)
  const booleanFields = ['goodReviews', 'recentPhotos', 'professional', 'archived']
  const numericFields = ['rating', 'reviewCount', 'proposalValue', 'monthlyValue']
  for (const record of records) {
    for (const key of Object.keys(record)) {
      const value = record[key]
      if (value === null) { delete record[key]; continue }
      if (booleanFields.includes(key) && typeof value !== 'boolean') {
        if (['true', 'sim', '1'].includes(String(value).toLowerCase())) record[key] = true
        else if (['false', 'não', 'nao', '0'].includes(String(value).toLowerCase())) record[key] = false
        else throw new Error(`Valor inválido para ${key}: use Sim ou Não.`)
      }
      if (numericFields.includes(key) && typeof value === 'string') record[key] = value === '' && ['rating', 'reviewCount'].includes(key) ? null : Number(value.replace(',', '.'))
      if (key === 'followUp' && typeof value === 'string' && value.includes('T')) record[key] = value.slice(0, 10)
      if (['phone', 'contactTime'].includes(key) && typeof value === 'number') throw new Error(`A coluna ${key} deve ser texto para preservar todos os dígitos.`)
    }
    record.additionalPhones = record.additionalPhones ? JSON.parse(record.additionalPhones) : []
    record.history = record.history ? JSON.parse(record.history) : []
  }
  const byId = new Map(records.filter(record => record.id).map(record => [record.id, record]))
  const phones = rows(workbook.getWorksheet('Telefones'), { 'Empresa': 'company', 'Campo original': 'field', 'Posição (0 = principal)': 'position', 'Número original (texto)': 'phone' })
  const positions = new Set<string>()
  for (const row of phones.sort((a, b) => Number(a.position) - Number(b.position))) {
    const parent = byId.get(row.leadId)
    if (!parent) throw new Error('Um telefone aponta para uma empresa inexistente na aba Empresas.')
    if (typeof row.phone === 'number') throw new Error('Os telefones devem estar formatados como texto.')
    if (row.field === 'phone') continue // Main value is edited in Empresas, which is authoritative.
    if (row.field !== 'additionalPhones' || !Number.isInteger(Number(row.position)) || Number(row.position) < 1) throw new Error('Campo ou posição de telefone inválido.')
    const key = `${row.leadId}:${row.position}`
    if (positions.has(key)) throw new Error('Posição de telefone duplicada.')
    positions.add(key)
    parent.additionalPhones.push(row.phone ?? '')
  }
  const history = rows(workbook.getWorksheet('Historico'), { 'Empresa': 'company', 'Posição no histórico': 'position' })
  for (const row of history.sort((a, b) => Number(a.position) - Number(b.position))) {
    const parent = byId.get(row.leadId)
    if (!parent) throw new Error('Uma interação aponta para uma empresa inexistente na aba Empresas.')
    const { leadId, company, position, ...entry } = row
    for (const key of Object.keys(entry)) if (entry[key] === null) delete entry[key]
    if (entry.date?.includes('T')) entry.date = entry.date.slice(0, 10)
    parent.history.push(entry)
  }
  return normalizeImport(records)
}
