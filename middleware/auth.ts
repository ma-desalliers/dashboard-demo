import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "@/src/stores/authStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    return navigateTo('/login');
  }
});
