<template>
  <div>
    <Header></Header> 
    <div>
      <NuxtPage />
    </div>
    <GlobalPopup></GlobalPopup>
  </div>
</template>

<script setup>
import Header from './src/components/Header.vue';
import { useQuasar } from 'quasar'
import { useNotificationStore } from '@/src/stores/notificationStore';
import { onMounted } from 'vue';
import 'perfect-scrollbar/css/perfect-scrollbar.css'

const $q = useQuasar();
const notifyUser = (message) => {
  $q.notify({
    message: message
  });
}

onMounted(() => {
  const notificationStore = useNotificationStore();
 // notificationStore.setNotification(notifyUser);
});
</script>

<style lang="scss">
@import url('src/styles/style.css');
@import "/node_modules/flag-icons/css/flag-icons.min.css";
</style>