import { useNotificationStore } from '@/src/stores/notificationStore';
import { useAuthStore } from '@/src/stores/authStore';
import { useCompanyStore } from '@/src/stores/companyStore'; 

interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

 export interface PaginatedResponse<T> {
  data: T;
  pagination: PaginationMeta;
  status: number;
}

export interface JobResponse{
  jobId: number
} 


export class BaseRepository {
  public config = useRuntimeConfig();
  public baseUrl: string;
  public version: string = '1';
  notificationStore: ReturnType<typeof useNotificationStore>;

  constructor() {
    this.baseUrl = this.config.public.apiBase;
    this.notificationStore = useNotificationStore();
  }

  public async createRequest<T>(endpoint: string, data: Partial<T>,notificationMesage = 'Create Successful' ): Promise<T> {
    const result: ApiResponse<T> = await this.apiRequest<T>(endpoint, {
      method: 'POST',
      body: data
    });
  
    if(result.status == 200){
      this.notificationStore.showSuccess(notificationMesage)
    }
  
    return result.data;
  }

  public async updateRequest<T>(endpoint: string, data: Partial<T>, notificationMesage = 'Update Successful' ): Promise<T> {
    const result: ApiResponse<T> = await this.apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data
    });

    if(result.status == 200){
      this.notificationStore.showSuccess(notificationMesage)
    }

    return result.data;
  }

  public async jobRequest<JobResponse>(endpoint:string, data:any, notificationMessage = 'Job started successfuly'): Promise<any>{
    const response = await this.apiRequest<JobResponse>(
      endpoint,
      {
        method: 'POST',
        body: data
      }
    );

    if (response.status == 200) {
      this.notificationStore.showSuccess(notificationMessage);
      return response.data
    }
    return false
  }

  public async apiRequest<T>(
    endpoint: string,
    options: {
      method?: string;
      version?: string;
      body?: any;
      headers?: Record<string, string>;
      paginated?: boolean;
      signal?: AbortSignal;
    } = {}
  ): Promise<ApiResponse<T> | PaginatedResponse<T>> {
    const { paginated = false, ...restOptions } = options;
    const notificationStore = useNotificationStore();
    const companyStore = useCompanyStore(); // Add this line
    const {
      method = 'GET',
      version = this.version,
      body,
      headers = {},
    } = options;

    try {
      const authStore = useAuthStore();
      const url = `${this.baseUrl}/api/v${version}/${endpoint.replace(/^\//, '')}`;
      
      // Add client UUID check and injection logic
      const hasClientUuid = (
        endpoint.includes('clientUuid=') || 
        endpoint.includes('filters[clientUuid]=') ||
        (body && body.clientUuid)
      );

      let modifiedBody = body;
      let modifiedEndpoint = endpoint;

      if (!hasClientUuid && companyStore.theCompany?.uuid) {
        if (method === 'GET') {
          const separator = endpoint.includes('?') ? '&' : '?';
          modifiedEndpoint = `${endpoint}${separator}clientUuid=${companyStore.theCompany.uuid}`;
        } else {
          modifiedBody = {
            ...body,
            clientUuid: companyStore.theCompany.uuid
          };
        }
      }
      
      if (authStore != null && authStore.token != null) {
        headers['Authorization'] = `Bearer ${authStore.token}`;
      }
      
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        signal: restOptions.signal,
        ...(modifiedBody && { body: JSON.stringify(modifiedBody) }),
      };

      const response = await fetch(url.replace(endpoint, modifiedEndpoint), requestOptions);
      const result = await response.json();

      // Rest of the function remains the same...
      if (!response.ok) {
        notificationStore.showError(`ERROR : ${response.status}`)
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      if (paginated) {
        return {
          data: result.data,
          pagination: {
            currentPage: result.pagination.currentPage,
            totalPages: result.pagination.totalPages,
            totalItems: result.pagination.totalItems,
            itemsPerPage: result.pagination.itemsPerPage
          },
          status: result.status
        };
      }
  
      return {
        data: result.data,
        status: response.status
      };
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      notificationStore.showError(`API Request Error for ${endpoint}: ${errorMessage}`);
      console.error(`API Request Error for ${endpoint}:`, error);
      throw error;
    }
  }
}
