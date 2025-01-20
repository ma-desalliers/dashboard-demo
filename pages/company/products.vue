<template>
  <products></products>
</template>
<script lang="ts" setup>
import products from '@/src/components/company/products/products.vue'
import { useMainDisplayStore } from '~/src/stores/mainDisplayStore';
import seoMenu from '~/src/asset/menu/seo';
const mainDisplayStore = useMainDisplayStore()

onMounted(()=>{
  const test=  seoMenu()
  console.log(test)
mainDisplayStore.setContextMenu(seoMenu())

})

</script>