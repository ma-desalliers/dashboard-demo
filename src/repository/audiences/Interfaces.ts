export interface Audience {
  uuid: string;
  clientUuid: string;
  title: string;
  description?: string;
  subIndustryId?: number;
  countryId?: number;
  stateId?: number;
  cityId?: number;
  revenue?: string;
  image?: string;
  score?: number;
  createdAt: number;
}