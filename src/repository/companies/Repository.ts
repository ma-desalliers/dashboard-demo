import { BaseRepository } from "@/src/repository/BaseRepository";
import type { BrandGuide, CompanyList } from "@/src/repository/companies/Interfaces";
import type { PaginatedResponse } from '@/src/repository/BaseRepository';

export class CompanyRepository extends BaseRepository {
  public async list(page: number = 1, limit: number = 10, signal: AbortSignal): Promise<PaginatedResponse<CompanyList[]>> {
    try {
      const query = new URLSearchParams();
      query.append('page', page.toString());
      query.append('limit', limit.toString());
      query.append('filters[includeStyle]', 'true');
      const response = await this.apiRequest<CompanyList[]>(`/clients?${query.toString()}`, {
        paginated: true,
        method: 'GET',
        signal: signal
      });
      return response as PaginatedResponse<CompanyList[]>;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async fetchCompany(clientUuid: string): Promise<CompanyList> {
    try {
      const response = await this.apiRequest<CompanyList>(`/clients/${clientUuid}`, {
        method: 'GET'
      });
      return response.data
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export class BrandGuideRepository extends BaseRepository {
  public async fetchBrandGuide(clientUuid: string): Promise<BrandGuide> {
    try {
      const response = await this.apiRequest<BrandGuide>(`/clients/${clientUuid}/brand-guide`, {
        method: 'GET'
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async save(brandGuide: Partial<Omit<BrandGuide, 'createdAt'>> & Pick<BrandGuide, 'clientUuid'>): Promise<BrandGuide> {
    try {

      console.log(JSON.stringify(brandGuide))
      const response = await this.apiRequest<BrandGuide>(`/clients/${brandGuide.clientUuid}/brand-guide`, {
        method: 'POST',
        body: brandGuide
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
