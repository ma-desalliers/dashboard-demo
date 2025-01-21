import { defineStore } from 'pinia';
import type { Market } from '@/src/repository/markets/Interfaces';
import { MarketRepository } from '@/src/repository/markets/Repository';

interface MarketState {
  companyUuid: string;
  currentMarket: Market;
  markets: Market[];
  loading: boolean;
}

export const useAudienceStore = defineStore('audienceStore', {
  state: (): MarketState => ({
    companyUuid: '',
    currentMarket: {} as Market,
    markets: [],
    loading: false,
  }),
  getters: {
    getMarket: (state) => (marketUuid: string) => state.markets.find((market) => audience.uuid === marketUuid),
    totalMarket: (state) => state.markets.length
  },
  actions: {
    async init(companyUuid: string) {
      if (companyUuid === this.companyUuid && this.markets.length > 0) return;
      this.companyUuid = companyUuid
      this.loading = true;
      try {
        const repository = new MarketRepository();
        const markets = await repository.list(companyUuid);
        this.markets = markets;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async current(marketUuid: string) {
      const market = this.getMarket(marketUuid);
      if (!market) throw new Error('Audience not found');
      this.currentMarket = market;
    }
  }
});