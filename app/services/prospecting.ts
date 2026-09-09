import type { ProspectData } from '~/types/prospecting'
import { prospectDataSchema } from '~/validation/prospecting'
import { prospectStorageKey } from '~/constants/prospecting'
export function loadProspecting(): ProspectData {
  const raw = localStorage.getItem(prospectStorageKey)
  if (!raw) return { version: 1, leads: [], settings: { target: 30, budget: 0 } }
  return prospectDataSchema.parse(JSON.parse(raw))
}
export function persistProspecting(data: ProspectData): void { localStorage.setItem(prospectStorageKey, JSON.stringify(prospectDataSchema.parse(data))) }
export function downloadProspecting(data: ProspectData): void {
  downloadText(JSON.stringify(data, null, 2))
}
export function downloadOriginalProspecting(): void { downloadText(localStorage.getItem(prospectStorageKey) || '') }
function downloadText(text: string): void {
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob); const link = document.createElement('a')
  link.href = url; link.download = `avyro-prospeccao-${new Date().toISOString().slice(0, 10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export async function readProspectingBackup(file: File): Promise<ProspectData> {
  if (file.size > 10000000) throw new Error('O backup excede o limite de 10 MB.')
  return prospectDataSchema.parse(JSON.parse(await file.text()))
}
