import { BaseRepository } from "@/src/repository/BaseRepository";
import type { Market } from "@/src/repository/markets/Interfaces";

export class MarketRepository extends BaseRepository {
  public async getMarkets(companyUuid: string): Promise<Market[]> {
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
}
