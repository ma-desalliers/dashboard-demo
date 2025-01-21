import { BaseRepository } from "@/src/repository/BaseRepository";
import type { Page } from "@/src/repository/pages/Interfaces";
import type { PaginatedResponse } from '@/src/repository/BaseRepository';

export interface PageFilters {
  companyUuid: string;
  generatedOnly?: boolean | null;
}

export class PageRepository extends BaseRepository {
  public async getPages(page: number = 1, limit: number = 10, filters: PageFilters): Promise<PaginatedResponse<Page[]>> {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        'filter[clientUuid]': filters.companyUuid
      });
      if (filters.generatedOnly != null) {
        query.append('filter[hasContent]', filters.generatedOnly.toString());
      }
      const response = await this.apiRequest<Page[]>(`/page?${query.toString()}`, {
        paginated: true,
        method: 'GET'
      });
      return response as PaginatedResponse<Page[]>;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

