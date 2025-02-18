<template>
  <component :is="layout">
    <NuxtPage />
  </component>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { useNotificationStore } from '@/src/stores/notificationStore';
import { onMounted, onBeforeUnmount, computed } from 'vue';
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore';
import { useCompanyStore } from '@/src/stores/companyStore';
import { useAuthStore } from '@/src/stores/authStore';
// Import layouts from src/layouts
// At the top of your App.vue
import DefaultLayout from '@/src/layouts/Default.vue'
import GuestLayout from '@/src/layouts/Guest.vue'

const mainDisplayStore = useMainDisplayStore();
const companyStore = useCompanyStore()
const authStore = useAuthStore();


// Then instead of defineNuxtLayout, use defineComponent with <component>
  const layout = computed(() => 
  authStore.isAuthenticated ? DefaultLayout : GuestLayout
);

const theCompany = computed(()=> companyStore.theCompany)

provide<string>('companyUuid', theCompany.value.uuid)
// Function to check and update mobile state
const checkMobileState = () => {
  mainDisplayStore.setMobile(window.innerWidth < 1000);
};

// Handle window resize
const handleResize = () => {
  checkMobileState();
};

const { $i18n } = useNuxtApp();
$i18n.setLocale('fr');

onMounted(async () => {
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