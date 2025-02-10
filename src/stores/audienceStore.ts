import { defineStore } from 'pinia';
import type { Audience } from '@/src/repository/audiences/Interfaces';
import { AudienceRepository } from '@/src/repository/audiences/Repository';

type DisplayType = 'card' | 'list';

interface AudienceState {
  companyUuid: string;
  currentAudience: AudienceRepository;
  audiences: Audience[];
  pageDisplayType: DisplayType;
  loading: boolean;
}

// TODO: added location
// TODO: added gics
// TODO: added page count
export const useAudienceStore = defineStore('audienceStore', {
  state: (): AudienceState => ({
    companyUuid: '',
    currentAudience:  new AudienceRepository (null),
    audiences: [],
    pageDisplayType: 'card',
    loading: false,
  }),
  getters: {
    getAudience: (state) => (audienceUuid: string) => state.audiences.find((audience) => audience.uuid === audienceUuid),
    totalAudiences: (state) => state.audiences.length,
    isCardDisplay: (state) => state.pageDisplayType === 'card',
    isListDisplay: (state) => state.pageDisplayType === 'list'
  },
  actions: {
    async init(companyUuid: string) {
      if (companyUuid === this.companyUuid && this.audiences.length > 0) return;
      this.companyUuid = companyUuid
      this.loading = true;
      try {
        const repository = new AudienceRepository(null);
        const audiences = await repository.list(companyUuid);
        this.audiences = audiences;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    setAudience(audience: any) {
      this.currentAudience = new AudienceRepository(audience);
    },
    setDisplayType(type: DisplayType) {
      this.pageDisplayType = type;
    },
    async current(audienceUuid: string) {
      const audience = this.getAudience(audienceUuid);
      if (!audience) throw new Error('Audience not found');
      this.currentAudience = new AudienceRepository(audience);
    }
  }
});