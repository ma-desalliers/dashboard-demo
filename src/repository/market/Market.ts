import type { marketObject } from "@/src/repository/market/Interface"; // Corrected import path
import type { productObject } from "../product/Interface";
import type { personaObject } from "../persona/Interface";
import type { JobResponse, PaginatedResponse } from "@/src/repository/BaseRepository"; // Corrected import path
import { BaseRepository } from "@/src/repository/BaseRepository"; // Corrected import path
import { MarketRecurrence } from "@/src/repository/marketRecurrence/MarketRecurrence"; // Import MarketRecurrence
import type { marketRecurrenceObject } from "@/src/repository/marketRecurrence/Interface"; // Import marketRecurrenceObject

export class Market extends BaseRepository {
  uuid: string = '';
  clientUuid: string = '';
  persona?: personaObject;
  personaUuid: string = '';
  product?: productObject;
  productUuid: string = '';
  transcript: string = '';
  isActive:Boolean = false
  createdAt: Date = new Date(); // Added createdAt property
  recurrences?: MarketRecurrence[]; // Add marketRecurrence property

  constructor(marketobj: marketObject | null) {
    super();
    if (marketobj) {
      this.uuid = marketobj.uuid;
      this.clientUuid = marketobj.clientUuid;
      this.persona = marketobj.persona;
      this.personaUuid = marketobj.personaUuid;
      this.product = marketobj.product;
      this.productUuid = marketobj.productUuid;
      this.isActive = marketobj.isActive;
      this.createdAt = marketobj.createdAt || new Date(); // Initialize createdAt
    }
  }

  async create(): Promise<marketObject> {
    const endpoint = 'markets';
    const createData = {
      clientUuid: this.clientUuid,
      personaUuid: this.personaUuid,
      productUuid: this.productUuid,
      createdAt: this.createdAt // Include createdAt in create data
    };

    const result = await this.createRequest<marketObject>(endpoint, createData);
    this.uuid = result.uuid
    return result
  }

  public getTranscript = async () => {
    try {
      const response = await this.apiRequest<TranscriptResponse>(
        `markets/${this.uuid}/transcript`
      );

      this.transcript = response.data.transcript;
      return this.transcript;
    } catch (error) {
      console.error('Error fetching transcript:', error);
      throw error;
    }
  }

  public generateIdeas = async (language: string) => {
    const result = await this.jobRequest(`markets/${this.uuid}/ideas`, { language: language }, 'Idea generation successful : they will be ready in a few minutes')
    console.log(`result ${result}`)
    if(result){
      this.localStorageStore.initializeFromStorage()
      if(!this.localStorageStore.data || !this.localStorageStore.data.jobs){
        this.localStorageStore.data = {
          jobs:[]
        }
      }

      this.localStorageStore.data.jobs.push({
        itemName: `${this.persona?.title} - ${this.product?.name}`,
        type:'market',
        jobId: result.jobId,
        uuid:this.uuid
      })
      this.localStorageStore.setData(this.localStorageStore.data)
      this.localStorageStore.saveToStorage()
    }
  }

  public async getRecurrences(page = 1, limit = 100): Promise<marketRecurrenceObject[]> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      'filters[marketUuid]': this.uuid,
     });
  
    try {
      const response = await this.apiRequest<marketRecurrenceObject[]>(
        `/campaigns?${params.toString()}`,
        { paginated: true }
      );
      
      this.recurrences = response.data.map((page: marketRecurrenceObject) => new MarketRecurrence(page));
      return this.recurrences
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
  }
}

interface TranscriptResponse {
  transcript: string;
}
