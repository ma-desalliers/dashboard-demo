<template>
  <products></products>
</template>
<script lang="ts" setup>
import products from '@/src/components/company/products/products.vue'
import { useMainDisplayStore } from '~/src/stores/mainDisplayStore';
import companyMenu from '~/src/asset/menu/company';
const mainDisplayStore = useMainDisplayStore()

onMounted(()=>{
  const test=  companyMenu()
  console.log(test)
mainDisplayStore.setContextMenu(companyMenu())

})

</script>