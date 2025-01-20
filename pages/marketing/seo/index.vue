<template>
  <seo></seo>
</template>
<script lang="ts" setup>
import seo from '@/src/components/marketing/seo/seo.vue'
import { useMainDisplayStore } from '~/src/stores/mainDisplayStore';
import seoMenu from '~/src/asset/menu/seo';
const mainDisplayStore = useMainDisplayStore()

onMounted(()=>{
  const test=  seoMenu()
  console.log(test)
mainDisplayStore.setContextMenu(seoMenu())

})

</script>