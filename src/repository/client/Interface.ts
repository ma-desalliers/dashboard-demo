export interface clientObject{
  uuid: string;
  name: string;
  status: string;
 }

 export interface stylePreferences {
  clientUuid: string;
  favicon?: string;
  primaryColor?: string;
  createdAt?: number;
}

export interface bioObject {
  clientUuid: string;
  bio: string;
  score?: number;
  createdAt: number;
}