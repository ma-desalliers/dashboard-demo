import type { productObject } from "./Interface";
import { BaseRepository } from "@/src/repository/BaseRepository";
import { Category } from "../category/Category";
import type { categoryObject } from "../category/Interface";

export class Product extends BaseRepository {
  uuid: string = '';
  clientUuid: string = '';
  name: string = '';
  description: string = '';
  image: string = '';
  imageUrl?: string;
  createdAt: Date = new Date();
  score: number = 1; 
  ctaName: string = ''
  ctaLink: string = ''
  benefits:string = ''
  categories?: Category[]; 

  constructor(productObj: productObject | null) {
    super();
    if (productObj) {
      this.uuid = productObj.uuid;
      this.clientUuid = productObj.clientUuid;
      this.name = productObj.name;
      this.description = productObj.description;
      this.image = productObj.image;
      this.ctaName = productObj.ctaLink;
      this.ctaLink = productObj.ctaLink;
      this.benefits = productObj.benefits;
      this.createdAt = productObj.createdAt || new Date();
    }
  }

  async create(): Promise<Product> {
    const endpoint = 'products';
    const createData = {
      clientUuid: this.clientUuid,
      name: this.name,
      description: this.description,
      image: this.image,
      ctaName: this.ctaLink,
      ctaLink: this.ctaLink,
      benefits:  this.benefits,
      createdAt: this.createdAt
    };

    const result = await this.createRequest<productObject>(endpoint, createData);
    this.uuid = result.uuid;
    return this;
  }

  async update(): Promise<Product> {
    const endpoint = `products/${this.uuid}`;
    const updateData = {
      name: this.name,
      description: this.description,
      image: this.image,
      ctaName: this.ctaLink,
      ctaLink: this.ctaLink,
      benefits:  this.benefits,
    };

    await this.updateRequest<productObject>(endpoint, updateData);
    return this;
  }

  // New methods to handle categories
  async addCategory(categoryUuid: string): Promise<Product> {
    const endpoint = `products/${this.uuid}/categories/${categoryUuid}`;
    await this.createRequest<productObject>(endpoint, {});
    return this;
  }

  async removeCategory(categoryUuid: string): Promise<Product> {
    const endpoint = `products/${this.uuid}/categories/${categoryUuid}`;
    try {
      await this.apiRequest(endpoint, {
        method: 'DELETE'
      });
      return this;
    } catch (error) {
      console.error('Error removing category:', error);
      throw error;
    }
  }

  // Optional: Helper method to get categories if you need it
  public async getCategories(page = 1, limit = 10, filters: {  depth?:number } = {}){
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...( { 'filters[productUuid]': this.uuid }),
        ...(filters.depth != null && { 'filters[depth]': filters.depth.toString() }),
      });
      const response = await this.apiRequest<categoryObject[]>(
        `categories?${params.toString()}`
      );
      
      this.categories = response.data.map(category => new Category(category));
      return this.categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
}