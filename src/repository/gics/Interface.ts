export interface SectorObject {
    id: number;
    name: string;
  }
  
  export interface IndustryGroupObject {
    id: number;
    name: string;
    sectorId: number;
  }
  
  export interface IndustryObject {
    id: number;
    name: string;
    industryGroupId: number;
  }
  
  export interface SubIndustryObject {
    id: number;
    name: string;
    description: string | null;
    industryId: number;
  }
  
  export interface SubIndustryHierarchyObject {
    subIndustryId: number;
    subIndustryName: string;
    subIndustryDescription: string | null;
    industryId: number;
    industryName: string;
    industryGroupId: number;
    industryGroupName: string;
    sectorId: number;
    sectorName: string;

  }