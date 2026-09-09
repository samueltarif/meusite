export function useMarketingSeo(title: string, description: string, path: string) {
  const origin = String(useRuntimeConfig().public.siteUrl).replace(/\/$/, '')
  const url = `${origin}${path}`
  useSeoMeta({ title: `${title} | Avyro`, description, ogTitle: `${title} | Avyro`, ogDescription: description, ogUrl: url, ogType: 'website', ogLocale: 'pt_BR', ogImage: `${origin}/images/avyro-social.png`, ogImageWidth: 1200, ogImageHeight: 630, twitterCard: 'summary_large_image', twitterTitle: title, twitterDescription: description, twitterImage: `${origin}/images/avyro-social.png` })
  useHead({ link: [{ rel: 'canonical', href: url }] })
}
