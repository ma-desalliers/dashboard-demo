import { defineStore } from 'pinia';
import type { Page } from '@/src/repository/pages/Interfaces';
import { PageRepository, type PageFilters } from '@/src/repository/pages/Repository';

interface PageState {
  companyUuid: string;
  thePage: Page | null;
  pages: Page[];
  currentPage: number;
  currentFilters: PageFilters;
  totalPages: number;
  totalRecords: number;
  perPage: number;
  loading: boolean;
}

export const usePageStore = defineStore('usePageStore', {
  state: (): PageState => ({
    companyUuid: '',
    thePage: null,
    pages: [],
    currentPage: 1,
    currentFilters: {
      clientUuid: '',
    },
    totalPages: 0,
    totalRecords: 0,
    perPage: 10,
    loading: false,
  }),
  getters: {
    getPage: (state) => (pageUuid: string) => state.pages.find((page) => page.uuid === pageUuid),
  },
  actions: {
    /**
     * Fetch paginated pages with filters
     */
    async list(page: number = 1, limit: number = 10, filters: PageFilters) {
      if (this.companyUuid === filters.clientUuid && 
          this.currentPage === page && 
          this.perPage === limit &&
          JSON.stringify(this.currentFilters) === JSON.stringify(filters)) {
        return;
      }
      this.loading = true;
      this.companyUuid = filters.clientUuid;
      this.currentFilters = filters;
      this.currentPage = page;
      this.perPage = limit;
      
      try {
        const repository = new PageRepository();
        const result = await repository.list(page, limit, filters);
        console.log(result);
        this.pages = result.data;
        this.totalRecords = result.pagination.totalItems;
        this.totalPages = result.pagination.totalPages;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    /**
     * Get the current page details and set it in state
     */
    async current(pageUuid: string) {
      const page = this.getPage(pageUuid);
      console.log(page)
      if (page) {
        this.loading = true;
        try {
          const repository = new PageRepository();
          this.thePage = await repository.findByUuid('8d8547d6-567d-498d-9c8b-0a97a1a4c326');
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          this.loading = false;
        }
      } else {
        //this.thePage = page;
      }
    },
  }
});
