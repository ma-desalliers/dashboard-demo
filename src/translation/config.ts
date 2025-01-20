import translations from '@/src/translation/translation'



export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: translations
}))