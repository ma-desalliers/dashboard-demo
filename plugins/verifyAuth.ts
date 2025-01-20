import { defineNuxtPlugin } from '#app'
import { useAuthStore } from '@/src/stores/authStore'

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore()

  if (authStore.accessToken) return;

  try {
    const config = useRuntimeConfig()
    const response = await fetch(`${config.public.apiBase}/refresh`, {
      method: 'POST',
      credentials: 'include'
    })

    if (response.ok) {
      const data = await response.json()
      const { accessToken } = data

      if (accessToken) {
        authStore.setAccessToken(accessToken)
        console.log('Access token refreshed and set in store')
      } else {
        console.error('No access token returned from refresh')
      }
    } else {
      console.error('Failed to refresh access token:', response.statusText)
    }
  } catch (error) {
    console.error('Error refreshing access token:', error)
  }
});
