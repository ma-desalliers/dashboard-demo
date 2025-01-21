<template>
  <products></products>
</template>
<script lang="ts" setup>
import products from '@/src/components/company/products/products.vue'
import { useMainDisplayStore } from '~/src/stores/mainDisplayStore';
import companyMenu from '~/src/asset/menu/company';
import { useCompanyStore } from '~/src/stores/companyStore';

definePageMeta({
  middleware: ['auth', 'company']
})

const mainDisplayStore = useMainDisplayStore()
const companyStore = useCompanyStore();

onMounted(()=>{
  const companyUuid = companyStore.theCompany.uuid
  mainDisplayStore.setContextMenu(companyMenu(companyUuid))
})

</script>