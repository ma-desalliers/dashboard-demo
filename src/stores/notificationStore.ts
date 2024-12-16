import { defineStore } from 'pinia';
import { useQuasar } from 'quasar'

export const useNotificationStore = defineStore('notification', {
  actions: {
    showSuccess(message: string) {
      console.log(`sup`)
      Notify.create({
        type: 'positive',
        message,
      });
    },

    showBasic(message: any) {
      console.log(`sup`)
      Notify.create(message);
    },
    showError(message: string) {
      console.log(`sup`)
      Notify.create({
        type: 'negative',
        message,
      });
    },
  },
});
