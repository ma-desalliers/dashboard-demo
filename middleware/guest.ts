// middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "@/src/stores/authStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  if (authStore.isAuthenticated) {
    return navigateTo('/');
  }
});
