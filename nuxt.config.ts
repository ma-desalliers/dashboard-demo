// https://nuxt.com/docs/api/configuration/nuxt-config
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: false,
  modules: [
    'nuxt-quasar-ui',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],
  devServer: {
    port: 3001, // Set the port to 3001
    host: '0.0.0.0' // This allows external access to the server
  },
  app: {
    head: {
link: [
  { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Icons+Outlined' }
]
    }
  },
  build: {
    transpile: ['perfect-scrollbar']
  },
  quasar: {
    plugins: ['Notify'],
    config: {
      notify: { position: 'top' }
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api.cameleonmedia.com'
    }
  },
  components: {
    dirs: [
      {
        path: 'src/components/utilities',
        global: true
      },
      {
        path: 'src/components/globalPopup/popup',
        global: true
      }
    ]
  },
  vite: {
    server: {
      allowedHosts: ['api.cameleonmedia.com']
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
        },
      },
    }
  },
  routeRules: {
    '/login': { ssr: false },
    '/register': { ssr: false },
    '/': {}
  },
  i18n: {
    vueI18n: '@/src/translation/config.ts',
    locales: ['en', 'fr'],
    strategy: 'no_prefix',
    defaultLocale: 'en',
  }
})
