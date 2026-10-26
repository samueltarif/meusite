// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    serverAssets: [{ baseName: 'photography', dir: '../public/lindner_site_preview/lindner_site', ignore: ['assets/**'] }]
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  future: {
    compatibilityVersion: 4
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls: {
          includeAbsolute: false
        }
      }
    },
    optimizeDeps: {
      include: ['ws']
    },
    server: {
      watch: {
        ignored: ['**/.nuxt/**', '**/.output/**', '**/.git/**']
      }
    }
  },
  routeRules: {
    '/images/**': { redirect: { to: 'https://media.avyro.com.br/images/**', statusCode: 301 } },
    '/videos/**': { redirect: { to: 'https://media.avyro.com.br/videos/**', statusCode: 301 } },
    '/datasheets/**': { redirect: { to: 'https://media.avyro.com.br/datasheets/**', statusCode: 301 } }
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes' },
        { name: 'facebook-domain-verification', content: 'rbfzh3fs2akz2hhu5x9w6nhojwae09' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },

        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
        }
      ],
      script: [
        {
          key: 'clarity-ms',
          type: 'text/javascript',
          innerHTML: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "z0y9ky79tm");`
        }
      ]
    }
  },
  runtimeConfig: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    r2Endpoint: process.env.R2_ENDPOINT || '',
    r2AccessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    r2BucketName: process.env.R2_BUCKET_NAME || 'avyro-sites',
    r2PublicUrl: process.env.R2_PUBLIC_URL || '',
    pexelsApiKey: process.env.PEXELS_API_KEY || '',
    unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY || '',
    giphyApiKey: process.env.GIPHY_API_KEY || '',
    instagramAccessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
    instagramBusinessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || process.env.INSTAGRAM_USER_ID || '17841401920784631',
    instagramWebhookVerifyToken: process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || 'avyro_instagram_webhook_2026',
    instagramAutoReplyEnabled: process.env.INSTAGRAM_AUTO_REPLY_ENABLED === 'true',
    instagramAppSecret: process.env.INSTAGRAM_APP_SECRET || '',
    instagramAppId: process.env.INSTAGRAM_APP_ID || '4609504682619928',
    instagramRedirectUri: process.env.INSTAGRAM_REDIRECT_URI || 'https://www.avyro.com.br/api/instagram/callback',
    instagramOauthEnabled: String(process.env.INSTAGRAM_OAUTH_ENABLED || process.env.NUXT_PUBLIC_INSTAGRAM_OAUTH_ENABLED).toLowerCase() === 'true',
    public: {
      siteUrl: 'https://avyro.com.br',
      googleAdsId: '',
      googleAdsConversionLabel: '',
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY || '',
      instagramOauthEnabled: String(process.env.INSTAGRAM_OAUTH_ENABLED || process.env.NUXT_PUBLIC_INSTAGRAM_OAUTH_ENABLED).toLowerCase() === 'true',
      microsoftClarityId: process.env.MICROSOFT_CLARITY_ID || 'z0y9ky79tm',
      r2PublicUrl: process.env.R2_PUBLIC_URL || 'https://media.avyro.com.br'
    }
  }
})
