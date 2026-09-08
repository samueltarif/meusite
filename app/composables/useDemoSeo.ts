export function useDemoSeo(title: string, description: string): void {
  useSeoMeta({ title: `${title} | Demonstração Avyro`, description, ogTitle: `${title} | Demonstração Avyro`, ogDescription: description, twitterCard: 'summary', twitterTitle: title, twitterDescription: description, robots: 'noindex, follow' })
}
