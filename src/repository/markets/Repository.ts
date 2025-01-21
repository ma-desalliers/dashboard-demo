import { BaseRepository } from "@/src/repository/BaseRepository";
import type { Market } from "@/src/repository/markets/Interfaces";

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
