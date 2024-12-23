import { defineStore } from 'pinia';

type DisplayType = 'card' | 'list';

interface AudienceState {
  currentAudience: any
  pageDisplayType: DisplayType;
}

export const useAudienceStore = defineStore('audienceStore', {
  state: (): AudienceState => ({
    currentAudience: null,
    pageDisplayType: 'card',
  }),

  actions: {
    setAudience(audience: any) {
      this.currentAudience = audience;
    },

    setDisplayType(type: DisplayType) {
      this.pageDisplayType = type;
    },
  },

  getters: {
    isCardDisplay: (state) => state.pageDisplayType === 'card',
    isListDisplay: (state) => state.pageDisplayType === 'list'
  }
});