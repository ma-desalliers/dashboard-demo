import { BaseRepository } from "@/src/repository/BaseRepository";
import type { ProductCategory, ProductList } from "@/src/repository/products/Interfaces";
import type { PaginatedResponse } from "@/src/repository/BaseRepository";

export class ProductRepository extends BaseRepository {
  public async getProducts(companyUuid: string): Promise<ProductList[]> {
    try {
      const query = new URLSearchParams({
        'filters[includeCategory]': 'true',
        'filters[includePageCount]': 'true'
      });
      const response = await this.apiRequest<ProductList[]>(`/clients/${companyUuid}/products?${query.toString()}`, {
        method: 'GET'
      });
      return response.data as ProductList[];
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
