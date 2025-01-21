import { BaseRepository } from "@/src/repository/BaseRepository";
import type { Audience } from "@/src/repository/audiences/Interfaces";

export class AudienceRepository extends BaseRepository {
  public async list(companyUuid: string): Promise<Audience[]> {
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

  public async create(audience: Omit<Audience, 'uuid' | 'score' | 'createdAt'>): Promise<Audience> {
    try {
      const response = await this.apiRequest<Audience>('/personas', {
        method: 'POST',
        body: JSON.stringify(audience)
      });
      return response.data as Audience;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async update(audience: Audience): Promise<Audience> {
    try {
      const response = await this.apiRequest<Audience>(`/personas/${audience.uuid}`, {
        method: 'PUT',
        body: JSON.stringify(audience)
      });
      return response.data as Audience;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

