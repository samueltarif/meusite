export function useMarketingSeo(title: string, description: string, path: string) {
  const origin = String(useRuntimeConfig().public.siteUrl).replace(/\/$/, '')
  const url = `${origin}${path}`
  useSeoMeta({ title: `${title} | Avyro`, description, ogTitle: `${title} | Avyro`, ogDescription: description, ogUrl: url, ogType: 'website', ogLocale: 'pt_BR', ogImage: `${origin}/images/avyro-social.png`, ogImageWidth: 1200, ogImageHeight: 630, twitterCard: 'summary_large_image', twitterTitle: title, twitterDescription: description, twitterImage: `${origin}/images/avyro-social.png` })
  useSeoMeta({ ogSiteName: 'Avyro' })
  const crumbs = [{ '@type': 'ListItem', position: 1, name: 'Avyro', item: `${origin}/` }]
  if (path.startsWith('/criacao-de-sites/')) crumbs.push({ '@type': 'ListItem', position: 2, name: 'Criação de sites', item: `${origin}/criacao-de-sites` })
  if (path !== '/') crumbs.push({ '@type': 'ListItem', position: crumbs.length + 1, name: title, item: url })
  useHead({ link: [{ rel: 'canonical', href: url }], script: path === '/' ? [] : [{ key: 'marketing-breadcrumbs', type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs }) }] })
}
