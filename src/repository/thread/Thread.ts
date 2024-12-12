
import { BaseRepository } from "@/src/repository/BaseRepository";
import type { threadObject } from "@/src/repository/thread/Interface";

export class Thread extends BaseRepository {
  uuid: string = '';
  threadList?:threadObject[] 

  constructor(uuid: string | null) {
    super();
    if (uuid) {
      this.uuid = uuid;

    }
  }

  getThreadList = async () =>{
    try {
      const response = await this.apiRequest<threadObject[]>(
        `threads/${this.uuid}`
      );
      console.log(response.data)
      this.threadList = response.data  
      console.log(this.threadList)
      
      return this.threadList
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }
}