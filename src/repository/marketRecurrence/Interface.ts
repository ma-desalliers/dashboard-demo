export interface marketRecurrenceObject {
  uuid: string;
  marketUuid: string;
  type: string;
  startDate?: number;
  endDate?: number;
  recurrenceFrequency: CampainFrequency;
  quantity: number;
  createdAt: number;
  subIndustryId:string;
  gics:any;
  countryId?: number;
  stateId?: number;
  cityId?: number;
  state:string;
}


export type CampainFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';