import { defineStore } from 'pinia';
import { Client } from '@/src/repository/client/Client';
import type { clientObject } from '@/src/repository/client/Interface';
import type { PaginationMeta } from '@/src/repository/BaseRepository';

export const useClientStore = defineStore('clientStore', {
  state: () => ({
    clients: [] as clientObject[],
    theClient:{} as Client,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10
    } as PaginationMeta,
    loading: false
  }),

  actions: {
    async fetchClients(page = 1, limit = 10, filter:{search:string}) {
      this.loading = true;
      try {
        const result = await Client.getList(page, limit, filter);

        console.log(result)
        
        this.clients = result.data.map((client: any) => ({
          uuid: client.uuid,
          name: client.name,
          status: 'Prospects'
        }));
        this.pagination = result.pagination;
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    addClient(client: Client) {
      this.clients.push(client);
    },

    setClient(client:Client){

      this.theClient = client
    }
  },

  getters: {
    getClientById: (state) => (id: string) => {
      return state.clients.find(client => client.uuid === id);
    },
    isFirstPage: (state) => state.pagination.currentPage === 1,
    isLastPage: (state) => state.pagination.currentPage === state.pagination.totalPages
  }
});