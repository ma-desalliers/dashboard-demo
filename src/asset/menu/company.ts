// seo.ts
import { useI18n } from 'vue-i18n'

const useCompanyMenu = (companyUuid: string) => {
  const { t } = useI18n()

  const contextMenu = [
    { name: 'company', label: t("company"), path: `/company/${companyUuid}/edit` },
    { name: 'products', label: t("products"), path: `/company/${companyUuid}/products` },
    { name: 'audiences', label: t("audiences"), path: `/company/${companyUuid}/audiences` },
    { name: 'branding', label: t("branding"), path: `/company/${companyUuid}/branding` }
  ]

  return contextMenu
}

export default useCompanyMenu