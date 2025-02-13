import type { PaginationMeta } from "@/src/repository/BaseRepository";
import { brandGuideSchema, type BrandGuide, type CompanyList } from "@/src/repository/companies/Interfaces";
import { BrandGuideRepository, CompanyRepository } from "@/src/repository/companies/Repository";

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
    currentRequest: null as AbortController | null,
    brandGuide: {} as BrandGuide | null,
    brandGuideError: null as string | null
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
      await this.fetchBrandGuide(companyUuid);
    },

    async fetchBrandGuide(clientUuid: string) {
      try {
        const brandGuideRepository = new BrandGuideRepository();
        this.brandGuide = await brandGuideRepository.fetchBrandGuide(clientUuid);
        if (this.brandGuide == null) {
          this.brandGuide = {
            values: [],
            humanness: [],
            clarity: [],
            emotional_tone: [],
            voice: 'active',
            capitalization: 'sentence case'
          }
        }
      } catch (error) {
        this.brandGuideError = 'Failed to fetch Brand Guide';
        console.error(error);
      }
    },

    async saveBrandGuide(clientUuid: string, data: Partial<BrandGuide>) {
      try {
        const brandGuideRepository = new BrandGuideRepository();
        brandGuideSchema.parse(data); 
        const brandGuide = await brandGuideRepository.save({ ...data, clientUuid });
        this.brandGuide = brandGuide
      } catch (error) {
        this.brandGuideError = 'Failed to save Brand Guide';
        console.error(error);
      }
    },

    setBrandGuide(data: BrandGuide){
      this.brandGuide = data
    },
    abortCurrentRequest() {
      if (this.currentRequest == null) return;
      this.currentRequest.abort();
      this.currentRequest = null;
    }
  }
});
