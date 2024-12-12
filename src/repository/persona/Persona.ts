import type { personaObject } from "./Interface";
import { BaseRepository } from "@/src/repository/BaseRepository"; // Corrected import path
import { useMainDisplayStore } from "@/src/stores/mainDisplayStore"; // Corrected import path

export class Persona extends BaseRepository {
  uuid: string = '';
  clientUuid: string = '';
  title: string = '';
  description: string = '';
  image: string = '';
  imageUrl?: string;
  subIndustryId:string = '';
  gics:any = null;
  revenue?:string = '';
  createdAt: Date = new Date(); 

  countryId?: number;
  stateId?: number;
  cityId?: number;

  constructor(personaObj: personaObject | null) {
    super();
    if (personaObj) {
      this.uuid = personaObj.uuid;
      this.clientUuid = personaObj.clientUuid;
      this.title = personaObj.title;
      this.description = personaObj.description;
      this.image = personaObj.image;
      this.subIndustryId = personaObj.subIndustryId;
      this.gics = personaObj.gics;
      this.countryId = personaObj.countryId
      this.stateId = personaObj.stateId
      this.cityId = personaObj.cityId
      this.revenue = personaObj.revenue
      this.createdAt = personaObj.createdAt || new Date(); // Initialize createdAt
    }
  }

  async create(): Promise<personaObject> {
    const endpoint = 'personas';
    const createData = {
      clientUuid: this.clientUuid,
      title: this.title,
      description: this.description,
      image: this.image,
      subIndustryId:this.subIndustryId,
      countryId: this.countryId,
      stateId: this.stateId,
      cityId: this.cityId,
      revenue:this.revenue
    };

    const result = await this.createRequest<personaObject>(endpoint, createData);

    this.uuid = result.uuid
    return result
  }

  async update(): Promise<personaObject> {
    const endpoint = `personas/${this.uuid}`;
    const updateData = {
      clientUuid: this.clientUuid,
      title: this.title,
      description: this.description,
      image: this.image,
      subIndustryId:this.subIndustryId,
      countryId: this.countryId,
      stateId: this.stateId,
      cityId: this.cityId,
      revenue:this.revenue
    };

    return this.updateRequest<personaObject>(endpoint, updateData);
  }
  // Add any persona-specific methods here
}
