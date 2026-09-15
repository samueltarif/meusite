import { websiteSolutions } from '~/constants/websiteSolutions'
import type { WebsiteSolution } from '~/types/websiteSolutions'

export function useSolutionSeo(path: string): WebsiteSolution {
  const solution = websiteSolutions.find(item => item.path === path)
  if (!solution) throw createError({ statusCode: 404, statusMessage: 'Serviço não encontrado' })
  useMarketingSeo(solution.title, solution.description, solution.path)
  const origin = String(useRuntimeConfig().public.siteUrl).replace(/\/$/, '')
  useHead({ script: [{ key: 'marketing-service', type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Service', name: solution.title, description: solution.description, url: `${origin}${path}`, areaServed: { '@type': 'Country', name: 'Brasil' }, provider: { '@type': 'Organization', '@id': `${origin}/#organization`, name: 'Avyro', url: `${origin}/` } }) }] })
  return solution
}
