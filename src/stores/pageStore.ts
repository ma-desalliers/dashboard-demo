import { defineStore } from 'pinia';
import type { Page } from '@/src/repository/pages/Interfaces';
import { PageRepository, type PageFilters } from '@/src/repository/pages/Repository';

interface PageState {
  companyUuid: string;
  thePage: Page;
  pages: Page[];
  loading: boolean;
}

// TODO: Added jobs and subjobs
// TODO: Added categories
// TODO: handle pagination
export const usePageStore = defineStore('usePageStore', {
  state: (): PageState => ({
    companyUuid: '',
    thePage: {} as Page,
    pages: [],
    loading: false,
  }),
  getters: {
    getPage: (state) => (pageUuid: string) => state.pages.find((page) => page.uuid === pageUuid),
    totalPages: (state) => state.pages.length,
  },
  actions: {
    async init(page: number = 1, limit: number = 10, fitlers: PageFilters) {
      if (this.companyUuid === fitlers.companyUuid && this.pages.length > 0) return;
      this.companyUuid = fitlers.companyUuid;
      this.loading = true;
      try {
        const repository = new PageRepository();
        const pages = await repository.list(page, limit, fitlers);
        this.pages = pages.data;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async current(pageUuid: string) {
      const page = this.getPage(pageUuid);
      if (!page) throw new Error('Page not found');
      this.thePage = page;
    }
  }
});