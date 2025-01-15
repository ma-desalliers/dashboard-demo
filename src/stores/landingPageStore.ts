import { defineStore } from 'pinia';

interface LandingPageState {
  currentLandingPage: any;
}

export const useLandingPageStore = defineStore('landingPageStore', {
  state: (): LandingPageState => ({
    currentLandingPage: null,
  }),

  actions: {
    setLandingPage(landingPage: any) {
      this.currentLandingPage = landingPage;
    },
  },
});
