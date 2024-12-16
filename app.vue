<template>
  <BaseLayout>
    <NuxtPage />
    <GlobalPopup></GlobalPopup>
  </BaseLayout>
</template>

<script setup>    
import { useQuasar } from 'quasar'
import { useNotificationStore } from '@/src/stores/notificationStore';
import { onMounted } from 'vue';
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import BaseLayout from '@/src/layout/BaseLayout.vue';
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