import { BaseRepository } from "@/src/repository/BaseRepository";
import type { Audience } from "@/src/repository/audiences/Interfaces";
import type { JTBD } from '../jtbdjobs/Interfaces';
import { JTBDRepository } from "../jtbdjobs/Repository";
import { useRepository } from '@/src/asset/composable/repository'


export class StaticAudienceReposotory {
    private static _repository: ReturnType<typeof useRepository> | null = null;
    
    // Lazy initialization of the repository
    private static get repository() {
      if (!this._repository) {
        this._repository = useRepository();
      }
      return this._repository;
    }
  
    static async findByUuid(uuid: string): Promise<Audience | null> {
      try {
        const response = await this.repository.apiRequest<Audience>(`/audiences/${uuid}`, {
          method: "GET"
        });
        return response.data as Audience;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
}

export class AudienceRepository extends BaseRepository {
  Audience: Audience | null = null
  JTBD:JTBD | null = null
  
  constructor(audience: Audience | null) {
    super();
    if (audience) {
      this.Audience = audience
    }
  }
  public async list(companyUuid: string): Promise<Audience[]> {
    try {
      const response = await this.apiRequest<Audience[]>(`/clients/${companyUuid}/audiences`, {
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
      const response = await this.apiRequest<Audience>('/audiences', {
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
      const response = await this.apiRequest<Audience>(`/audiences/${audience.uuid}`, {
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

