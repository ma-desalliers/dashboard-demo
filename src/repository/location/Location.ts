import type { CountryObject, StateObject, CityObject } from '@/src/repository/location/Interface';
import { BaseRepository } from '@/src/repository/BaseRepository';

export class Location extends BaseRepository {
  // Properties for storing location data
  countries: CountryObject[] = [];
  states: StateObject[] = [];
  cities: CityObject[] = [];
  
  constructor() {
    super();
  }
  
  /**
  * Fetch all countries
  */
  async getAllCountries(): Promise<CountryObject[]> {
    try {
      const response = await this.apiRequest<CountryObject[]>('countries');
      this.countries = response.data;
      return this.countries;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }
  
  /**
  * Fetch states for a specific country
  * @param countryId - The ID of the country
  */
  async getStatesByCountry(countryId: number): Promise<StateObject[]> {
    try {
      const response = await this.apiRequest<StateObject[]>(
        `countries/${countryId}/states`
      );
      this.states = response.data;
      return this.states;
    } catch (error) {
      console.error(`Error fetching states for country ${countryId}:`, error);
      throw error;
    }
  }
  
  /**
  * Fetch cities for a specific state
  * @param stateId - The ID of the state
  */
  async getCitiesByState(stateId: number): Promise<CityObject[]> {
    try {
      const response = await this.apiRequest<CityObject[]>(
        `states/${stateId}/cities`
      );
      this.cities = response.data;
      return this.cities;
    } catch (error) {
      console.error(`Error fetching cities for state ${stateId}:`, error);
      throw error;
    }
  }
  
  /**
  * Get a country by its ID from the cached countries
  * @param countryId - The ID of the country
  */
  getCountryById(countryId: number): CountryObject | undefined {
    return this.countries.find(country => country.id === countryId);
  }
  
  /**
  * Get a state by its ID from the cached states
  * @param stateId - The ID of the state
  */
  getStateById(stateId: number): StateObject | undefined {
    return this.states.find(state => state.id === stateId);
  }
  
  /**
  * Get a city by its ID from the cached cities
  * @param cityId - The ID of the city
  */
  getCityById(cityId: number): CityObject | undefined {
    return this.cities.find(city => city.id === cityId);
  }
}