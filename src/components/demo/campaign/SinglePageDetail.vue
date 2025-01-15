<template>
  <div class="row c-full-height">
    <div v-if="!isMobile"
      class="c-page-detail-container c-border-right">
      <PageDetail></PageDetail>
    </div>
    <div class="c-page-container">
      <PageViewer :is-side-panel="isMobile"></PageViewer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PageDetail from './PageDetail.vue'
import PageViewer from './PageViewer.vue'

import { useMainDisplayStore } from '~/src/stores/mainDisplayStore';
const mainDisplayStore = useMainDisplayStore()

const isMobile = computed(() => mainDisplayStore.isMobile)
</script>

<style>
.c-page-container{
  width: 60%;
  min-width:60%;
  flex: 2;
}

.c-page-detail-container{
  width:40%;
  max-width: 500px;
}
</style>
