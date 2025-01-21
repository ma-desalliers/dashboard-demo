import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "@/src/stores/authStore";
import { useCompanyStore } from "~/src/stores/companyStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    return navigateTo('/login');
  }

  const companyStore = useCompanyStore();
  await companyStore.init();
  if (companyStore.theCompany.uuid == null) {
    await companyStore.current(companyStore.companies[0].uuid);
  }
});
