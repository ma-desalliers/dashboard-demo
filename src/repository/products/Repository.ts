import { BaseRepository } from "@/src/repository/BaseRepository";
import type { ProductCategory, Product } from "@/src/repository/products/Interfaces";
import type { PaginatedResponse } from "@/src/repository/BaseRepository";

export class ProductRepository extends BaseRepository {
  public async getProducts(companyUuid: string): Promise<Product[]> {
    try {
      const response = await this.apiRequest<Product[]>(`/clients/${companyUuid}/products`, {
        method: 'GET'
      });
      return response.data as Product[];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export class CategoryRepository extends BaseRepository {
  public async getCategories(companyUuid: string, page: number = 1, limit: number = 100): Promise<PaginatedResponse<ProductCategory[]>> {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        'filters[clientUuid]': companyUuid,
      });
      const response = await this.apiRequest<ProductCategory[]>(`/categories?${query.toString()}`, {
        paginated: true,
        method: 'GET',
      });

      return response as PaginatedResponse<ProductCategory[]>;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
