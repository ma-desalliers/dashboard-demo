import { BaseRepository } from "@/src/repository/BaseRepository";
import type { CompanyList } from "@/src/repository/companies/Interfaces";
import type { PaginatedResponse } from '@/src/repository/BaseRepository';

export class CompanyRepository extends BaseRepository {
  public async getMyCompanies(page: number = 1, limit: number = 10): Promise<PaginatedResponse<CompanyList[]>> {
    try {
      const query = new URLSearchParams();
      query.append('page', page.toString());
      query.append('limit', limit.toString());
      const response = await this.apiRequest<CompanyList[]>(`/clients?${query.toString()}`, {
        paginated: true,
        method: 'GET'
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

