<template>
   <q-tabs
      v-if="currentTabs.length > 0"
      v-model="currentTab"
      color="primary"
      :align="'left'"
      active-color="primary"
      active-class="c-bg-primary-lighten"
      indicator-color="primary"
      :class="{ 'q-pl-md': !isMobile }"
    >
      <q-tab
        v-for="tab in currentTabs"
        :key="tab.name"
        :name="tab.name"
        :label="tab.label"
        @click="handleTabClick(tab.name)"
        class="q-mr-md"
      />
    </q-tabs>
  </template>
  <script lang="ts" setup>    
import { useQuasar } from 'quasar'
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import 'perfect-scrollbar/css/perfect-scrollbar.css'

import { useMainDisplayStore } from '@/src/stores/mainDisplayStore';

const $q = useQuasar();
const mainDisplayStore = useMainDisplayStore();
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

onMounted(() => {
  checkMobileState();
  window.addEventListener('resize', handleResize);
  
  // Set initial tab based on route
  const pathParts = route.path.split('/');
  if (pathParts.length >= 3) {
    currentTab.value = pathParts[2];
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss">

</style>