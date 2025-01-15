<template>
  <div class="row c-full-height">
<div
  v-if="!isMobile"
  class="c-page-detail-container c-border-right"
>
  <AudienceDetail></AudienceDetail>
</div>
<div class="c-page-container">
  <PageCards @select-page="(page:any) => selectPage(page)"></PageCards>
</div></div>
<div>
<PageViewer :is-side-panel="true"></PageViewer>
</div>
</template>
<script lang="ts" setup>
import AudienceDetail from './AudienceDetail.vue'
import PageCards from '../PageCards.vue'

import { useMainDisplayStore } from '~/src/stores/mainDisplayStore';
import PageViewer from '../PageViewer.vue';
const mainDisplayStore = useMainDisplayStore()

const emit = defineEmits(['selectPage'])

const isMobile = computed(() => mainDisplayStore.isMobile)

const selectPage = (page:any)=>{
  console.log('selectingpage', page)
  emit('selectPage',page)
}

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