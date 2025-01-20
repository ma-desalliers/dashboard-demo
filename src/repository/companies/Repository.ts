import { BaseRepository } from "@/src/repository/BaseRepository";
import type { CompanyAggregate } from "@/src/repository/companies/Interfaces";
import type { PaginatedResponse } from '@/src/repository/BaseRepository';

export class CompanyRepository extends BaseRepository {
  public async getMyCompanies(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Company[]>> {
    try {
      const query = new URLSearchParams();
      query.append('page', page.toString());
      query.append('limit', limit.toString());
      const response = await this.apiRequest<CompanyAggregate[]>(`/clients?${query.toString()}`, {
        paginated: true,
        method: 'GET'
      });
      return response as PaginatedResponse<CompanyAggregate[]>;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getCompany(clientUuid: string): Promise<any> {
    try {
      const response = await this.apiRequest<any>(`/clients/${clientUuid}`, {
        method: 'GET'
      });
      const company = response.data;
      return company;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
