<template>
  <component :is="currentLayout">
    <NuxtPage />
    <GlobalPopup />
  </component>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useNotificationStore } from '@/src/stores/notificationStore';
import { onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import BaseLayout from '@/src/layout/BaseLayout.vue';
import CalculatorLayout from '@/src/layout/CalculatorLayout.vue';
import company from './src/repository/client';
import { useMainDisplayStore } from './src/stores/mainDisplayStore';

const route = useRoute();
const $q = useQuasar();
const mainDisplayStore = useMainDisplayStore();

const currentLayout = computed(() => {
  return route.path.startsWith('/calculator') ? CalculatorLayout : BaseLayout;
});

const notifyUser = (message) => {
  $q.notify({
    message: message
  });
}

const checkMobileState = () => {
  mainDisplayStore.setMobile(window.innerWidth < 1000);
}

const handleResize = () => {
  checkMobileState();
}

onMounted(() => {
  const notificationStore = useNotificationStore();
  checkMobileState();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss">
@import url('src/styles/style.css');
@import "/node_modules/flag-icons/css/flag-icons.min.css";
</style>