export type CompanyAggregate = Company & Omit<CompanyStylePreferences, 'clientUuid' | 'createdAt'>;

export interface Company {
  uuid: string;
  name: string;
  subIndustry?: string;
  revenue?: string;
  yearFounded?: number;
  createdTs: number;
}

export interface CompanyStylePreferences {
  clientUuid: string;
  primaryColor?: string;
  favicon?: string;
  createdAt: number;
}