import { BaseRepository } from "@/src/repository/BaseRepository";
import type { Product, ProductCategory, ProductList } from "@/src/repository/products/Interfaces";
import type { PaginatedResponse } from "@/src/repository/BaseRepository";

export class ProductRepository extends BaseRepository {
  public async list(companyUuid: string): Promise<ProductList[]> {
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

  public async create(product: Omit<Product, 'uuid' | 'score' | 'createdAt'>): Promise<Product> {
    try {
      const response = await this.apiRequest<Product>('/products', {
        method: 'POST',
        body: JSON.stringify(product)
      });
      return response.data as Product;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async update(product: Product): Promise<Product> {
    try {
      const response = await this.apiRequest<Product>(`/products/${product.uuid}`, {
        method: 'PUT',
        body: JSON.stringify(product)
      });
      return response.data as Product;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async attachCategory(productUuid: string, categoryUuid: string): Promise<void> {
    try {
      await this.apiRequest<void>(`/products/${productUuid}/categories/${categoryUuid}`, {
        method: 'POST'
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async detachCategory(productUuid: string, categoryUuid: string): Promise<void> {
    try {
      await this.apiRequest<void>(`/products/${productUuid}/categories/${categoryUuid}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export class CategoryRepository extends BaseRepository {
  public async list(companyUuid: string, page: number = 1, limit: number = 100): Promise<PaginatedResponse<ProductCategory[]>> {
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

  public async create(category: Omit<ProductCategory, 'uuid' | 'createdAt'>): Promise<ProductCategory> {
    try {
      const response = await this.apiRequest<ProductCategory>('/categories', {
        method: 'POST',
        body: JSON.stringify(category)
      });
      return response.data as ProductCategory;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async update(category: ProductCategory): Promise<ProductCategory> {
    try {
      const response = await this.apiRequest<ProductCategory>(`/categories/${category.uuid}`, {
        method: 'PUT',
        body: JSON.stringify(category)
      });
      return response.data as ProductCategory;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
