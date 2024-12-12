import type { clientObject } from './Interface';
import type { stylePreferences } from './Interface';
import type { bioObject } from './Interface' 
import type { marketObject } from '../market/Interface';
import type { productObject } from '../product/Interface';
import type { personaObject } from '../persona/Interface';
import type { pageObject } from '../pages/Interface';
import type { categoryObject } from '../category/Interface';
import type { PaginatedResponse } from '../BaseRepository';

import { BaseRepository } from '../BaseRepository';
import { Pages } from '../pages/Page';
import { Product } from '../product/Product';
import { Persona } from '../persona/Persona';
import { Market } from '../market/Market'
import { Category } from '../category/Category';
import { MarketRecurrence } from '../marketRecurrence/MarketRecurrence';
import type { marketRecurrenceObject } from '../marketRecurrence/Interface';
export class Client extends BaseRepository {
  uuid: string = '';
  name: string = '';
  status: string = '';

  markets?: Market[];
  pages?: Pages[] | null;
  products?: Product[] | null;
  personas?: Persona[] | null;
  categories?: Category[];
  subCategories?:Category[];
  campaigns?:MarketRecurrence[]

  style?:stylePreferences
  bio?:bioObject

  testClientId: string = '94f22895-0ddc-4e07-bb2e-efd48b366114';

  public override version: string = '1'; 
  
  constructor(clientobj: clientObject | null) {
    super();
    
    if (clientobj) {
      this.uuid = clientobj.uuid;
      this.name = clientobj.name;
      this.status = clientobj.status;
    }
  }

  async create(): Promise<clientObject> {
    const endpoint = 'clients';
    const createData = {
      name: this.name,
      status: this.status
    };
    
    return this.createRequest<clientObject>(endpoint, createData);
   }

   static async getList(page = 1, limit = 10, filter:{search:string}): Promise<PaginatedResponse<clientObject[]>> {
    const repository = new Client(null);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      'filters[clientName]':filter.search
    });
    
    return repository.apiRequest<clientObject[]>(`clients?${params.toString()}`, {
      paginated: true,
      version: '1'
    }) as Promise<PaginatedResponse<clientObject[]>>;
  }
  
  public async getMarkets() {
    if (!this.markets?.length) {
      try {
        const response = await this.apiRequest<marketObject[]>(
          `clients/${this.uuid}/markets`
        );
        this.markets = response.data.map(market => new Market(market));
        return this.markets;
      } catch (error) {
        console.error('Error fetching markets:', error);
        throw error;
      }
    }
    return this.markets;
  }

  public async getProducts() {
    if (!this.products?.length) {
      try {
        // Example of using a different version for a specific endpoint
        const response = await this.apiRequest<productObject[]>(
          `clients/${this.uuid}/products` // Override version for this specific call
        );
        this.products = response.data.map( product=> new Product(product));
        return this.products;
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    }
    return this.products;
  }

  public async getPages(page = 1, limit = 10, filter:{generatedOnly:boolean|null}): Promise<PaginatedResponse<Pages[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      'filters[clientUuid]': this.uuid,
      ...(filter.generatedOnly !== null && {
        'filters[hasContent]': String(filter.generatedOnly)
      })
     });

  
    try {
      const response = await this.apiRequest<pageObject[]>(
        `/pages?${params.toString()}`,
        { paginated: true }
      );
      
      const pages = response.data.map((page: pageObject) => new Pages(page));
      return { ...response, data: pages } as PaginatedResponse<Pages[]>;
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
  }


  public async getPersonas() {
    if (!this.personas?.length) {
      try {
        const response = await this.apiRequest<personaObject[]>(
          `clients/${this.uuid}/personas`
        );
        this.personas = response.data.map(persona=> new Persona(persona));
        return this.personas;
      } catch (error) {
        console.error('Error fetching personas:', error);
        throw error;
      }
    }
    return this.personas;
  }

  public async getStyle(){
    if (!this.style) {
      try {
        const response = await this.apiRequest<stylePreferences>(
          `clients/${this.uuid}/styles`
        );
        this.style = response.data
        return this.style;
      } catch (error) {
        console.error('Error fetching personas:', error);
        throw error;
      }
    }
    return this.style;
  }

  public async updateStyle(color: string, favicon:string): Promise<stylePreferences> {
    const endpoint = `clients/${this.uuid}/styles`;

    if(!this.style){
      this.style = {
        clientUuid:this.uuid,
        primaryColor: color,
        favicon:favicon
      }
    }
    else{
      this.style.primaryColor = color
      this.style.favicon = favicon 
    }

    const payload = {
      styles:this.style
    }

    try {
      const updatedStyle = await this.updateRequest<{styles:stylePreferences}>(endpoint, payload);
      this.style = updatedStyle.styles;
      return this.style;
    } catch (error) {
      console.error('Error updating style preferences:', error);
      throw error;
    }
  }

  public async createStyle(): Promise<void> {
    const endpoint = `clients/${this.uuid}/styles`;
    try {
       await this.createRequest<{uuid:string}>(endpoint, {uuid:this.uuid});
     
    } catch (error) {
      console.error('Error updating style preferences:', error);
      throw error;
    }
  }

  public async getBio(){
    if (!this.bio) {
      try {
        const response = await this.apiRequest<bioObject>(
          `clients/${this.uuid}/bio`
        );
        this.bio = response.data
        return this.bio;
      } catch (error) {
        console.error('Error fetching personas:', error);
        throw error;
      }
    }
    return this.bio;
  }

  public async createBio(){
    if(!this.bio) return
    
    const endpoint = `clients/${this.uuid}/bio`;

    this.bio =  await this.createRequest<bioObject>(endpoint, this.bio);
  }

  public async getCategories(page = 1, limit = 10, filters: {  depth?:number } = {}){
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...( { 'filters[clientUuid]': this.uuid }),
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

  public async getCampaigns(page = 1, limit = 10, filters: {states?:string[]} = {}){
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...( { 'filters[clientUuid]': this.uuid }),
        ...(filters.states?.length && { 'filters[state]': JSON.stringify(filters.states) }),
      });
      const response = await this.apiRequest<marketRecurrenceObject[]>(
        `campaigns?${params.toString()}`
      );
      
      this.campaigns = response.data.map(campaign => new MarketRecurrence(campaign));
      return this.categories;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  public addCategory(category: Category) {
    this.categories = this.categories || [];
    this.categories.push(category);
  }

  public addPersona(persona:Persona){
    this.personas?.push(persona)
  }

  public addProduct(product:Product){
    this.products?.push(product)
  }

  public addmarkets(market:Market){
    this.markets?.push(market)
  }

  
}
