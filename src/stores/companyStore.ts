import type { PaginationMeta } from "@/src/repository/BaseRepository";
import type { CompanyAggregate } from "@/src/repository/companies/Interfaces";
import { CompanyRepository } from "@/src/repository/companies/Repository";

export const useCompanyStore = defineStore('useCompanyStore', {
  state: () => ({
    theCompany: {} as CompanyRepository,
    companies: [] as CompanyAggregate[],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10
    } as PaginationMeta,
    loading: false
  }),
  actions: {
    async init(page: number = 1, limit: number = 10) {
      if (this.companies.length && this.theCompany.theCompanyUuid) return;
      this.loading = true;
      try {
        const response = await CompanyRepository.getMyCompanies(page, limit);

        this.companies = response.data;
        this.pagination = response.pagination;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async current(company: CompanyRepository) {
      this.theCompany = company;
      if (!this.theCompany.theCompanyUuid) return;
      await this.theCompany.fetchCompany(this.theCompany.theCompanyUuid);
    }
  }
});
