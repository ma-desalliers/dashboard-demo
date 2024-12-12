<template>
  <div class="q-pa-md">
    <span>hello HelloWorld !! </span>

    <q-btn color="positive" label="Click-Me" @click="showMessage"></q-btn>
  </div>
</template>
<script setup lang="ts" >
import {useNotificationStore} from '../../stores/notificationStore';
const notification = useNotificationStore()
const showMessage = ()=>{
notification.showSuccess('WOW YOU CLICKED')
}
</script>