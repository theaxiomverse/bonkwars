import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
 plugins: ['~/plugins/appkit.client.ts'],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-headlessui',
    '@dargmuesli/nuxt-cookie-control',
    'nuxt-csurf'
  ],

  tailwindcss: { // Move here, outside of modules.
    exposeConfig: true,
    viewer: true,
  },

  typescript: {
      shim: false
    },

  compatibilityDate: '2024-12-18'
})