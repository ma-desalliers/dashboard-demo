<!-- layouts/default.vue -->
<template>
  <BaseLayout :style="`--q-primary:${theCompany?.style?.primaryColor}`">
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

onMounted(async () => {
	await companyStore.init();
	await companyStore.current(companyStore.companies[0].uuid);
});

</script>