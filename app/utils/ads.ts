export function validAdsConfig(id: string, label: string): boolean { return /^AW-\d+$/.test(id) && /^[A-Za-z0-9_-]+$/.test(label) }
export function isCampaignPath(path: string): boolean { return path === '/' || path === '/modelos-site' || path === '/criacao-de-sites' || path.startsWith('/criacao-de-sites/') || path.startsWith('/exemplos/') }
export function isAvyroContact(href: string): boolean {
  try { const url = new URL(href); return url.protocol === 'https:' && url.hostname === 'wa.me' && url.pathname === '/5511951372631' } catch { return false }
}
