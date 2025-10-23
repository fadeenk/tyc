// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/supabase'
  ],

  ssr: false,

  devtools: {
    enabled: true
  },

  app: {
    baseURL: '/'
  },

  css: ['~/assets/css/main.css'],

  mdc: {
    highlight: {
      noApiRoute: false
    }
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // Image configuration for static deployment
  image: {
    provider: 'none',
    quality: 80,
    format: ['webp', 'png', 'jpg', 'svg']
  },

  supabase: {
    url: 'https://crdigodfxazwewymkdud.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZGlnb2RmeGF6d2V3eW1rZHVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMTUxNjYsImV4cCI6MjA3Njc5MTE2Nn0.WsntCzui77Jt3FRhY2VBpHnDXqrdNWXDqCopBdVvoL0',
    redirect: false,
    types: '~/types/database.types.ts'
  }
})
