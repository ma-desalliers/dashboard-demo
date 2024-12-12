import type { categoryObject } from "@/src/repository/category/Interface";
import type { PaginatedResponse } from "@/src/repository/BaseRepository";
import { BaseRepository } from "@/src/repository/BaseRepository";

export class Category extends BaseRepository {
  uuid: string = '';
  clientUuid: string = '';
  name: string = '';
  description: string = '';
  parentUuid: string | null = null;
  createdAt: Date = new Date();

  subCategories?: Category[]

  constructor(categoryObj: categoryObject | null) {
    super();
    if (categoryObj) {
      this.uuid = categoryObj.uuid;
      this.clientUuid = categoryObj.clientUuid;
      this.name = categoryObj.name;
      this.description = categoryObj.description;
      this.parentUuid = categoryObj.parentUuid;
      this.createdAt = categoryObj.createdAt || new Date();
    }
  }

  public static async getByUuid(uuid: string): Promise<Category> {
    const instance = new Category(null);
    try {
      const response = await instance.apiRequest<categoryObject>(
        `categories/${uuid}`
      );
      return new Category(response.data);
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  async create(): Promise<categoryObject> {
    const endpoint = 'categories';
    const createData = {
      clientUuid: this.clientUuid,
      name: this.name,
      description: this.description,
      parentUuid: this.parentUuid,
    };

    const result = await this.createRequest<categoryObject>(endpoint, createData);
    this.uuid = result.uuid;
    return result;
  }

  async update(): Promise<categoryObject> {
    const endpoint = `categories/${this.uuid}`;
    const updateData = {
      name: this.name,
      description: this.description,
      parentUuid: this.parentUuid
    };

    return await this.updateRequest<categoryObject>(endpoint, updateData);
  }

  public async getList(page = 1, limit = 10): Promise<Category[]> {
    const instance = new Category(null);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      'filters[clientUuid]': this.clientUuid,
      'filters[depth]': '1',
      'filters[parentUuid]': this.uuid
    });

    const response = await instance.apiRequest<categoryObject[]>(
      `categories?${params.toString()}`,
      { paginated: true }
    );
    this.subCategories = response.data.map(category => new Category(category))

    return this.subCategories
  }
  
  public async getHierarchy(): Promise<categoryObject[]> {
    try {
      const response = await this.apiRequest<categoryObject[]>(
        `categories/${this.uuid}/hierarchy`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching category hierarchy:', error);
      throw error;
    }
  }

  public async validateParentCategory(): Promise<boolean> {
    if (!this.parentUuid) return true;
    try {
      const parent = await Category.getByUuid(this.parentUuid);
      return parent.parentUuid === null;
    } catch (error) {
      return false;
    }
  }
}
