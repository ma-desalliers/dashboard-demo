import { BaseRepository } from "@/src/repository/BaseRepository";
import type { CompanyAggregate } from "@/src/repository/companies/Interfaces";
import type { PaginatedResponse } from '@/src/repository/BaseRepository';
import type { Product } from "@/src/repository/products/Interfaces";

export class CompanyRepository extends BaseRepository {
  public theCompanyUuid?: string;
  public company?: CompanyAggregate;
  public products: Product[] = [];

  constructor(companyUuid?: string) {
    super();
    this.theCompanyUuid = companyUuid;
  }

  public static async getMyCompanies(page: number = 1, limit: number = 10): Promise<PaginatedResponse<CompanyAggregate[]>> {
    try {
      const repository = new CompanyRepository();
      const query = new URLSearchParams();
      query.append('page', page.toString());
      query.append('limit', limit.toString());
      const response = await repository.apiRequest<CompanyAggregate[]>(`/clients?${query.toString()}`, {
        paginated: true,
        method: 'GET'
      });
      return response as PaginatedResponse<CompanyAggregate[]>;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async fetchCompany(clientUuid: string): Promise<CompanyAggregate> {
    try {
      const response = await this.apiRequest<CompanyAggregate>(`/clients/${clientUuid}`, {
        method: 'GET'
      });
      this.company = response.data;
      return this.company;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getProducts(clientUuid: string): Promise<Product[]> {
    if (this.products.length > 0) return this.products;
    try {
      const response = await this.apiRequest<any>(`/clients/${clientUuid}/products`, {
        method: 'GET'
      });
      this.products = response.data;
      return this.products;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
