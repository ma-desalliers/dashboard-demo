import { BaseRepository } from "@/src/repository/BaseRepository";
import type { Market } from "@/src/repository/markets/Interfaces";
import { useRepository } from "~/src/asset/composable/repository";

export class StaticMarketRepository {
    private static _repository: ReturnType<typeof useRepository> | null = null;
    
    // Lazy initialization of the repository
    private static get repository() {
      if (!this._repository) {
        this._repository = useRepository();
      }
      return this._repository;
    }
  
    static async findByUuid(uuid: string): Promise<Market | null> {
      try {
        const response = await this.repository.apiRequest<Market>(`/markets/${uuid}`, {
          method: "GET"
        });
        return response.data as Market;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
}



export class MarketRepository extends BaseRepository {
  public async list(companyUuid: string): Promise<Market[]> {
    try {
      const response = await this.apiRequest<Market[]>(`/clients/${companyUuid}/markets`, {
        method: 'GET'
      });
      return response.data as Market[];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async create(market: Omit<Market, 'uuid' | 'createdAt'>): Promise<Market> {
    try {
      const response = await this.apiRequest<Market>('/markets', {
        method: 'POST',
        body: JSON.stringify(market)
      });
      return response.data as Market;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async generateIdeas(marketUuid: string, language: string): Promise<void> {
    try {
      const response = await this.apiRequest<Market>(`/markets/${marketUuid}/ideas`, {
        method: 'POST'
      });
      // TODO: handle jobId
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
