import { BaseRepository, type PaginatedResponse } from '~/src/repository/BaseRepository';
import type { JTBD, JTBDFilters } from '~/src/repository/jtbdjobs/Interfaces';

export class JTBDRepository extends BaseRepository {
  async list(
    page: number,
    limit: number,
    filters: JTBDFilters
  ): Promise<PaginatedResponse<JTBD[]>> {
    const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      
    Object.entries(filters).forEach(([key, value]) => {
      if (value != null) queryParams.append(`filters[${key}]`, value);
    });

    console.log('queryParams', queryParams.toString());

    const response = await this.apiRequest<JTBD[]>(`jobs?${queryParams.toString()}`, {
      paginated: true
    }) as PaginatedResponse<JTBD[]>;

    return response;
  }
}
