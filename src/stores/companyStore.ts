import type { PaginationMeta } from "@/src/repository/BaseRepository";
import type { CompanyList } from "@/src/repository/companies/Interfaces";
import { CompanyRepository } from "@/src/repository/companies/Repository";

export const useCompanyStore = defineStore('useCompanyStore', {
  state: () => ({
    theCompany: {} as CompanyList,
    companies: [] as CompanyList[],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10
    } as PaginationMeta,
    loading: false,
    currentRequest: null as AbortController | null
  }),
  getters: {
    getCompany: (state) => (companyUuid: string) => state.companies.find((company) => company.uuid === companyUuid),
    totalCompanies: (state) => state.companies.length
  },
  actions: {
    async init(page: number = 1, limit: number = 10) {
      if (this.companies.length > 0) return;
      this.loading = true;
      this.abortCurrentRequest();

      const controller = new AbortController();
      this.currentRequest = controller;
      try {
        const repository = new CompanyRepository();
        const response = await repository.list(page, limit, controller.signal);

        this.companies = response.data;
        this.pagination = response.pagination;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
        this.currentRequest = null;
      }
    },
    async current(companyUuid: string) {
      if (this.companies.length === 0) await this.init();
      const company = this.getCompany(companyUuid);
      if (!company) throw new Error('Company not found');
      this.theCompany = company;
    },
    abortCurrentRequest() {
      if (this.currentRequest == null) return;
      this.currentRequest.abort();
      this.currentRequest = null;
    }
  }
});
