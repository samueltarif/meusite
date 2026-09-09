<script setup lang="ts">
import { onErrorCaptured } from 'vue'
import AdsConsent from '~/components/campaign/AdsConsent.vue'
import { isCampaignPath } from '~/utils/ads'
const route = useRoute()
useHead(() => ({ link: [{ key: 'site-fonts', rel: 'stylesheet', href: isCampaignPath(route.path) ? 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap' : 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@500;700;800&family=Outfit:wght@400;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Space+Grotesk:wght@500;700&family=Pacifico&family=Permanent+Marker&family=Montserrat:wght@400;700&family=Cinzel:wght@600;800&family=Dancing+Script:wght@700&family=Bebas+Neue&family=Architects+Daughter&family=Syne:wght@700;800&family=Press+Start+2P&family=Noto+Emoji:wght@300..700&display=swap' }] }))

useHead({
  meta: [
    { name: 'facebook-domain-verification', content: 'rbfzh3fs2akz2hhu5x9w6nhojwae09' }
  ]
})

onErrorCaptured((err) => {
  console.warn('App-level captured error (prevented app crash):', err)
  return false
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <AdsConsent />
</template>
