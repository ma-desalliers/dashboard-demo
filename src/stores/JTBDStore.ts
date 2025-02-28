import { defineStore } from 'pinia'
import type { JTBD, JTBDFilters } from '~/src/repository/jtbdjobs/Interfaces';
import { JTBDRepository } from '~/src/repository/jtbdjobs/Repository';

interface JTBDState {
  jobs: JTBD[];
  subjobs: JTBD[];
  currentJob: JTBD | null;
  loading: boolean;
  currentPage: number;
  currentFilters: JTBDFilters;
  totalPages: number;
  totalRecords: number;
  perPage: number;
}

export const useJTBDStore = defineStore('jtbdStore', {
  state: (): JTBDState => ({
    jobs: [],
    subjobs: [],
    currentJob: null,
    loading: false,
    currentPage: 1,
    currentFilters: {
      clientUuid: ''
    },
    totalPages: 0,
    totalRecords: 0,
    perPage: 10
  }),

  actions: {
    async list(page: number, pageSize: number, filters: JTBDFilters, forceReload = false ) {
      console.log('here',forceReload )
      if (this.currentPage == page && JSON.stringify(this.currentFilters) === JSON.stringify(filters) && !forceReload) {
        return;
      }
      this.loading = true
      try {
        const repository = new JTBDRepository()
        const response = await repository.list(page, pageSize, filters)
        if (filters.parentUuid || filters.isChild) {
          this.subjobs = response.data
        } else {
          this.jobs = response.data
        }
        this.totalRecords = response.pagination.totalItems
        this.totalPages = response.pagination.totalPages
      } catch (error) {
        console.error(error)
        throw error
      } finally {
        this.currentFilters = filters
        this.loading = false
      }
    }
  }
})