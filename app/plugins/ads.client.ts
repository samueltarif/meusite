import { isCampaignPath, isAvyroContact, validAdsConfig } from '~/utils/ads'
export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig().public
  const id = String(config.googleAdsId); const label = String(config.googleAdsConversionLabel)
  if (!validAdsConfig(id, label) || ['localhost', '127.0.0.1'].includes(location.hostname)) return
  const route = useRoute()
  const { choice } = useAdsConsent()
  try { const saved = localStorage.getItem('avyro-ads-consent-v1'); if (saved === 'accepted' || saved === 'denied') choice.value = saved } catch { /* Use the current visit's choice. */ }
  let started = false
  function initialize() {
    if (choice.value !== 'accepted' || !isCampaignPath(route.path)) return
    window.dataLayer ||= []
    window.gtag ||= function () { window.dataLayer!.push(arguments) }
    if (!started) {
      window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' })
      window.gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'denied', analytics_storage: 'denied' })
      window.gtag('js', new Date())
      window.gtag('config', id, { allow_ad_personalization_signals: false })
      const script = document.createElement('script'); script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`; document.head.appendChild(script)
      started = true
    } else window.gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted' })
  }
  watch([choice, () => route.path], () => {
    if (choice.value === 'accepted' && isCampaignPath(route.path)) initialize()
    else if (started) window.gtag?.('consent', 'update', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' })
  }, { immediate: true })
  let lastClick = 0
  function track(event: MouseEvent) {
    if (choice.value !== 'accepted' || !isCampaignPath(route.path) || !(event.target instanceof Element)) return
    const link = event.target.closest('a')
    if (!link || !isAvyroContact(link.href) || Date.now() - lastClick < 1200) return
    lastClick = Date.now()
    window.gtag?.('event', 'conversion', { send_to: `${id}/${label}`, transport_type: 'beacon' })
  }
  document.addEventListener('click', track, true)
  nuxtApp.vueApp.onUnmount(() => document.removeEventListener('click', track, true))
})
