// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: false,
  modules: [
    'nuxt-quasar-ui',
    '@pinia/nuxt'
  ],
  app: {
    head: {
      title: 'Atlas', // Set the global title here
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css' }
      ]
    },
    baseURL: '/betonprovincial'
  },
  build: {
    transpile: ['perfect-scrollbar']
  },
  quasar: {
    plugins: ['Notify'],
    config: {
      notify: {  position: 'top' }
    }
  },
  runtimeConfig:{
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://cameleon-server:3000' 
    }
  },
  components: {
    dirs: [
      {
        path: 'src/components/utilities',
        global: true
      }
    ]
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
        },
      },
    }
  }
})
