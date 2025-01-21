export interface Page {
  uuid: string;
  clientUuid: string;
  marketUuid: string;
  subjobUuid?: string;
  language: string;
  title: string;
  score?: number;
  isPublished: boolean;
  updatedAt?: number;
  createdAt?: number;
}