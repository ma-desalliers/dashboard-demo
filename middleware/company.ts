import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useCompanyStore } from "~/src/stores/companyStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const companyStore = useCompanyStore();
  await companyStore.init();

  const { companyUuid } = to.params;

  if (!companyUuid) {
    return navigateTo(`/company/${companyStore.companies[0].uuid}/products`);
  }

  if (companyStore.theCompany.uuid !== companyUuid) {
    try {
      await companyStore.current(companyUuid as string);
    } catch (error) {
      console.error(error);
      return navigateTo(`/404`);
    }
  }
});
