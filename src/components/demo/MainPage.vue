<template>
  <div class="row">
    <LeftColumn></LeftColumn>
    <div class="right-column-container c-right-main-column"  >
      <CampaignViewer v-if="theCurrentPage == 'CampaignViewer'" class="full-width"></CampaignViewer>
      <SalesDisplay v-if="theCurrentPage == 'SalesDisplay'" class="full-width"></SalesDisplay>
    </div>
  </div>
</template>
<script setup lang="ts" >
import {useNotificationStore} from '../../stores/notificationStore';
import LeftColumn from './LeftColumn.vue';
import CampaignViewer from './CampaignViewer.vue';
import {useDemoCurrentPageStore} from '@/src/stores/demoCurrentPage'
import SalesDisplay from './SalesDisplay.vue';

const notification = useNotificationStore()
const currentPageStore = useDemoCurrentPageStore()

const theCurrentPage = computed(()=> currentPageStore.currentPage) 

const showMessage = ()=>{
notification.showSuccess('WOW YOU CLICKED')
}
</script>


<style>
.c-right-main-column{
  height:calc(100vh - 50px);
  width:calc(100% - 300px);
  overflow: auto;
}
</style>