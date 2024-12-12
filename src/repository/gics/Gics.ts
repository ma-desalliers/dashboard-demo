import { BaseRepository } from "@/src/repository/BaseRepository";
import type { PaginatedResponse } from "@/src/repository/BaseRepository";
import type {SectorObject, IndustryGroupObject, IndustryObject, SubIndustryObject, SubIndustryHierarchyObject} from '@/src/repository/gics/Interface'



export class GICS extends BaseRepository {
  id: number = 0;
  name: string = '';
  description: string | null = null;
  sectorId?: number;
  industryGroupId?: number;
  industryId?: number;
  hierarchy?: SubIndustryHierarchyObject;

  constructor(gicsObj?: SectorObject | IndustryGroupObject | IndustryObject | SubIndustryObject) {
    super();
    if (gicsObj) {
      this.id = gicsObj.id;
      this.name = gicsObj.name;
      if ('description' in gicsObj) {
        this.description = (gicsObj as SubIndustryObject).description;
      }
      if ('sectorId' in gicsObj) {
        this.sectorId = (gicsObj as IndustryGroupObject).sectorId;
      }
      if ('industryGroupId' in gicsObj) {
        this.industryGroupId = (gicsObj as IndustryObject).industryGroupId;
      }
      if ('industryId' in gicsObj) {
        this.industryId = (gicsObj as SubIndustryObject).industryId;
      }
    }
  }

  static async getSectors(): Promise<SectorObject[]> {
    const gics = new GICS();
    const response = await gics.apiRequest<SectorObject[]>('gics/sectors');
    return response.data;
  }

  async getIndustryGroups(): Promise<IndustryGroupObject[]> {
    if (!this.id) {
      throw new Error('Sector ID is required to fetch industry groups');
    }
    const response = await this.apiRequest<IndustryGroupObject[]>(
      `gics/sectors/${this.id}/industry-groups`
    );
    return response.data;
  }

  async getIndustries(): Promise<IndustryObject[]> {
    if (!this.industryGroupId) {
      throw new Error('Industry Group ID is required to fetch industries');
    }
    const response = await this.apiRequest<IndustryObject[]>(
      `gics/industry-groups/${this.industryGroupId}/industries`
    );
    return response.data;
  }

  async getSubIndustries(): Promise<SubIndustryObject[]> {
    if (!this.industryId) {
      throw new Error('Industry ID is required to fetch sub-industries');
    }
    const response = await this.apiRequest<SubIndustryObject[]>(
      `gics/industries/${this.industryId}/sub-industries`
    );
    return response.data;
  }

  async getHierarchy(): Promise<SubIndustryHierarchyObject | null> {
    if (!this.id) {
      throw new Error('Sub-Industry ID is required to fetch hierarchy');
    }
    try {
      const response = await this.apiRequest<SubIndustryHierarchyObject>(
        `gics/sub-industries/${this.id}/hierachy`
      );
      this.hierarchy = response.data;
      return this.hierarchy;
    } catch (error) {
      console.error('Error fetching GICS hierarchy:', error);
      return null;
    }
  }
}