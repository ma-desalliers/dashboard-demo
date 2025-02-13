import { BaseRepository, type PaginatedResponse } from "@/src/repository/BaseRepository";
import type { Page, RawPage } from "@/src/repository/pages/Interfaces";
import page from '~/src/components/company/page.vue';

export class PageRepository extends BaseRepository {
  /**
   * Get a single page by UUID
   * @param {string} uuid
   * @returns {Promise<Page | null>}
   */
  public async findByUuid(uuid: string): Promise<Page | null> {
    try {
      const response = await this.apiRequest<Page>(`/pages/${uuid}`, {
        method: "GET"
      });
      return response.data as Page;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Get a paginated list of pages
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {PageFilters} filters - Optional filters
   * @returns {Promise<PaginatedResponse<Page[]>>}
   */
  public async list(page: number, limit: number, filters: PageFilters): Promise<PaginatedResponse<Page[]>> {
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value != null) params.append(`filters[${key}]`, value);
      });
      
      const response = await this.apiRequest<Page[]>(`/pages?${params.toString()}`, {
        method: "GET",
        paginated: true
      }) as PaginatedResponse<Page[]>;

      /*const pages = response.data.map((page) => {
        const createdAt = new Date(page.createdAt);
        return {
          uuid: page._uuid,
          .,
          createdAt: createdAt.getTime(),
        };
      });*/
      return {
        status: response.status,
        data: response.data,
        pagination: response.pagination
      } as PaginatedResponse<Page[]>;
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 1,
        }
      }
    }
  }
}

export interface PageFilters {
  clientUuid: string;
  language?: string;
  marketUuid?: string;
  audienceUuid?: string;
  subjobUuid?: string;
}

