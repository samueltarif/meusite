import { QUANTIDADE_LABEL, TIPO_LABEL } from '~/constants/campanha'
import type { CampanhaLead } from '~/constants/campanha'

// Helpers da campanha GMK (landing + dashboard). Prefixo "campanha" evita colisão de auto-import.

/** Máscara (11) 99999-9999 / (11) 2345-6789 enquanto digita. */
export function campanhaMaskPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (!d.length) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function campanhaPhoneIsValid(value: string): boolean {
  const d = value.replace(/\D/g, '')
  if (d.length !== 10 && d.length !== 11) return false
  if (Number(d.slice(0, 2)) < 11) return false
  return d.length === 10 || d[2] === '9'
}

/** 5511999998888 -> (11) 99999-8888 */
export function campanhaDisplayPhone(phone: string): string {
  const d = phone.replace(/\D/g, '')
  return campanhaMaskPhone(d.startsWith('55') && d.length > 11 ? d.slice(2) : d)
}

export function campanhaFormatBRL(value: number | null | undefined): string {
  return (value ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/** "1.250,50" | "R$ 1250" | "1250.5" -> número (ou null). */
export function campanhaParseBRL(input: string): number | null {
  let s = input.replace(/[^\d.,]/g, '')
  if (!s) return null
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.')
  else if (!/^\d+\.\d{1,2}$/.test(s)) s = s.replace(/\./g, '')
  const n = Number(s)
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null
}

export function campanhaNormalizeText(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

const TZ = 'America/Sao_Paulo'

/** "hoje 14:32", "ontem 09:10" ou "12/10 18:00" */
export function campanhaFormatDate(iso: string): string {
  const d = new Date(iso)
  const key = (x: Date) => x.toLocaleDateString('en-CA', { timeZone: TZ })
  const hour = d.toLocaleTimeString('pt-BR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' })
  const now = new Date()
  if (key(d) === key(now)) return `hoje ${hour}`
  if (key(d) === key(new Date(now.getTime() - 86_400_000))) return `ontem ${hour}`
  const day = d.toLocaleDateString('pt-BR', { timeZone: TZ, day: '2-digit', month: '2-digit' })
  return `${day} ${hour}`
}

export function campanhaTimeAgo(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime())
  const min = Math.floor(diff / 60_000)
  if (min < 1) return 'agora'
  if (min < 60) return `há ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `há ${h} h`
  const days = Math.floor(h / 24)
  return `há ${days} ${days === 1 ? 'dia' : 'dias'}`
}

/** Link wa.me para falar com o cliente, com mensagem pronta do orçamento. */
export function campanhaLeadWhatsAppUrl(lead: CampanhaLead): string {
  const first = lead.name.trim().split(/\s+/)[0] || ''
  if (lead.tipo === 'nao-informado') {
    const hello = [
      `Olá, ${first}! Aqui é da GMK Telas Mosquiteiras. 👋`,
      '',
      'Vi que você chamou pelo nosso site e quero te ajudar com o orçamento de telas mosquiteiras.',
      'Qual tipo de tela você precisa (janela, porta, sacada) e quantas unidades?'
    ].join('\n')
    return `https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(hello)}`
  }
  const text = [
    `Olá, ${first}! Aqui é da GMK Telas Mosquiteiras. 👋`,
    '',
    'Recebi seu pedido de orçamento:',
    `• Tipo: ${TIPO_LABEL[lead.tipo] ?? lead.tipo}`,
    `• Quantidade: ${QUANTIDADE_LABEL[lead.quantidade] ?? lead.quantidade}`,
    ...(lead.local ? [`• Local: ${lead.local}`] : []),
    '',
    'Vou te ajudar a finalizar o orçamento. Pode me confirmar algumas medidas?'
  ].join('\n')
  return `https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
}
