<template>
  <BaseLayout>
    <NuxtPage />
    <GlobalPopup></GlobalPopup>
  </BaseLayout>
</template>

<script setup>    
import { useQuasar } from 'quasar'
import { useNotificationStore } from '@/src/stores/notificationStore';
import { onMounted, onBeforeUnmount } from 'vue';
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import BaseLayout from '@/src/layout/BaseLayout.vue';

import { useMainDisplayStore } from './src/stores/mainDisplayStore';
const $q = useQuasar();
const mainDisplayStore = useMainDisplayStore();

const notifyUser = (message) => {
  $q.notify({
    message: message
  });
}

// Function to check and update mobile state
const checkMobileState = () => {
  mainDisplayStore.setMobile(window.innerWidth < 1000);
}

// Handle window resize
const handleResize = () => {
  checkMobileState();
}

onMounted(() => {
  const notificationStore = useNotificationStore();
  
  // Initial check for mobile state
  checkMobileState();
  
  // Add resize event listener
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  // Clean up event listener
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss">
@import url('src/styles/style.css');
@import "/node_modules/flag-icons/css/flag-icons.min.css";
</style>