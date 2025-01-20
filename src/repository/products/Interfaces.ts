export interface Product {
  uuid: string;
  clientUuid: string;
  name: string;
  description?: string;
  image?: string;
  score?: number;
  ctaName?: string;
  ctaUrl?: string;
  benefits?: string;
  createdAt?: number;
}
