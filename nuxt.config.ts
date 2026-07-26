import path from 'node:path'
import os from 'node:os'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  buildDir: '.nuxt_dev',
  devServer: {
    host: '127.0.0.1',
    port: 3000
  },
  vite: {
    cacheDir: path.join(os.tmpdir(), 'meu-site-vite-cache'),
    server: {
      watch: {
        ignored: ['**/.git/**', '**/node_modules/**', '**/.nuxt/**', '**/.nuxt_dev/**', '**/.output/**']
      }
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  future: {
    compatibilityVersion: 4
  },
  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block'
        }
      ]
    }
  },
  runtimeConfig: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    public: {
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY || ''
    }
  }
})