<template>
  <BaseLayout :style="`--q-primary:${theCompany.primaryColor}`">
    <ContextMenu></ContextMenu>
    <NuxtPage />
    <GlobalPopup />
  </BaseLayout>
</template>

<script lang="ts" setup>    
import { useQuasar } from 'quasar'
import { useNotificationStore } from '@/src/stores/notificationStore';
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import BaseLayout from '@/src/layout/BaseLayout.vue';
import ContextMenu from '@/src/layout/ContextMenu.vue';

import { useMainDisplayStore } from '@/src/stores/mainDisplayStore';
import { useCompanyStore } from '@/src/stores/companyStore';

const $q = useQuasar();
const mainDisplayStore = useMainDisplayStore();
const companyStore = useCompanyStore();
const router = useRouter();
const route = useRoute();

const currentTab = ref('products');
const isMobile = computed(() => mainDisplayStore.isMobile);

const tabConfigurations = [
  {
    route: 'marketing',
    tabs: [
      { name: 'products', label: 'Products', path: '/marketing/products' },
      { name: 'audiences', label: 'Audiences', path: '/marketing/audiences' },
      { name: 'pages', label: 'Contents', path: '/marketing/pages' },
      { name: 'landing', label: 'Landing Page', path: '/marketing/landing' }
    ]
  }
];

const currentTabs = computed(() => {
  const baseRoute = route.path.split('/')[1];
  const config = tabConfigurations.find(config => config.route === baseRoute);
  return config?.tabs || [];
});

const theCompany = computed(() => companyStore.theCompany);

const handleTabClick = async (tabName: string) => {
  const tab = currentTabs.value.find(t => t.name === tabName);
  if (tab) {
    try {
      await navigateTo(tab.path);
      currentTab.value = tabName;
    } catch (error) {
      console.error('Navigation error:', error);
      $q.notify({
        type: 'negative',
        message: 'Navigation failed'
      });
    }
  }
};

// Function to check and update mobile state
const checkMobileState = () => {
  mainDisplayStore.setMobile(window.innerWidth < 1000);
};

// Handle window resize
const handleResize = () => {
  checkMobileState();
};

const { $i18n } = useNuxtApp()
$i18n.setLocale('fr')

onMounted(async () => {
  checkMobileState();
  window.addEventListener('resize', handleResize);
  
  // Set initial tab based on route
  const pathParts = route.path.split('/');
  if (pathParts.length >= 3) {
    currentTab.value = pathParts[2];
  }

  await companyStore.init();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss">
@import url('src/styles/style.css');
@import "/node_modules/flag-icons/css/flag-icons.min.css";
</style>