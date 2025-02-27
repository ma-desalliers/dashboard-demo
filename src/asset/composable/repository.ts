import { useNotificationStore } from '@/src/stores/notificationStore';
import { useAuthStore } from '@/src/stores/authStore';
import { useCompanyStore } from '@/src/stores/companyStore';
import { ref } from 'vue';

// Types
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

export interface JobResponse {
  jobId: number;
}

interface RequestOptions {
  method?: string;
  version?: string;
  body?: any;
  headers?: Record<string, string>;
  paginated?: boolean;
  signal?: AbortSignal;
}

export function useRepository(version: string = '1') {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase;
  const notificationStore = useNotificationStore();
  const companyStore = useCompanyStore();
  const authStore = useAuthStore();
  const createRequest = async <T>(
    endpoint: string, 
    data: Partial<T>, 
    notificationMessage = 'Create Successful'
  ): Promise<T> => {
    const result = await apiRequest<T>(endpoint, {
      method: 'POST',
      body: data
    });

    if (result.status === 200) {
      notificationStore.showSuccess(notificationMessage);
    }

    return result.data;
  };

  const updateRequest = async <T>(
    endpoint: string, 
    data: Partial<T>, 
    notificationMessage = 'Update Successful'
  ): Promise<T> => {
    const result = await apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data
    });

    if (result.status === 200) {
      notificationStore.showSuccess(notificationMessage);
    }

    return result.data;
  };

  const jobRequest = async <T extends JobResponse>(
    endpoint: string,
    data: any,
    notificationMessage = 'Job started successfully'
  ): Promise<T | false> => {
    const response = await apiRequest<T>(endpoint, {
      method: 'POST',
      body: data
    });

    if (response.status === 200) {
      notificationStore.showSuccess(notificationMessage);
      return response.data;
    }
    return false;
  };

  const apiRequest = async <T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T> | PaginatedResponse<T>> => {
    const {
      method = 'GET',
      version: requestVersion = version,
      body,
      headers = {},
      paginated = false,
      signal
    } = options;

    try {
      // Handle client UUID injection
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

      // Prepare headers
      const requestHeaders = {
        'Content-Type': 'application/json',
        ...headers
      };

      if (authStore.token) {
        requestHeaders['Authorization'] = `Bearer ${authStore.token}`;
      }

      // Prepare URL and request options
      const url = `${baseUrl}/api/v${requestVersion}/demo/${modifiedEndpoint.replace(/^\//, '')}`;
      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
        signal,
        ...(modifiedBody && { body: JSON.stringify(modifiedBody) })
      };

      // Make request
      const response = await fetch(url, requestOptions);
      const result = await response.json();

      if (!response.ok) {
        notificationStore.showError(`ERROR : ${response.status}`);
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      // Handle paginated response
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

      // Handle regular response
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
  };

  // Return all the functions and any reactive state if needed
  return {
    createRequest,
    updateRequest,
    jobRequest,
    apiRequest
  };
}