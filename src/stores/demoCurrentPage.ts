import { defineStore } from 'pinia';

export const useDemoCurrentPageStore = defineStore('useDemoCurrentPageStore', {
  state: () => ({
    currentPage: 'CampaignViewer',
  }),

  actions: {
    setCurrentPage(value: string) {
      this.currentPage = value;
    },
  },

  getters: {
    getCurrentPage(state) {  // Changed getter name to avoid conflict
      return state.currentPage;
    },
  },
});