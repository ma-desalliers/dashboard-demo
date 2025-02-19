<!-- layouts/default.vue -->
<template>
  <BaseLayout :style="`--q-company-color:${theCompany?.style?.primaryColor}`">
    <ContextMenu />
    <slot />
    <GlobalPopup />
  </BaseLayout>
</template>

<script setup lang="ts">
import { useCompanyStore } from '@/src/stores/companyStore';
import BaseLayout from './BaseLayout.vue';
const companyStore = useCompanyStore();
const theCompany = computed(() => companyStore.theCompany);

</script>