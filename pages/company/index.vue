<template>
  <!-- This page doesn't render any content as it immediately redirects -->
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useCompanyStore } from '@/src/stores/companyStore';
import { onMounted } from 'vue';

const router = useRouter();
const companyStore = useCompanyStore();

onMounted(async () => {
  await companyStore.init();

  let targetCompanyUuid = companyStore.theCompany.uuid;
  if (!targetCompanyUuid) {
    targetCompanyUuid = companyStore.companies[0].uuid;
    await companyStore.current(targetCompanyUuid);
  }

  const targetUrl = `/company/${targetCompanyUuid}/products`;
  router.replace(targetUrl);
});
</script>
