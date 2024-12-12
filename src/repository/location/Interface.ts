export interface CountryObject {
    id: number;
    name: string;
    iso3?: string | null;
    numeric_code?: number | null;
    iso2?: string | null;
    phone_code?: number | null;
    capital?: string | null;
    currency?: string | null;
    currency_name?: string | null;
    currency_symbol?: string | null;
    tld?: string | null;
    native?: string | null;
    region?: string | null;
    region_id?: number | null;
    subregion?: string | null;
    subregion_id?: number | null;
    nationality?: string | null;
    timezones?: Array<{
      zoneName: string;
      gmtOffset: number;
      gmtOffsetName: string;
      abbreviation: string;
      tzName: string;
    }> | null;
    translations?: {
      [key: string]: string;
    } | null;
    latitude?: number | null;
    longitude?: number | null;
    emoji?: string | null;
    emojiU?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    flag?: boolean;
    wikiDataId?: string | null;
  }
  
  export interface StateObject {
    id: number;
    name: string;
    state_code?: string | null;
    country_id: number;
    country_code?: string | null;
    country_name?: string | null;
    type?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }
  
  export interface CityObject {
    id: number;
    name: string;
    state_id: number;
    state_code?: string | null;
    state_name?: string | null;
    country_id: number;
    country_code?: string | null;
    country_name?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    wikiDataId?: string | null;
  }