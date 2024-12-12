// stores/types.ts
export interface StoreState {
  data: Record<string, any>;
  lastSync: Date | null;
}

// stores/main-store.ts
import { defineStore } from 'pinia';


export const useLocalStorageStore = defineStore('useLocalStorageStore', {
  state: (): StoreState => ({
    data: {},
    lastSync: null,
  }),

  getters: {
    getData: (state: StoreState): Record<string, any> => state.data,
    getLastSync: (state: StoreState): Date | null => state.lastSync,
  },

  actions: {
    initializeFromStorage(): void {
      const storedData = localStorage.getItem('store_data');
      const storedSync = localStorage.getItem('store_last_sync');
      
      if (storedData) {
        this.data = JSON.parse(storedData);
      }
      if (storedSync) {
        this.lastSync = new Date(storedSync);
      }
    },

    saveToStorage(): void {
      console.log(this.data)
      localStorage.setItem('store_data', JSON.stringify(this.data));
      localStorage.setItem('store_last_sync', this.lastSync?.toISOString() || '');
    },

    setData(newData: Record<string, any>): void {
      this.data = newData;
      this.lastSync = new Date();
      this.saveToStorage();
    },

    updateField(path: string, value: any): void {
      const fields = path.split('.');
      let current = this.data;
      
      for (let i = 0; i < fields.length - 1; i++) {
        if (!current[fields[i]]) {
          current[fields[i]] = {};
        }
        current = current[fields[i]];
      }
      
      current[fields[fields.length - 1]] = value;
      this.lastSync = new Date();
      this.saveToStorage();
    },

    clearData(): void {
      this.data = {};
      this.lastSync = null;
      localStorage.removeItem('store_data');
      localStorage.removeItem('store_last_sync');
    }
  },
});

