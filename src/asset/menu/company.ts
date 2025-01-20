// seo.ts
import { useI18n } from 'vue-i18n'

const useSeoMenu = () => {
  const { t } = useI18n()

  const contextMenu = [
    { name: 'company', label: t("company"), path: '/company/edit' },
    { name: 'products', label: t("products"), path: '/company/products' },
    { name: 'audiences', label: t("audiences"), path: '/company/audiences' },
    { name: 'branding', label: t("branding"), path: '/company/branding' }
  ]

  return contextMenu
}

export default useSeoMenu