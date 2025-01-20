import type { PaginationMeta } from "@/src/repository/BaseRepository";
import type { CompanyAggregate } from "@/src/repository/companies/Interfaces";
import { CompanyRepository } from "@/src/repository/companies/Repository";

export const useCompanyStore = defineStore('useCompanyStore', {
  state: () => ({
    theCompany: {} as CompanyAggregate,
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
      if (this.companies.length && this.theCompany.uuid) return;
      this.loading = true;
      try {
        const repository = new CompanyRepository();
        const response = await repository.getMyCompanies(page, limit);

        this.companies = response.data;
        this.theCompany = await repository.getCompany(response.data[0].uuid);
        this.pagination = response.pagination;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});