import { BaseRepository } from "@/src/repository/BaseRepository";
import type { Audience } from "@/src/repository/audiences/Interfaces";

export class AudienceRepository extends BaseRepository {
  public async getAudiences(companyUuid: string): Promise<Audience[]> {
    try {
      const response = await this.apiRequest<Audience[]>(`/clients/${companyUuid}/personas`, {
        method: 'GET'
      });
      return response.data as Audience[];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

