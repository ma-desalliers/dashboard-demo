<template>
  <div class="row">

      <CampaignViewer class="full-width"></CampaignViewer>
    
  </div>
</template>
<script setup lang="ts" >
import {useNotificationStore} from '../../stores/notificationStore';

import CampaignViewer from './CampaignViewer.vue';
import SalesDisplay from './SalesDisplay.vue';
import Pricing from './Pricing.vue'
const notification = useNotificationStore()




const showMessage = ()=>{
notification.showSuccess('WOW YOU CLICKED')
}
</script>


<style>
.c-right-main-column{
  width:calc(100% - 300px);
  overflow: auto;
}
</style>