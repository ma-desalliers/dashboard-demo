export interface personaObject {
  uuid: string;
  clientUuid: string;
  title: string;
  description: string;
  image: string;
  subIndustryId:string;
  gics:any;
  countryId?: number;
  stateId?: number;
  cityId?: number;
  revenue?:string
  createdAt?: Date; // Added createdAt property
}
