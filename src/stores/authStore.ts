import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
  }),
  getters: {
    token: (state) => state.accessToken,
    isAuthenticated: (state) => !!state.accessToken,
  },
  actions: {
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken;
    },
    clearAccessToken() {
      this.accessToken = null;
    },
  }
})
