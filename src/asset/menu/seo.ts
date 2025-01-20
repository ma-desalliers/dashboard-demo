// seo.ts
import { useI18n } from 'vue-i18n'

const useSeoMenu = () => {
  const { t } = useI18n()

  const contextMenu = [
    { name: 'dashboard', label: t("dashboard"), path: '/marketing/seo/dashboard' },
    { name: 'keywords', label: t("keywords"), path: '/marketing/seo' },
    { name: 'pages', label: t("pages"), path: '/marketing/seo/pages' },
    { name: 'opportunity', label: t("opportunity"), path: '/marketing/seo/ppportunity' }
  ]

  return contextMenu
}

export default useSeoMenu